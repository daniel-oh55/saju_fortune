import fs from 'node:fs';

const docPath = 'docs/MANSERYEOK_LATE_NIGHT_JASI_SAMPLE_RESULTS.md';
const requiredSnippets = [
  '# Manseryeok Late-Night Jasi Sample Results',
  'JASI-001',
  'JASI-002',
  'same_day',
  'next_day',
  'Current app year pillar',
  'Current app month pillar',
  'Current app day pillar',
  'Current app hour pillar',
  'Expected external year pillar',
  'Expected external month pillar',
  'Expected external day pillar',
  'Expected external hour pillar',
  '| JASI-001 | 23시 이후 자시 기준 샘플 | solar | 1990-06-15 | 23:30 | same_day | 경오 | 임오 | 신해 | 경자 | Pending | Pending | Pending | Pending | Pending | External source not recorded yet |',
  '| JASI-002 | 23시 이후 자시 기준 샘플 | solar | 1990-06-15 | 23:30 | next_day | 경오 | 임오 | 임자 | 경자 | Pending | Pending | Pending | Pending | Pending | External source not recorded yet |',
  'Match status는 Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
  'External source not recorded yet',
  'docs/MANSERYEOK_CURRENT_SAMPLE_SNAPSHOT.md',
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

const exists = fs.existsSync(docPath);
logResult(`${docPath}_exists`, exists);
if (!exists) {
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');

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

if (hasFailure) {
  console.error('Manseryeok late-night jasi sample results check failed');
  process.exit(1);
}

console.log('Manseryeok late-night jasi sample results check passed');
