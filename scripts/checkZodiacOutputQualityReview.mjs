import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ZODIAC_OUTPUT_QUALITY_REVIEW.md';
const afterPath = 'docs/generated/fortune-engine-sample-snapshot-after-zodiac-improvement.json';
const resultPath = 'docs/generated/zodiac-fortune-snapshot-comparison-result.json';
const relatedDocs = [
  'docs/ZODIAC_AFTER_SNAPSHOT_COMPARISON.md',
  'docs/ZODIAC_FIRST_PRODUCTION_SCOPE.md',
  'docs/ZODIAC_SNAPSHOT_COMPARISON_CHECK_DESIGN.md',
  'docs/ZODIAC_FORTUNE_IMPLEMENTATION_PLAN.md',
  'docs/ZODIAC_FORTUNE_ENGINE_IMPROVEMENT_DESIGN.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const expectedSampleIds = [
  'solar-known-time-01',
  'solar-unknown-time-01',
  'solar-late-night-same-day-01',
  'solar-late-night-next-day-01',
  'lunar-non-leap-01',
  'lunar-leap-01',
  'term-boundary-01',
  'profile-zodiac-boundary-01',
];

const expectedCategoryIds = ['overall', 'money', 'relationship', 'work', 'health'];
const expectedAnimalLabels = [
  '쥐',
  '소',
  '호랑이',
  '토끼',
  '용',
  '뱀',
  '말',
  '양',
  '원숭이',
  '닭',
  '개',
  '돼지',
];

const requiredDocSnippets = [
  '# Zodiac Output Quality Review',
  'This document does not approve final engine accuracy.',
  'Zodiac output quality review | Reviewed',
  'Engine accuracy approval | Pending',
  'External reference comparison | Pending',
  '| 음력/윤달 샘플 외부 검증 | Pending | external reference comparison still required |',
  '태양시 보정 적용 여부 | Pending',
  'Zodiac fortune output changed | Confirmed',
  'Zodiac category IDs preserved | Confirmed',
  'selectedYear preserved | Confirmed',
  'selectedAnimal preserved | Confirmed',
  'Corrected category focus particle wording included | Confirmed',
  'Awkward focus particle wording removed | Confirmed',
  'Animal-specific tone clarity | Reviewed',
  'Category-specific guidance clarity | Reviewed',
  'Summary readability | Reviewed',
  'Detail readability | Reviewed',
  'Particle wording quality | Reviewed',
  'Money focus wording quality | Reviewed',
  'Fear-based wording risk | Reviewed',
  'Health safety wording | Reviewed',
  'This PR adds zodiac output quality review documentation only.',
  'Zodiac after snapshot JSON is not changed.',
  'Zodiac comparison result JSON is not changed.',
];

const requiredRelatedDocSnippets = [
  'Zodiac output quality review: Reviewed',
  'Zodiac category focus particle fix: Applied',
  'Zodiac after snapshot regenerated after particle fix: Generated',
  'Snapshot comparison for zodiac improvement: Generated',
  'Engine accuracy approval: Pending',
  'External reference comparison: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
  'Zodiac fortune engine improvement: Implemented in first scope',
  'Production engine logic change: Zodiac only',
  'Today fortune first production improvement: Reviewed',
  'Year/monthly fortune first production improvement: Reviewed',
];

const requiredAfterSnapshotSnippets = ['에 집중해 보세요', '지출 조건 확인과 작은 절약'];
const forbiddenAfterSnapshotSnippets = [
  '선택 방향를',
  '작은 절약를',
  '우선순위 실행를',
  '루틴를',
  '지출 조건 확인과 작은 예약',
  '${focus}를 살펴보세요',
  'focus}를',
];

const forbiddenSnippets = [
  'Engine accuracy approval | Confirmed',
  'Engine accuracy approval: Confirmed',
  'External reference comparison | Confirmed',
  'External reference comparison: Confirmed',
  '음력/윤달 샘플 외부 검증 Confirmed',
  '태양시 보정 적용 여부: Confirmed',
  '실제 스토어 스크린샷 이미지 시작',
  '양력/음력 샘플 추가 검증',
];

const forbiddenDocSnippets = [
  '음력/윤달 샘플 외부 검증 Pending',
  '| 음력/윤달 샘플 외부 검증| Pending | external reference comparison still required |',
  '| 음력/윤달 샘플 외부 검증 Pending | external reference comparison still required |',
  'The lunar/leap sample verification status row intentionally uses',
  '음력/윤달 샘플 외부 검증Pending',
  '| rat | Reviewed',
  '| ox | Reviewed',
  '| tiger | Reviewed',
  '| rabbit | Reviewed',
  '| dragon | Reviewed',
  '| snake | Reviewed',
  '| horse | Reviewed',
  '| goat | Reviewed',
  '| monkey | Reviewed',
  '| rooster | Reviewed',
  '| dog | Reviewed',
  '| pig | Reviewed',
];

