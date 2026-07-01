import fs from 'node:fs';
import { execSync } from 'node:child_process';

const candidatesDocPath = 'docs/MANSERYEOK_EXTERNAL_REFERENCE_CANDIDATES.md';
const criteriaDocPath = 'docs/MANSERYEOK_EXTERNAL_REFERENCE_SELECTION_CRITERIA.md';
const snapshotPath = 'docs/generated/fortune-engine-sample-snapshot.json';
const relatedDocs = [
  criteriaDocPath,
  'docs/MANSERYEOK_EXTERNAL_COMPARISON_TEMPLATE.md',
  'docs/MANSERYEOK_EXTERNAL_VERIFICATION_PLAN.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const requiredCandidatesSnippets = [
  '# Manseryeok External Reference Candidates',
  'This document is not actual external comparison completion, manual comparison sheet completion, or final engine accuracy approval.',
  'Manseryeok external reference candidates | Added',
  'External manseryeok reference selection | Candidate recorded',
  'External reference 2 selection | Pending',
  'Actual external reference comparison | Pending',
  'Manual comparison sheet completion | Pending',
  'Discrepancy log | Pending',
  '음력/윤달 샘플 외부 검증 | Pending',
  '태양시 보정 적용 여부 | Pending',
  'Engine accuracy approval | Pending',
  'Production engine logic change | Pending',
  '한국천문연구원 천문우주지식정보 생활천문관',
  'https://astro.kasi.re.kr/life/pageView/5',
  'solar-lunar conversion and ganji/monthly calendar reference',
  'External reference 2 | Pending selection',
  'Candidate 2 Selection Requirements',
  'Timezone / 기준시 policy',
  'Discloses timezone or 기준시 if possible',
  'This PR records external reference candidates only.',
  'This PR is not actual external comparison completion.',
  'This PR is not manual comparison sheet completion.',
  'Snapshot JSON is not regenerated.',
  'CURRENT_FORTUNE_SCHEMA_VERSION is not changed.',
  'schemaVersion is not changed.',
  'Existing localStorage keys are not changed.',
];

const requiredCriteriaSnippets = [
  'Reference should disclose timezone or 기준시 | Pending',
  'Timezone / 기준시 | Pending',
];

const forbiddenCriteriaSnippets = [
  'Reference should disclose timezone or 기준점',
  'Timezone / 기준점',
  'Reference should disclose timezone or 기준 |',
  'Timezone / 기준 |',
];

const requiredRelatedDocSnippets = [
  'Manseryeok external reference candidates: Added',
  'External manseryeok reference selection: Candidate recorded',
  'External reference 2 selection: Pending',
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
  'External reference 2 selection: Confirmed',
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
  'Discloses timezone or 기준점 if possible',
  'Timezone / 기준점 policy',
  '기준점 wording corrected',
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

for (const path of [candidatesDocPath, snapshotPath, ...relatedDocs]) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists, path);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const candidatesDoc = fs.readFileSync(candidatesDocPath, 'utf8');
const criteriaDoc = fs.readFileSync(criteriaDocPath, 'utf8');
const docsToScan = [{ path: candidatesDocPath, source: candidatesDoc }];

if (!checkIncludes('candidates_doc', candidatesDoc, requiredCandidatesSnippets)) hasFailure = true;
if (!checkIncludes('criteria_doc', criteriaDoc, requiredCriteriaSnippets)) hasFailure = true;

for (const snippet of forbiddenCriteriaSnippets) {
  const absent = !criteriaDoc.includes(snippet);
  logResult(`criteria_doc_forbidden_wording_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
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
  '"check:manseryeok-external-reference-candidates": "node scripts/checkManseryeokExternalReferenceCandidates.mjs"'
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
  console.error('Manseryeok external reference candidates check failed');
  process.exit(1);
}

console.log('Manseryeok external reference candidates check passed');
