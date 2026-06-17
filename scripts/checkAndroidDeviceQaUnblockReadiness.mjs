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

const unblockDocPath = 'docs/ANDROID_DEVICE_QA_UNBLOCK_READINESS.md';
const unblockDocExists = fileExists(unblockDocPath);
logResult('android_device_qa_unblock_readiness_doc_exists', unblockDocExists);
assertCondition(unblockDocExists, 'docs/ANDROID_DEVICE_QA_UNBLOCK_READINESS.md should exist');

const doc = unblockDocExists ? readText(unblockDocPath) : '';
const docChecks = [
  ['doc_mentions_service_name', doc.includes('하루풀이'), 'Unblock readiness doc should mention service name'],
  ['doc_mentions_run_37', includesAny(doc, ['run number: #37', 'run #37']), 'Unblock readiness doc should mention run #37'],
  [
    'doc_mentions_head_sha',
    doc.includes('ce1b4996ccee5ab38913fae9d75fccb1bde45762'),
    'Unblock readiness doc should mention head sha',
  ],
  ['doc_mentions_artifact_name', doc.includes('harupuli-debug-apk'), 'Unblock readiness doc should mention artifact name'],
  ['doc_mentions_artifact_id', doc.includes('7685195152'), 'Unblock readiness doc should mention artifact id'],
  [
    'doc_mentions_artifact_digest',
    doc.includes('sha256:ac6b93b40bd50c786f0ac302844da12a946c4b3ec0d63b74d2c21527c8ab39e7'),
    'Unblock readiness doc should mention artifact digest',
  ],
  [
    'doc_mentions_device_qa_blocked',
    doc.includes('Android 실제 기기 QA') && doc.includes('Blocked'),
    'Unblock readiness doc should keep Android device QA Blocked',
  ],
  [
    'doc_mentions_emulator_pending',
    doc.includes('Android Emulator') && doc.includes('Pending'),
    'Unblock readiness doc should keep Android Emulator Pending',
  ],
  [
    'doc_mentions_adb_pending',
    doc.includes('ADB') && doc.includes('Pending'),
    'Unblock readiness doc should keep ADB Pending',
  ],
  [
    'doc_mentions_artifact_download_pending',
    doc.includes('artifact 다운로드') && doc.includes('Pending'),
    'Unblock readiness doc should keep artifact download Pending',
  ],
  [
    'doc_mentions_apk_install_pending',
    doc.includes('APK 설치') && doc.includes('Pending'),
    'Unblock readiness doc should keep APK install Pending',
  ],
  [
    'doc_mentions_app_launch_pending',
    doc.includes('앱 실행') && doc.includes('Pending'),
    'Unblock readiness doc should keep app launch Pending',
  ],
  ['doc_mentions_blocked_reason', doc.includes('Blocked 이유'), 'Unblock readiness doc should mention Blocked reason'],
  ['doc_mentions_unblock_conditions', doc.includes('Blocked 해소 조건'), 'Unblock readiness doc should mention unblock conditions'],
  ['doc_mentions_adb_devices', doc.includes('adb devices'), 'Unblock readiness doc should mention adb devices'],
  ['doc_mentions_logcat', doc.includes('logcat'), 'Unblock readiness doc should mention logcat'],
  [
    'doc_does_not_claim_qa_done',
    !includesAny(doc, ['QA Pass', 'Android 실제 기기 QA 완료', 'Android Emulator QA 완료', 'ADB 연결 완료', 'APK 설치 완료', '앱 실행 완료']),
    'Unblock readiness doc should not claim QA, ADB, APK install, or app launch completion',
  ],
];

for (const [id, pass, message] of docChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const linkedDocs = [
  ['install_launch_qa_result_doc_exists', 'docs/ANDROID_DEBUG_APK_INSTALL_LAUNCH_QA_RESULT.md'],
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
  console.error('Android device QA unblock readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android device QA unblock readiness check passed');
}
