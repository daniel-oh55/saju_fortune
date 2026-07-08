import { execSync } from 'node:child_process';
import fs from 'node:fs';

const docPath = 'docs/PRE_RELEASE_UX_IMPROVEMENT_BACKLOG.md';
const packagePath = 'package.json';
const changelogPath = 'CHANGELOG.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const todoPath = 'TODO.md';

const read = (path) => fs.readFileSync(path, 'utf8');

const docSource = read(docPath);
const packageSource = read(packagePath);
const changelogSource = read(changelogPath);
const developmentLogSource = read(developmentLogPath);
const todoSource = read(todoPath);

const changedFiles = [
  ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
].filter(Boolean);

const allowedChangedFiles = new Set([
  changelogPath,
  developmentLogPath,
  todoPath,
  docPath,
  packagePath,
  'scripts/checkPreReleaseUxImprovementBacklog.mjs',
]);

const protectedPaths = ['src/', 'docs/generated/', 'android/', 'public/privacy-policy.html', 'package-lock.json'];

const artifactExtensions = ['.aab', '.zip', '.jks', '.keystore', '.png', '.webp', '.svg', '.ico'];

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const requiredDocSnippets = [
  '# Pre-release UX Improvement Backlog',
  'Current status: Pending',
  'Pre-release UX backlog: Documented',
  'Production UI implementation: Not started',
  'Android native/resource changes: Not started',
  'App icon asset creation: Pending',
  'App icon Android resource integration: Pending',
  'Loading screen implementation: Pending',
  'Saved reading share feature: Pending',
  'Home fortune time-slot display update: Pending',
  'Profile CTA copy update: Pending',
  'No src changes in this PR',
  'No Android/Gradle changes in this PR',
  'No icon asset files added in this PR',
  'No sharing SDK added in this PR',
  '## Improvement Backlog',
  '| ID | Area | Improvement item | Status | Implementation note |',
  'UX-001',
  'UX-002',
  'UX-003',
  'UX-004',
  'UX-005',
  'UX-006',
  'UX-007',
  '아침운세',
  '점심운세',
  '저녁운세',
  '하루풀이 시작하기',
  '저장하고 하루풀이 시작하기',
  '## Recommended PR Split',
  '## Do Not Implement In This PR',
  'Do not change home production UI',
  'Do not add loading screen implementation',
  'Do not add app icon files',
  'Do not modify Android resources',
  'Do not add saved reading share implementation',
  'Do not add Kakao SDK',
  'Do not add Capacitor Share dependency',
  'Do not change ProfileForm or profile CTA copy in code',
  'Do not change src',
  'Do not change Android/Gradle',
  'Do not change package-lock.json',
  'Do not change schemaVersion',
  'Do not change localStorage keys',
];

mark(
  docSource.includes('KakaoTalk or SMS') || docSource.includes('KakaoTalk/SMS'),
  'doc_contains_kakaotalk_or_sms_phrase',
);

for (const snippet of requiredDocSnippets) {
  mark(docSource.includes(snippet), `doc_contains_${snippet}`);
}

const requiredTodoSnippets = [
  '## Pre-release UX improvement TODO',
  '- [x] Document pre-release UX improvement backlog',
  '- [ ] Show morning, lunch, and evening fortune cards on the home screen',
  '- [ ] Add short app loading screen',
  '- [ ] Create app icon asset',
  '- [ ] Apply app icon to Android resources after asset finalization',
  '- [ ] Add saved reading share feature',
  '- [ ] Review KakaoTalk/SMS sharing path',
  "- [ ] Change 내정보 CTA copy to '저장하고 하루풀이 시작하기'",
];

const requiredDevelopmentLogSnippets = [
  '## Pre-release UX Improvement Backlog',
  'Documented pre-release UX improvement backlog',
  'Kept all UX improvement items as Pending',
  'Added home morning/lunch/evening fortune display as Pending',
  'Added short app loading screen as Pending',
  'Added app icon asset creation as Pending',
  'Added Android icon resource integration as Pending',
  'Added saved reading share feature as Pending',
  'Added KakaoTalk/SMS sharing review as Pending',
  'Added 내정보 CTA copy update as Pending',
  'No src changes',
  'No Android/Gradle changes',
  'No icon assets added',
  'No sharing SDK added',
  'No package-lock changes',
];