const protectedFiles = [
  'src',
  'docs/generated/fortune-engine-sample-snapshot.json',
  'docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json',
  'docs/generated/today-fortune-snapshot-comparison-result.json',
  'docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json',
  'docs/generated/year-monthly-fortune-snapshot-comparison-result.json',
  'docs/generated/fortune-engine-sample-snapshot-after-zodiac-improvement.json',
  'docs/generated/zodiac-fortune-snapshot-comparison-result.json',
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

for (const path of [docPath, afterPath, resultPath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');
const afterSource = fs.readFileSync(afterPath, 'utf8');
const after = JSON.parse(afterSource);
const comparison = JSON.parse(fs.readFileSync(resultPath, 'utf8'));

if (!checkIncludes('zodiac_output_quality_review_doc', doc, requiredDocSnippets)) hasFailure = true;
if (!checkIncludes('zodiac_output_quality_review_doc_sample_ids', doc, expectedSampleIds)) hasFailure = true;
if (!checkIncludes('zodiac_output_quality_review_doc_category_ids', doc, expectedCategoryIds)) hasFailure = true;
if (!checkIncludes('zodiac_output_quality_review_doc_animal_labels', doc, expectedAnimalLabels)) hasFailure = true;

const afterMetadataValid =
  after.snapshotVersion === 'fortune_engine_sample_snapshot_after_zodiac_improvement_v1' &&
  after.productionLogicChangeScope === 'zodiac_first_scope_only' &&
  after.dateKey === '2026-06-30' &&
  after.targetYear === 2026 &&
  after.engineAccuracyApproval === 'Pending' &&
  after.externalReferenceComparison === 'Pending' &&
  after.lunarLeapExternalVerification === 'Pending' &&
  after.solarTimeCorrectionPolicy === 'Pending' &&
  after.samples.length === 8;
logResult('after_snapshot_metadata_valid', afterMetadataValid);
if (!afterMetadataValid) hasFailure = true;

for (const sample of after.samples) {
  const categoryIdsValid = sameArray(sample.zodiacFortuneSummary?.categoryIds || [], expectedCategoryIds);
  const selectedYearPresent = sample.zodiacFortuneSummary?.selectedYear !== undefined;
  const selectedAnimalPresent = Boolean(sample.zodiacFortuneSummary?.selectedAnimal);

  logResult(`${sample.sampleId}_zodiac_category_ids_preserved`, categoryIdsValid);
  logResult(`${sample.sampleId}_selected_year_present`, selectedYearPresent);
  logResult(`${sample.sampleId}_selected_animal_present`, selectedAnimalPresent);

  if (!categoryIdsValid || !selectedYearPresent || !selectedAnimalPresent) hasFailure = true;
}

if (!checkIncludes('after_snapshot_json', afterSource, requiredAfterSnapshotSnippets)) hasFailure = true;
for (const snippet of forbiddenAfterSnapshotSnippets) {
  const absent = !afterSource.includes(snippet);
  logResult(`forbidden_after_snapshot_snippet_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const comparisonValid =
  comparison.comparisonVersion === 'zodiac_fortune_snapshot_comparison_v1' &&
  comparison.sampleCount === 8 &&
  comparison.sampleIdsPreserved === true &&
  comparison.todayFortuneUnchanged === true &&
  comparison.yearMonthlyFortuneUnchanged === true &&
  comparison.manseryeokUnchanged === true &&
  comparison.sajuAnalysisUnchanged === true &&
  comparison.zodiacFortuneChanged === true &&
  comparison.zodiacCategoryIdsPreserved === true &&
  comparison.selectedYearPreserved === true &&
  comparison.selectedAnimalPreserved === true &&
  comparison.engineAccuracyApproval === 'Pending' &&
  comparison.snapshotComparisonForZodiacImprovement === 'Generated';
logResult('comparison_result_valid', comparisonValid);
if (!comparisonValid) hasFailure = true;

const docsToScan = [{ path: docPath, source: doc }];
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

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`forbidden_doc_snippet_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const packageJson = fs.readFileSync('package.json', 'utf8');
const packageScriptRegistered = packageJson.includes(
  '"check:zodiac-output-quality-review": "node scripts/checkZodiacOutputQualityReview.mjs"',
);
logResult('package_script_registered', packageScriptRegistered);
if (!packageScriptRegistered) hasFailure = true;

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('src_generated_privacy_and_android_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

const statusFiles = execSync('git status --short --untracked-files=all', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''));
const protectedUntrackedFiles = statusFiles.filter((path) => pathIsProtected(path));
const protectedUntrackedFilesAbsent = protectedUntrackedFiles.length === 0;
logResult('protected_untracked_files_absent', protectedUntrackedFilesAbsent);
if (!protectedUntrackedFilesAbsent) hasFailure = true;

const trackedFiles = execSync('git ls-files', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const artifactFiles = [...trackedFiles, ...statusFiles].filter((path) =>
  path.endsWith('.aab') || path.endsWith('.zip') || path.endsWith('.jks') || path.endsWith('.keystore')
);
const artifactFilesAbsent = artifactFiles.length === 0;
logResult('artifact_zip_and_keystore_files_not_added_to_repository', artifactFilesAbsent);
if (!artifactFilesAbsent) hasFailure = true;

if (hasFailure) {
  console.error('Zodiac output quality review check failed');
  process.exit(1);
}

console.log('Zodiac output quality review check passed');
