import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/PRIVACY_POLICY_PUBLIC_URL_CONFIRMATION.md';
const confirmedUrl = 'https://saju-fortune-nu.vercel.app/privacy-policy.html';

const requiredSections = [
  '# Privacy Policy Public URL Confirmation',
  '## Purpose',
  '## Public URL Confirmation Status',
  '## Verified Access Checks',
  '## Remaining Before Play Console Privacy URL Input',
  '## Guardrails',
  '## Non-goals for This PR',
  '## Related Docs',
];

const requiredSnippets = [
  'This document is not Google Play Console input completion.',
  'Static page path | Confirmed | public/privacy-policy.html',
  'Public no-login access restore | Confirmed',
  'URL accessibility re-check | Confirmed',
  `Privacy policy public URL final confirmation | Confirmed | ${confirmedUrl}`,
  'Privacy policy URL Play Console input | Pending',
  'Actual Google Play Console input | Pending',
  'Contact email confirmation | Pending',
  'Privacy policy final content confirmation | Confirmed',
  'Data safety form submission | Pending',
  'AAB internal test upload | Pending',
  'Real device QA | Pending',
  'HTTPS access | Confirmed',
  'No-login access | Confirmed',
  'Desktop browser access | Confirmed',
  'Mobile browser access | Confirmed',
  'Page title check | Confirmed | Harupuli privacy policy title returned',
  'Contact email placeholder check | Confirmed | contact email placeholder returned',
  'Effective date placeholder check | Confirmed | effective date placeholder returned',
  'This PR confirms the public privacy policy URL only.',
  'This PR is not Google Play Console input completion.',
  'Actual contact email value is not recorded in this PR.',
  'Actual tester email list is not recorded in this PR.',
  'Data safety form submission remains Pending.',
  'AAB internal test upload remains Pending.',
  'Real device QA remains Pending.',
  'React routing is not changed.',
  'Production saju/fortune calculation logic is not changed.',
  'schemaVersion and existing localStorage keys are not changed.',
  '`.aab`, `.zip`, `.jks`, and `.keystore` files are not added to the repository.',
  'Secret actual values are not recorded in docs, code, PR, or logs.',
];

const relatedDocs = [
  {
    path: 'docs/VERCEL_PUBLIC_ACCESS_UNBLOCK_PLAN.md',
    snippets: [
      'Privacy policy public URL confirmation document: Added',
      'Privacy policy public URL final confirmation: Confirmed',
      'Privacy policy URL Play Console input: Pending',
      'Actual Google Play Console input: Pending',
      'Contact email confirmation: Pending',
      'Data safety form submission: Pending',
      'AAB internal test upload: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/PRIVACY_POLICY_URL_ACCESSIBILITY_CHECK.md',
    snippets: [
      'Privacy policy public URL confirmation document: Added',
      'Privacy policy public URL final confirmation: Confirmed',
      'Privacy policy URL Play Console input: Pending',
      'Actual Google Play Console input: Pending',
      'Contact email confirmation: Pending',
      'Data safety form submission: Pending',
      'AAB internal test upload: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/PRIVACY_POLICY_HOSTING_OPTIONS.md',
    snippets: [
      'Privacy policy public URL confirmation document: Added',
      'Privacy policy public URL final confirmation: Confirmed',
      'Privacy policy URL Play Console input: Pending',
      'Contact email: Pending',
    ],
  },
  {
    path: 'docs/PRIVACY_POLICY_FINALIZATION_READINESS.md',
    snippets: [
      'Privacy policy public URL confirmation document: Added',
      'Privacy policy public URL final confirmation: Confirmed',
      'Privacy policy final content: Pending',
      'Play Console URL input: Pending',
      'Contact email: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md',
    snippets: [
      'Privacy policy public URL confirmation document: Added',
      'Privacy policy public URL final confirmation: Confirmed',
      'Privacy policy URL Play Console input: Pending',
      'Contact email: Pending',
      'Data safety form: Pending',
      'AAB upload: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md',
    snippets: [
      'Privacy policy public URL confirmation document: Added',
      'Privacy policy public URL final confirmation: Confirmed',
      'Contact email: Pending',
      'Data safety form: Pending',
      'Actual Google Play Console input: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md',
    snippets: [
      'Privacy policy public URL confirmation document: Added',
      'Privacy policy public URL final confirmation: Confirmed',
      'Contact email: Pending',
      'Data safety form: Pending',
      'AAB upload to internal test: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
    snippets: [
      'Privacy policy public URL confirmation document: Added',
      'Privacy policy URL confirmation: Confirmed',
      'Privacy policy URL Play Console input: Pending',
      'Contact email confirmation: Pending',
      'Data safety form submission: Pending',
      'AAB internal test upload: Pending',
      'Real device QA: Pending',
    ],
  },
];

const forbiddenSnippets = [
  'Privacy policy URL Play Console input | Confirmed',
  'Actual Google Play Console input | Confirmed',
  'Contact email | Confirmed',
  'Contact email confirmation | Confirmed',
  'Data safety form | Submitted',
  'Data safety form submission | Submitted',
  'AAB upload | Confirmed',
  'AAB internal test upload | Confirmed',
  'Real device QA | Confirmed',
  'Play Console upload: Completed',
  '?ㅼ젣 湲곌린 QA: Completed',
  '?ㅼ젣 ?ㅽ넗???ㅽ겕由곗꺑 ?대?吏 ?쒖옉',
  '?쒖뼇??蹂댁젙 ?곸슜 ?щ?',
  '?묐젰/?뚮젰 ?섑뵆 異붽? 寃利?',
];

const forbiddenPatterns = [
  {
    label: 'actual_email_value_absent',
    pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
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
logResult('privacy_policy_public_url_confirmation_doc_exists', exists, docPath);
if (!exists) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');
const docsToScan = [{ path: docPath, source: doc }];

if (!checkIncludes('doc', doc, requiredSections)) hasFailure = true;
if (!checkIncludes('doc', doc, requiredSnippets)) hasFailure = true;

for (const { path, snippets } of relatedDocs) {
  const relatedExists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, relatedExists);
  if (!relatedExists) {
    hasFailure = true;
    continue;
  }

  const relatedDoc = fs.readFileSync(path, 'utf8');
  docsToScan.push({ path, source: relatedDoc });
  if (!checkIncludes(labelFromSnippet(path), relatedDoc, snippets)) hasFailure = true;
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

for (const { path, source } of docsToScan) {
  const urls = source.match(/https?:\/\/[^\s|)]+/gi) ?? [];
  const unexpectedUrls = urls.filter((url) => url !== confirmedUrl);
  const expectedUrlScope =
    path === docPath ? urls.includes(confirmedUrl) && unexpectedUrls.length === 0 : urls.length === 0;
  logResult(`expected_url_scope_from_${labelFromSnippet(path)}`, expectedUrlScope);
  if (!expectedUrlScope) hasFailure = true;
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
  console.error('Privacy policy public URL confirmation check failed');
  process.exit(1);
}

console.log('Privacy policy public URL confirmation check passed');
