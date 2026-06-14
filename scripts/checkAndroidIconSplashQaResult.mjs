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

const resultDocPath = 'docs/ANDROID_ICON_SPLASH_QA_RESULT.md';
const resultDocExists = fileExists(resultDocPath);
logResult('result_doc_exists', resultDocExists);
assertCondition(resultDocExists, 'docs/ANDROID_ICON_SPLASH_QA_RESULT.md should exist');

const resultDoc = resultDocExists ? readText(resultDocPath) : '';

const resultDocMentionsArtifact = resultDoc.includes('harupuli-debug-apk');
logResult('result_doc_mentions_artifact', resultDocMentionsArtifact);
assertCondition(resultDocMentionsArtifact, 'QA result doc should mention harupuli-debug-apk');

const resultDocMentionsApkPath =
  resultDoc.includes('android/app/build/outputs/apk/debug/app-debug.apk');
logResult('result_doc_mentions_apk_path', resultDocMentionsApkPath);
assertCondition(resultDocMentionsApkPath, 'QA result doc should mention debug APK path');

const resultDocMentionsRunNumber = resultDoc.includes('run number') || resultDoc.includes('10');
logResult('result_doc_mentions_run_number', resultDocMentionsRunNumber);
assertCondition(resultDocMentionsRunNumber, 'QA result doc should mention run number 10');

const resultDocMentionsDeviceOrEmulator =
  resultDoc.includes('기기') || resultDoc.includes('에뮬레이터') || resultDoc.includes('Emulator');
logResult('result_doc_mentions_device_or_emulator', resultDocMentionsDeviceOrEmulator);
assertCondition(resultDocMentionsDeviceOrEmulator, 'QA result doc should mention device or emulator');

const resultDocMentionsAndroidVersion = resultDoc.includes('Android 버전');
logResult('result_doc_mentions_android_version', resultDocMentionsAndroidVersion);
assertCondition(resultDocMentionsAndroidVersion, 'QA result doc should mention Android version');

const qaStatuses = ['Pass', 'Partial Pass', 'Fail', 'Blocked'];
const mentionedStatuses = qaStatuses.filter((status) => resultDoc.includes(status));
const resultDocMentionsQaStatus = mentionedStatuses.length > 0;
logResult('result_doc_mentions_qa_status', resultDocMentionsQaStatus);
assertCondition(resultDocMentionsQaStatus, 'QA result doc should mention at least one QA status');

const resultDocMentionsLauncherIcon =
  resultDoc.includes('Launcher icon') || resultDoc.includes('ic_launcher.png');
logResult('result_doc_mentions_launcher_icon', resultDocMentionsLauncherIcon);
assertCondition(resultDocMentionsLauncherIcon, 'QA result doc should mention launcher icon');

const resultDocMentionsRoundIcon =
  resultDoc.includes('Round icon') || resultDoc.includes('ic_launcher_round.png');
logResult('result_doc_mentions_round_icon', resultDocMentionsRoundIcon);
assertCondition(resultDocMentionsRoundIcon, 'QA result doc should mention round icon');

const resultDocMentionsAdaptiveIcon =
  resultDoc.includes('Adaptive icon') || resultDoc.includes('ic_launcher_foreground.png');
logResult('result_doc_mentions_adaptive_icon', resultDocMentionsAdaptiveIcon);
assertCondition(resultDocMentionsAdaptiveIcon, 'QA result doc should mention adaptive icon');

const resultDocMentionsSplash =
  resultDoc.includes('Android 12 splash') || resultDoc.includes('harupuli_splash.png');
logResult('result_doc_mentions_splash', resultDocMentionsSplash);
assertCondition(resultDocMentionsSplash, 'QA result doc should mention Android 12 splash');

const resultDocMentionsIssueSection = resultDoc.includes('발견 이슈');
logResult('result_doc_mentions_issue_section', resultDocMentionsIssueSection);
assertCondition(resultDocMentionsIssueSection, 'QA result doc should include issue section');

const resultDocMentionsNoResourceChange =
  resultDoc.includes('Android 리소스 변경 없음') || resultDoc.includes('production 앱 로직 변경 없음');
logResult('result_doc_mentions_no_resource_change', resultDocMentionsNoResourceChange);
assertCondition(resultDocMentionsNoResourceChange, 'QA result doc should state no resource or production logic change');

const resourceFiles = [
  'android/app/src/main/res/mipmap-mdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-hdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png',
  'android/app/src/main/res/drawable-nodpi/ic_launcher_foreground.png',
  'android/app/src/main/res/drawable-nodpi/ic_launcher_background.png',
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
  'android/app/src/main/res/drawable-nodpi/harupuli_splash.png',
  'android/app/src/main/res/drawable-nodpi/harupuli_splash_icon.png',
];
const resourceFilesStillExist = resourceFiles.every(fileExists);
logResult('resource_files_still_exist', resourceFilesStillExist);
assertCondition(resourceFilesStillExist, 'Android icon/splash resource files should still exist');

const noIosProjectCreated = !fileExists('ios');
logResult('no_ios_project_created', noIosProjectCreated);
assertCondition(noIosProjectCreated, 'ios folder should not exist');

const serviceWorkerPaths = ['public/service-worker.js', 'public/sw.js', 'src/service-worker.js', 'src/sw.js'];
const noServiceWorkerAdded = serviceWorkerPaths.every((relativePath) => !fileExists(relativePath));
logResult('no_service_worker_added', noServiceWorkerAdded);
assertCondition(noServiceWorkerAdded, 'service worker files should not be added');

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

const noCapacitorAppAdded = !dependencyNames.includes('@capacitor/app');
logResult('no_capacitor_app_added', noCapacitorAppAdded);
assertCondition(noCapacitorAppAdded, '@capacitor/app should not be added in this PR');

const qaStatus = qaStatuses.find((status) => resultDoc.includes(`QA 상태: ${status}`));
const qaStatusIsExplicit = Boolean(qaStatus);
logResult('qa_status_is_explicit', qaStatusIsExplicit);
assertCondition(qaStatusIsExplicit, 'QA result doc should explicitly state QA status');

if (qaStatus === 'Pass' || qaStatus === 'Partial Pass') {
  const hasConcreteDeviceInfo =
    !resultDoc.includes('테스트 기기 또는 에뮬레이터: 미확인') &&
    !resultDoc.includes('Android 버전: 미확인') &&
    !resultDoc.includes('launcher 종류: 미확인');
  logResult('pass_status_has_device_details', hasConcreteDeviceInfo);
  assertCondition(hasConcreteDeviceInfo, 'Pass or Partial Pass status should include concrete device, Android version, and launcher details');
}

if (qaStatus === 'Blocked') {
  const blockedHasReasonAndRetry =
    resultDoc.includes('사유:') &&
    resultDoc.includes('필요한 준비:') &&
    resultDoc.includes('다음 재시도 조건:');
  logResult('blocked_status_has_reason_and_retry', blockedHasReasonAndRetry);
  assertCondition(blockedHasReasonAndRetry, 'Blocked status should include reason and retry conditions');
}

if (qaStatus === 'Fail') {
  const failHasIssueDetails =
    resultDoc.includes('관련 리소스 경로') &&
    resultDoc.includes('재현 단계') &&
    resultDoc.includes('실제 결과');
  logResult('fail_status_has_issue_details', failHasIssueDetails);
  assertCondition(failHasIssueDetails, 'Fail status should include issue details, resource paths, and reproduction steps');
}

if (failures.length > 0) {
  console.error('Android icon/splash QA result check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android icon/splash QA result check passed');
}
