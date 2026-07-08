import { execSync } from 'node:child_process';
import fs from 'node:fs';

const docPath = 'docs/LUNAR_LEAP_SAMPLE_CASE_PLAN.md';
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
  'scripts/checkLunarLeapSampleCasePlan.mjs',
]);

const protectedPaths = ['src/', 'docs/generated/', 'android/', 'public/privacy-policy.html', 'package-lock.json'];

const artifactExtensions = ['.aab', '.zip', '.jks', '.keystore'];

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const requiredDocSnippets = [
  '# Lunar Leap Sample Case Plan',
  'Current status: Pending',
  'Sample case planning: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  'Reference source selection: Pending',
  'Actual external verification: Pending',
  'Sample dates: Not recorded',
  'Sample expected values: Not recorded',
  'Sample comparison result: Not recorded',
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
  'Define sample categories needed before 음력/윤달 샘플 외부 검증',
  'Prevent recording sample dates or expected values before source finalization',
  'Keep production calculation unchanged before external verification',
  'Prepare a safe follow-up path for actual sample result recording',
  'Keep 태양시 보정 적용 여부 separate and Pending',
  '## Sample Case Plan',
  '| Sample ID | Category | Purpose | Status | Notes |',
  'LUNAR-001',
  'LEAP-001',
  'BOUNDARY-001',
  'BOUNDARY-002',
  'LATE-NIGHT-001',
  'SOLAR-TIME-001',
  'REGRESSION-001',
  'ANDROID-QA-001',
  '## Do Not Record Yet',
  'Do not record actual sample dates',
  'Do not record actual external verification result',
  'Do not record sample expected values',
  'Do not record sample comparison result',
  'Do not finalize external reference source',
  'Do not change production calculation logic',
  'Do not change fortune result generation',
  'Do not change generated JSON',
  'Do not change schemaVersion',
  'Do not change existing localStorage keys',
  'Do not add external API',
  'Do not add timezone conversion',
  'Do not add solar time correction calculation',
  '## Follow-up PRs',
  'Future PR: finalize external reference source for 음력/윤달 샘플 외부 검증',
  'Future PR: record LUNAR-001 verification result',
  'Future PR: record LEAP-001 verification result',
  'Future PR: record BOUNDARY-001 and BOUNDARY-002 verification result',
  'Future PR: decide whether LATE-NIGHT-001 requires separate policy',
  'Future PR: prepare calculation regression baseline before any implementation',
  'Future PR: Android QA after any future calculation logic change',
];

const forbiddenDocSnippets = ['서양식 보정 적용 여부', '양력/음력 샘플 추가 검증'];

const requiredTodoSnippets = [
  '## Lunar leap sample case plan TODO',
  '- [x] Document lunar/leap sample case plan',
  '- [ ] Finalize external reference source for 음력/윤달 샘플 외부 검증',
  '- [ ] Select actual LUNAR-001 sample date',
  '- [ ] Select actual LEAP-001 sample date',
  '- [ ] Select actual BOUNDARY-001 sample date',
  '- [ ] Select actual BOUNDARY-002 sample date',
  '- [ ] Record external verification result',
  '- [ ] Prepare calculation regression baseline before any implementation',
];

const requiredDevelopmentLogSnippets = [
  '## Lunar Leap Sample Case Plan',
  'Documented lunar/leap sample case plan',
  'Kept sample case planning as Pending',
  'Kept 음력/윤달 샘플 외부 검증 as Pending',
  'Kept reference source selection as Pending',
  'Kept actual external verification as Pending',
  'Did not record sample dates',
  'Did not record sample expected values',
  'Did not record sample comparison result',
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

mark(fs.existsSync(docPath), 'lunar_leap_sample_case_plan_doc_exists');
mark(
  packageSource.includes(
    '"check:lunar-leap-sample-case-plan": "node scripts/checkLunarLeapSampleCasePlan.mjs"',
  ),
  'package_script_registered',
);
mark(
  changelogSource.includes('- Added lunar leap sample case plan and kept sample values Pending'),
  'changelog_records_plan',
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

const tableStart = docSource.indexOf('| Sample ID | Category | Purpose | Status | Notes |');
mark(tableStart !== -1, 'sample_case_table_present');

if (tableStart !== -1) {
  const tableSectionEnd = docSource.indexOf('\n## ', tableStart);
  const tableSection = tableSectionEnd === -1 ? docSource.slice(tableStart) : docSource.slice(tableStart, tableSectionEnd);
  const tableLines = tableSection
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith('|'))
    .filter((line) => !/^\|\s*-+\s*\|/.test(line));
  const dataRows = tableLines.slice(1);

  mark(dataRows.length > 0, 'sample_case_table_has_rows');
  mark(
    dataRows.every((row) => row.includes('Pending')),
    'sample_case_all_rows_pending',
  );
  mark(
    !dataRows.some((row) => row.includes('Completed')),
    'sample_case_no_completed_rows',
  );

  const requiredSampleIds = [
    'LUNAR-001',
    'LEAP-001',
    'BOUNDARY-001',
    'BOUNDARY-002',
    'LATE-NIGHT-001',
    'SOLAR-TIME-001',
    'REGRESSION-001',
    'ANDROID-QA-001',
  ];
  for (const sampleId of requiredSampleIds) {
    mark(dataRows.some((row) => row.includes(sampleId)), `sample_case_row_present_${sampleId}`);
  }

  const forbiddenRecordedValueTokens = [
    'Completed',
    'Confirmed',
    'Finalized',
    'Match',
    'Mismatch',
    '일치',
    '불일치',
    '확인됨',
    '완료됨',
    '확정',
  ];
  mark(
    !dataRows.some((row) => forbiddenRecordedValueTokens.some((token) => row.includes(token))),
    'sample_case_rows_free_of_recorded_result_language',
  );
  mark(
    !dataRows.some((row) => /\d{4}-\d{2}-\d{2}/.test(row) || /https?:\/\//i.test(row)),
    'sample_case_rows_free_of_recorded_dates_or_urls',
  );
}

mark(!/Completed/.test(docSource.slice(tableStart === -1 ? 0 : tableStart)), 'no_completed_in_sample_case_section');

const forbiddenRecordedDocPatterns = [
  /https?:\/\//i,
  /\d{4}-\d{2}-\d{2}/,
  /Selected source:\s*\S/i,
  /Finalized source:\s*\S/i,
  /Expected value:\s*(?!Not recorded)\S/i,
  /Comparison result:\s*(?!Not recorded)\S/i,
];
mark(
  !forbiddenRecordedDocPatterns.some((pattern) => pattern.test(docSource)),
  'doc_free_of_recorded_dates_urls_or_result_values',
);

mark(changedFiles.every((file) => allowedChangedFiles.has(file)), 'changed_files_limited_to_plan_scope');
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
  console.error('Lunar leap sample case plan check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Lunar leap sample case plan check passed');
