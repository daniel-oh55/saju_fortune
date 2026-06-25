import fs from 'node:fs';

const docPath = 'docs/SOLAR_TIME_CORRECTION_POLICY.md';
const requiredSnippets = [
  '# Solar Time Correction Policy',
  '태양시 보정 적용 여부',
  '현재 release scope에서는 미적용',
  'production 계산 로직 변경 없음',
  '만세력 계산 로직 변경 없음',
  '태양시 보정 계산 로직 추가 없음',
  '출생지 입력 UI 추가 없음',
  '출생지 저장 구조 추가 없음',
  'localStorage key 추가 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  '## Related Verification Docs',
  '## Future Implementation Requirements',
];
const forbiddenSnippets = [
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
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
  console.error('Solar time correction policy check failed');
  process.exit(1);
}

console.log('Solar time correction policy check passed');
