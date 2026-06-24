import fs from 'node:fs';

const dataPath = 'src/data/zodiacFortuneProfiles.ts';
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
const requiredLabels = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];
const requiredHanja = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const requiredArrayFields = [
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

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

function getProfileBlock(source, animal) {
  const startMarker = `  ${animal}: {`;
  const start = source.indexOf(startMarker);
  if (start === -1) return '';

  const nextIndexes = requiredAnimals
    .map((candidate) => source.indexOf(`  ${candidate}: {`, start + startMarker.length))
    .filter((index) => index !== -1);
  const end = nextIndexes.length > 0 ? Math.min(...nextIndexes) : source.indexOf('\n};', start);
  return source.slice(start, end === -1 ? undefined : end);
}

function countArrayItems(block, field) {
  const match = block.match(new RegExp(`${field}: \\[([\\s\\S]*?)\\],`));
  if (!match) return 0;
  const values = match[1].match(/'[^']+'/g) || [];
  return values.length;
}

let hasFailure = false;
const dataExists = fs.existsSync(dataPath);
logResult('zodiac_profiles_file_exists', dataExists, dataPath);

if (!dataExists) {
  process.exit(1);
}

const source = fs.readFileSync(dataPath, 'utf8');

for (const animal of requiredAnimals) {
  const block = getProfileBlock(source, animal);
  const exists = block.length > 0;
  logResult(`zodiac_profile_${animal}_exists`, exists);
  if (!exists) {
    hasFailure = true;
    continue;
  }

  for (const field of requiredArrayFields) {
    const count = countArrayItems(block, field);
    const passed = count >= 3;
    logResult(`zodiac_profile_${animal}_${field}_min_3`, passed, `count=${count}`);
    if (!passed) hasFailure = true;
  }
}

for (const label of requiredLabels) {
  const found = source.includes(`labelKo: '${label}'`);
  logResult(`zodiac_label_${label}_exists`, found);
  if (!found) hasFailure = true;
}

for (const hanja of requiredHanja) {
  const found = source.includes(`hanja: '${hanja}'`);
  logResult(`zodiac_hanja_${hanja}_exists`, found);
  if (!found) hasFailure = true;
}

for (const phrase of bannedPhrases) {
  const absent = !source.includes(phrase);
  logResult(`banned_phrase_absent_${phrase}`, absent);
  if (!absent) hasFailure = true;
}

const forbiddenChangeMentions = ['schemaVersion 변경', 'localStorage key 변경'];
for (const phrase of forbiddenChangeMentions) {
  const absent = !source.includes(phrase);
  logResult(`forbidden_change_phrase_absent_${phrase}`, absent);
  if (!absent) hasFailure = true;
}

if (hasFailure) {
  console.error('Zodiac fortune profiles check failed');
  process.exit(1);
}

console.log('Zodiac fortune profiles check passed');
