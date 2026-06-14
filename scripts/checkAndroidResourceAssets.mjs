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

const launcherIconPaths = [
  'android/app/src/main/res/mipmap-mdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-hdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png',
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
];
const launcherIconsExist = launcherIconPaths.every(fileExists);
logResult('launcher_icons_exist', launcherIconsExist);
assertCondition(launcherIconsExist, 'all launcher icon PNG files should exist');

const roundLauncherIconPaths = [
  'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png',
  'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png',
];
const roundLauncherIconsExist = roundLauncherIconPaths.every(fileExists);
logResult('round_launcher_icons_exist', roundLauncherIconsExist);
assertCondition(roundLauncherIconsExist, 'all round launcher icon PNG files should exist');

const adaptiveIconPngsExist =
  fileExists('android/app/src/main/res/drawable-nodpi/ic_launcher_foreground.png') &&
  fileExists('android/app/src/main/res/drawable-nodpi/ic_launcher_background.png');
logResult('adaptive_icon_pngs_exist', adaptiveIconPngsExist);
assertCondition(adaptiveIconPngsExist, 'adaptive icon foreground/background PNG files should exist');

const adaptiveXmlPaths = [
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
];
const adaptiveIconXmlExists = adaptiveXmlPaths.every(fileExists);
logResult('adaptive_icon_xml_exists', adaptiveIconXmlExists);
assertCondition(adaptiveIconXmlExists, 'adaptive icon XML files should exist');

const adaptiveIconXmlReferencesDrawables =
  adaptiveXmlPaths.every((relativePath) => {
    if (!fileExists(relativePath)) return false;
    const xml = readText(relativePath);
    return xml.includes('@drawable/ic_launcher_background') && xml.includes('@drawable/ic_launcher_foreground');
  });
logResult('adaptive_icon_xml_references_drawables', adaptiveIconXmlReferencesDrawables);
assertCondition(adaptiveIconXmlReferencesDrawables, 'adaptive icon XML should reference drawable foreground/background');

const splashAssetsExist =
  fileExists('android/app/src/main/res/drawable-nodpi/harupuli_splash.png') &&
  fileExists('android/app/src/main/res/drawable-nodpi/harupuli_splash_icon.png');
logResult('splash_assets_exist', splashAssetsExist);
assertCondition(splashAssetsExist, 'Harupuli splash PNG files should exist in drawable-nodpi');

const manifest = fileExists('android/app/src/main/AndroidManifest.xml')
  ? readText('android/app/src/main/AndroidManifest.xml')
  : '';
const androidManifestIconReference =
  manifest.includes('@mipmap/ic_launcher') && manifest.includes('@mipmap/ic_launcher_round');
logResult('android_manifest_icon_reference', androidManifestIconReference);
assertCondition(androidManifestIconReference, 'AndroidManifest should reference @mipmap/ic_launcher and round icon');

const sourceGeneratedAssets = [
  'public/generated-icons/android/icon-48.png',
  'public/generated-icons/android/icon-72.png',
  'public/generated-icons/android/icon-96.png',
  'public/generated-icons/android/icon-144.png',
  'public/generated-icons/android/icon-192.png',
  'public/generated-icons/android-adaptive/foreground-432.png',
  'public/generated-icons/android-adaptive/background-432.png',
  'public/generated-splash/android/splash-1080x1920.png',
  'public/generated-splash/android/splash-icon-432.png',
];
const sourceGeneratedAssetsStillExist = sourceGeneratedAssets.every(fileExists);
logResult('source_generated_assets_still_exist', sourceGeneratedAssetsStillExist);
assertCondition(sourceGeneratedAssetsStillExist, 'public/generated-* source assets should still exist');

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
  console.error('Android resource assets check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android resource assets check passed');
}
