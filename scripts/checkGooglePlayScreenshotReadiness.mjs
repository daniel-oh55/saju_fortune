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

function walkFiles(relativeDir) {
  const absoluteDir = path.join(projectRoot, relativeDir);
  if (!fs.existsSync(absoluteDir)) return [];

  const results = [];
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = path.join(relativeDir, entry.name);
    const absolutePath = path.join(projectRoot, relativePath);

    if (entry.isDirectory()) {
      results.push(...walkFiles(relativePath));
    } else if (entry.isFile()) {
      results.push(absolutePath);
    }
  }

  return results;
}

const screenshotDocPath = 'docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md';
const screenshotDocExists = fileExists(screenshotDocPath);
logResult('screenshot_doc_exists', screenshotDocExists);
assertCondition(screenshotDocExists, 'docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md should exist');

const doc = screenshotDocExists ? readText(screenshotDocPath) : '';

const docChecks = [
  ['doc_mentions_google_play', doc.includes('Google Play'), 'screenshot readiness doc should mention Google Play'],
  ['doc_mentions_screenshot', doc.includes('스크린샷'), 'screenshot readiness doc should mention screenshots'],
  ['doc_mentions_home', includesAny(doc, ['홈 화면', 'Home']), 'screenshot readiness doc should mention home'],
  [
    'doc_mentions_fortune_detail',
    includesAny(doc, ['오늘의 운세 상세', '운세 상세']),
    'screenshot readiness doc should mention fortune detail',
  ],
  [
    'doc_mentions_saju_insight',
    includesAny(doc, ['사주 인사이트', 'Saju Insight']),
    'screenshot readiness doc should mention saju insight',
  ],
  [
    'doc_mentions_saved_readings',
    includesAny(doc, ['저장한 풀이', 'Saved Readings']),
    'screenshot readiness doc should mention saved readings',
  ],
  [
    'doc_mentions_privacy',
    includesAny(doc, ['개인정보 안내', '동의 설정']),
    'screenshot readiness doc should mention privacy or consent screen',
  ],
  [
    'doc_mentions_reference_notice',
    includesAny(doc, ['참고용', '단정적 예언 문구 피하기']),
    'screenshot readiness doc should mention reference notice',
  ],
  [
    'doc_mentions_avoid_claims',
    includesAny(doc, ['반드시 이루어집니다', '투자하면 성공합니다', '병이 낫습니다']),
    'screenshot readiness doc should include avoided claims examples',
  ],
  [
    'doc_mentions_no_actual_images',
    includesAny(doc, ['실제 스크린샷 이미지 생성 미진행', '실제 스크린샷 이미지']),
    'screenshot readiness doc should mention actual images were not created',
  ],
  [
    'doc_mentions_qa_blocked',
    includesAny(doc, ['Android 실제 기기 QA Blocked', 'QA Blocked']),
    'screenshot readiness doc should mention QA blocked status',
  ],
  [
    'doc_mentions_privacy_policy',
    doc.includes('개인정보 처리방침 URL'),
    'screenshot readiness doc should mention privacy policy URL',
  ],
];

for (const [id, pass, message] of docChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const screenshotNamePattern = /(screenshot|store-screenshot|play-screenshot)/i;
const screenshotAssetFiles = [...walkFiles('public'), ...walkFiles('docs')].filter((absolutePath) => {
  const normalizedPath = absolutePath.replaceAll('\\', '/');
  const extension = path.extname(normalizedPath).toLowerCase();
  return imageExtensions.has(extension) && screenshotNamePattern.test(path.basename(normalizedPath));
});
const noScreenshotAssetsAdded = screenshotAssetFiles.length === 0;
logResult('no_screenshot_assets_added', noScreenshotAssetsAdded);
assertCondition(
  noScreenshotAssetsAdded,
  `screenshot image assets should not be added: ${screenshotAssetFiles.join(', ')}`,
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
  console.error('Google Play screenshot readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Google Play screenshot readiness check passed');
}
