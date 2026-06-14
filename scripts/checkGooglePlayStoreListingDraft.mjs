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

const storeListingDocPath = 'docs/GOOGLE_PLAY_STORE_LISTING_DRAFT.md';
const storeListingDocExists = fileExists(storeListingDocPath);
logResult('store_listing_doc_exists', storeListingDocExists);
assertCondition(storeListingDocExists, 'docs/GOOGLE_PLAY_STORE_LISTING_DRAFT.md should exist');

const doc = storeListingDocExists ? readText(storeListingDocPath) : '';

const docChecks = [
  ['doc_mentions_app_name', doc.includes('하루풀이'), 'store listing draft should mention 하루풀이'],
  [
    'doc_mentions_short_description',
    includesAny(doc, ['짧은 설명', '오늘의 운세와 사주 흐름']),
    'store listing draft should include short description',
  ],
  [
    'doc_mentions_long_description',
    includesAny(doc, ['긴 설명', '주요 기능']),
    'store listing draft should include long description',
  ],
  [
    'doc_mentions_reference_notice',
    includesAny(doc, ['참고용', '전문적인 자문을 대체하지 않습니다']),
    'store listing draft should include reference notice',
  ],
  [
    'doc_mentions_privacy',
    includesAny(doc, ['개인정보', 'localStorage']),
    'store listing draft should mention privacy or localStorage',
  ],
  [
    'doc_mentions_ads',
    includesAny(doc, ['광고', 'Contains ads']),
    'store listing draft should mention ads or Contains ads',
  ],
  [
    'doc_mentions_screenshots',
    doc.includes('스크린샷'),
    'store listing draft should mention screenshots',
  ],
  [
    'doc_mentions_pre_submit_checklist',
    includesAny(doc, ['스토어 제출 전 체크리스트', '제출 전 체크리스트']),
    'store listing draft should mention pre-submit checklist',
  ],
  [
    'doc_mentions_release_signing_not_done',
    includesAny(doc, ['release build 미진행', 'signing 미진행']),
    'store listing draft should mention release build or signing not done',
  ],
  [
    'doc_mentions_real_ad_sdk_not_added',
    includesAny(doc, ['실제 광고 SDK 미연동', '실제 광고 SDK가 아직 연결되어 있지 않습니다']),
    'store listing draft should mention real ad SDK is not added',
  ],
];

for (const [id, pass, message] of docChecks) {
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
  console.error('Google Play store listing draft check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Google Play store listing draft check passed');
}
