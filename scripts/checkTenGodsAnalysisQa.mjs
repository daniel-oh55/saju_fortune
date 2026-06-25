import fs from 'node:fs';
import { execSync } from 'node:child_process';

const qaDocPath = 'docs/TEN_GODS_ANALYSIS_QA.md';
const draftPath = 'src/domain/saju/tenGodAnalysisDraft.ts';
const draftDocPath = 'docs/TEN_GODS_ANALYSIS_DRAFT.md';
const dataPath = 'src/data/tenGods.ts';
const requiredPaths = [qaDocPath, draftPath, draftDocPath, dataPath];

const requiredDocSnippets = [
  '# Ten Gods Analysis QA',
  'analyzeTenGodsFromStems()',
  'TEN-GODS-ANALYSIS-QA-001',
  'TEN-GODS-ANALYSIS-QA-002',
  'TEN-GODS-ANALYSIS-QA-003',
  'source: ten-gods',
  'source: heavenly-stem',
  'verificationStatus: Pending external verification',
  'connectionStatus: Not connected to production analysis',
  'summaryByTenGod',
  'targets',
  'Pending script verification',
  'production 십성 분석 연결: Pending',
  '지장간 십성 산출: Pending',
  '십성 데이터 외부 기준 검증: Pending',
  'Expected target ten gods',
  'Expected summary',
  'production 계산 로직 변경 없음',
  '기존 겉오행 분석 로직 변경 없음',
  '십성 분석 production 연결 없음',
  '지장간 십성 산출 없음',
  'createSajuAnalysis 반환 구조 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
];

const requiredDraftSnippets = [
  'tenGodMappingByDayStem',
  'tenGodProfiles',
  'export function analyzeTenGodsFromStems',
  "source: 'ten-gods'",
  "source: 'heavenly-stem'",
  "verificationStatus: 'Pending external verification'",
  "connectionStatus: 'Not connected to production analysis'",
  'summaryByTenGod',
  'targets',
];

const sampleCases = [
  {
    id: 'TEN-GODS-ANALYSIS-QA-001',
    dayStem: '甲',
    targets: [
      ['yearStem', '甲', 'bijian'],
      ['monthStem', '丙', 'shishen'],
      ['dayStem', '甲', 'bijian'],
      ['hourStem', '癸', 'zhengyin'],
    ],
    summary: {
      bijian: 2,
      shishen: 1,
      zhengyin: 1,
    },
  },
  {
    id: 'TEN-GODS-ANALYSIS-QA-002',
    dayStem: '丙',
    targets: [
      ['yearStem', '乙', 'zhengyin'],
      ['monthStem', '己', 'shangguan'],
      ['dayStem', '丙', 'bijian'],
      ['hourStem', '壬', 'qisha'],
    ],
    summary: {
      bijian: 1,
      shangguan: 1,
      qisha: 1,
      zhengyin: 1,
    },
  },
  {
    id: 'TEN-GODS-ANALYSIS-QA-003',
    dayStem: '庚',
    targets: [
      ['yearStem', '戊', 'pianyin'],
      ['monthStem', '庚', 'bijian'],
      ['dayStem', '庚', 'bijian'],
      ['hourStem', '壬', 'shishen'],
    ],
    summary: {
      bijian: 2,
      shishen: 1,
      pianyin: 1,
    },
  },
];

const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
const forbiddenDraftSnippets = [
  'elementAnalyzer',
  'createSajuAnalysis',
  'manseryeokEngine',
  'hiddenStemElementAnalysisDraft',
  'Math.random',
];
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

function includesTenGodEntry(source, dayStem, targetStem, tenGod) {
  return source.includes(`tenGodEntry('${dayStem}', '${targetStem}', '${tenGod}')`);
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
const draft = fs.readFileSync(draftPath, 'utf8');
const data = fs.readFileSync(dataPath, 'utf8');

for (const snippet of requiredDocSnippets) {
  const found = qaDoc.includes(snippet);
  logResult(`qa_doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredDraftSnippets) {
  const found = draft.includes(snippet);
  logResult(`draft_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const sampleCase of sampleCases) {
  const docHasCase = qaDoc.includes(sampleCase.id);
  logResult(`qa_doc_includes_${sampleCase.id}`, docHasCase);
  if (!docHasCase) hasFailure = true;

  const docHasDayStem = qaDoc.includes(`| ${sampleCase.id} | ${sampleCase.dayStem} |`);
  logResult(`qa_doc_${sampleCase.id}_dayStem_${sampleCase.dayStem}`, docHasDayStem);
  if (!docHasDayStem) hasFailure = true;

  for (const [target, targetStem, tenGod] of sampleCase.targets) {
    const docHasTarget = qaDoc.includes(`${target} ${tenGod}`);
    logResult(`qa_doc_${sampleCase.id}_${target}_${tenGod}`, docHasTarget);
    if (!docHasTarget) hasFailure = true;

    const dataHasMapping = includesTenGodEntry(data, sampleCase.dayStem, targetStem, tenGod);
    logResult(`data_${sampleCase.id}_${sampleCase.dayStem}_${targetStem}_${tenGod}`, dataHasMapping);
    if (!dataHasMapping) hasFailure = true;
  }

  for (const [tenGod, count] of Object.entries(sampleCase.summary)) {
    const summaryText = `${tenGod} ${count}`;
    const docHasSummary = qaDoc.includes(summaryText);
    logResult(`qa_doc_${sampleCase.id}_summary_${labelFromSnippet(summaryText)}`, docHasSummary);
    if (!docHasSummary) hasFailure = true;
  }
}

for (const snippet of forbiddenDocSnippets) {
  const absent = !qaDoc.includes(snippet);
  logResult(`qa_doc_excludes_${labelFromSnippet(snippet)}`, absent);
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
logResult('production_analysis_files_unchanged_in_working_diff', productionFilesUnchanged);
if (!productionFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Ten gods analysis QA check failed');
  process.exit(1);
}

console.log('Ten gods analysis QA check passed');
