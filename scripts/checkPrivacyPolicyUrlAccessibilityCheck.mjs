import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/PRIVACY_POLICY_URL_ACCESSIBILITY_CHECK.md';

const requiredSections = [
  '# Privacy Policy URL Accessibility Check',
  '## Purpose',
  '## Static Page Status',
  '## Accessibility Check Result',
  '## Public URL Status',
  '## Remaining Before Play Console Input',
  '## Guardrails',
];

const requiredSnippets = [
  'Static page path | Confirmed | public/privacy-policy.html',
  'Deployment target | Confirmed | Vercel static privacy page',
  'React routing change | Not changed | src routing untouched',
  'Privacy policy page draft implementation | Confirmed | static HTML draft exists',
  'Privacy policy final content | Pending | not finalized',
  'Contact email | Pending | actual value not recorded',
  'Effective date | Pending | actual value not recorded',
  'Play Console URL input | Pending | not entered',
  'Vercel production deployment check | Confirmed',
  '`/privacy-policy.html` desktop access | Blocked',
  '`/privacy-policy.html` mobile access | Blocked',
  'HTTPS access | Confirmed',
  'No-login access | Blocked',
  'Desktop browser check | Blocked',
  'Mobile browser check | Blocked',
  'Page title check | Blocked',
  'Contact email placeholder check | Blocked',
  'Effective date placeholder check | Blocked',
  'Privacy policy public URL | Pending | actual URL not recorded in this PR',
  'Privacy policy URL accessibility check | Blocked | deployment is not yet usable as a public Play Console privacy URL',
  'Privacy policy URL Play Console input | Pending | not entered',
  'Actual Google Play Console input | Pending | not completed',
  'Data safety form | Pending | not submitted',
  'AAB upload to internal test | Pending',
  'Real device QA | Pending',
  'Do not record the actual Vercel URL string in this PR.',
  'Do not record an actual contact email value.',
  'Do not change React routing, production saju logic, Android native files, Android resources, or Gradle settings.',
];

const relatedDocs = [
  {
    path: 'docs/PRIVACY_POLICY_HOSTING_OPTIONS.md',
    snippets: [
      'Privacy policy URL accessibility check document: Added',
      'Vercel public access re-check result: Added',
      'Vercel production deployment check: Confirmed',
      'Privacy policy public URL: Pending',
      'Privacy policy URL Play Console input: Pending',
      'Contact email: Pending',
    ],
  },
  {
    path: 'docs/PRIVACY_POLICY_FINALIZATION_READINESS.md',
    snippets: [
      'Privacy policy URL accessibility check document: Added',
      'Vercel public access re-check result: Added',
      'Vercel production deployment check: Confirmed',
      'Privacy policy final content: Pending',
      'Privacy policy public URL: Pending',
      'Play Console URL input: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md',
    snippets: [
      'Privacy policy URL accessibility check document: Added',
      'Vercel public access re-check result: Added',
      'Vercel production deployment check: Confirmed',
      'Contact email: Pending',
      'Privacy policy public URL: Pending',
      'Privacy policy URL Play Console input: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md',
    snippets: [
      'Privacy policy URL accessibility check document: Added',
      'Vercel public access re-check result: Added',
      'Vercel production deployment check: Confirmed',
      'Privacy policy public URL: Pending',
      'Actual Google Play Console input: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md',
    snippets: [
      'Privacy policy URL accessibility check document: Added',
      'Vercel public access re-check result: Added',
      'Vercel production deployment check: Confirmed',
      'Privacy policy URL: Pending',
      'AAB upload to internal test: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
    snippets: [
      'Privacy policy URL accessibility check document: Added',
      'Vercel public access re-check result: Added',
      'Privacy policy static page path: public/privacy-policy.html',
      'Privacy policy Vercel production deployment check: Confirmed',
      'Privacy policy public no-login access restore: Confirmed',
      'Privacy policy URL accessibility re-check: Confirmed',
      'Privacy policy URL confirmation: Pending',
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
logResult('privacy_policy_url_accessibility_check_doc_exists', exists, docPath);
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
  console.error('Privacy policy URL accessibility check failed');
  process.exit(1);
}

console.log('Privacy policy URL accessibility check passed');

