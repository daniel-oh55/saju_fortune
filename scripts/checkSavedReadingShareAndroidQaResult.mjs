import fs from 'node:fs';

const resultDocPath = 'docs/SAVED_READING_SHARE_ANDROID_QA_RESULT.md';
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
  console.error('Saved reading share Android QA result check failed');
  console.error('- result_doc_exists');
  process.exit(1);
}

const resultDoc = read(resultDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);

const requiredSnippets = [
  'Saved Reading Share Android QA Result',
  'Related PR: #319',
  'Android Debug Build run: #253',
  'Current QA status: Completed for clipboard fallback path; Android share sheet not opened in tested WebView environment',
  'PR type: docs/check-only',
  '저장한 풀이 화면에 `공유하기` 버튼 표시',
  'Android share sheet',
  'Clipboard fallback',
  'Share cancel',
  'birthDate',
  'birthTime',
  'birthPlace',
  'gender',
  'name',
  '실제 Google Play/App Store URL 미포함',
  '사용자가 공유창을 취소한 경우에는 강제로 복사 fallback을 실행하지 않고 취소 상태를 표시',
  'Android QA checklist',
  'Android Debug Build artifact prepared | Completed',
  'APK install | Completed',
  'App launch after install | Completed',
  'Saved readings screen open | Completed',
  'Share button visible | Completed',
  'Android share sheet opens | Not opened',
  'Clipboard fallback behavior | Completed',
  'Share cancel handling | Not applicable',
  'Share text actual verification | Completed',
  'Share text excludes birthDate | Completed',
  'Share text excludes birthTime | Completed',
  'Share text excludes birthPlace | Completed',
  'Share text excludes gender | Completed',
  'Share text excludes name | Completed',
  'Share text excludes real store URLs | Completed',
  'App remains stable after fallback | Completed',
  'Actual external share send | Not performed',
  'Kakao SDK integration | Not started',
  'SMS permission/native integration | Not started',
  'Share image generation | Pending',
  'Release build | Not started',
  'Signing setup | Not started',
  'AAB generation | Not started',
  'Google Play Console actual input | Pending',
  'No src changes',
  'No saved reading share code changes',
  'No share button UI changes',
  'No share text logic changes',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No Kakao SDK integration',
  'No SMS permission/native integration',
  'No production fortune logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  'No release build',
  'No signing setup',
  'No AAB generation',
  'No Google Play Console input',
];
for (const snippet of requiredSnippets) {
  mark(resultDoc.includes(snippet), `result_doc_includes_${snippet}`);
}

const forbiddenSnippets = [
  'Android share sheet opens | Completed',
  'Actual external share send | Completed',
  'Kakao SDK integration | Completed',
  'SMS permission/native integration | Completed',
  'Share image generation | Completed',
  'AndroidManifest.xml update for sharing | Completed',
  'Release build | Completed',
  'Signing setup | Completed',
  'AAB generation | Completed',
  'Google Play Console actual input | Completed',
  '실제 외부 공유 발송 완료',
  'Kakao SDK 연동 완료',
  'SMS 권한 추가 완료',
  'AndroidManifest.xml 공유 변경 완료',
  'release build 완료',
  'signing 설정 완료',
  'AAB 생성 완료',
  'Google Play Console 입력 완료',
];
for (const snippet of forbiddenSnippets) {
  mark(!resultDoc.includes(snippet), `result_doc_forbidden_absent_${snippet}`);
}

const requiredTodoCompletedSnippets = [
  '- [x] 저장한 풀이 텍스트 공유 Android QA 결과 문서 템플릿 추가',
  '- [x] Saved reading share Android QA result 검증 스크립트 추가',
  '- [x] 저장한 풀이 텍스트 공유 Android 실제 기기 QA',
  '- [x] Android share sheet 미표시 실제 확인',
  '- [x] Clipboard fallback 실제 확인',
  '- [x] 공유 문구 개인정보 제외 실제 확인',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] Android share sheet 실제 표시 확인',
  '- [ ] 실제 외부 공유 발송 확인',
  '- [ ] Kakao SDK 연동 검토',
  '- [ ] SMS permission/native integration 검토',
  '- [ ] 공유 이미지 생성 기능 검토',
  '- [ ] AndroidManifest.xml 공유 관련 변경 필요 여부 검토',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
  '- [ ] Google Play Console 실제 입력',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(developmentLogSource.includes('## Saved Reading Share Android QA Complete'), 'development_log_has_section');
mark(
  changelogSource.includes('Recorded Android real-device QA result for saved reading text share.'),
  'changelog_records_qa_result',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Saved reading share Android QA result check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Saved reading share Android QA result check passed');
