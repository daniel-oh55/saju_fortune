import { execSync } from 'node:child_process';
import fs from 'node:fs';

const docPath = 'docs/CALCULATION_REGRESSION_BASELINE_CHECKLIST.md';
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
  'scripts/checkCalculationRegressionBaselineChecklist.mjs',
]);

const protectedPaths = ['src/', 'docs/generated/', 'android/', 'public/privacy-policy.html', 'package-lock.json'];

const artifactExtensions = ['.aab', '.zip', '.jks', '.keystore'];

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const requiredDocSnippets = [
  '# Calculation Regression Baseline Checklist',
  'Current status: Pending',
  'Calculation regression baseline: Pending',
  'Baseline snapshot generation: Not started',
  'Baseline result recording: Not started',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
  'Current production calculation: unchanged',
  'Solar time correction implementation: Not implemented',
  'No production fortune logic changes',
  'No generated JSON changes',
  'No docs/generated changes',
  'No schemaVersion change',
  'No localStorage key change',
  'No external API',
  'No Android QA required in this PR',
  '## Purpose',
  'Define what must be baselined before any future production calculation change',
  'Prevent accidental calculation changes without before/after comparison',
  'Keep current MVP calculation behavior unchanged',
  'Prepare a safe path for future 음력/윤달 샘플 외부 검증 result recording',
  'Keep 태양시 보정 적용 여부 separate and Pending',
  '## Baseline Checklist',
  '| Area | Baseline item | Status | Notes |',
  'LUNAR-001',
  'LEAP-001',
  'BOUNDARY-001',
  'BOUNDARY-002',
  'LATE-NIGHT-001',
  'SOLAR-TIME-001',
  'REGRESSION-001',
  '## Do Not Record Yet',
  'Do not generate baseline snapshot files',
  'Do not record baseline results',
  'Do not record sample expected values',
  'Do not record app current values',
  'Do not record sample comparison result',
  'Do not finalize external reference source',
  'Do not complete 음력/윤달 샘플 외부 검증',
  'Do not decide 태양시 보정 적용 여부',
  'Do not change production calculation logic',
  'Do not change fortune result generation',
  'Do not change generated JSON',
  'Do not change docs/generated',
  'Do not change schemaVersion',
  'Do not change existing localStorage keys',
  'Do not add external API',
  'Do not add timezone conversion',
  'Do not add solar time correction calculation',
  '## Follow-up PRs',
  'Future PR: finalize external reference source for 음력/윤달 샘플 외부 검증',
  'Future PR: generate calculation regression baseline snapshot',
  'Future PR: record LUNAR-001 baseline result',
  'Future PR: record LEAP-001 baseline result',
  'Future PR: record BOUNDARY-001 and BOUNDARY-002 baseline result',
  'Future PR: compare external verification result with baseline',
  'Future PR: Android QA after any future calculation logic change',
];

const forbiddenDocSnippets = ['서양식 보정 적용 여부', '양력/음력 샘플 추가 검증'];

const requiredTodoSnippets = [
  '## Calculation regression baseline TODO',
  '- [x] Document calculation regression baseline checklist',
  '- [ ] Generate calculation regression baseline snapshot',
  '- [ ] Record LUNAR-001 baseline result',
  '- [ ] Record LEAP-001 baseline result',
  '- [ ] Record BOUNDARY-001 baseline result',
  '- [ ] Record BOUNDARY-002 baseline result',
  '- [ ] Compare external verification result with baseline',
  '- [ ] Re-test Android after any future calculation logic change',
];

const requiredDevelopmentLogSnippets = [
  '## Calculation Regression Baseline Checklist',
  'Documented calculation regression baseline checklist',
  'Kept calculation regression baseline as Pending',
  'Kept baseline snapshot generation as Not started',
  'Kept baseline result recording as Not started',
  'Kept 음력/윤달 샘플 외부 검증 as Pending',
  'Kept 태양시 보정 적용 여부 as Pending',
  'Kept current production calculation behavior unchanged',
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

mark(fs.existsSync(docPath), 'calculation_regression_baseline_checklist_doc_exists');
mark(
  packageSource.includes(
    '"check:calculation-regression-baseline-checklist": "node scripts/checkCalculationRegressionBaselineChecklist.mjs"',
  ),
  'package_script_registered',
);
mark(
  changelogSource.includes(
    '- Added calculation regression baseline checklist and kept baseline generation Pending',
  ),
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

const tableStart = docSource.indexOf('| Area | Baseline item | Status | Notes |');
mark(tableStart !== -1, 'baseline_checklist_table_present');

if (tableStart !== -1) {
  const tableSectionEnd = docSource.indexOf('\n## ', tableStart);
  const tableSection = tableSectionEnd === -1 ? docSource.slice(tableStart) : docSource.slice(tableStart, tableSectionEnd);
  const tableLines = tableSection
    .split(/\r?\n/)
    .filter((line) => line.trim().startsWith('|'))
    .filter((line) => !/^\|\s*-+\s*\|/.test(line));
  const dataRows = tableLines.slice(1);

  mark(dataRows.length > 0, 'baseline_checklist_table_has_rows');
  mark(
    dataRows.every((row) => row.includes('Pending')),
    'baseline_checklist_all_rows_pending',
  );
  mark(
    !dataRows.some((row) => row.includes('Completed')),
    'baseline_checklist_no_completed_rows',
  );

  const requiredSampleIds = [
    'LUNAR-001',
    'LEAP-001',
    'BOUNDARY-001',
    'BOUNDARY-002',
    'LATE-NIGHT-001',
    'SOLAR-TIME-001',
    'REGRESSION-001',
  ];
  for (const sampleId of requiredSampleIds) {
    mark(dataRows.some((row) => row.includes(sampleId)), `baseline_checklist_row_present_${sampleId}`);
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
    'baseline_checklist_rows_free_of_recorded_result_language',
  );
  mark(
    !dataRows.some((row) => /\d{4}-\d{2}-\d{2}/.test(row) || /https?:\/\//i.test(row)),
    'baseline_checklist_rows_free_of_recorded_dates_or_urls',
  );
}

const forbiddenRecordedDocPatterns = [
  /https?:\/\//i,
  /\d{4}-\d{2}-\d{2}/,
  /Snapshot path:\s*\S/i,
  /Baseline result:\s*(?!Not recorded)\S/i,
  /Expected value:\s*(?!Not recorded)\S/i,
  /App current value:\s*(?!Not recorded)\S/i,
  /Comparison result:\s*(?!Not recorded)\S/i,
];
mark(
  !forbiddenRecordedDocPatterns.some((pattern) => pattern.test(docSource)),
  'doc_free_of_recorded_dates_urls_or_result_values',
);

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
  console.error('Calculation regression baseline checklist check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Calculation regression baseline checklist check passed');
