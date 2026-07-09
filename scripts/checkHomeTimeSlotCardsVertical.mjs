import { execSync } from 'node:child_process';
import fs from 'node:fs';

const stylesPath = 'src/styles.css';
const homePagePath = 'src/pages/HomePage.jsx';
const packagePath = 'package.json';
const changelogPath = 'CHANGELOG.md';
const developmentLogPath = 'DEVELOPMENT_LOG.md';
const todoPath = 'TODO.md';
const checkScriptPath = 'scripts/checkHomeTimeSlotCardsVertical.mjs';

const read = (path) => fs.readFileSync(path, 'utf8');

const stylesSource = read(stylesPath);
const homePageSource = read(homePagePath);
const packageSource = read(packagePath);
const changelogSource = read(changelogPath);
const developmentLogSource = read(developmentLogPath);
const todoSource = read(todoPath);

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const combinedSource = `${stylesSource}\n${homePageSource}`;
const requiredLabels = ['아침운세', '점심운세', '저녁운세'];
for (const label of requiredLabels) {
  mark(combinedSource.includes(label), `time_slot_label_kept_${label}`);
}

const singleColumnPattern = /grid-template-columns:\s*(1fr|repeat\(\s*1\s*,)/;

const extractRuleBlocks = (selector, source) => {
  const blocks = [];
  const escapedSelector = selector.replace('.', '\\.');
  const selectorPattern = new RegExp(`([^{}]*${escapedSelector}\\b[^{}]*)\\{`, 'g');
  let match;
  while ((match = selectorPattern.exec(source)) !== null) {
    const bodyStart = match.index + match[0].length;
    const bodyEnd = source.indexOf('}', bodyStart);
    if (bodyEnd === -1) continue;
    blocks.push({ selectorText: match[1], body: source.slice(bodyStart, bodyEnd) });
  }
  return blocks;
};

const homeTimeSlotGridBlocks = extractRuleBlocks('.home-time-slot-grid', stylesSource);
mark(homeTimeSlotGridBlocks.length > 0, 'home_time_slot_grid_selector_exists');

const baseBlocks = homeTimeSlotGridBlocks.filter((block) => !/@media/.test(block.selectorText));
mark(
  baseBlocks.some((block) => singleColumnPattern.test(block.body)),
  'home_time_slot_grid_is_single_column',
);

const mediaBlockRanges = [];
const mediaPattern = /@media[^{]*\{/g;
let mediaMatch;
while ((mediaMatch = mediaPattern.exec(stylesSource)) !== null) {
  let depth = 1;
  let index = mediaMatch.index + mediaMatch[0].length;
  while (depth > 0 && index < stylesSource.length) {
    if (stylesSource[index] === '{') depth += 1;
    if (stylesSource[index] === '}') depth -= 1;
    index += 1;
  }
  mediaBlockRanges.push(stylesSource.slice(mediaMatch.index, index));
}

const twoColumnPattern = /grid-template-columns:\s*repeat\(\s*2\s*,/;
const mediaOverridesToTwoColumns = mediaBlockRanges.some((block) => {
  if (!block.includes('.home-time-slot-grid')) return false;
  const gridBlocks = extractRuleBlocks('.home-time-slot-grid', block);
  return gridBlocks.some((gridBlock) => twoColumnPattern.test(gridBlock.body));
});
mark(!mediaOverridesToTwoColumns, 'home_time_slot_grid_not_overridden_to_two_columns_in_media_query');

mark(fs.existsSync(homePagePath), 'home_page_file_exists');
mark(
  packageSource.includes('"check:home-time-slot-cards-vertical": "node scripts/checkHomeTimeSlotCardsVertical.mjs"'),
  'package_script_registered',
);
mark(
  changelogSource.includes('- Adjusted home time-slot fortune cards to vertical layout'),
  'changelog_records_vertical_layout',
);

const requiredDevelopmentLogSnippets = [
  '## Home Time-slot Cards Vertical Layout',
  'Adjusted home morning, lunch, and evening fortune cards to vertical layout',
  'Kept change as home UI/CSS-only update',
  'Kept 아침운세, 점심운세, 저녁운세 all visible together',
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
  'No loading screen logic changes',
  'No sharing feature implementation',
];
for (const snippet of requiredDevelopmentLogSnippets) {
  mark(developmentLogSource.includes(snippet), `development_log_contains_${snippet}`);
}

mark(
  todoSource.includes('- [x] Adjust home morning/lunch/evening fortune cards to vertical layout'),
  'todo_vertical_layout_marked_complete',
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
  '- [x] Add short app loading screen',
];
for (const snippet of completedTodoSnippets) {
  mark(todoSource.includes(snippet), `todo_kept_complete_${snippet}`);
}

const changedFiles = [
  ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
].filter(Boolean);

const allowedFiles = new Set([
  changelogPath,
  developmentLogPath,
  todoPath,
  packagePath,
  checkScriptPath,
  stylesPath,
  homePagePath,
]);

mark(changedFiles.every((file) => allowedFiles.has(file)), 'changed_files_limited_to_expected_scope');
mark(changedFiles.includes(stylesPath), 'styles_css_changed');

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
  console.error('Home time-slot cards vertical layout check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Home time-slot cards vertical layout check passed');
