import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const readinessDocPath = 'docs/PRIVACY_POLICY_CONTACT_READINESS.md';
const todoPath = 'TODO.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const changelogPath = 'CHANGELOG.md';

const read = (relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(path.join(projectRoot, readinessDocPath)), 'readiness_doc_exists');
if (!fs.existsSync(path.join(projectRoot, readinessDocPath))) {
  console.error('Privacy policy and support contact readiness check failed');
  console.error('- readiness_doc_exists');
  process.exit(1);
}

const readinessDoc = read(readinessDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);

const requiredDocSnippets = [
  'Privacy Policy and Support Contact Readiness',
  'Purpose: Document privacy policy URL and support contact readiness for Google Play launch preparation',
  'PR type: docs/check-only',
  'App name: 하루풀이',
  'Related readiness PR: #327',
  'Current privacy policy URL status: Pending',
  'Current support contact status: Pending',
  'Current Google Play Console input status: Pending',
  'localStorage',
  'Clipboard fallback share',
  'Actual external share send',
  'Not performed',
  '개인정보 처리방침 URL',
  'Pending',
  '문의처 이메일/지원 연락처 확정',
  'Google Play 데이터 보안 양식',
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
  'Recommended next sequence',
];
for (const snippet of requiredDocSnippets) {
  mark(readinessDoc.includes(snippet), `readiness_doc_includes_${snippet}`);
}

const forbiddenSnippets = [
  '개인정보 처리방침 URL | Completed',
  '문의처 이메일/지원 연락처 확정 | Completed',
  'Google Play 데이터 보안 양식 | Completed',
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
  'Google Play 데이터 보안 양식 완료',
  'Google Play Console 입력 완료',
  'release build 완료',
  'signing 설정 완료',
  'AAB 생성 완료',
];
mark(!forbiddenSnippets.some((snippet) => readinessDoc.includes(snippet)), 'readiness_doc_no_forbidden_snippets');

const requiredTodoCompletedSnippets = [
  '- [x] 개인정보 처리방침/문의처 준비 상태 문서화',
  '- [x] Privacy policy and support contact readiness 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] 개인정보 처리방침 URL 확정',
  '- [ ] 문의처 이메일/지원 연락처 확정',
  '- [ ] 앱 내부 개인정보 처리방침 링크 또는 안내 위치 검토',
  '- [ ] 실제 스토어 스크린샷 이미지 제작 계획 수립',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
  '- [ ] Google Play Console 실제 입력',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(
  developmentLogSource.includes('## Privacy Policy and Support Contact Readiness'),
  'development_log_has_section',
);
mark(
  changelogSource.includes(
    'Documented privacy policy and support contact readiness for Google Play launch preparation.',
  ),
  'changelog_records_readiness_doc',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Privacy policy and support contact readiness check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Privacy policy and support contact readiness check passed');
