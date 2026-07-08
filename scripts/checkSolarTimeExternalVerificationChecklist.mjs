import { execSync } from 'node:child_process';
import fs from 'node:fs';

const docPath = 'docs/SOLAR_TIME_EXTERNAL_VERIFICATION_CHECKLIST.md';
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
  'scripts/checkSolarTimeExternalVerificationChecklist.mjs',
]);

const protectedPaths = [
  'src/',
  'docs/generated/',
  'android/',
  'public/privacy-policy.html',
  'package-lock.json',
  'src/components/ProfileForm.jsx',
  'src/utils/profileRegionMetaStorage.js',
  'src/pages/ZodiacFortunePage.jsx',
  'src/domain/fortune/zodiacFortuneEngine.js',
];

const artifactExtensions = ['.aab', '.zip', '.jks', '.keystore'];

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const requiredDocSnippets = [
  '# Solar Time External Verification Checklist',
  'Current status: Pending',
  '태양시 보정 적용 여부 external review: Pending',
  'Actual external verification: Pending',
  'Current production calculation: unchanged',
  'Solar time correction implementation: Not implemented',
  'Birth region values remain profile/input UX data only',
  'No timezone conversion',
  'No longitude/latitude handling',
  'No geocoding API',
  'No external API',
  'No region-to-longitude dataset',
  'No generated JSON changes',
  '## Purpose',
  'Determine whether 태양시 보정 적용 여부 should remain disabled for MVP',
  'Identify what external references are needed before any calculation logic change',
  'Prevent accidental production calculation changes before verification',
  'Preserve backward compatibility with existing saved profiles',
  'Prepare a safe path for future Option B/C review from PR #297',
  '## Verification Checklist',
  '| Area | Check item | Status | Notes |',
  '음력/윤달 샘플 외부 검증',
  '## Do Not Implement Before Verification',
  'Do not add solar time correction calculation',
  'Do not use birth region values in production calculation',
  'Do not add timezone conversion',
  'Do not add longitude/latitude handling',
  'Do not add geocoding API',
  'Do not add external city DB',
  'Do not change schemaVersion',
  'Do not change existing localStorage keys',
  'Do not change generated JSON',
  'Do not change production fortune result generation',
  '## Follow-up PRs',
  'Future PR: record 태양시 보정 적용 여부 external review result',
  'Future PR: document region-to-longitude data source policy',
  'Future PR: record domestic sample validation result',
  'Future PR: record overseas timezone/longitude policy',
  'Future PR: complete 음력/윤달 샘플 외부 검증',
  'Future PR: calculation regression baseline before any implementation',
];

const forbiddenDocSnippets = ['서양식 보정 적용 여부', '양력/음력 샘플 추가 검증'];

const requiredTodoSnippets = [
  '## Solar time external verification TODO',
  '- [x] Add 태양시 보정 적용 여부 external verification checklist',
  '- [ ] Complete 태양시 보정 적용 여부 external review',
  '- [ ] Review region-to-longitude data source',
  '- [ ] Validate domestic sample date/time cases',
  '- [ ] Review overseas timezone/longitude policy',
  '- [ ] Complete 음력/윤달 샘플 외부 검증',
  '- [ ] Prepare calculation regression baseline before implementation',
  '- [ ] Decide 태양시 보정 적용 여부 after external verification',
];

const requiredDevelopmentLogSnippets = [
  '## Solar Time External Verification Checklist',
  'Added 태양시 보정 적용 여부 external verification checklist',
  'Kept all verification items as Pending',
  'Kept solar time correction implementation as Not implemented',
  'Kept current production calculation behavior unchanged',
  'Kept birth region values as profile/input UX data only',
  'Kept 음력/윤달 샘플 외부 검증 as Pending',
  'No region-to-longitude dataset added',
  'No timezone conversion added',
  'No longitude/latitude handling added',
  'No geocoding API added',
  'No external API added',
  'Production fortune logic unchanged',
  'Generated JSON unchanged',
  'docs/generated unchanged',
  'schemaVersion unchanged',
  'CURRENT_FORTUNE_SCHEMA_VERSION unchanged',
  'Existing localStorage keys unchanged',
  'Android/Gradle unchanged',
];

mark(fs.existsSync(docPath), 'solar_time_external_verification_checklist_doc_exists');
mark(
  packageSource.includes(
    '"check:solar-time-external-verification-checklist": "node scripts/checkSolarTimeExternalVerificationChecklist.mjs"',
  ),
  'package_script_registered',
);
mark(
  changelogSource.includes(
    '- Added solar time external verification checklist and kept all verification items Pending',
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

const tableStart = docSource.indexOf('| Area | Check item | Status | Notes |');
mark(tableStart !== -1, 'checklist_table_present');

if (tableStart !== -1) {
  const tableSection = docSource.slice(tableStart);
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

const packageDiff = execSync('git diff HEAD -- package.json', { encoding: 'utf8' });
mark(
  !packageDiff || !/^-/m.test(packageDiff.split('\n').filter((line) => !line.startsWith('---')).join('\n')),
  'package_json_only_additive',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Solar time external verification checklist check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Solar time external verification checklist check passed');
