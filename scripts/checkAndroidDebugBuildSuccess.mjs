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

const androidProjectExists = fileExists('android');
logResult('android_project_exists', androidProjectExists);
assertCondition(androidProjectExists, 'android project folder should exist.');

const debugApkExists = fileExists('android/app/build/outputs/apk/debug/app-debug.apk');
logResult('debug_apk_exists', debugApkExists);
assertCondition(debugApkExists, 'android/app/build/outputs/apk/debug/app-debug.apk should exist after a successful debug build.');

const androidBuildCheckDocExists = fileExists('docs/ANDROID_BUILD_CHECK.md');
logResult('android_build_check_doc_exists', androidBuildCheckDocExists);
assertCondition(androidBuildCheckDocExists, 'docs/ANDROID_BUILD_CHECK.md should exist.');

const buildCheckDoc = androidBuildCheckDocExists ? readText('docs/ANDROID_BUILD_CHECK.md') : '';
const androidBuildCheckDocRecordsSuccess =
  /(Android debug build 재시도 성공|debug build retry succeeded|assembleDebug:\s*성공|assembleDebug:\s*success)/i.test(
    buildCheckDoc,
  );
logResult('android_build_check_doc_records_success', androidBuildCheckDocRecordsSuccess);
assertCondition(androidBuildCheckDocRecordsSuccess, 'ANDROID_BUILD_CHECK should record a successful assembleDebug result.');

const noIosProjectCreated = !fileExists('ios');
logResult('no_ios_project_created', noIosProjectCreated);
assertCondition(noIosProjectCreated, 'ios project folder should not exist in this PR.');

const noReleaseApkRequired =
  !fileExists('android/app/build/outputs/apk/release/app-release.apk') &&
  /(release build|signing)[\s\S]*(미진행|not run|not configured|아직)/i.test(buildCheckDoc);
logResult('no_release_apk_required', noReleaseApkRequired);
assertCondition(noReleaseApkRequired, 'release APK is not required, and docs should record release/signing as not yet done.');

const realAdSdkMarkers = ['google-ads', 'admob', 'adsense', 'applovin', 'unity-ads', 'google-mobile-ads'];
const noRealAdSdkAdded = dependencyNames.every((packageName) => {
  const normalized = packageName.toLowerCase();
  return realAdSdkMarkers.every((marker) => !normalized.includes(marker));
});
logResult('no_real_ad_sdk_added', noRealAdSdkAdded);
assertCondition(noRealAdSdkAdded, 'real ad SDK dependencies should not be added in this PR.');

const blockedImageDependencies = ['sharp', 'canvas', 'jimp', 'imagemagick', 'gm'];
const noImageGenerationDependencyAdded = blockedImageDependencies.every((packageName) => !dependencyNames.includes(packageName));
logResult('no_image_generation_dependency_added', noImageGenerationDependencyAdded);
assertCondition(noImageGenerationDependencyAdded, 'image generation dependencies should not be added in this PR.');

if (failures.length > 0) {
  console.error('Android debug build success check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android debug build success check passed');
}
