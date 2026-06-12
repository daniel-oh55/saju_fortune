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

const packageJson = JSON.parse(readText('package.json'));
const allDependencies = {
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {}),
};
const dependencyNames = Object.keys(allDependencies);

const androidReadinessDocExists = fileExists('docs/ANDROID_PACKAGING_READINESS.md');
logResult('android_readiness_doc_exists', androidReadinessDocExists);
assertCondition(androidReadinessDocExists, 'docs/ANDROID_PACKAGING_READINESS.md should exist');

const capacitorPackages = ['@capacitor/core', '@capacitor/cli', '@capacitor/android', '@capacitor/ios'];
const capacitorNotInstalled = capacitorPackages.every((packageName) => !dependencyNames.includes(packageName));
logResult('capacitor_not_installed', capacitorNotInstalled);
assertCondition(capacitorNotInstalled, 'Capacitor packages should not be installed in this PR');

const noAndroidProjectCreated = !fileExists('android');
logResult('no_android_project_created', noAndroidProjectCreated);
assertCondition(noAndroidProjectCreated, 'android project folder should not exist in this PR');

const noIosProjectCreated = !fileExists('ios');
logResult('no_ios_project_created', noIosProjectCreated);
assertCondition(noIosProjectCreated, 'ios project folder should not exist in this PR');

const capacitorConfigPaths = ['capacitor.config.ts', 'capacitor.config.js', 'capacitor.config.json'];
const noCapacitorConfigAdded = capacitorConfigPaths.every((relativePath) => !fileExists(relativePath));
logResult('no_capacitor_config_added', noCapacitorConfigAdded);
assertCondition(noCapacitorConfigAdded, 'Capacitor config should not be added in this PR');

const pwaManifestExists = fileExists('public/manifest.webmanifest');
logResult('pwa_manifest_exists', pwaManifestExists);
assertCondition(pwaManifestExists, 'public/manifest.webmanifest should exist');

const appAssetMastersExist =
  fileExists('public/brand/harupuli-app-icon-master.svg') &&
  fileExists('public/brand/harupuli-splash-master.svg');
logResult('app_asset_masters_exist', appAssetMastersExist);
assertCondition(appAssetMastersExist, 'app icon and splash master SVG files should exist');

const capacitorReadinessDoc = readText('docs/CAPACITOR_READINESS.md');
const capacitorReadinessDocMentionsAndroid =
  capacitorReadinessDoc.includes('Android 우선') ||
  capacitorReadinessDoc.includes('Android 패키징') ||
  capacitorReadinessDoc.includes('ANDROID_PACKAGING_READINESS');
logResult('capacitor_readiness_doc_mentions_android', capacitorReadinessDocMentionsAndroid);
assertCondition(
  capacitorReadinessDocMentionsAndroid,
  'CAPACITOR_READINESS should mention Android packaging readiness',
);

const appPackagingStrategyDoc = readText('docs/APP_PACKAGING_STRATEGY.md');
const appPackagingStrategyMentionsAndroid = appPackagingStrategyDoc.includes('Android');
logResult('app_packaging_strategy_mentions_android', appPackagingStrategyMentionsAndroid);
assertCondition(appPackagingStrategyMentionsAndroid, 'APP_PACKAGING_STRATEGY should mention Android');

const serviceWorkerPaths = ['public/service-worker.js', 'public/sw.js', 'src/service-worker.js', 'src/sw.js'];
const noServiceWorkerAdded = serviceWorkerPaths.every((relativePath) => !fileExists(relativePath));
logResult('no_service_worker_added', noServiceWorkerAdded);
assertCondition(noServiceWorkerAdded, 'service worker files should not be added in this PR');

const nativeDependencyMarkers = ['@capacitor/', 'react-native', 'expo'];
const noNativeDependencyAdded = dependencyNames.every((packageName) =>
  nativeDependencyMarkers.every((marker) => !packageName.includes(marker)),
);
logResult('no_native_dependency_added', noNativeDependencyAdded);
assertCondition(noNativeDependencyAdded, 'native app dependencies should not be added in this PR');

if (failures.length > 0) {
  console.error('Android packaging readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android packaging readiness check passed');
}
