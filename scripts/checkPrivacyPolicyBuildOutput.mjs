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

const sourcePrivacyPagePath = 'public/privacy/index.html';
const distFolderPath = 'dist';
const distPrivacyPagePath = 'dist/privacy/index.html';

const sourcePrivacyPageExists = fileExists(sourcePrivacyPagePath);
logResult('source_privacy_page_exists', sourcePrivacyPageExists);
assertCondition(sourcePrivacyPageExists, 'public/privacy/index.html should exist');

const distFolderExists = fileExists(distFolderPath);
logResult('dist_folder_exists', distFolderExists);
assertCondition(distFolderExists, 'dist folder should exist after npm run build');

const distPrivacyPageExists = fileExists(distPrivacyPagePath);
logResult('dist_privacy_page_exists', distPrivacyPageExists);
assertCondition(distPrivacyPageExists, 'dist/privacy/index.html should exist after npm run build');

const distPrivacyPage = distPrivacyPageExists ? readText(distPrivacyPagePath) : '';
const distPrivacyPageChecks = [
  [
    'dist_privacy_page_mentions_service_name',
    distPrivacyPage.includes('하루풀이'),
    'dist privacy page should mention service name',
  ],
  [
    'dist_privacy_page_mentions_privacy_policy',
    distPrivacyPage.includes('개인정보 처리방침'),
    'dist privacy page should mention privacy policy',
  ],
  [
    'dist_privacy_page_mentions_localstorage',
    distPrivacyPage.includes('localStorage'),
    'dist privacy page should mention localStorage',
  ],
  [
    'dist_privacy_page_mentions_no_server_db',
    includesAny(distPrivacyPage, ['서버 데이터베이스 없이', '서버로 전송하지 않습니다']),
    'dist privacy page should mention no server DB or no server transfer',
  ],
  [
    'dist_privacy_page_mentions_no_real_ad_sdk',
    includesAny(distPrivacyPage, ['실제 광고 SDK는 연결되어 있지 않습니다', '실제 광고 SDK를 사용하지 않습니다']),
    'dist privacy page should mention no real ad SDK',
  ],
  [
    'dist_privacy_page_mentions_no_payment_sdk',
    includesAny(distPrivacyPage, ['실제 결제 SDK는 연결되어 있지 않습니다', '실제 결제 SDK를 사용하지 않습니다']),
    'dist privacy page should mention no payment SDK',
  ],
  [
    'dist_privacy_page_mentions_no_analytics_sdk',
    includesAny(distPrivacyPage, ['외부 분석 SDK', '실제 외부 분석 SDK는 연결되어 있지 않습니다']),
    'dist privacy page should mention no external analytics SDK',
  ],
  [
    'dist_privacy_page_mentions_delete_method',
    includesAny(distPrivacyPage, ['데이터 삭제', 'adb shell pm clear com.harupuli.app']),
    'dist privacy page should mention data deletion method',
  ],
  [
    'dist_privacy_page_mentions_reference_notice',
    includesAny(distPrivacyPage, ['참고용 콘텐츠', '전문적인 자문을 대체하지 않습니다']),
    'dist privacy page should mention reference notice',
  ],
  [
    'dist_privacy_page_has_no_external_script',
    !distPrivacyPage.includes('<script src='),
    'dist privacy page should not include external script tags',
  ],
  ['dist_privacy_page_has_no_form', !distPrivacyPage.includes('<form'), 'dist privacy page should not include forms'],
];

for (const [id, pass, message] of distPrivacyPageChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const sourceAndDistPrivacyPageBothExist = sourcePrivacyPageExists && distPrivacyPageExists;
logResult('source_and_dist_privacy_page_both_exist', sourceAndDistPrivacyPageBothExist);
assertCondition(
  sourceAndDistPrivacyPageBothExist,
  'public/privacy/index.html and dist/privacy/index.html should both exist',
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

const noCapacitorAppAdded = !dependencyNames.includes('@capacitor/app');
logResult('no_capacitor_app_added', noCapacitorAppAdded);
assertCondition(noCapacitorAppAdded, '@capacitor/app should not be added in this PR');

if (failures.length > 0) {
  console.error('Privacy policy build output check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Privacy policy build output check passed');
}
