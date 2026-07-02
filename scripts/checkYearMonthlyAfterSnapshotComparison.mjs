import fs from 'node:fs';
import { execSync } from 'node:child_process';

const afterPath = 'docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json';
const resultPath = 'docs/generated/year-monthly-fortune-snapshot-comparison-result.json';
const docPath = 'docs/YEAR_MONTHLY_AFTER_SNAPSHOT_COMPARISON.md';
const relatedDocs = [
  'docs/YEAR_MONTHLY_FIRST_PRODUCTION_SCOPE.md',
  'docs/YEAR_MONTHLY_SNAPSHOT_COMPARISON_CHECK_DESIGN.md',
  'docs/YEAR_MONTHLY_FORTUNE_IMPLEMENTATION_PLAN.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const requiredDocSnippets = [
  '# Year Monthly After Snapshot Comparison',
  'Year/monthly after snapshot generation | Generated',
  'Snapshot comparison for year/monthly improvement | Generated',
  'Year/monthly output quality review | Pending',
  'Engine accuracy approval | Pending',
  'Sample count preserved | Confirmed',
  'Sample IDs preserved | Confirmed',
  'Today fortune output unchanged | Confirmed',
  'Manseryeok output unchanged | Confirmed',
  'Saju analysis output unchanged | Confirmed',
  'Zodiac fortune output unchanged | Confirmed',
  'Monthly entries count preserved | Confirmed',
  'This PR does not change production logic.',
  'Existing baseline snapshot JSON is not regenerated.',
  'Today after snapshot JSON is not regenerated.',
  'Today comparison result JSON is not regenerated.',
];

const requiredRelatedDocSnippets = [
  'Year/monthly after snapshot generation: Generated',
  'Snapshot comparison for year/monthly improvement: Generated',
  'Year/monthly output quality review: Pending',
  'Engine accuracy approval: Pending',
  'External reference comparison: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
  'Year/monthly fortune engine improvement: Implemented in first scope',
  'Production engine logic change: Year/monthly only',
  'Today fortune first production improvement: Reviewed',
  'Zodiac fortune engine improvement: Pending',
];

const forbiddenSnippets = [
  'Engine accuracy approval | Confirmed',
  'Engine accuracy approval: Confirmed',
  'Year/monthly output quality review | Confirmed',
  'Year/monthly output quality review: Confirmed',
  'External reference comparison | Confirmed',
  'External reference comparison: Confirmed',
  '음력/윤달 샘플 외부 검증: Confirmed',
  '태양시 보정 적용 여부: Confirmed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const protectedFiles = [
  'src',
  'docs/generated/fortune-engine-sample-snapshot.json',
  'docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json',
  'docs/generated/today-fortune-snapshot-comparison-result.json',
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

for (const path of [afterPath, resultPath, docPath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const after = JSON.parse(fs.readFileSync(afterPath, 'utf8'));
const comparison = JSON.parse(fs.readFileSync(resultPath, 'utf8'));

const afterMetadataValid =
  after.snapshotVersion === 'fortune_engine_sample_snapshot_after_year_monthly_improvement_v1' &&
  after.productionLogicChangeScope === 'year_monthly_first_scope_only' &&
  after.dateKey === '2026-06-30' &&
  after.targetYear === 2026 &&
  after.engineAccuracyApproval === 'Pending';

const comparisonValid =
  comparison.comparisonVersion === 'year_monthly_fortune_snapshot_comparison_v1' &&
  comparison.sampleCount === 8 &&
  comparison.sampleIdsPreserved === true &&
  comparison.todayFortuneUnchanged === true &&
  comparison.manseryeokUnchanged === true &&
  comparison.sajuAnalysisUnchanged === true &&
  comparison.zodiacFortuneUnchanged === true &&
  comparison.monthlyEntriesCountPreserved === true &&
  comparison.targetYearPreserved === true &&
  comparison.engineAccuracyApproval === 'Pending';

logResult('after_snapshot_metadata_valid', afterMetadataValid);
logResult('comparison_result_valid', comparisonValid);
if (!afterMetadataValid || !comparisonValid) hasFailure = true;

const docsToScan = [{ path: docPath, source: fs.readFileSync(docPath, 'utf8') }];
if (!checkIncludes('after_comparison_doc', docsToScan[0].source, requiredDocSnippets)) {
  hasFailure = true;
}

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
for (const script of [
  '"snapshot:year-monthly-after-improvement": "node scripts/runYearMonthlyFortuneAfterSnapshot.mjs"',
  '"check:year-monthly-fortune-snapshot-comparison": "node scripts/checkYearMonthlyFortuneSnapshotComparison.mjs"',
  '"check:year-monthly-after-snapshot-comparison": "node scripts/checkYearMonthlyAfterSnapshotComparison.mjs"',
]) {
  const registered = packageJson.includes(script);
  logResult(`package_script_registered_${labelFromSnippet(script)}`, registered);
  if (!registered) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('production_baseline_today_privacy_and_android_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
  console.error('Year/monthly after snapshot comparison check failed');
  process.exit(1);
}

console.log('Year/monthly after snapshot comparison check passed');
