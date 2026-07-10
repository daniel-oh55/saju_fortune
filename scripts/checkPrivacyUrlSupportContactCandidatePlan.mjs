import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const resultDocPath = 'docs/PRIVACY_URL_SUPPORT_CONTACT_CANDIDATE_PLAN.md';
const todoPath = 'TODO.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const changelogPath = 'CHANGELOG.md';
const packageJsonPath = 'package.json';

const read = (relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(path.join(projectRoot, resultDocPath)), 'result_doc_exists');
if (!fs.existsSync(path.join(projectRoot, resultDocPath))) {
  console.error('Privacy URL and support contact candidate plan check failed');
  console.error('- result_doc_exists');
  process.exit(1);
}

const resultDoc = read(resultDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);
const packageJsonSource = read(packageJsonPath);

const requiredDocSnippets = [
  'Privacy URL and Support Contact Candidate Plan',
  'Status: Candidate plan only',
  '개인정보 처리방침 URL 후보 선정: Pending',
  '문의처 이메일/지원 연락처 후보 선정: Pending',
  '개인정보 처리방침 URL 확정: Pending',
  '문의처 이메일/지원 연락처 확정: Pending',
  'Google Play Console input: Pending',
  'Store screenshot upload: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Purpose: Document candidate selection and verification plan for privacy policy URL and support contact before Google Play Console input',
  'PR type: docs/check-only',
  'App name: 하루풀이',
  'Related privacy URL/support contact finalization checklist PR: #345',
  'Privacy policy URL candidate plan',
  'Support contact candidate plan',
  'Candidate decision criteria',
  'Required final values before next completion PR',
  '실제 URL 후보 필요',
  '실제 문의처 후보 필요',
  '임의 URL을 생성하지 않습니다.',
  '임의 이메일을 생성하지 않습니다.',
  'No 개인정보 처리방침 URL finalization',
  'No 문의처 이메일/지원 연락처 finalization',
  'No 시행일 finalization',
  'No 제공자 정보 finalization',
  'No Google Play Console input',
  'No Store screenshot upload',
  'No Google Play 데이터 보안 양식 completion',
  'No release build',
  'No signing setup',
  'No keystore file added',
  'No AAB generation',
  'No src changes',
  'No CSS changes',
  'No production UI changes',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No production fortune logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  'Recommended next sequence',
];
for (const snippet of requiredDocSnippets) {
  mark(resultDoc.includes(snippet), `result_doc_includes_${snippet}`);
}

const forbiddenPatterns = [
  /개인정보 처리방침 URL \| Completed/,
  /개인정보 처리방침 URL 후보 선정 \| Completed/,
  /개인정보 처리방침 URL 확정 \| Completed/,
  /문의처 이메일\/지원 연락처 \| Completed/,
  /문의처 이메일\/지원 연락처 후보 선정 \| Completed/,
  /문의처 이메일\/지원 연락처 확정 \| Completed/,
  /시행일 확정 \| Completed/,
  /제공자 정보 확정 \| Completed/,
  /Google Play 데이터 보안 양식 \| Completed/,
  /Google Play 데이터 보안 양식 최종 입력 \| Completed/,
  /Store screenshot upload \| Completed/,
  /Google Play Console actual input \| Completed/,
  /Release build \| Completed/,
  /Signing setup \| Completed/,
  /AAB generation \| Completed/,
  /실제 스토어 스크린샷 이미지 시작/,
  /서양식 보정 적용 여부/,
  /양력\/음력 샘플 추가 검증/,
  /Google Play Console 입력 완료/,
  /Store screenshot upload 완료/,
  /개인정보 처리방침 URL 확정 완료/,
  /문의처 이메일 확정 완료/,
  /release build 완료/,
  /signing 설정 완료/,
  /AAB 생성 완료/,
];
mark(
  !forbiddenPatterns.some((pattern) => pattern.test(resultDoc)),
  'result_doc_no_forbidden_snippets',
);

const requiredTodoCompletedSnippets = [
  '- [x] 개인정보 처리방침 URL/문의처 후보 선정 및 검증 계획 문서화',
  '- [x] Privacy URL/support contact candidate plan 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] 개인정보 처리방침 URL 후보 선정',
  '- [ ] 문의처 이메일/지원 연락처 후보 선정',
  '- [ ] 개인정보 처리방침 URL 확정',
  '- [ ] 문의처 이메일/지원 연락처 확정',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] Store screenshot upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(
  developmentLogSource.includes('## Privacy URL and Support Contact Candidate Plan'),
  'development_log_has_section',
);
mark(
  changelogSource.includes(
    'Added privacy URL and support contact candidate plan for Google Play launch preparation.',
  ),
  'changelog_records_result_doc',
);

mark(
  packageJsonSource.includes(
    '"check:privacy-url-support-contact-candidate-plan": "node scripts/checkPrivacyUrlSupportContactCandidatePlan.mjs"',
  ),
  'package_json_has_check_script',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Privacy URL and support contact candidate plan check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Privacy URL and support contact candidate plan check passed');
