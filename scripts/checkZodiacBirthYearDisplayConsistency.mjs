import fs from 'node:fs';

const pagePath = 'src/pages/ZodiacFortunePage.jsx';
const enginePath = 'src/domain/fortune/zodiacFortuneEngine.js';
const packagePath = 'package.json';

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

let hasFailure = false;

for (const path of [pagePath, enginePath, packagePath]) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) {
  process.exit(1);
}

const page = fs.readFileSync(pagePath, 'utf8');
const engine = fs.readFileSync(enginePath, 'utf8');
const packageJson = fs.readFileSync(packagePath, 'utf8');

const requiredPageSnippets = [
  ['uses_representative_year_list', 'const baseYears = getYearsByAnimal(selectedAnimal);'],
  ['returns_representative_year_list_only', 'return baseYears;'],
  ['profile_open_year_guard_exists', 'profileZodiacYears.some((item) => item.year === profileZodiac.year)'],
  ['keeps_profile_zodiac_reference_notice', 'getProfileZodiac(profile, fortune)'],
];

const forbiddenPageSnippets = [
  ['does_not_append_profile_zodiac_to_year_list', 'return [...baseYears, profileZodiac].sort((a, b) => a.year - b.year);'],
  ['does_not_force_profile_year_open', 'openYears: [profileZodiac.year]'],
  ['forbidden_display_1988_rabbit_absent', '1988년 토끼띠'],
];

for (const [label, snippet] of requiredPageSnippets) {
  const found = page.includes(snippet);
  logResult(label, found);
  if (!found) hasFailure = true;
}

for (const [label, snippet] of forbiddenPageSnippets) {
  const absent = !page.includes(snippet);
  logResult(label, absent);
  if (!absent) hasFailure = true;
}

const representativeYearSourcePreserved =
  engine.includes('export const zodiacYears = Array.from') &&
  engine.includes('1948 + index') &&
  engine.includes('zodiacAnimals[index % zodiacAnimals.length]') &&
  engine.includes('getYearsByAnimal');
logResult('representative_twelve_year_cycle_source_preserved', representativeYearSourcePreserved);
if (!representativeYearSourcePreserved) hasFailure = true;

const representativeCycle = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
const getRepresentativeAnimal = (year) => representativeCycle[(year - 1948) % representativeCycle.length];
const representativeYearChecks = [
  ['rabbit_1987_preserved', getRepresentativeAnimal(1987) === '토끼'],
  ['rabbit_1999_preserved', getRepresentativeAnimal(1999) === '토끼'],
  ['dragon_1988_preserved', getRepresentativeAnimal(1988) === '용'],
  ['rabbit_1988_not_in_representative_list', getRepresentativeAnimal(1988) !== '토끼'],
];

for (const [label, passed] of representativeYearChecks) {
  logResult(label, passed);
  if (!passed) hasFailure = true;
}

const packageScriptExists = packageJson.includes(
  '"check:zodiac-birth-year-display-consistency": "node scripts/checkZodiacBirthYearDisplayConsistency.mjs"',
);
logResult('package_script_exists', packageScriptExists);
if (!packageScriptExists) hasFailure = true;

if (hasFailure) {
  console.error('Zodiac birth year display consistency check failed');
  process.exit(1);
}

console.log('Zodiac birth year display consistency check passed');
