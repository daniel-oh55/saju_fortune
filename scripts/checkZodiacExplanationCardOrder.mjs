import fs from 'node:fs';
import { execSync } from 'node:child_process';

const pagePath = 'src/pages/ZodiacFortunePage.jsx';
const pageSource = fs.readFileSync(pagePath, 'utf8');
const packageSource = fs.readFileSync('package.json', 'utf8');
const unstagedDiff = execSync('git diff -- .', { encoding: 'utf8' });
const stagedDiff = execSync('git diff --cached -- .', { encoding: 'utf8' });
const diffOutput = `${unstagedDiff}\n${stagedDiff}`;
const guardedDiffOutput = [
  execSync(`git diff -- ${pagePath} package.json`, { encoding: 'utf8' }),
  execSync(`git diff --cached -- ${pagePath} package.json`, { encoding: 'utf8' }),
].join('\n');
const changedFiles = [
  ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
].filter(Boolean);

const allowedChangedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  'package.json',
  'package-lock.json',
  'scripts/checkAppWideBackNavigation.mjs',
  'scripts/checkBrandCopyConsistency.mjs',
  'scripts/checkFiveElementsGuidanceDeduplication.mjs',
  'scripts/checkNativeAndroidBackButton.mjs',
  'scripts/checkTodayFortuneBackNavigation.mjs',
  'scripts/checkZodiacExplanationCardOrder.mjs',
  'scripts/checkZodiacYearVariationOutputReview.mjs',
  'src/App.jsx',
  'src/styles.css',
  pagePath,
]);

const requiredNoticeSnippets = [
  '띠는 입력한 생년월일을 바탕으로 계산된 사주 연주의 지지를 우선해 표시합니다.',
  '아래 연도별 띠 목록은 일반적인 출생연도 기준 참고 목록입니다.',
  '입력하신 생년월일은 일반 출생연도 기준으로는',
  '프로필의 출생연도가 지원 범위 밖이면 기본 띠가 먼저 표시됩니다.',
];

const forbiddenChangedPathSnippets = [
  'src/domain/fortune/zodiacFortuneEngine.js',
  'docs/generated/',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res/',
  'build.gradle',
  'public/privacy-policy.html',
  '.aab',
  '.jks',
  '.keystore',
];

const forbiddenCodeDiffSnippets = [
  'CURRENT_FORTUNE_SCHEMA_VERSION',
  'schemaVersion',
  'localStorage',
  'createZodiacFortune(',
  'getYearsByAnimal(',
  'getZodiacByYear(',
  'getZodiacByYearPillar(',
];

let hasFailure = false;

function logResult(name, passed, detail = '') {
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${name}${detail ? ` - ${detail}` : ''}`);
  if (!passed) hasFailure = true;
}

const animalGridIndex = pageSource.indexOf('className="zodiac-animal-grid"');
const firstNoticeIndex = pageSource.indexOf('className="zodiac-notice-card"');
const yearListIndex = pageSource.indexOf('className="zodiac-year-list"');

logResult('zodiac_page_exists', fs.existsSync(pagePath), pagePath);
logResult('animal_grid_exists', animalGridIndex !== -1);
logResult('notice_cards_exist', firstNoticeIndex !== -1);
logResult('year_list_exists', yearListIndex !== -1);
logResult(
  'animal_grid_renders_before_notice_cards',
  animalGridIndex !== -1 && firstNoticeIndex !== -1 && animalGridIndex < firstNoticeIndex,
);
logResult(
  'notice_cards_remain_before_year_list',
  firstNoticeIndex !== -1 && yearListIndex !== -1 && firstNoticeIndex < yearListIndex,
);

for (const snippet of requiredNoticeSnippets) {
  logResult(`notice_copy_preserved_${snippet}`, pageSource.includes(snippet));
}

for (const file of new Set(changedFiles)) {
  logResult(`allowed_changed_file_${file}`, allowedChangedFiles.has(file));
}

for (const snippet of forbiddenChangedPathSnippets) {
  logResult(
    `changed_files_exclude_${snippet}`,
    changedFiles.every((file) => !file.includes(snippet)),
  );
}

for (const snippet of forbiddenCodeDiffSnippets) {
  logResult(`diff_excludes_${snippet}`, !guardedDiffOutput.includes(snippet));
}

logResult(
  'package_script_registered',
  packageSource.includes('"check:zodiac-explanation-card-order": "node scripts/checkZodiacExplanationCardOrder.mjs"'),
);

if (hasFailure) {
  console.error('Zodiac explanation card order check failed.');
  process.exit(1);
}

console.log('Zodiac explanation card order check passed.');
