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

const resultDocPath = 'docs/STORE_SCREENSHOT_CAPTURE_QA_RESULT.md';
const resultDocExists = fileExists(resultDocPath);
logResult('store_screenshot_capture_qa_result_doc_exists', resultDocExists);
assertCondition(resultDocExists, 'docs/STORE_SCREENSHOT_CAPTURE_QA_RESULT.md should exist');

const doc = resultDocExists ? readText(resultDocPath) : '';
const docChecks = [
  ['doc_mentions_service_name', doc.includes('하루풀이'), 'capture QA result doc should mention service name'],
  [
    'doc_mentions_screenshot_pending',
    doc.includes('스크린샷 실제 이미지 생성 상태') && doc.includes('Pending'),
    'capture QA result doc should mention screenshot image generation is Pending',
  ],
  [
    'doc_mentions_sample_profile',
    doc.includes('STORE_SCREENSHOT_SAMPLE_PROFILE.md'),
    'capture QA result doc should mention sample profile doc',
  ],
  [
    'doc_mentions_screenshot_readiness',
    doc.includes('GOOGLE_PLAY_SCREENSHOT_READINESS.md'),
    'capture QA result doc should mention screenshot readiness doc',
  ],
  [
    'doc_mentions_data_safety_input_readiness',
    doc.includes('GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md'),
    'capture QA result doc should mention data safety input readiness doc',
  ],
  ['doc_mentions_capture_targets', doc.includes('캡처 대상 화면'), 'capture QA result doc should mention capture targets'],
  ['doc_mentions_saved_reading_label', doc.includes('저장한 풀이'), 'capture QA result doc should mention 저장한 풀이'],
  ['doc_has_no_old_saved_reading_label', !doc.includes('저장한 운세'), 'capture QA result doc should not mention old saved reading label'],
  ['doc_mentions_avoid_claim', doc.includes('투자하면 성공합니다'), 'capture QA result doc should mention avoid claim'],
  ['doc_has_no_wrong_avoid_claim', !doc.includes('사자라면 성공합니다'), 'capture QA result doc should not mention old wrong avoid claim'],
  ['doc_mentions_sensitive_info_check', doc.includes('민감정보 점검 기준'), 'capture QA result doc should mention sensitive info checklist'],
  [
    'doc_mentions_no_real_user_data',
    includesAny(doc, ['실제 이름 사용 금지', '실제 생년월일 사용 금지']),
    'capture QA result doc should mention no real user data',
  ],
  [
    'doc_mentions_no_actual_screenshot_files',
    includesAny(doc, ['실제 스토어 스크린샷 이미지 제작 미진행', '실제 스크린샷 이미지 생성']),
    'capture QA result doc should mention actual screenshot images are not created',
  ],
  [
    'doc_mentions_google_play_upload_not_started',
    includesAny(doc, ['Google Play Console 스크린샷 업로드 미진행', 'Not started']),
    'capture QA result doc should mention Google Play screenshot upload is not started',
  ],
  [
    'doc_does_not_claim_capture_completed',
    !includesAny(doc, ['실제 캡처 완료', '스크린샷 제작 완료', '캡처 완료']),
    'capture QA result doc should not claim capture is completed',
  ],
];

for (const [id, pass, message] of docChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const googlePlayScreenshotReadinessDocExists = fileExists('docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md');
logResult('google_play_screenshot_readiness_doc_exists', googlePlayScreenshotReadinessDocExists);
assertCondition(googlePlayScreenshotReadinessDocExists, 'docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md should exist');

const storeScreenshotSampleProfileDocExists = fileExists('docs/STORE_SCREENSHOT_SAMPLE_PROFILE.md');
logResult('store_screenshot_sample_profile_doc_exists', storeScreenshotSampleProfileDocExists);
assertCondition(storeScreenshotSampleProfileDocExists, 'docs/STORE_SCREENSHOT_SAMPLE_PROFILE.md should exist');

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
  console.error('Store screenshot capture QA result check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Store screenshot capture QA result check passed');
}
