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

const envSetupDocPath = 'docs/ANDROID_QA_ENVIRONMENT_SETUP.md';
const envSetupDocExists = fileExists(envSetupDocPath);
logResult('env_setup_doc_exists', envSetupDocExists);
assertCondition(envSetupDocExists, 'docs/ANDROID_QA_ENVIRONMENT_SETUP.md should exist');

const envSetupDoc = envSetupDocExists ? readText(envSetupDocPath) : '';

const docMentionsAndroidStudio = envSetupDoc.includes('Android Studio');
logResult('doc_mentions_android_studio', docMentionsAndroidStudio);
assertCondition(docMentionsAndroidStudio, 'environment setup doc should mention Android Studio');

const docMentionsPlatformTools =
  envSetupDoc.includes('Platform Tools') || envSetupDoc.includes('SDK Platform Tools');
logResult('doc_mentions_platform_tools', docMentionsPlatformTools);
assertCondition(docMentionsPlatformTools, 'environment setup doc should mention Platform Tools');

const docMentionsAdbVersion = envSetupDoc.includes('adb version');
logResult('doc_mentions_adb_version', docMentionsAdbVersion);
assertCondition(docMentionsAdbVersion, 'environment setup doc should mention adb version');

const docMentionsAdbDevices = envSetupDoc.includes('adb devices');
logResult('doc_mentions_adb_devices', docMentionsAdbDevices);
assertCondition(docMentionsAdbDevices, 'environment setup doc should mention adb devices');

const docMentionsUsbDebugging = envSetupDoc.includes('USB debugging') || envSetupDoc.includes('USB 디버깅');
logResult('doc_mentions_usb_debugging', docMentionsUsbDebugging);
assertCondition(docMentionsUsbDebugging, 'environment setup doc should mention USB debugging');

const docMentionsEmulator = envSetupDoc.includes('Emulator') || envSetupDoc.includes('에뮬레이터');
logResult('doc_mentions_emulator', docMentionsEmulator);
assertCondition(docMentionsEmulator, 'environment setup doc should mention Emulator');

const docMentionsArtifact = envSetupDoc.includes('harupuli-debug-apk');
logResult('doc_mentions_artifact', docMentionsArtifact);
assertCondition(docMentionsArtifact, 'environment setup doc should mention harupuli-debug-apk');

const docMentionsAppDebugApk = envSetupDoc.includes('app-debug.apk');
logResult('doc_mentions_app_debug_apk', docMentionsAppDebugApk);
assertCondition(docMentionsAppDebugApk, 'environment setup doc should mention app-debug.apk');

const docMentionsPackageName = envSetupDoc.includes('com.harupuli.app');
logResult('doc_mentions_package_name', docMentionsPackageName);
assertCondition(docMentionsPackageName, 'environment setup doc should mention com.harupuli.app');

const docMentionsAdbInstall = envSetupDoc.includes('adb install -r app-debug.apk');
logResult('doc_mentions_adb_install', docMentionsAdbInstall);
assertCondition(docMentionsAdbInstall, 'environment setup doc should mention adb install -r app-debug.apk');

const docMentionsPmClear = envSetupDoc.includes('pm clear com.harupuli.app');
logResult('doc_mentions_pm_clear', docMentionsPmClear);
assertCondition(docMentionsPmClear, 'environment setup doc should mention pm clear com.harupuli.app');

const docMentionsLogcat = envSetupDoc.includes('logcat');
logResult('doc_mentions_logcat', docMentionsLogcat);
assertCondition(docMentionsLogcat, 'environment setup doc should mention logcat');

const docMentionsBlockedStatus = envSetupDoc.includes('Blocked');
logResult('doc_mentions_blocked_status', docMentionsBlockedStatus);
assertCondition(docMentionsBlockedStatus, 'environment setup doc should mention Blocked status');

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
  console.error('Android QA environment setup readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android QA environment setup readiness check passed');
}
