import fs from 'node:fs';
import { execSync } from 'node:child_process';

const criteriaDocPath = 'docs/MANSERYEOK_EXTERNAL_REFERENCE_SELECTION_CRITERIA.md';
const snapshotPath = 'docs/generated/fortune-engine-sample-snapshot.json';
const relatedDocs = [
  'docs/MANSERYEOK_EXTERNAL_COMPARISON_TEMPLATE.md',
  'docs/MANSERYEOK_EXTERNAL_VERIFICATION_PLAN.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const requiredCriteriaSnippets = [
  '# Manseryeok External Reference Selection Criteria',
  'This document is not external reference selection completion, actual external comparison completion, or final engine accuracy approval.',
  'Manseryeok external reference selection criteria | Added',
  'External manseryeok reference selection | Pending',
  'Actual external reference comparison | Pending',
  'Manual comparison sheet completion | Pending',
  'Discrepancy log | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'Engine accuracy approval | Pending',
  'Production engine logic change | Pending',
  'Reference should provide solar-lunar conversion | Pending',
  'Reference should provide year/month/day/hour pillars | Pending',
  'Reference should disclose timezone or 기준 | Pending',
  'Reference should disclose 23시 이후 자시 policy if possible | Pending',
  'Reference should disclose 태양시 보정 policy if possible | Pending',
  'Reference should support 음력/윤달 input or conversion | Pending',
  'External reference 1 | Pending',
  'External reference 2 | Pending',
  'At least two references selected | Pending',
  'This PR defines reference selection criteria only.',
  'This PR is not external reference selection completion.',
  'This PR is not actual external comparison completion.',
  'Snapshot JSON is not regenerated.',
  'CURRENT_FORTUNE_SCHEMA_VERSION is not changed.',
  'schemaVersion is not changed.',
  'Existing localStorage keys are not changed.',
];

const requiredRelatedDocSnippets = [
  'Manseryeok external reference selection criteria: Added',
  'External manseryeok reference selection: Pending',
  'Actual external reference comparison: Pending',
  'Manual comparison sheet completion: Pending',
  'Discrepancy log: Pending',
  '음력/윤달 샘플 외부 검증: Pending',
  '태양시 보정 적용 여부: Pending',
  'Engine accuracy approval: Pending',
  'Production engine logic change: Pending',
];

const requiredRoadmapOnlySnippets = [
  'Today fortune engine improvement: Pending',
  'Year/monthly fortune engine improvement: Pending',
  'Zodiac fortune engine improvement: Pending',
];

const forbiddenSnippets = [
  'External manseryeok reference selection: Confirmed',
  'Actual external reference comparison: Confirmed',
  'Manual comparison sheet completion: Confirmed',
  'Discrepancy log: Confirmed',
  '음력/윤달 샘플 외부 검증: Confirmed',
  '태양시 보정 적용 여부: Confirmed',
  'Engine accuracy approval: Confirmed',
  'Production engine logic change: Confirmed',
  'Today fortune engine improvement: Confirmed',
  'Year/monthly fortune engine improvement: Confirmed',
  'Zodiac fortune engine improvement: Confirmed',
  'schemaVersion changed',
  'CURRENT_FORTUNE_SCHEMA_VERSION changed',
  'birthTimeUnknown 사주 미상 sample',
  'present or 사주 미상 when birthTimeUnknown=true',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const protectedFiles = [
  'src',
  'docs/generated/fortune-engine-sample-snapshot.json',
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

for (const path of [criteriaDocPath, snapshotPath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const criteriaDoc = fs.readFileSync(criteriaDocPath, 'utf8');
const docsToScan = [{ path: criteriaDocPath, source: criteriaDoc }];

if (!checkIncludes('criteria_doc', criteriaDoc, requiredCriteriaSnippets)) hasFailure = true;

for (const path of relatedDocs) {
  const source = fs.readFileSync(path, 'utf8');
  docsToScan.push({ path, source });
  if (!checkIncludes(labelFromSnippet(path), source, requiredRelatedDocSnippets)) hasFailure = true;

  if (path === 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md') {
    if (!checkIncludes(labelFromSnippet(path), source, requiredRoadmapOnlySnippets)) hasFailure = true;
  }
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
  '"check:manseryeok-external-reference-selection-criteria": "node scripts/checkManseryeokExternalReferenceSelectionCriteria.mjs"'
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
  console.error('Manseryeok external reference selection criteria check failed');
  process.exit(1);
}

console.log('Manseryeok external reference selection criteria check passed');
