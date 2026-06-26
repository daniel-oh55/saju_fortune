import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/LOCAL_STORAGE_DATA_INVENTORY.md';
const dataSafetyDraftPath = 'docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT_CHECKLIST.md';
const dataSafetyReadinessPath = 'docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md';
const roadmapPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';

const requiredPaths = [
  docPath,
  dataSafetyDraftPath,
  dataSafetyReadinessPath,
  roadmapPath,
];

const requiredSections = [
  '# Local Storage Data Inventory',
  '## Purpose',
  '## Current Storage Scope',
  '## localStorage Usage Inventory',
  '## User Input Data Notes',
  '## Google Play Data Safety Impact',
  '## Compatibility Policy',
  '## Pending Items',
  '## Non-Goals for This PR',
  '## Related Docs',
];

const requiredDocSnippets = [
  '서버 DB 없음',
  '로그인 없음',
  '실제 광고 SDK 없음',
  '실제 결제 SDK 없음',
  '외부 분석 SDK 없음',
  'localStorage 중심 사용자 입력 저장 구조',
  '외부 서버로 사용자 입력값 전송 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
  'schemaVersion 변경 없음',
  '실제 Google Play 데이터 보안 양식 입력: Pending',
  '개인정보 처리방침 URL 확정: Pending',
  '문의처 확정: Pending',
  '실제 Google Play Console 입력: Pending',
  'aiTodayFortune.profile',
  'aiTodayFortune.todayFortune',
  'aiTodayFortune.rewardUnlocks',
  'harupuli_consent_preferences_v1',
  'harupuli_saved_readings_v1',
  'harupuli_visit_streak_v1',
  'harupuli_daily_reminder_settings_v1',
  'harupuli_profile_region_meta_v1',
  'harupuli_home_quick_menu_prefs',
];

const relatedDocSnippet = 'Local storage data inventory: docs/LOCAL_STORAGE_DATA_INVENTORY.md';
const relatedDocPaths = [dataSafetyDraftPath, dataSafetyReadinessPath];

const roadmapSnippets = [
  'localStorage 데이터 인벤토리 문서: docs/LOCAL_STORAGE_DATA_INVENTORY.md 참고',
  'localStorage key 최종 점검: Draft',
  '실제 Google Play 데이터 보안 양식 입력: Pending',
];

const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const productionUiAndroidFiles = [
  'src/App.jsx',
  'src/pages/HomePage.jsx',
  'src/pages/ZodiacFortunePage.jsx',
  'src/domain/saju/elementAnalyzer.js',
  'src/domain/saju/createSajuAnalysis.js',
  'src/domain/saju/manseryeokEngine.js',
  'src/domain/saju/hiddenStemElementAnalysisDraft.ts',
  'src/domain/saju/tenGodAnalysisDraft.ts',
  'src/domain/fortune/yearFortuneEngine.js',
  'src/domain/fortune/zodiacFortuneEngine.js',
  'src/utils/fortuneEngine.js',
  'src/utils/storage.js',
  'src/utils/consentPreferencesStorage.js',
  'src/utils/savedReadingsStorage.js',
  'src/utils/visitStreakStorage.js',
  'src/utils/dailyReminderSettings.js',
  'src/utils/profileRegionMetaStorage.js',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
  'android/app/build.gradle',
  'android/build.gradle',
];

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

function labelFromSnippet(snippet) {
  return snippet
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^\p{L}\p{N}_/-]/gu, '')
    .slice(0, 80);
}

let hasFailure = false;

for (const path of requiredPaths) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) {
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');

for (const section of requiredSections) {
  const found = doc.includes(section);
  logResult(`doc_includes_${labelFromSnippet(section)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredDocSnippets) {
  const found = doc.includes(snippet);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const path of relatedDocPaths) {
  const relatedDoc = fs.readFileSync(path, 'utf8');
  const found = relatedDoc.includes(relatedDocSnippet);
  logResult(`${labelFromSnippet(path)}_includes_local_storage_inventory_related_doc`, found);
  if (!found) hasFailure = true;
}

const roadmap = fs.readFileSync(roadmapPath, 'utf8');
for (const snippet of roadmapSnippets) {
  const found = roadmap.includes(snippet);
  logResult(`roadmap_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of wrongPhrases) {
  const absent = !doc.includes(snippet);
  logResult(`wrong_phrase_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`doc_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${productionUiAndroidFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const productionUiAndroidFilesUnchanged = diffOutput.length === 0;
logResult('production_ui_android_native_files_unchanged_in_working_diff', productionUiAndroidFilesUnchanged);
if (!productionUiAndroidFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Local storage data inventory check failed');
  process.exit(1);
}

console.log('Local storage data inventory check passed');
