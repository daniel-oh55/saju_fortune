import fs from 'node:fs';

const resultDocPath = 'docs/ANDROID_LAUNCHER_ICON_APK_QA_RESULT.md';
const todoPath = 'TODO.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const changelogPath = 'CHANGELOG.md';

const read = (path) => fs.readFileSync(path, 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(resultDocPath), 'result_doc_exists');
if (!fs.existsSync(resultDocPath)) {
  console.error('Android launcher icon APK QA result check failed');
  console.error('- result_doc_exists');
  process.exit(1);
}

const resultDoc = read(resultDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);

const requiredSnippets = [
  'Android Launcher Icon APK QA Result',
  'Related PR: #316',
  'Android Debug Build run: #245',
  'APK install',
  'Completed',
  'Launcher icon display',
  'New icon visible',
  'Icon clipping issue',
  'None reported',
  'Icon distortion issue',
  'App launch after install',
  'Android icon resource integration',
  'Real-device launcher QA',
  'Google Play icon upload',
  'Pending',
  'Release build',
  'Not started',
  'Signing setup',
  'AAB generation',
  'Saved reading share feature',
  'KakaoTalk/SMS sharing path review',
];
for (const snippet of requiredSnippets) {
  mark(resultDoc.includes(snippet), `result_doc_includes_${snippet}`);
}

const forbiddenSnippets = [
  'Google Play icon upload: Completed',
  'Google Play Console actual input: Completed',
  'Release build: Completed',
  'Signing setup: Completed',
  'AAB generation: Completed',
  'Saved reading share feature: Completed',
  'KakaoTalk/SMS sharing path review: Completed',
  '실제 Google Play Console 입력 완료',
  'release build 완료',
  'signing 설정 완료',
  'AAB 생성 완료',
  'Google Play 업로드 완료',
];
for (const snippet of forbiddenSnippets) {
  mark(!resultDoc.includes(snippet), `result_doc_forbidden_absent_${snippet}`);
}

const requiredScopeSnippets = [
  'No src changes',
  'No AndroidManifest.xml changes',
  'No Android resource changes',
  'No Gradle changes',
  'No production fortune logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
];
for (const snippet of requiredScopeSnippets) {
  mark(resultDoc.includes(snippet), `result_doc_includes_scope_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] Google Play Console 스크린샷 업로드',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
  '- [ ] 저장한 풀이 공유 기능 검토',
  '- [ ] KakaoTalk/SMS 공유 경로 검토',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(developmentLogSource.includes('## Android Launcher Icon APK QA Result'), 'development_log_has_section');
mark(
  changelogSource.includes('Documented Android launcher icon APK QA result after PR #316.'),
  'changelog_records_qa_result',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Android launcher icon APK QA result check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Android launcher icon APK QA result check passed');
