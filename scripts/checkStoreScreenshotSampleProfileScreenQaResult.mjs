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

const resultDocPath = 'docs/STORE_SCREENSHOT_SAMPLE_PROFILE_SCREEN_QA_RESULT.md';
const resultDocExists = fileExists(resultDocPath);
logResult('sample_profile_screen_qa_doc_exists', resultDocExists);
assertCondition(resultDocExists, 'docs/STORE_SCREENSHOT_SAMPLE_PROFILE_SCREEN_QA_RESULT.md should exist');

const doc = resultDocExists ? readText(resultDocPath) : '';
const docChecks = [
  ['doc_mentions_service_name', doc.includes('하루풀이'), 'sample profile screen QA doc should mention service name'],
  [
    'doc_mentions_sample_profile_pending',
    doc.includes('테스트용 샘플 프로필 실제 입력 상태') && doc.includes('Pending'),
    'sample profile screen QA doc should mention sample profile input is Pending',
  ],
  [
    'doc_mentions_screen_check_pending',
    doc.includes('주요 화면 확인 상태') && doc.includes('Pending'),
    'sample profile screen QA doc should mention screen check is Pending',
  ],
  [
    'doc_mentions_android_device_pending',
    doc.includes('Android 실제 기기 또는 에뮬레이터 확인 상태') && doc.includes('Pending'),
    'sample profile screen QA doc should mention Android device or emulator check is Pending',
  ],
  [
    'doc_mentions_screenshot_pending',
    doc.includes('실제 스크린샷 이미지 생성 상태') && doc.includes('Pending'),
    'sample profile screen QA doc should mention screenshot image generation is Pending',
  ],
  [
    'doc_mentions_store_screenshot_sample_profile',
    doc.includes('STORE_SCREENSHOT_SAMPLE_PROFILE.md'),
    'sample profile screen QA doc should mention sample profile doc',
  ],
  [
    'doc_mentions_capture_qa_result',
    doc.includes('STORE_SCREENSHOT_CAPTURE_QA_RESULT.md'),
    'sample profile screen QA doc should mention capture QA result doc',
  ],
  ['doc_mentions_screen_targets', doc.includes('화면 확인 대상'), 'sample profile screen QA doc should mention screen targets'],
  ['doc_mentions_saved_reading_label', doc.includes('저장한 풀이'), 'sample profile screen QA doc should mention 저장한 풀이'],
  ['doc_has_no_old_saved_reading_label', !doc.includes('저장한 운세'), 'sample profile screen QA doc should not mention old saved reading label'],
  ['doc_mentions_avoid_claim', doc.includes('투자하면 성공합니다'), 'sample profile screen QA doc should mention avoid claim'],
  ['doc_has_no_wrong_avoid_claim', !doc.includes('사자라면 성공합니다'), 'sample profile screen QA doc should not mention old wrong avoid claim'],
  [
    'doc_mentions_no_real_user_name',
    includesAny(doc, ['실제 사용자의 이름을 사용하지 않습니다', '실제 이름 사용 금지']),
    'sample profile screen QA doc should mention no real user name',
  ],
  [
    'doc_mentions_no_real_birthdate',
    includesAny(doc, ['실제 사용자의 생년월일을 사용하지 않습니다', '실제 생년월일 사용 금지']),
    'sample profile screen QA doc should mention no real birthdate',
  ],
  [
    'doc_mentions_reference_notice',
    includesAny(doc, ['참고용 콘텐츠', '전문적인 자문을 대체하지 않는다는']),
    'sample profile screen QA doc should mention reference notice',
  ],
  [
    'doc_does_not_claim_screen_check_completed',
    !includesAny(doc, ['주요 화면 확인 완료', '실제 입력 완료', '캡처 완료', '스크린샷 제작 완료']),
    'sample profile screen QA doc should not claim screen check or capture is completed',
  ],
];

for (const [id, pass, message] of docChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const storeScreenshotCaptureQaResultDocExists = fileExists('docs/STORE_SCREENSHOT_CAPTURE_QA_RESULT.md');
logResult('store_screenshot_capture_qa_result_doc_exists', storeScreenshotCaptureQaResultDocExists);
assertCondition(storeScreenshotCaptureQaResultDocExists, 'docs/STORE_SCREENSHOT_CAPTURE_QA_RESULT.md should exist');

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
  console.error('Store screenshot sample profile screen QA result check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Store screenshot sample profile screen QA result check passed');
}
