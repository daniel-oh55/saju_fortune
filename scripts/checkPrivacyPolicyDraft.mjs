import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const draftDocPath = 'docs/PRIVACY_POLICY_DRAFT.md';
const todoPath = 'TODO.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const changelogPath = 'CHANGELOG.md';

const read = (relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(path.join(projectRoot, draftDocPath)), 'draft_doc_exists');
if (!fs.existsSync(path.join(projectRoot, draftDocPath))) {
  console.error('Privacy policy draft check failed');
  console.error('- draft_doc_exists');
  process.exit(1);
}

const draftDoc = read(draftDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);

const requiredDocSnippets = [
  'Privacy Policy Draft',
  'Status: Draft',
  'This document is not the finalized public privacy policy.',
  '개인정보 처리방침 URL: Pending',
  '문의처 이메일/지원 연락처: Pending',
  'Google Play Console input: Pending',
  'App internal privacy policy link/text: Pending',
  '총칙',
  '수집 또는 처리하는 정보',
  '정보의 이용 목적',
  '정보의 저장 방식',
  '제3자 제공 및 외부 전송',
  '공유 기능 관련 안내',
  '개인정보의 보관 및 삭제',
  '이용자의 권리 및 문의',
  '아동의 개인정보',
  '개인정보 처리방침의 변경',
  '시행일',
  '문의처',
  '[문의처 이메일 확정 필요]',
  '[개인정보 처리방침 URL 확정 필요]',
  '[시행일 확정 필요]',
  '[제공자 정보 확정 필요]',
  '서버 DB 없음',
  '로그인 없음',
  '실제 광고 SDK 없음',
  '실제 결제 SDK 없음',
  '외부 분석 SDK 없음',
  'localStorage 중심 저장 구조',
  'No src changes',
  'No CSS changes',
  'No production UI changes',
  'No app privacy policy link UI',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No release build',
  'No signing setup',
  'No keystore file added',
  'No AAB generation',
  'No Google Play Console input',
  'No 개인정보 처리방침 URL finalization',
  'No 문의처 이메일/지원 연락처 finalization',
  'No Google Play 데이터 보안 양식 completion',
  'No 실제 스토어 스크린샷 이미지 제작 completion',
  'No production fortune logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
];
for (const snippet of requiredDocSnippets) {
  mark(draftDoc.includes(snippet), `draft_doc_includes_${snippet}`);
}

const forbiddenSnippets = [
  'Status: Final',
  '개인정보 처리방침 URL | Completed',
  '문의처 이메일/지원 연락처 확정 | Completed',
  '시행일 확정 | Completed',
  '제공자 정보 확정 | Completed',
  'Google Play Console actual input | Completed',
  'Release build | Completed',
  'Signing setup | Completed',
  'AAB generation | Completed',
  '실제 스토어 스크린샷 이미지 제작 | Completed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  '개인정보 처리방침 URL 완료',
  '문의처 확정 완료',
  '시행일 확정 완료',
  'Google Play Console 입력 완료',
  'release build 완료',
  'signing 설정 완료',
  'AAB 생성 완료',
];
mark(!forbiddenSnippets.some((snippet) => draftDoc.includes(snippet)), 'draft_doc_no_forbidden_snippets');

const requiredTodoCompletedSnippets = [
  '- [x] 개인정보 처리방침 문서 초안 작성',
  '- [x] Privacy policy draft 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] 개인정보 처리방침 URL 확정',
  '- [ ] 문의처 이메일/지원 연락처 확정',
  '- [ ] 시행일 확정',
  '- [ ] 제공자 정보 확정',
  '- [ ] 앱 내부 개인정보 처리방침 링크 또는 안내 위치 검토',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
  '- [ ] Google Play Console 실제 입력',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(developmentLogSource.includes('## Privacy Policy Draft'), 'development_log_has_section');
mark(
  changelogSource.includes('Added draft privacy policy for Google Play launch preparation.'),
  'changelog_records_draft_doc',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Privacy policy draft check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Privacy policy draft check passed');
