import fs from 'node:fs';

const designDocPath = 'docs/TEN_GODS_ANALYSIS_DESIGN.md';
const requiredPaths = [
  designDocPath,
  'docs/TEN_GODS_MAPPING.md',
  'docs/TEN_GODS_MAPPING_QA.md',
  'src/data/tenGods.ts',
];
const requiredSnippets = [
  '## Purpose',
  '## Current Status',
  '## Design Goals',
  '## Proposed Result Structure',
  '## Analysis Scope Policy',
  '## Compatibility Policy',
  '## Product Copy Guidance',
  '## Non-Goals for This PR',
  '## Related Docs',
  'TenGodAnalysisDraft',
  'CombinedSajuAnalysisDraft',
  "source: 'ten-gods'",
  'Not connected to production analysis',
  'Pending external verification',
  'surface-hidden-stems-ten-gods',
  'production 계산 로직 변경 없음',
  '만세력 계산 로직 변경 없음',
  '기존 겉오행 분석 로직 변경 없음',
  '지장간 반영 오행 분석 변경 없음',
  '십성 분석 구현 없음',
  '십성 분석 production 연결 없음',
  'createSajuAnalysis 반환 구조 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
];
const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
const exaggeratedPhrase = '십성까지 완벽히 반영한 정밀 사주 분석';

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

const doc = fs.readFileSync(designDocPath, 'utf8');

for (const snippet of requiredSnippets) {
  const found = doc.includes(snippet);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

const phraseIndex = doc.indexOf(exaggeratedPhrase);
const avoidSectionIndex = doc.indexOf('현재 피해야 할 표현:');
const nonGoalsIndex = doc.indexOf('## Non-Goals for This PR');
const phraseInAvoidSection =
  phraseIndex >= 0 &&
  avoidSectionIndex >= 0 &&
  nonGoalsIndex >= 0 &&
  phraseIndex > avoidSectionIndex &&
  phraseIndex < nonGoalsIndex &&
  doc.indexOf(exaggeratedPhrase, phraseIndex + exaggeratedPhrase.length) === -1;
logResult('exaggerated_phrase_only_in_avoid_section', phraseInAvoidSection);
if (!phraseInAvoidSection) hasFailure = true;

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`doc_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

if (hasFailure) {
  console.error('Ten gods analysis design check failed');
  process.exit(1);
}

console.log('Ten gods analysis design check passed');
