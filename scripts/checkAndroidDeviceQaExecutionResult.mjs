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

const resultDocPath = 'docs/ANDROID_DEVICE_QA_EXECUTION_RESULT.md';
const resultDocExists = fileExists(resultDocPath);
logResult('android_device_qa_execution_result_doc_exists', resultDocExists);
assertCondition(resultDocExists, 'docs/ANDROID_DEVICE_QA_EXECUTION_RESULT.md should exist');

const doc = resultDocExists ? readText(resultDocPath) : '';
const docChecks = [
  ['doc_mentions_service_name', doc.includes('하루풀이'), 'Android device QA execution result should mention service name'],
  ['doc_mentions_run_34', includesAny(doc, ['run: #34', 'run #34']), 'Android device QA execution result should mention run #34'],
  [
    'doc_mentions_debug_build_success',
    doc.includes('Android Debug Build 상태') && doc.includes('success'),
    'Android device QA execution result should mention Android Debug Build success',
  ],
  ['doc_mentions_artifact', doc.includes('harupuli-debug-apk'), 'Android device QA execution result should mention artifact'],
  ['doc_mentions_artifact_id', doc.includes('7661684907'), 'Android device QA execution result should mention artifact id'],
  [
    'doc_mentions_artifact_digest',
    doc.includes('sha256:f7192602896ceba827ac80ec1de8f24168eff5cd9d8ccaa4aa0c0e09bb2c18ca'),
    'Android device QA execution result should mention artifact digest',
  ],
  [
    'doc_mentions_device_qa_blocked',
    doc.includes('Android 실제 기기 QA 상태') && doc.includes('Blocked'),
    'Android device QA execution result should keep device QA Blocked',
  ],
  [
    'doc_mentions_emulator_pending',
    doc.includes('Android Emulator QA 상태') && doc.includes('Pending'),
    'Android device QA execution result should keep emulator QA Pending',
  ],
  [
    'doc_mentions_apk_install_pending',
    includesAny(doc, ['APK 실제 설치 상태', 'APK 설치']) && doc.includes('Pending'),
    'Android device QA execution result should mention APK install Pending',
  ],
  [
    'doc_mentions_app_launch_pending',
    includesAny(doc, ['앱 실제 실행 상태', '앱 실행']) && doc.includes('Pending'),
    'Android device QA execution result should mention app launch Pending',
  ],
  [
    'doc_mentions_localstorage_pending',
    doc.includes('localStorage 유지') && doc.includes('Pending'),
    'Android device QA execution result should mention localStorage Pending',
  ],
  [
    'doc_mentions_back_button_pending',
    doc.includes('Android back button') && doc.includes('Pending'),
    'Android device QA execution result should mention back button Pending',
  ],
  [
    'doc_mentions_icon_splash_pending',
    includesAny(doc, ['launcher icon', 'splash']) && doc.includes('Pending'),
    'Android device QA execution result should mention icon or splash Pending',
  ],
  [
    'doc_mentions_sample_profile_pending',
    doc.includes('테스트용 샘플 프로필 입력') && doc.includes('Pending'),
    'Android device QA execution result should mention sample profile Pending',
  ],
  ['doc_mentions_blocked_conditions', doc.includes('Blocked 조건'), 'Android device QA execution result should mention Blocked conditions'],
  [
    'doc_does_not_claim_qa_passed',
    !includesAny(doc, ['QA Pass', '실제 기기 QA 완료', 'APK 설치 완료', '앱 실행 완료', '화면 확인 완료']),
    'Android device QA execution result should not claim QA passed or completed',
  ],
];

for (const [id, pass, message] of docChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const linkedDocs = [
  ['android_device_qa_runbook_exists', 'docs/ANDROID_DEVICE_QA_RUNBOOK.md'],
  ['android_webview_localstorage_qa_result_exists', 'docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA_RESULT.md'],
  ['android_back_button_qa_result_exists', 'docs/ANDROID_BACK_BUTTON_QA_RESULT.md'],
  ['android_icon_splash_qa_result_exists', 'docs/ANDROID_ICON_SPLASH_QA_RESULT.md'],
  ['store_screenshot_sample_profile_screen_qa_result_exists', 'docs/STORE_SCREENSHOT_SAMPLE_PROFILE_SCREEN_QA_RESULT.md'],
];

for (const [id, relativePath] of linkedDocs) {
  const exists = fileExists(relativePath);
  logResult(id, exists);
  assertCondition(exists, `${relativePath} should exist`);
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
  console.error('Android device QA execution result check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android device QA execution result check passed');
}
