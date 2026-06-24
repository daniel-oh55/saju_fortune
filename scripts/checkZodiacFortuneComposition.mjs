import fs from 'node:fs';

const composerPath = 'src/lib/zodiacFortuneComposer.ts';
const dataPath = 'src/data/zodiacFortuneProfiles.ts';
const enginePath = 'src/domain/fortune/zodiacFortuneEngine.js';
const requiredAnimals = [
  'rat',
  'ox',
  'tiger',
  'rabbit',
  'dragon',
  'snake',
  'horse',
  'goat',
  'monkey',
  'rooster',
  'dog',
  'pig',
];
const requiredFields = [
  'title',
  'summary',
  'dailyFlow',
  'relationship',
  'money',
  'health',
  'routine',
  'caution',
];
const requiredProfileFields = [
  'baseTraits',
  'strengths',
  'cautions',
  'dailyThemes',
  'relationshipHints',
  'moneyTone',
  'healthTone',
  'routineHints',
];
const bannedPhrases = ['반드시', '무조건', '확정', '대박', '수익 보장', '투자하면', '병이 낫', '완치', '절대', '정답'];
const forbiddenChangeMentions = ['schemaVersion 변경', 'localStorage key 변경'];

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

let hasFailure = false;

for (const path of [composerPath, dataPath, enginePath]) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) {
  process.exit(1);
}

const composer = fs.readFileSync(composerPath, 'utf8');
const data = fs.readFileSync(dataPath, 'utf8');
const engine = fs.readFileSync(enginePath, 'utf8');
const combined = `${composer}\n${engine}`;

const exportChecks = [
  ['composeZodiacFortune_export_exists', /export function composeZodiacFortune/.test(composer)],
  ['isZodiacAnimal_export_exists', /export function isZodiacAnimal/.test(composer)],
  ['zodiac_label_guard_export_exists', /export function getZodiacAnimalByLabel/.test(composer)],
  ['composition_type_exists', /export type ZodiacFortuneComposition/.test(composer)],
];

for (const [label, passed] of exportChecks) {
  logResult(label, passed);
  if (!passed) hasFailure = true;
}

for (const animal of requiredAnimals) {
  const found = data.includes(`${animal}: {`) && composer.includes(`'${animal}'`);
  logResult(`composition_supports_${animal}`, found);
  if (!found) hasFailure = true;
}

for (const field of requiredFields) {
  const inType = composer.includes(`${field}: string`);
  const inReturn = new RegExp(`${field}:`).test(composer);
  const passed = inType && inReturn;
  logResult(`composition_field_${field}_exists`, passed);
  if (!passed) hasFailure = true;
}

for (const field of requiredProfileFields) {
  const used = composer.includes(`profile.${field}`);
  logResult(`composition_uses_profile_${field}`, used);
  if (!used) hasFailure = true;
}

const deterministicChecks = [
  ['composition_uses_date_seed', /getDateSeed/.test(composer)],
  ['composition_uses_variant_seed', /variantSeed/.test(composer)],
  ['composition_uses_pick_by_seed', /pickBySeed/.test(composer)],
  ['composition_avoids_math_random', !combined.includes('Math.random')],
];

for (const [label, passed] of deterministicChecks) {
  logResult(label, passed);
  if (!passed) hasFailure = true;
}

const engineConnectionChecks = [
  ['engine_imports_composeZodiacFortune', engine.includes('composeZodiacFortune')],
  ['engine_imports_getZodiacAnimalByLabel', engine.includes('getZodiacAnimalByLabel')],
  ['engine_uses_composition_summary', engine.includes('composition.summary')],
  ['engine_uses_composition_detail', engine.includes('composition.caution')],
];

for (const [label, passed] of engineConnectionChecks) {
  logResult(label, passed);
  if (!passed) hasFailure = true;
}

for (const phrase of bannedPhrases) {
  const absent = !combined.includes(phrase);
  logResult(`banned_phrase_absent_${phrase}`, absent);
  if (!absent) hasFailure = true;
}

for (const phrase of forbiddenChangeMentions) {
  const absent = !combined.includes(phrase);
  logResult(`forbidden_change_phrase_absent_${phrase}`, absent);
  if (!absent) hasFailure = true;
}

if (hasFailure) {
  console.error('Zodiac fortune composition check failed');
  process.exit(1);
}

console.log('Zodiac fortune composition check passed');
