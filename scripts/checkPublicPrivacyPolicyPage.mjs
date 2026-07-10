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

const pagePath = 'public/privacy-policy/index.html';
const publicPrivacyPageExists = fileExists(pagePath);
logResult('public_privacy_page_exists', publicPrivacyPageExists);
assertCondition(publicPrivacyPageExists, 'public/privacy-policy/index.html should exist');

const page = publicPrivacyPageExists ? readText(pagePath) : '';
const correctBrand = '하루풀이';
const typoBrand = '하루풀' + '리';

const pageChecks = [
  ['page_mentions_service_name', page.includes(correctBrand), 'public privacy page should mention service name'],
  ['page_has_no_brand_typo', !page.includes(typoBrand), 'public privacy page should not contain brand typo'],
  [
    'page_mentions_privacy_policy',
    page.includes('하루풀이 개인정보 처리방침'),
    'public privacy page should mention the privacy policy title',
  ],
  ['page_mentions_localstorage', page.includes('localStorage'), 'public privacy page should mention localStorage'],
  [
    'page_mentions_no_server_db',
    page.includes('현재 하루풀이는 서버 DB를 사용하지 않습니다.'),
    'public privacy page should mention no server DB',
  ],
  [
    'page_mentions_no_login',
    page.includes('현재 하루풀이는 로그인 기능을 사용하지 않습니다.'),
    'public privacy page should mention no login feature',
  ],
  [
    'page_mentions_data_items',
    includesAll(page, ['생년월일', '출생시간', '출생지역', '성별', '사용자가 입력한 프로필 정보', '저장한 운세/풀이 기록']),
    'public privacy page should list current data items',
  ],
  [
    'page_mentions_no_real_ad_sdk',
    page.includes('실제 광고 SDK'),
    'public privacy page should mention no real ad SDK',
  ],
  ['page_mentions_no_payment_sdk', page.includes('결제 SDK'), 'public privacy page should mention no payment SDK'],
  [
    'page_mentions_no_analytics_sdk',
    page.includes('외부 분석 SDK'),
    'public privacy page should mention no external analytics SDK',
  ],
  [
    'page_mentions_delete_method',
    includesAny(page, ['데이터 삭제', '앱 삭제']),
    'public privacy page should mention data deletion method',
  ],
  [
    'page_mentions_effective_date',
    page.includes('시행일: 2026년 7월 12일'),
    'public privacy page should mention the recorded effective date',
  ],
  [
    'page_mentions_contact_email',
    page.includes('support.hym@gmail.com'),
    'public privacy page should mention the recorded support contact email',
  ],
  ['page_has_no_script_tag', !/<script/i.test(page), 'public privacy page should not include script tags'],
  ['page_has_no_form', !/<form\b/i.test(page), 'public privacy page should not include forms'],
  [
    'page_has_no_external_resource',
    !/https?:\/\//.test(page) && !/<img/i.test(page) && !/<iframe/i.test(page) && !/<link\s+rel="stylesheet"/i.test(page),
    'public privacy page should not reference external links, images, iframes, or stylesheets',
  ],
];

for (const [id, pass, message] of pageChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const forbiddenPagePhrases = ['실제 스토어 스크린샷 이미지 시작', '서양식 보정 적용 여부', '양력/음력 샘플 추가 검증'];
for (const phrase of forbiddenPagePhrases) {
  const pass = !page.includes(phrase);
  logResult(`page_excludes_forbidden_phrase_${phrase}`, pass);
  assertCondition(pass, `public privacy page should not contain forbidden phrase: ${phrase}`);
}

const todoSource = readText('TODO.md');
const developmentLogSource = readText('DEVELOPMENT_LOG.md');
const changelogSource = readText('CHANGELOG.md');
const livingDocsSource = `${todoSource}\n${developmentLogSource}\n${changelogSource}`;

const requiredTodoPendingSnippets = [
  '- [ ] 문의처 이메일/지원 연락처 확정',
  '- [ ] 시행일 확정',
  '- [ ] 제공자 정보 확정',
  '- [ ] 개인정보 처리방침 URL 후보 선정',
  '- [ ] 개인정보 처리방침 URL 확정',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] Store screenshot upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];
for (const snippet of requiredTodoPendingSnippets) {
  const pass = todoSource.includes(snippet);
  logResult(`todo_keeps_pending_${snippet}`, pass);
  assertCondition(pass, `TODO.md should keep pending: ${snippet}`);
}

const forbiddenCompletedPatterns = [
  /개인정보 처리방침 URL 확정\s*[|:]\s*Completed/,
  /문의처 이메일\/지원 연락처 확정\s*[|:]\s*Completed/,
  /시행일 확정\s*[|:]\s*Completed/,
  /제공자 정보 확정\s*[|:]\s*Completed/,
  /Privacy page route implementation\s*[|:]\s*Completed/,
  /Google Play Console actual input\s*[|:]\s*Completed/,
  /Store screenshot upload\s*[|:]\s*Completed/,
  /Google Play 데이터 보안 양식 최종 입력\s*[|:]\s*Completed/,
  /Release build\s*[|:]\s*Completed/,
  /Signing setup\s*[|:]\s*Completed/,
  /AAB generation\s*[|:]\s*Completed/,
];
const noForbiddenCompleted = !forbiddenCompletedPatterns.some((pattern) => pattern.test(livingDocsSource));
logResult('living_docs_no_forbidden_completed_snippets', noForbiddenCompleted);
assertCondition(
  noForbiddenCompleted,
  'TODO.md/DEVELOPMENT_LOG.md/CHANGELOG.md should not mark still-blocked milestones as Completed',
);

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

const noIosCapacitorDependencyAdded = !dependencyNames.includes('@capacitor/ios');
logResult('no_ios_capacitor_dependency_added', noIosCapacitorDependencyAdded);
assertCondition(noIosCapacitorDependencyAdded, '@capacitor/ios should not be added');

if (failures.length > 0) {
  console.error('Public privacy policy page check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Public privacy policy page check passed');
}
