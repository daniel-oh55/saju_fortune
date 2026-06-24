import fs from 'node:fs';

const docPath = 'docs/MANSERYEOK_EXTERNAL_SAMPLE_VERIFICATION.md';
const requiredSnippets = [
  '## Verification Status Summary',
  '## Sample Case Table',
  '## Result Recording Format',
  '## Verification Rules',
  '## Non-Goals for This PR',
  'SOLAR-001',
  'SOLAR-TERM-001',
  'LUNAR-001',
  'LEAP-001',
  'JASI-001',
  'JASI-002',
  'UNKNOWN-TIME-001',
  'SOLAR-TIME-001',
  '음력/윤달 샘플 외부 검증',
  '태양시 보정 적용 여부',
  '외부 만세력 기준 샘플 검증: Pending',
  'production 계산 로직 변경 없음',
  '만세력 계산 로직 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
];
const forbiddenSnippets = ['서양식 보정 적용 여부', '양력/음력 샘플 추가 검증'];
const forbiddenStatusSnippets = ['Completed', 'Pass', 'Done'];

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
logResult('manseryeok_external_sample_verification_doc_exists', exists, docPath);

if (!exists) {
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');
const statusAndTableSection = doc.slice(
  doc.indexOf('## Verification Status Summary'),
  doc.indexOf('## Result Recording Format'),
);

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

for (const snippet of forbiddenStatusSnippets) {
  const absent = !statusAndTableSection.includes(snippet);
  logResult(`status_and_table_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

if (hasFailure) {
  console.error('Manseryeok external sample verification check failed');
  process.exit(1);
}

console.log('Manseryeok external sample verification check passed');
