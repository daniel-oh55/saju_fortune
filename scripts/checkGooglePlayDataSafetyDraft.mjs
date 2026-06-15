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

const dataSafetyDocPath = 'docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT.md';
const dataSafetyDocExists = fileExists(dataSafetyDocPath);
logResult('data_safety_doc_exists', dataSafetyDocExists);
assertCondition(dataSafetyDocExists, 'docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT.md should exist');

const doc = dataSafetyDocExists ? readText(dataSafetyDocPath) : '';

const docChecks = [
  ['doc_mentions_google_play', doc.includes('Google Play'), 'data safety draft should mention Google Play'],
  [
    'doc_mentions_data_safety',
    includesAny(doc, ['데이터 보안', 'Data Safety']),
    'data safety draft should mention data safety',
  ],
  ['doc_mentions_localstorage', doc.includes('localStorage'), 'data safety draft should mention localStorage'],
  [
    'doc_mentions_no_server_db',
    includesAny(doc, ['서버 DB 없음', '서버로 사용자 데이터를 전송하지 않습니다']),
    'data safety draft should mention no server DB or no server transmission',
  ],
  [
    'doc_mentions_no_login',
    includesAny(doc, ['로그인 없음', '로그인 기능이 없습니다']),
    'data safety draft should mention no login',
  ],
  [
    'doc_mentions_no_real_ad_sdk',
    includesAny(doc, ['실제 광고 SDK 없음', '실제 광고 SDK가 없습니다']),
    'data safety draft should mention no real ad SDK',
  ],
  [
    'doc_mentions_no_payment_sdk',
    includesAny(doc, ['실제 결제 SDK 없음', '실제 결제 SDK가 없습니다']),
    'data safety draft should mention no payment SDK',
  ],
  [
    'doc_mentions_no_analytics_sdk',
    includesAny(doc, ['외부 분석 SDK 없음', '실제 분석 SDK가 없습니다']),
    'data safety draft should mention no analytics SDK',
  ],
  [
    'doc_mentions_data_items',
    includesAll(doc, ['프로필 정보', '운세 cache', '사주 분석 cache', '동의 설정', '저장한 풀이', '방문 streak']),
    'data safety draft should list current data items',
  ],
  [
    'doc_mentions_data_type_mapping',
    includesAll(doc, ['Personal info', 'Financial info', 'Location', 'Contacts', 'App activity', 'Device or other IDs']),
    'data safety draft should include data type mapping',
  ],
  [
    'doc_mentions_no_sharing',
    includesAny(doc, ['제3자와 데이터 공유 없음', '광고 네트워크 전송 없음']),
    'data safety draft should mention no third-party sharing',
  ],
  [
    'doc_mentions_delete_method',
    includesAny(doc, ['데이터 삭제', 'pm clear com.harupuli.app']),
    'data safety draft should mention data deletion method',
  ],
  [
    'doc_mentions_privacy_policy_alignment',
    includesAny(doc, ['개인정보 처리방침', 'PrivacyInfoPage']),
    'data safety draft should mention privacy policy alignment',
  ],
  [
    'doc_mentions_pending_final_review',
    includesAny(doc, ['최종 제출 전 재검토', '실제 Google Play Console 데이터 보안 양식 입력 미진행']),
    'data safety draft should mention pending final review',
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
  console.error('Google Play data safety draft check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Google Play data safety draft check passed');
}
