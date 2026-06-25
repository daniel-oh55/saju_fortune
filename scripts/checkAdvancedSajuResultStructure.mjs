import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ADVANCED_SAJU_RESULT_STRUCTURE.md';
const roadmapPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';
const tenGodsCopyPath = 'docs/TEN_GODS_COPY_GUIDELINES.md';
const hiddenStemsQaPath = 'docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_QA.md';
const tenGodsQaPath = 'docs/TEN_GODS_ANALYSIS_QA.md';
const requiredPaths = [docPath, roadmapPath, tenGodsCopyPath, hiddenStemsQaPath, tenGodsQaPath];

const requiredSections = [
  '# Advanced Saju Result Structure',
  '## Purpose',
  '## Current Status',
  '## Design Goals',
  '## Proposed Result Structure',
  '## Analysis Layer Policy',
  '## Compatibility Policy',
  '## Release Scope Policy',
  '## Product Copy Policy',
  '## Non-Goals for This PR',
  '## Related Docs',
];

const requiredDocSnippets = [
  'AdvancedSajuResultDraft',
  "source: 'advanced-saju-draft'",
  "releaseScope: 'not-connected-to-production'",
  "hiddenStemDataVerification: 'Pending'",
  "tenGodsDataVerification: 'Pending'",
  "hiddenStemTenGodsCalculation: 'Pending'",
  'productionResultShapeChanged: false',
  'schemaVersionChanged: false',
  'existingLocalStorageKeysChanged: false',
  '지장간 반영 production 오행 분석',
  '십성 분석 production 연결',
  '태양시 보정',
  '현재 release scope',
  '향후 정교한 분석 단계',
  'production 계산 로직 변경 없음',
  '만세력 계산 로직 변경 없음',
  '기존 겉오행 분석 로직 변경 없음',
  '지장간 반영 오행 분석 production 연결 없음',
  '십성 분석 production 연결 없음',
  '지장간 십성 산출 없음',
  '태양시 보정 적용 없음',
  'createSajuAnalysis 반환 구조 변경 없음',
  'production result shape 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
];

const roadmapSnippets = [
  'Advanced saju result structure: docs/ADVANCED_SAJU_RESULT_STRUCTURE.md',
  'Surface/hidden-stem/ten-gods integrated result structure: Pending',
  'production result shape change: Pending',
  'production integration plan: Pending',
  'external verification: Pending',
];

const exaggeratedPhrases = [
  '지장간과 십성까지 완벽히 반영한 정밀 사주 분석',
  '전문 사주가 수준의 사주 풀이',
  '정확한 미래 예측',
  '반드시 맞는 사주 풀이',
];

const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
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
const roadmap = fs.readFileSync(roadmapPath, 'utf8');
const avoidedSection = sectionText(doc, '현재 피해야 하는 표현:');
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

for (const snippet of roadmapSnippets) {
  const found = roadmap.includes(snippet);
  logResult(`roadmap_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const phrase of exaggeratedPhrases) {
  const inAvoided = avoidedSection.includes(phrase);
  const outsideAvoided = outsideAvoidedSection.includes(phrase);
  logResult(`exaggerated_phrase_in_avoided_${labelFromSnippet(phrase)}`, inAvoided);
  logResult(`exaggerated_phrase_only_in_avoided_${labelFromSnippet(phrase)}`, !outsideAvoided);
  if (!inAvoided || outsideAvoided) hasFailure = true;
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
logResult('production_and_ui_files_unchanged_in_working_diff', productionFilesUnchanged);
if (!productionFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Advanced saju result structure check failed');
  process.exit(1);
}

console.log('Advanced saju result structure check passed');
