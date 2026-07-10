import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const resultDocPath = 'docs/PRIVACY_POLICY_PUBLIC_PAGE_OPTIONS.md';
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
  console.error('Privacy policy public page options check failed');
  console.error('- result_doc_exists');
  process.exit(1);
}

const resultDoc = read(resultDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);
const packageJsonSource = read(packageJsonPath);

const requiredDocSnippets = [
  'Privacy Policy Public Page Options',
  'Status: Options only',
  'Privacy policy public page option review: Completed',
  '개인정보 처리방침 URL 후보 선정: Pending',
  '개인정보 처리방침 URL 확정: Pending',
  '문의처 이메일/지원 연락처 후보 선정: Pending',
  '문의처 이메일/지원 연락처 확정: Pending',
  'Google Play Console input: Pending',
  'Store screenshot upload: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Purpose: Document public page options for privacy policy URL before final URL selection',
  'PR type: docs/check-only',
  'App name: 하루풀이',
  'Related privacy URL/support contact candidate plan PR: #346',
  'Public page option candidates',
  'App-hosted static privacy page',
  'Separate static hosting page',
  'Existing company/developer domain page',
  'Public URL readiness criteria',
  'Privacy policy content sync checklist',
  'Blockers before URL finalization',
  'No 개인정보 처리방침 URL finalization',
  'No 개인정보 처리방침 public page implementation',
  'No 문의처 이메일/지원 연락처 finalization',
  'No Google Play Console input',
  'No Store screenshot upload',
  'No Google Play 데이터 보안 양식 최종 입력',
  'No actual versionName change',
  'No actual versionCode change',
  'No release build',
  'No signing setup',
  'No keystore file added',
  'No AAB generation',
  'No src changes',
  'No CSS changes',
  'No production UI changes',
  'No routing changes',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No production fortune logic changes',
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
  /Privacy policy public page implementation \| Completed/,
  /문의처 이메일\/지원 연락처 \| Completed/,
  /문의처 이메일\/지원 연락처 후보 선정 \| Completed/,
  /문의처 이메일\/지원 연락처 확정 \| Completed/,
  /Google Play 데이터 보안 양식 \| Completed/,
  /Google Play 데이터 보안 양식 최종 입력 \| Completed/,
  /Google Play Console actual input \| Completed/,
  /Store screenshot upload \| Completed/,
  /Actual versionName change \| Completed/,
  /Actual versionCode change \| Completed/,
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
  '- [x] 개인정보 처리방침 공개 페이지 방식 후보 문서화',
  '- [x] Privacy policy public page options 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] 개인정보 처리방침 URL 후보 선정',
  '- [ ] 개인정보 처리방침 URL 확정',
  '- [ ] 문의처 이메일/지원 연락처 후보 선정',
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
  developmentLogSource.includes('## Privacy Policy Public Page Options'),
  'development_log_has_section',
);
mark(
  changelogSource.includes(
    'Added privacy policy public page options for Google Play launch preparation.',
  ),
  'changelog_records_result_doc',
);

mark(
  packageJsonSource.includes(
    '"check:privacy-policy-public-page-options": "node scripts/checkPrivacyPolicyPublicPageOptions.mjs"',
  ),
  'package_json_has_check_script',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Privacy policy public page options check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Privacy policy public page options check passed');
