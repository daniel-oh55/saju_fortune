import { execSync } from 'node:child_process';
import fs from 'node:fs';

const docPath = 'docs/LUNAR_LEAP_VERIFICATION_RESULT_TEMPLATE.md';
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
  'scripts/checkLunarLeapVerificationResultTemplate.mjs',
]);

const protectedPaths = ['src/', 'docs/generated/', 'android/', 'public/privacy-policy.html', 'package-lock.json'];

const artifactExtensions = ['.aab', '.zip', '.jks', '.keystore'];

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const requiredDocSnippets = [
  '# Lunar Leap Verification Result Template',
  'Current status: Pending',
  'Result template: Prepared',
  '음력/윤달 샘플 외부 검증: Pending',
  'Reference source selection: Pending',
  'Actual external verification: Pending',
  'Source name: Not recorded',
  'Source version: Not recorded',
  'Source access date: Not recorded',
  'Sample dates: Not recorded',
  'Sample expected values: Not recorded',
  'Sample actual values: Not recorded',
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
  'Define a safe recording template for future 음력/윤달 샘플 외부 검증 results',
  'Prevent mixing actual verification values into planning PRs',
  'Keep production calculation unchanged before external verification',
  'Preserve the sample IDs defined in docs/LUNAR_LEAP_SAMPLE_CASE_PLAN.md',
  'Keep 태양시 보정 적용 여부 separate and Pending',
  '## Source Record Template',
  '| Field | Status | Value |',
  '## Sample Result Template',
  '| Sample ID | Category | Source expected value | App current value | Comparison result | Status | Notes |',
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
  'Do not record source name, URL, version, or access date',
  'Do not record actual external verification result',
  'Do not record sample expected values',
  'Do not record app current values',
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
  'Future PR: record source name/version/access date',
  'Future PR: record LUNAR-001 verification result',
  'Future PR: record LEAP-001 verification result',
  'Future PR: record BOUNDARY-001 and BOUNDARY-002 verification result',
  'Future PR: decide whether LATE-NIGHT-001 requires separate policy',
  'Future PR: prepare calculation regression baseline before any implementation',
  'Future PR: Android QA after any future calculation logic change',
];

const forbiddenDocSnippets = ['서양식 보정 적용 여부', '양력/음력 샘플 추가 검증'];

const requiredTodoSnippets = [
  '## Lunar leap verification result template TODO',
  '- [x] Document lunar/leap verification result template',
  '- [ ] Finalize external reference source for 음력/윤달 샘플 외부 검증',
  '- [ ] Record source name/version/access date',
  '- [ ] Record LUNAR-001 verification result',
  '- [ ] Record LEAP-001 verification result',
  '- [ ] Record BOUNDARY-001 verification result',
  '- [ ] Record BOUNDARY-002 verification result',
  '- [ ] Prepare calculation regression baseline before any implementation',
];

const requiredDevelopmentLogSnippets = [
  '## Lunar Leap Verification Result Template',
  'Documented lunar/leap verification result template',
  'Kept 음력/윤달 샘플 외부 검증 as Pending',
  'Kept reference source selection as Pending',
  'Kept actual external verification as Pending',
  'Did not record source name, version, or access date',
  'Did not record sample dates',
  'Did not record sample expected values',
  'Did not record app current values',
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

mark(fs.existsSync(docPath), 'lunar_leap_verification_result_template_doc_exists');
mark(
  packageSource.includes(
    '"check:lunar-leap-verification-result-template": "node scripts/checkLunarLeapVerificationResultTemplate.mjs"',
  ),
  'package_script_registered',
);
mark(
  changelogSource.includes(
    '- Added lunar leap verification result template and kept sample values Pending',
  ),
  'changelog_records_template',
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

const extractDataRows = (headerLine) => {
  const tableStart = docSource.indexOf(headerLine);
  if (tableStart === -1) {
    return { tableStart, dataRows: [] };
  }
  const tableSectionEnd = docSource.indexOf('\n## ', tableStart);
  const tableSection =
    tableSectionEnd === -1 ? docSource.slice(tableStart) : docSource.slice(tableStart, tableSectionEnd);
  const tableLines = tableSection
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith('|'))
    .filter((line) => !/^\|\s*-+\s*\|/.test(line));
  return { tableStart, dataRows: tableLines.slice(1) };
};

const sourceTable = extractDataRows('| Field | Status | Value |');
mark(sourceTable.tableStart !== -1, 'source_record_table_present');
mark(sourceTable.dataRows.length > 0, 'source_record_table_has_rows');
mark(
  sourceTable.dataRows.every((row) => row.includes('Pending')),
  'source_record_all_rows_pending',
);

const sampleTable = extractDataRows(
  '| Sample ID | Category | Source expected value | App current value | Comparison result | Status | Notes |',
);
mark(sampleTable.tableStart !== -1, 'sample_result_table_present');
mark(sampleTable.dataRows.length > 0, 'sample_result_table_has_rows');
mark(
  sampleTable.dataRows.every((row) => row.includes('Pending')),
  'sample_result_all_rows_pending',
);
mark(
  !sampleTable.dataRows.some((row) => row.includes('Completed')),
  'sample_result_no_completed_rows',
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
  mark(sampleTable.dataRows.some((row) => row.includes(sampleId)), `sample_result_row_present_${sampleId}`);
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
  ![...sourceTable.dataRows, ...sampleTable.dataRows].some((row) =>
    forbiddenRecordedValueTokens.some((token) => row.includes(token)),
  ),
  'template_rows_free_of_recorded_result_language',
);
mark(
  ![...sourceTable.dataRows, ...sampleTable.dataRows].some(
    (row) => /\d{4}-\d{2}-\d{2}/.test(row) || /https?:\/\//i.test(row),
  ),
  'template_rows_free_of_recorded_dates_or_urls',
);

const forbiddenRecordedDocPatterns = [
  /https?:\/\//i,
  /\d{4}-\d{2}-\d{2}/,
  /Selected source:\s*\S/i,
  /Finalized source:\s*\S/i,
  /Source name finalized:\s*\S/i,
  /Expected value:\s*(?!Not recorded)\S/i,
  /App current value:\s*(?!Not recorded)\S/i,
  /Comparison result:\s*(?!Not recorded)\S/i,
];
mark(
  !forbiddenRecordedDocPatterns.some((pattern) => pattern.test(docSource)),
  'doc_free_of_recorded_dates_urls_or_result_values',
);

mark(changedFiles.every((file) => allowedChangedFiles.has(file)), 'changed_files_limited_to_template_scope');
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
  console.error('Lunar leap verification result template check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Lunar leap verification result template check passed');
