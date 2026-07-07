import { execSync } from 'node:child_process';
import fs from 'node:fs';

const pagePath = 'src/pages/ZodiacFortunePage.jsx';
const stylesPath = 'src/styles.css';
const packagePath = 'package.json';

const pageSource = fs.readFileSync(pagePath, 'utf8');
const stylesSource = fs.readFileSync(stylesPath, 'utf8');
const packageSource = fs.readFileSync(packagePath, 'utf8');

const changedFiles = [
  ...execSync('git diff --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git diff --cached --name-only -- .', { encoding: 'utf8' }).split(/\r?\n/),
  ...execSync('git ls-files --others --exclude-standard', { encoding: 'utf8' }).split(/\r?\n/),
].filter(Boolean);

const allowedChangedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  packagePath,
  'scripts/checkAppWideBackNavigation.mjs',
  'scripts/checkBirthRegionExpansionPolicy.mjs',
  'scripts/checkFiveElementsGuidanceDeduplication.mjs',
  'scripts/checkKoreanBirthRegionData.mjs',
  'scripts/checkNativeAndroidBackButton.mjs',
  'scripts/checkOverseasBirthRegionInput.mjs',
  'scripts/checkZodiacExplanationCardCompression.mjs',
  'scripts/checkZodiacExplanationCardOrder.mjs',
  'scripts/checkZodiacYearPillarPolicyAlignment.mjs',
  pagePath,
  stylesPath,
]);

const forbiddenChangedPaths = [
  'src/domain/fortune/zodiacFortuneEngine.js',
  'src/components/ProfileForm.jsx',
  'src/utils/profileRegionMetaStorage.js',
  'docs/generated/',
  'android/',
  'public/privacy-policy.html',
  'package-lock.json',
];

const forbiddenDiffSnippets = [
  'CURRENT_FORTUNE_SCHEMA_VERSION',
  'schemaVersion',
  'localStorage',
  'createZodiacFortune(',
  'getYearsByAnimal(',
  'getZodiacByYear(',
  'getZodiacByYearPillar(',
  'geocoding',
  'timezone',
  'latitude',
  'longitude',
];

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const noticeCardCount = (pageSource.match(/className="zodiac-notice-card"/g) || []).length;
const animalGridIndex = pageSource.indexOf('className="zodiac-animal-grid"');
const firstNoticeIndex = pageSource.indexOf('className="zodiac-notice-card"');
const yearListIndex = pageSource.indexOf('className="zodiac-year-list"');
const guardedDiffOutput = [
  execSync(`git diff -- ${pagePath} ${stylesPath} ${packagePath}`, { encoding: 'utf8' }),
  execSync(`git diff --cached -- ${pagePath} ${stylesPath} ${packagePath}`, { encoding: 'utf8' }),
].join('\n');

mark(fs.existsSync(pagePath), 'zodiac_page_exists');
mark(noticeCardCount === 2, 'zodiac_explanation_notice_card_count_is_2');
mark(animalGridIndex !== -1 && firstNoticeIndex !== -1 && animalGridIndex < firstNoticeIndex, 'notice_cards_remain_below_zodiac_grid');
mark(firstNoticeIndex !== -1 && yearListIndex !== -1 && firstNoticeIndex < yearListIndex, 'notice_cards_remain_above_year_list');
mark(pageSource.includes('앱 기준 띠 안내'), 'app_standard_zodiac_notice_title_present');
mark(pageSource.includes('연도별 목록 안내'), 'year_specific_zodiac_notice_title_present');
mark(pageSource.includes('1~2월 출생자는 절기 기준에 따라'), 'early_year_seasonal_boundary_notice_present');
mark(pageSource.includes('일반적인 출생연도 기준 띠와 다르게 보일 수 있으며'), 'birth_year_reference_difference_notice_present');
mark(pageSource.includes('같은 띠라도 태어난 연도에 따라 해석의 결이 달라질 수 있습니다'), 'same_animal_year_difference_notice_present');
mark(pageSource.includes('연도별 목록은 참고용'), 'year_list_reference_notice_present');
mark(pageSource.includes('입력한 생년월일 정보가 함께 반영됩니다'), 'personal_birth_date_context_notice_present');
mark(stylesSource.includes('.zodiac-notice-card strong'), 'notice_card_title_style_present');
mark(stylesSource.includes('.zodiac-notice-card p'), 'notice_card_paragraph_style_present');
mark(packageSource.includes('"check:zodiac-explanation-card-compression": "node scripts/checkZodiacExplanationCardCompression.mjs"'), 'package_script_registered');

mark(changedFiles.every((file) => allowedChangedFiles.has(file)), 'changed_files_limited_to_zodiac_explanation_card_compression_scope');
mark(!changedFiles.some((file) => forbiddenChangedPaths.some((path) => file === path || file.startsWith(path))), 'protected_paths_unchanged');
mark(!changedFiles.some((file) => file.endsWith('.aab') || file.endsWith('.zip') || file.endsWith('.jks') || file.endsWith('.keystore')), 'release_or_secret_artifacts_not_added');

for (const snippet of forbiddenDiffSnippets) {
  mark(!guardedDiffOutput.includes(snippet), `diff_excludes_${snippet}`);
}

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Zodiac explanation card compression check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Zodiac explanation card compression check passed');
