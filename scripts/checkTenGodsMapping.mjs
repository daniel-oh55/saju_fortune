import fs from 'node:fs';
import { execSync } from 'node:child_process';

const dataPath = 'src/data/tenGods.ts';
const docPath = 'docs/TEN_GODS_MAPPING.md';
const requiredPaths = [dataPath, docPath];
const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const tenGodKeys = [
  'bijian',
  'jiecai',
  'shishen',
  'shangguan',
  'piancai',
  'zhengcai',
  'qisha',
  'zhengguan',
  'pianyin',
  'zhengyin',
];
const tenGodLabels = ['비견', '겁재', '식신', '상관', '편재', '정재', '편관', '정관', '편인', '정인'];
const tenGodHanja = ['比肩', '劫財', '食神', '傷官', '偏財', '正財', '偏官', '正官', '偏印', '正印'];
const elements = ['wood', 'fire', 'earth', 'metal', 'water'];
const yinYang = ['yang', 'yin'];
const requiredDocSnippets = [
  '# Ten Gods Mapping',
  'production 십성 분석 연결: Pending',
  '십성 반영 운세 결과 생성: Pending',
  'production 계산 로직 변경 없음',
  '기존 겉오행 분석 로직 변경 없음',
  '십성 분석 production 연결 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
];
const requiredDataSnippets = [
  'heavenlyStemMeta',
  'tenGodProfiles',
  'tenGodMappingByDayStem',
  'Pending external verification',
];
const forbiddenDataSnippets = [
  'calculateManseryeok',
  'createSajuAnalysis',
  'elementAnalyzer',
  'hiddenStemElementAnalysisDraft',
];
const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
const productionFiles = [
  'src/domain/saju/elementAnalyzer.js',
  'src/domain/saju/createSajuAnalysis.js',
  'src/domain/saju/manseryeokEngine.js',
  'src/domain/saju/hiddenStemElementAnalysisDraft.ts',
  'src/domain/fortune/yearFortuneEngine.js',
  'src/domain/fortune/zodiacFortuneEngine.js',
  'src/utils/fortuneEngine.js',
];

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

for (const path of requiredPaths) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) {
  process.exit(1);
}

const data = fs.readFileSync(dataPath, 'utf8');
const doc = fs.readFileSync(docPath, 'utf8');

for (const snippet of [...stems, ...tenGodKeys, ...tenGodLabels, ...tenGodHanja, ...elements, ...yinYang]) {
  const foundInData = data.includes(snippet);
  const foundInDoc = doc.includes(snippet);
  logResult(`data_includes_${labelFromSnippet(snippet)}`, foundInData);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, foundInDoc);
  if (!foundInData || !foundInDoc) hasFailure = true;
}

for (const snippet of requiredDataSnippets) {
  const found = data.includes(snippet);
  logResult(`data_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredDocSnippets) {
  const found = doc.includes(snippet);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

const mappingEntryCount = data.match(/tenGodEntry\('/g)?.length ?? 0;
const hasOneHundredEntries = mappingEntryCount === 100;
logResult('mapping_entry_count_100', hasOneHundredEntries, `count=${mappingEntryCount}`);
if (!hasOneHundredEntries) hasFailure = true;

for (const dayStem of stems) {
  const dayStemEntryCount = data.match(new RegExp(`tenGodEntry\\('${dayStem}',`, 'g'))?.length ?? 0;
  const hasTenEntries = dayStemEntryCount === 10;
  logResult(`day_stem_${dayStem}_entry_count_10`, hasTenEntries, `count=${dayStemEntryCount}`);
  if (!hasTenEntries) hasFailure = true;
}

for (const snippet of forbiddenDataSnippets) {
  const absent = !data.includes(snippet);
  logResult(`data_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`doc_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${productionFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const productionFilesUnchanged = diffOutput.length === 0;
logResult('production_analysis_files_unchanged_in_working_diff', productionFilesUnchanged);
if (!productionFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Ten gods mapping check failed');
  process.exit(1);
}

console.log('Ten gods mapping check passed');
