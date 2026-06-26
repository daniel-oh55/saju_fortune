import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md';
const descriptionDraftPath = 'docs/GOOGLE_PLAY_DESCRIPTION_DRAFT.md';
const claimSafetyPath = 'docs/GOOGLE_PLAY_LISTING_CLAIM_SAFETY.md';
const screenshotCaptionPlanPath = 'docs/GOOGLE_PLAY_SCREENSHOT_CAPTION_PLAN.md';
const dataSafetyPath = 'docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md';
const privacyUrlPath = 'docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md';

const requiredPaths = [
  docPath,
  descriptionDraftPath,
  claimSafetyPath,
  screenshotCaptionPlanPath,
  dataSafetyPath,
  privacyUrlPath,
];

const requiredSections = [
  '# Google Play App Metadata Checklist',
  '## Purpose',
  '## Metadata Readiness Status',
  '## App Identity Checklist',
  '## Store Listing Text Checklist',
  '## Contact and Policy Checklist',
  '## Visual Asset Checklist',
  '## Release Track Checklist',
  '## Current App Capability Notes',
  '## Non-Goals for This PR',
  '## Related Docs',
  '## Suggested Follow-up PRs',
];

const requiredDocSnippets = [
  '하루풀이',
  'Google Play 앱 메타데이터 체크리스트: Draft',
  '실제 Google Play Console 입력: Pending',
  '앱 이름 최종 확인: Pending',
  '앱 카테고리 최종 확인: Pending',
  '문의처 확정: Pending',
  '개인정보 처리방침 URL 확정: Pending',
  'Google Play 데이터 보안 양식 입력: Pending',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  '실제 기기 QA: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  'release build: Pending',
  'signing 설정: Pending',
  'AAB 생성: Pending',
  '서버 DB 없음',
  '로그인 없음',
  '실제 광고 SDK 없음',
  '실제 결제 SDK 없음',
  '외부 분석 SDK 없음',
  'localStorage 중심 사용자 입력 저장 구조',
  'Android Debug Build 성공과 release build/AAB/signing 완료는 구분한다',
  '실제 Google Play Console 입력 없음',
  '실제 개인정보 처리방침 URL 확정 없음',
  '실제 문의처 확정 없음',
  '실제 Google Play 데이터 보안 양식 입력 없음',
  '실제 스토어 스크린샷 이미지 제작 없음',
  '실제 기기 QA 없음',
  'release build 없음',
  'signing 설정 없음',
  'AAB 생성 없음',
  'production 계산 로직 변경 없음',
  'UI/디자인 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
];

const relatedDocSnippet = 'Google Play app metadata checklist: docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md';
const relatedDocPaths = [descriptionDraftPath, claimSafetyPath, screenshotCaptionPlanPath];

const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 제작 완료',
  '실제 Google Play Console 입력 완료',
  '개인정보 처리방침 URL 확정 완료',
  '문의처 확정 완료',
  'Google Play 데이터 보안 양식 입력 완료',
  '태양시 보정 적용 여부',
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
  logResult(`${labelFromSnippet(path)}_includes_app_metadata_related_doc`, found);
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
  console.error('Google Play app metadata checklist check failed');
  process.exit(1);
}

console.log('Google Play app metadata checklist check passed');
