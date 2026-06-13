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

const packageJson = JSON.parse(readText('package.json'));
const allDependencies = {
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {}),
};
const dependencyNames = Object.keys(allDependencies);

const packageHasCapacitorCore = Boolean(packageJson.dependencies?.['@capacitor/core']);
logResult('package_has_capacitor_core', packageHasCapacitorCore);
assertCondition(packageHasCapacitorCore, 'package.json dependencies should include @capacitor/core');

const packageHasCapacitorCli = Boolean(
  packageJson.devDependencies?.['@capacitor/cli'] || packageJson.dependencies?.['@capacitor/cli'],
);
logResult('package_has_capacitor_cli', packageHasCapacitorCli);
assertCondition(packageHasCapacitorCli, 'package.json should include @capacitor/cli');

const packageHasCapacitorAndroid = dependencyNames.includes('@capacitor/android');
logResult('package_has_capacitor_android', packageHasCapacitorAndroid);
assertCondition(packageHasCapacitorAndroid, 'package.json should include @capacitor/android');

const noCapacitorIos = !dependencyNames.includes('@capacitor/ios');
logResult('no_capacitor_ios', noCapacitorIos);
assertCondition(noCapacitorIos, '@capacitor/ios should not be installed in this PR');

const capacitorConfigExists = fileExists('capacitor.config.json');
logResult('capacitor_config_exists', capacitorConfigExists);
assertCondition(capacitorConfigExists, 'capacitor.config.json should exist');

let capacitorConfig = null;
let capacitorConfigValidJson = false;
if (capacitorConfigExists) {
  try {
    capacitorConfig = JSON.parse(readText('capacitor.config.json'));
    capacitorConfigValidJson = true;
  } catch {
    capacitorConfigValidJson = false;
  }
}
logResult('capacitor_config_valid_json', capacitorConfigValidJson);
assertCondition(capacitorConfigValidJson, 'capacitor.config.json should be valid JSON');

const capacitorConfigExpectedValues =
  capacitorConfig?.appId === 'com.harupuli.app' &&
  capacitorConfig?.appName === '하루풀이' &&
  capacitorConfig?.webDir === 'dist';
logResult('capacitor_config_expected_values', capacitorConfigExpectedValues);
assertCondition(capacitorConfigExpectedValues, 'capacitor.config.json should match the expected Android scaffold values');

const androidProjectExists = fileExists('android');
logResult('android_project_exists', androidProjectExists);
assertCondition(androidProjectExists, 'android folder should exist');

const androidProjectCoreFilesExist =
  (fileExists('android/settings.gradle') || fileExists('android/settings.gradle.kts')) &&
  (fileExists('android/build.gradle') || fileExists('android/build.gradle.kts')) &&
  (fileExists('android/app/build.gradle') || fileExists('android/app/build.gradle.kts')) &&
  fileExists('android/app/src/main/AndroidManifest.xml');
logResult('android_project_core_files_exist', androidProjectCoreFilesExist);
assertCondition(androidProjectCoreFilesExist, 'Android scaffold core Gradle and manifest files should exist');

const androidAssetsSynced =
  fileExists('android/app/src/main/assets/public/index.html') ||
  fileExists('android/app/src/main/assets/public/manifest.webmanifest');
logResult('android_assets_synced', androidAssetsSynced);
assertCondition(androidAssetsSynced, 'Android project should contain synced web assets');

const noIosProjectCreated = !fileExists('ios');
logResult('no_ios_project_created', noIosProjectCreated);
assertCondition(noIosProjectCreated, 'ios folder should not exist in this PR');

const serviceWorkerPaths = ['public/service-worker.js', 'public/sw.js', 'src/service-worker.js', 'src/sw.js'];
const noServiceWorkerAdded = serviceWorkerPaths.every((relativePath) => !fileExists(relativePath));
logResult('no_service_worker_added', noServiceWorkerAdded);
assertCondition(noServiceWorkerAdded, 'service worker files should not be added in this PR');

const generatedAppIconPaths = [
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
const generatedAppIconsExist = generatedAppIconPaths.every((relativePath) => fileExists(relativePath));
logResult('generated_app_icons_exist', generatedAppIconsExist);
assertCondition(generatedAppIconsExist, 'generated app icon PNG files should still exist');

const generatedSplashPaths = [
  'public/generated-splash/android/splash-1080x1920.png',
  'public/generated-splash/android/splash-1080x2160.png',
  'public/generated-splash/android/splash-1440x2560.png',
  'public/generated-splash/android/splash-icon-432.png',
  'public/generated-splash/android/splash-icon-960.png',
];
const generatedSplashPngsExist = generatedSplashPaths.every((relativePath) => fileExists(relativePath));
logResult('generated_splash_pngs_exist', generatedSplashPngsExist);
assertCondition(generatedSplashPngsExist, 'generated splash PNG files should still exist');

const generatedAdaptiveIconPaths = [
  'public/generated-icons/android-adaptive/foreground-432.png',
  'public/generated-icons/android-adaptive/foreground-108.png',
  'public/generated-icons/android-adaptive/background-432.png',
  'public/generated-icons/android-adaptive/background-108.png',
];
const generatedAdaptiveIconsExist = generatedAdaptiveIconPaths.every((relativePath) => fileExists(relativePath));
logResult('generated_adaptive_icons_exist', generatedAdaptiveIconsExist);
assertCondition(generatedAdaptiveIconsExist, 'generated Android adaptive icon PNG files should still exist');

const blockedImageDependencies = ['sharp', 'canvas', 'jimp', 'imagemagick', 'gm'];
const noImageGenerationDependencyAdded = blockedImageDependencies.every((packageName) => !dependencyNames.includes(packageName));
logResult('no_image_generation_dependency_added', noImageGenerationDependencyAdded);
assertCondition(noImageGenerationDependencyAdded, 'image generation dependencies should not be added in this PR');

const realAdSdkMarkers = ['google-ads', 'admob', 'adsense', 'applovin', 'unity-ads', 'google-mobile-ads'];
const noRealAdSdkAdded = dependencyNames.every((packageName) => {
  const normalized = packageName.toLowerCase();
  return realAdSdkMarkers.every((marker) => !normalized.includes(marker));
});
logResult('no_real_ad_sdk_added', noRealAdSdkAdded);
assertCondition(noRealAdSdkAdded, 'real ad SDK dependencies should not be added in this PR');

if (failures.length > 0) {
  console.error('Android platform scaffold check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android platform scaffold check passed');
}
