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

function includesAny(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

const resultDocPath = 'docs/ANDROID_BACK_BUTTON_QA_RESULT.md';
const resultDocExists = fileExists(resultDocPath);
logResult('result_doc_exists', resultDocExists);
assertCondition(resultDocExists, 'docs/ANDROID_BACK_BUTTON_QA_RESULT.md should exist');

const resultDoc = resultDocExists ? readText(resultDocPath) : '';

const checks = [
  ['mentions_artifact', resultDoc.includes('harupuli-debug-apk'), 'QA result doc should mention harupuli-debug-apk'],
  [
    'mentions_apk_path',
    resultDoc.includes('android/app/build/outputs/apk/debug/app-debug.apk'),
    'QA result doc should mention debug APK path',
  ],
  [
    'mentions_run_number_12',
    resultDoc.includes('workflow run number') || resultDoc.includes('12'),
    'QA result doc should mention workflow run number 12',
  ],
  [
    'mentions_device_or_emulator',
    includesAny(resultDoc, ['device/emulator', '기기', '에뮬레이터', 'Emulator']),
    'QA result doc should mention device or emulator',
  ],
  [
    'mentions_android_version',
    includesAny(resultDoc, ['Android version', 'Android 버전']),
    'QA result doc should mention Android version',
  ],
  [
    'mentions_qa_status',
    includesAny(resultDoc, ['Pass', 'Partial Pass', 'Fail', 'Blocked']),
    'QA result doc should mention at least one QA status',
  ],
  ['mentions_home', resultDoc.includes('Home'), 'QA result doc should mention Home'],
  [
    'mentions_fortune_detail',
    includesAny(resultDoc, ['Fortune Detail', '운세 상세']),
    'QA result doc should mention Fortune Detail or 운세 상세',
  ],
  [
    'mentions_saju_insight',
    includesAny(resultDoc, ['Saju Insight', '사주']),
    'QA result doc should mention Saju Insight or 사주',
  ],
  [
    'mentions_saved_readings',
    includesAny(resultDoc, ['Saved Readings', '저장한 풀이']),
    'QA result doc should mention Saved Readings or 저장한 풀이',
  ],
  [
    'mentions_settings',
    includesAny(resultDoc, ['Settings', '설정']),
    'QA result doc should mention Settings or 설정',
  ],
  [
    'mentions_privacy',
    includesAny(resultDoc, ['Privacy', '개인정보']),
    'QA result doc should mention Privacy or 개인정보',
  ],
  [
    'mentions_modal_or_panel',
    includesAny(resultDoc, ['Modal', '모달', 'Panel', '패널']),
    'QA result doc should mention modal or panel',
  ],
  [
    'mentions_issue_section',
    includesAny(resultDoc, ['발견 이슈', 'Issue']),
    'QA result doc should include issue section',
  ],
  [
    'mentions_no_handler_change',
    includesAny(resultDoc, [
      'back button handler 변경 없음',
      '@capacitor/app 추가 없음',
      'production logic unchanged',
    ]),
    'QA result doc should state no handler, @capacitor/app, or production logic change',
  ],
];

for (const [id, pass, message] of checks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

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

const explicitStatus = ['Pass', 'Partial Pass', 'Fail', 'Blocked'].find((status) =>
  resultDoc.includes(`QA 상태: ${status}`),
);
const qaStatusIsExplicit = Boolean(explicitStatus);
logResult('qa_status_is_explicit', qaStatusIsExplicit);
assertCondition(qaStatusIsExplicit, 'QA result doc should explicitly state QA status');

if (explicitStatus === 'Pass' || explicitStatus === 'Partial Pass') {
  const hasConcreteDeviceInfo =
    !includesAny(resultDoc, ['test device/emulator: 미확인', 'Android version: 미확인']) &&
    includesAny(resultDoc, ['test device/emulator:', '테스트 기기']) &&
    includesAny(resultDoc, ['Android version:', 'Android 버전']);
  logResult('pass_status_has_device_details', hasConcreteDeviceInfo);
  assertCondition(
    hasConcreteDeviceInfo,
    'Pass or Partial Pass status should include concrete device/emulator and Android version',
  );
}

if (explicitStatus === 'Blocked') {
  const blockedHasReasonAndRetry =
    includesAny(resultDoc, ['사유:', 'reason']) &&
    includesAny(resultDoc, ['필요한 준비:', 'required preparation']) &&
    includesAny(resultDoc, ['다음 재시도 조건:', 'retry conditions']);
  logResult('blocked_status_has_reason_and_retry', blockedHasReasonAndRetry);
  assertCondition(blockedHasReasonAndRetry, 'Blocked status should include reason and retry conditions');
}

if (explicitStatus === 'Fail') {
  const failHasIssueDetails =
    includesAny(resultDoc, ['관련 화면', 'related screen']) &&
    includesAny(resultDoc, ['재현 단계', 'reproduction']) &&
    includesAny(resultDoc, ['실제 결과', 'actual']);
  logResult('fail_status_has_issue_details', failHasIssueDetails);
  assertCondition(
    failHasIssueDetails,
    'Fail status should include issue section with related screen, reproduction, and actual result',
  );
}

if (failures.length > 0) {
  console.error('Android back button QA result check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android back button QA result check passed');
}
