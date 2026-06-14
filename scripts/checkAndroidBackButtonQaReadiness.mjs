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

const docPath = 'docs/ANDROID_BACK_BUTTON_QA.md';
const backButtonQaDocExists = fileExists(docPath);
logResult('back_button_qa_doc_exists', backButtonQaDocExists);
assertCondition(backButtonQaDocExists, `${docPath} should exist`);

const doc = backButtonQaDocExists ? readText(docPath) : '';

const docMentionsAndroidBackButton =
  doc.includes('Android') || doc.includes('back button') || doc.includes('뒤로가기');
logResult('doc_mentions_android_back_button', docMentionsAndroidBackButton);
assertCondition(docMentionsAndroidBackButton, 'doc should mention Android back button or 뒤로가기');

const docMentionsHome = doc.includes('Home');
logResult('doc_mentions_home', docMentionsHome);
assertCondition(docMentionsHome, 'doc should mention Home');

const docMentionsFortuneDetail = doc.includes('Fortune Detail') || doc.includes('운세 상세');
logResult('doc_mentions_fortune_detail', docMentionsFortuneDetail);
assertCondition(docMentionsFortuneDetail, 'doc should mention Fortune Detail or 운세 상세');

const docMentionsSajuInsight = doc.includes('Saju Insight') || doc.includes('사주');
logResult('doc_mentions_saju_insight', docMentionsSajuInsight);
assertCondition(docMentionsSajuInsight, 'doc should mention Saju Insight or 사주');

const docMentionsSavedReadings = doc.includes('Saved Readings') || doc.includes('저장한 풀이');
logResult('doc_mentions_saved_readings', docMentionsSavedReadings);
assertCondition(docMentionsSavedReadings, 'doc should mention Saved Readings or 저장한 풀이');

const docMentionsSettings = doc.includes('Settings') || doc.includes('설정');
logResult('doc_mentions_settings', docMentionsSettings);
assertCondition(docMentionsSettings, 'doc should mention Settings or 설정');

const docMentionsPrivacy = doc.includes('Privacy') || doc.includes('개인정보');
logResult('doc_mentions_privacy', docMentionsPrivacy);
assertCondition(docMentionsPrivacy, 'doc should mention Privacy or 개인정보');

const docMentionsModalOrPanel =
  doc.includes('Modal') || doc.includes('모달') || doc.includes('Panel') || doc.includes('패널');
logResult('doc_mentions_modal_or_panel', docMentionsModalOrPanel);
assertCondition(docMentionsModalOrPanel, 'doc should mention modal or panel');

const docMentionsCapacitorAppFollowup =
  doc.includes('@capacitor/app') || doc.includes('backButton handler') || doc.includes('listener');
logResult('doc_mentions_capacitor_app_followup', docMentionsCapacitorAppFollowup);
assertCondition(docMentionsCapacitorAppFollowup, 'doc should mention @capacitor/app or backButton follow-up');

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

const noCapacitorAppAddedYet = !dependencyNames.includes('@capacitor/app');
logResult('no_capacitor_app_added_yet', noCapacitorAppAddedYet);
assertCondition(noCapacitorAppAddedYet, '@capacitor/app should not be added in this QA guide PR');

if (failures.length > 0) {
  console.error('Android back button QA readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android back button QA readiness check passed');
}
