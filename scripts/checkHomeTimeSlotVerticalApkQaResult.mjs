import fs from 'node:fs';
import { execSync } from 'node:child_process';

const resultDocPath = 'docs/HOME_TIME_SLOT_VERTICAL_APK_QA_RESULT.md';
const changelogPath = 'CHANGELOG.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const todoPath = 'TODO.md';
const packagePath = 'package.json';
const checkScriptPath = 'scripts/checkHomeTimeSlotVerticalApkQaResult.mjs';

const read = (path) => fs.readFileSync(path, 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(resultDocPath), 'result_doc_exists');
if (!fs.existsSync(resultDocPath)) {
  console.error('Home time-slot vertical APK QA result check failed');
  console.error('- result_doc_exists');
  process.exit(1);
}

const resultDoc = read(resultDocPath);
const changelogSource = read(changelogPath);
const developmentLogSource = read(developmentLogPath);
const todoSource = read(todoPath);
const packageSource = read(packagePath);

const requiredResultDocSnippets = [
  'Related PR: #310',
  'Home time-slot vertical layout QA: Completed',
  '아침운세 card visibility: Completed',
  '점심운세 card visibility: Completed',
  '저녁운세 card visibility: Completed',
  'Vertical stacking confirmation: Completed',
  'Additional issue found: None reported',
  'Saved reading share implementation: Pending',
  'App icon asset creation: Pending',
  'Android icon resource integration: Pending',
];
for (const snippet of requiredResultDocSnippets) {
  mark(resultDoc.includes(snippet), `result_doc_includes_${snippet}`);
}

mark(
  changelogSource.includes('- Recorded APK QA result for home time-slot vertical layout'),
  'changelog_records_apk_qa_result',
);

mark(
  developmentLogSource.includes('## Home Time-slot Vertical APK QA Result'),
  'development_log_has_section',
);

mark(
  todoSource.includes('- [x] Record APK QA result for home time-slot vertical layout'),
  'todo_marked_complete',
);

const pendingTodoSnippets = [
  '- [ ] Create app icon asset',
  '- [ ] Apply app icon to Android resources after asset finalization',
  '- [ ] Add saved reading share feature',
  '- [ ] Review KakaoTalk/SMS sharing path',
];
for (const snippet of pendingTodoSnippets) {
  mark(todoSource.includes(snippet), `todo_kept_pending_${snippet}`);
}

mark(
  packageSource.includes(
    '"check:home-time-slot-vertical-apk-qa-result": "node scripts/checkHomeTimeSlotVerticalApkQaResult.mjs"',
  ),
  'package_script_registered',
);

const changedFiles = [
  ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
].filter(Boolean);

const allowedFiles = new Set([
  changelogPath,
  developmentLogPath,
  todoPath,
  resultDocPath,
  packagePath,
  checkScriptPath,
]);

mark(changedFiles.every((file) => allowedFiles.has(file)), 'changed_files_limited_to_expected_scope');

const protectedPaths = ['src/', 'docs/generated/', 'android/', 'public/privacy-policy.html', 'package-lock.json'];
mark(
  !changedFiles.some((file) => protectedPaths.some((protectedPath) => file === protectedPath || file.startsWith(protectedPath))),
  'protected_paths_unchanged',
);

const protectedDiff = execSync(
  'git diff HEAD -- src docs/generated android public/privacy-policy.html package-lock.json',
  { encoding: 'utf8' },
);
mark(protectedDiff.trim() === '', 'protected_diff_empty');

const artifactExtensions = ['.png', '.webp', '.svg', '.ico', '.aab', '.zip', '.jks', '.keystore'];
mark(
  !changedFiles.some((file) => artifactExtensions.some((extension) => file.endsWith(extension))),
  'no_icon_or_release_artifacts_added',
);

const forbiddenPackagePatterns = [/kakao/i, /capacitor\/?share/i, /"@capacitor-community\/share"/i];
mark(
  !forbiddenPackagePatterns.some((pattern) => pattern.test(packageSource)),
  'no_kakao_or_capacitor_share_dependency_added',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Home time-slot vertical APK QA result check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Home time-slot vertical APK QA result check passed');
