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

function includesAll(text, patterns) {
  return patterns.every((pattern) => text.includes(pattern));
}

const pagePath = 'public/privacy/index.html';
const publicPrivacyPageExists = fileExists(pagePath);
logResult('public_privacy_page_exists', publicPrivacyPageExists);
assertCondition(publicPrivacyPageExists, 'public/privacy/index.html should exist');

const page = publicPrivacyPageExists ? readText(pagePath) : '';

const pageChecks = [
  ['page_mentions_service_name', page.includes('하루풀리'), 'public privacy page should mention service name'],
  [
    'page_mentions_correct_service_name',
    page.includes('하루풀리'),
    'public privacy page should mention the correct service name',
  ],
  ['page_has_no_brand_typo', !page.includes('하루풀이'), 'public privacy page should not contain brand typo'],
  [
    'page_mentions_privacy_policy',
    page.includes('개인정보 처리방침'),
    'public privacy page should mention privacy policy',
  ],
  ['page_mentions_localstorage', page.includes('localStorage'), 'public privacy page should mention localStorage'],
  [
    'page_mentions_no_server_db',
    includesAny(page, ['서버 데이터베이스 없이', '서버로 전송하지 않습니다']),
    'public privacy page should mention no server DB or no server transfer',
  ],
  [
    'page_mentions_data_items',
    includesAll(page, ['프로필 정보', '운세 cache', '사주 분석 cache', '동의 설정', '저장한 운세', '방문 streak']),
    'public privacy page should list current data items',
  ],
  [
    'page_mentions_no_real_ad_sdk',
    includesAny(page, ['실제 광고 SDK는 연결되어 있지 않습니다', '실제 광고 SDK를 사용하지 않습니다']),
    'public privacy page should mention no real ad SDK',
  ],
  [
    'page_mentions_no_payment_sdk',
    includesAny(page, ['실제 결제 SDK는 연결되어 있지 않습니다', '실제 결제 SDK를 사용하지 않습니다']),
    'public privacy page should mention no payment SDK',
  ],
  [
    'page_mentions_no_analytics_sdk',
    includesAny(page, ['외부 분석 SDK', '실제 외부 분석 SDK는 연결되어 있지 않습니다']),
    'public privacy page should mention no external analytics SDK',
  ],
  [
    'page_mentions_delete_method',
    includesAny(page, ['데이터 삭제', 'adb shell pm clear com.harupuli.app']),
    'public privacy page should mention data deletion method',
  ],
  [
    'page_mentions_reference_notice',
    includesAny(page, ['참고용 콘텐츠', '전문적인 자문을 대체하지 않습니다']),
    'public privacy page should include reference notice',
  ],
  [
    'page_mentions_contact_pending',
    includesAny(page, ['문의처는 Google Play 제출 전 확정 필요', 'Google Play 제출 전 확정 필요']),
    'public privacy page should mention contact pending status',
  ],
  [
    'page_mentions_last_updated',
    includesAny(page, ['최종 수정일', '2026-06-16']),
    'public privacy page should mention last updated date',
  ],
  [
    'page_has_no_external_script',
    !/<script\s+src\s*=/i.test(page),
    'public privacy page should not include external script tags',
  ],
  ['page_has_no_form', !/<form\b/i.test(page), 'public privacy page should not include forms'],
];

for (const [id, pass, message] of pageChecks) {
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
  console.error('Public privacy policy page check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Public privacy policy page check passed');
}
