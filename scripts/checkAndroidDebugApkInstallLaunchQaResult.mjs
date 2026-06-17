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

const resultDocPath = 'docs/ANDROID_DEBUG_APK_INSTALL_LAUNCH_QA_RESULT.md';
const resultDocExists = fileExists(resultDocPath);
logResult('android_debug_apk_install_launch_doc_exists', resultDocExists);
assertCondition(resultDocExists, 'docs/ANDROID_DEBUG_APK_INSTALL_LAUNCH_QA_RESULT.md should exist');

const doc = resultDocExists ? readText(resultDocPath) : '';
const docChecks = [
  ['doc_mentions_service_name', doc.includes('하루풀이'), 'Install/launch QA result doc should mention service name'],
  ['doc_mentions_android_debug_build', doc.includes('Android Debug Build'), 'Install/launch QA result doc should mention Android Debug Build'],
  ['doc_mentions_run_36', includesAny(doc, ['run number: #36', 'run #36']), 'Install/launch QA result doc should mention run #36'],
  [
    'doc_mentions_head_sha',
    doc.includes('ae8ddaf22d09f8ceae27d479fd30486cf87b41da'),
    'Install/launch QA result doc should mention head sha',
  ],
  ['doc_mentions_artifact_name', doc.includes('harupuli-debug-apk'), 'Install/launch QA result doc should mention artifact name'],
  ['doc_mentions_artifact_id', doc.includes('7684586472'), 'Install/launch QA result doc should mention artifact id'],
  [
    'doc_mentions_artifact_digest',
    doc.includes('sha256:1a86909598d36127b1c9503e3c4e4bb2054a1543afe7bc5f53256c639ce4adc2'),
    'Install/launch QA result doc should mention artifact digest',
  ],
  [
    'doc_mentions_artifact_download_pending',
    doc.includes('artifact 다운로드') && doc.includes('Pending'),
    'Install/launch QA result doc should keep artifact download Pending',
  ],
  [
    'doc_mentions_unzip_pending',
    doc.includes('압축 해제') && doc.includes('Pending'),
    'Install/launch QA result doc should keep unzip Pending',
  ],
  [
    'doc_mentions_app_debug_apk_pending',
    doc.includes('app-debug.apk') && doc.includes('Pending'),
    'Install/launch QA result doc should keep app-debug.apk check Pending',
  ],
  [
    'doc_mentions_adb_pending',
    doc.includes('ADB') && doc.includes('Pending'),
    'Install/launch QA result doc should keep ADB Pending',
  ],
  [
    'doc_mentions_apk_install_pending',
    doc.includes('APK 설치') && doc.includes('Pending'),
    'Install/launch QA result doc should keep APK install Pending',
  ],
  [
    'doc_mentions_app_launch_pending',
    doc.includes('앱 실행') && doc.includes('Pending'),
    'Install/launch QA result doc should keep app launch Pending',
  ],
  [
    'doc_mentions_device_qa_blocked',
    doc.includes('Android 실제 기기 QA') && doc.includes('Blocked'),
    'Install/launch QA result doc should keep Android device QA Blocked',
  ],
  [
    'doc_mentions_emulator_pending',
    doc.includes('Android Emulator QA') && doc.includes('Pending'),
    'Install/launch QA result doc should keep Android Emulator QA Pending',
  ],
  [
    'doc_mentions_crash_or_logcat',
    includesAny(doc, ['crash', 'logcat']),
    'Install/launch QA result doc should mention crash or logcat',
  ],
  ['doc_mentions_blocking_conditions', doc.includes('차단 조건'), 'Install/launch QA result doc should mention blocking conditions'],
  [
    'doc_does_not_claim_install_or_launch_done',
    !includesAny(doc, ['artifact 다운로드 완료', 'APK 설치 완료', '앱 실행 완료', 'QA Pass', '실제 기기 QA 완료']),
    'Install/launch QA result doc should not claim download, install, launch, or device QA completion',
  ],
];

for (const [id, pass, message] of docChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const linkedDocs = [
  ['handoff_readiness_doc_exists', 'docs/ANDROID_DEBUG_APK_QA_HANDOFF_READINESS.md'],
  ['android_device_qa_execution_result_doc_exists', 'docs/ANDROID_DEVICE_QA_EXECUTION_RESULT.md'],
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
  console.error('Android debug APK install launch QA result check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android debug APK install launch QA result check passed');
}
