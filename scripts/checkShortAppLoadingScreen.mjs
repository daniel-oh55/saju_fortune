import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const packagePath = 'package.json';
const changelogPath = 'CHANGELOG.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const todoPath = 'TODO.md';
const checkScriptPath = 'scripts/checkShortAppLoadingScreen.mjs';

const read = (path) => fs.readFileSync(path, 'utf8');

const packageSource = read(packagePath);
const changelogSource = read(changelogPath);
const developmentLogSource = read(developmentLogPath);
const todoSource = read(todoPath);

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const collectSrcFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(collectSrcFiles(fullPath));
    } else if (/\.(jsx?|tsx?)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
};

const srcFiles = collectSrcFiles('src');
const srcContents = srcFiles.map((file) => ({ file, content: read(file) })).map(({ file, content }) => ({
  file: file.split(path.sep).join('/'),
  content,
}));
const combinedSrcSource = srcContents.map(({ content }) => content).join('\n');

mark(combinedSrcSource.includes('오늘의 흐름을 준비하고 있어요'), 'src_contains_loading_subtext');
mark(combinedSrcSource.includes('하루풀이'), 'src_contains_loading_title_or_brand_text');
mark(
  srcContents.some(({ file }) => /loadingscreen/i.test(file)) ||
    /AppLoadingScreen|LoadingScreen/.test(combinedSrcSource),
  'loading_screen_component_or_reference_exists',
);
mark(
  /APP_LOADING_DURATION_MS\s*=\s*\d+|setTimeout\([^)]*,\s*\d{2,4}\)/.test(combinedSrcSource),
  'loading_duration_constant_or_short_timer_exists',
);
mark(
  /clearTimeout\(/.test(combinedSrcSource),
  'timer_cleanup_exists',
);
mark(
  /role=["']status["']|aria-live=["']polite["']/.test(combinedSrcSource),
  'loading_screen_uses_status_or_aria_live',
);

mark(
  packageSource.includes('"check:short-app-loading-screen": "node scripts/checkShortAppLoadingScreen.mjs"'),
  'package_script_registered',
);
mark(
  changelogSource.includes('- Added short React app loading screen'),
  'changelog_records_loading_screen',
);

const requiredDevelopmentLogSnippets = [
  '## Short App Loading Screen',
  'Added short React app loading screen',
  'Marked UX-002 as completed in pre-release UX improvement TODO',
  'Kept change as React UI-only update',
  'Did not change Android native splash screen',
  'Did not change Android resources',
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
  'No sharing feature implementation',
];
for (const snippet of requiredDevelopmentLogSnippets) {
  mark(developmentLogSource.includes(snippet), `development_log_contains_${snippet}`);
}

mark(
  todoSource.includes('- [x] Add short app loading screen'),
  'todo_ux_002_marked_complete',
);

const pendingTodoSnippets = [
  '- [ ] Create app icon asset',
  '- [ ] Apply app icon to Android resources after asset finalization',
  '- [ ] Add saved reading share feature',
  '- [ ] Review KakaoTalk/SMS sharing path',
];
for (const snippet of pendingTodoSnippets) {
  mark(todoSource.includes(snippet), `todo_kept_pending_${snippet}`);
}

const completedTodoSnippets = [
  '- [x] Show morning, lunch, and evening fortune cards on the home screen',
  "- [x] Change 내정보 CTA copy to '저장하고 하루풀이 시작하기'",
];
for (const snippet of completedTodoSnippets) {
  mark(todoSource.includes(snippet), `todo_kept_complete_${snippet}`);
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
mark(!/localStorage\.(setItem|getItem|removeItem)/.test(srcDiffChangedLines), 'diff_free_of_local_storage_key_changes');

const productionCalculationPathPatterns = [
  /^src\/domain\/fortune\//,
  /zodiacFortuneEngine/,
  /yearFortuneEngine/,
  /profileRegionMetaStorage/,
  /fortuneEngine\.js/,
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
  console.error('Short app loading screen check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Short app loading screen check passed');
