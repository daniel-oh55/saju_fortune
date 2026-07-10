import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const draftDocPath = 'docs/GOOGLE_PLAY_STORE_LISTING_DRAFT.md';
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
  console.error('Google Play store listing draft check failed');
  console.error('- draft_doc_exists');
  process.exit(1);
}

const draftDoc = read(draftDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);

const requiredDocSnippets = [
  'Google Play Store Listing Draft',
  'Status: Draft',
  'Google Play Console input: Pending',
  'Store listing final text: Pending',
  '개인정보 처리방침 URL: Pending',
  '문의처 이메일/지원 연락처: Pending',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  'This document is not the finalized Google Play Store listing.',
  'Purpose: Draft Google Play Store listing text for launch preparation',
  'PR type: docs/check-only',
  'App name: 하루풀이',
  'Related launch readiness PR: #327',
  'Related privacy policy draft PR: #329',
  'Related data safety draft PR: #331',
  'App positioning draft',
  'Store title candidates',
  'Short description draft candidates',
  'Full description draft',
  'Content caution statements',
  'Keyword and tone notes',
  'Store asset readiness',
  '운세 결과는 참고용 콘텐츠입니다.',
  '의료, 법률, 투자, 안전 관련 판단은 전문가의 조언을 우선하세요.',
  '고요한 밤의 운세 다이어리',
  'No src changes',
  'No CSS changes',
  'No production UI changes',
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
  'No Store listing finalization',
  'No 개인정보 처리방침 URL finalization',
  'No 문의처 이메일/지원 연락처 finalization',
  'No Google Play 데이터 보안 양식 completion',
  'No 실제 스토어 스크린샷 이미지 제작 completion',
  'No production fortune logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  'Recommended next sequence',
];
for (const snippet of requiredDocSnippets) {
  mark(draftDoc.includes(snippet), `draft_doc_includes_${snippet}`);
}

const forbiddenSnippets = [
  'Store listing final text | Completed',
  'Google Play Console actual input | Completed',
  '개인정보 처리방침 URL | Completed',
  '문의처 이메일/지원 연락처 확정 | Completed',
  'Google Play 데이터 보안 양식 | Completed',
  'Google Play 데이터 보안 양식 최종 입력 | Completed',
  '실제 스토어 스크린샷 이미지 제작 | Completed',
  '실제 스토어 스크린샷 이미지 시작',
  'Release build | Completed',
  'Signing setup | Completed',
  'AAB generation | Completed',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'Google Play Console 입력 완료',
  'Store listing 최종 확정',
  '실제 스토어 스크린샷 이미지 완료',
  'release build 완료',
  'signing 설정 완료',
  'AAB 생성 완료',
];
mark(!forbiddenSnippets.some((snippet) => draftDoc.includes(snippet)), 'draft_doc_no_forbidden_snippets');

const requiredTodoCompletedSnippets = [
  '- [x] Store listing 문구 초안 정리',
  '- [x] Google Play store listing draft 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] Store listing 최종 문구 확정',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] 개인정보 처리방침 URL 확정',
  '- [ ] 문의처 이메일/지원 연락처 확정',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] 실제 스토어 스크린샷 이미지 제작',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(developmentLogSource.includes('## Google Play Store Listing Draft'), 'development_log_has_section');
mark(
  changelogSource.includes('Added Google Play Store listing draft for launch preparation.'),
  'changelog_records_draft_doc',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Google Play store listing draft check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Google Play store listing draft check passed');
