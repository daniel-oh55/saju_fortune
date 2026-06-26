import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/GOOGLE_PLAY_SCREENSHOT_PRODUCTION_CHECKLIST.md';
const captionPlanPath = 'docs/GOOGLE_PLAY_SCREENSHOT_CAPTION_PLAN.md';
const screenshotReadinessPath = 'docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md';
const appMetadataPath = 'docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md';

const requiredPaths = [
  docPath,
  captionPlanPath,
  screenshotReadinessPath,
  appMetadataPath,
];

const requiredSections = [
  '# Google Play Screenshot Production Checklist',
  '## Purpose',
  '## Production Status',
  '## Required Screenshot Candidates',
  '## Caption Source',
  '## Visual Production Notes',
  '## Device and Capture Notes',
  '## Pending Items Before Actual Screenshot Production',
  '## Non-Goals for This PR',
  '## Related Docs',
];

const requiredDocSnippets = [
  '홈',
  '오늘운세',
  '2026운세',
  '띠별운세',
  '내정보',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  '실제 Google Play Console 입력: Pending',
  '실제 기기 QA: Pending',
  'release build: Pending',
  'signing 설정: Pending',
  'AAB 생성: Pending',
  '실제 스토어 스크린샷 이미지 제작 없음',
  '실제 Google Play Console 입력 없음',
  'UI/디자인 변경 없음',
  'Android native code 변경 없음',
  'AndroidManifest.xml 변경 없음',
  'Android resource 파일 변경 없음',
  '오늘의 운세를 차분히 살펴보세요',
  '고요한 밤의 운세 다이어리',
];

const relatedDocSnippet = 'Google Play screenshot production checklist: docs/GOOGLE_PLAY_SCREENSHOT_PRODUCTION_CHECKLIST.md';
const relatedDocPaths = [captionPlanPath, screenshotReadinessPath, appMetadataPath];

const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const productionFiles = [
  'src/App.jsx',
  'src/pages',
  'src/components',
  'src/domain/saju/elementAnalyzer.js',
  'src/domain/saju/createSajuAnalysis.js',
  'src/domain/saju/manseryeokEngine.js',
  'src/domain/saju/hiddenStemElementAnalysisDraft.ts',
  'src/domain/saju/tenGodAnalysisDraft.ts',
  'src/domain/fortune/yearFortuneEngine.js',
  'src/domain/fortune/zodiacFortuneEngine.js',
  'src/utils/fortuneEngine.js',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
  'android/app/build.gradle',
  'android/build.gradle',
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
  logResult(`${labelFromSnippet(path)}_includes_screenshot_production_related_doc`, found);
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
logResult('production_ui_android_native_files_unchanged_in_working_diff', productionFilesUnchanged);
if (!productionFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Google Play screenshot production checklist check failed');
  process.exit(1);
}

console.log('Google Play screenshot production checklist check passed');
