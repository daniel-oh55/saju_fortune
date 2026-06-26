import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT_CHECKLIST.md';
const appMetadataPath = 'docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md';
const dataSafetyReadinessPath = 'docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md';
const privacyUrlPath = 'docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md';

const requiredPaths = [
  docPath,
  appMetadataPath,
  dataSafetyReadinessPath,
  privacyUrlPath,
];

const requiredSections = [
  '# Google Play Data Safety Draft Checklist',
  '## Purpose',
  '## Draft Status',
  '## Current App Data Architecture',
  '## Data Safety Review Items',
  '## localStorage Data Notes',
  '## Pending Items Before Actual Console Input',
  '## Non-Goals for This PR',
  '## Related Docs',
  '## Suggested Follow-up PRs',
];

const requiredDocSnippets = [
  '하루풀이',
  'Google Play 데이터 보안 양식 초안 체크리스트: Draft',
  '서버 DB 없음',
  '로그인 없음',
  '실제 광고 SDK 없음',
  '실제 결제 SDK 없음',
  '외부 분석 SDK 없음',
  '외부 서버로 사용자 입력값 전송 없음',
  'localStorage 중심 사용자 입력 저장 구조',
  '실제 Google Play 데이터 보안 양식 입력: Pending',
  '실제 Google Play Console 입력: Pending',
  '개인정보 처리방침 URL 확정: Pending',
  '문의처 확정: Pending',
  'localStorage key 최종 점검: Pending',
  'release build: Pending',
  'signing 설정: Pending',
  'AAB 생성: Pending',
  '실제 Google Play 데이터 보안 양식 입력 없음',
  '실제 Google Play Console 입력 없음',
  '개인정보 처리방침 URL 확정 없음',
  '문의처 확정 없음',
  'localStorage key 변경 없음',
  'schemaVersion 변경 없음',
  'production 계산 로직 변경 없음',
  'UI/디자인 변경 없음',
];

const relatedDocSnippet = 'Google Play data safety draft checklist: docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT_CHECKLIST.md';
const relatedDocPaths = [appMetadataPath, dataSafetyReadinessPath];

const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const productionFiles = [
  'src/domain/saju/elementAnalyzer.js',
  'src/domain/saju/createSajuAnalysis.js',
  'src/domain/saju/manseryeokEngine.js',
  'src/domain/saju/hiddenStemElementAnalysisDraft.ts',
  'src/domain/saju/tenGodAnalysisDraft.ts',
  'src/domain/fortune/yearFortuneEngine.js',
  'src/domain/fortune/zodiacFortuneEngine.js',
  'src/utils/fortuneEngine.js',
  'src/pages/ZodiacFortunePage.jsx',
  'android/app/src/main/AndroidManifest.xml',
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

const doc = fs.readFileSync(docPath, 'utf8');

for (const section of requiredSections) {
  const found = doc.includes(section);
  logResult(`doc_includes_${labelFromSnippet(section)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredDocSnippets) {
  const found = doc.includes(snippet);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const path of relatedDocPaths) {
  const relatedDoc = fs.readFileSync(path, 'utf8');
  const found = relatedDoc.includes(relatedDocSnippet);
  logResult(`${labelFromSnippet(path)}_includes_data_safety_draft_related_doc`, found);
  if (!found) hasFailure = true;
}

for (const snippet of wrongPhrases) {
  const absent = !doc.includes(snippet);
  logResult(`wrong_phrase_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`doc_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${productionFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const productionFilesUnchanged = diffOutput.length === 0;
logResult('production_ui_android_files_unchanged_in_working_diff', productionFilesUnchanged);
if (!productionFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Google Play data safety draft checklist check failed');
  process.exit(1);
}

console.log('Google Play data safety draft checklist check passed');
