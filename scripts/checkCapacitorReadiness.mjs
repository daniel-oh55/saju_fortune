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
assertCondition(androidProjectExists, 'android native project folder should exist after the Android scaffold stage');

const noIosProjectCreated = !fileExists('ios');
logResult('no_ios_project_created', noIosProjectCreated);
assertCondition(noIosProjectCreated, 'ios native project folder should not exist in this PR');

const pwaManifestExists = fileExists('public/manifest.webmanifest');
logResult('pwa_manifest_exists', pwaManifestExists);
assertCondition(pwaManifestExists, 'public/manifest.webmanifest should exist');

const appAssetMastersExist =
  fileExists('public/brand/harupuli-app-icon-master.svg') &&
  fileExists('public/brand/harupuli-splash-master.svg');
logResult('app_asset_masters_exist', appAssetMastersExist);
assertCondition(appAssetMastersExist, 'app icon and splash master SVG files should exist');

const capacitorReadinessDocExists = fileExists('docs/CAPACITOR_READINESS.md');
logResult('capacitor_readiness_doc_exists', capacitorReadinessDocExists);
assertCondition(capacitorReadinessDocExists, 'docs/CAPACITOR_READINESS.md should exist');

const appPackagingStrategy = readText('docs/APP_PACKAGING_STRATEGY.md');
const appPackagingStrategyMentionsCapacitor = appPackagingStrategy.includes('Capacitor');
logResult('app_packaging_strategy_mentions_capacitor', appPackagingStrategyMentionsCapacitor);
assertCondition(appPackagingStrategyMentionsCapacitor, 'APP_PACKAGING_STRATEGY should mention Capacitor');

const pwaReadinessDoc = readText('docs/PWA_READINESS.md');
const pwaDocMentionsCapacitor =
  pwaReadinessDoc.includes('Capacitor') || pwaReadinessDoc.includes('CAPACITOR_READINESS');
logResult('pwa_doc_mentions_capacitor', pwaDocMentionsCapacitor);
assertCondition(pwaDocMentionsCapacitor, 'PWA_READINESS should mention Capacitor readiness');

const capacitorConfigJsonAdded = fileExists('capacitor.config.json');
logResult('capacitor_config_json_added', capacitorConfigJsonAdded);
assertCondition(capacitorConfigJsonAdded, 'capacitor.config.json should exist');

const noCapacitorTsOrJsConfigAdded = !fileExists('capacitor.config.ts') && !fileExists('capacitor.config.js');
logResult('no_capacitor_ts_or_js_config_added', noCapacitorTsOrJsConfigAdded);
assertCondition(noCapacitorTsOrJsConfigAdded, 'capacitor.config.ts/js should not be added in this PR');

const serviceWorkerPaths = ['public/service-worker.js', 'public/sw.js', 'src/service-worker.js', 'src/sw.js'];
const noServiceWorkerAdded = serviceWorkerPaths.every((relativePath) => !fileExists(relativePath));
logResult('no_service_worker_added', noServiceWorkerAdded);
assertCondition(noServiceWorkerAdded, 'service worker files should not be added in this PR');

if (failures.length > 0) {
  console.error('Capacitor readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Capacitor readiness check passed');
}
