import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ADVANCED_SAJU_ENGINE_RELEASE_SCOPE.md';
const resultStructurePath = 'docs/ADVANCED_SAJU_RESULT_STRUCTURE.md';
const solarPolicyPath = 'docs/SOLAR_TIME_CORRECTION_POLICY.md';
const roadmapPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';
const tenGodsCopyPath = 'docs/TEN_GODS_COPY_GUIDELINES.md';

const requiredPaths = [
  docPath,
  resultStructurePath,
  solarPolicyPath,
  roadmapPath,
  tenGodsCopyPath,
];

const requiredSections = [
  '# Advanced Saju Engine Release Scope',
  '## Purpose',
  '## Current Release Scope',
  '## Not Included in Current Release Scope',
  '## Advanced Engine Preparation Status',
  '## Product Claim Policy',
  '## Release Readiness Impact',
  '## Future Expansion Candidates',
  '## Non-Goals for This PR',
  '## Related Docs',
  '## Suggested Follow-up PRs',
];

const requiredDocSnippets = [
  '현재 release scope에서는 미적용',
  '태양시 보정 적용 여부: 현재 release scope에서는 미적용',
  '지장간 데이터 외부 기준 검증: Pending',
  '십성 데이터 외부 기준 검증: Pending',
  '지장간 반영 오행 분석 production 연결: Pending',
  '십성 분석 production 연결: Pending',
  '외부 만세력 기준 샘플 검증: Pending',
  '실제 기기 QA: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  '개인정보 처리방침 URL 확정 전까지 Pending 유지',
  '문의처 확정 전까지 Pending 유지',
  'Google Play 데이터 보안 양식 입력 전까지 Pending 유지',
  '실제 스토어 스크린샷 이미지 제작 전까지 Pending 유지',
  'production 계산 로직 변경 없음',
  '만세력 계산 로직 변경 없음',
  '기존 겉오행 분석 로직 변경 없음',
  '지장간 반영 오행 분석 production 연결 없음',
  '십성 분석 production 연결 없음',
  '태양시 보정 적용 없음',
  'createSajuAnalysis 반환 구조 변경 없음',
  'production result shape 변경 없음',
  'schemaVersion 변경 없음',
  '기존 localStorage key 변경 없음',
  'localStorage key 추가 없음',
  'AndroidManifest.xml 변경 없음',
  'Android resource 파일 변경 없음',
  'Gradle 설정 변경 없음',
  'keystore 파일 추가 없음',
  'signing password 기록 없음',
  'Advanced saju result structure: docs/ADVANCED_SAJU_RESULT_STRUCTURE.md',
];

const roadmapSnippets = [
  '고급 사주 엔진 release scope 문서: docs/ADVANCED_SAJU_ENGINE_RELEASE_SCOPE.md 참고',
  '현재 release scope: 기본 만세력 산출 + 기존 겉오행 중심 분석 + 기존 운세 결과 생성 로직',
  '지장간/십성 production 연결: Pending',
  '태양시 보정 적용 여부: 현재 release scope에서는 미적용',
  '외부 기준 검증: Pending',
];

const resultStructureSnippets = [
  'Advanced saju engine release scope: docs/ADVANCED_SAJU_ENGINE_RELEASE_SCOPE.md',
];

const exaggeratedPhrases = [
  '지장간과 십성까지 완벽히 반영한 정밀 사주 분석',
  '태양시까지 정확히 보정한 사주풀이',
  '출생지 경도까지 반영한 전문 분석',
  '전문 사주가 수준의 사주풀이',
  '외부 만세력 기준 검증 완료',
  '정확한 미래 예측',
  '반드시 맞는 사주풀이',
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
const roadmap = fs.readFileSync(roadmapPath, 'utf8');
const resultStructure = fs.readFileSync(resultStructurePath, 'utf8');
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

for (const snippet of resultStructureSnippets) {
  const found = resultStructure.includes(snippet);
  logResult(`result_structure_includes_${labelFromSnippet(snippet)}`, found);
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
  console.error('Advanced saju engine release scope check failed');
  process.exit(1);
}

console.log('Advanced saju engine release scope check passed');
