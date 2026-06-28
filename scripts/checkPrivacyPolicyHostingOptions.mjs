import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/PRIVACY_POLICY_HOSTING_OPTIONS.md';

const requiredSections = [
  '# Privacy Policy Hosting Options',
  '## Purpose',
  '## Current Status',
  '## Privacy Policy Hosting Decision Result',
  '## Hosting Option Candidates',
  '## Preferred Direction',
  '## Required Follow-up Before URL Confirmation',
  '## Guardrails',
  '## Non-goals for This PR',
  '## Related Docs',
];

const requiredSnippets = [
  'Privacy policy draft | Confirmed',
  'Privacy policy final content | Pending',
  'Hosting option selected | Confirmed | Vercel static privacy page',
  'Preferred hosting option | Confirmed | Vercel static privacy page',
  'Selection reason | Confirmed | Same app/repo deployment flow and PR-based review history',
  'Privacy policy page implementation | Pending | separate PR required',
  'Routing change | Pending | not changed in this PR',
  'Privacy policy public URL | Pending | actual URL not confirmed',
  'Privacy policy URL accessibility check | Pending | not checked',
  'Privacy policy URL Play Console input | Pending | not entered',
  'Contact email | Pending | actual value not recorded',
  'Data safety form | Pending | not submitted',
  'AAB upload | Pending | not uploaded',
  'Real device QA | Pending | not performed',
  'Vercel static privacy page | Candidate',
  'GitHub Pages | Candidate',
  'Google Sites | Candidate',
  'Notion/public document | Candidate',
  'External website | Candidate',
  'Reason | Confirmed | Same app/repo deployment flow and PR-based review history',
  'Actual implementation | Pending',
  'Public URL confirmation | Pending',
  'Accessibility check | Pending',
  'Play Console input | Pending',
  'Privacy policy final content confirmation | Pending',
  'Contact email confirmation | Pending',
  'Hosting implementation PR | Pending',
  'Production deployment check | Pending',
  'Public URL accessibility check | Pending',
  'Mobile browser check | Pending',
  'No-login access check | Pending',
  'HTTPS check | Pending',
  'Play Console URL input | Pending',
  'This decision is not actual privacy policy URL confirmation.',
  'This decision is not privacy policy page implementation completion.',
  'This decision is not routing change completion.',
  'Actual privacy policy page implementation requires a separate PR.',
  'Actual privacy policy public URL confirmation requires a separate PR.',
  'Actual contact email value is not recorded in docs.',
  'Data safety form remains Pending.',
  'AAB internal test upload remains Pending.',
  'Real device QA remains Pending.',
  'Privacy policy page implementation',
  'Privacy policy public URL confirmation',
  'Actual Google Play Console input',
  'routing change',
  'schemaVersion change',
];

const relatedDocs = [
  {
    path: 'docs/PRIVACY_POLICY_FINALIZATION_READINESS.md',
    snippets: [
      'Privacy policy hosting decision: Added',
      'Hosting option selected: Confirmed / Vercel static privacy page',
      'Privacy policy page implementation: Pending',
      'Routing change: Pending',
      'Privacy policy final content: Pending',
      'Privacy policy public URL: Pending',
      'URL accessibility check: Pending',
      'Play Console URL input: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md',
    snippets: [
      'Privacy policy hosting decision: Added',
      'Hosting option selected: Confirmed',
      'Privacy policy public URL: Pending',
      'Privacy policy URL accessibility check: Pending',
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
      'Privacy policy hosting decision: Added',
      'Hosting option selected: Confirmed',
      'Privacy policy public URL: Pending',
      'Contact email: Pending',
      'Data safety form: Pending',
      'Actual Google Play Console input: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md',
    snippets: [
      'Privacy policy hosting decision: Added',
      'Hosting option selected: Confirmed',
      'Privacy policy public URL: Pending',
      'Contact email: Pending',
      'Data safety form: Pending',
      'AAB upload to internal test: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
    snippets: [
      'Privacy policy hosting decision: Added',
      'Privacy policy hosting option selected: Confirmed',
      'Privacy policy hosting option: Vercel static privacy page',
      'Privacy policy page implementation: Pending',
      'Privacy policy URL confirmation: Pending',
      'Privacy policy URL accessibility check: Pending',
      'Privacy policy URL Play Console input: Pending',
      'Contact email confirmation: Pending',
      'Data safety form submission: Pending',
      'AAB internal test upload: Pending',
      'Real device QA: Pending',
    ],
  },
];

const forbiddenSnippets = [
  'Privacy policy public URL | Confirmed',
  'Privacy policy URL Play Console input | Confirmed',
  'Privacy policy page implementation | Confirmed',
  'Routing change | Confirmed',
  'Contact email | Confirmed',
  'Data safety form | Submitted',
  'AAB upload | Confirmed',
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
  'public/privacy',
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
logResult('privacy_policy_hosting_options_doc_exists', exists, docPath);
if (!exists) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');
const relatedDocSources = [];

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
  relatedDocSources.push({ path, source: relatedDoc });
  if (!checkIncludes(labelFromSnippet(path), relatedDoc, snippets)) hasFailure = true;
}

for (const snippet of forbiddenSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const { label, pattern } of forbiddenPatterns) {
  const absentFromDoc = !pattern.test(doc);
  logResult(`${label}_from_main_doc`, absentFromDoc);
  if (!absentFromDoc) hasFailure = true;

  for (const { path, source } of relatedDocSources) {
    const absentFromRelatedDoc = !pattern.test(source);
    logResult(`${label}_from_${labelFromSnippet(path)}`, absentFromRelatedDoc);
    if (!absentFromRelatedDoc) hasFailure = true;
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
  console.error('Privacy policy hosting options check failed');
  process.exit(1);
}

console.log('Privacy policy hosting options check passed');
