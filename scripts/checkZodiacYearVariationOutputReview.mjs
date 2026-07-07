import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ZODIAC_YEAR_VARIATION_OUTPUT_REVIEW.md';
const baselinePath = 'docs/generated/zodiac-year-variation-baseline.json';

const requiredDocSnippets = [
  '# Zodiac Year Variation Output Review',
  'Review target: zodiac same-animal birth-year wording variation after PR #272',
  'Baseline source: docs/generated/zodiac-year-variation-baseline.json',
  'This document does not approve final engine accuracy',
  'This document does not complete external reference comparison',
  'This document reviews wording quality only',
  'total exactDuplicatePairs 13 -> 0',
  'total repeatedSnippetExamples 13 -> 0',
  'Engine accuracy approval | Pending',
  'External reference comparison | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'Same-animal year outputs should not be exact duplicates',
  'No age/life-stage assumptions',
  'No fear-based wording',
  'No deterministic health/finance claims',
  'Category IDs must remain stable',
  'selectedAnimal and selectedYear must remain stable',
  'Representative 12-year list must remain stable',
  '1988년 토끼띠 must not reappear',
  'Rabbit years reviewed: 1987, 1999, 2011',
  'Dragon years reviewed: 1988, 2000, 2012',
  'Rabbit exactDuplicatePairs: 0',
  'Dragon exactDuplicatePairs: 0',
  'Fear-based wording | Not found',
  'Deterministic finance claim | Not found',
  'Deterministic health claim | Not found',
  'Age/life-stage assumption | Not found',
  'Overly negative wording | Not found',
  'Production fortune logic unchanged',
  'Zodiac generation logic unchanged',
  'src production UI unchanged',
  'Generated production JSON unchanged',
  'docs/generated/zodiac-year-variation-baseline.json unchanged in this PR',
  'schemaVersion unchanged',
  'CURRENT_FORTUNE_SCHEMA_VERSION unchanged',
  'Existing localStorage keys unchanged',
  'No new localStorage keys added',
  'UI/routing unchanged',
  'privacy files unchanged',
  'Android/Gradle unchanged',
  'Engine accuracy approval remains Pending',
  'External reference comparison remains Pending',
  '음력/윤달 샘플 외부 검증 remains Pending',
  '태양시 보정 적용 여부 remains Pending',
];

const forbiddenDocSnippets = [
  'Engine accuracy approval | Confirmed',
  'Engine accuracy approval: Confirmed',
  'External reference comparison | Confirmed',
  'External reference comparison: Confirmed',
  '음력/윤달 샘플 외부 검증 Confirmed',
  '태양시 보정 적용 여부: Confirmed',
  '1988년 토끼띠 | Allowed',
  '반드시 성공합니다',
  '큰돈이 들어옵니다',
  '건강 문제가 생깁니다',
  '운명이 바뀝니다',
  '불길합니다',
];

const protectedFiles = [
  'src/domain',
  'src/utils/fortuneEngine.js',
  'docs/generated/zodiac-year-variation-baseline.json',
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

function pathIsProtected(path) {
  return protectedFiles.some((protectedFile) => path === protectedFile || path.startsWith(`${protectedFile}/`));
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

for (const path of [docPath, baselinePath]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');
const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));

if (!checkIncludes('zodiac_year_variation_output_review_doc', doc, requiredDocSnippets)) hasFailure = true;

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`forbidden_doc_snippet_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const animals = Array.isArray(baseline.animals) ? baseline.animals : [];
const totalExactDuplicatePairs = animals.reduce((sum, item) => sum + Number(item.exactDuplicatePairs || 0), 0);
const totalRepeatedSnippetExamples = animals.reduce(
  (sum, item) => sum + Number((item.repeatedSnippetExamples || []).length),
  0,
);
const rabbit = animals.find((item) => item.years?.includes(1987) && item.years?.includes(1999));
const dragon = animals.find((item) => item.years?.includes(1988) && item.years?.includes(2000));
const rabbitYears = rabbit?.years || [];
const dragonYears = dragon?.years || [];

const baselineMetadataValid =
  baseline.status === 'Baseline only' &&
  baseline.productionLogicChanged === false &&
  baseline.zodiacGenerationLogicChanged === false &&
  baseline.dateKey === '2026-06-30' &&
  animals.length >= 12;
logResult('baseline_metadata_valid', baselineMetadataValid);
if (!baselineMetadataValid) hasFailure = true;

const exactDuplicatePairsCleared = totalExactDuplicatePairs === 0;
logResult('total_exact_duplicate_pairs_is_zero', exactDuplicatePairsCleared);
if (!exactDuplicatePairsCleared) hasFailure = true;

const repeatedSnippetExamplesCleared = totalRepeatedSnippetExamples === 0;
logResult('total_repeated_snippet_examples_is_zero', repeatedSnippetExamplesCleared);
if (!repeatedSnippetExamplesCleared) hasFailure = true;

const rabbitReviewValid =
  rabbitYears.includes(1987) &&
  rabbitYears.includes(1999) &&
  rabbitYears.includes(2011) &&
  !rabbitYears.includes(1988) &&
  rabbit?.exactDuplicatePairs === 0 &&
  (rabbit?.repeatedSnippetExamples || []).length === 0;
logResult('rabbit_year_variation_review_valid', rabbitReviewValid);
if (!rabbitReviewValid) hasFailure = true;

const dragonReviewValid =
  dragonYears.includes(1988) &&
  dragonYears.includes(2000) &&
  dragonYears.includes(2012) &&
  dragon?.exactDuplicatePairs === 0 &&
  (dragon?.repeatedSnippetExamples || []).length === 0;
logResult('dragon_year_variation_review_valid', dragonReviewValid);
if (!dragonReviewValid) hasFailure = true;

const packageJson = fs.readFileSync('package.json', 'utf8');
const packageScriptRegistered = packageJson.includes(
  '"check:zodiac-year-variation-output-review": "node scripts/checkZodiacYearVariationOutputReview.mjs"',
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
  console.error('Zodiac year variation output review check failed');
  process.exit(1);
}

console.log('Zodiac year variation output review check passed');
