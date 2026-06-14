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

const runbookPath = 'docs/ANDROID_DEVICE_QA_RUNBOOK.md';
const runbookDocExists = fileExists(runbookPath);
logResult('runbook_doc_exists', runbookDocExists);
assertCondition(runbookDocExists, `${runbookPath} should exist`);

const runbook = runbookDocExists ? readText(runbookPath) : '';

const runbookMentionsArtifact = runbook.includes('harupuli-debug-apk');
logResult('runbook_mentions_artifact', runbookMentionsArtifact);
assertCondition(runbookMentionsArtifact, 'runbook should mention harupuli-debug-apk');

const runbookMentionsAppDebugApk = runbook.includes('app-debug.apk');
logResult('runbook_mentions_app_debug_apk', runbookMentionsAppDebugApk);
assertCondition(runbookMentionsAppDebugApk, 'runbook should mention app-debug.apk');

const runbookMentionsAdbDevices = runbook.includes('adb devices');
logResult('runbook_mentions_adb_devices', runbookMentionsAdbDevices);
assertCondition(runbookMentionsAdbDevices, 'runbook should mention adb devices');

const runbookMentionsAdbInstall = runbook.includes('adb install');
logResult('runbook_mentions_adb_install', runbookMentionsAdbInstall);
assertCondition(runbookMentionsAdbInstall, 'runbook should mention adb install');

const runbookMentionsPmClear = runbook.includes('pm clear');
logResult('runbook_mentions_pm_clear', runbookMentionsPmClear);
assertCondition(runbookMentionsPmClear, 'runbook should mention pm clear');

const runbookMentionsPackageName = runbook.includes('com.harupuli.app');
logResult('runbook_mentions_package_name', runbookMentionsPackageName);
assertCondition(runbookMentionsPackageName, 'runbook should mention com.harupuli.app');

const runbookMentionsLogcat = runbook.includes('logcat');
logResult('runbook_mentions_logcat', runbookMentionsLogcat);
assertCondition(runbookMentionsLogcat, 'runbook should mention logcat');

const runbookMentionsQaResultDoc = runbook.includes('docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA_RESULT.md');
logResult('runbook_mentions_qa_result_doc', runbookMentionsQaResultDoc);
assertCondition(runbookMentionsQaResultDoc, 'runbook should link the QA result doc');

const qaResultDocPath = 'docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA_RESULT.md';
const qaResultDocExists = fileExists(qaResultDocPath);
logResult('qa_result_doc_exists', qaResultDocExists);
assertCondition(qaResultDocExists, `${qaResultDocPath} should exist`);

const qaResultDoc = qaResultDocExists ? readText(qaResultDocPath) : '';
const qaResultDocStillBlockedOrPending = qaResultDoc.includes('Blocked') || qaResultDoc.includes('재시도 필요');
logResult('qa_result_doc_still_blocked_or_pending', qaResultDocStillBlockedOrPending);
assertCondition(qaResultDocStillBlockedOrPending, 'QA result doc should still mention Blocked or retry needed');

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

const blockedImageDependencies = ['sharp', 'canvas', 'jimp', 'imagemagick', 'gm'];
const noImageGenerationDependencyAdded = blockedImageDependencies.every(
  (packageName) => !dependencyNames.includes(packageName),
);
logResult('no_image_generation_dependency_added', noImageGenerationDependencyAdded);
assertCondition(noImageGenerationDependencyAdded, 'image generation dependencies should not be added');

if (failures.length > 0) {
  console.error('Android device QA runbook readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android device QA runbook readiness check passed');
}
