import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const failures = [];

const correctBrand = '하루풀이';
const typoBrand = '하루풀' + '리';

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

function walkFiles(relativeDir) {
  const absoluteDir = path.join(projectRoot, relativeDir);
  if (!fs.existsSync(absoluteDir)) return [];

  const results = [];
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = path.join(relativeDir, entry.name);
    const absolutePath = path.join(projectRoot, relativePath);

    if (entry.isDirectory()) {
      results.push(...walkFiles(relativePath));
    } else if (entry.isFile()) {
      results.push(relativePath);
    }
  }

  return results;
}

function findFilesContaining(relativePaths, needle) {
  return relativePaths.filter((relativePath) => {
    const absolutePath = path.join(projectRoot, relativePath);
    return fs.existsSync(absolutePath) && fs.readFileSync(absolutePath, 'utf8').includes(needle);
  });
}

function checkNoTypo(sampleId, relativePaths) {
  const matches = findFilesContaining(relativePaths, typoBrand);
  const pass = matches.length === 0;
  logResult(sampleId, pass);
  assertCondition(pass, `brand typo should not remain in: ${matches.join(', ')}`);
}

const publicPrivacyPagePath = 'public/privacy/index.html';
const publicPrivacyPageExists = fileExists(publicPrivacyPagePath);
const publicPrivacyPage = publicPrivacyPageExists ? readText(publicPrivacyPagePath) : '';

const publicPrivacyPageHasCorrectBrand = publicPrivacyPage.includes(correctBrand);
logResult('public_privacy_page_has_correct_brand', publicPrivacyPageHasCorrectBrand);
assertCondition(publicPrivacyPageHasCorrectBrand, 'public/privacy/index.html should include correct brand copy');

const publicPrivacyPageHasNoTypoBrand = !publicPrivacyPage.includes(typoBrand);
logResult('public_privacy_page_has_no_typo_brand', publicPrivacyPageHasNoTypoBrand);
assertCondition(publicPrivacyPageHasNoTypoBrand, 'public/privacy/index.html should not include brand typo');

checkNoTypo('docs_have_no_typo_brand', walkFiles('docs'));
checkNoTypo('public_has_no_typo_brand', walkFiles('public'));
checkNoTypo('src_has_no_typo_brand', walkFiles('src'));
checkNoTypo('root_docs_have_no_typo_brand', ['CHANGELOG.md', 'DEVELOPMENT_LOG.md', 'TODO.md']);
checkNoTypo('scripts_have_no_direct_typo_brand', walkFiles('scripts'));
checkNoTypo('package_has_no_unexpected_brand_typo', ['package.json']);

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

const paymentSdkMarkers = ['billing', 'purchase', 'revenuecat', 'iamport', 'tosspayments'];
const noPaymentSdkAdded = dependencyNames.every((packageName) => {
  const normalizedName = packageName.toLowerCase();
  return paymentSdkMarkers.every((marker) => !normalizedName.includes(marker));
});
logResult('no_payment_sdk_added', noPaymentSdkAdded);
assertCondition(noPaymentSdkAdded, 'payment SDK dependencies should not be added');

const noCapacitorAppAdded = !dependencyNames.includes('@capacitor/app');
logResult('no_capacitor_app_added', noCapacitorAppAdded);
assertCondition(noCapacitorAppAdded, '@capacitor/app should not be added in this PR');

if (failures.length > 0) {
  console.error('Brand copy consistency check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Brand copy consistency check passed');
}
