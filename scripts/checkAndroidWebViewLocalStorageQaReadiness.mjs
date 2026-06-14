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

const qaDocPath = 'docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA.md';
const qaDocExists = fileExists(qaDocPath);
logResult('qa_doc_exists', qaDocExists);
assertCondition(qaDocExists, `${qaDocPath} should exist`);

const qaDoc = qaDocExists ? readText(qaDocPath) : '';
const normalizedQaDoc = qaDoc.toLowerCase();

const qaDocMentionsAndroidWebview = /Android WebView|WebView/.test(qaDoc);
logResult('qa_doc_mentions_android_webview', qaDocMentionsAndroidWebview);
assertCondition(qaDocMentionsAndroidWebview, 'QA doc should mention Android WebView or WebView');

const qaDocMentionsLocalStorage = qaDoc.includes('localStorage');
logResult('qa_doc_mentions_localstorage', qaDocMentionsLocalStorage);
assertCondition(qaDocMentionsLocalStorage, 'QA doc should mention localStorage');

const qaDocMentionsConsentKey = qaDoc.includes('harupuli_consent_preferences_v1');
logResult('qa_doc_mentions_consent_key', qaDocMentionsConsentKey);
assertCondition(qaDocMentionsConsentKey, 'QA doc should mention harupuli_consent_preferences_v1');

const qaDocMentionsSavedReadingsKey = qaDoc.includes('harupuli_saved_readings_v1');
logResult('qa_doc_mentions_saved_readings_key', qaDocMentionsSavedReadingsKey);
assertCondition(qaDocMentionsSavedReadingsKey, 'QA doc should mention harupuli_saved_readings_v1');

const qaDocMentionsVisitStreakKey = qaDoc.includes('harupuli_visit_streak_v1');
logResult('qa_doc_mentions_visit_streak_key', qaDocMentionsVisitStreakKey);
assertCondition(qaDocMentionsVisitStreakKey, 'QA doc should mention harupuli_visit_streak_v1');

const qaDocMentionsAppRestart = qaDoc.includes('앱 재실행') || qaDoc.includes('종료 후 재실행');
logResult('qa_doc_mentions_app_restart', qaDocMentionsAppRestart);
assertCondition(qaDocMentionsAppRestart, 'QA doc should mention app restart');

const qaDocMentionsAppDataClear = qaDoc.includes('앱 데이터 삭제') || qaDoc.includes('저장공간/데이터 삭제');
logResult('qa_doc_mentions_app_data_clear', qaDocMentionsAppDataClear);
assertCondition(qaDocMentionsAppDataClear, 'QA doc should mention app data clear');

const qaDocMentionsUpdateScenario = qaDoc.includes('앱 업데이트') || qaDoc.includes('재설치');
logResult('qa_doc_mentions_update_scenario', qaDocMentionsUpdateScenario);
assertCondition(qaDocMentionsUpdateScenario, 'QA doc should mention app update or reinstall scenario');

const qaDocMentionsRewardUnlock = qaDoc.includes('보상') || normalizedQaDoc.includes('unlock');
logResult('qa_doc_mentions_reward_unlock', qaDocMentionsRewardUnlock);
assertCondition(qaDocMentionsRewardUnlock, 'QA doc should mention reward unlock');

const androidDebugBuildWorkflowExists = fileExists('.github/workflows/android-debug-build.yml');
logResult('android_debug_build_workflow_exists', androidDebugBuildWorkflowExists);
assertCondition(androidDebugBuildWorkflowExists, 'Android debug build workflow should exist');

const androidProjectExists = fileExists('android');
logResult('android_project_exists', androidProjectExists);
assertCondition(androidProjectExists, 'android folder should exist');

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
  console.error('Android WebView localStorage QA readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android WebView localStorage QA readiness check passed');
}
