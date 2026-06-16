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

const inputReadinessDocPath = 'docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md';
const inputReadinessDocExists = fileExists(inputReadinessDocPath);
logResult('input_readiness_doc_exists', inputReadinessDocExists);
assertCondition(inputReadinessDocExists, 'docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md should exist');

const doc = inputReadinessDocExists ? readText(inputReadinessDocPath) : '';

const docChecks = [
  ['doc_mentions_google_play_console', doc.includes('Google Play Console'), 'input readiness doc should mention Google Play Console'],
  ['doc_mentions_privacy_policy_url', doc.includes('개인정보 처리방침 URL'), 'input readiness doc should mention privacy policy URL'],
  ['doc_mentions_privacy_route', doc.includes('/privacy/'), 'input readiness doc should mention /privacy/'],
  [
    'doc_mentions_expected_url_format',
    doc.includes('https://<vercel-domain>/privacy/'),
    'input readiness doc should mention expected URL format',
  ],
  [
    'doc_mentions_pending_status',
    includesAny(doc, ['Pending', '미확정']),
    'input readiness doc should mention Pending or undecided status',
  ],
  [
    'doc_mentions_not_started',
    includesAny(doc, ['Not started', '미진행']),
    'input readiness doc should mention Not started or not-done status',
  ],
  [
    'doc_mentions_no_actual_input',
    includesAny(doc, ['실제 입력 금지', '실제 입력은 후속 단계']),
    'input readiness doc should say actual input is blocked or follow-up',
  ],
  ['doc_mentions_required_preconditions', doc.includes('입력 전 필수 조건'), 'input readiness doc should mention required preconditions'],
  ['doc_mentions_blocking_conditions', doc.includes('입력 차단 조건'), 'input readiness doc should mention blocking conditions'],
  ['doc_mentions_service_name', doc.includes('하루풀이'), 'input readiness doc should mention service name'],
  ['doc_mentions_localstorage', doc.includes('localStorage'), 'input readiness doc should mention localStorage'],
  [
    'doc_mentions_no_server_db',
    includesAny(doc, ['서버 DB 없음', '서버 DB']),
    'input readiness doc should mention no server DB',
  ],
  [
    'doc_mentions_no_real_ad_sdk',
    includesAny(doc, ['실제 광고 SDK 없음', '실제 광고 SDK']),
    'input readiness doc should mention no real ad SDK',
  ],
  [
    'doc_mentions_no_payment_sdk',
    includesAny(doc, ['실제 결제 SDK 없음', '실제 결제 SDK']),
    'input readiness doc should mention no payment SDK',
  ],
  [
    'doc_mentions_no_analytics_sdk',
    includesAny(doc, ['외부 분석 SDK 없음', '외부 분석 SDK']),
    'input readiness doc should mention no external analytics SDK',
  ],
  [
    'doc_mentions_data_safety_alignment',
    includesAny(doc, ['데이터 보안 양식', '데이터 보안 양식 초안']),
    'input readiness doc should mention data safety alignment',
  ],
  ['doc_mentions_privacy_info_page_alignment', doc.includes('PrivacyInfoPage'), 'input readiness doc should mention PrivacyInfoPage alignment'],
  [
    'doc_does_not_claim_console_input_done',
    includesAny(doc, ['입력 상태 | Not started', 'Google Play Console 입력 상태: Not started', 'Google Play Console 개인정보 처리방침 URL 입력 미진행']) &&
      !doc.includes('입력 완료'),
    'input readiness doc should not claim Google Play Console input is done',
  ],
];

for (const [id, pass, message] of docChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const liveUrlResultDocPath = 'docs/PRIVACY_POLICY_LIVE_URL_RESULT.md';
const liveUrlResultDocExists = fileExists(liveUrlResultDocPath);
logResult('live_url_result_doc_exists', liveUrlResultDocExists);
assertCondition(liveUrlResultDocExists, 'docs/PRIVACY_POLICY_LIVE_URL_RESULT.md should exist');

const liveUrlResultDoc = liveUrlResultDocExists ? readText(liveUrlResultDocPath) : '';
const liveUrlResultMentionsPending = liveUrlResultDoc.includes('Pending');
logResult('live_url_result_mentions_pending', liveUrlResultMentionsPending);
assertCondition(liveUrlResultMentionsPending, 'live URL result doc should mention Pending');

const publicPrivacyPagePath = 'public/privacy/index.html';
const publicPrivacyPageExists = fileExists(publicPrivacyPagePath);
logResult('public_privacy_page_exists', publicPrivacyPageExists);
assertCondition(publicPrivacyPageExists, 'public/privacy/index.html should exist');

const publicPrivacyPage = publicPrivacyPageExists ? readText(publicPrivacyPagePath) : '';
const publicPrivacyPageMentionsCorrectBrand = publicPrivacyPage.includes('하루풀이');
logResult('public_privacy_page_mentions_correct_brand', publicPrivacyPageMentionsCorrectBrand);
assertCondition(publicPrivacyPageMentionsCorrectBrand, 'public privacy page should mention correct brand');

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
  console.error('Google Play privacy URL input readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Google Play privacy URL input readiness check passed');
}
