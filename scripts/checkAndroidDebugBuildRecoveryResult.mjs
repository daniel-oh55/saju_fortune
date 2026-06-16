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

function includesAll(text, patterns) {
  return patterns.every((pattern) => text.includes(pattern));
}

function includesAny(text, patterns) {
  return patterns.some((pattern) => text.includes(pattern));
}

const recoveryDocPath = 'docs/ANDROID_DEBUG_BUILD_RECOVERY_RESULT.md';
const recoveryDocExists = fileExists(recoveryDocPath);
logResult('recovery_doc_exists', recoveryDocExists);
assertCondition(recoveryDocExists, 'docs/ANDROID_DEBUG_BUILD_RECOVERY_RESULT.md should exist');

const doc = recoveryDocExists ? readText(recoveryDocPath) : '';
const docChecks = [
  ['doc_mentions_pr100_failure', doc.includes('PR #100'), 'recovery doc should mention PR #100 failure'],
  [
    'doc_mentions_run_28',
    includesAny(doc, ['run number: 28', 'run #28']),
    'recovery doc should mention run number 28',
  ],
  [
    'doc_mentions_install_dependencies_failure',
    doc.includes('Install dependencies') && includesAny(doc, ['실패', 'failure']),
    'recovery doc should mention Install dependencies failure',
  ],
  [
    'doc_mentions_skipped_steps',
    includesAll(doc, ['Build web app', 'Sync Android project', 'Build Android debug APK', 'Upload debug APK']) &&
      includesAny(doc, ['skipped', 'skipped 단계']),
    'recovery doc should mention skipped build and upload steps',
  ],
  [
    'doc_mentions_no_artifact_on_failure',
    includesAny(doc, ['harupuli-debug-apk 미생성', 'artifact 미생성']),
    'recovery doc should mention no artifact on failure',
  ],
  ['doc_mentions_pr101_recovery', doc.includes('PR #101'), 'recovery doc should mention PR #101 recovery'],
  [
    'doc_mentions_run_29',
    includesAny(doc, ['run number: 29', 'run #29']),
    'recovery doc should mention run number 29',
  ],
  ['doc_mentions_success', includesAny(doc, ['success', '정상화']), 'recovery doc should mention success'],
  [
    'doc_mentions_artifact_regenerated',
    doc.includes('harupuli-debug-apk') && includesAny(doc, ['재생성', '생성됨']),
    'recovery doc should mention harupuli-debug-apk regenerated',
  ],
  [
    'doc_mentions_artifact_digest',
    doc.includes('sha256:dfadb247a1f862d2461518f1bc64e83a07b1d486efb0869c435c08b8788c00bd'),
    'recovery doc should mention artifact digest',
  ],
  ['doc_mentions_artifact_id', doc.includes('7659463327'), 'recovery doc should mention artifact id'],
  [
    'doc_mentions_android_device_qa_blocked',
    doc.includes('Android 실제 기기 QA') && doc.includes('Blocked'),
    'recovery doc should keep Android device QA blocked',
  ],
  [
    'doc_mentions_no_release_signing_aab',
    includesAll(doc, ['release build', 'signing', 'AAB 생성', '미진행']),
    'recovery doc should mention release/signing/AAB not done',
  ],
  [
    'doc_mentions_no_google_play_console_input',
    doc.includes('Google Play Console 입력') && doc.includes('미진행'),
    'recovery doc should mention Google Play Console input not done',
  ],
  [
    'doc_mentions_no_vercel_url_check',
    doc.includes('실제 Vercel') && doc.includes('/privacy/') && doc.includes('미진행'),
    'recovery doc should mention Vercel privacy URL check not done',
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
  console.error('Android debug build recovery result check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android debug build recovery result check passed');
}
