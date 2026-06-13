import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const targetManifestPath = path.join(projectRoot, 'public/brand/android-adaptive-icon-targets.json');

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

function smoothstep(edge0, edge1, value) {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
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

function mixColor(colorA, colorB, amount) {
  return colorA.map((channel, index) => Math.round(channel + (colorB[index] - channel) * amount));
}

function renderForeground(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const teal = [51, 143, 139, 255];
  const deepTeal = [33, 105, 111, 255];
  const leaf = [132, 191, 137, 255];
  const cream = [255, 250, 232, 255];
  const ringRadius = size * 0.285;
  const innerRadius = size * 0.19;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const distance = Math.hypot(x - cx, y - cy);
      const ringAlpha =
        smoothstep(ringRadius + 1.5, ringRadius - 1.5, distance) *
        smoothstep(innerRadius - 1.5, innerRadius + 1.5, distance);
      blendPixel(pixels, index, teal, ringAlpha);
      blendPixel(pixels, index, cream, circleAlpha(x, y, cx, cy, size * 0.115));
      blendPixel(pixels, index, leaf, circleAlpha(x, y, cx - size * 0.058, cy + size * 0.01, size * 0.052));
      blendPixel(pixels, index, leaf, circleAlpha(x, y, cx + size * 0.058, cy + size * 0.01, size * 0.052));
    }
  }

  const accentPoints = [
    [0, -0.34],
    [0.3, -0.17],
    [0.3, 0.19],
    [0, 0.36],
    [-0.3, 0.19],
    [-0.3, -0.17],
  ];

  for (const [dx, dy] of accentPoints) {
    const dotCx = cx + dx * size;
    const dotCy = cy + dy * size;
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const index = (y * size + x) * 4;
        blendPixel(pixels, index, deepTeal, circleAlpha(x, y, dotCx, dotCy, size * 0.04));
      }
    }
  }

  return pixels;
}

function renderBackground(size) {
  const pixels = Buffer.alloc(size * size * 4);
  const topColor = [247, 251, 248];
  const bottomColor = [218, 239, 232];
  const softTeal = [190, 225, 216, 92];
  const softCream = [255, 255, 250, 92];

  for (let y = 0; y < size; y += 1) {
    const vertical = y / Math.max(1, size - 1);
    const bg = mixColor(topColor, bottomColor, vertical);

    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      pixels[index] = bg[0];
      pixels[index + 1] = bg[1];
      pixels[index + 2] = bg[2];
      pixels[index + 3] = 255;
      blendPixel(pixels, index, softCream, circleAlpha(x, y, size * 0.18, size * 0.22, size * 0.28));
      blendPixel(pixels, index, softTeal, circleAlpha(x, y, size * 0.82, size * 0.78, size * 0.3));
      pixels[index + 3] = 255;
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
  const pixels = output.type === 'background' ? renderBackground(size) : renderForeground(size);
  const png = encodePng(size, size, pixels);

  ensureDirForFile(outputPath);
  fs.writeFileSync(outputPath, png);
  console.log(`generated: ${output.path}`);
}

console.log(`Generated ${outputs.length} Android adaptive icon PNG files`);
