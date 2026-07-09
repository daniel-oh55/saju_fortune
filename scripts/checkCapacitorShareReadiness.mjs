import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const readinessDocPath = 'docs/CAPACITOR_SHARE_READINESS.md';
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
  console.error('Capacitor Share readiness check failed');
  console.error('- readiness_doc_exists');
  process.exit(1);
}

const readinessDoc = read(readinessDocPath);
const todoSource = read(todoPath);
const developmentLogSource = read(developmentLogPath);
const changelogSource = read(changelogPath);
const packageJson = JSON.parse(read(packageJsonPath));

const requiredDocSnippets = [
  'Capacitor Share Readiness',
  'Related implementation PR: #319',
  'Layout fix PR: #322',
  'Share fallback QA PR: #323',
  'QA consistency PR: #324',
  'Share text paste QA PR: #325',
  'PR type: docs/check-only',
  'Android share sheet not opened',
  'Clipboard fallback completed',
  '`@capacitor/share` status: Not started',
  'Option A. Keep current Web Share API + clipboard fallback',
  'Option B. Add `@capacitor/share`',
  'Option C. Direct KakaoTalk/SMS integration',
  'Current implementation',
  'Candidate',
  'Deferred',
  'Recommended direction',
  'No src changes',
  'No CSS changes',
  'No share logic changes',
  'No copy logic changes',
  'No `@capacitor/share` dependency',
  'No `@capacitor/share` import',
  'No Capacitor Share implementation',
  'No AndroidManifest.xml changes',
  'No Android native code changes',
  'No Android resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No Kakao SDK integration',
  'No SMS permission/native integration',
  'No production fortune logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  '`@capacitor/share` implementation',
  'Pending',
  'Native Android share sheet actual verification',
  'Actual external share send',
  'Not performed',
  'Release build',
  'Not started',
  'Signing setup',
  'AAB generation',
  'Google Play Console actual input',
];
for (const snippet of requiredDocSnippets) {
  mark(readinessDoc.includes(snippet), `readiness_doc_includes_${snippet}`);
}

const forbiddenDocSnippets = [
  'AndroidManifest.xml 공유 변경 완료',
  'android.permission.SEND_SMS',
  'Kakao SDK integration | Completed',
  'SMS permission/native integration | Completed',
  '`@capacitor/share` implementation | Completed',
  'Native Android share sheet actual verification | Completed',
  'Actual external share send | Completed',
  'Release build | Completed',
  'Signing setup | Completed',
  'AAB generation | Completed',
  'Google Play Console actual input | Completed',
];
for (const snippet of forbiddenDocSnippets) {
  mark(!readinessDoc.includes(snippet), `readiness_doc_forbidden_absent_${snippet}`);
}

const allDependencies = {
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {}),
};
mark(!Object.keys(allDependencies).includes('@capacitor/share'), 'package_json_no_capacitor_share_dependency');

const srcRoot = path.join(projectRoot, 'src');
const forbiddenSrcSnippets = ["@capacitor/share", 'CapacitorShare', "Share from '@capacitor/share'"];
const srcFilesWithForbiddenSnippets = [];

function collectFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(entryPath));
    } else {
      files.push(entryPath);
    }
  }
  return files;
}

if (fs.existsSync(srcRoot)) {
  for (const filePath of collectFiles(srcRoot)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (forbiddenSrcSnippets.some((snippet) => content.includes(snippet))) {
      srcFilesWithForbiddenSnippets.push(path.relative(projectRoot, filePath));
    }
  }
}
mark(srcFilesWithForbiddenSnippets.length === 0, 'src_no_capacitor_share_dependency_or_import');

const requiredTodoCompletedSnippets = [
  '- [x] @capacitor/share 도입 여부 검토 문서화',
  '- [x] Capacitor Share readiness 검증 스크립트 추가',
];
for (const snippet of requiredTodoCompletedSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_completed_${snippet}`);
}

const requiredTodoPendingSnippets = [
  '- [ ] @capacitor/share 구현 검토',
  '- [ ] Native Android share sheet 실제 확인',
  '- [ ] 실제 외부 공유 발송 확인',
  '- [ ] Kakao SDK 연동 검토',
  '- [ ] SMS permission/native integration 검토',
  '- [ ] AndroidManifest.xml 공유 관련 변경 필요 여부 검토',
  '- [ ] 공유 이미지 생성 기능 검토',
  '- [ ] release build 준비',
  '- [ ] signing 설정 준비',
  '- [ ] AAB 생성',
  '- [ ] Google Play Console 실제 입력',
];
for (const snippet of requiredTodoPendingSnippets) {
  mark(todoSource.includes(snippet), `todo_includes_pending_${snippet}`);
}

mark(developmentLogSource.includes('## Capacitor Share Readiness'), 'development_log_has_section');
mark(
  changelogSource.includes('Documented Capacitor Share readiness after Android WebView share fallback QA.'),
  'changelog_records_readiness_doc',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Capacitor Share readiness check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Capacitor Share readiness check passed');
