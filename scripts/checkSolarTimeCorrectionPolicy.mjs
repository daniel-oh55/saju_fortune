import { execSync } from 'node:child_process';
import fs from 'node:fs';

const docPath = 'docs/SOLAR_TIME_CORRECTION_POLICY.md';
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
  'scripts/checkSolarTimeCorrectionPolicy.mjs',
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
  '# Solar Time Correction Policy',
  'Current status: Pending / Not implemented',
  '태양시 보정 적용 여부: Pending',
  'Current production fortune calculation does not apply solar time correction',
  'Birth region values are currently stored for profile/input UX only',
  'Domestic and overseas birth region values are not used in production calculation yet',
  'No timezone conversion',
  'No longitude/latitude handling',
  'No geocoding API',
  'No overseas city DB',
  'No external API',
  'No schemaVersion change',
  'No localStorage key change',
  '## Decision Criteria',
  'Whether solar time correction improves 사주 calculation accuracy enough to justify complexity',
  'Whether correction should apply only when a precise region is available',
  'Whether correction should apply to overseas birth regions',
  'Whether user consent or explicit explanation is needed',
  'Whether correction should be optional or automatic',
  'Whether old saved profiles should remain backward-compatible',
  'Whether external verification is required before production logic changes',
  '## Candidate Scopes',
  '### Option A',
  'No solar time correction',
  'Keep current calculation behavior',
  'Lowest risk',
  'Best for current MVP',
  '### Option B',
  'Domestic-only solar time correction',
  'Use selected Korean region as a future correction hint',
  'Requires verified region-to-longitude data',
  'Requires sample validation',
  '### Option C',
  'Domestic + overseas solar time correction',
  'Requires timezone, longitude/latitude, city matching, and more user guidance',
  'Highest complexity',
  'Not recommended before external verification',
  'MVP 기준으로는 Option A를 유지합니다.',
  'Option B/C는 후속 검증 전까지 Pending으로 둡니다.',
  '실제 계산 로직 변경은 별도 PR에서만 진행합니다.',
  '## Required Verification Before Implementation',
  '태양시 보정 적용 여부 external review',
  'Region-to-longitude data source review',
  'Domestic sample date/time validation',
  'Overseas timezone/longitude policy review',
  '음력/윤달 샘플 외부 검증',
  'Backward compatibility of saved profiles',
  'Android QA plan after calculation change',
  'Future PR: external verification checklist for 태양시 보정 적용 여부',
  'Future PR: 음력/윤달 샘플 외부 검증',
  'Future PR: region-to-longitude data policy if Option B is selected',
  'Future PR: calculation regression baseline before any production logic change',
  'Future PR: production logic implementation only after verification',
];

const requiredTodoSnippets = [
  '## Solar time correction TODO',
  '- [x] Document 태양시 보정 적용 여부 policy',
  '- [ ] Complete external review for 태양시 보정 적용 여부',
  '- [ ] Complete 음력/윤달 샘플 외부 검증',
  '- [ ] Decide whether solar time correction remains disabled for MVP',
  '- [ ] Prepare calculation regression baseline before any solar time correction implementation',
  '- [ ] Re-test Android after any future calculation logic change',
  '- [ ] Decide 태양시 보정 적용 여부 after external verification',
];

const requiredDevelopmentLogSnippets = [
  '## Solar Time Correction Policy',
  'Documented 태양시 보정 적용 여부 policy',
  'Kept solar time correction as Pending / Not implemented',
  'Kept current production calculation behavior unchanged',
  'Confirmed birth region values remain profile/input UX data only',
  'Kept domestic and overseas region values out of production calculation logic',
  'Kept 음력/윤달 샘플 외부 검증 as Pending',
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

const forbiddenDocSnippets = [
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

mark(fs.existsSync(docPath), 'solar_time_correction_policy_doc_exists');
mark(
  packageSource.includes('"check:solar-time-correction-policy": "node scripts/checkSolarTimeCorrectionPolicy.mjs"'),
  'package_script_registered',
);
mark(
  changelogSource.includes('- Documented solar time correction policy and kept implementation Pending'),
  'changelog_records_policy',
);

for (const snippet of requiredDocSnippets) {
  mark(docSource.includes(snippet), `doc_contains_${snippet}`);
}

for (const snippet of requiredTodoSnippets) {
  mark(todoSource.includes(snippet), `todo_contains_${snippet}`);
}

for (const snippet of requiredDevelopmentLogSnippets) {
  mark(developmentLogSource.includes(snippet), `development_log_contains_${snippet}`);
}

for (const snippet of forbiddenDocSnippets) {
  mark(!docSource.includes(snippet), `doc_excludes_${snippet}`);
}

mark(changedFiles.every((file) => allowedChangedFiles.has(file)), 'changed_files_limited_to_solar_time_policy_scope');
mark(!changedFiles.some((file) => protectedPaths.some((path) => file === path || file.startsWith(path))), 'protected_paths_unchanged');
mark(!changedFiles.some((file) => artifactExtensions.some((extension) => file.endsWith(extension))), 'release_or_secret_artifacts_not_added');

const protectedDiff = execSync('git diff HEAD -- src docs/generated android public/privacy-policy.html package-lock.json package.json', {
  encoding: 'utf8',
});
mark(protectedDiff.trim() === '', 'protected_diff_empty');
mark(!/schemaVersion|CURRENT_FORTUNE_SCHEMA_VERSION|localStorage\.setItem|localStorage\.getItem|localStorage\.removeItem/.test(protectedDiff), 'schema_and_local_storage_code_unchanged');

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Solar time correction policy check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Solar time correction policy check passed');
