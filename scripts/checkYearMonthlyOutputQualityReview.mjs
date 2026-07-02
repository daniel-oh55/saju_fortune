import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/YEAR_MONTHLY_OUTPUT_QUALITY_REVIEW.md';
const afterPath = 'docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json';
const comparisonPath = 'docs/generated/year-monthly-fortune-snapshot-comparison-result.json';
const relatedDocs = [
  'docs/YEAR_MONTHLY_AFTER_SNAPSHOT_COMPARISON.md',
  'docs/YEAR_MONTHLY_FIRST_PRODUCTION_SCOPE.md',
  'docs/YEAR_MONTHLY_FORTUNE_IMPLEMENTATION_PLAN.md',
  'docs/YEAR_MONTHLY_SNAPSHOT_COMPARISON_CHECK_DESIGN.md',
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
const requiredYearCategoryIds = ['money', 'love', 'work', 'health'];
const requiredMonthFocusLabels = [
  '정리와 계획',
  '관계 조율',
  '실행 리듬',
  '휴식과 회복',
  '기회 탐색',
  '집중 마무리',
  '균형 점검',
  '성장과 배움',
  '재정 점검',
  '대화와 신뢰',
  '정돈과 선택',
  '회고와 충전',
];
const requiredDocSnippets = [
  '# Year Monthly Output Quality Review',
  'This document does not approve final engine accuracy.',
  'Year/monthly output quality review | Reviewed',
  'Engine accuracy approval | Pending',
  'External reference comparison | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'sample count | Reviewed | 8 samples',
  'monthly entries count | Reviewed | 12 monthly entries',
  'targetYear | Reviewed | 2026',
  'Year/monthly fortune output changed | Confirmed',
  'Monthly entries count preserved | Confirmed',
  'Target year preserved | Confirmed',
  'Annual narrative relevance | Reviewed',
  'Monthly focus label clarity | Reviewed',
  'Monthly score rationale | Reviewed',
  'Reason/advice/caution structure | Reviewed',
  'Fear-based wording risk | Reviewed',
  'Output shape safety | Reviewed',
  'This PR does not change production logic.',
  'Year/monthly after snapshot JSON is not regenerated.',
  'Year/monthly comparison result JSON is not regenerated.',
];
const requiredRelatedDocSnippets = [
  'Year/monthly output quality review: Reviewed',
  'Engine accuracy approval: Pending',
  'External reference comparison: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
  'Year/monthly fortune engine improvement: Implemented in first scope',
  'Year/monthly after snapshot generation: Generated',
  'Snapshot comparison for year/monthly improvement: Generated',
  'Today fortune first production improvement: Reviewed',
  'Zodiac fortune engine improvement: Pending',
];
const forbiddenSnippets = [
  'Engine accuracy approval | Confirmed',
  'Engine accuracy approval: Confirmed',
  'External reference comparison | Confirmed',
  'External reference comparison: Confirmed',
  '음력/윤달 샘플 외부 검증: Confirmed',
  '태양시 보정 적용 여부: Confirmed',
  'Zodiac fortune engine improvement: Confirmed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];
const protectedFiles = [
  'src',
  'docs/generated/fortune-engine-sample-snapshot.json',
  'docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json',
  'docs/generated/today-fortune-snapshot-comparison-result.json',
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

function pathIsProtected(path) {
  return protectedFiles.some((protectedFile) => path === protectedFile || path.startsWith(`${protectedFile}/`));
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

if (!checkIncludes('quality_review_doc', doc, [...requiredDocSnippets, ...sampleIds, ...requiredMonthFocusLabels])) {
  hasFailure = true;
}

const sampleCountValid = after.samples?.length === 8;
logResult('after_snapshot_sample_count_is_8', sampleCountValid);
if (!sampleCountValid) hasFailure = true;

for (const sample of after.samples || []) {
  const yearFortune = sample.yearFortuneSummary;
  const targetYearValid = yearFortune?.targetYear === 2026;
  const monthsCountValid = yearFortune?.monthsCount === 12;
  const categoryIdsValid = sameArray(yearFortune?.categoryIds || [], requiredYearCategoryIds);
  const monthNotesText = Object.values(yearFortune?.monthNotes || {}).join(' ');
  const allFocusLabelsPresent = requiredMonthFocusLabels.every((label) => monthNotesText.includes(label));

  logResult(`${sample.sampleId}_target_year_is_2026`, targetYearValid);
  logResult(`${sample.sampleId}_months_count_is_12`, monthsCountValid);
  logResult(`${sample.sampleId}_year_category_ids_preserved`, categoryIdsValid);
  logResult(`${sample.sampleId}_month_focus_labels_present`, allFocusLabelsPresent);

  if (!targetYearValid || !monthsCountValid || !categoryIdsValid || !allFocusLabelsPresent) {
    hasFailure = true;
  }
}

const comparisonValid =
  comparison.comparisonVersion === 'year_monthly_fortune_snapshot_comparison_v1' &&
  comparison.sampleCount === 8 &&
  comparison.sampleIdsPreserved === true &&
  comparison.todayFortuneUnchanged === true &&
  comparison.manseryeokUnchanged === true &&
  comparison.sajuAnalysisUnchanged === true &&
  comparison.zodiacFortuneUnchanged === true &&
  comparison.yearMonthlyFortuneChanged === true &&
  comparison.monthlyEntriesCountPreserved === true &&
  comparison.targetYearPreserved === true &&
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
  '"check:year-monthly-output-quality-review": "node scripts/checkYearMonthlyOutputQualityReview.mjs"'
);
logResult('package_script_registered', scriptRegistered);
if (!scriptRegistered) hasFailure = true;

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('protected_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

const trackedFiles = execSync('git ls-files', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const statusFiles = execSync('git status --short --untracked-files=all', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''));
const protectedUntrackedFiles = statusFiles.filter((path) => pathIsProtected(path));
const protectedUntrackedFilesAbsent = protectedUntrackedFiles.length === 0;
logResult('protected_untracked_files_absent', protectedUntrackedFilesAbsent);
if (!protectedUntrackedFilesAbsent) hasFailure = true;

const artifactFiles = [...trackedFiles, ...statusFiles].filter((path) =>
  path.endsWith('.aab') || path.endsWith('.zip') || path.endsWith('.jks') || path.endsWith('.keystore')
);
const artifactFilesAbsent = artifactFiles.length === 0;
logResult('artifact_zip_and_keystore_files_not_added_to_repository', artifactFilesAbsent);
if (!artifactFilesAbsent) hasFailure = true;

if (hasFailure) {
  console.error('Year/monthly output quality review check failed');
  process.exit(1);
}

console.log('Year/monthly output quality review check passed');
