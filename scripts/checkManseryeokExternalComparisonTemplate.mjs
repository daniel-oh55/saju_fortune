import fs from 'node:fs';
import { execSync } from 'node:child_process';

const templateDocPath = 'docs/MANSERYEOK_EXTERNAL_COMPARISON_TEMPLATE.md';
const snapshotPath = 'docs/generated/fortune-engine-sample-snapshot.json';
const relatedDocs = [
  'docs/MANSERYEOK_EXTERNAL_VERIFICATION_PLAN.md',
  'docs/FORTUNE_ENGINE_SAMPLE_SNAPSHOT_QUALITY_REVIEW.md',
  'docs/FORTUNE_ENGINE_SAMPLE_SNAPSHOT_RESULT.md',
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

const requiredTemplateSnippets = [
  '# Manseryeok External Comparison Template',
  'This document is not actual external verification completion and does not approve final engine accuracy.',
  'Manseryeok external comparison template | Added',
  'Actual external reference comparison | Pending',
  'External manseryeok reference selection | Pending',
  'Manual comparison sheet completion | Pending',
  'Discrepancy log | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'Engine accuracy approval | Pending',
  'Production engine logic change | Pending',
  'Snapshot file | docs/generated/fortune-engine-sample-snapshot.json',
  'dateKey | 2026-06-30',
  'targetYear | 2026',
  'engine version | manseryeok_core_v0',
  'library basis | lunar-javascript',
  'Reference source name | Pending',
  'Reference URL or citation | Pending',
  'Reference access date | Pending',
  'Reference 태양시 보정 policy | Pending',
  'Reference 23시 이후 자시 policy | Pending',
  'Match | current snapshot matches external reference',
  'Mismatch | current snapshot differs from external reference',
  'Policy difference | difference caused by 태양시 보정, 절기 기준, timezone, or 23시 이후 자시 policy',
  'This PR adds a manual comparison template only.',
  'This PR is not actual external verification completion.',
  'Snapshot JSON is not regenerated.',
  'CURRENT_FORTUNE_SCHEMA_VERSION is not changed.',
  'schemaVersion is not changed.',
  'Existing localStorage keys are not changed.',
];

const requiredRelatedDocSnippets = [
  'Manseryeok external comparison template: Added',
  'Actual external reference comparison: Pending',
  'External manseryeok reference selection: Pending',
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
  'Actual external reference comparison: Confirmed',
  'External manseryeok reference selection: Confirmed',
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

for (const path of [templateDocPath, snapshotPath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const templateDoc = fs.readFileSync(templateDocPath, 'utf8');
const docsToScan = [{ path: templateDocPath, source: templateDoc }];

if (!checkIncludes('template_doc', templateDoc, requiredTemplateSnippets)) hasFailure = true;

for (const sampleId of sampleIds) {
  const found = templateDoc.includes(sampleId);
  logResult(`template_doc_includes_${sampleId}`, found);
  if (!found) hasFailure = true;
}

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
  '"check:manseryeok-external-comparison-template": "node scripts/checkManseryeokExternalComparisonTemplate.mjs"'
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
  console.error('Manseryeok external comparison template check failed');
  process.exit(1);
}

console.log('Manseryeok external comparison template check passed');
