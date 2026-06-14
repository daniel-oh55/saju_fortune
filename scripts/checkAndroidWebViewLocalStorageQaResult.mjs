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

const qaResultDocPath = 'docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA_RESULT.md';
const qaResultDocExists = fileExists(qaResultDocPath);
logResult('qa_result_doc_exists', qaResultDocExists);
assertCondition(qaResultDocExists, `${qaResultDocPath} should exist`);

const qaResultDoc = qaResultDocExists ? readText(qaResultDocPath) : '';

const qaResultDocMentionsArtifact = qaResultDoc.includes('harupuli-debug-apk');
logResult('qa_result_doc_mentions_artifact', qaResultDocMentionsArtifact);
assertCondition(qaResultDocMentionsArtifact, 'QA result doc should mention harupuli-debug-apk');

const qaResultDocMentionsApkPath = qaResultDoc.includes('android/app/build/outputs/apk/debug/app-debug.apk');
logResult('qa_result_doc_mentions_apk_path', qaResultDocMentionsApkPath);
assertCondition(qaResultDocMentionsApkPath, 'QA result doc should mention the debug APK path');

const qaResultDocMentionsDeviceOrEmulator = qaResultDoc.includes('기기') || qaResultDoc.includes('에뮬레이터');
logResult('qa_result_doc_mentions_device_or_emulator', qaResultDocMentionsDeviceOrEmulator);
assertCondition(qaResultDocMentionsDeviceOrEmulator, 'QA result doc should mention a device or emulator');

const qaResultDocMentionsAndroidVersion = qaResultDoc.includes('Android 버전');
logResult('qa_result_doc_mentions_android_version', qaResultDocMentionsAndroidVersion);
assertCondition(qaResultDocMentionsAndroidVersion, 'QA result doc should mention Android version');

const qaResultDocMentionsResultStatus = /Pass|Fail|Blocked|Partial Pass/.test(qaResultDoc);
logResult('qa_result_doc_mentions_result_status', qaResultDocMentionsResultStatus);
assertCondition(qaResultDocMentionsResultStatus, 'QA result doc should mention Pass, Fail, Blocked, or Partial Pass');

const requiredKeys = [
  'aiTodayFortune.profile',
  'aiTodayFortune.todayFortune',
  'aiTodayFortune.rewardUnlocks',
  'harupuli_consent_preferences_v1',
  'harupuli_saved_readings_v1',
  'harupuli_visit_streak_v1',
];
const qaResultDocMentionsRequiredKeys = requiredKeys.every((key) => qaResultDoc.includes(key));
logResult('qa_result_doc_mentions_required_keys', qaResultDocMentionsRequiredKeys);
assertCondition(qaResultDocMentionsRequiredKeys, 'QA result doc should mention all required localStorage keys');

const qaResultDocMentionsAppRestart = qaResultDoc.includes('앱 재실행') || qaResultDoc.includes('종료 후 재실행');
logResult('qa_result_doc_mentions_app_restart', qaResultDocMentionsAppRestart);
assertCondition(qaResultDocMentionsAppRestart, 'QA result doc should mention app restart');

const qaResultDocMentionsAppDataClear =
  qaResultDoc.includes('앱 데이터 삭제') || qaResultDoc.includes('저장공간/데이터 삭제');
logResult('qa_result_doc_mentions_app_data_clear', qaResultDocMentionsAppDataClear);
assertCondition(qaResultDocMentionsAppDataClear, 'QA result doc should mention app data clear');

const qaResultDocMentionsReinstallUpdate = qaResultDoc.includes('재설치') || qaResultDoc.includes('업데이트');
logResult('qa_result_doc_mentions_reinstall_update', qaResultDocMentionsReinstallUpdate);
assertCondition(qaResultDocMentionsReinstallUpdate, 'QA result doc should mention reinstall or update');

const noLocalStorageKeyChangesInSrc = qaResultDoc.includes('production 앱 로직과 localStorage key는 변경하지 않습니다');
logResult('no_localstorage_key_changes_in_src', noLocalStorageKeyChangesInSrc);
assertCondition(noLocalStorageKeyChangesInSrc, 'QA result doc should state that localStorage keys are unchanged');

const noIosProjectCreated = !fileExists('ios');
logResult('no_ios_project_created', noIosProjectCreated);
assertCondition(noIosProjectCreated, 'ios folder should not exist');

const noReleaseBuildArtifactsRequired =
  (qaResultDoc.includes('release build') && qaResultDoc.includes('미진행')) ||
  (qaResultDoc.includes('signing') && qaResultDoc.includes('미진행')) ||
  qaResultDoc.includes('release build/signing 준비');
logResult('no_release_build_artifacts_required', noReleaseBuildArtifactsRequired);
assertCondition(noReleaseBuildArtifactsRequired, 'QA result doc should state release build or signing is not done');

const packageJson = JSON.parse(readText('package.json'));
const allDependencies = {
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {}),
};
const dependencyNames = Object.keys(allDependencies);

const realAdSdkMarkers = ['google-ads', 'admob', 'adsense', 'applovin', 'unity-ads', 'google-mobile-ads'];
const noRealAdSdkAdded = dependencyNames.every((packageName) => {
  const normalizedName = packageName.toLowerCase();
  return realAdSdkMarkers.every((marker) => !normalizedName.includes(marker));
});
logResult('no_real_ad_sdk_added', noRealAdSdkAdded);
assertCondition(noRealAdSdkAdded, 'real ad SDK dependencies should not be added');

if (failures.length > 0) {
  console.error('Android WebView localStorage QA result check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android WebView localStorage QA result check passed');
}
