import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/PRIVACY_POLICY_CONTENT_DRAFT.md';
const localStorageInventoryPath = 'docs/LOCAL_STORAGE_DATA_INVENTORY.md';
const dataSafetyDraftPath = 'docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT_CHECKLIST.md';
const dataSafetyReadinessPath = 'docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md';
const privacyUrlInputReadinessPath = 'docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md';
const privacyUrlReadinessPath = 'docs/PRIVACY_POLICY_URL_READINESS.md';
const privacyDraftPath = 'docs/PRIVACY_POLICY_DRAFT.md';
const contactReadinessPath = 'docs/PRIVACY_POLICY_CONTACT_READINESS.md';

const requiredPaths = [
  docPath,
  localStorageInventoryPath,
  dataSafetyDraftPath,
  dataSafetyReadinessPath,
  privacyUrlInputReadinessPath,
  privacyUrlReadinessPath,
  privacyDraftPath,
  contactReadinessPath,
];

const requiredSections = [
  '# Privacy Policy Content Draft',
  '## Purpose',
  '## Draft Status',
  '## Current App Data Scope',
  '## Privacy Policy Draft Text',
  '## Google Play Data Safety Alignment',
  '## Pending Items',
  '## Non-Goals for This PR',
  '## Related Docs',
  '## Suggested Follow-up PRs',
];

const requiredDocSnippets = [
  '하루풀이',
  '개인정보처리방침 내용 초안: Draft',
  '개인정보처리방침 URL 확정: Pending',
  '문의처 확정: Pending',
  '실제 Google Play Console 입력: Pending',
  '실제 Google Play 데이터 보안 양식 입력: Pending',
  'localStorage key 최종 점검: Draft',
  '서버 DB 없음',
  '로그인 없음',
  '회원가입 없음',
  '실제 광고 SDK 없음',
  '실제 결제 SDK 없음',
  '외부 분석 SDK 없음',
  '외부 서버로 사용자 입력값 전송 없음',
  'localStorage 중심 사용자 입력 저장 구조',
  '생년월일',
  '출생시간',
  '성별',
  '이름 또는 별칭 계열 값',
  '오늘운세 결과 캐시',
  '저장한 풀이',
  '동의 설정',
  '방문 기록/연속 방문 정보',
  '알림 설정',
  '지역 선택 보조 정보',
  '홈 빠른 메뉴 설정',
  '# 하루풀이 개인정보처리방침 초안',
  '문의처: Pending',
  '적용일: Pending',
  '운세 콘텐츠를 참고용으로 제공하는 앱입니다',
  '사용자의 중요한 결정을 대신하지 않습니다',
  'docs/LOCAL_STORAGE_DATA_INVENTORY.md',
  'docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT_CHECKLIST.md',
];

const forbiddenDocSnippets = [
  '실제 개인정보처리방침 URL 확정 완료',
  '실제 문의처 확정 완료',
  '실제 Google Play Console 입력 완료',
  '실제 Google Play 데이터 보안 양식 입력 완료',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'Completed',
  'Pass',
  'Done',
];

const productionUiAndroidFiles = [
  'src/App.jsx',
  'src/pages',
  'src/components',
  'src/domain/saju/elementAnalyzer.js',
  'src/domain/saju/createSajuAnalysis.js',
  'src/domain/saju/manseryeokEngine.js',
  'src/domain/fortune/yearFortuneEngine.js',
  'src/domain/fortune/zodiacFortuneEngine.js',
  'src/utils/fortuneEngine.js',
  'src/utils/storage.js',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
  'android/app/build.gradle',
  'android/build.gradle',
  'public/privacy/index.html',
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

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`doc_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${productionUiAndroidFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const productionUiAndroidFilesUnchanged = diffOutput.length === 0;
logResult('production_ui_android_public_privacy_files_unchanged_in_working_diff', productionUiAndroidFilesUnchanged);
if (!productionUiAndroidFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Privacy policy content draft check failed');
  process.exit(1);
}

console.log('Privacy policy content draft check passed');
