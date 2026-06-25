import fs from 'node:fs';
import { execSync } from 'node:child_process';

const draftPath = 'src/domain/saju/hiddenStemElementAnalysisDraft.ts';
const docPath = 'docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_DRAFT.md';
const requiredPaths = [draftPath, docPath];
const requiredDraftSnippets = [
  'hiddenStemsByBranch',
  'export function analyzeHiddenStemElementsFromBranches',
  'export type HiddenStemElementAnalysisDraft',
  "source: 'hidden-stems'",
  "verificationStatus: 'Pending external verification'",
  "connectionStatus: 'Not connected to production analysis'",
  "weightingPolicy: 'simple-count-draft'",
  'branchBreakdown',
  'dominant',
  'weak',
  "'main'",
  "'middle'",
  "'residual'",
  'simple count',
];
const requiredDocSnippets = [
  '# Hidden Stems Element Analysis Draft',
  '## Purpose',
  '## Current Scope',
  '## Draft Function',
  '## Sample Draft Cases',
  '## Compatibility Policy',
  '## Non-Goals',
  '## Related Docs',
  '## Suggested Follow-up PRs',
  'production 오행 분석 연결: Pending',
  '지장간 가중치 정책: Pending',
  'production 계산 로직 변경 없음',
  '기존 겉오행 분석 로직 변경 없음',
  'production elementAnalyzer 연결 없음',
  'createSajuAnalysis 반환 구조 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
  'HIDDEN-STEMS-DRAFT-001',
  'HIDDEN-STEMS-DRAFT-002',
  'HIDDEN-STEMS-DRAFT-003',
];
const forbiddenSnippets = [
  'Completed',
  'Pass',
  'Done',
];
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

for (const snippet of forbiddenSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`doc_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const snippet of forbiddenDraftSnippets) {
  const absent = !draft.includes(snippet);
  logResult(`draft_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${productionFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const productionFilesUnchanged = diffOutput.length === 0;
logResult('production_saju_files_unchanged_in_working_diff', productionFilesUnchanged);
if (!productionFilesUnchanged) {
  hasFailure = true;
}

if (hasFailure) {
  console.error('Hidden stems element analysis draft check failed');
  process.exit(1);
}

console.log('Hidden stems element analysis draft check passed');
