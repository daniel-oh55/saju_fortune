import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/VERCEL_PUBLIC_ACCESS_UNBLOCK_PLAN.md';

const requiredSections = [
  '# Vercel Public Access Unblock Plan',
  '## Purpose',
  '## Current Blocked Status',
  '## Required Vercel Setting Checks',
  '## Vercel Public Access Re-check Result',
  '## Play Console Impact',
  '## Required Follow-up',
  '## Guardrails',
  '## Non-goals for This PR',
  '## Related Docs',
];

const requiredSnippets = [
  'Static page path | Confirmed | public/privacy-policy.html',
  'Vercel production deployment check | Confirmed | deployment exists',
  'HTTPS request | Confirmed | request completed',
  '`/privacy-policy.html` public access | Confirmed | privacy policy page returned without Vercel Login',
  'No-login access | Confirmed | public access available',
  'Desktop browser check | Confirmed | privacy policy page returned',
  'Mobile browser check | Confirmed | privacy policy page returned',
  'Page title check | Confirmed | Harupuli privacy policy title returned',
  'Privacy policy public URL | Pending | actual URL not recorded',
  'Privacy policy URL Play Console input | Pending | not entered',
  'Vercel project access protection check | Confirmed',
  'Production deployment public access check | Confirmed',
  'Password protection check | Confirmed',
  'Vercel authentication/login requirement check | Confirmed',
  'Production redeploy after setting change | Pending',
  '`/privacy-policy.html` no-login re-check | Confirmed',
  'Desktop browser re-check | Confirmed',
  'Mobile browser re-check | Confirmed',
  'HTTPS re-check | Confirmed',
  'Vercel protection setting review | Confirmed | checked in Vercel dashboard',
  'Public no-login access restore | Confirmed | privacy policy page returned without Vercel Login',
  'Actual Vercel URL string | Not recorded | keep URL out of repository docs',
  'Privacy policy public URL final confirmation | Pending',
  'Public no-login access restore Confirmed is not Play Console URL input completion.',
  'Public no-login access restore Confirmed is not privacy policy public URL final confirmation.',
  'The actual Vercel URL string is not recorded in repository docs.',
  'Actual contact email value is not recorded in repository docs.',
  'Play Console privacy policy URL readiness | Pending',
  'Privacy policy final URL confirmation | Pending',
  'Play Console URL input | Pending',
  'Actual Google Play Console input | Pending',
  'Data safety form submission | Pending',
  'AAB internal test upload | Pending',
  'Real device QA | Pending',
  'Vercel protection setting review | Confirmed',
  'Public no-login access restore | Confirmed',
  'URL accessibility re-check | Confirmed',
  'Privacy policy public URL final confirmation | Pending',
  'This PR is not a Vercel setting change completion record.',
  'The actual Vercel URL string is not recorded in this PR.',
  'The actual privacy policy URL is not confirmed in this PR.',
  'Actual Google Play Console input is not performed in this PR.',
  'Actual contact email value is not recorded in this PR.',
  'Privacy policy final content remains Pending.',
  'Data safety form submission remains Pending.',
  'AAB internal test upload remains Pending.',
  'Real device QA remains Pending.',
  'React routing is not changed.',
  'Production saju/fortune calculation logic is not changed.',
  'schemaVersion and existing localStorage keys are not changed.',
  'Secret actual values are not recorded in docs, code, PR, or logs.',
];

const relatedDocs = [
  'docs/PRIVACY_POLICY_URL_ACCESSIBILITY_CHECK.md',
  'docs/PRIVACY_POLICY_HOSTING_OPTIONS.md',
  'docs/PRIVACY_POLICY_FINALIZATION_READINESS.md',
  'docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md',
  'docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md',
  'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const relatedRequiredSnippets = [
  'Vercel public access unblock plan: Added',
  'Vercel public access re-check result: Added',
];

const forbiddenSnippets = [
  'Vercel setting change confirmation | Confirmed',
  'Privacy policy public URL | Confirmed',
  'Privacy policy public URL final confirmation | Confirmed',
  'Privacy policy URL Play Console input | Confirmed',
  'Actual Google Play Console input | Confirmed',
  'Contact email | Confirmed',
  'Data safety form | Submitted',
  'AAB upload | Confirmed',
  'Real device QA | Confirmed',
  'Play Console upload: Completed',
  '실제 기기 QA: Completed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const forbiddenPatterns = [
  {
    label: 'actual_email_value_absent',
    pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  },
  {
    label: 'actual_url_value_absent',
    pattern: /https?:\/\/[^\s)]+/i,
  },
  {
    label: 'actual_secret_assignment_absent',
    pattern: /ANDROID_(?:KEYSTORE_BASE64|KEYSTORE_PASSWORD|KEY_ALIAS|KEY_PASSWORD)\s*=\s*['"]?[^\s'"<|`]+/i,
  },
  {
    label: 'long_base64_like_value_absent',
    pattern: /[A-Za-z0-9+/]{120,}={0,2}/,
  },
];

const protectedFiles = [
  '.github/workflows/android-release-aab.yml',
  'android/app/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
  'src',
];

function logResult(label, passed, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${passed ? 'pass' : 'fail'}${suffix}`);
}

function labelFromSnippet(snippet) {
  return snippet
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^\p{L}\p{N}_/-]/gu, '')
    .slice(0, 80);
}

function checkIncludes(sourceLabel, source, snippets) {
  let failed = false;
  for (const snippet of snippets) {
    const found = source.includes(snippet);
    logResult(`${sourceLabel}_includes_${labelFromSnippet(snippet)}`, found);
    if (!found) failed = true;
  }
  return !failed;
}

let hasFailure = false;

const exists = fs.existsSync(docPath);
logResult('vercel_public_access_unblock_plan_doc_exists', exists, docPath);
if (!exists) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');
const docsToScan = [{ path: docPath, source: doc }];

if (!checkIncludes('doc', doc, requiredSections)) hasFailure = true;
if (!checkIncludes('doc', doc, requiredSnippets)) hasFailure = true;

for (const path of relatedDocs) {
  const relatedExists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, relatedExists);
  if (!relatedExists) {
    hasFailure = true;
    continue;
  }

  const relatedDoc = fs.readFileSync(path, 'utf8');
  docsToScan.push({ path, source: relatedDoc });
  if (!checkIncludes(labelFromSnippet(path), relatedDoc, relatedRequiredSnippets)) hasFailure = true;
}

for (const snippet of forbiddenSnippets) {
  for (const { path, source } of docsToScan) {
    const absent = !source.includes(snippet);
    logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

for (const { label, pattern } of forbiddenPatterns) {
  for (const { path, source } of docsToScan) {
    const absent = !pattern.test(source);
    logResult(`${label}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('android_native_gradle_routing_source_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
  console.error('Vercel public access unblock plan check failed');
  process.exit(1);
}

console.log('Vercel public access unblock plan check passed');

