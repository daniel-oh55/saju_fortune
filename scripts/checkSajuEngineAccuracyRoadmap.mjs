import fs from 'node:fs';

const docPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';

const requiredSnippets = [
  '# Saju Engine Accuracy Roadmap',
  '## Android Release AAB Enforced Rerun Result',
  '## Current Limitations',
  '## Product Copy Guidance',
  '## Accuracy Roadmap',
  '### Phase 2. External Manseryeok Sample Verification',
  '### Phase 3. Hidden Stems / 지장간',
  '### Phase 4. Ten Gods / 십성',
  '### Phase 5. Annual Flow / 세운',
  '### Phase 6. Major Luck Cycle / 대운',
  '## Non-Goals for This PR',
  'Android Release AAB enforced rerun result: Failed',
  'Run number: 5',
  'Run id: 28309520915',
  'Failed step: Validate release signing secrets',
  'release signing secrets validation: Failed',
  'signed AAB regeneration: Failed',
  'signed AAB re-verification: Pending',
  'Play Console internal test upload: Pending',
  'real device QA: Pending',
  'Secret actual values: Not recorded',
  'artifact repository commit: Not added',
  'production 계산 로직',
  '사주/운세 결과 생성 로직',
  'UI/디자인',
];

const forbiddenSnippets = [
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'Play Console internal test upload | Confirmed',
  'real device QA | Confirmed',
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
