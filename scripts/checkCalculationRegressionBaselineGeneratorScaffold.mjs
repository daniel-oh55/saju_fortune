import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';

const generatorPath = 'scripts/generateCalculationRegressionBaselineSnapshot.mjs';
const checkScriptPath = 'scripts/checkCalculationRegressionBaselineGeneratorScaffold.mjs';
const designDocPath = 'docs/CALCULATION_REGRESSION_BASELINE_SNAPSHOT_DESIGN.md';
const packagePath = 'package.json';
const changelogPath = 'CHANGELOG.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const todoPath = 'TODO.md';

const read = (path) => fs.readFileSync(path, 'utf8');

const generatorSource = read(generatorPath);
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
  designDocPath,
  packagePath,
  generatorPath,
  checkScriptPath,
]);

const protectedPaths = ['src/', 'docs/generated/', 'android/', 'public/privacy-policy.html', 'package-lock.json'];

const artifactExtensions = ['.aab', '.zip', '.jks', '.keystore'];

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

mark(fs.existsSync(generatorPath), 'generator_scaffold_exists');

const forbiddenGeneratorPatterns = [
  { pattern: /from\s+['"]\.\.?\/?src\//, label: 'no_src_import' },
  { pattern: /require\(\s*['"].*\/src\//, label: 'no_src_require' },
  { pattern: /\bfetch\(/, label: 'no_fetch_call' },
  { pattern: /\bhttps?\.request\(/, label: 'no_http_request_call' },
  { pattern: /docs\/generated/, label: 'no_docs_generated_reference' },
  { pattern: /writeFileSync\(/, label: 'no_write_file_sync_call' },
  { pattern: /\bwriteFile\(/, label: 'no_write_file_call' },
  { pattern: /profileRegionMetaStorage/, label: 'no_profile_region_meta_storage_reference' },
  { pattern: /zodiacFortuneEngine/, label: 'no_zodiac_fortune_engine_reference' },
];
for (const { pattern, label } of forbiddenGeneratorPatterns) {
  mark(!pattern.test(generatorSource), label);
}

const requiredGeneratorSnippets = [
  "'not_started'",
  "'candidate-only'",
  "'not_recorded'",
  "'unchanged'",
  "'pending'",
  'LUNAR-001',
  'LEAP-001',
  'BOUNDARY-001',
  'BOUNDARY-002',
  'LATE-NIGHT-001',
  'SOLAR-TIME-001',
  'REGRESSION-001',
];
for (const snippet of requiredGeneratorSnippets) {
  mark(generatorSource.includes(snippet), `generator_contains_${snippet}`);
}

const beforeFiles = new Set(
  execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean),
);

let stdout = '';
let defaultRunFailed = false;
try {
  stdout = execFileSync('node', [generatorPath], { encoding: 'utf8' });
} catch (error) {
  defaultRunFailed = true;
  console.error('Failed to run generator scaffold in default mode');
  console.error(error.message);
}
mark(!defaultRunFailed, 'generator_default_run_succeeds');

const afterFiles = new Set(
  execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/).filter(Boolean),
);
const newFilesFromDefaultRun = [...afterFiles].filter((file) => !beforeFiles.has(file));
mark(newFilesFromDefaultRun.length === 0, 'generator_default_run_creates_no_files');

let parsedOutput = null;
if (!defaultRunFailed) {
  try {
    parsedOutput = JSON.parse(stdout);
  } catch (error) {
    console.error('Generator default output is not valid JSON');
  }
}
mark(parsedOutput !== null, 'generator_output_is_valid_json');

if (parsedOutput) {
  const allowedStatusValues = new Set(['not_started', 'pending', 'not_recorded', 'unchanged', 'candidate-only', 'Pending']);
  mark(parsedOutput.status === 'not_started', 'output_status_not_started');
  mark(parsedOutput.snapshotVersion === 'candidate-only', 'output_snapshot_version_candidate_only');
  mark(parsedOutput.schemaVersion === 'unchanged', 'output_schema_version_unchanged');
  mark(parsedOutput.generatedAt === 'not_recorded', 'output_generated_at_not_recorded');
  mark(Array.isArray(parsedOutput.samples) && parsedOutput.samples.length > 0, 'output_has_samples');

  const requiredSampleIds = [
    'LUNAR-001',
    'LEAP-001',
    'BOUNDARY-001',
    'BOUNDARY-002',
    'LATE-NIGHT-001',
    'SOLAR-TIME-001',
    'REGRESSION-001',
  ];
  const sampleIds = (parsedOutput.samples ?? []).map((sample) => sample.sampleId);
  for (const sampleId of requiredSampleIds) {
    mark(sampleIds.includes(sampleId), `output_contains_sample_${sampleId}`);
  }

  mark(
    (parsedOutput.samples ?? []).every((sample) => allowedStatusValues.has(sample.status)),
    'output_sample_statuses_are_candidate_only_values',
  );
  mark(
    (parsedOutput.samples ?? []).every(
      (sample) =>
        sample.input === 'not_recorded' &&
        sample.currentOutput === 'not_recorded' &&
        sample.comparisonResult === 'not_recorded',
    ),
    'output_samples_free_of_recorded_values',
  );

  const serializedOutput = JSON.stringify(parsedOutput);
  mark(!/\d{4}-\d{2}-\d{2}/.test(serializedOutput), 'output_free_of_real_dates');
  mark(!/https?:\/\//i.test(serializedOutput), 'output_free_of_real_urls');
}

const forbiddenPhrases = ['서양식 보정 적용 여부', '양력/음력 샘플 추가 검증'];
for (const phrase of forbiddenPhrases) {
  mark(!generatorSource.includes(phrase), `generator_excludes_forbidden_phrase_${phrase}`);
}

mark(
  packageSource.includes(
    '"generate:calculation-regression-baseline-snapshot": "node scripts/generateCalculationRegressionBaselineSnapshot.mjs"',
  ),
  'package_generate_script_registered',
);
mark(
  packageSource.includes(
    '"check:calculation-regression-baseline-generator-scaffold": "node scripts/checkCalculationRegressionBaselineGeneratorScaffold.mjs"',
  ),
  'package_check_script_registered',
);

const requiredChangelogSnippet =
  '- Added calculation regression baseline generator scaffold and kept snapshot generation Not started';
mark(changelogSource.includes(requiredChangelogSnippet), 'changelog_records_scaffold');

const requiredDevelopmentLogSnippets = [
  '## Calculation Regression Baseline Generator Scaffold',
  'Added calculation regression baseline generator scaffold',
  'Kept baseline snapshot generation as Not started',
  'Generator does not import src/ or production calculation logic',
  'Generator does not call external API',
  'Generator does not write files by default',
  'No production fortune logic changes',
  'No generated JSON changes',
  'No docs/generated changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'Existing localStorage keys unchanged',
  'No external API added',
  'Android/Gradle unchanged',
];
for (const snippet of requiredDevelopmentLogSnippets) {
  mark(developmentLogSource.includes(snippet), `development_log_contains_${snippet}`);
}

const requiredTodoSnippets = [
  '## Calculation regression baseline generator TODO',
  '- [x] Add calculation regression baseline generator scaffold',
  '- [ ] Implement snapshot file writing',
  '- [ ] Generate calculation regression baseline snapshot',
];
for (const snippet of requiredTodoSnippets) {
  mark(todoSource.includes(snippet), `todo_contains_${snippet}`);
}

mark(changedFiles.every((file) => allowedChangedFiles.has(file)), 'changed_files_limited_to_scaffold_scope');
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
  console.error('Calculation regression baseline generator scaffold check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Calculation regression baseline generator scaffold check passed');
