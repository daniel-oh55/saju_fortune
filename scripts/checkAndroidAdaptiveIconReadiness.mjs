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

function listFilesRecursive(relativePath) {
  const targetPath = path.join(projectRoot, relativePath);
  if (!fs.existsSync(targetPath)) return [];

  const entries = fs.readdirSync(targetPath, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const childRelativePath = path.join(relativePath, entry.name);
    if (entry.isDirectory()) return listFilesRecursive(childRelativePath);
    return childRelativePath;
  });
}

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

function logResult(sampleId, isPass) {
  console.log(`sampleId: ${sampleId}`);
  console.log(`result: ${isPass ? 'pass' : 'fail'}`);
  console.log('');
}

const adaptiveIconDocExists = fileExists('docs/ANDROID_ADAPTIVE_ICON_READINESS.md');
logResult('adaptive_icon_doc_exists', adaptiveIconDocExists);
assertCondition(adaptiveIconDocExists, 'docs/ANDROID_ADAPTIVE_ICON_READINESS.md should exist');

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

const sourceSvgExists = targetManifestValidJson && fileExists(targetManifest.source);
logResult('source_svg_exists', sourceSvgExists);
assertCondition(sourceSvgExists, 'source SVG referenced by target manifest should exist');

const outputs = Array.isArray(targetManifest?.outputs) ? targetManifest.outputs : [];
const outputsExistInManifest = outputs.length >= 4;
logResult('outputs_exist_in_manifest', outputsExistInManifest);
assertCondition(outputsExistInManifest, 'target manifest should contain at least 4 outputs');

const types = new Set(outputs.map((output) => output.type));
const requiredTypesExist = ['foreground', 'background'].every((type) => types.has(type));
logResult('required_types_exist', requiredTypesExist);
assertCondition(requiredTypesExist, 'target manifest should include foreground and background types');

const sizes = new Set(outputs.map((output) => output.size));
const requiredSizesExist = [432, 108].every((size) => sizes.has(size));
logResult('required_sizes_exist', requiredSizesExist);
assertCondition(requiredSizesExist, 'target manifest should include 432 and 108 sizes');

const outputPathsArePng = outputs.every((output) => typeof output.path === 'string' && output.path.endsWith('.png'));
logResult('output_paths_are_png', outputPathsArePng);
assertCondition(outputPathsArePng, 'all output paths should end with .png');

const adaptiveFiles = listFilesRecursive('public/generated-icons/android-adaptive');
const noAdaptivePngFilesGeneratedYet = adaptiveFiles.every((filePath) => !filePath.toLowerCase().endsWith('.png'));
logResult('no_adaptive_png_files_generated_yet', noAdaptivePngFilesGeneratedYet);
assertCondition(noAdaptivePngFilesGeneratedYet, 'adaptive icon PNG files should not be generated in this readiness PR');

const existingAppIconPaths = [
  'public/generated-icons/pwa/icon-192.png',
  'public/generated-icons/pwa/icon-512.png',
  'public/generated-icons/android/icon-48.png',
  'public/generated-icons/android/icon-72.png',
  'public/generated-icons/android/icon-96.png',
  'public/generated-icons/android/icon-144.png',
  'public/generated-icons/android/icon-192.png',
  'public/generated-icons/android/icon-512.png',
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
  console.error('Android adaptive icon readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android adaptive icon readiness check passed');
}
