import fs from 'node:fs';

const savedReadingShareDocPath = 'docs/SAVED_READING_SHARE_ANDROID_QA_RESULT.md';
const layoutQaDocPath = 'docs/SHARE_COPY_ACTION_BUTTON_LAYOUT_ANDROID_QA_RESULT.md';
const todoPath = 'TODO.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const changelogPath = 'CHANGELOG.md';

const read = (path) => fs.readFileSync(path, 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(savedReadingShareDocPath), 'saved_reading_share_doc_exists');
mark(fs.existsSync(layoutQaDocPath), 'layout_qa_doc_exists');
if (!fs.existsSync(savedReadingShareDocPath) || !fs.existsSync(layoutQaDocPath)) {
  console.error('Share fallback layout Android QA result check failed');
  checks.filter((check) => !check.condition).forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

const savedReadingShareDoc = read(savedReadingShareDocPath);
const layoutQaDoc = read(layoutQaDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);

const requiredSavedReadingShareDocSnippets = [
  'Completed for clipboard fallback path',
  'Android share sheet not opened',
  'Android share sheet opens | Not opened',
  'Clipboard fallback behavior | Completed',
  'No src changes',
  'No AndroidManifest.xml changes',
  'No release build',
  'No signing setup',
  'No AAB generation',
  'No Google Play Console input',
];
for (const snippet of requiredSavedReadingShareDocSnippets) {
  mark(savedReadingShareDoc.includes(snippet), `saved_reading_share_doc_includes_${snippet}`);
}

const requiredLayoutQaDocSnippets = [
  'Share Copy Action Button Layout Android QA Result',
  'Related PR: #322',
  'Android Debug Build run: #251',
  'Delete button size remains stable after share status',
  'Save button size remains stable after copy status',
  'No src changes',
  'No CSS changes',
  'No share logic changes',
  'No copy logic changes',
  'No Web Share API behavior changes',
  'No clipboard fallback behavior changes',
  'No Kakao SDK integration',
  'No SMS permission/native integration',
  'No @capacitor/share integration',
  'No AndroidManifest.xml changes',
  'No release build',
  'No signing setup',
  'No AAB generation',
  'No Google Play Console input',
];
for (const snippet of requiredLayoutQaDocSnippets) {
  mark(layoutQaDoc.includes(snippet), `layout_qa_doc_includes_${snippet}`);
}

const forbiddenDocSnippets = [
  'Android share sheet opens | Completed',
  'Clipboard fallback behavior | Pending',
  'Delete button size remains stable after share status | Pending',
  'Save button size remains stable after copy status | Pending',
  '@capacitor/share integration | Completed',
  'Kakao SDK integration | Completed',
  'SMS permission/native integration | Completed',
  'AndroidManifest.xml update for sharing | Completed',
  'Release build | Completed',
  'Signing setup | Completed',
  'AAB generation | Completed',
  'Google Play Console actual input | Completed',
];
for (const snippet of forbiddenDocSnippets) {
  mark(!savedReadingShareDoc.includes(snippet), `saved_reading_share_doc_forbidden_absent_${snippet}`);
  mark(!layoutQaDoc.includes(snippet), `layout_qa_doc_forbidden_absent_${snippet}`);
}

const requiredTodoCompletedSnippets = [
  '- [x] Android share sheet 미표시 및 clipboard fallback 실제 결과 정정',
  '- [x] Android share sheet 미표시 실제 확인',
  '- [x] Clipboard fallback 실제 확인',
  '- [x] 저장한 풀이 공유/삭제 버튼 layout Android QA 결과 문서화',
  '- [x] 운세 결과 풀이 저장/복사 버튼 layout Android QA 결과 문서화',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] Android share sheet 실제 표시 확인',
  '- [ ] 공유 문구 개인정보 제외 실제 확인',
  '- [ ] 실제 외부 공유 발송 확인',
  '- [ ] Kakao SDK 연동 검토',
  '- [ ] SMS permission/native integration 검토',
  '- [ ] @capacitor/share 도입 여부 검토',
  '- [ ] AndroidManifest.xml 공유 관련 변경 필요 여부 검토',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
  '- [ ] Google Play Console 실제 입력',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(developmentLogSource.includes('## Share Fallback Layout Android QA Result'), 'development_log_has_section');
mark(
  changelogSource.includes(
    'Corrected saved reading share Android QA result to reflect clipboard fallback path instead of Android share sheet opening.',
  ),
  'changelog_records_correction',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Share fallback layout Android QA result check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Share fallback layout Android QA result check passed');
