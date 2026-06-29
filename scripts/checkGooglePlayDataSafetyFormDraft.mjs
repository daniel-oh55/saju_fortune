import fs from 'node:fs';
import { execSync } from 'node:child_process';

const draftDocPath = 'docs/GOOGLE_PLAY_DATA_SAFETY_FORM_DRAFT.md';

const relatedDocs = [
  'docs/PRIVACY_POLICY_FINAL_CONTENT_CONFIRMATION.md',
  'docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md',
  'docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md',
  'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const requiredDocSnippets = [
  '# Google Play Data Safety Form Draft',
  'This document is not Google Play Console submission completion.',
  'Server DB | Not used',
  'Login/account creation | Not used',
  'Payment SDK | Not used',
  'Actual ad SDK | Not used',
  'External analytics SDK | Not used',
  'Push notification SDK | Not used',
  'Personal data server transfer | Not used',
  'localStorage | Used',
  'Privacy policy final content confirmation | Confirmed',
  'Privacy policy public URL | Confirmed | https://saju-fortune-nu.vercel.app/privacy-policy.html',
  'Data safety form final review | Pending',
  'Actual Google Play Console Data safety input | Pending',
  'Data safety form submission | Pending',
  'Privacy policy URL Play Console input | Pending',
  'AAB internal test upload | Pending',
  'Real device QA | Pending',
  'This PR creates a Data safety form draft only.',
  'public/privacy-policy.html is not changed in this PR.',
  'React routing is not changed.',
  'Production saju/fortune calculation logic is not changed.',
  'schemaVersion and existing localStorage keys are not changed.',
];

const requiredRelatedDocSnippets = [
  'Google Play Data safety form draft: Added',
  'Data safety form final review: Pending',
  'Actual Google Play Console Data safety input: Pending',
  'Data safety form submission: Pending',
  'Privacy policy URL Play Console input: Pending',
  'AAB internal test upload: Pending',
  'Real device QA: Pending',
];

const forbiddenSnippets = [
  'Actual Google Play Console Data safety input: Confirmed',
  'Actual Google Play Console Data safety input | Confirmed',
  'Data safety form submission: Submitted',
  'Data safety form submission | Submitted',
  'Data safety form | Submitted',
  'Privacy policy URL Play Console input: Confirmed',
  'Privacy policy URL Play Console input | Confirmed',
  'Actual Google Play Console input: Confirmed',
  'Actual Google Play Console input | Confirmed',
  'AAB upload | Confirmed',
  'AAB internal test upload | Confirmed',
  'AAB internal test upload: Confirmed',
  'Real device QA | Confirmed',
  'Real device QA: Confirmed',
  'Play Console upload: Completed',
  '실제 기기 QA: Completed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const secretPatterns = [
  {
    label: 'actual_secret_assignment_absent',
    pattern: /ANDROID_(?:KEYSTORE_BASE64|KEYSTORE_PASSWORD|KEY_ALIAS|KEY_PASSWORD)\s*=\s*['"]?[^\s'"<|`]+/i,
  },
  {
    label: 'long_base64_like_value_absent',
    pattern: /[A-Za-z0-9+/]{120,}={0,2}/,
  },
  {
    label: 'tester_email_list_absent',
    pattern: /tester(?:\s+email)?\s+list\s*[:|]\s*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  },
  {
    label: 'keystore_path_absent',
    pattern: /(?:keystore path|keystore_path)\s*[:=]\s*[^\s|`]+/i,
  },
  {
    label: 'signing_password_absent',
    pattern: /(?:signing password|key password|keystore password)\s*[:=]\s*[^\s|`]+/i,
  },
];

const protectedFiles = [
  'public/privacy-policy.html',
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

const draftDocExists = fs.existsSync(draftDocPath);
logResult('google_play_data_safety_form_draft_doc_exists', draftDocExists, draftDocPath);
if (!draftDocExists) process.exit(1);

const docsToScan = [
  {
    path: draftDocPath,
    source: fs.readFileSync(draftDocPath, 'utf8'),
  },
];

if (!checkIncludes('draft_doc', docsToScan[0].source, requiredDocSnippets)) hasFailure = true;

for (const path of relatedDocs) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists);
  if (!exists) {
    hasFailure = true;
    continue;
  }

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

for (const { label, pattern } of secretPatterns) {
  for (const { path, source } of docsToScan) {
    const absent = !pattern.test(source);
    logResult(`${label}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

const packageJson = fs.readFileSync('package.json', 'utf8');
const scriptRegistered = packageJson.includes(
  '"check:google-play-data-safety-form-draft": "node scripts/checkGooglePlayDataSafetyFormDraft.mjs"'
);
logResult('package_script_registered', scriptRegistered);
if (!scriptRegistered) hasFailure = true;

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('privacy_html_android_gradle_routing_source_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
  console.error('Google Play Data safety form draft check failed');
  process.exit(1);
}

console.log('Google Play Data safety form draft check passed');
