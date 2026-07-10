import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sampleProfileDocPath = 'docs/STORE_SCREENSHOT_SAMPLE_PROFILE.md';
const todoPath = 'TODO.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const changelogPath = 'CHANGELOG.md';

const read = (relativePath) => fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(path.join(projectRoot, sampleProfileDocPath)), 'sample_profile_doc_exists');
if (!fs.existsSync(path.join(projectRoot, sampleProfileDocPath))) {
  console.error('Store screenshot sample profile check failed');
  console.error('- sample_profile_doc_exists');
  process.exit(1);
}

const sampleProfileDoc = read(sampleProfileDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);

const requiredDocSnippets = [
  'Store Screenshot Sample Profile',
  'Status: Sample profile plan',
  '실제 사용자 데이터 사용: 금지',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  'Store screenshot upload: Pending',
  'Google Play Console input: Pending',
  'This document does not include actual screenshot image files.',
  'Purpose: Define synthetic sample profile criteria for Google Play store screenshot production',
  'PR type: docs/check-only',
  'App name: 하루풀이',
  'Related Store screenshot production plan PR: #333',
  'Related Store listing draft PR: #332',
  'Current screenshot image production status: Pending',
  'Current Google Play Console input status: Pending',
  'Current release build status: Not started',
  'Synthetic sample profile',
  '샘플 사용자 A',
  '1990-05-15',
  '07:30',
  '서울특별시 종로구',
  '실제 사용자 데이터가 아닙니다.',
  'Screenshot privacy rules',
  'Planned screenshot usage',
  'Copy safety rules',
  'Validation checklist before actual screenshot production',
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
  mark(sampleProfileDoc.includes(snippet), `sample_profile_doc_includes_${snippet}`);
}

const forbiddenSnippets = [
  '실제 스토어 스크린샷 이미지 제작 | Completed',
  '실제 스토어 스크린샷 이미지 제작 완료',
  '실제 스토어 스크린샷 이미지 시작',
  'Store screenshot upload | Completed',
  'Google Play Console actual input | Completed',
  'Store listing final text | Completed',
  '개인정보 처리방침 URL | Completed',
  '문의처 이메일/지원 연락처 확정 | Completed',
  'Google Play 데이터 보안 양식 | Completed',
  'Google Play 데이터 보안 양식 최종 입력 | Completed',
  'Release build | Completed',
  'Signing setup | Completed',
  'AAB generation | Completed',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'Google Play Console 입력 완료',
  'release build 완료',
  'signing 설정 완료',
  'AAB 생성 완료',
];
mark(
  !forbiddenSnippets.some((snippet) => sampleProfileDoc.includes(snippet)),
  'sample_profile_doc_no_forbidden_snippets',
);

function walkFiles(relativeDir) {
  const absoluteDir = path.join(projectRoot, relativeDir);
  if (!fs.existsSync(absoluteDir)) return [];

  const results = [];
  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true });

  for (const entry of entries) {
    const relativePath = path.join(relativeDir, entry.name);
    const absolutePath = path.join(projectRoot, relativePath);

    if (entry.isDirectory()) {
      results.push(...walkFiles(relativePath));
    } else if (entry.isFile()) {
      results.push(absolutePath);
    }
  }

  return results;
}

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const screenshotNamePattern = /(screenshot|store-screenshot|play-screenshot)/i;
const allowedGeneratedAssetPattern = /(generated-icons|generated-splash)/i;
const screenshotAssetFiles = [...walkFiles('public'), ...walkFiles('docs')].filter((absolutePath) => {
  const normalizedPath = absolutePath.replaceAll('\\', '/');
  const extension = path.extname(normalizedPath).toLowerCase();
  return (
    imageExtensions.has(extension) &&
    screenshotNamePattern.test(path.basename(normalizedPath)) &&
    !allowedGeneratedAssetPattern.test(normalizedPath)
  );
});
mark(screenshotAssetFiles.length === 0, 'no_screenshot_assets_added');

const requiredTodoCompletedSnippets = [
  '- [x] 스토어 스크린샷 샘플 프로필 기준 문서화',
  '- [x] Store screenshot sample profile 검증 스크립트 추가',
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

mark(developmentLogSource.includes('## Store Screenshot Sample Profile'), 'development_log_has_section');
mark(
  changelogSource.includes('Documented store screenshot sample profile for Google Play launch preparation.'),
  'changelog_records_sample_profile_doc',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Store screenshot sample profile check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Store screenshot sample profile check passed');
