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

const sampleProfileDocPath = 'docs/STORE_SCREENSHOT_SAMPLE_PROFILE.md';
const sampleProfileDocExists = fileExists(sampleProfileDocPath);
logResult('sample_profile_doc_exists', sampleProfileDocExists);
assertCondition(sampleProfileDocExists, 'docs/STORE_SCREENSHOT_SAMPLE_PROFILE.md should exist');

const doc = sampleProfileDocExists ? readText(sampleProfileDocPath) : '';

const docChecks = [
  [
    'doc_mentions_sample_profile',
    includesAny(doc, ['샘플 프로필', '테스트용 샘플']),
    'sample profile doc should mention sample profile or test sample',
  ],
  [
    'doc_mentions_no_real_user_data',
    includesAny(doc, ['실제 사용자 데이터 사용 금지', '실제 사용자 정보가 아닙니다']),
    'sample profile doc should prohibit real user data',
  ],
  ['doc_mentions_birthdate', doc.includes('생년월일'), 'sample profile doc should mention birthdate'],
  ['doc_mentions_birthtime', doc.includes('출생시간'), 'sample profile doc should mention birthtime'],
  ['doc_mentions_gender', doc.includes('성별'), 'sample profile doc should mention gender'],
  [
    'doc_mentions_same_day_policy',
    includesAny(doc, ['same_day', '자시 정책']),
    'sample profile doc should mention same_day or late-night jasi policy',
  ],
  ['doc_mentions_home_screen', doc.includes('홈 화면'), 'sample profile doc should mention home screen'],
  [
    'doc_mentions_fortune_detail',
    includesAny(doc, ['오늘의 운세 상세', '운세 상세']),
    'sample profile doc should mention fortune detail',
  ],
  ['doc_mentions_saju_insight', doc.includes('사주 인사이트'), 'sample profile doc should mention saju insight'],
  ['doc_mentions_saved_readings', doc.includes('저장한 운세'), 'sample profile doc should mention saved readings'],
  [
    'doc_mentions_privacy_screen',
    includesAny(doc, ['개인정보 안내', '동의 설정']),
    'sample profile doc should mention privacy or consent screen',
  ],
  [
    'doc_mentions_avoid_claims',
    includesAny(doc, ['반드시 성공합니다', '사자라면 성공합니다', '병이 낫습니다']),
    'sample profile doc should include avoided claims examples',
  ],
  [
    'doc_mentions_pm_clear',
    doc.includes('adb shell pm clear com.harupuli.app'),
    'sample profile doc should mention adb app data clear command',
  ],
  [
    'doc_mentions_no_actual_screenshots',
    doc.includes('실제 스크린샷 이미지 생성 미진행'),
    'sample profile doc should mention actual screenshot images were not created',
  ],
];

for (const [id, pass, message] of docChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const screenshotNamePattern = /(screenshot|store-screenshot|play-screenshot)/i;
const allowedGeneratedAssetPattern = /(generated-icons|generated-splash)/i;
const screenshotAssetFiles = [...walkFiles('public'), ...walkFiles('docs')].filter((absolutePath) => {
  const normalizedPath = absolutePath.replaceAll('\\', '/');
  const extension = path.extname(normalizedPath).toLowerCase();
  return (
    imageExtensions.has(extension) &&
    screenshotNamePattern.test(path.basename(normalizedPath)) &&
    !allowedGeneratedAssetPattern.test(normalizedPath)
  );
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
  console.error('Store screenshot sample profile check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Store screenshot sample profile check passed');
}
