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

const summaryDocPath = 'docs/ANDROID_QA_STATUS_SUMMARY.md';
const summaryDocExists = fileExists(summaryDocPath);
logResult('summary_doc_exists', summaryDocExists);
assertCondition(summaryDocExists, 'docs/ANDROID_QA_STATUS_SUMMARY.md should exist');

const summaryDoc = summaryDocExists ? readText(summaryDocPath) : '';

const summaryChecks = [
  [
    'summary_mentions_debug_build_success',
    summaryDoc.includes('Android Debug Build') && summaryDoc.includes('success'),
    'summary doc should mention Android Debug Build success',
  ],
  [
    'summary_mentions_run_number',
    summaryDoc.includes('run number') || summaryDoc.includes('13'),
    'summary doc should mention run number 13',
  ],
  [
    'summary_mentions_artifact',
    summaryDoc.includes('harupuli-debug-apk'),
    'summary doc should mention harupuli-debug-apk',
  ],
  [
    'summary_mentions_apk_path',
    summaryDoc.includes('android/app/build/outputs/apk/debug/app-debug.apk'),
    'summary doc should mention debug APK path',
  ],
  [
    'summary_mentions_icon_splash_result',
    summaryDoc.includes('docs/ANDROID_ICON_SPLASH_QA_RESULT.md'),
    'summary doc should link Android icon/splash QA result',
  ],
  [
    'summary_mentions_localstorage_result',
    summaryDoc.includes('docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA_RESULT.md'),
    'summary doc should link Android WebView localStorage QA result',
  ],
  [
    'summary_mentions_back_button_result',
    summaryDoc.includes('docs/ANDROID_BACK_BUTTON_QA_RESULT.md'),
    'summary doc should link Android back button QA result',
  ],
  [
    'summary_mentions_env_setup',
    summaryDoc.includes('docs/ANDROID_QA_ENVIRONMENT_SETUP.md'),
    'summary doc should link Android QA environment setup',
  ],
  [
    'summary_mentions_device_runbook',
    summaryDoc.includes('docs/ANDROID_DEVICE_QA_RUNBOOK.md'),
    'summary doc should link Android device QA runbook',
  ],
  ['summary_mentions_blocked', summaryDoc.includes('Blocked'), 'summary doc should mention Blocked'],
  ['summary_mentions_adb', summaryDoc.includes('adb'), 'summary doc should mention adb'],
  [
    'summary_mentions_retry_order',
    includesAny(summaryDoc, ['재시도 순서', 'QA 재시도']),
    'summary doc should mention retry order',
  ],
];

for (const [id, pass, message] of summaryChecks) {
  logResult(id, pass);
  assertCondition(pass, message);
}

const linkedDocs = [
  'docs/ANDROID_ICON_SPLASH_QA_RESULT.md',
  'docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA_RESULT.md',
  'docs/ANDROID_BACK_BUTTON_QA_RESULT.md',
  'docs/ANDROID_QA_ENVIRONMENT_SETUP.md',
  'docs/ANDROID_DEVICE_QA_RUNBOOK.md',
];
const linkedDocsExist = linkedDocs.every(fileExists);
logResult('linked_docs_exist', linkedDocsExist);
assertCondition(linkedDocsExist, 'linked Android QA docs should exist');

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

const noCapacitorAppAdded = !dependencyNames.includes('@capacitor/app');
logResult('no_capacitor_app_added', noCapacitorAppAdded);
assertCondition(noCapacitorAppAdded, '@capacitor/app should not be added in this PR');

if (failures.length > 0) {
  console.error('Android QA status summary check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android QA status summary check passed');
}
