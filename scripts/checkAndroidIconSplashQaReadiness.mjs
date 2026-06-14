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

const qaDocPath = 'docs/ANDROID_ICON_SPLASH_QA.md';
const qaDocExists = fileExists(qaDocPath);
logResult('qa_doc_exists', qaDocExists);
assertCondition(qaDocExists, 'docs/ANDROID_ICON_SPLASH_QA.md should exist');

const qaDoc = qaDocExists ? readText(qaDocPath) : '';

const docMentionsLauncherIcon = qaDoc.includes('launcher icon') || qaDoc.includes('ic_launcher.png');
logResult('doc_mentions_launcher_icon', docMentionsLauncherIcon);
assertCondition(docMentionsLauncherIcon, 'QA doc should mention launcher icon');

const docMentionsRoundIcon = qaDoc.includes('round icon') || qaDoc.includes('ic_launcher_round.png');
logResult('doc_mentions_round_icon', docMentionsRoundIcon);
assertCondition(docMentionsRoundIcon, 'QA doc should mention round icon');

const docMentionsAdaptiveIcon = qaDoc.includes('adaptive icon') || qaDoc.includes('ic_launcher_foreground.png');
logResult('doc_mentions_adaptive_icon', docMentionsAdaptiveIcon);
assertCondition(docMentionsAdaptiveIcon, 'QA doc should mention adaptive icon');

const docMentionsSplash = qaDoc.includes('splash') || qaDoc.includes('harupuli_splash.png');
logResult('doc_mentions_splash', docMentionsSplash);
assertCondition(docMentionsSplash, 'QA doc should mention splash');

const docMentionsAndroid12 = qaDoc.includes('Android 12');
logResult('doc_mentions_android_12', docMentionsAndroid12);
assertCondition(docMentionsAndroid12, 'QA doc should mention Android 12');

const docMentionsArtifact = qaDoc.includes('harupuli-debug-apk');
logResult('doc_mentions_artifact', docMentionsArtifact);
assertCondition(docMentionsArtifact, 'QA doc should mention harupuli-debug-apk');

const docMentionsAppDebugApk = qaDoc.includes('app-debug.apk');
logResult('doc_mentions_app_debug_apk', docMentionsAppDebugApk);
assertCondition(docMentionsAppDebugApk, 'QA doc should mention app-debug.apk');

const docMentionsDeviceOrEmulator = qaDoc.includes('기기') || qaDoc.includes('에뮬레이터') || qaDoc.includes('Emulator');
logResult('doc_mentions_device_or_emulator', docMentionsDeviceOrEmulator);
assertCondition(docMentionsDeviceOrEmulator, 'QA doc should mention device or emulator');

const docMentionsPendingStatus = qaDoc.includes('Pending');
logResult('doc_mentions_pending_status', docMentionsPendingStatus);
assertCondition(docMentionsPendingStatus, 'QA doc should keep actual QA status pending');

const resourceFiles = [
  'android/app/src/main/res/mipmap-mdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-hdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png',
  'android/app/src/main/res/drawable-nodpi/ic_launcher_foreground.png',
  'android/app/src/main/res/drawable-nodpi/ic_launcher_background.png',
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
  'android/app/src/main/res/drawable-nodpi/harupuli_splash.png',
  'android/app/src/main/res/drawable-nodpi/harupuli_splash_icon.png',
];
const resourceFilesExist = resourceFiles.every(fileExists);
logResult('resource_files_exist', resourceFilesExist);
assertCondition(resourceFilesExist, 'Android icon/splash resource files should exist');

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
  console.error('Android icon/splash QA readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android icon/splash QA readiness check passed');
}
