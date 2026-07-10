import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const resultDocPath = 'docs/STORE_SCREENSHOT_IMAGE_QA_RESULT.md';
const todoPath = 'TODO.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const changelogPath = 'CHANGELOG.md';
const packageJsonPath = 'package.json';

const screenshotImagePaths = [
  'store-assets/screenshots/android/01-home.png',
  'store-assets/screenshots/android/02-today-fortune.png',
  'store-assets/screenshots/android/03-saju-flow.png',
  'store-assets/screenshots/android/04-2026-fortune.png',
  'store-assets/screenshots/android/05-zodiac-fortune.png',
  'store-assets/screenshots/android/06-saved-readings.png',
];

const read = (relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

for (const imagePath of screenshotImagePaths) {
  const absolutePath = path.join(projectRoot, imagePath);
  mark(fs.existsSync(absolutePath), `screenshot_image_exists_${imagePath}`);
  mark(path.extname(imagePath).toLowerCase() === '.png', `screenshot_image_is_png_${imagePath}`);
}

mark(fs.existsSync(path.join(projectRoot, resultDocPath)), 'result_doc_exists');

const failedBeforeDocRead = checks.filter((check) => !check.condition);
if (failedBeforeDocRead.length > 0) {
  console.error('Store screenshot image QA result check failed');
  failedBeforeDocRead.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

const resultDoc = read(resultDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);
const packageJsonSource = read(packageJsonPath);

const requiredDocSnippets = [
  'Store Screenshot Image QA Result',
  'Status: QA result',
  '실제 스토어 스크린샷 이미지 제작: Completed',
  'Screenshot image export: Completed',
  'Store screenshot image QA: Completed',
  'Store screenshot upload: Pending',
  'Google Play Console input: Pending',
  'Store listing final text: Pending',
  'Purpose: Record QA result for produced Google Play store screenshot image files',
  'PR type: docs/check-only QA',
  'App name: 하루풀이',
  'Related Store screenshot image production result PR: #339',
  'Related Store screenshot check consistency PR: #340',
  'Screenshot file QA result',
  'Filename and path QA',
  'Privacy and content safety QA',
  'Remaining upload and launch items',
  'No image file changes',
  'No new screenshot image files',
  'No src changes',
  'No CSS changes',
  'No production UI changes',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No Google Play Console input',
  'No Store screenshot upload',
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
  mark(resultDoc.includes(snippet), `result_doc_includes_${snippet}`);
}

const forbiddenPatterns = [
  /Store screenshot upload \| Completed/,
  /Google Play Console actual input \| Completed/,
  /개인정보 처리방침 URL \| Completed/,
  /문의처 이메일\/지원 연락처 확정 \| Completed/,
  /Google Play 데이터 보안 양식 \| Completed/,
  /Google Play 데이터 보안 양식 최종 입력 \| Completed/,
  /Release build \| Completed/,
  /Signing setup \| Completed/,
  /AAB generation \| Completed/,
  /실제 스토어 스크린샷 이미지 시작/,
  /서양식 보정 적용 여부/,
  /양력\/음력 샘플 추가 검증/,
  /Google Play Console 입력 완료/,
  /release build 완료/,
  /signing 설정 완료/,
  /AAB 생성 완료/,
];
mark(
  !forbiddenPatterns.some((pattern) => pattern.test(resultDoc)),
  'result_doc_no_forbidden_snippets',
);

const requiredTodoCompletedSnippets = [
  '- [x] 스토어 스크린샷 이미지 QA 결과 문서화',
  '- [x] Store screenshot image QA result 검증 스크립트 추가',
  '- [x] 실제 스토어 스크린샷 이미지 제작',
  '- [x] Screenshot image export',
  '- [x] Store screenshot image production result 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] Store screenshot upload',
  '- [ ] Google Play Console 실제 입력',
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
  developmentLogSource.includes('## Store Screenshot Image QA Result'),
  'development_log_has_section',
);
mark(
  changelogSource.includes(
    'Recorded store screenshot image QA result for Google Play launch preparation.',
  ),
  'changelog_records_result_doc',
);

mark(
  packageJsonSource.includes(
    '"check:store-screenshot-image-qa-result": "node scripts/checkStoreScreenshotImageQaResult.mjs"',
  ),
  'package_json_has_check_script',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Store screenshot image QA result check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Store screenshot image QA result check passed');
