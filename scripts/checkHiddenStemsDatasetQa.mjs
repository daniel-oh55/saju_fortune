import fs from 'node:fs';

const dataPath = 'src/data/hiddenStems.ts';
const datasetDocPath = 'docs/HIDDEN_STEMS_DATASET.md';
const qaDocPath = 'docs/HIDDEN_STEMS_DATASET_QA.md';

const expectedBranches = [
  { branch: '子', branchKo: '자', animalKo: '쥐', stems: ['癸'], count: 1 },
  { branch: '丑', branchKo: '축', animalKo: '소', stems: ['己', '癸', '辛'], count: 3 },
  { branch: '寅', branchKo: '인', animalKo: '호랑이', stems: ['甲', '丙', '戊'], count: 3 },
  { branch: '卯', branchKo: '묘', animalKo: '토끼', stems: ['乙'], count: 1 },
  { branch: '辰', branchKo: '진', animalKo: '용', stems: ['戊', '乙', '癸'], count: 3 },
  { branch: '巳', branchKo: '사', animalKo: '뱀', stems: ['丙', '庚', '戊'], count: 3 },
  { branch: '午', branchKo: '오', animalKo: '말', stems: ['丁', '己'], count: 2 },
  { branch: '未', branchKo: '미', animalKo: '양', stems: ['己', '丁', '乙'], count: 3 },
  { branch: '申', branchKo: '신', animalKo: '원숭이', stems: ['庚', '壬', '戊'], count: 3 },
  { branch: '酉', branchKo: '유', animalKo: '닭', stems: ['辛'], count: 1 },
  { branch: '戌', branchKo: '술', animalKo: '개', stems: ['戊', '辛', '丁'], count: 3 },
  { branch: '亥', branchKo: '해', animalKo: '돼지', stems: ['壬', '甲'], count: 2 },
];

const expectedStemMeta = [
  ['甲', '갑', 'wood', 'yang'],
  ['乙', '을', 'wood', 'yin'],
  ['丙', '병', 'fire', 'yang'],
  ['丁', '정', 'fire', 'yin'],
  ['戊', '무', 'earth', 'yang'],
  ['己', '기', 'earth', 'yin'],
  ['庚', '경', 'metal', 'yang'],
  ['辛', '신', 'metal', 'yin'],
  ['壬', '임', 'water', 'yang'],
  ['癸', '계', 'water', 'yin'],
];

const requiredSnippets = [
  'wood',
  'fire',
  'earth',
  'metal',
  'water',
  'yang',
  'yin',
  'main',
  'middle',
  'residual',
  'Pending external verification',
  '## QA Result Summary',
  'production 오행 분석 연결 여부: Pending',
  '지장간 데이터 외부 기준 검증: Pending',
  'production 계산 로직 변경 없음',
  '기존 겉오행 분석 로직 변경 없음',
  '지장간 반영 오행 분석 추가 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
  'hiddenStemsByBranch',
  'not connected to production analysis',
];

const forbiddenImports = ['calculateManseryeok', 'createSajuAnalysis', 'elementAnalyzer'];
const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

function labelFromSnippet(snippet) {
  return snippet
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^\p{L}\p{N}_/-]/gu, '')
    .slice(0, 80);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function branchBlock(data, branch) {
  const pattern = new RegExp(`${escapeRegExp(branch)}:\\s*{([\\s\\S]*?)\\n\\s*},`);
  return data.match(pattern)?.[1] ?? '';
}

let hasFailure = false;

for (const path of [dataPath, datasetDocPath, qaDocPath]) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) {
  process.exit(1);
}

const data = fs.readFileSync(dataPath, 'utf8');
const datasetDoc = fs.readFileSync(datasetDocPath, 'utf8');
const qaDoc = fs.readFileSync(qaDocPath, 'utf8');
const docs = `${datasetDoc}\n${qaDoc}`;
const combined = `${data}\n${docs}`;

for (const expected of expectedBranches) {
  const combination = expected.stems.join(', ');
  const row = `| ${expected.branch} | ${expected.branchKo} | ${expected.animalKo} | ${combination} | ${expected.count} | Pending external verification |`;
  const block = branchBlock(data, expected.branch);
  const branchExists = combined.includes(expected.branch);
  const rowExists = qaDoc.includes(row);
  const countMatches = (block.match(/hiddenStem\(/g) ?? []).length === expected.count;
  const stemsMatch = expected.stems.every((stem) => block.includes(`hiddenStem('${stem}'`));

  logResult(`includes_branch_${expected.branch}`, branchExists);
  logResult(`qa_row_matches_${expected.branch}`, rowExists);
  logResult(`data_count_matches_${expected.branch}`, countMatches, `expected=${expected.count}`);
  logResult(`data_stems_match_${expected.branch}_${labelFromSnippet(combination)}`, stemsMatch);

  if (!branchExists || !rowExists || !countMatches || !stemsMatch) hasFailure = true;
}

for (const [stem, labelKo, element, yinYang] of expectedStemMeta) {
  const stemFound = combined.includes(stem);
  const metaFound = data.includes(`${stem}: { labelKo: '${labelKo}', element: '${element}', yinYang: '${yinYang}' }`);
  const qaRowFound = qaDoc.includes(`| ${stem} | ${labelKo} | ${element} | ${yinYang} |`);
  logResult(`includes_stem_${stem}`, stemFound);
  logResult(`data_meta_matches_${stem}`, metaFound);
  logResult(`qa_meta_row_matches_${stem}`, qaRowFound);
  if (!stemFound || !metaFound || !qaRowFound) hasFailure = true;
}

for (const snippet of requiredSnippets) {
  const found = combined.includes(snippet);
  logResult(`includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const expected of expectedBranches) {
  const block = branchBlock(data, expected.branch);
  const verificationPending = block.includes("verificationStatus: 'Pending external verification'");
  const notesNotConnected = block.includes('not connected to production analysis');
  logResult(`verification_pending_${expected.branch}`, verificationPending);
  logResult(`notes_not_connected_${expected.branch}`, notesNotConnected);
  if (!verificationPending || !notesNotConnected) hasFailure = true;
}

for (const snippet of forbiddenImports) {
  const absent = !data.includes(snippet);
  logResult(`data_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const snippet of forbiddenDocSnippets) {
  const absent = !docs.includes(snippet);
  logResult(`docs_exclude_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

if (hasFailure) {
  console.error('Hidden stems dataset QA check failed');
  process.exit(1);
}

console.log('Hidden stems dataset QA check passed');
