import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const readinessDocPath = 'docs/STORE_SCREENSHOT_CAPTURE_COPY_READINESS.md';
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
  console.error('Store screenshot capture and copy readiness check failed');
  console.error('- readiness_doc_exists');
  process.exit(1);
}

const readinessDoc = read(readinessDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);

const requiredDocSnippets = [
  'Store Screenshot Capture and Copy Readiness',
  'Status: Readiness only',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  'Store screenshot upload: Pending',
  'Google Play Console input: Pending',
  'Store listing final text: Pending',
  'This document does not include actual screenshot image files.',
  'Purpose: Finalize planned capture screens and screenshot copy candidates before actual Google Play store screenshot image production',
  'PR type: docs/check-only',
  'App name: 하루풀이',
  'Related Store screenshot production plan PR: #333',
  'Related Store screenshot sample profile PR: #334',
  'Related Store listing draft PR: #332',
  'Current screenshot image production status: Pending',
  'Current Google Play Console input status: Pending',
  'Current release build status: Not started',
  'Final planned screenshot capture set',
  '홈 화면',
  '오늘운세 결과',
  '나의 사주 흐름',
  '2026 운세',
  '띠별운세',
  '저장한 풀이',
  'Ready for production은 캡처 계획과 문구 후보가 준비되었다는 뜻입니다.',
  '실제 스토어 스크린샷 이미지 제작 완료가 아닙니다.',
  'Copy safety review',
  'Sample profile reference',
  'Capture readiness checklist',
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
  '- [x] 스토어 스크린샷 캡처 화면/문구 최종 확인 문서화',
  '- [x] Store screenshot capture/copy readiness 검증 스크립트 추가',
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
  '- [ ] 캡처 기기와 캡처 기준 APK 확인',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(
  developmentLogSource.includes('## Store Screenshot Capture and Copy Readiness'),
  'development_log_has_section',
);
mark(
  changelogSource.includes(
    'Documented store screenshot capture and copy readiness for Google Play launch preparation.',
  ),
  'changelog_records_readiness_doc',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Store screenshot capture and copy readiness check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Store screenshot capture and copy readiness check passed');
