import { execSync } from 'node:child_process';
import fs from 'node:fs';

const regionSourcePath = 'src/utils/profileRegionMetaStorage.js';
const profileFormPath = 'src/components/ProfileForm.jsx';
const packagePath = 'package.json';

const regionSource = fs.readFileSync(regionSourcePath, 'utf8');
const profileFormSource = fs.readFileSync(profileFormPath, 'utf8');
const packageSource = fs.readFileSync(packagePath, 'utf8');

const checks = [];
const mark = (condition, label) => {
  checks.push({ condition: Boolean(condition), label });
};

const {
  MAX_OVERSEAS_REGION_DISTRICT_LENGTH,
  OVERSEAS_REGION_PROVINCE,
  PROFILE_REGION_META_KEY,
  PROFILE_REGION_PROVINCES,
  PROFILE_REGION_SELECT_OPTIONS,
  getDistrictsByProvince,
  isOverseasRegionProvince,
  normalizeProfileRegionMeta,
  normalizeOverseasRegionDistrict,
} = await import(`../${regionSourcePath}?check=${Date.now()}`);

const changedFiles = execSync('git diff --name-only HEAD', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);

const allowedChangedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  'package.json',
  'scripts/checkAppWideBackNavigation.mjs',
  'scripts/checkBirthRegionExpansionPolicy.mjs',
  'scripts/checkFiveElementsGuidanceDeduplication.mjs',
  profileFormPath,
  'src/styles.css',
  regionSourcePath,
  'scripts/checkKoreanBirthRegionData.mjs',
  'scripts/checkNativeAndroidBackButton.mjs',
  'scripts/checkOverseasBirthRegionInput.mjs',
  'scripts/checkZodiacExplanationCardOrder.mjs',
]);

const protectedChangedPrefixes = [
  'android/',
  'docs/generated/',
  'public/privacy-policy.html',
  'src/domain/',
];

const protectedChangedFiles = [
  'package-lock.json',
  'src/domain/fortune/zodiacFortuneEngine.js',
  'src/utils/fortuneEngine.js',
];

const forbiddenExtensions = ['.aab', '.zip', '.jks', '.keystore'];

mark(PROFILE_REGION_META_KEY === 'harupuli_profile_region_meta_v1', 'profile_region_storage_key_unchanged');
mark(OVERSEAS_REGION_PROVINCE === '해외', 'overseas_region_special_option_declared');
mark(PROFILE_REGION_PROVINCES.length === 17, 'domestic_profile_region_province_count_remains_17');
mark(!PROFILE_REGION_PROVINCES.includes('해외'), 'domestic_profile_region_provinces_exclude_overseas');
mark(PROFILE_REGION_SELECT_OPTIONS.length === 18, 'profile_region_select_options_include_domestic_plus_overseas');
mark(PROFILE_REGION_SELECT_OPTIONS.at(-1) === '해외', 'overseas_option_added_after_domestic_options');
mark(getDistrictsByProvince('해외').length === 0, 'overseas_option_has_no_domestic_district_select');
mark(isOverseasRegionProvince('해외') && !isOverseasRegionProvince('서울특별시'), 'overseas_region_predicate_scoped');
mark(MAX_OVERSEAS_REGION_DISTRICT_LENGTH === 80, 'overseas_region_input_length_limited');

const normalizedOverseas = normalizeProfileRegionMeta({
  province: '해외',
  district: '  Los Angeles  ',
});
mark(normalizedOverseas.province === '해외', 'normalized_overseas_province_saved_as_overseas');
mark(normalizedOverseas.district === 'Los Angeles', 'normalized_overseas_district_trimmed');
mark(
  normalizeOverseasRegionDistrict('<script>alert(1)</script>') === 'scriptalert(1)/script',
  'overseas_region_district_angle_brackets_removed',
);

mark(regionSource.includes('PROFILE_REGION_PROVINCES = Object.keys(REGION_DISTRICTS)'), 'domestic_region_source_count_derived_from_region_districts');
mark(regionSource.includes('PROFILE_REGION_SELECT_OPTIONS'), 'separate_region_select_options_exported');
mark(profileFormSource.includes('PROFILE_REGION_SELECT_OPTIONS'), 'profile_form_uses_select_options_with_overseas');
mark(profileFormSource.includes('isOverseasRegionProvince'), 'profile_form_checks_overseas_special_option');
mark(profileFormSource.includes('해외 도시/지역'), 'overseas_city_region_label_present');
mark(profileFormSource.includes('예: Los Angeles, Tokyo, Vancouver'), 'overseas_city_region_placeholder_present');
mark(profileFormSource.includes('태양시 보정 적용 여부'), 'solar_time_correction_status_phrase_present');
mark(!profileFormSource.includes('태양시 보정 적용 여무'), 'solar_time_correction_status_typo_forbidden');
mark(profileFormSource.includes('해외 도시/지역명을 입력해 주세요.'), 'empty_overseas_city_region_validation_present');
mark(profileFormSource.includes('maxLength={MAX_OVERSEAS_REGION_DISTRICT_LENGTH}'), 'overseas_text_input_uses_max_length');
mark(profileFormSource.includes('replace(/[<>]/g, \'\')'), 'overseas_text_input_removes_angle_brackets');
mark(packageSource.includes('"check:overseas-birth-region-input": "node scripts/checkOverseasBirthRegionInput.mjs"'), 'package_script_registered');

const profileFormChanged = changedFiles.includes(profileFormPath);
mark(profileFormChanged, 'profile_form_changed_for_ui_input');
mark(changedFiles.every((file) => allowedChangedFiles.has(file)), 'changed_files_limited_to_overseas_birth_region_scope');
mark(!changedFiles.some((file) => protectedChangedPrefixes.some((prefix) => file.startsWith(prefix))), 'protected_prefixes_unchanged');
mark(!changedFiles.some((file) => protectedChangedFiles.includes(file)), 'protected_production_and_storage_files_unchanged');
mark(!changedFiles.some((file) => forbiddenExtensions.some((extension) => file.endsWith(extension))), 'release_or_secret_artifacts_not_added');

const diffNameStatus = execSync('git diff --name-status HEAD', { encoding: 'utf8' });
mark(!/package-lock\.json/.test(diffNameStatus), 'package_lock_unchanged');
mark(!/schemaVersion|CURRENT_FORTUNE_SCHEMA_VERSION/.test(execSync('git diff HEAD -- src package.json', { encoding: 'utf8' })), 'schema_versions_not_changed_in_src_or_package');
mark(!/\b(?:geocod|time\s*zone|lat(?:itude)?|lon(?:gitude)?)\b/i.test(execSync('git diff HEAD -- src package.json', { encoding: 'utf8' })), 'no_geocoding_timezone_or_coordinate_logic_added');

const failed = checks.filter((check) => !check.condition);

if (failed.length > 0) {
  console.error('Overseas birth region input check failed');
  failed.forEach((check) => console.error(`- ${check.label}`));
  process.exit(1);
}

console.log('Overseas birth region input check passed');
