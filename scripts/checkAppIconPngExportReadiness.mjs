import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const failures = [];

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

const sourceSvgExists = targetManifestValidJson && fileExists(targetManifest.source);
logResult('source_svg_exists', sourceSvgExists);
assertCondition(sourceSvgExists, 'source SVG referenced by target manifest should exist');

const outputs = Array.isArray(targetManifest?.outputs) ? targetManifest.outputs : [];
const outputsExistInManifest = outputs.length >= 10;
logResult('outputs_exist_in_manifest', outputsExistInManifest);
assertCondition(outputsExistInManifest, 'target manifest should contain at least 10 outputs');

const platforms = new Set(outputs.map((output) => output.platform));
const requiredPlatforms = ['pwa', 'android', 'ios', 'store'];
const requiredPlatformsExist = requiredPlatforms.every((platform) => platforms.has(platform));
logResult('required_platforms_exist', requiredPlatformsExist);
assertCondition(requiredPlatformsExist, 'target manifest should include pwa, android, ios, and store platforms');

const sizes = new Set(outputs.map((output) => output.size));
const requiredSizes = [48, 72, 96, 120, 144, 152, 167, 180, 192, 512, 1024];
const requiredSizesExist = requiredSizes.every((size) => sizes.has(size));
logResult('required_sizes_exist', requiredSizesExist);
assertCondition(requiredSizesExist, 'target manifest should include all required icon sizes');

const outputPathsArePng = outputs.every((output) => typeof output.path === 'string' && output.path.endsWith('.png'));
logResult('output_paths_are_png', outputPathsArePng);
assertCondition(outputPathsArePng, 'all output paths should end with .png');

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

const appIconExportDocExists = fileExists('docs/APP_ICON_PNG_EXPORT_READINESS.md');
logResult('app_icon_export_doc_exists', appIconExportDocExists);
assertCondition(appIconExportDocExists, 'docs/APP_ICON_PNG_EXPORT_READINESS.md should exist');

const appAssetDoc = readText('docs/APP_ASSET_READINESS.md');
const appAssetDocMentionsIconPngExport =
  appAssetDoc.includes('APP_ICON_PNG_EXPORT_READINESS') ||
  appAssetDoc.includes('app-icon-png-targets.json');
logResult('app_asset_doc_mentions_icon_png_export', appAssetDocMentionsIconPngExport);
assertCondition(
  appAssetDocMentionsIconPngExport,
  'APP_ASSET_READINESS should mention APP_ICON_PNG_EXPORT_READINESS or app-icon-png-targets.json',
);

if (failures.length > 0) {
  console.error('App icon PNG export readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('App icon PNG export readiness check passed');
}
