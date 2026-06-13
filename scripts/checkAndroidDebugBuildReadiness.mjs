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

const capacitorAndroidInstalled = dependencyNames.includes('@capacitor/android');
logResult('capacitor_android_installed', capacitorAndroidInstalled);
assertCondition(capacitorAndroidInstalled, 'package.json should include @capacitor/android');

const noCapacitorIos = !dependencyNames.includes('@capacitor/ios');
logResult('no_capacitor_ios', noCapacitorIos);
assertCondition(noCapacitorIos, '@capacitor/ios should not be installed in this PR');

const androidProjectExists = fileExists('android');
logResult('android_project_exists', androidProjectExists);
assertCondition(androidProjectExists, 'android folder should exist');

const androidCoreFilesExist =
  (fileExists('android/settings.gradle') || fileExists('android/settings.gradle.kts')) &&
  (fileExists('android/build.gradle') || fileExists('android/build.gradle.kts')) &&
  (fileExists('android/app/build.gradle') || fileExists('android/app/build.gradle.kts')) &&
  fileExists('android/app/src/main/AndroidManifest.xml') &&
  fileExists('android/app/src/main/java/com/harupuli/app/MainActivity.java') &&
  fileExists('android/gradlew') &&
  fileExists('android/gradlew.bat');
logResult('android_core_files_exist', androidCoreFilesExist);
assertCondition(androidCoreFilesExist, 'Android core scaffold files should exist');

const androidAssetsSynced =
  fileExists('android/app/src/main/assets/public/index.html') ||
  fileExists('android/app/src/main/assets/public/manifest.webmanifest');
logResult('android_assets_synced', androidAssetsSynced);
assertCondition(androidAssetsSynced, 'Android web assets should be synced after npx cap sync android');

const androidBuildCheckDocExists = fileExists('docs/ANDROID_BUILD_CHECK.md');
logResult('android_build_check_doc_exists', androidBuildCheckDocExists);
assertCondition(androidBuildCheckDocExists, 'docs/ANDROID_BUILD_CHECK.md should exist');

const buildCheckDoc = androidBuildCheckDocExists ? readText('docs/ANDROID_BUILD_CHECK.md') : '';
const androidBuildCheckDocMentionsAssembleDebug = buildCheckDoc.includes('assembleDebug');
logResult('android_build_check_doc_mentions_assemble_debug', androidBuildCheckDocMentionsAssembleDebug);
assertCondition(androidBuildCheckDocMentionsAssembleDebug, 'ANDROID_BUILD_CHECK should mention assembleDebug');

const androidDebugApkExists = fileExists('android/app/build/outputs/apk/debug/app-debug.apk');
const buildDocRecordsResult =
  /assembleDebug[\s\S]*(성공|실패|failed|success|JAVA_HOME|java command)/i.test(buildCheckDoc) &&
  buildCheckDoc.includes('android/app/build/outputs/apk/debug/app-debug.apk');
const androidDebugApkExistsOrBuildDocRecordsResult = androidDebugApkExists || buildDocRecordsResult;
logResult('android_debug_apk_exists_or_build_doc_records_result', androidDebugApkExistsOrBuildDocRecordsResult);
assertCondition(
  androidDebugApkExistsOrBuildDocRecordsResult,
  'app-debug.apk should exist, or ANDROID_BUILD_CHECK should record the assembleDebug result',
);

const noIosProjectCreated = !fileExists('ios');
logResult('no_ios_project_created', noIosProjectCreated);
assertCondition(noIosProjectCreated, 'ios folder should not exist in this PR');

const serviceWorkerPaths = ['public/service-worker.js', 'public/sw.js', 'src/service-worker.js', 'src/sw.js'];
const noServiceWorkerAdded = serviceWorkerPaths.every((relativePath) => !fileExists(relativePath));
logResult('no_service_worker_added', noServiceWorkerAdded);
assertCondition(noServiceWorkerAdded, 'service worker files should not be added in this PR');

const realAdSdkMarkers = ['google-ads', 'admob', 'adsense', 'applovin', 'unity-ads', 'google-mobile-ads'];
const noRealAdSdkAdded = dependencyNames.every((packageName) => {
  const normalized = packageName.toLowerCase();
  return realAdSdkMarkers.every((marker) => !normalized.includes(marker));
});
logResult('no_real_ad_sdk_added', noRealAdSdkAdded);
assertCondition(noRealAdSdkAdded, 'real ad SDK dependencies should not be added in this PR');

const blockedImageDependencies = ['sharp', 'canvas', 'jimp', 'imagemagick', 'gm'];
const noImageGenerationDependencyAdded = blockedImageDependencies.every((packageName) => !dependencyNames.includes(packageName));
logResult('no_image_generation_dependency_added', noImageGenerationDependencyAdded);
assertCondition(noImageGenerationDependencyAdded, 'image generation dependencies should not be added in this PR');

if (failures.length > 0) {
  console.error('Android debug build readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android debug build readiness check passed');
}
