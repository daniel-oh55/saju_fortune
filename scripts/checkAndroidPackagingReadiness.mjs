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

const capacitorCoreInstalled = dependencyNames.includes('@capacitor/core');
logResult('capacitor_core_installed', capacitorCoreInstalled);
assertCondition(capacitorCoreInstalled, '@capacitor/core should be installed');

const capacitorCliInstalled = dependencyNames.includes('@capacitor/cli');
logResult('capacitor_cli_installed', capacitorCliInstalled);
assertCondition(capacitorCliInstalled, '@capacitor/cli should be installed');

const capacitorAndroidInstalled = dependencyNames.includes('@capacitor/android');
logResult('capacitor_android_installed', capacitorAndroidInstalled);
assertCondition(capacitorAndroidInstalled, '@capacitor/android should be installed after the Android scaffold stage');

const noCapacitorIos = !dependencyNames.includes('@capacitor/ios');
logResult('no_capacitor_ios', noCapacitorIos);
assertCondition(noCapacitorIos, '@capacitor/ios should not be installed yet');

const androidProjectExists = fileExists('android');
logResult('android_project_exists', androidProjectExists);
assertCondition(androidProjectExists, 'android project folder should exist after the Android scaffold stage');

const noIosProjectCreated = !fileExists('ios');
logResult('no_ios_project_created', noIosProjectCreated);
assertCondition(noIosProjectCreated, 'ios project folder should not exist in this PR');

const capacitorConfigJsonAdded = fileExists('capacitor.config.json');
logResult('capacitor_config_json_added', capacitorConfigJsonAdded);
assertCondition(capacitorConfigJsonAdded, 'capacitor.config.json should exist');

const noCapacitorTsOrJsConfigAdded = !fileExists('capacitor.config.ts') && !fileExists('capacitor.config.js');
logResult('no_capacitor_ts_or_js_config_added', noCapacitorTsOrJsConfigAdded);
assertCondition(noCapacitorTsOrJsConfigAdded, 'capacitor.config.ts/js should not be added in this PR');

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
  capacitorReadinessDoc.includes('Android') || capacitorReadinessDoc.includes('ANDROID_PACKAGING_READINESS');
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

const forbiddenNativeDependencies = ['@capacitor/ios', 'react-native', 'expo'];
const noNativeDependencyAdded = forbiddenNativeDependencies.every((packageName) => !dependencyNames.includes(packageName));
logResult('no_native_dependency_added', noNativeDependencyAdded);
assertCondition(noNativeDependencyAdded, 'forbidden native platform dependencies should not be added in this PR');

if (failures.length > 0) {
  console.error('Android packaging readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android packaging readiness check passed');
}
