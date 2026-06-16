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

const inputReadinessDocPath = 'docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md';
const inputReadinessDocExists = fileExists(inputReadinessDocPath);
logResult('data_safety_input_readiness_doc_exists', inputReadinessDocExists);
assertCondition(inputReadinessDocExists, 'docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md should exist');

const doc = inputReadinessDocExists ? readText(inputReadinessDocPath) : '';
const docChecks = [
  ['doc_mentions_google_play_console', doc.includes('Google Play Console'), 'input readiness doc should mention Google Play Console'],
  ['doc_mentions_data_safety_form', doc.includes('데이터 보안 양식'), 'input readiness doc should mention data safety form'],
  [
    'doc_mentions_not_started',
    includesAny(doc, ['Not started', '미진행']),
    'input readiness doc should mention Not started or not done',
  ],
  [
    'doc_mentions_no_actual_input',
    includesAny(doc, ['실제 입력 금지', '실제 입력은 후속 단계']),
    'input readiness doc should mention actual input is blocked or later',
  ],
  ['doc_mentions_localstorage', doc.includes('localStorage'), 'input readiness doc should mention localStorage'],
  [
    'doc_mentions_no_server_db',
    includesAny(doc, ['서버 DB는 사용하지 않습니다', '서버 DB 없음']),
    'input readiness doc should mention no server DB',
  ],
  [
    'doc_mentions_no_login',
    includesAny(doc, ['로그인 기능은 없습니다', '로그인 없음']),
    'input readiness doc should mention no login',
  ],
  [
    'doc_mentions_no_real_ad_sdk',
    includesAny(doc, ['실제 광고 SDK는 연결되어 있지 않습니다', '실제 광고 SDK 없음']),
    'input readiness doc should mention no real ad SDK',
  ],
  [
    'doc_mentions_no_payment_sdk',
    includesAny(doc, ['실제 결제 SDK는 연결되어 있지 않습니다', '실제 결제 SDK 없음']),
    'input readiness doc should mention no payment SDK',
  ],
  [
    'doc_mentions_no_analytics_sdk',
    includesAny(doc, ['외부 분석 SDK는 연결되어 있지 않습니다', '외부 분석 SDK 없음']),
    'input readiness doc should mention no analytics SDK',
  ],
  [
    'doc_mentions_no_third_party_sharing',
    includesAny(doc, ['제3자 공유 없음', '제3자에게 사용자 데이터를 공유하지 않습니다']),
    'input readiness doc should mention no third-party sharing',
  ],
  [
    'doc_mentions_delete_method',
    includesAny(doc, ['데이터 삭제', 'Android 앱 데이터 삭제']),
    'input readiness doc should mention data deletion method',
  ],
  [
    'doc_mentions_privacy_policy_url_pending',
    doc.includes('개인정보 처리방침 URL') && includesAny(doc, ['Pending', '미확정']),
    'input readiness doc should mention privacy policy URL pending',
  ],
  [
    'doc_mentions_contact_pending',
    doc.includes('문의처') && includesAny(doc, ['Pending', '미확정']),
    'input readiness doc should mention contact pending',
  ],
  [
    'doc_mentions_blocking_conditions',
    doc.includes('입력 차단 조건'),
    'input readiness doc should mention blocking conditions',
  ],
  ['doc_mentions_privacy_info_page', doc.includes('PrivacyInfoPage'), 'input readiness doc should mention PrivacyInfoPage'],
  [
    'doc_mentions_public_privacy_page',
    doc.includes('public/privacy/index.html'),
    'input readiness doc should mention public privacy page',
  ],
  [
    'doc_does_not_claim_console_input_done',
    !includesAny(doc, ['Console 입력 완료', '데이터 보안 양식 최종 입력 완료', '최종 제출 완료']),
    'input readiness doc should not claim Console input is done',
  ],
];

for (const [id, pass, message] of docChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const privacyPolicyContactReadinessDocExists = fileExists('docs/PRIVACY_POLICY_CONTACT_READINESS.md');
logResult('privacy_policy_contact_readiness_doc_exists', privacyPolicyContactReadinessDocExists);
assertCondition(privacyPolicyContactReadinessDocExists, 'docs/PRIVACY_POLICY_CONTACT_READINESS.md should exist');

const privacyPolicyLiveUrlResultDocExists = fileExists('docs/PRIVACY_POLICY_LIVE_URL_RESULT.md');
logResult('privacy_policy_live_url_result_doc_exists', privacyPolicyLiveUrlResultDocExists);
assertCondition(privacyPolicyLiveUrlResultDocExists, 'docs/PRIVACY_POLICY_LIVE_URL_RESULT.md should exist');

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
  console.error('Google Play data safety input readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Google Play data safety input readiness check passed');
}
