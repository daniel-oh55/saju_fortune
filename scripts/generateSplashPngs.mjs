import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const targetManifestPath = path.join(projectRoot, 'public/brand/splash-png-targets.json');

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

function circleAlpha(x, y, cx, cy, radius) {
  return 1 - smoothstep(radius - 1.2, radius + 1.2, Math.hypot(x - cx, y - cy));
}

function roundedRectAlpha(x, y, left, top, right, bottom, radius) {
  const cx = Math.max(left + radius, Math.min(x, right - radius));
  const cy = Math.max(top + radius, Math.min(y, bottom - radius));
  const distance = Math.hypot(x - cx, y - cy);
  return 1 - smoothstep(radius - 1.2, radius + 1.2, distance);
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

function renderSplashIcon(width, height) {
  const pixels = Buffer.alloc(width * height * 4);
  const topColor = [247, 251, 248];
  const bottomColor = [220, 241, 233];
  const teal = [51, 143, 139, 255];
  const deepTeal = [33, 105, 111, 255];
  const leaf = [132, 191, 137, 255];
  const cream = [255, 250, 232, 255];

  const cx = width / 2;
  const cy = height / 2;
  const base = Math.min(width, height);
  const ringRadius = base * 0.24;
  const innerRadius = base * 0.17;

  for (let y = 0; y < height; y += 1) {
    const vertical = y / Math.max(1, height - 1);
    const bg = mixColor(topColor, bottomColor, vertical);

    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      pixels[index] = bg[0];
      pixels[index + 1] = bg[1];
      pixels[index + 2] = bg[2];
      pixels[index + 3] = 255;

      const distance = Math.hypot(x - cx, y - cy);
      const ringAlpha =
        smoothstep(ringRadius + 1.5, ringRadius - 1.5, distance) *
        smoothstep(innerRadius - 1.5, innerRadius + 1.5, distance);
      blendPixel(pixels, index, teal, ringAlpha);

      blendPixel(pixels, index, cream, circleAlpha(x, y, cx, cy, base * 0.105));
      blendPixel(pixels, index, leaf, circleAlpha(x, y, cx - base * 0.055, cy + base * 0.01, base * 0.05));
      blendPixel(pixels, index, leaf, circleAlpha(x, y, cx + base * 0.055, cy + base * 0.01, base * 0.05));
    }
  }

  const accentPoints = [
    [0, -0.31],
    [0.27, -0.15],
    [0.27, 0.18],
    [0, 0.33],
    [-0.27, 0.18],
    [-0.27, -0.15],
  ];

  for (const [dx, dy] of accentPoints) {
    const dotCx = cx + dx * base;
    const dotCy = cy + dy * base;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = (y * width + x) * 4;
        blendPixel(pixels, index, deepTeal, circleAlpha(x, y, dotCx, dotCy, base * 0.034));
      }
    }
  }

  return pixels;
}

function renderSplash(width, height, iconOnly = false) {
  if (iconOnly) return renderSplashIcon(width, height);

  const pixels = Buffer.alloc(width * height * 4);
  const topColor = [247, 251, 248];
  const bottomColor = [224, 242, 236];
  const card = [255, 255, 250, 230];
  const shadow = [49, 108, 116, 42];
  const teal = [51, 143, 139, 255];
  const deepTeal = [33, 105, 111, 255];
  const leaf = [132, 191, 137, 255];
  const cream = [255, 250, 232, 255];
  const base = Math.min(width, height);
  const cx = width / 2;
  const cy = height * 0.44;

  for (let y = 0; y < height; y += 1) {
    const vertical = y / Math.max(1, height - 1);
    const bg = mixColor(topColor, bottomColor, vertical);

    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      pixels[index] = bg[0];
      pixels[index + 1] = bg[1];
      pixels[index + 2] = bg[2];
      pixels[index + 3] = 255;

      blendPixel(pixels, index, [255, 255, 255, 46], circleAlpha(x, y, width * 0.2, height * 0.18, base * 0.22));
      blendPixel(pixels, index, [190, 224, 214, 56], circleAlpha(x, y, width * 0.82, height * 0.75, base * 0.24));
    }
  }

  const cardWidth = base * 0.62;
  const cardHeight = base * 0.62;
  const left = cx - cardWidth / 2;
  const top = cy - cardHeight / 2;
  const right = cx + cardWidth / 2;
  const bottom = cy + cardHeight / 2;
  const radius = base * 0.13;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const shadowAlpha = roundedRectAlpha(x, y, left + base * 0.025, top + base * 0.04, right + base * 0.025, bottom + base * 0.04, radius);
      blendPixel(pixels, index, shadow, shadowAlpha * 0.65);

      const cardAlpha = roundedRectAlpha(x, y, left, top, right, bottom, radius);
      blendPixel(pixels, index, card, cardAlpha);
    }
  }

  const ringRadius = base * 0.18;
  const innerRadius = base * 0.12;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      const distance = Math.hypot(x - cx, y - cy);
      const ringAlpha =
        smoothstep(ringRadius + 1.5, ringRadius - 1.5, distance) *
        smoothstep(innerRadius - 1.5, innerRadius + 1.5, distance);
      blendPixel(pixels, index, teal, ringAlpha);

      blendPixel(pixels, index, cream, circleAlpha(x, y, cx, cy, base * 0.075));
      blendPixel(pixels, index, leaf, circleAlpha(x, y, cx - base * 0.04, cy + base * 0.01, base * 0.038));
      blendPixel(pixels, index, leaf, circleAlpha(x, y, cx + base * 0.04, cy + base * 0.01, base * 0.038));
    }
  }

  const accentPoints = [
    [0, -0.225],
    [0.195, -0.11],
    [0.195, 0.13],
    [0, 0.24],
    [-0.195, 0.13],
    [-0.195, -0.11],
  ];

  for (const [dx, dy] of accentPoints) {
    const dotCx = cx + dx * base;
    const dotCy = cy + dy * base;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const index = (y * width + x) * 4;
        blendPixel(pixels, index, deepTeal, circleAlpha(x, y, dotCx, dotCy, base * 0.026));
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
  const width = Number(output.width);
  const height = Number(output.height);
  const outputPath = path.join(projectRoot, output.path);
  const iconOnly = output.path.includes('splash-icon');
  const pixels = renderSplash(width, height, iconOnly);
  const png = encodePng(width, height, pixels);

  ensureDirForFile(outputPath);
  fs.writeFileSync(outputPath, png);
  console.log(`generated: ${output.path}`);
}

console.log(`Generated ${outputs.length} splash PNG files`);
