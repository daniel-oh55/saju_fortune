import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const readinessDocPath = 'docs/STORE_SCREENSHOT_CAPTURE_BASIS_READINESS.md';
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
  console.error('Store screenshot capture basis readiness check failed');
  console.error('- readiness_doc_exists');
  process.exit(1);
}

const readinessDoc = read(readinessDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);

const requiredDocSnippets = [
  'Store Screenshot Capture Basis Readiness',
  'Status: Readiness only',
  'Capture device selection: Candidate',
  'Android Debug APK basis: Candidate',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  'Store screenshot upload: Pending',
  'Google Play Console input: Pending',
  'This document does not include actual screenshot image files.',
  'Purpose: Document capture device and APK basis readiness before actual Google Play store screenshot image production',
  'PR type: docs/check-only',
  'App name: 하루풀이',
  'Related Store screenshot production plan PR: #333',
  'Related Store screenshot sample profile PR: #334',
  'Related Store screenshot capture/copy readiness PR: #335',
  'Capture device candidate',
  'APK basis candidate',
  'Capture readiness checklist',
  'PR #335 기준 run #264 후보, 최종 success 확인 필요',
  'Debug APK install for screenshot capture',
  'Pending',
  'App launch for screenshot capture',
  'Release build',
  'Not started',
  'No src changes',
  'No CSS changes',
  'No production UI changes',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No screenshot image files added',
  'No actual screenshot production',
  'No 실제 스토어 스크린샷 이미지 제작 completion',
  'No Google Play Console input',
  'No Store listing finalization',
  'No 개인정보 처리방침 URL finalization',
  'No 문의처 이메일/지원 연락처 finalization',
  'No Google Play 데이터 보안 양식 completion',
  'No release build',
  'No signing setup',
  'No keystore file added',
  'No AAB generation',
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

const forbiddenPatterns = [
  /실제 스토어 스크린샷 이미지 제작 \| Completed/,
  /실제 스토어 스크린샷 이미지 제작 완료(?!가 아닙니다)/,
  /실제 스토어 스크린샷 이미지 시작/,
  /Store screenshot upload \| Completed/,
  /Google Play Console actual input \| Completed/,
  /Store listing final text \| Completed/,
  /개인정보 처리방침 URL \| Completed/,
  /문의처 이메일\/지원 연락처 확정 \| Completed/,
  /Google Play 데이터 보안 양식 \| Completed/,
  /Google Play 데이터 보안 양식 최종 입력 \| Completed/,
  /Capture device finalization \| Completed/,
  /Android Debug APK basis finalization \| Completed/,
  /Debug APK install for screenshot capture \| Completed/,
  /App launch for screenshot capture \| Completed/,
  /Release build \| Completed/,
  /Signing setup \| Completed/,
  /AAB generation \| Completed/,
  /서양식 보정 적용 여부/,
  /양력\/음력 샘플 추가 검증/,
  /Google Play Console 입력 완료/,
  /release build 완료/,
  /signing 설정 완료/,
  /AAB 생성 완료/,
];
mark(
  !forbiddenPatterns.some((pattern) => pattern.test(readinessDoc)),
  'readiness_doc_no_forbidden_snippets',
);

const requiredTodoCompletedSnippets = [
  '- [x] 스토어 스크린샷 캡처 기기/APK 기준 확인 문서화',
  '- [x] Store screenshot capture basis readiness 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] 실제 스토어 스크린샷 이미지 제작',
  '- [ ] Store screenshot upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] Store listing 최종 문구 확정',
  '- [ ] 개인정보 처리방침 URL 확정',
  '- [ ] 문의처 이메일/지원 연락처 확정',
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(
  developmentLogSource.includes('## Store Screenshot Capture Basis Readiness'),
  'development_log_has_section',
);
mark(
  changelogSource.includes(
    'Documented store screenshot capture basis readiness for Google Play launch preparation.',
  ),
  'changelog_records_readiness_doc',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Store screenshot capture basis readiness check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Store screenshot capture basis readiness check passed');
