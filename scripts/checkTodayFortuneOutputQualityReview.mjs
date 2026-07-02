import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/TODAY_FORTUNE_OUTPUT_QUALITY_REVIEW.md';
const afterPath = 'docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json';
const comparisonPath = 'docs/generated/today-fortune-snapshot-comparison-result.json';
const relatedDocs = [
  'docs/TODAY_FORTUNE_AFTER_SNAPSHOT_COMPARISON.md',
  'docs/TODAY_FORTUNE_FIRST_PRODUCTION_SCOPE.md',
  'docs/TODAY_FORTUNE_ENGINE_IMPLEMENTATION_PLAN.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];
const sampleIds = [
  'solar-known-time-01',
  'solar-unknown-time-01',
  'solar-late-night-same-day-01',
  'solar-late-night-next-day-01',
  'lunar-non-leap-01',
  'lunar-leap-01',
  'term-boundary-01',
  'profile-zodiac-boundary-01',
];
const requiredCategoryIds = ['overall', 'money', 'love', 'work', 'study', 'health'];
const categoryFocusPhrases = [
  '하루 전체의 균형',
  '지출과 조건 확인',
  '관계의 온도와 대화',
  '업무 정리와 신뢰',
  '집중과 복습 리듬',
  '컨디션 회복과 리듬',
];
const requiredDocSnippets = [
  '# Today Fortune Output Quality Review',
  'This document does not approve final engine accuracy.',
  'Output quality review after implementation | Reviewed',
  'Engine accuracy approval | Pending',
  'External reference comparison | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'schemaVersion | Reviewed | today fortune after snapshot uses schemaVersion 6',
  'sample count | Reviewed | 8 samples',
  'required category IDs | Reviewed | overall, money, love, work, study, health',
  'Today fortune output changed | Confirmed',
  'Category-specific summary clarity | Reviewed',
  'Reason/advice/caution structure | Reviewed',
  'Health safety wording | Reviewed',
  'This PR does not change production logic.',
  'After snapshot JSON is not regenerated.',
  'Comparison result JSON is not regenerated.',
];
const requiredRelatedDocSnippets = [
  'Output quality review after implementation: Reviewed',
  'Engine accuracy approval: Pending',
  'External reference comparison: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
  'Production today fortune engine improvement: Implemented in first scope',
  'After snapshot generation: Generated',
  'Snapshot comparison after implementation: Generated',
];
const forbiddenSnippets = [
  'Engine accuracy approval | Confirmed',
  'Engine accuracy approval: Confirmed',
  'External reference comparison | Confirmed',
  'External reference comparison: Confirmed',
  '음력/윤달 샘플 외부 검증: Confirmed',
  '태양시 보정 적용 여부: Confirmed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];
const protectedFiles = [
  'docs/generated/fortune-engine-sample-snapshot.json',
  afterPath,
  comparisonPath,
  'public/privacy-policy.html',
  'android/app/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
];

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

function labelFromSnippet(snippet) {
  return snippet
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^\p{L}\p{N}_/-]/gu, '')
    .slice(0, 90);
}

function sameArray(left, right) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function checkIncludes(sourceLabel, source, snippets) {
  let passedAll = true;

  for (const snippet of snippets) {
    const found = source.includes(snippet);
    logResult(`${sourceLabel}_includes_${labelFromSnippet(snippet)}`, found);
    if (!found) passedAll = false;
  }

  return passedAll;
}

let hasFailure = false;

for (const path of [docPath, afterPath, comparisonPath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');
const after = JSON.parse(fs.readFileSync(afterPath, 'utf8'));
const comparison = JSON.parse(fs.readFileSync(comparisonPath, 'utf8'));
const docsToScan = [{ path: docPath, source: doc }];

if (!checkIncludes('quality_review_doc', doc, [...requiredDocSnippets, ...sampleIds, ...requiredCategoryIds])) {
  hasFailure = true;
}

for (const phrase of categoryFocusPhrases) {
  const found = doc.includes(phrase);
  logResult(`quality_review_doc_includes_focus_${labelFromSnippet(phrase)}`, found);
  if (!found) hasFailure = true;
}

const sampleCountValid = after.samples?.length === 8;
logResult('after_snapshot_sample_count_is_8', sampleCountValid);
if (!sampleCountValid) hasFailure = true;

for (const sample of after.samples || []) {
  const today = sample.todayFortuneSummary;
  const schemaVersionValid = today?.schemaVersion === 6;
  const categoryIdsValid = sameArray(today?.categoryIds || [], requiredCategoryIds);
  const monetizationPresent = Boolean(today?.monetization);
  const aiConsultDisabled = today?.aiConsult?.enabled === false;
  const summaryText = Object.values(today?.categorySummaries || {}).join(' ');
  const focusPhrasePresent = categoryFocusPhrases.some((phrase) => summaryText.includes(phrase));

  logResult(`${sample.sampleId}_schemaVersion_is_6`, schemaVersionValid);
  logResult(`${sample.sampleId}_required_category_ids_preserved`, categoryIdsValid);
  logResult(`${sample.sampleId}_monetization_present`, monetizationPresent);
  logResult(`${sample.sampleId}_aiConsult_disabled`, aiConsultDisabled);
  logResult(`${sample.sampleId}_category_focus_phrase_present`, focusPhrasePresent);

  if (
    !schemaVersionValid ||
    !categoryIdsValid ||
    !monetizationPresent ||
    !aiConsultDisabled ||
    !focusPhrasePresent
  ) {
    hasFailure = true;
  }
}

const comparisonValid =
  comparison.comparisonVersion === 'today_fortune_snapshot_comparison_v1' &&
  comparison.sampleCount === 8 &&
  comparison.sampleIdsPreserved === true &&
  comparison.requiredCategoryIdsPreserved === true &&
  comparison.manseryeokUnchanged === true &&
  comparison.yearFortuneUnchanged === true &&
  comparison.zodiacFortuneUnchanged === true &&
  comparison.todayFortuneChanged === true &&
  comparison.engineAccuracyApproval === 'Pending';

logResult('comparison_result_valid', comparisonValid);
if (!comparisonValid) hasFailure = true;

for (const path of relatedDocs) {
  const source = fs.readFileSync(path, 'utf8');
  docsToScan.push({ path, source });
  if (!checkIncludes(labelFromSnippet(path), source, requiredRelatedDocSnippets)) hasFailure = true;
}

for (const snippet of forbiddenSnippets) {
  for (const { path, source } of docsToScan) {
    const absent = !source.includes(snippet);
    logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

const packageJson = fs.readFileSync('package.json', 'utf8');
const scriptRegistered = packageJson.includes(
  '"check:today-fortune-output-quality-review": "node scripts/checkTodayFortuneOutputQualityReview.mjs"'
);
logResult('package_script_registered', scriptRegistered);
if (!scriptRegistered) hasFailure = true;

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('production_snapshot_privacy_and_android_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

const trackedFiles = execSync('git ls-files', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const statusFiles = execSync('git status --short --untracked-files=all', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''));
const artifactFiles = [...trackedFiles, ...statusFiles].filter((path) =>
  path.endsWith('.aab') || path.endsWith('.zip') || path.endsWith('.jks') || path.endsWith('.keystore')
);
const artifactFilesAbsent = artifactFiles.length === 0;
logResult('artifact_zip_and_keystore_files_not_added_to_repository', artifactFilesAbsent);
if (!artifactFilesAbsent) hasFailure = true;

if (hasFailure) {
  console.error('Today fortune output quality review check failed');
  process.exit(1);
}

console.log('Today fortune output quality review check passed');
