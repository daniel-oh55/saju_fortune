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

const readinessDocPath = 'docs/PRIVACY_POLICY_URL_READINESS.md';
const readinessDocExists = fileExists(readinessDocPath);
logResult('privacy_url_doc_exists', readinessDocExists);
assertCondition(readinessDocExists, 'docs/PRIVACY_POLICY_URL_READINESS.md should exist');

const doc = readinessDocExists ? readText(readinessDocPath) : '';

const docChecks = [
  [
    'doc_mentions_privacy_policy_url',
    includesAny(doc, ['개인정보 처리방침 URL', 'privacy policy URL']),
    'privacy URL readiness doc should mention privacy policy URL',
  ],
  ['doc_mentions_localstorage', doc.includes('localStorage'), 'privacy URL readiness doc should mention localStorage'],
  [
    'doc_mentions_no_server_db',
    includesAny(doc, ['서버 DB 없음', '서버 데이터베이스 없이']),
    'privacy URL readiness doc should mention no server DB',
  ],
  [
    'doc_mentions_no_login',
    includesAny(doc, ['로그인 없음', '로그인 미구현']),
    'privacy URL readiness doc should mention no login',
  ],
  [
    'doc_mentions_no_real_ad_sdk',
    includesAny(doc, ['실제 광고 SDK 없음', '실제 광고 SDK 미연동']),
    'privacy URL readiness doc should mention no real ad SDK',
  ],
  [
    'doc_mentions_no_payment_sdk',
    includesAny(doc, ['실제 결제 SDK 없음', '실제 결제 SDK 미연동']),
    'privacy URL readiness doc should mention no payment SDK',
  ],
  [
    'doc_mentions_data_items',
    includesAll(doc, ['프로필 정보', '운세 cache', '동의 설정', '저장한 풀이', '방문 streak']),
    'privacy URL readiness doc should list current localStorage data items',
  ],
  [
    'doc_mentions_external_url_options',
    includesAny(doc, ['Vercel', 'GitHub Pages']),
    'privacy URL readiness doc should mention external URL options',
  ],
  [
    'doc_mentions_https',
    includesAny(doc, ['HTTPS', 'https']),
    'privacy URL readiness doc should mention HTTPS',
  ],
  [
    'doc_mentions_internal_privacy_page',
    includesAny(doc, ['PrivacyInfoPage', '앱 내부 개인정보 안내']),
    'privacy URL readiness doc should mention internal privacy page',
  ],
  ['doc_mentions_google_play', doc.includes('Google Play'), 'privacy URL readiness doc should mention Google Play'],
  [
    'doc_mentions_data_safety',
    includesAny(doc, ['데이터 보안', 'Data Safety']),
    'privacy URL readiness doc should mention Data Safety',
  ],
  [
    'doc_mentions_reference_notice',
    includesAny(doc, ['참고용', '전문적인 자문을 대체하지 않습니다']),
    'privacy URL readiness doc should include reference notice',
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
  console.error('Privacy policy URL readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Privacy policy URL readiness check passed');
}
