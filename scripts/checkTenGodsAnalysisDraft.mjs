import fs from 'node:fs';
import { execSync } from 'node:child_process';

const draftPath = 'src/domain/saju/tenGodAnalysisDraft.ts';
const docPath = 'docs/TEN_GODS_ANALYSIS_DRAFT.md';
const designDocPath = 'docs/TEN_GODS_ANALYSIS_DESIGN.md';
const dataPath = 'src/data/tenGods.ts';
const requiredPaths = [draftPath, docPath, designDocPath, dataPath];
const requiredDraftSnippets = [
  'tenGodMappingByDayStem',
  'tenGodProfiles',
  'export function analyzeTenGodsFromStems',
  'export type TenGodAnalysisDraft',
  "source: 'ten-gods'",
  "source: 'heavenly-stem'",
  "verificationStatus: 'Pending external verification'",
  "connectionStatus: 'Not connected to production analysis'",
  'summaryByTenGod',
  'TenGodTargetResult',
  'TenGodTargetInput',
];
const requiredDocSnippets = [
  '# Ten Gods Analysis Draft',
  'TEN-GODS-DRAFT-001',
  'TEN-GODS-DRAFT-002',
  'TEN-GODS-DRAFT-003',
  'production 십성 분석 연결: Pending',
  '지장간 십성 산출: Pending',
  '십성 데이터 외부 기준 검증: Pending',
  'production 계산 로직 변경 없음',
  '기존 겉오행 분석 로직 변경 없음',
  '십성 분석 production 연결 없음',
  'createSajuAnalysis 반환 구조 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
];
const forbiddenDraftSnippets = [
  'elementAnalyzer',
  'createSajuAnalysis',
  'manseryeokEngine',
  'hiddenStemElementAnalysisDraft',
  'Math.random',
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

const draft = fs.readFileSync(draftPath, 'utf8');
const doc = fs.readFileSync(docPath, 'utf8');

for (const snippet of requiredDraftSnippets) {
  const found = draft.includes(snippet);
  logResult(`draft_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredDocSnippets) {
  const found = doc.includes(snippet);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of forbiddenDraftSnippets) {
  const absent = !draft.includes(snippet);
  logResult(`draft_excludes_${labelFromSnippet(snippet)}`, absent);
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
  console.error('Ten gods analysis draft check failed');
  process.exit(1);
}

console.log('Ten gods analysis draft check passed');
