import fs from 'node:fs';

const docPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';

const requiredSnippets = [
  '# Saju Engine Accuracy Roadmap',
  '## Current Limitations',
  '## Product Copy Guidance',
  '## Accuracy Roadmap',
  '### Phase 2. External Manseryeok Sample Verification',
  '### Phase 3. Hidden Stems / 지장간',
  '### Phase 4. Ten Gods / 십성',
  '### Phase 5. Annual Flow / 세운',
  '### Phase 6. Major Luck Cycle / 대운',
  '## Non-Goals for This PR',
  'release signing enforcement fix: Added',
  'signing enforcement fix: Added',
  'release signing secrets validation: Added',
  'workflow jarsigner verification step: Added',
  'Gradle release signing env enforcement: Added',
  'signed AAB 재생성: Pending',
  'signed AAB 재검증: Pending',
  'Play Console internal test upload: Pending',
  'real device QA: Pending',
  'signing enforcement fix Added는 signed AAB 재검증 완료가 아니다.',
  'production 계산 로직 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
];

const forbiddenSnippets = ['서양식 보정 적용 여부', '양력/음력 샘플 추가 검증'];

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
logResult('saju_engine_accuracy_roadmap_doc_exists', exists, docPath);

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
  console.error('Saju engine accuracy roadmap check failed');
  process.exit(1);
}

console.log('Saju engine accuracy roadmap check passed');