for (const snippet of requiredTodoSnippets) {
  mark(todoSource.includes(snippet), `todo_contains_${snippet}`);
}

for (const snippet of requiredDevelopmentLogSnippets) {
  mark(developmentLogSource.includes(snippet), `development_log_contains_${snippet}`);
}

mark(fs.existsSync(docPath), 'pre_release_ux_improvement_backlog_doc_exists');
mark(
  packageSource.includes(
    '"check:pre-release-ux-improvement-backlog": "node scripts/checkPreReleaseUxImprovementBacklog.mjs"',
  ),
  'package_script_registered',
);
mark(
  changelogSource.includes('- Documented pre-release UX improvement backlog and kept implementation Pending'),
  'changelog_records_backlog',
);

const tableStart = docSource.indexOf('| ID | Area | Improvement item | Status | Implementation note |');
mark(tableStart !== -1, 'improvement_backlog_table_present');

if (tableStart !== -1) {
  const tableSectionEnd = docSource.indexOf('\n## ', tableStart);
  const tableSection = tableSectionEnd === -1 ? docSource.slice(tableStart) : docSource.slice(tableStart, tableSectionEnd);
  const tableLines = tableSection
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith('|'))
    .filter((line) => !/^\|\s*-+\s*\|/.test(line));
  const dataRows = tableLines.slice(1);

  mark(dataRows.length > 0, 'improvement_backlog_table_has_rows');
  mark(
    dataRows.every((row) => row.includes('Pending') || row.includes('Not started')),
    'improvement_backlog_all_rows_pending_or_not_started',
  );
  mark(
    !dataRows.some((row) => row.includes('Completed')),
    'improvement_backlog_no_completed_rows',
  );

  const requiredIds = ['UX-001', 'UX-002', 'UX-003', 'UX-004', 'UX-005', 'UX-006', 'UX-007'];
  for (const id of requiredIds) {
    mark(dataRows.some((row) => row.includes(id)), `improvement_backlog_row_present_${id}`);
  }

  const forbiddenRecordedValueTokens = ['Completed', 'Done', 'Pass', 'Confirmed', '완료', '완료됨'];
  mark(
    !dataRows.some((row) => forbiddenRecordedValueTokens.some((token) => row.includes(token))),
    'improvement_backlog_rows_free_of_completion_language',
  );
}

mark(changedFiles.every((file) => allowedChangedFiles.has(file)), 'changed_files_limited_to_backlog_scope');
mark(
  !changedFiles.some((file) => protectedPaths.some((path) => file === path || file.startsWith(path))),
  'protected_paths_unchanged',
);
mark(
  !changedFiles.some((file) => artifactExtensions.some((extension) => file.endsWith(extension))),
  'no_icon_or_release_artifacts_added',
);

const forbiddenPackagePatterns = [/kakao/i, /capacitor\/?share/i, /"@capacitor-community\/share"/i];
mark(
  !forbiddenPackagePatterns.some((pattern) => pattern.test(packageSource)),
  'no_kakao_or_capacitor_share_dependency_added',
);

const protectedDiff = execSync(
  'git diff HEAD -- src docs/generated android public/privacy-policy.html package-lock.json',
  { encoding: 'utf8' },
);
mark(protectedDiff.trim() === '', 'protected_diff_empty');
mark(
  !/schemaVersion|CURRENT_FORTUNE_SCHEMA_VERSION|localStorage\.setItem|localStorage\.getItem|localStorage\.removeItem/.test(
    protectedDiff,
  ),
  'schema_and_local_storage_code_unchanged',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Pre-release UX improvement backlog check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Pre-release UX improvement backlog check passed');
