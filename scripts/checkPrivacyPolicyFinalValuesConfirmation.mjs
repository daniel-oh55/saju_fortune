import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const resultDocPath = 'docs/PRIVACY_POLICY_FINAL_VALUES_CONFIRMATION.md';
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
  console.error('Privacy policy final values confirmation check failed');
  console.error('- result_doc_exists');
  process.exit(1);
}

const resultDoc = read(resultDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);
const packageJsonSource = read(packageJsonPath);

const requiredDocSnippets = [
  'Privacy Policy Final Values Confirmation',
  'Status: Final values confirmed',
  '개인정보 처리방침 URL 후보 선정: Completed',
  '개인정보 처리방침 URL 검증 결과 기록: Completed',
  '개인정보 처리방침 URL 확정: Completed',
  '문의처 이메일/지원 연락처 후보 선정: Completed',
  '문의처 이메일/지원 연락처 검증 결과 기록: Completed',
  '문의처 이메일/지원 연락처 확정: Completed',
  '시행일 후보 선정: Completed',
  '시행일 확정: Completed',
  '제공자 정보 후보 선정: Completed',
  '제공자 정보 확정: Completed',
  'Privacy policy public page implementation: Completed',
  'Privacy page route implementation: Not changed',
  'Google Play Console input: Pending',
  'Store screenshot upload: Pending',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Purpose: Confirm final privacy policy values after URL and support contact verification',
  'PR type: docs/check-only',
  'App name: 하루풀이',
  'Related privacy policy URL candidate record PR: #359',
  'Related privacy policy URL verification record PR: #360',
  'https://saju-fortune-nu.vercel.app/privacy-policy/',
  'support.hym@gmail.com',
  '2026년 7월 12일',
  '하루풀이 운영자',
  'Final confirmed',
  'Verification basis',
  'PR #360 verification record',
  'No Google Play Console input',
  'No Store screenshot upload',
  'No Google Play 데이터 보안 양식 최종 입력',
  'No privacy page route implementation',
  'No routing changes',
  'No public/privacy-policy/index.html changes',
  'No src changes',
  'No CSS changes',
  'No production UI changes',
  'No design changes',
  'No image file changes',
  'No new image files',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No package dependency changes',
  'No actual versionName change',
  'No actual versionCode change',
  'No release build',
  'No signing setup',
  'No keystore file added',
  'No AAB generation',
  'No production fortune logic changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  'Recommended next sequence',
  '출시 전 홈 화면 UI polish',
];
for (const snippet of requiredDocSnippets) {
  mark(resultDoc.includes(snippet), `result_doc_includes_${snippet}`);
}

const forbiddenPatterns = [
  /Google Play Console actual input\s*[|:]\s*Completed/,
  /Store screenshot upload\s*[|:]\s*Completed/,
  /Google Play 데이터 보안 양식 최종 입력\s*[|:]\s*Completed/,
  /Release build\s*[|:]\s*Completed/,
  /Signing setup\s*[|:]\s*Completed/,
  /AAB generation\s*[|:]\s*Completed/,
  /실제 스토어 스크린샷 이미지 시작/,
  /서양식 보정 적용 여부/,
  /양력\/음력 샘플 추가 검증/,
  /Google Play Console 입력 완료/,
  /Store screenshot upload 완료/,
  /release build 완료/,
  /signing 설정 완료/,
  /AAB 생성 완료/,
];
mark(
  !forbiddenPatterns.some((pattern) => pattern.test(resultDoc)),
  'result_doc_no_forbidden_snippets',
);

const requiredTodoCompletedSnippets = [
  '- [x] 개인정보 처리방침 URL 확정',
  '- [x] 문의처 이메일/지원 연락처 확정',
  '- [x] 시행일 확정',
  '- [x] 제공자 정보 확정',
  '- [x] Privacy policy final values confirmation 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] Google Play 데이터 보안 양식 최종 입력',
  '- [ ] Store screenshot upload',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
  '- [ ] 디자인 변경 후 Android 실제 기기 또는 에뮬레이터 화면 QA',
  '- [ ] 디자인 변경 후 실제 스토어 스크린샷 이미지 제작',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

const requiredDevelopmentLogSnippets = [
  '## Privacy Policy Final Values Confirmation',
  'PR 목적: 개인정보 처리방침 최종값 확정',
  'Status: Final values confirmed',
  '개인정보 처리방침 URL 확정: Completed',
  '문의처 이메일/지원 연락처 확정: Completed',
  '시행일 확정: Completed',
  '제공자 정보 확정: Completed',
  'Google Play 데이터 보안 양식 최종 입력: Pending',
  'Google Play Console actual input: Pending',
  'Store screenshot upload: Pending',
  'src 변경 없음',
  'CSS 파일 변경 없음',
  'production 앱 UI 변경 없음',
  'React routing 변경 없음',
  'public/privacy-policy/index.html 변경 없음',
  'AndroidManifest.xml 변경 없음',
  'Android native/resource 변경 없음',
  'Gradle 변경 없음',
  'Capacitor config 변경 없음',
  'package dependency 변경 없음',
  '디자인 변경 없음',
  '이미지 파일 변경 없음',
  'Google Play Console 입력 없음',
  'release build 생성 없음',
  'signing 설정 변경 없음',
  'keystore 파일 추가 없음',
  'AAB 생성 없음',
  'production 계산 로직 변경 없음',
  'schemaVersion 변경 없음',
  'CURRENT_FORTUNE_SCHEMA_VERSION 변경 없음',
  '기존 localStorage key 변경 없음',
];
for (const snippet of requiredDevelopmentLogSnippets) {
  mark(developmentLogSource.includes(snippet), `development_log_includes_${snippet}`);
}

const requiredChangelogSnippets = [
  'Confirmed final privacy policy URL, support contact, effective date, and provider information for Google Play launch preparation.',
  'Kept Google Play Console input, Store screenshot upload, and Google Play 데이터 보안 양식 최종 입력 as Pending.',
  'Kept release build, signing setup, and AAB generation as Not started.',
];
for (const snippet of requiredChangelogSnippets) {
  mark(changelogSource.includes(snippet), `changelog_includes_${snippet}`);
}

mark(
  packageJsonSource.includes(
    '"check:privacy-policy-final-values-confirmation": "node scripts/checkPrivacyPolicyFinalValuesConfirmation.mjs"',
  ),
  'package_json_has_check_script',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Privacy policy final values confirmation check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Privacy policy final values confirmation check passed');
