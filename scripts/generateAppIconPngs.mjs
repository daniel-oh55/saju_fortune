import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const targetManifestPath = path.join(projectRoot, 'public/brand/app-icon-png-targets.json');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c >>> 0;
}

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);

  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);

  return Buffer.concat([length, typeBuffer, data, crc]);
}

function mixColor(colorA, colorB, amount) {
  return colorA.map((channel, index) => Math.round(channel + (colorB[index] - channel) * amount));
}

function smoothstep(edge0, edge1, value) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function roundedRectAlpha(x, y, left, top, right, bottom, radius) {
  const cx = Math.max(left + radius, Math.min(x, right - radius));
  const cy = Math.max(top + radius, Math.min(y, bottom - radius));
  const distance = Math.hypot(x - cx, y - cy);
  return 1 - smoothstep(radius - 1.2, radius + 1.2, distance);
}

function circleAlpha(x, y, cx, cy, radius) {
  return 1 - smoothstep(radius - 1.2, radius + 1.2, Math.hypot(x - cx, y - cy));
}

function blendPixel(pixels, index, color, alpha) {
  if (alpha <= 0) return;

  const sourceAlpha = Math.max(0, Math.min(1, alpha * (color[3] / 255)));
  const targetAlpha = pixels[index + 3] / 255;
  const outAlpha = sourceAlpha + targetAlpha * (1 - sourceAlpha);

  if (outAlpha <= 0) return;

  pixels[index] = Math.round((color[0] * sourceAlpha + pixels[index] * targetAlpha * (1 - sourceAlpha)) / outAlpha);
  pixels[index + 1] = Math.round((color[1] * sourceAlpha + pixels[index + 1] * targetAlpha * (1 - sourceAlpha)) / outAlpha);
  pixels[index + 2] = Math.round((color[2] * sourceAlpha + pixels[index + 2] * targetAlpha * (1 - sourceAlpha)) / outAlpha);
  pixels[index + 3] = Math.round(outAlpha * 255);
}

function renderIcon(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const topColor = [247, 251, 248];
  const bottomColor = [220, 241, 233];
  const teal = [51, 143, 139, 255];
  const deepTeal = [33, 105, 111, 255];
  const leaf = [132, 191, 137, 255];
  const cream = [255, 250, 232, 255];

  for (let y = 0; y < size; y += 1) {
    const vertical = y / Math.max(1, size - 1);
    const bg = mixColor(topColor, bottomColor, vertical);

    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      pixels[index] = bg[0];
      pixels[index + 1] = bg[1];
      pixels[index + 2] = bg[2];
      pixels[index + 3] = 255;
    }
  }

  const pad = size * 0.14;
  const cardAlphaRadius = size * 0.2;
  const card = [255, 255, 250, 230];
  const cardShadow = [49, 108, 116, 45];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const shadowAlpha = roundedRectAlpha(
        x,
        y,
        pad + size * 0.025,
        pad + size * 0.04,
        size - pad + size * 0.025,
        size - pad + size * 0.04,
        cardAlphaRadius,
      );
      blendPixel(pixels, index, cardShadow, shadowAlpha * 0.55);

      const cardAlpha = roundedRectAlpha(x, y, pad, pad, size - pad, size - pad, cardAlphaRadius);
      blendPixel(pixels, index, card, cardAlpha);
    }
  }

  const cx = size / 2;
  const cy = size / 2;
  const ringRadius = size * 0.255;
  const innerRadius = size * 0.18;
  const dotRadius = size * 0.035;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const distance = Math.hypot(x - cx, y - cy);
      const ringAlpha = smoothstep(ringRadius + 1.5, ringRadius - 1.5, distance) * smoothstep(innerRadius - 1.5, innerRadius + 1.5, distance);
      blendPixel(pixels, index, teal, ringAlpha);

      const centerAlpha = circleAlpha(x, y, cx, cy, size * 0.105);
      blendPixel(pixels, index, cream, centerAlpha);

      const leafLeftAlpha = circleAlpha(x, y, cx - size * 0.06, cy + size * 0.01, size * 0.055);
      const leafRightAlpha = circleAlpha(x, y, cx + size * 0.06, cy + size * 0.01, size * 0.055);
      blendPixel(pixels, index, leaf, Math.max(leafLeftAlpha, leafRightAlpha) * 0.9);
    }
  }

  const accentPoints = [
    [0, -0.32],
    [0.28, -0.16],
    [0.28, 0.18],
    [0, 0.34],
    [-0.28, 0.18],
    [-0.28, -0.16],
  ];

  for (const [dx, dy] of accentPoints) {
    const dotCx = cx + dx * size;
    const dotCy = cy + dy * size;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const index = (y * size + x) * 4;
        blendPixel(pixels, index, deepTeal, circleAlpha(x, y, dotCx, dotCy, dotRadius));
      }
    }
  }

  return pixels;
}

function encodePng(width, height, rgbaPixels) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const scanlineLength = width * 4 + 1;
  const raw = Buffer.alloc(scanlineLength * height);
  for (let y = 0; y < height; y += 1) {
    const rawOffset = y * scanlineLength;
    raw[rawOffset] = 0;
    rgbaPixels.copy(raw, rawOffset + 1, y * width * 4, (y + 1) * width * 4);
  }

  return Buffer.concat([
    signature,
    createChunk('IHDR', ihdr),
    createChunk('IDAT', zlib.deflateSync(raw)),
    createChunk('IEND', Buffer.alloc(0)),
  ]);
}

const targetManifest = readJson(targetManifestPath);
const outputs = Array.isArray(targetManifest.outputs) ? targetManifest.outputs : [];

for (const output of outputs) {
  const size = Number(output.size);
  const outputPath = path.join(projectRoot, output.path);
  const pixels = renderIcon(size);
  const png = encodePng(size, size, pixels);

  ensureDirForFile(outputPath);
  fs.writeFileSync(outputPath, png);
  console.log(`generated: ${output.path}`);
}

console.log(`Generated ${outputs.length} app icon PNG files`);
