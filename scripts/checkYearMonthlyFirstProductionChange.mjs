import fs from 'node:fs';
import { execSync } from 'node:child_process';

const enginePath = 'src/domain/fortune/yearFortuneEngine.js';
const relatedDocs = [
  'docs/YEAR_MONTHLY_FIRST_PRODUCTION_SCOPE.md',
  'docs/YEAR_MONTHLY_FORTUNE_IMPLEMENTATION_PLAN.md',
  'docs/YEAR_MONTHLY_SNAPSHOT_COMPARISON_CHECK_DESIGN.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const requiredEngineSnippets = [
  'export function createYearFortune(profile, sajuAnalysis, targetYear = 2026)',
  'Array.from({ length: 12 }',
  'targetYear',
  'hashString',
  'scoreFromSeed',
  'pickBySeed',
  'reason',
  'advice',
  'caution',
];

const productionImprovementSnippets = [
  'monthFocus',
  'getMonthFocus',
  'monthlyModifier',
  'getMonthlyScoreModifier',
  'composeMonthlyAdvice',
  'clampYearMonthlyScore',
  'annualElementTone',
];

const requiredRelatedDocSnippets = [
  'Year/monthly fortune engine improvement: Implemented in first scope',
  'Production engine logic change: Year/monthly only',
  'CURRENT_FORTUNE_SCHEMA_VERSION decision: Unchanged for year/monthly-only PR',
  'schemaVersion decision: Unchanged because output shape is preserved',
  'Year/monthly after snapshot generation: Pending',
  'Snapshot comparison for year/monthly improvement: Pending',
  'Year/monthly output quality review: Pending',
  'Engine accuracy approval: Pending',
  'External reference comparison: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
  'Today fortune first production improvement: Reviewed',
  'Zodiac fortune engine improvement: Pending',
];

const forbiddenSnippets = [
  'Year/monthly after snapshot generation: Confirmed',
  'Snapshot comparison for year/monthly improvement: Confirmed',
  'Year/monthly output quality review: Confirmed',
  'Engine accuracy approval: Confirmed',
  'External reference comparison: Confirmed',
  '음력/윤달 샘플 외부 검증: Confirmed',
  '태양시 보정 적용 여부: Confirmed',
  'Zodiac fortune engine improvement: Confirmed',
  'CURRENT_FORTUNE_SCHEMA_VERSION changed',
  'schemaVersion changed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const protectedFiles = [
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

let hasFailure = false;

for (const path of [enginePath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const engineSource = fs.readFileSync(enginePath, 'utf8');
if (!checkIncludes('year_monthly_engine_source', engineSource, requiredEngineSnippets)) hasFailure = true;

const improvementSnippetCount = productionImprovementSnippets.filter((snippet) => engineSource.includes(snippet)).length;
const hasProductionImprovementLogic = improvementSnippetCount >= 2;
logResult('year_monthly_improvement_logic_present', hasProductionImprovementLogic);
if (!hasProductionImprovementLogic) hasFailure = true;

const changedFiles = execSync('git diff --name-only HEAD', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const engineChanged = changedFiles.includes(enginePath);
logResult('year_monthly_engine_changed', engineChanged);
if (!engineChanged) hasFailure = true;

const changedSrcFiles = changedFiles.filter((path) => path.startsWith('src/'));
const onlyYearMonthlyEngineSrcChanged =
  changedSrcFiles.length > 0 && changedSrcFiles.every((path) => path === enginePath);
logResult('only_year_monthly_engine_src_file_changed', onlyYearMonthlyEngineSrcChanged);
if (!onlyYearMonthlyEngineSrcChanged) hasFailure = true;

const diffOutput = execSync('git diff HEAD', { encoding: 'utf8' });
const schemaVersionDiffAbsent =
  !diffOutput.includes('CURRENT_FORTUNE_SCHEMA_VERSION changed') && !diffOutput.includes('schemaVersion changed');
logResult('schema_version_diff_absent', schemaVersionDiffAbsent);
if (!schemaVersionDiffAbsent) hasFailure = true;

const todayFortuneSrcChanged = changedSrcFiles.some(
  (path) => path.includes('fortuneEngine.js') && path !== enginePath,
);
logResult('today_fortune_production_code_unchanged', !todayFortuneSrcChanged);
if (todayFortuneSrcChanged) hasFailure = true;

const zodiacSrcChanged = changedSrcFiles.some((path) => path.toLowerCase().includes('zodiac'));
logResult('zodiac_production_code_unchanged', !zodiacSrcChanged);
if (zodiacSrcChanged) hasFailure = true;

const manseryeokSrcChanged = changedSrcFiles.some((path) => path.toLowerCase().includes('manseryeok'));
logResult('manseryeok_production_code_unchanged', !manseryeokSrcChanged);
if (manseryeokSrcChanged) hasFailure = true;

const sajuAnalysisSrcChanged = changedSrcFiles.some(
  (path) => path.includes('src/domain/saju') && !path.toLowerCase().includes('manseryeok'),
);
logResult('saju_analysis_production_code_unchanged', !sajuAnalysisSrcChanged);
if (sajuAnalysisSrcChanged) hasFailure = true;

const docsToScan = relatedDocs.map((path) => ({
  path,
  source: fs.readFileSync(path, 'utf8'),
}));

for (const { path, source } of docsToScan) {
  if (!checkIncludes(labelFromSnippet(path), source, requiredRelatedDocSnippets)) hasFailure = true;
}

for (const snippet of forbiddenSnippets) {
  for (const { path, source } of docsToScan) {
    const absent =
      snippet === 'CURRENT_FORTUNE_SCHEMA_VERSION changed'
        ? !source.includes(snippet) || source.includes(`${snippet} | Not planned`)
        : !source.includes(snippet);
    logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

const packageJson = fs.readFileSync('package.json', 'utf8');
const scriptRegistered = packageJson.includes(
  '"check:year-monthly-first-production-change": "node scripts/checkYearMonthlyFirstProductionChange.mjs"'
);
logResult('package_script_registered', scriptRegistered);
if (!scriptRegistered) hasFailure = true;

const protectedDiffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = protectedDiffOutput.length === 0;
logResult('snapshot_privacy_and_android_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
  console.error('Year/monthly first production change check failed');
  process.exit(1);
}

console.log('Year/monthly first production change check passed');
