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

const verificationDocPath = 'docs/ANDROID_RESOURCE_BUILD_VERIFICATION.md';
const verificationDocExists = fileExists(verificationDocPath);
logResult('verification_doc_exists', verificationDocExists);
assertCondition(verificationDocExists, 'docs/ANDROID_RESOURCE_BUILD_VERIFICATION.md should exist');

const verificationDoc = verificationDocExists ? readText(verificationDocPath) : '';

const verificationDocMentionsPr80 =
  verificationDoc.includes('PR #80') ||
  verificationDoc.includes('feature: apply Android app icon and splash resources');
logResult('verification_doc_mentions_pr80', verificationDocMentionsPr80);
assertCondition(verificationDocMentionsPr80, 'verification doc should mention PR #80 or the resource PR title');

const verificationDocMentionsWorkflowSuccess = verificationDoc.includes('success');
logResult('verification_doc_mentions_workflow_success', verificationDocMentionsWorkflowSuccess);
assertCondition(verificationDocMentionsWorkflowSuccess, 'verification doc should mention workflow success');

const verificationDocMentionsRunNumber = verificationDoc.includes('run number') || verificationDoc.includes('8');
logResult('verification_doc_mentions_run_number', verificationDocMentionsRunNumber);
assertCondition(verificationDocMentionsRunNumber, 'verification doc should mention run number 8');

const verificationDocMentionsArtifact = verificationDoc.includes('harupuli-debug-apk');
logResult('verification_doc_mentions_artifact', verificationDocMentionsArtifact);
assertCondition(verificationDocMentionsArtifact, 'verification doc should mention harupuli-debug-apk');

const verificationDocMentionsApkPath =
  verificationDoc.includes('android/app/build/outputs/apk/debug/app-debug.apk');
logResult('verification_doc_mentions_apk_path', verificationDocMentionsApkPath);
assertCondition(verificationDocMentionsApkPath, 'verification doc should mention debug APK path');

const verificationDocMentionsLauncherIcon = verificationDoc.includes('ic_launcher.png');
logResult('verification_doc_mentions_launcher_icon', verificationDocMentionsLauncherIcon);
assertCondition(verificationDocMentionsLauncherIcon, 'verification doc should mention ic_launcher.png');

const verificationDocMentionsRoundIcon = verificationDoc.includes('ic_launcher_round.png');
logResult('verification_doc_mentions_round_icon', verificationDocMentionsRoundIcon);
assertCondition(verificationDocMentionsRoundIcon, 'verification doc should mention ic_launcher_round.png');

const verificationDocMentionsAdaptiveIcon =
  verificationDoc.includes('ic_launcher_foreground.png') &&
  verificationDoc.includes('ic_launcher_background.png');
logResult('verification_doc_mentions_adaptive_icon', verificationDocMentionsAdaptiveIcon);
assertCondition(verificationDocMentionsAdaptiveIcon, 'verification doc should mention adaptive icon PNGs');

const verificationDocMentionsSplash =
  verificationDoc.includes('harupuli_splash.png') || verificationDoc.includes('harupuli_splash_icon.png');
logResult('verification_doc_mentions_splash', verificationDocMentionsSplash);
assertCondition(verificationDocMentionsSplash, 'verification doc should mention Harupuli splash PNGs');

const androidResourceAssetPaths = [
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
const androidResourceAssetsStillExist = androidResourceAssetPaths.every(fileExists);
logResult('android_resource_assets_still_exist', androidResourceAssetsStillExist);
assertCondition(androidResourceAssetsStillExist, 'Android resource asset files should still exist');

const adaptiveXmlPaths = [
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
];
const adaptiveIconXmlReferencesDrawables = adaptiveXmlPaths.every((relativePath) => {
  if (!fileExists(relativePath)) return false;
  const xml = readText(relativePath);
  return xml.includes('@drawable/ic_launcher_background') && xml.includes('@drawable/ic_launcher_foreground');
});
logResult('adaptive_icon_xml_references_drawables', adaptiveIconXmlReferencesDrawables);
assertCondition(adaptiveIconXmlReferencesDrawables, 'adaptive icon XML files should reference drawable assets');

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
  console.error('Android resource build verification check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android resource build verification check passed');
}
