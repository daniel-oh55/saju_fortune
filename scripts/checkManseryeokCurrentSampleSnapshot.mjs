import fs from 'node:fs';

const docPath = 'docs/MANSERYEOK_CURRENT_SAMPLE_SNAPSHOT.md';
const runScriptPath = 'scripts/runManseryeokCurrentSampleSnapshot.mjs';
const requiredSnippets = [
  '## Current App Snapshot Status',
  '## Sample Input Profiles',
  '## Snapshot Recording Format',
  '## Current App Result Table',
  'SOLAR-001',
  'SOLAR-TERM-001',
  'LUNAR-001',
  'LEAP-001',
  'JASI-001',
  'JASI-002',
  'UNKNOWN-TIME-001',
  'SOLAR-TIME-001',
  '태양시 보정 적용 여부: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  'External comparison result: Pending',
  'production 계산 로직 변경 없음',
  '만세력 계산 로직 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
];
const forbiddenSnippets = [
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'Completed',
  'Pass',
  'Done',
];
const requiredRunScriptSnippets = [
  "import { calculateManseryeok } from '../src/domain/saju/manseryeokEngine.js'",
  'calculateManseryeok(profile)',
  'JSON.stringify',
  'SOLAR-001',
  'SOLAR-TERM-001',
  'LUNAR-001',
  'LEAP-001',
  'JASI-001',
  'JASI-002',
  'UNKNOWN-TIME-001',
  'SOLAR-TIME-001',
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

for (const path of [docPath, runScriptPath]) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) {
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');
const runScript = fs.readFileSync(runScriptPath, 'utf8');

for (const snippet of requiredSnippets) {
  const found = doc.includes(snippet);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of forbiddenSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`doc_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const snippet of requiredRunScriptSnippets) {
  const found = runScript.includes(snippet);
  logResult(`run_script_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

if (hasFailure) {
  console.error('Manseryeok current sample snapshot check failed');
  process.exit(1);
}

console.log('Manseryeok current sample snapshot check passed');
