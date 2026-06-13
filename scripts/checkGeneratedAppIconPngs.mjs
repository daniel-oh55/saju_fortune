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

const targetManifestExists = fileExists('public/brand/app-icon-png-targets.json');
logResult('target_manifest_exists', targetManifestExists);
assertCondition(targetManifestExists, 'public/brand/app-icon-png-targets.json should exist');

let targetManifest = null;
let targetManifestValidJson = false;
try {
  targetManifest = JSON.parse(readText('public/brand/app-icon-png-targets.json'));
  targetManifestValidJson = true;
} catch {
  targetManifestValidJson = false;
}
logResult('target_manifest_valid_json', targetManifestValidJson);
assertCondition(targetManifestValidJson, 'app icon PNG target manifest should be valid JSON');

const outputs = Array.isArray(targetManifest?.outputs) ? targetManifest.outputs : [];
const allTargetPngsExist = outputs.length > 0 && outputs.every((output) => fileExists(output.path));
logResult('all_target_pngs_exist', allTargetPngsExist);
assertCondition(allTargetPngsExist, 'all target PNG files should exist');

const pngMetadatas = outputs.map((output) => ({
  output,
  metadata: fileExists(output.path) ? readPngMetadata(output.path) : null,
}));

const allTargetPngsHavePngSignature = pngMetadatas.every((item) => item.metadata?.hasSignature);
logResult('all_target_pngs_have_png_signature', allTargetPngsHavePngSignature);
assertCondition(allTargetPngsHavePngSignature, 'all generated icon files should have PNG signature');

const allTargetPngDimensionsMatch = pngMetadatas.every(({ output, metadata }) => {
  const size = Number(output.size);
  return metadata?.width === size && metadata?.height === size;
});
logResult('all_target_png_dimensions_match', allTargetPngDimensionsMatch);
assertCondition(allTargetPngDimensionsMatch, 'all generated icon PNG dimensions should match target sizes');

const generatedPlatforms = new Set(outputs.filter((output) => fileExists(output.path)).map((output) => output.platform));
const requiredPlatforms = ['pwa', 'android', 'ios', 'store'];
const requiredPlatformsGenerated = requiredPlatforms.every((platform) => generatedPlatforms.has(platform));
logResult('required_platforms_generated', requiredPlatformsGenerated);
assertCondition(requiredPlatformsGenerated, 'pwa, android, ios, and store icon PNGs should be generated');

const generatedSizes = new Set(outputs.filter((output) => fileExists(output.path)).map((output) => output.size));
const requiredSizes = [48, 72, 96, 120, 144, 152, 167, 180, 192, 512, 1024];
const requiredSizesGenerated = requiredSizes.every((size) => generatedSizes.has(size));
logResult('required_sizes_generated', requiredSizesGenerated);
assertCondition(requiredSizesGenerated, 'all required icon sizes should be generated');

const manifest = JSON.parse(readText('public/manifest.webmanifest'));
const manifestIcons = Array.isArray(manifest.icons) ? manifest.icons : [];
const pwaManifestReferencesPngIcons =
  manifestIcons.some((icon) => icon.src === '/generated-icons/pwa/icon-192.png') &&
  manifestIcons.some((icon) => icon.src === '/generated-icons/pwa/icon-512.png');
logResult('pwa_manifest_references_png_icons', pwaManifestReferencesPngIcons);
assertCondition(pwaManifestReferencesPngIcons, 'PWA manifest should reference generated 192 and 512 PNG icons');

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

const noCapacitorPlatformAdded =
  !dependencyNames.includes('@capacitor/android') && !dependencyNames.includes('@capacitor/ios');
logResult('no_capacitor_platform_added', noCapacitorPlatformAdded);
assertCondition(noCapacitorPlatformAdded, '@capacitor/android and @capacitor/ios should not be added in this PR');

if (failures.length > 0) {
  console.error('Generated app icon PNG check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Generated app icon PNG check passed');
}
