import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const readinessDocPath = 'docs/GOOGLE_PLAY_LAUNCH_READINESS_STATUS.md';
const todoPath = 'TODO.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const changelogPath = 'CHANGELOG.md';
const packageJsonPath = 'package.json';

const read = (relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(path.join(projectRoot, readinessDocPath)), 'readiness_doc_exists');
if (!fs.existsSync(path.join(projectRoot, readinessDocPath))) {
  console.error('Google Play launch readiness status check failed');
  console.error('- readiness_doc_exists');
  process.exit(1);
}

const readinessDoc = read(readinessDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);
const packageJsonSource = read(packageJsonPath);

const requiredDocSnippets = [
  'Google Play Launch Readiness Status',
  'Purpose: Document current Google Play launch readiness status',
  'PR type: docs/check-only',
  'App name: 하루풀이',
  'Platform target: Android via Capacitor',
  'Current build type used for QA: Android debug APK',
  'Current production release status: Not started',
  'Current Google Play Console status: Pending',
  'Android launcher icon integration',
  'Completed',
  'Clipboard fallback share path',
  'Share text sensitive-field paste QA',
  'Release build',
  'Not started',
  'Signing setup',
  'AAB generation',
  'Google Play Console actual input',
  'Pending',
  '개인정보 처리방침 URL',
  '문의처 이메일/지원 연락처 확정',
  'Google Play 데이터 보안 양식',
  '실제 스토어 스크린샷 이미지 제작',
  '태양시 보정 적용 여부',
  '음력/윤달 샘플 외부 검증',
  'No src changes',
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
  'No Google Play upload',
  'No Google Play 데이터 보안 양식 completion',
  'No 실제 스토어 스크린샷 이미지 제작 completion',
  'No production fortune logic changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  'Recommended next launch-prep sequence',
];
for (const snippet of requiredDocSnippets) {
  mark(readinessDoc.includes(snippet), `readiness_doc_includes_${snippet}`);
}

const sourcesToScanForForbidden = [{ label: 'doc', source: readinessDoc }];

const forbiddenSnippets = [
  'Release build | Completed',
  'Signing setup | Completed',
  'AAB generation | Completed',
  'Google Play Console actual input | Completed',
  'Google Play upload | Completed',
  '개인정보 처리방침 URL | Completed',
  'Google Play 데이터 보안 양식 | Completed',
  '실제 스토어 스크린샷 이미지 제작 | Completed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'release build 완료',
  'signing 설정 완료',
  'AAB 생성 완료',
  'Google Play Console 입력 완료',
  'Google Play 업로드 완료',
];
for (const { label, source } of sourcesToScanForForbidden) {
  for (const snippet of forbiddenSnippets) {
    mark(!source.includes(snippet), `${label}_forbidden_absent_${snippet}`);
  }
}

const requiredTodoCompletedSnippets = [
  '- [x] Google Play 출시 준비 상태 문서화',
  '- [x] Google Play launch readiness status 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] 개인정보 처리방침 URL 확정',
  '- [ ] 문의처 이메일/지원 연락처 확정',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
  '- [ ] Google Play Console 실제 입력',
  '- [ ] 태양시 보정 적용 여부',
  '- [ ] 음력/윤달 샘플 외부 검증',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(developmentLogSource.includes('## Google Play Launch Readiness Status'), 'development_log_has_section');
mark(
  changelogSource.includes('Documented current Google Play launch readiness status.'),
  'changelog_records_readiness_doc',
);

mark(
  packageJsonSource.includes(
    '"check:google-play-launch-readiness-status": "node scripts/checkGooglePlayLaunchReadinessStatus.mjs"',
  ),
  'package_json_has_check_script',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Google Play launch readiness status check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Google Play launch readiness status check passed');
