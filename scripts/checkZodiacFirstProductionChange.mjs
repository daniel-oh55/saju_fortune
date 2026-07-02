import fs from 'node:fs';
import { execSync } from 'node:child_process';

const enginePath = 'src/domain/fortune/zodiacFortuneEngine.js';
const relatedDocs = [
  'docs/ZODIAC_FIRST_PRODUCTION_SCOPE.md',
  'docs/ZODIAC_SNAPSHOT_COMPARISON_CHECK_DESIGN.md',
  'docs/ZODIAC_FORTUNE_IMPLEMENTATION_PLAN.md',
  'docs/ZODIAC_FORTUNE_ENGINE_IMPROVEMENT_DESIGN.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const requiredEngineSnippets = [
  'overall',
  'money',
  'relationship',
  'work',
  'health',
  'selectedAnimal',
  'selectedYear',
  'dateKey',
  'animalTone',
  'getAnimalTone',
  'categoryFocus',
  'getZodiacCategoryFocus',
  'composeZodiacCategorySummary',
  'composeZodiacDetail',
  'caution',
  'advice',
  'clampZodiacScore',
  '지출 조건 확인과 작은 절약',
  '에 집중해 보세요',
  'hashString',
  'pickBySeed',
];

const forbiddenEngineSnippets = [
  '지출 조건 확인과 작은 예약',
  '선택 방향를',
  '작은 절약를',
  '우선순위 실행를',
  '루틴를',
  '${focus}를 살펴보세요',
  'focus}를',
];

const requiredRelatedDocSnippets = [
  'Zodiac fortune engine improvement: Implemented in first scope',
  'Production engine logic change: Zodiac only',
  'Zodiac first production change: Implemented',
  'Zodiac after snapshot generation: Pending',
  'Snapshot comparison for zodiac improvement: Pending',
  'Zodiac output quality review: Pending',
  'Engine accuracy approval: Pending',
  'External reference comparison: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
  'Today fortune first production improvement: Reviewed',
  'Year/monthly fortune first production improvement: Reviewed',
];

const forbiddenSnippets = [
  'Engine accuracy approval: Confirmed',
  'External reference comparison: Confirmed',
  '음력/윤달 샘플 외부 검증: Confirmed',
  '태양시 보정 적용 여부: Confirmed',
  'Zodiac output quality review: Confirmed',
  'Zodiac after snapshot generation: Confirmed',
  'Snapshot comparison for zodiac improvement: Confirmed',
  'CURRENT_FORTUNE_SCHEMA_VERSION changed',
  'schemaVersion changed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const protectedFiles = [
  'src/utils/fortuneEngine.js',
  'src/domain/fortune/yearFortuneEngine.js',
  'src/domain/saju/createSajuAnalysis.js',
  'src/domain/saju/manseryeokEngine.js',
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

const forbiddenAddedFiles = [
  'docs/generated/fortune-engine-sample-snapshot-after-zodiac-improvement.json',
  'docs/generated/zodiac-fortune-snapshot-comparison-result.json',
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

function getChangedFiles() {
  return execSync('git diff --name-only HEAD', { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean);
}

function getStatusFiles() {
  return execSync('git status --short --untracked-files=all', { encoding: 'utf8' })
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''));
}

function isForbiddenAbsent(source, snippet) {
  if (
    (snippet === 'CURRENT_FORTUNE_SCHEMA_VERSION changed' || snippet === 'schemaVersion changed') &&
    source.includes(`${snippet} | Not planned`)
  ) {
    return true;
  }

  return !source.includes(snippet);
}

let hasFailure = false;

for (const path of [enginePath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const engineSource = fs.readFileSync(enginePath, 'utf8');
if (!checkIncludes('zodiac_engine_source', engineSource, requiredEngineSnippets)) hasFailure = true;

for (const snippet of forbiddenEngineSnippets) {
  const absent = !engineSource.includes(snippet);
  logResult(`zodiac_engine_source_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const changedFiles = getChangedFiles();
const engineChanged = changedFiles.includes(enginePath);
logResult('zodiac_engine_changed', engineChanged);
if (!engineChanged) hasFailure = true;

const changedSrcFiles = changedFiles.filter((path) => path.startsWith('src/'));
const onlyZodiacEngineSrcChanged =
  changedSrcFiles.length > 0 && changedSrcFiles.every((path) => path === enginePath);
logResult('only_zodiac_engine_src_file_changed', onlyZodiacEngineSrcChanged);
if (!onlyZodiacEngineSrcChanged) hasFailure = true;

const diffOutput = execSync('git diff HEAD', { encoding: 'utf8' });
const schemaVersionDiffAbsent =
  !diffOutput.includes('CURRENT_FORTUNE_SCHEMA_VERSION changed') && !diffOutput.includes('schemaVersion changed');
logResult('schema_version_diff_absent', schemaVersionDiffAbsent);
if (!schemaVersionDiffAbsent) hasFailure = true;

const docsToScan = relatedDocs.map((path) => ({
  path,
  source: fs.readFileSync(path, 'utf8'),
}));

for (const { path, source } of docsToScan) {
  if (!checkIncludes(labelFromSnippet(path), source, requiredRelatedDocSnippets)) hasFailure = true;
}

for (const snippet of forbiddenSnippets) {
  for (const { path, source } of docsToScan) {
    const absent = isForbiddenAbsent(source, snippet);
    logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

const packageJson = fs.readFileSync('package.json', 'utf8');
const scriptRegistered = packageJson.includes(
  '"check:zodiac-first-production-change": "node scripts/checkZodiacFirstProductionChange.mjs"'
);
logResult('package_script_registered', scriptRegistered);
if (!scriptRegistered) hasFailure = true;

const protectedDiffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = protectedDiffOutput.length === 0;
logResult('snapshot_privacy_android_and_non_zodiac_engine_files_unchanged', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

const statusFiles = getStatusFiles();
const generatedZodiacFilesAbsent = forbiddenAddedFiles.every((path) => !statusFiles.includes(path));
logResult('zodiac_after_snapshot_and_comparison_json_not_added', generatedZodiacFilesAbsent);
if (!generatedZodiacFilesAbsent) hasFailure = true;

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
  console.error('Zodiac first production change check failed');
  process.exit(1);
}

console.log('Zodiac first production change check passed');
