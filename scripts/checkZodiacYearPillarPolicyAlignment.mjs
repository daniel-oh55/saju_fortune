import fs from 'node:fs';

const pagePath = 'src/pages/ZodiacFortunePage.jsx';
const requiredSnippets = [
  ['getProfileZodiac_function_exists', 'function getProfileZodiac'],
  ['uses_getZodiacByYearPillar', 'getZodiacByYearPillar'],
  ['defines_pillarZodiac', 'const pillarZodiac = getZodiacByYearPillar'],
  ['defines_fallbackZodiac', 'const fallbackZodiac = getZodiacByYear(birthYear)'],
  ['uses_resolvedZodiac', 'const resolvedZodiac = pillarZodiac || fallbackZodiac'],
  ['resolved_animal_selected', 'animal: resolvedZodiac.animal'],
  ['resolved_icon_selected', 'icon: resolvedZodiac.icon'],
  ['birth_year_animal_field_exists', 'birthYearAnimal'],
  ['saju_year_pillar_animal_field_exists', 'sajuYearPillarAnimal'],
  ['difference_flag_exists', 'isDifferentFromBirthYearAnimal'],
  ['saju_priority_notice_exists', '사주 기준 띠 흐름을 안내합니다'],
  ['birth_year_reference_notice_exists', '일반적인 출생연도 기준 띠와 다르게 보일 수 있으며'],
  ['difference_notice_birth_year_exists', '일반 출생연도 기준으로는'],
  ['difference_notice_saju_year_exists', '사주 연주 기준으로는'],
];
const forbiddenChangeMentions = ['schemaVersion 변경', 'localStorage key 변경'];

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

let hasFailure = false;
const exists = fs.existsSync(pagePath);
logResult('zodiac_page_exists', exists, pagePath);

if (!exists) {
  process.exit(1);
}

const source = fs.readFileSync(pagePath, 'utf8');

for (const [label, snippet] of requiredSnippets) {
  const found = source.includes(snippet);
  logResult(label, found);
  if (!found) hasFailure = true;
}

for (const phrase of forbiddenChangeMentions) {
  const absent = !source.includes(phrase);
  logResult(`forbidden_change_phrase_absent_${phrase}`, absent);
  if (!absent) hasFailure = true;
}

if (hasFailure) {
  console.error('Zodiac year pillar policy alignment check failed');
  process.exit(1);
}

console.log('Zodiac year pillar policy alignment check passed');
