import { execSync } from 'node:child_process';
import fs from 'node:fs';

const docPath = 'docs/OVERSEAS_REGION_ZODIAC_QA_RESULT.md';
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
  'scripts/checkOverseasRegionZodiacQaResult.mjs',
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
  'src/styles.css',
  'src/domain/fortune/zodiacFortuneEngine.js',
];

const artifactExtensions = ['.aab', '.zip', '.jks', '.keystore'];

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const requiredDocSnippets = [
  '# Overseas Region And Zodiac QA Result',
  'Android Debug Build #224',
  'harupuli-debug-apk',
  '#294',
  '#295',
  'feat/overseas-birth-region-input',
  'refactor/compress-zodiac-explanation-cards',
  'Samsung Galaxy S23 Ultra',
  'One UI 8.0',
  'Android Debug APK',
  'user-confirmed real device test',
  'targeted QA for overseas birth region input and zodiac explanation card compression',
  '| Area | Item | Status | Result |',
  '| Overseas birth region | Overseas option in region list | Completed | 문제 없음 |',
  '| Overseas birth region | Domestic 17 province/metropolitan-city list preserved | Completed | 문제 없음 |',
  '| Overseas birth region | Existing Seoul district selection preserved | Completed | 문제 없음 |',
  '| Overseas birth region | Direct input shown for overseas selection | Completed | 문제 없음 |',
  '| Overseas birth region | Placeholder shown | Completed | 문제 없음 |',
  '| Overseas birth region | Empty overseas input validation | Completed | 문제 없음 |',
  '| Overseas birth region | Save overseas city/region | Completed | 문제 없음 |',
  '| Overseas birth region | Persist overseas region after app restart | Completed | 문제 없음 |',
  '| Overseas birth region | Switch from overseas back to domestic region | Completed | 문제 없음 |',
  '| Overseas birth region | Save domestic region after switching back | Completed | 문제 없음 |',
  '| Zodiac explanation | Explanation cards compressed to two cards | Completed | 문제 없음 |',
  '| Zodiac explanation | Cards remain below zodiac grid | Completed | 문제 없음 |',
  '| Zodiac explanation | Cards remain above year list | Completed | 문제 없음 |',
  '| Zodiac explanation | 1~2월 절기 기준 안내 | Completed | 문제 없음 |',
  '| Zodiac explanation | Year-list reference guidance | Completed | 문제 없음 |',
  '| Common | In-app top-left back button | Completed | 문제 없음 |',
  '| Common | Home screen Android back exit | Completed | 문제 없음 |',
  '| Common | Additional issues | Completed | 없음 |',
];

const requiredPendingRows = [
  '| Full Android smoke QA | Pending |',
  '| 태양시 보정 적용 여부 | Pending |',
  '| 음력/윤달 샘플 외부 검증 | Pending |',
  '| Google Play Console input | Pending |',
  '| Release build | Pending |',
  '| signing setup | Pending |',
  '| AAB generation | Pending |',
  '| Store screenshots | Pending |',
  '| Privacy policy URL final confirmation | Pending |',
];

const requiredDevelopmentLogSnippets = [
  '## Overseas Region And Zodiac QA Result',
  'Android Debug Build #224 was tested on Samsung Galaxy S23 Ultra / One UI 8.0',
  'Overseas birth region option was confirmed on device',
  'Overseas city/region direct input was confirmed on device',
  'Empty overseas input validation was confirmed on device',
  'Overseas region save behavior was confirmed on device',
  'Overseas region persistence after app restart was confirmed on device',
  'Overseas-to-domestic region switching was confirmed on device',
  'Zodiac explanation cards were confirmed as compressed to two cards',
  'Zodiac explanation cards remained below the zodiac grid and above the year list',
  '1~2월 절기 기준 안내 was confirmed on device',
  'Year-list reference guidance was confirmed on device',
  'No additional issue was reported in this targeted QA',
  'Full Android smoke QA remains Pending unless separately confirmed',
  '태양시 보정 적용 여부 remains Pending',
  '음력/윤달 샘플 외부 검증 remains Pending',
  'Production fortune logic unchanged',
  'Zodiac fortune engine unchanged',
  'src unchanged',
  'ProfileForm.jsx unchanged',
  'profileRegionMetaStorage.js unchanged',
  'ZodiacFortunePage.jsx unchanged',
  'Generated JSON unchanged',
  'docs/generated unchanged',
  'schemaVersion unchanged',
  'CURRENT_FORTUNE_SCHEMA_VERSION unchanged',
  'Existing localStorage keys unchanged',
  'Android/Gradle unchanged',
  'Release build/signing/AAB remain Pending',
];

const requiredTodoSnippets = [
  '- [x] Re-test overseas birth region input on Android device',
  '- [x] Confirm overseas birth region save on Android device',
  '- [x] Confirm overseas birth region persistence after app restart',
  '- [x] Confirm overseas-to-domestic region switching on Android device',
  '- [x] Re-test zodiac explanation card layout on Android device',
];

const forbiddenSnippets = [
  '태양시 보정 적용 여무',
  '양력/음력 샘플 추가 검증',
  'Full Android smoke QA | Completed',
  'Release build | Completed',
  'AAB generation | Completed',
  'Google Play Console input | Completed',
  'signing setup | Completed',
];

const developmentLogSectionStart = developmentLogSource.indexOf('## Overseas Region And Zodiac QA Result');
const developmentLogSectionEnd = developmentLogSource.indexOf('\n## ', developmentLogSectionStart + 1);
const developmentLogSection = developmentLogSource.slice(
  developmentLogSectionStart,
  developmentLogSectionEnd === -1 ? undefined : developmentLogSectionEnd,
);

mark(fs.existsSync(docPath), 'qa_result_doc_exists');
mark(
  packageSource.includes('"check:overseas-region-zodiac-qa-result": "node scripts/checkOverseasRegionZodiacQaResult.mjs"'),
  'package_script_registered',
);
mark(
  changelogSource.includes('- Recorded Android Debug Build #224 overseas region and zodiac explanation QA result'),
  'changelog_records_qa_result',
);

for (const snippet of requiredDocSnippets) {
  mark(docSource.includes(snippet), `doc_contains_${snippet}`);
}

for (const row of requiredPendingRows) {
  mark(docSource.includes(row), `doc_keeps_pending_${row}`);
}

for (const snippet of requiredDevelopmentLogSnippets) {
  mark(developmentLogSource.includes(snippet), `development_log_contains_${snippet}`);
}

for (const snippet of requiredTodoSnippets) {
  mark(todoSource.includes(snippet), `todo_contains_${snippet}`);
}

for (const snippet of forbiddenSnippets) {
  mark(!docSource.includes(snippet), `doc_excludes_${snippet}`);
  mark(!developmentLogSection.includes(snippet), `development_log_new_section_excludes_${snippet}`);
}

mark(changedFiles.every((file) => allowedChangedFiles.has(file)), 'changed_files_limited_to_qa_doc_check_scope');
mark(!changedFiles.some((file) => protectedPaths.some((path) => file === path || file.startsWith(path))), 'protected_paths_unchanged');
mark(!changedFiles.some((file) => artifactExtensions.some((extension) => file.endsWith(extension))), 'release_or_secret_artifacts_not_added');

const protectedDiff = execSync('git diff HEAD -- src docs/generated android public/privacy-policy.html package-lock.json', {
  encoding: 'utf8',
});
mark(protectedDiff.trim() === '', 'protected_diff_empty');

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Overseas region and zodiac QA result check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Overseas region and zodiac QA result check passed');
