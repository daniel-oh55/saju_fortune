import fs from 'node:fs';

const dataPath = 'src/data/hiddenStems.ts';
const docPath = 'docs/HIDDEN_STEMS_DATASET.md';
const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const combinations = [
  '癸',
  '己, 癸, 辛',
  '甲, 丙, 戊',
  '乙',
  '戊, 乙, 癸',
  '丙, 庚, 戊',
  '丁, 己',
  '己, 丁, 乙',
  '庚, 壬, 戊',
  '辛',
  '戊, 辛, 丁',
  '壬, 甲',
];
const requiredSnippets = [
  'wood',
  'fire',
  'earth',
  'metal',
  'water',
  'yang',
  'yin',
  'Pending external verification',
  'production 계산 로직 변경 없음',
  '기존 겉오행 분석 로직 변경 없음',
  '지장간 반영 오행 분석 추가 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
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

let hasFailure = false;

for (const path of [dataPath, docPath]) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) {
  process.exit(1);
}

const data = fs.readFileSync(dataPath, 'utf8');
const doc = fs.readFileSync(docPath, 'utf8');
const combined = `${data}\n${doc}`;

for (const branch of branches) {
  const found = combined.includes(branch);
  logResult(`includes_branch_${branch}`, found);
  if (!found) hasFailure = true;
}

for (const stem of stems) {
  const found = combined.includes(stem);
  logResult(`includes_stem_${stem}`, found);
  if (!found) hasFailure = true;
}

for (const combination of combinations) {
  const found = doc.includes(combination);
  logResult(`doc_includes_combination_${labelFromSnippet(combination)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredSnippets) {
  const found = combined.includes(snippet);
  logResult(`includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of forbiddenImports) {
  const absent = !data.includes(snippet);
  logResult(`data_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`doc_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

if (hasFailure) {
  console.error('Hidden stems dataset check failed');
  process.exit(1);
}

console.log('Hidden stems dataset check passed');
