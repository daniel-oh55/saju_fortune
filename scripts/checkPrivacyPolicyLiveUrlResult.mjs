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

function extractLineValue(text, label) {
  const line = text
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`- ${label}:`) || entry.trim().startsWith(`${label}:`));
  if (!line) return '';
  return line.slice(line.indexOf(':') + 1).trim();
}

const liveUrlResultDocPath = 'docs/PRIVACY_POLICY_LIVE_URL_RESULT.md';
const liveUrlResultDocExists = fileExists(liveUrlResultDocPath);
logResult('live_url_result_doc_exists', liveUrlResultDocExists);
assertCondition(liveUrlResultDocExists, 'docs/PRIVACY_POLICY_LIVE_URL_RESULT.md should exist');

const doc = liveUrlResultDocExists ? readText(liveUrlResultDocPath) : '';
const currentResultSection = doc.split('## 4. 수동 확인 절차')[0] || doc;
const actualUrlValue = extractLineValue(doc, '실제 Vercel URL');
const actualStatusValue = extractLineValue(doc, '실제 URL 확인 상태');
const actualUrlIsPending = !actualUrlValue || includesAny(actualUrlValue, ['미확정', 'Pending', '<vercel-domain>']);
const actualUrlMatchesPrivacyPath =
  actualUrlValue.startsWith('https://') && actualUrlValue.includes('/privacy/') && !actualUrlValue.includes('<');
const statusIsPending = includesAny(actualStatusValue, ['Pending', '미확정', '미진행']);
const statusIsCompleted = includesAny(actualStatusValue, ['Completed', 'Pass']);
const pendingModeIsConsistent =
  actualUrlIsPending &&
  statusIsPending &&
  !currentResultSection.includes('Completed |') &&
  !currentResultSection.includes('| Completed') &&
  !currentResultSection.includes('| Pass');
const completedModeIsConsistent =
  !actualUrlIsPending &&
  actualUrlMatchesPrivacyPath &&
  statusIsCompleted &&
  includesAny(currentResultSection, ['Completed', 'Pass']) &&
  includesAll(doc, ['하루풀이', 'localStorage', '서버 DB 없음']);
const statusIsConsistent = pendingModeIsConsistent || completedModeIsConsistent;
const googlePlayConsoleInputNotDone = includesAny(doc, [
  'Google Play Console 입력 상태: 미진행',
  'Google Play Console 입력 상태: Not started',
  'Google Play Console 입력 | Not started',
  'Google Play Console 입력은 아직 진행하지 않습니다',
]);

const docChecks = [
  ['doc_mentions_privacy_route', doc.includes('/privacy/'), 'live URL result doc should mention /privacy/'],
  ['doc_mentions_vercel', doc.includes('Vercel'), 'live URL result doc should mention Vercel'],
  [
    'doc_mentions_expected_url_format_or_actual_url',
    doc.includes('https://<vercel-domain>/privacy/') || actualUrlMatchesPrivacyPath,
    'live URL result doc should mention expected Vercel URL format or an actual privacy URL',
  ],
  [
    'doc_mentions_actual_url_status',
    includesAny(doc, ['실제 URL 확인 상태', '실제 URL 확인은 Pending', 'Completed', 'Pass']),
    'live URL result doc should mention actual URL check status',
  ],
  [
    'doc_mentions_google_play_not_started',
    googlePlayConsoleInputNotDone,
    'live URL result doc should mention Google Play Console input is not started',
  ],
  ['doc_mentions_service_name', doc.includes('하루풀이'), 'live URL result doc should mention service name'],
  ['doc_mentions_localstorage', doc.includes('localStorage'), 'live URL result doc should mention localStorage'],
  [
    'doc_mentions_no_server_db',
    includesAny(doc, ['서버 DB 없음', '서버 DB']),
    'live URL result doc should mention no server DB',
  ],
  [
    'doc_mentions_no_real_ad_sdk',
    includesAny(doc, ['실제 광고 SDK 없음', '실제 광고 SDK']),
    'live URL result doc should mention no real ad SDK',
  ],
  [
    'doc_mentions_no_payment_sdk',
    includesAny(doc, ['실제 결제 SDK 없음', '실제 결제 SDK']),
    'live URL result doc should mention no payment SDK',
  ],
  [
    'doc_mentions_no_analytics_sdk',
    includesAny(doc, ['외부 분석 SDK 없음', '외부 분석 SDK']),
    'live URL result doc should mention no external analytics SDK',
  ],
  [
    'doc_mentions_delete_method',
    includesAny(doc, ['데이터 삭제 방법', '데이터 삭제']),
    'live URL result doc should mention data deletion method',
  ],
  [
    'doc_mentions_reference_notice',
    includesAny(doc, ['참고용 콘텐츠', '참고용 콘텐츠 고지']),
    'live URL result doc should mention reference notice',
  ],
  [
    'doc_mentions_completion_criteria',
    includesAny(doc, ['완료 처리 기준', 'Completed']),
    'live URL result doc should mention completion criteria',
  ],
  [
    'pending_or_completed_status_is_consistent',
    statusIsConsistent,
    'live URL result should be consistently Pending without an actual URL, or Completed/Pass with a real https /privacy/ URL',
  ],
  [
    'google_play_console_input_not_done',
    googlePlayConsoleInputNotDone,
    'Google Play Console input should remain Not started or not done',
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
  console.error('Privacy policy live URL result check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Privacy policy live URL result check passed');
}
