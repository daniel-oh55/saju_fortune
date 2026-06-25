import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/TEN_GODS_COPY_GUIDELINES.md';
const mappingDocPath = 'docs/TEN_GODS_MAPPING.md';
const analysisQaDocPath = 'docs/TEN_GODS_ANALYSIS_QA.md';
const dataPath = 'src/data/tenGods.ts';
const requiredPaths = [docPath, mappingDocPath, analysisQaDocPath, dataPath];

const requiredSections = [
  '# Ten Gods Copy Guidelines',
  '## Purpose',
  '## Current Scope',
  '## User-Friendly Ten Gods Labels',
  '## Allowed Copy Examples',
  '## Avoided Copy Examples',
  '## Tone Guidelines',
  '## Current Status',
  '## Non-Goals for This PR',
  '## Related Docs',
];

const tenGods = [
  ['bijian', '비견', '比肩'],
  ['jiecai', '겁재', '劫財'],
  ['shishen', '식신', '食神'],
  ['shangguan', '상관', '傷官'],
  ['piancai', '편재', '偏財'],
  ['zhengcai', '정재', '正財'],
  ['qisha', '편관', '偏官'],
  ['zhengguan', '정관', '正官'],
  ['pianyin', '편인', '偏印'],
  ['zhengyin', '정인', '正印'],
];

const requiredDocSnippets = [
  'production 십성 분석 연결: Pending',
  '십성 데이터 외부 기준 검증: Pending',
  '지장간 십성 산출: Pending',
  '십성 설명 문구 실제 UI 적용: Pending',
  '십성 설명 문구 UI 적용 없음',
  'production 계산 로직 변경 없음',
  '기존 겉오행 분석 로직 변경 없음',
  '십성 분석 production 연결 없음',
  'createSajuAnalysis 반환 구조 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
  '운세 결과는 참고용 콘텐츠',
  '확정적 예언보다 참고용 표현',
];

const exaggeratedPhrases = [
  '십성까지 완벽히 반영한 정밀 사주 분석',
  '전문 사주가 수준의 십성 분석',
  '정확한 미래 예측',
  '반드시 맞는 사주 풀이',
  '연애운이 반드시 오른다',
  '직장운이 무조건 좋아진다',
  '인간관계를 정확히 예언한다',
];

const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
const productionFiles = [
  'src/domain/saju/elementAnalyzer.js',
  'src/domain/saju/createSajuAnalysis.js',
  'src/domain/saju/manseryeokEngine.js',
  'src/domain/saju/hiddenStemElementAnalysisDraft.ts',
  'src/domain/saju/tenGodAnalysisDraft.ts',
  'src/domain/fortune/yearFortuneEngine.js',
  'src/domain/fortune/zodiacFortuneEngine.js',
  'src/utils/fortuneEngine.js',
  'src/pages/ZodiacFortunePage.jsx',
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

function sectionText(markdown, sectionTitle) {
  const start = markdown.indexOf(sectionTitle);
  if (start === -1) return '';

  const nextHeading = markdown.indexOf('\n## ', start + sectionTitle.length);
  if (nextHeading === -1) return markdown.slice(start);
  return markdown.slice(start, nextHeading);
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

const doc = fs.readFileSync(docPath, 'utf8');
const data = fs.readFileSync(dataPath, 'utf8');
const avoidedSection = sectionText(doc, '## Avoided Copy Examples');
const outsideAvoidedSection = doc.replace(avoidedSection, '');

for (const section of requiredSections) {
  const found = doc.includes(section);
  logResult(`doc_includes_${labelFromSnippet(section)}`, found);
  if (!found) hasFailure = true;
}

for (const [key, labelKo, hanja] of tenGods) {
  const docHasKey = doc.includes(`| ${key} |`);
  const docHasLabel = doc.includes(`| ${key} | ${labelKo} |`);
  const docHasHanja = doc.includes(`| ${key} | ${labelKo} | ${hanja} |`);
  const dataHasKey = data.includes(`${key}:`);
  const dataHasLabel = data.includes(`labelKo: '${labelKo}'`);
  const dataHasHanja = data.includes(`hanja: '${hanja}'`);

  logResult(`doc_includes_key_${key}`, docHasKey);
  logResult(`doc_includes_label_${key}_${labelKo}`, docHasLabel);
  logResult(`doc_includes_hanja_${key}_${hanja}`, docHasHanja);
  logResult(`data_includes_key_${key}`, dataHasKey);
  logResult(`data_includes_label_${key}_${labelKo}`, dataHasLabel);
  logResult(`data_includes_hanja_${key}_${hanja}`, dataHasHanja);

  if (!docHasKey || !docHasLabel || !docHasHanja || !dataHasKey || !dataHasLabel || !dataHasHanja) {
    hasFailure = true;
  }
}

for (const snippet of requiredDocSnippets) {
  const found = doc.includes(snippet);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const phrase of exaggeratedPhrases) {
  const inAvoided = avoidedSection.includes(phrase);
  const outsideAvoided = outsideAvoidedSection.includes(phrase);
  logResult(`exaggerated_phrase_in_avoided_${labelFromSnippet(phrase)}`, inAvoided);
  logResult(`exaggerated_phrase_only_in_avoided_${labelFromSnippet(phrase)}`, !outsideAvoided);
  if (!inAvoided || outsideAvoided) hasFailure = true;
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
logResult('production_and_ui_files_unchanged_in_working_diff', productionFilesUnchanged);
if (!productionFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Ten gods copy guidelines check failed');
  process.exit(1);
}

console.log('Ten gods copy guidelines check passed');
