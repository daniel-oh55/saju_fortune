import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ZODIAC_FORTUNE_IMPLEMENTATION_PLAN.md';
const relatedDocs = [
  'docs/ZODIAC_FORTUNE_ENGINE_IMPROVEMENT_DESIGN.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
  'docs/FORTUNE_ENGINE_CURRENT_STATE_AUDIT.md',
  'docs/FORTUNE_ENGINE_SAMPLE_SNAPSHOT_QUALITY_REVIEW.md',
];

const requiredDocSnippets = [
  '# Zodiac Fortune Implementation Plan',
  'This document is not a production logic change and does not approve final engine accuracy.',
  'Zodiac fortune implementation plan | Added',
  'Zodiac fortune engine improvement | Pending',
  'Production engine logic change | Pending',
  'Snapshot comparison for zodiac improvement | Pending',
  'Zodiac output quality review | Pending',
  'Engine accuracy approval | Pending',
  'External reference comparison | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'src/domain/fortune/zodiacFortuneEngine.js | improve zodiac summary/detail/category text composition in a small scoped PR',
  'Preserve deterministic output for the same selectedAnimal/dateKey.',
  'Preserve existing category IDs: overall, money, relationship, work, health.',
  'docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json | practical baseline before zodiac improvement',
  'Today fortune output unchanged | CURRENT_FORTUNE_SCHEMA_VERSION should not change for zodiac-only PR',
  'Compare today fortune output | Pending | should remain unchanged from practical baseline',
  'Compare year/monthly fortune output | Pending | should remain unchanged from practical baseline',
  'Compare zodiac output | Pending | expected to change with review',
  'Compare zodiac category IDs | Pending | overall, money, relationship, work, health preserved',
  'This PR adds zodiac fortune implementation plan only.',
  'Zodiac fortune output logic is not changed.',
  'Snapshot JSON files are not regenerated.',
];

const requiredRelatedDocSnippets = [
  'Zodiac fortune implementation plan: Added',
  'Zodiac fortune engine improvement: Pending',
  'Production engine logic change: Pending',
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
  'Zodiac fortune engine improvement: Confirmed',
  'Production engine logic change: Confirmed',
  'Snapshot comparison for zodiac improvement: Confirmed',
  'Zodiac output quality review: Confirmed',
  'Engine accuracy approval: Confirmed',
  'External reference comparison: Confirmed',
  '음력/윤달 샘플 외부 검증: Confirmed',
  '태양시 보정 적용 여부: Confirmed',
  'CURRENT_FORTUNE_SCHEMA_VERSION changed',
  'schemaVersion changed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
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

let hasFailure = false;

for (const path of [docPath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');
const docsToScan = [{ path: docPath, source: doc }];

if (!checkIncludes('zodiac_implementation_plan_doc', doc, requiredDocSnippets)) hasFailure = true;

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
  '"check:zodiac-fortune-implementation-plan": "node scripts/checkZodiacFortuneImplementationPlan.mjs"'
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
const artifactFiles = [...trackedFiles, ...statusFiles].filter((path) =>
  path.endsWith('.aab') || path.endsWith('.zip') || path.endsWith('.jks') || path.endsWith('.keystore')
);
const artifactFilesAbsent = artifactFiles.length === 0;
logResult('artifact_zip_and_keystore_files_not_added_to_repository', artifactFilesAbsent);
if (!artifactFilesAbsent) hasFailure = true;

if (hasFailure) {
  console.error('Zodiac fortune implementation plan check failed');
  process.exit(1);
}

console.log('Zodiac fortune implementation plan check passed');
