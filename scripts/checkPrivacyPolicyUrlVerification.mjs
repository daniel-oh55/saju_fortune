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

const verificationDocPath = 'docs/PRIVACY_POLICY_URL_VERIFICATION.md';
const verificationDocExists = fileExists(verificationDocPath);
logResult('verification_doc_exists', verificationDocExists);
assertCondition(verificationDocExists, 'docs/PRIVACY_POLICY_URL_VERIFICATION.md should exist');

const doc = verificationDocExists ? readText(verificationDocPath) : '';
const docChecks = [
  [
    'doc_mentions_public_privacy_page',
    doc.includes('public/privacy/index.html'),
    'verification doc should mention public/privacy/index.html',
  ],
  ['doc_mentions_privacy_route', doc.includes('/privacy/'), 'verification doc should mention /privacy/'],
  [
    'doc_mentions_https_url',
    includesAny(doc, ['HTTPS', 'https://<vercel-domain>/privacy/']),
    'verification doc should mention HTTPS URL requirement',
  ],
  [
    'doc_mentions_pending_status',
    includesAny(doc, ['Pending', '미진행']),
    'verification doc should mention pending or not-done status',
  ],
  [
    'doc_mentions_no_google_play_console_input',
    doc.includes('Google Play Console 입력 미진행'),
    'verification doc should mention Google Play Console input is not done',
  ],
  ['doc_mentions_service_name', doc.includes('하루풀이'), 'verification doc should mention service name'],
  ['doc_mentions_localstorage', doc.includes('localStorage'), 'verification doc should mention localStorage'],
  [
    'doc_mentions_no_server_db',
    includesAny(doc, ['서버 DB 없음', '서버 데이터베이스']),
    'verification doc should mention no server DB',
  ],
  [
    'doc_mentions_no_real_ad_sdk',
    includesAny(doc, ['실제 광고 SDK 없음', '실제 광고 SDK 미연동']),
    'verification doc should mention no real ad SDK',
  ],
  [
    'doc_mentions_no_payment_sdk',
    includesAny(doc, ['실제 결제 SDK 없음', '실제 결제 SDK 미연동']),
    'verification doc should mention no payment SDK',
  ],
  [
    'doc_mentions_no_analytics_sdk',
    includesAny(doc, ['외부 분석 SDK 없음', '외부 분석 SDK']),
    'verification doc should mention no external analytics SDK',
  ],
  [
    'doc_mentions_delete_method',
    includesAny(doc, ['데이터 삭제 방법', '데이터 삭제']),
    'verification doc should mention data deletion method',
  ],
  [
    'doc_mentions_reference_notice',
    includesAny(doc, ['참고용 콘텐츠', '전문적인 자문을 대체하지 않습니다']),
    'verification doc should mention reference notice',
  ],
  [
    'doc_mentions_google_play_precondition',
    doc.includes('Google Play Console에 개인정보 처리방침 URL을 입력하기 전'),
    'verification doc should mention Google Play Console privacy URL precondition',
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
const publicPrivacyPageChecks = [
  [
    'public_privacy_page_mentions_correct_brand',
    publicPrivacyPage.includes('하루풀이'),
    'public privacy page should mention correct brand',
  ],
  [
    'public_privacy_page_has_no_external_script',
    !publicPrivacyPage.includes('<script src='),
    'public privacy page should not include external script tags',
  ],
  ['public_privacy_page_has_no_form', !publicPrivacyPage.includes('<form'), 'public privacy page should not include forms'],
];

for (const [id, pass, message] of publicPrivacyPageChecks) {
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
  console.error('Privacy policy URL verification check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Privacy policy URL verification check passed');
}
