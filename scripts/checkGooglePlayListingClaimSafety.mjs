import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/GOOGLE_PLAY_LISTING_CLAIM_SAFETY.md';
const releaseScopePath = 'docs/ADVANCED_SAJU_ENGINE_RELEASE_SCOPE.md';
const tenGodsCopyPath = 'docs/TEN_GODS_COPY_GUIDELINES.md';
const solarPolicyPath = 'docs/SOLAR_TIME_CORRECTION_POLICY.md';
const requiredPaths = [docPath, releaseScopePath, tenGodsCopyPath, solarPolicyPath];

const requiredSections = [
  '# Google Play Listing Claim Safety',
  '## Purpose',
  '## Current App Capability',
  '## Allowed Listing Claims',
  '## Avoided Listing Claims',
  '## Store Listing Field Guidance',
  '## Pending Items for Store Readiness',
  '## Non-Goals for This PR',
  '## Related Docs',
  '## Suggested Follow-up PRs',
];

const requiredDocSnippets = [
  '하루풀이',
  '참고용 운세 콘텐츠',
  'localStorage 중심 사용자 입력 저장 구조',
  '서버 DB 없음',
  '로그인 없음',
  '실제 광고 SDK 없음',
  '실제 결제 SDK 없음',
  '외부 분석 SDK 없음',
  '태양시 보정은 현재 release scope에서 적용하지 않습니다.',
  '개인정보 처리방침 URL: Pending',
  '문의처: Pending',
  'Google Play 데이터 보안 양식: Pending',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  '실제 기기 QA: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  'release build: Pending',
  'signing 설정: Pending',
  'AAB 생성: Pending',
  '실제 Google Play Console 입력: Pending',
  'production 계산 로직 변경 없음',
  '실제 Google Play Console 입력 없음',
  '실제 스토어 스크린샷 이미지 제작 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
  'Advanced saju engine release scope: docs/ADVANCED_SAJU_ENGINE_RELEASE_SCOPE.md',
];

const releaseScopeSnippets = [
  'Google Play listing claim safety: docs/GOOGLE_PLAY_LISTING_CLAIM_SAFETY.md',
  '`docs: draft google play short and full description`',
];

const exaggeratedPhrases = [
  '정확한 미래를 예측하는 사주 앱',
  '반드시 맞는 오늘운세',
  '전문 사주가 수준의 정밀 사주풀이',
  '지장간과 십성까지 완벽히 반영한 정밀 사주 분석',
  '태양시까지 정확히 보정한 사주풀이',
  '출생지 경도까지 반영한 전문 분석',
  '대운, 세운, 합신까지 모두 반영',
  '외부 만세력 기준 검증 완료',
  '연애운이 반드시 오른다',
  '직장운이 무조건 좋아진다',
  '직장운을 정확히 예언한다',
];

const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
const wrongPhrases = [
  '서양식 보정 적용 여부',
  '실제 스토어 스크린샷 이미지 시작',
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

function sectionText(markdown, sectionTitle) {
  const start = markdown.indexOf(sectionTitle);
  if (start === -1) return '';

  const nextHeading = markdown.indexOf('\n## ', start + sectionTitle.length);
  if (nextHeading === -1) return markdown.slice(start);
  return markdown.slice(start, nextHeading);
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
const releaseScope = fs.readFileSync(releaseScopePath, 'utf8');
const avoidedSection = sectionText(doc, '## Avoided Listing Claims');
const outsideAvoidedSection = doc.replace(avoidedSection, '');

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

for (const snippet of releaseScopeSnippets) {
  const found = releaseScope.includes(snippet);
  logResult(`release_scope_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const phrase of exaggeratedPhrases) {
  const inAvoided = avoidedSection.includes(phrase);
  const outsideAvoided = outsideAvoidedSection.includes(phrase);
  logResult(`exaggerated_phrase_in_avoided_${labelFromSnippet(phrase)}`, inAvoided);
  logResult(`exaggerated_phrase_only_in_avoided_${labelFromSnippet(phrase)}`, !outsideAvoided);
  if (!inAvoided || outsideAvoided) hasFailure = true;
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
  console.error('Google Play listing claim safety check failed');
  process.exit(1);
}

console.log('Google Play listing claim safety check passed');
