import fs from 'node:fs';
import path from 'node:path';
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

function readPngMetadata(relativePath) {
  const buffer = fs.readFileSync(path.join(projectRoot, relativePath));
  const hasSignature = buffer.subarray(0, 8).equals(pngSignature);

  if (!hasSignature || buffer.toString('ascii', 12, 16) !== 'IHDR') {
    return { hasSignature, width: null, height: null };
  }

  return {
    hasSignature,
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

const targetManifestExists = fileExists('public/brand/splash-png-targets.json');
logResult('target_manifest_exists', targetManifestExists);
assertCondition(targetManifestExists, 'public/brand/splash-png-targets.json should exist');

let targetManifest = null;
let targetManifestValidJson = false;
try {
  targetManifest = JSON.parse(readText('public/brand/splash-png-targets.json'));
  targetManifestValidJson = true;
} catch {
  targetManifestValidJson = false;
}
logResult('target_manifest_valid_json', targetManifestValidJson);
assertCondition(targetManifestValidJson, 'splash PNG target manifest should be valid JSON');

const outputs = Array.isArray(targetManifest?.outputs) ? targetManifest.outputs : [];
const allTargetPngsExist = outputs.length > 0 && outputs.every((output) => fileExists(output.path));
logResult('all_target_pngs_exist', allTargetPngsExist);
assertCondition(allTargetPngsExist, 'all target splash PNG files should exist');

const pngMetadatas = outputs.map((output) => ({
  output,
  metadata: fileExists(output.path) ? readPngMetadata(output.path) : null,
}));

const allTargetPngsHavePngSignature = pngMetadatas.every((item) => item.metadata?.hasSignature);
logResult('all_target_pngs_have_png_signature', allTargetPngsHavePngSignature);
assertCondition(allTargetPngsHavePngSignature, 'all generated splash files should have PNG signature');

const allTargetPngDimensionsMatch = pngMetadatas.every(({ output, metadata }) => {
  return metadata?.width === Number(output.width) && metadata?.height === Number(output.height);
});
logResult('all_target_png_dimensions_match', allTargetPngDimensionsMatch);
assertCondition(allTargetPngDimensionsMatch, 'all generated splash PNG dimensions should match target dimensions');

const generatedPlatforms = new Set(outputs.filter((output) => fileExists(output.path)).map((output) => output.platform));
const requiredPlatforms = ['android', 'ios', 'store'];
const requiredPlatformsGenerated = requiredPlatforms.every((platform) => generatedPlatforms.has(platform));
logResult('required_platforms_generated', requiredPlatformsGenerated);
assertCondition(requiredPlatformsGenerated, 'android, ios, and store splash PNGs should be generated');

const generatedDimensions = new Set(
  outputs.filter((output) => fileExists(output.path)).map((output) => `${output.width}x${output.height}`),
);
const requiredDimensions = [
  '1080x1920',
  '1080x2160',
  '1440x2560',
  '432x432',
  '960x960',
  '1170x2532',
  '1242x2688',
  '1290x2796',
];
const requiredDimensionsGenerated = requiredDimensions.every((dimension) => generatedDimensions.has(dimension));
logResult('required_dimensions_generated', requiredDimensionsGenerated);
assertCondition(requiredDimensionsGenerated, 'all required splash dimensions should be generated');

const appIconPaths = [
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
const appIconPngsStillExist = appIconPaths.every((relativePath) => fileExists(relativePath));
logResult('app_icon_pngs_still_exist', appIconPngsStillExist);
assertCondition(appIconPngsStillExist, 'previously generated app icon PNG files should still exist');

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

const noCapacitorIosAdded = !dependencyNames.includes('@capacitor/ios');
logResult('no_capacitor_ios_added', noCapacitorIosAdded);
assertCondition(noCapacitorIosAdded, '@capacitor/ios should not be added in this PR');

if (failures.length > 0) {
  console.error('Generated splash PNG check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Generated splash PNG check passed');
}
