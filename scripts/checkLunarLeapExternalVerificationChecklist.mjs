import { execSync } from 'node:child_process';
import fs from 'node:fs';

const docPath = 'docs/LUNAR_LEAP_EXTERNAL_VERIFICATION_CHECKLIST.md';
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
  'scripts/checkLunarLeapExternalVerificationChecklist.mjs',
]);

const protectedPaths = ['src/', 'docs/generated/', 'android/', 'public/privacy-policy.html', 'package-lock.json'];

const artifactExtensions = ['.aab', '.zip', '.jks', '.keystore'];

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const requiredDocSnippets = [
  '# Lunar Leap External Verification Checklist',
  'Current status: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  'Actual external verification: Pending',
  'Lunar/leap sample result recording: Not completed',
  'Current production calculation: unchanged',
  '태양시 보정 적용 여부: Pending',
  'Solar time correction implementation: Not implemented',
  'No production fortune logic changes',
  'No generated JSON changes',
  'No schemaVersion change',
  'No localStorage key change',
  'No external API',
  'No Android QA required in this PR',
  '## Purpose',
  'Define what must be checked before recording 음력/윤달 샘플 외부 검증 result',
  'Prevent accidental production calculation changes before external verification',
  'Prepare a safe follow-up path for sample collection and result recording',
  'Keep current MVP calculation behavior unchanged',
  'Keep 태양시 보정 적용 여부 separate and Pending',
  '## Verification Checklist',
  '| Area | Check item | Status | Notes |',
  '## Do Not Record Yet',
  'Do not record actual external verification result',
  'Do not record sample expected values',
  'Do not change production calculation logic',
  'Do not change fortune result generation',
  'Do not change generated JSON',
  'Do not change schemaVersion',
  'Do not change existing localStorage keys',
  'Do not add external API',
  'Do not add timezone conversion',
  'Do not add solar time correction calculation',
  '## Follow-up PRs',
  'Future PR: select external reference source for 음력/윤달 샘플 외부 검증',
  'Future PR: record lunar sample verification result',
  'Future PR: record leap month sample verification result',
  'Future PR: record boundary sample verification result',
  'Future PR: prepare calculation regression baseline before any implementation',
  'Future PR: Android QA after any future calculation logic change',
];

const forbiddenDocSnippets = ['서양식 보정 적용 여부', '양력/음력 샘플 추가 검증'];

const requiredTodoSnippets = [
  '## Lunar leap external verification TODO',
  '- [x] Add 음력/윤달 샘플 외부 검증 checklist',
  '- [ ] Select external reference source for 음력/윤달 샘플 외부 검증',
  '- [ ] Prepare representative lunar birth sample',
  '- [ ] Prepare representative leap month sample',
  '- [ ] Prepare boundary sample',
  '- [ ] Record external verification result',
  '- [ ] Prepare calculation regression baseline before any implementation',
  '- [ ] Re-test Android after any future calculation logic change',
];

const requiredDevelopmentLogSnippets = [
  '## Lunar Leap External Verification Checklist',
  'Added 음력/윤달 샘플 외부 검증 checklist',
  'Kept all verification items as Pending',
  'Kept actual external verification as Pending',
  'Kept lunar/leap sample result recording as Not completed',
  'Kept current production calculation behavior unchanged',
  'Kept 태양시 보정 적용 여부 as Pending',
  'Kept solar time correction implementation as Not implemented',
  'No production fortune logic changes',
  'No generated JSON changes',
  'No docs/generated changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'Existing localStorage keys unchanged',
  'No external API added',
  'Android/Gradle unchanged',
];

mark(fs.existsSync(docPath), 'lunar_leap_external_verification_checklist_doc_exists');
mark(
  packageSource.includes(
    '"check:lunar-leap-external-verification-checklist": "node scripts/checkLunarLeapExternalVerificationChecklist.mjs"',
  ),
  'package_script_registered',
);
mark(
  changelogSource.includes('- Added lunar leap external verification checklist and kept all verification items Pending'),
  'changelog_records_checklist',
);

for (const snippet of requiredDocSnippets) {
  mark(docSource.includes(snippet), `doc_contains_${snippet}`);
}

for (const snippet of forbiddenDocSnippets) {
  mark(!docSource.includes(snippet), `doc_excludes_${snippet}`);
}

for (const snippet of requiredTodoSnippets) {
  mark(todoSource.includes(snippet), `todo_contains_${snippet}`);
}

for (const snippet of requiredDevelopmentLogSnippets) {
  mark(developmentLogSource.includes(snippet), `development_log_contains_${snippet}`);
}

const tableStart = docSource.indexOf('| Area | Check item | Status | Notes |');
mark(tableStart !== -1, 'checklist_table_present');

if (tableStart !== -1) {
  const tableSectionEnd = docSource.indexOf('\n## ', tableStart);
  const tableSection = tableSectionEnd === -1 ? docSource.slice(tableStart) : docSource.slice(tableStart, tableSectionEnd);
  const tableLines = tableSection
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith('|'))
    .filter((line) => !/^\|\s*-+\s*\|/.test(line));
  const dataRows = tableLines.slice(1);

  mark(dataRows.length > 0, 'checklist_table_has_rows');
  mark(
    dataRows.every((row) => row.includes('Pending')),
    'checklist_all_rows_pending',
  );
  mark(
    !dataRows.some((row) => row.includes('Completed')),
    'checklist_no_completed_rows',
  );

  const forbiddenRecordedValueTokens = ['Completed', 'Confirmed', 'Match', 'Mismatch', '일치', '불일치', '확인됨', '완료됨'];
  mark(
    !dataRows.some((row) => forbiddenRecordedValueTokens.some((token) => row.includes(token))),
    'checklist_rows_free_of_recorded_result_language',
  );
  mark(
    !dataRows.some((row) => /\d{4}-\d{2}-\d{2}/.test(row)),
    'checklist_rows_free_of_recorded_sample_dates',
  );
}

mark(!/Completed/.test(docSource.slice(tableStart === -1 ? 0 : tableStart)), 'no_completed_in_verification_section');

mark(changedFiles.every((file) => allowedChangedFiles.has(file)), 'changed_files_limited_to_checklist_scope');
mark(
  !changedFiles.some((file) => protectedPaths.some((path) => file === path || file.startsWith(path))),
  'protected_paths_unchanged',
);
mark(
  !changedFiles.some((file) => artifactExtensions.some((extension) => file.endsWith(extension))),
  'release_or_secret_artifacts_not_added',
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
  console.error('Lunar leap external verification checklist check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Lunar leap external verification checklist check passed');
