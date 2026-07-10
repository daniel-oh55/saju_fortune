import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const resultDocPath = 'docs/RELEASE_SIGNING_AAB_READINESS_CHECKLIST.md';
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
  console.error('Release signing AAB readiness checklist check failed');
  console.error('- result_doc_exists');
  process.exit(1);
}

const resultDoc = read(resultDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);
const packageJsonSource = read(packageJsonPath);

const requiredDocSnippets = [
  'Release Signing AAB Readiness Checklist',
  'Status: Checklist only',
  'Release build: Not started',
  'Signing setup: Not started',
  'AAB generation: Not started',
  'Google Play Console input: Pending',
  'Store screenshot upload: Pending',
  '개인정보 처리방침 URL 확정: Pending',
  '문의처 이메일/지원 연락처 확정: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Purpose: Define readiness checklist before release build, signing setup, and AAB generation',
  'PR type: docs/check-only',
  'App name: 하루풀이',
  'Related Google Play data safety final review PR: #347',
  'Release build readiness checklist',
  'Signing readiness checklist',
  'AAB generation readiness checklist',
  'Google Play blockers before release upload',
  'Keystore storage policy',
  'repo에 keystore 파일 추가 금지',
  'No release build',
  'No signing setup',
  'No keystore file added',
  'No AAB generation',
  'No Google Play Console input',
  'No Store screenshot upload',
  'No 개인정보 처리방침 URL finalization',
  'No 문의처 이메일/지원 연락처 finalization',
  'No Google Play 데이터 보안 양식 최종 입력',
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
  /Release build \| Completed/,
  /Signing setup \| Completed/,
  /AAB generation \| Completed/,
  /release build 완료/,
  /signing 설정 완료/,
  /AAB 생성 완료/,
  /(?<!No )keystore file added/,
  /keystore 파일 추가 완료/,
  /Google Play Console actual input \| Completed/,
  /Store screenshot upload \| Completed/,
  /개인정보 처리방침 URL \| Completed/,
  /개인정보 처리방침 URL 확정 \| Completed/,
  /문의처 이메일\/지원 연락처 \| Completed/,
  /문의처 이메일\/지원 연락처 확정 \| Completed/,
  /Google Play 데이터 보안 양식 \| Completed/,
  /Google Play 데이터 보안 양식 최종 입력 \| Completed/,
  /실제 스토어 스크린샷 이미지 시작/,
  /서양식 보정 적용 여부/,
  /양력\/음력 샘플 추가 검증/,
  /Google Play Console 입력 완료/,
  /Store screenshot upload 완료/,
];
mark(
  !forbiddenPatterns.some((pattern) => pattern.test(resultDoc)),
  'result_doc_no_forbidden_snippets',
);

const requiredTodoCompletedSnippets = [
  '- [x] release build/signing/AAB 준비 체크리스트 문서화',
  '- [x] Release signing AAB readiness checklist 검증 스크립트 추가',
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
  developmentLogSource.includes('## Release Signing AAB Readiness Checklist'),
  'development_log_has_section',
);
mark(
  changelogSource.includes(
    'Added release signing AAB readiness checklist for Google Play launch preparation.',
  ),
  'changelog_records_result_doc',
);

mark(
  packageJsonSource.includes(
    '"check:release-signing-aab-readiness-checklist": "node scripts/checkReleaseSigningAabReadinessChecklist.mjs"',
  ),
  'package_json_has_check_script',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Release signing AAB readiness checklist check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Release signing AAB readiness checklist check passed');
