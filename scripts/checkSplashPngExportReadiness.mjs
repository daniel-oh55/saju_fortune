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

const sourceSvgExists = targetManifestValidJson && fileExists(targetManifest.source);
logResult('source_svg_exists', sourceSvgExists);
assertCondition(sourceSvgExists, 'source SVG referenced by target manifest should exist');

const outputs = Array.isArray(targetManifest?.outputs) ? targetManifest.outputs : [];
const outputsExistInManifest = outputs.length >= 8;
logResult('outputs_exist_in_manifest', outputsExistInManifest);
assertCondition(outputsExistInManifest, 'target manifest should contain at least 8 outputs');

const platforms = new Set(outputs.map((output) => output.platform));
const requiredPlatforms = ['android', 'ios', 'store'];
const requiredPlatformsExist = requiredPlatforms.every((platform) => platforms.has(platform));
logResult('required_platforms_exist', requiredPlatformsExist);
assertCondition(requiredPlatformsExist, 'target manifest should include android, ios, and store platforms');

const dimensions = new Set(outputs.map((output) => `${output.width}x${output.height}`));
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
const requiredDimensionsExist = requiredDimensions.every((dimension) => dimensions.has(dimension));
logResult('required_dimensions_exist', requiredDimensionsExist);
assertCondition(requiredDimensionsExist, 'target manifest should include all required splash dimensions');

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

const splashExportDocExists = fileExists('docs/SPLASH_PNG_EXPORT_READINESS.md');
logResult('splash_export_doc_exists', splashExportDocExists);
assertCondition(splashExportDocExists, 'docs/SPLASH_PNG_EXPORT_READINESS.md should exist');

const appAssetDoc = readText('docs/APP_ASSET_READINESS.md');
const appAssetDocMentionsSplashPngExport =
  appAssetDoc.includes('SPLASH_PNG_EXPORT_READINESS') ||
  appAssetDoc.includes('splash-png-targets.json');
logResult('app_asset_doc_mentions_splash_png_export', appAssetDocMentionsSplashPngExport);
assertCondition(
  appAssetDocMentionsSplashPngExport,
  'APP_ASSET_READINESS should mention SPLASH_PNG_EXPORT_READINESS or splash-png-targets.json',
);

const androidReadinessDoc = readText('docs/ANDROID_PACKAGING_READINESS.md');
const androidReadinessDocMentionsSplashPng =
  androidReadinessDoc.includes('splash PNG') || androidReadinessDoc.includes('SPLASH_PNG_EXPORT_READINESS');
logResult('android_readiness_doc_mentions_splash_png', androidReadinessDocMentionsSplashPng);
assertCondition(
  androidReadinessDocMentionsSplashPng,
  'ANDROID_PACKAGING_READINESS should mention splash PNG readiness',
);

if (failures.length > 0) {
  console.error('Splash PNG export readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Splash PNG export readiness check passed');
}
