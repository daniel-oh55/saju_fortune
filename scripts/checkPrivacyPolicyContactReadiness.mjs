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

const contactDocPath = 'docs/PRIVACY_POLICY_CONTACT_READINESS.md';
const contactDocExists = fileExists(contactDocPath);
logResult('contact_readiness_doc_exists', contactDocExists);
assertCondition(contactDocExists, 'docs/PRIVACY_POLICY_CONTACT_READINESS.md should exist');

const doc = contactDocExists ? readText(contactDocPath) : '';
const docChecks = [
  ['doc_mentions_service_name', doc.includes('하루풀이'), 'contact readiness doc should mention service name'],
  [
    'doc_mentions_contact_status',
    includesAny(doc, ['문의처 상태', '개인정보 처리방침 문의처 상태']),
    'contact readiness doc should mention contact status',
  ],
  [
    'doc_mentions_pending_contact',
    includesAny(doc, ['Pending', '미확정']),
    'contact readiness doc should keep contact as Pending or undecided',
  ],
  [
    'doc_mentions_no_fake_contact',
    includesAny(doc, ['임의 이메일', '임의 연락처']),
    'contact readiness doc should mention fake contact information should not be written',
  ],
  [
    'doc_mentions_contact_candidate_types',
    doc.includes('문의처 후보 유형'),
    'contact readiness doc should mention contact candidate types',
  ],
  [
    'doc_mentions_google_play_developer_email',
    doc.includes('Google Play 개발자 계정 지원 이메일'),
    'contact readiness doc should mention Google Play developer account support email',
  ],
  [
    'doc_mentions_support_email',
    includesAny(doc, ['고객 지원 이메일', '개인정보 문의 전용 이메일']),
    'contact readiness doc should mention support email or privacy inquiry email',
  ],
  [
    'doc_mentions_confirmation_checklist',
    doc.includes('문의처 확정 전 확인 기준'),
    'contact readiness doc should mention confirmation checklist',
  ],
  [
    'doc_mentions_blocking_conditions',
    doc.includes('문의처 반영 차단 조건'),
    'contact readiness doc should mention blocking conditions',
  ],
  [
    'doc_mentions_privacy_policy_draft',
    doc.includes('docs/PRIVACY_POLICY_DRAFT.md'),
    'contact readiness doc should mention docs/PRIVACY_POLICY_DRAFT.md',
  ],
  [
    'doc_mentions_public_privacy_page',
    doc.includes('public/privacy/index.html'),
    'contact readiness doc should mention public/privacy/index.html',
  ],
  [
    'doc_mentions_privacy_info_page',
    doc.includes('PrivacyInfoPage'),
    'contact readiness doc should mention PrivacyInfoPage',
  ],
  [
    'doc_does_not_contain_placeholder_email',
    !includesAny(doc, ['test@example.com', 'example.com', 'no-reply@example.com']),
    'contact readiness doc should not contain placeholder email addresses',
  ],
  [
    'doc_does_not_claim_contact_finalized',
    !includesAny(doc, ['문의처 확정 완료', '실제 문의처 확정 완료', '문의처 상태: Completed', '문의처 상태: Pass']),
    'contact readiness doc should not claim contact is finalized',
  ],
];

for (const [id, pass, message] of docChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

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
  console.error('Privacy policy contact readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Privacy policy contact readiness check passed');
}
