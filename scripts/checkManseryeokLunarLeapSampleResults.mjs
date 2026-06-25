import fs from 'node:fs';

const docPath = 'docs/MANSERYEOK_LUNAR_LEAP_SAMPLE_RESULTS.md';
const requiredSnippets = [
  '# Manseryeok Lunar and Leap Month Sample Results',
  'LUNAR-001',
  'LEAP-001',
  'Current app year pillar',
  'Current app month pillar',
  'Current app day pillar',
  'Current app hour pillar',
  'Expected external year pillar',
  'Expected external month pillar',
  'Expected external day pillar',
  'Expected external hour pillar',
  '| LUNAR-001 | 음력 기본 샘플 | lunar | 1990-01-15 | 09:30 | 경오 | 무인 | 병오 | 계사 | Pending | Pending | Pending | Pending | Pending | External source not recorded yet |',
  '| LEAP-001 | 윤달 샘플 | lunar leap | 1995-08-15 | 09:30 | 을해 | 병술 | 계유 | 정사 | Pending | Pending | Pending | Pending | Pending | External source not recorded yet |',
  'Match status는 Pending',
  '음력/윤달 샘플 외부 검증',
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
  console.error('Manseryeok lunar/leap sample results check failed');
  process.exit(1);
}

console.log('Manseryeok lunar/leap sample results check passed');
