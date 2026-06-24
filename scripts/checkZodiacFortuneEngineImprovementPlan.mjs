import fs from 'node:fs';

const docPath = 'docs/ZODIAC_FORTUNE_ENGINE_IMPROVEMENT_PLAN.md';
const requiredPhrases = [
  'production 계산 로직 변경은 포함하지 않는다',
  'production 계산 로직 변경 없음',
  'UI 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  '## QA Criteria',
  '## Suggested Follow-up PRs',
];

const zodiacAnimals = [
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

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

let hasFailure = false;

const docExists = fs.existsSync(docPath);
logResult('zodiac_improvement_plan_doc_exists', docExists, docPath);

if (!docExists) {
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');

for (const phrase of requiredPhrases) {
  const found = doc.includes(phrase);
  logResult(`doc_includes_${phrase.replaceAll(' ', '_')}`, found);
  if (!found) hasFailure = true;
}

for (const animal of zodiacAnimals) {
  const found = doc.includes(`'${animal}'`);
  logResult(`doc_includes_zodiac_${animal}`, found);
  if (!found) hasFailure = true;
}

if (hasFailure) {
  console.error('Zodiac fortune engine improvement plan check failed');
  process.exit(1);
}

console.log('Zodiac fortune engine improvement plan check passed');

