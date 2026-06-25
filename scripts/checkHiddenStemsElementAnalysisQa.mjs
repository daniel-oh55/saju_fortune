import fs from 'node:fs';
import { execSync } from 'node:child_process';

const qaDocPath = 'docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_QA.md';
const draftDocPath = 'docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_DRAFT.md';
const draftSourcePath = 'src/domain/saju/hiddenStemElementAnalysisDraft.ts';
const hiddenStemsPath = 'src/data/hiddenStems.ts';
const requiredPaths = [qaDocPath, draftSourcePath, draftDocPath, hiddenStemsPath];
const requiredDocSnippets = [
  '# Hidden Stems Element Analysis QA',
  'analyzeHiddenStemElementsFromBranches',
  'HIDDEN-STEMS-QA-001',
  'HIDDEN-STEMS-QA-002',
  'HIDDEN-STEMS-QA-003',
  'source: hidden-stems',
  'verificationStatus: Pending external verification',
  'connectionStatus: Not connected to production analysis',
  'weightingPolicy: simple-count-draft',
  'simple count',
  'branchBreakdown',
  'dominant',
  'weak',
  'Pending script verification',
  'production 오행 분석 연결: Pending',
  '지장간 데이터 외부 기준 검증: Pending',
  '지장간 가중치 정책: Pending',
  'Expected count summary',
  'wood 2 / fire 1 / earth 2 / metal 1 / water 2',
  'wood 2 / fire 3 / earth 4 / metal 1 / water 1',
  'wood 1 / fire 1 / earth 2 / metal 3 / water 2',
  'production 계산 로직 변경 없음',
  '기존 겉오행 분석 로직 변경 없음',
  'production elementAnalyzer 연결 없음',
  'createSajuAnalysis 반환 구조 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
];
const requiredDraftSnippets = [
  'export function analyzeHiddenStemElementsFromBranches',
  "source: 'hidden-stems'",
  "verificationStatus: 'Pending external verification'",
  "connectionStatus: 'Not connected to production analysis'",
  "weightingPolicy: 'simple-count-draft'",
  'branchBreakdown',
  'dominant',
  'weak',
];
const requiredDataSnippets = [
  'hiddenStemsByBranch',
  '子',
  '丑',
  '寅',
  '卯',
  '辰',
  '巳',
  '午',
  '未',
  '申',
  '酉',
  '戌',
  '亥',
  '甲',
  '乙',
  '丙',
  '丁',
  '戊',
  '己',
  '庚',
  '辛',
  '壬',
  '癸',
];
const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
const forbiddenDraftSnippets = [
  'elementAnalyzer',
  'createSajuAnalysis',
  'manseryeokEngine',
  'Math.random',
];
const productionFiles = [
  'src/domain/saju/elementAnalyzer.js',
  'src/domain/saju/createSajuAnalysis.js',
  'src/domain/saju/manseryeokEngine.js',
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

const qaDoc = fs.readFileSync(qaDocPath, 'utf8');
const draftSource = fs.readFileSync(draftSourcePath, 'utf8');
const hiddenStemsSource = fs.readFileSync(hiddenStemsPath, 'utf8');

for (const snippet of requiredDocSnippets) {
  const found = qaDoc.includes(snippet);
  logResult(`qa_doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredDraftSnippets) {
  const found = draftSource.includes(snippet);
  logResult(`draft_source_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredDataSnippets) {
  const found = hiddenStemsSource.includes(snippet);
  logResult(`hidden_stems_source_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of forbiddenDocSnippets) {
  const absent = !qaDoc.includes(snippet);
  logResult(`qa_doc_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const snippet of forbiddenDraftSnippets) {
  const absent = !draftSource.includes(snippet);
  logResult(`draft_source_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${productionFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const productionFilesUnchanged = diffOutput.length === 0;
logResult('production_analysis_files_unchanged_in_working_diff', productionFilesUnchanged);
if (!productionFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Hidden stems element analysis QA check failed');
  process.exit(1);
}

console.log('Hidden stems element analysis QA check passed');
