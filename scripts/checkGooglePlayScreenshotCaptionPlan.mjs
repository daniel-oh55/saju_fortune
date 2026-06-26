import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/GOOGLE_PLAY_SCREENSHOT_CAPTION_PLAN.md';
const descriptionDraftPath = 'docs/GOOGLE_PLAY_DESCRIPTION_DRAFT.md';
const claimSafetyPath = 'docs/GOOGLE_PLAY_LISTING_CLAIM_SAFETY.md';
const screenshotReadinessPath = 'docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md';
const requiredPaths = [
  docPath,
  descriptionDraftPath,
  claimSafetyPath,
  screenshotReadinessPath,
];

const requiredSections = [
  '# Google Play Screenshot Caption Plan',
  '## Purpose',
  '## Screenshot Production Status',
  '## Candidate Screens',
  '## Caption Drafts',
  '## Allowed Caption Style',
  '## Avoided Caption Style',
  '## Visual Direction Notes',
  '## Pending Items for Store Readiness',
  '## Non-Goals for This PR',
  '## Related Docs',
  '## Suggested Follow-up PRs',
];

const requiredDocSnippets = [
  '하루풀이',
  'Google Play 스크린샷 캡션 계획: Draft',
  '홈',
  '오늘운세',
  '2026운세',
  '띠별운세',
  '내정보',
  '오늘의 운세를 차분히 살펴보세요',
  '하루의 흐름을 가볍게 확인해보세요',
  '2026년의 큰 흐름을 미리 참고해보세요',
  '띠별운세를 간단하게 확인해보세요',
  '내 정보를 기준으로 운세 흐름을 준비해보세요',
  '참고용 운세 콘텐츠를 차분하게 확인해보세요',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  '실제 Google Play Console 입력: Pending',
  '실제 기기 QA: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  'release build: Pending',
  'signing 설정: Pending',
  'AAB 생성: Pending',
  '실제 스토어 스크린샷 이미지 제작 없음',
  '실제 Google Play Console 입력 없음',
  'production 계산 로직 변경 없음',
  'UI/디자인 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
  '콘셉트: 고요한 밤의 운세 다이어리',
];

const relatedDocSnippet = 'Google Play screenshot caption plan: docs/GOOGLE_PLAY_SCREENSHOT_CAPTION_PLAN.md';
const relatedDocPaths = [descriptionDraftPath, claimSafetyPath, screenshotReadinessPath];

const exaggeratedPhrases = [
  '정확히 맞는 오늘운세',
  '미래를 예측하는 사주 앱',
  '전문 사주가 수준의 정밀 분석',
  '지장간과 십성까지 완벽히 반영한 사주풀이',
  '태양시까지 정확히 보정한 결과',
  '대운, 세운, 합신까지 모두 반영',
  '연애운이 반드시 오르는 운세',
  '직장운이 무조건 좋아지는 운세',
];

const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '실제 Google Play Console 입력 완료',
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
const avoidedSection = sectionText(doc, '## Avoided Caption Style');
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

for (const path of relatedDocPaths) {
  const relatedDoc = fs.readFileSync(path, 'utf8');
  const found = relatedDoc.includes(relatedDocSnippet);
  logResult(`${labelFromSnippet(path)}_includes_caption_plan_related_doc`, found);
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
  console.error('Google Play screenshot caption plan check failed');
  process.exit(1);
}

console.log('Google Play screenshot caption plan check passed');
