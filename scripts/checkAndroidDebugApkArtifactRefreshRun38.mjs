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

const refreshDocPath = 'docs/ANDROID_DEBUG_APK_ARTIFACT_REFRESH_RUN38.md';
const refreshDocExists = fileExists(refreshDocPath);
logResult('artifact_refresh_doc_exists', refreshDocExists);
assertCondition(refreshDocExists, 'docs/ANDROID_DEBUG_APK_ARTIFACT_REFRESH_RUN38.md should exist');

const doc = refreshDocExists ? readText(refreshDocPath) : '';
const todo = fileExists('TODO.md') ? readText('TODO.md') : '';

const oldTodoMarkers = [
  '?ㅼ젣 ?ㅽ넗???ㅽ겕由곗꺑 ?대?吏 ?쒖옉',
  '?쒖뼇??蹂댁젙 ?곸슜 ?щ?',
  '?묐젰/?뚮젰 ?섑뵆 異붽? 寃利?',
];

const docChecks = [
  ['doc_mentions_service_name', doc.includes('하루풀이'), 'Run #38 artifact refresh doc should mention service name'],
  ['doc_mentions_run_38', includesAny(doc, ['run number: #38', 'run #38']), 'Run #38 artifact refresh doc should mention run #38'],
  [
    'doc_mentions_head_sha',
    doc.includes('33a6ff4b60459fb9e9d9bb0b047df759b19bf559'),
    'Run #38 artifact refresh doc should mention head sha',
  ],
  ['doc_mentions_artifact_name', doc.includes('harupuli-debug-apk'), 'Run #38 artifact refresh doc should mention artifact name'],
  ['doc_mentions_artifact_id', doc.includes('7685703968'), 'Run #38 artifact refresh doc should mention artifact id'],
  [
    'doc_mentions_artifact_digest',
    doc.includes('sha256:69bea66d93fbe5e4d77e82aa2d93af318feb972e99c4e37cf6c08aafb217d076'),
    'Run #38 artifact refresh doc should mention artifact digest',
  ],
  ['doc_mentions_previous_run_35', doc.includes('run #35'), 'Run #38 artifact refresh doc should mention run #35'],
  ['doc_mentions_previous_run_36', doc.includes('run #36'), 'Run #38 artifact refresh doc should mention run #36'],
  ['doc_mentions_previous_run_37', doc.includes('run #37'), 'Run #38 artifact refresh doc should mention run #37'],
  [
    'doc_mentions_artifact_download_pending',
    doc.includes('artifact 다운로드') && doc.includes('Pending'),
    'Run #38 artifact refresh doc should keep artifact download Pending',
  ],
  [
    'doc_mentions_unzip_pending',
    includesAny(doc, ['APK 압축 해제', '압축 해제']) && doc.includes('Pending'),
    'Run #38 artifact refresh doc should keep unzip Pending',
  ],
  [
    'doc_mentions_app_debug_apk_pending',
    doc.includes('app-debug.apk') && doc.includes('Pending'),
    'Run #38 artifact refresh doc should keep app-debug.apk Pending',
  ],
  [
    'doc_mentions_adb_pending',
    doc.includes('ADB') && doc.includes('Pending'),
    'Run #38 artifact refresh doc should keep ADB Pending',
  ],
  [
    'doc_mentions_apk_install_pending',
    doc.includes('APK 설치') && doc.includes('Pending'),
    'Run #38 artifact refresh doc should keep APK install Pending',
  ],
  [
    'doc_mentions_app_launch_pending',
    doc.includes('앱 실행') && doc.includes('Pending'),
    'Run #38 artifact refresh doc should keep app launch Pending',
  ],
  [
    'doc_mentions_device_qa_blocked',
    doc.includes('Android 실제 기기 QA') && doc.includes('Blocked'),
    'Run #38 artifact refresh doc should keep Android device QA Blocked',
  ],
  [
    'doc_mentions_emulator_pending',
    doc.includes('Android Emulator QA') && doc.includes('Pending'),
    'Run #38 artifact refresh doc should keep Android Emulator QA Pending',
  ],
  [
    'doc_mentions_todo_wording_fixes',
    doc.includes('실제 스토어 스크린샷 이미지 시작') &&
      doc.includes('서양식 보정 적용 여부') &&
      doc.includes('양력/음력 샘플 추가 검증'),
    'Run #38 artifact refresh doc should mention TODO wording fixes',
  ],
  [
    'doc_does_not_claim_actual_done',
    !includesAny(doc, [
      'artifact 실제 다운로드 완료',
      'APK 설치 완료',
      '앱 실행 완료',
      '실제 기기 QA 완료',
      'Emulator QA 완료',
      '스토어 스크린샷 이미지 시작 완료',
    ]),
    'Run #38 artifact refresh doc should not claim actual work completed',
  ],
];

for (const [id, pass, message] of docChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const todoChecks = [
  ['todo_has_no_old_screenshot_start_wording', !todo.includes(oldTodoMarkers[0]), 'TODO should not contain old screenshot start wording'],
  ['todo_has_screenshot_production_wording', todo.includes('실제 스토어 스크린샷 이미지 시작'), 'TODO should contain normalized screenshot start wording'],
  ['todo_has_no_western_time_wording', !todo.includes(oldTodoMarkers[1]), 'TODO should not contain old western correction wording'],
  ['todo_has_solar_time_wording', todo.includes('서양식 보정 적용 여부'), 'TODO should contain normalized western correction wording'],
  ['todo_has_no_solar_lunar_sample_wording', !todo.includes(oldTodoMarkers[2]), 'TODO should not contain old solar/lunar sample wording'],
  ['todo_has_lunar_leap_month_wording', todo.includes('양력/음력 샘플 추가 검증'), 'TODO should contain normalized solar/lunar sample wording'],
];

for (const [id, pass, message] of todoChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const screenshotFolders = ['docs/store-screenshots', 'public/store-screenshots', 'store-screenshots'];
const noScreenshotImageFilesAdded = screenshotFolders.every((relativePath) => !fileExists(relativePath));
logResult('no_screenshot_image_files_added', noScreenshotImageFilesAdded);
assertCondition(noScreenshotImageFilesAdded, 'store screenshot image folders should not be added');

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

const paymentSdkMarkers = ['billing', 'purchase', 'revenuecat', 'iamport', 'tosspayments'];
const noPaymentSdkAdded = dependencyNames.every((packageName) => {
  const normalizedName = packageName.toLowerCase();
  return paymentSdkMarkers.every((marker) => !normalizedName.includes(marker));
});
logResult('no_payment_sdk_added', noPaymentSdkAdded);
assertCondition(noPaymentSdkAdded, 'payment SDK dependencies should not be added');

const noCapacitorAppAdded = !dependencyNames.includes('@capacitor/app');
logResult('no_capacitor_app_added', noCapacitorAppAdded);
assertCondition(noCapacitorAppAdded, '@capacitor/app should not be added in this PR');

if (failures.length > 0) {
  console.error('Android debug APK artifact refresh run38 check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android debug APK artifact refresh run38 check passed');
}
