import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const failures = [];
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function readText(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

function logResult(sampleId, isPass) {
  console.log(`sampleId: ${sampleId}`);
  console.log(`result: ${isPass ? 'pass' : 'fail'}`);
  console.log('');
}

function readPng(relativePath) {
  const buffer = fs.readFileSync(path.join(projectRoot, relativePath));
  const hasSignature = buffer.subarray(0, 8).equals(pngSignature);
  const width = hasSignature && buffer.toString('ascii', 12, 16) === 'IHDR' ? buffer.readUInt32BE(16) : null;
  const height = hasSignature && buffer.toString('ascii', 12, 16) === 'IHDR' ? buffer.readUInt32BE(20) : null;
  const idatParts = [];

  let offset = 8;
  while (offset + 12 <= buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;
    if (type === 'IDAT') idatParts.push(buffer.subarray(dataStart, dataEnd));
    offset = dataEnd + 4;
  }

  return {
    hasSignature,
    width,
    height,
    raw: width && height ? zlib.inflateSync(Buffer.concat(idatParts)) : null,
  };
}

function getAlphaStats(png) {
  if (!png.raw || !png.width || !png.height) return { transparent: 0, visible: 0, opaque: 0, total: 0 };

  let transparent = 0;
  let visible = 0;
  let opaque = 0;
  let total = 0;
  const rowLength = png.width * 4 + 1;

  for (let y = 0; y < png.height; y += 1) {
    const rowOffset = y * rowLength;
    const filterType = png.raw[rowOffset];
    if (filterType !== 0) return { transparent: 0, visible: 0, opaque: 0, total: 0, unsupportedFilter: true };

    for (let x = 0; x < png.width; x += 1) {
      const alpha = png.raw[rowOffset + 1 + x * 4 + 3];
      if (alpha === 0) transparent += 1;
      if (alpha > 0) visible += 1;
      if (alpha === 255) opaque += 1;
      total += 1;
    }
  }

  return { transparent, visible, opaque, total, unsupportedFilter: false };
}

const targetManifestExists = fileExists('public/brand/android-adaptive-icon-targets.json');
logResult('target_manifest_exists', targetManifestExists);
assertCondition(targetManifestExists, 'public/brand/android-adaptive-icon-targets.json should exist');

let targetManifest = null;
let targetManifestValidJson = false;
try {
  targetManifest = JSON.parse(readText('public/brand/android-adaptive-icon-targets.json'));
  targetManifestValidJson = true;
} catch {
  targetManifestValidJson = false;
}
logResult('target_manifest_valid_json', targetManifestValidJson);
assertCondition(targetManifestValidJson, 'android adaptive icon target manifest should be valid JSON');

const outputs = Array.isArray(targetManifest?.outputs) ? targetManifest.outputs : [];
const allTargetPngsExist = outputs.length > 0 && outputs.every((output) => fileExists(output.path));
logResult('all_target_pngs_exist', allTargetPngsExist);
assertCondition(allTargetPngsExist, 'all target adaptive icon PNG files should exist');

const pngItems = outputs.map((output) => ({
  output,
  png: fileExists(output.path) ? readPng(output.path) : null,
}));

const allTargetPngsHavePngSignature = pngItems.every((item) => item.png?.hasSignature);
logResult('all_target_pngs_have_png_signature', allTargetPngsHavePngSignature);
assertCondition(allTargetPngsHavePngSignature, 'all generated adaptive icon files should have PNG signature');

const allTargetPngDimensionsMatch = pngItems.every(({ output, png }) => {
  const size = Number(output.size);
  return png?.width === size && png?.height === size;
});
logResult('all_target_png_dimensions_match', allTargetPngDimensionsMatch);
assertCondition(allTargetPngDimensionsMatch, 'all generated adaptive icon PNG dimensions should match target sizes');

const generatedTypes = new Set(outputs.filter((output) => fileExists(output.path)).map((output) => output.type));
const requiredTypesGenerated = ['foreground', 'background'].every((type) => generatedTypes.has(type));
logResult('required_types_generated', requiredTypesGenerated);
assertCondition(requiredTypesGenerated, 'foreground and background adaptive icon PNGs should be generated');

const generatedSizes = new Set(outputs.filter((output) => fileExists(output.path)).map((output) => output.size));
const requiredSizesGenerated = [432, 108].every((size) => generatedSizes.has(size));
logResult('required_sizes_generated', requiredSizesGenerated);
assertCondition(requiredSizesGenerated, '432 and 108 adaptive icon PNGs should be generated');

const alphaItems = pngItems.map((item) => ({ ...item, alphaStats: item.png ? getAlphaStats(item.png) : null }));
const foregroundItems = alphaItems.filter((item) => item.output.type === 'foreground');
const backgroundItems = alphaItems.filter((item) => item.output.type === 'background');

const foregroundHasTransparency = foregroundItems.every((item) => item.alphaStats && item.alphaStats.transparent > 0);
logResult('foreground_has_transparency', foregroundHasTransparency);
assertCondition(foregroundHasTransparency, 'foreground adaptive icon PNGs should include transparent pixels');

const foregroundHasVisiblePixels = foregroundItems.every((item) => item.alphaStats && item.alphaStats.visible > 0);
logResult('foreground_has_visible_pixels', foregroundHasVisiblePixels);
assertCondition(foregroundHasVisiblePixels, 'foreground adaptive icon PNGs should include visible pixels');

const backgroundIsOpaque = backgroundItems.every((item) => {
  return item.alphaStats && item.alphaStats.total > 0 && item.alphaStats.opaque === item.alphaStats.total;
});
logResult('background_is_opaque', backgroundIsOpaque);
assertCondition(backgroundIsOpaque, 'background adaptive icon PNGs should be fully opaque');

const existingAppIconPaths = [
  'public/generated-icons/pwa/icon-192.png',
  'public/generated-icons/pwa/icon-512.png',
  'public/generated-icons/android/icon-48.png',
  'public/generated-icons/android/icon-72.png',
  'public/generated-icons/android/icon-96.png',
  'public/generated-icons/android/icon-144.png',
  'public/generated-icons/android/icon-192.png',
  'public/generated-icons/android/icon-512.png',
  'public/generated-icons/ios/icon-120.png',
  'public/generated-icons/ios/icon-152.png',
  'public/generated-icons/ios/icon-167.png',
  'public/generated-icons/ios/icon-180.png',
  'public/generated-icons/store/icon-1024.png',
];
const existingAppIconPngsStillExist = existingAppIconPaths.every((relativePath) => fileExists(relativePath));
logResult('existing_app_icon_pngs_still_exist', existingAppIconPngsStillExist);
assertCondition(existingAppIconPngsStillExist, 'existing app icon PNG files should still exist');

const existingSplashPaths = [
  'public/generated-splash/android/splash-1080x1920.png',
  'public/generated-splash/android/splash-1080x2160.png',
  'public/generated-splash/android/splash-1440x2560.png',
  'public/generated-splash/android/splash-icon-432.png',
  'public/generated-splash/android/splash-icon-960.png',
  'public/generated-splash/ios/splash-1170x2532.png',
  'public/generated-splash/ios/splash-1242x2688.png',
  'public/generated-splash/ios/splash-1290x2796.png',
  'public/generated-splash/store/splash-1290x2796.png',
];
const existingSplashPngsStillExist = existingSplashPaths.every((relativePath) => fileExists(relativePath));
logResult('existing_splash_pngs_still_exist', existingSplashPngsStillExist);
assertCondition(existingSplashPngsStillExist, 'existing splash PNG files should still exist');

const packageJson = JSON.parse(readText('package.json'));
const allDependencies = {
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {}),
};
const dependencyNames = Object.keys(allDependencies);
const blockedImageDependencies = ['sharp', 'canvas', 'jimp', 'imagemagick', 'gm'];
const noImageGenerationDependencyAdded = blockedImageDependencies.every(
  (packageName) => !dependencyNames.includes(packageName),
);
logResult('no_image_generation_dependency_added', noImageGenerationDependencyAdded);
assertCondition(noImageGenerationDependencyAdded, 'image generation dependencies should not be added in this PR');

const noCapacitorAdded = dependencyNames.every((packageName) => !packageName.startsWith('@capacitor/'));
logResult('no_capacitor_added', noCapacitorAdded);
assertCondition(noCapacitorAdded, 'Capacitor dependencies should not be added in this PR');

const noAndroidProjectCreated = !fileExists('android');
logResult('no_android_project_created', noAndroidProjectCreated);
assertCondition(noAndroidProjectCreated, 'android project folder should not exist in this PR');

if (failures.length > 0) {
  console.error('Generated Android adaptive icon check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Generated Android adaptive icon check passed');
}
