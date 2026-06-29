import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/PRIVACY_POLICY_FINAL_CONTENT_REVIEW_READINESS.md';
const confirmedUrl = 'https://saju-fortune-nu.vercel.app/privacy-policy.html';

const requiredSections = [
  '# Privacy Policy Final Content Review Readiness',
  '## Purpose',
  '## Current Public URL Status',
  '## Current Placeholder Status',
  '## Final Content Review Checklist',
  '## Remaining Before Play Console URL Input',
  '## Guardrails',
  '## Non-goals for This PR',
  '## Related Docs',
];

const requiredSnippets = [
  'This document is not final privacy policy content confirmation.',
  `Privacy policy public URL final confirmation | Confirmed | ${confirmedUrl}`,
  'Privacy policy URL Play Console input | Pending',
  'Actual Google Play Console input | Pending',
  'Contact email placeholder | Pending | 문의 이메일: 출시 전 확정 예정',
  'Effective date placeholder | Pending | 시행일: 출시 전 확정 예정',
  'Google Play final review notice | Pending | Google Play 제출 전 최종 검토가 필요합니다.',
  'Privacy policy final content confirmation | Pending',
  'Contact email confirmation | Pending',
  'Effective date confirmation | Pending',
  'Final Content Review Checklist',
  'Contact email replacement | Pending',
  'Effective date replacement | Pending',
  'Final submission notice removal decision | Pending',
  'public/privacy-policy.html final content update | Pending',
  'Data safety form submission | Pending',
  'AAB internal test upload | Pending',
  'Real device QA | Pending',
  'Actual contact email value is not recorded in this PR.',
  'Actual effective date is not recorded in this PR.',
  'public/privacy-policy.html is not changed in this PR.',
  'React routing is not changed.',
  'Production saju/fortune calculation logic is not changed.',
  'schemaVersion and existing localStorage keys are not changed.',
  'Secret actual values are not recorded in docs, code, PR, or logs.',
];

const relatedDocs = [
  {
    path: 'docs/PRIVACY_POLICY_PUBLIC_URL_CONFIRMATION.md',
    snippets: [
      'Privacy policy final content review readiness: Added',
      'Contact email placeholder: Pending',
      'Effective date placeholder: Pending',
      'Privacy policy final content confirmation: Pending',
      'public/privacy-policy.html final content update: Pending',
      'Privacy policy URL Play Console input: Pending',
      'Actual Google Play Console input: Pending',
    ],
  },
  {
    path: 'docs/PRIVACY_POLICY_FINALIZATION_READINESS.md',
    snippets: [
      'Privacy policy final content review readiness: Added',
      'Contact email placeholder: Pending',
      'Effective date placeholder: Pending',
      'Privacy policy final content confirmation: Pending',
      'public/privacy-policy.html final content update: Pending',
      'Play Console URL input: Pending',
      'Contact email: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md',
    snippets: [
      'Privacy policy final content review readiness: Added',
      'Contact email placeholder: Pending',
      'Effective date placeholder: Pending',
      'Contact email confirmation: Pending',
      'Privacy policy final content confirmation: Pending',
      'Privacy policy URL Play Console input: Pending',
      'Data safety form: Pending',
      'AAB upload: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md',
    snippets: [
      'Privacy policy final content review readiness: Added',
      'Contact email confirmation: Pending',
      'Privacy policy final content confirmation: Pending',
      'Data safety form: Pending',
      'Actual Google Play Console input: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md',
    snippets: [
      'Privacy policy final content review readiness: Added',
      'Contact email confirmation: Pending',
      'Privacy policy final content confirmation: Pending',
      'Data safety form: Pending',
      'AAB upload to internal test: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
    snippets: [
      'Privacy policy final content review readiness: Added',
      'Privacy policy final content confirmation: Pending',
      'Contact email confirmation: Pending',
      'Effective date confirmation: Pending',
      'public/privacy-policy.html final content update: Pending',
      'Privacy policy URL Play Console input: Pending',
      'Data safety form submission: Pending',
      'AAB internal test upload: Pending',
      'Real device QA: Pending',
    ],
  },
];

const forbiddenSnippets = [
  'Contact email confirmation | Confirmed',
  'Effective date confirmation | Confirmed',
  'public/privacy-policy.html final content update | Confirmed',
  'Privacy policy URL Play Console input | Confirmed',
  'Actual Google Play Console input | Confirmed',
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
logResult('privacy_policy_final_content_review_readiness_doc_exists', exists, docPath);
if (!exists) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');
const docsToScan = [{ path: docPath, source: doc }];

if (!checkIncludes('doc', doc, requiredSections)) hasFailure = true;
if (!checkIncludes('doc', doc, requiredSnippets)) hasFailure = true;

const publicHtml = fs.readFileSync('public/privacy-policy.html', 'utf8');
const placeholderChecks = [
  '문의 이메일: support.hym@gmail.com',
  '시행일: 2026년6월29일',
];
if (!checkIncludes('public_privacy_policy_html', publicHtml, placeholderChecks)) hasFailure = true;

const removedPlaceholderChecks = [
  '문의 이메일: 출시 전 확정 예정',
  '시행일: 출시 전 확정 예정',
  'Google Play 제출 전 최종 검토가 필요합니다.',
];
for (const snippet of removedPlaceholderChecks) {
  const absent = !publicHtml.includes(snippet);
  logResult(`public_privacy_policy_html_removed_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

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

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('privacy_policy_html_android_native_gradle_routing_source_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
  console.error('Privacy policy final content review readiness check failed');
  process.exit(1);
}

console.log('Privacy policy final content review readiness check passed');
