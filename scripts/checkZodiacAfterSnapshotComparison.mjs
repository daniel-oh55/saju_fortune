import fs from 'node:fs';
import { execSync } from 'node:child_process';

const afterPath = 'docs/generated/fortune-engine-sample-snapshot-after-zodiac-improvement.json';
const resultPath = 'docs/generated/zodiac-fortune-snapshot-comparison-result.json';
const docPath = 'docs/ZODIAC_AFTER_SNAPSHOT_COMPARISON.md';
const relatedDocs = [
  'docs/ZODIAC_FIRST_PRODUCTION_SCOPE.md',
  'docs/ZODIAC_SNAPSHOT_COMPARISON_CHECK_DESIGN.md',
  'docs/ZODIAC_FORTUNE_IMPLEMENTATION_PLAN.md',
  'docs/ZODIAC_FORTUNE_ENGINE_IMPROVEMENT_DESIGN.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const requiredDocSnippets = [
  '# Zodiac After Snapshot Comparison',
  'Zodiac after snapshot generation | Generated',
  'Snapshot comparison for zodiac improvement | Generated',
  'Zodiac output quality review | Pending',
  'Engine accuracy approval | Pending',
  'Sample count preserved | Confirmed',
  'Sample IDs preserved | Confirmed',
  'Today fortune output unchanged | Confirmed',
  'Year/monthly fortune output unchanged | Confirmed',
  'Manseryeok output unchanged | Confirmed',
  'Saju analysis output unchanged | Confirmed',
  'Zodiac fortune output reviewed for changes | Generated',
  'Zodiac category IDs preserved | Confirmed',
  'selectedYear preserved | Confirmed',
  'selectedAnimal preserved | Confirmed',
  'This PR does not change production engine logic.',
  'Existing baseline snapshot JSON is not regenerated.',
  'Today after snapshot JSON is not regenerated.',
  'Today comparison result JSON is not regenerated.',
  'Year/monthly after snapshot JSON is not regenerated.',
  'Year/monthly comparison result JSON is not regenerated.',
];

const requiredRelatedDocSnippets = [
  'Zodiac after snapshot generation: Generated',
  'Snapshot comparison for zodiac improvement: Generated',
  'Zodiac output quality review: Pending',
  'Engine accuracy approval: Pending',
  'External reference comparison: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
  'Zodiac fortune engine improvement: Implemented in first scope',
  'Production engine logic change: Zodiac only',
  'Today fortune first production improvement: Reviewed',
  'Year/monthly fortune first production improvement: Reviewed',
];

const forbiddenSnippets = [
  'Engine accuracy approval | Confirmed',
  'Engine accuracy approval: Confirmed',
  'Zodiac output quality review | Confirmed',
  'Zodiac output quality review: Confirmed',
  'External reference comparison | Confirmed',
  'External reference comparison: Confirmed',
  '음력/윤달 샘플 외부 검증: Confirmed',
  '태양시 보정 적용 여부: Confirmed',
];

const protectedFiles = [
  'src',
  'docs/generated/fortune-engine-sample-snapshot.json',
  'docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json',
  'docs/generated/today-fortune-snapshot-comparison-result.json',
  'docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json',
  'docs/generated/year-monthly-fortune-snapshot-comparison-result.json',
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
  after.snapshotVersion === 'fortune_engine_sample_snapshot_after_zodiac_improvement_v1' &&
  after.productionLogicChangeScope === 'zodiac_first_scope_only' &&
  after.dateKey === '2026-06-30' &&
  after.targetYear === 2026 &&
  after.engineAccuracyApproval === 'Pending' &&
  after.externalReferenceComparison === 'Pending' &&
  after.lunarLeapExternalVerification === 'Pending' &&
  after.solarTimeCorrectionPolicy === 'Pending';

const comparisonValid =
  comparison.comparisonVersion === 'zodiac_fortune_snapshot_comparison_v1' &&
  comparison.dateKey === '2026-06-30' &&
  comparison.targetYear === 2026 &&
  comparison.sampleCount === 8 &&
  comparison.sampleIdsPreserved === true &&
  comparison.todayFortuneUnchanged === true &&
  comparison.yearMonthlyFortuneUnchanged === true &&
  comparison.manseryeokUnchanged === true &&
  comparison.sajuAnalysisUnchanged === true &&
  typeof comparison.zodiacFortuneChanged === 'boolean' &&
  comparison.zodiacCategoryIdsPreserved === true &&
  comparison.selectedYearPreserved === true &&
  comparison.selectedAnimalPreserved === true &&
  comparison.engineAccuracyApproval === 'Pending' &&
  comparison.snapshotComparisonForZodiacImprovement === 'Generated';

logResult('after_snapshot_metadata_valid', afterMetadataValid);
logResult('comparison_result_valid', comparisonValid);
if (!afterMetadataValid || !comparisonValid) hasFailure = true;

const docsToScan = [{ path: docPath, source: fs.readFileSync(docPath, 'utf8') }];
if (!checkIncludes('zodiac_after_comparison_doc', docsToScan[0].source, requiredDocSnippets)) {
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
  '"snapshot:zodiac-after-improvement": "node scripts/runZodiacFortuneAfterSnapshot.mjs"',
  '"check:zodiac-fortune-snapshot-comparison": "node scripts/checkZodiacFortuneSnapshotComparison.mjs"',
  '"check:zodiac-after-snapshot-comparison": "node scripts/checkZodiacAfterSnapshotComparison.mjs"',
]) {
  const registered = packageJson.includes(script);
  logResult(`package_script_registered_${labelFromSnippet(script)}`, registered);
  if (!registered) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('src_existing_snapshots_privacy_and_android_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
  console.error('Zodiac after snapshot comparison check failed');
  process.exit(1);
}

console.log('Zodiac after snapshot comparison check passed');
