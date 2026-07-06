import fs from 'node:fs';
import { execSync } from 'node:child_process';

const regionSourcePath = 'src/utils/profileRegionMetaStorage.js';
const packagePath = 'package.json';
const protectedFiles = [
  'docs/generated',
  'android',
  'public/privacy-policy.html',
  'src/domain',
  'src/utils/fortuneEngine.js',
  'src/domain/fortune/zodiacFortuneEngine.js',
];

const requiredSeoulDistricts = [
  '강남구',
  '강동구',
  '강북구',
  '강서구',
  '관악구',
  '광진구',
  '구로구',
  '금천구',
  '노원구',
  '도봉구',
  '동대문구',
  '동작구',
  '마포구',
  '서대문구',
  '서초구',
  '성동구',
  '성북구',
  '송파구',
  '양천구',
  '영등포구',
  '용산구',
  '은평구',
  '종로구',
  '중구',
  '중랑구',
];

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

function labelFromSnippet(snippet) {
  return snippet
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^\p{L}\p{N}_/-]/gu, '')
    .slice(0, 90);
}

function pathIsProtected(path) {
  return protectedFiles.some((protectedFile) => path === protectedFile || path.startsWith(`${protectedFile}/`));
}

let hasFailure = false;

for (const path of [regionSourcePath, packagePath]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const regionSource = fs.readFileSync(regionSourcePath, 'utf8');
const packageSource = fs.readFileSync(packagePath, 'utf8');
const seoulMatch = /서울특별시:\s*\[([\s\S]*?)\]/.exec(regionSource);
const seoulBlock = seoulMatch?.[1] || '';
const seoulDistricts = [...seoulBlock.matchAll(/'([^']+)'/g)].map((match) => match[1]);

const seoulListExists = seoulDistricts.length > 0;
logResult('seoul_district_list_exists', seoulListExists);
if (!seoulListExists) hasFailure = true;

for (const district of requiredSeoulDistricts) {
  const found = seoulDistricts.includes(district);
  logResult(`seoul_includes_${labelFromSnippet(district)}`, found);
  if (!found) hasFailure = true;
}

const uniqueSeoulDistricts = new Set(seoulDistricts);
const hasNoDuplicates = uniqueSeoulDistricts.size === seoulDistricts.length;
logResult('seoul_districts_have_no_duplicates', hasNoDuplicates, `${uniqueSeoulDistricts.size}/${seoulDistricts.length}`);
if (!hasNoDuplicates) hasFailure = true;

const hasExactlyRequiredCount = seoulDistricts.length === requiredSeoulDistricts.length;
logResult('seoul_district_count_is_25', hasExactlyRequiredCount, String(seoulDistricts.length));
if (!hasExactlyRequiredCount) hasFailure = true;

const profileRegionKeyUnchanged = regionSource.includes("PROFILE_REGION_META_KEY = 'harupuli_profile_region_meta_v1'");
logResult('profile_region_meta_key_unchanged', profileRegionKeyUnchanged);
if (!profileRegionKeyUnchanged) hasFailure = true;

const packageScriptRegistered = packageSource.includes(
  '"check:birth-region-district-options": "node scripts/checkBirthRegionDistrictOptions.mjs"',
);
logResult('package_script_registered', packageScriptRegistered);
if (!packageScriptRegistered) hasFailure = true;

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('engine_generated_privacy_android_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

const statusFiles = execSync('git status --short --untracked-files=all', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''));
const protectedUntrackedFiles = statusFiles.filter((path) => pathIsProtected(path));
const protectedUntrackedFilesAbsent = protectedUntrackedFiles.length === 0;
logResult('protected_untracked_files_absent', protectedUntrackedFilesAbsent);
if (!protectedUntrackedFilesAbsent) hasFailure = true;

const trackedFiles = execSync('git ls-files', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const artifactFiles = [...trackedFiles, ...statusFiles].filter((path) =>
  path.endsWith('.aab') || path.endsWith('.zip') || path.endsWith('.jks') || path.endsWith('.keystore')
);
const artifactFilesAbsent = artifactFiles.length === 0;
logResult('artifact_zip_and_keystore_files_not_added_to_repository', artifactFilesAbsent);
if (!artifactFilesAbsent) hasFailure = true;

if (hasFailure) {
  console.error('Birth region district options check failed');
  process.exit(1);
}

console.log('Birth region district options check passed');
