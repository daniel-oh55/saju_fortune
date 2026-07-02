import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docsOnlyCheckScripts = [
  'scripts/checkFortuneEngineCurrentStateAudit.mjs',
  'scripts/checkFortuneEngineSampleQaBaseline.mjs',
  'scripts/checkFortuneEngineSampleSnapshot.mjs',
  'scripts/checkFortuneEngineSampleSnapshotQualityReview.mjs',
  'scripts/checkFortuneEngineSampleSnapshotReadiness.mjs',
  'scripts/checkTodayFortuneAfterSnapshotComparison.mjs',
  'scripts/checkTodayFortuneEngineImplementationPlan.mjs',
  'scripts/checkTodayFortuneEngineImprovementDesign.mjs',
  'scripts/checkTodayFortuneFirstProductionScope.mjs',
  'scripts/checkTodayFortuneOutputQualityReview.mjs',
  'scripts/checkTodayFortuneSnapshotComparisonCheckDesign.mjs',
  'scripts/checkYearMonthlyFortuneEngineImprovementDesign.mjs',
  'scripts/checkYearMonthlyFortuneImplementationPlan.mjs',
  'scripts/checkYearMonthlySnapshotComparisonCheckDesign.mjs',
  'scripts/checkYearMonthlyFirstProductionScope.mjs',
];

const productionChangeCheckPath = 'scripts/checkYearMonthlyFirstProductionChange.mjs';
const protectedPaths = [
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

function labelFromPath(path) {
  return path.replaceAll(/[^\p{L}\p{N}_/-]/gu, '_').slice(0, 90);
}

function getProtectedFilesBlock(source) {
  const match = source.match(/const protectedFiles = \[[\s\S]*?\];/);
  return match ? match[0] : '';
}

let hasFailure = false;

for (const path of [...docsOnlyCheckScripts, productionChangeCheckPath]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromPath(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

for (const path of docsOnlyCheckScripts) {
  const source = fs.readFileSync(path, 'utf8');
  const protectedFilesBlock = getProtectedFilesBlock(source);
  const hasProtectedFilesBlock = protectedFilesBlock.length > 0;
  const hasSrcGuardrail = protectedFilesBlock.includes("'src'") || protectedFilesBlock.includes('"src"');

  logResult(`${labelFromPath(path)}_protectedFiles_block_present`, hasProtectedFilesBlock);
  logResult(`${labelFromPath(path)}_src_guardrail_present`, hasSrcGuardrail);

  if (!hasProtectedFilesBlock || !hasSrcGuardrail) hasFailure = true;
}

const productionCheckSource = fs.readFileSync(productionChangeCheckPath, 'utf8');
const productionProtectedBlock = getProtectedFilesBlock(productionCheckSource);
const productionCheckKeepsTargetedAllowlist =
  productionCheckSource.includes('only_year_monthly_engine_src_file_changed') &&
  productionCheckSource.includes("changedFiles.filter((path) => path.startsWith('src/'))") &&
  productionCheckSource.includes("path === enginePath");
const productionCheckDoesNotBlockAllSrc =
  !productionProtectedBlock.includes("'src'") && !productionProtectedBlock.includes('"src"');

logResult('year_monthly_production_change_targeted_src_allowlist_present', productionCheckKeepsTargetedAllowlist);
logResult('year_monthly_production_change_does_not_use_global_src_block', productionCheckDoesNotBlockAllSrc);

if (!productionCheckKeepsTargetedAllowlist || !productionCheckDoesNotBlockAllSrc) hasFailure = true;

const packageJson = fs.readFileSync('package.json', 'utf8');
const packageScriptRegistered = packageJson.includes(
  '"check:doc-check-src-guardrails": "node scripts/checkDocCheckSrcGuardrails.mjs"'
);
logResult('package_script_registered', packageScriptRegistered);
if (!packageScriptRegistered) hasFailure = true;

const protectedDiffOutput = execSync(`git diff --name-only -- ${protectedPaths.join(' ')}`, {
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
  console.error('Doc check src guardrail restore check failed');
  process.exit(1);
}

console.log('Doc check src guardrail restore check passed');
