import { execSync } from 'node:child_process';
import fs from 'node:fs';

const homePagePath = 'src/pages/HomePage.jsx';
const packagePath = 'package.json';
const changelogPath = 'CHANGELOG.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const todoPath = 'TODO.md';
const checkScriptPath = 'scripts/checkHomeTimeSlotFortuneCards.mjs';

const read = (path) => fs.readFileSync(path, 'utf8');

const homePageSource = read(homePagePath);
const packageSource = read(packagePath);
const changelogSource = read(changelogPath);
const developmentLogSource = read(developmentLogPath);
const todoSource = read(todoPath);

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const requiredLabels = ['아침운세', '점심운세', '저녁운세'];
for (const label of requiredLabels) {
  mark(homePageSource.includes(label), `home_page_contains_${label}`);
}

mark(fs.existsSync(homePagePath), 'home_page_file_exists');
mark(
  packageSource.includes('"check:home-time-slot-fortune-cards": "node scripts/checkHomeTimeSlotFortuneCards.mjs"'),
  'package_script_registered',
);
mark(
  changelogSource.includes('- Added morning, lunch, and evening fortune cards to the home screen'),
  'changelog_records_home_time_slot_cards',
);

const requiredDevelopmentLogSnippets = [
  '## Home Time-slot Fortune Cards',
  'Added home display for morning, lunch, and evening fortune cards',
  'Marked UX-001 as completed in pre-release UX improvement TODO',
  'Kept change as home UI-only update',
  'No production fortune logic changes',
  'No fortune result generation changes',
  'No routing changes',
  'No localStorage key changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No generated JSON changes',
  'No docs/generated changes',
  'No Android/Gradle changes',
  'No icon asset changes',
  'No loading screen implementation',
  'No sharing feature implementation',
];
for (const snippet of requiredDevelopmentLogSnippets) {
  mark(developmentLogSource.includes(snippet), `development_log_contains_${snippet}`);
}

mark(
  todoSource.includes('- [x] Show morning, lunch, and evening fortune cards on the home screen'),
  'todo_ux_001_marked_complete',
);

const pendingTodoSnippets = [
  '- [ ] Add short app loading screen',
  '- [ ] Create app icon asset',
  '- [ ] Apply app icon to Android resources after asset finalization',
  '- [ ] Add saved reading share feature',
  '- [ ] Review KakaoTalk/SMS sharing path',
];
for (const snippet of pendingTodoSnippets) {
  mark(todoSource.includes(snippet), `todo_kept_pending_${snippet}`);
}

const changedFiles = [
  ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
].filter(Boolean);

const allowedNonSrcFiles = new Set([changelogPath, developmentLogPath, todoPath, packagePath, checkScriptPath]);
const changedSrcFiles = changedFiles.filter((file) => file.startsWith('src/'));
const changedNonSrcFiles = changedFiles.filter((file) => !file.startsWith('src/'));

mark(changedNonSrcFiles.every((file) => allowedNonSrcFiles.has(file)), 'changed_files_limited_to_expected_scope');
mark(changedSrcFiles.length > 0, 'at_least_one_src_file_changed');

const allowedSrcFiles = new Set([homePagePath, 'src/styles.css']);
mark(changedSrcFiles.every((file) => allowedSrcFiles.has(file)), 'src_changes_limited_to_home_screen_and_styles');

const protectedPaths = ['docs/generated/', 'android/', 'public/privacy-policy.html', 'package-lock.json'];
mark(
  !changedFiles.some((file) => protectedPaths.some((protectedPath) => file === protectedPath || file.startsWith(protectedPath))),
  'protected_paths_unchanged',
);

const artifactExtensions = ['.aab', '.zip', '.jks', '.keystore', '.png', '.webp', '.svg', '.ico'];
mark(
  !changedFiles.some((file) => artifactExtensions.some((extension) => file.endsWith(extension))),
  'no_icon_or_release_artifacts_added',
);

mark(
  !changedFiles.some((file) => file !== packagePath && file.endsWith('.json')),
  'no_generated_json_changes',
);

const forbiddenPackagePatterns = [/kakao/i, /capacitor\/?share/i, /"@capacitor-community\/share"/i];
mark(
  !forbiddenPackagePatterns.some((pattern) => pattern.test(packageSource)),
  'no_kakao_or_capacitor_share_dependency_added',
);

const protectedDiff = execSync(
  'git diff HEAD -- docs/generated android public/privacy-policy.html package-lock.json',
  { encoding: 'utf8' },
);
mark(protectedDiff.trim() === '', 'protected_diff_empty');

const srcDiff = execSync('git diff HEAD -- src', { encoding: 'utf8' });
const srcDiffChangedLines = srcDiff
  .split(/\r?\n/)
  .filter((line) => (line.startsWith('+') && !line.startsWith('+++')) || (line.startsWith('-') && !line.startsWith('---')))
  .join('\n');
mark(!/schemaVersion|CURRENT_FORTUNE_SCHEMA_VERSION/.test(srcDiffChangedLines), 'diff_free_of_schema_version_changes');
mark(!/localStorage\.(setItem|getItem|removeItem)/.test(srcDiffChangedLines), 'diff_free_of_local_storage_code_changes');

const productionCalculationPathPatterns = [
  /^src\/domain\/fortune\//,
  /zodiacFortuneEngine/,
  /yearFortuneEngine/,
  /profileRegionMetaStorage/,
];
mark(
  !changedFiles.some((file) => productionCalculationPathPatterns.some((pattern) => pattern.test(file))),
  'no_production_calculation_file_changes',
);

mark(
  !changedFiles.some((file) => file.startsWith('android/') || file === 'AndroidManifest.xml'),
  'no_android_gradle_changes',
);

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Home time-slot fortune cards check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Home time-slot fortune cards check passed');
