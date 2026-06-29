import fs from 'node:fs';
import { execSync } from 'node:child_process';

const deploymentDocPath = 'docs/PRIVACY_POLICY_FINAL_HTML_DEPLOYMENT_RECHECK.md';
const publicUrl = 'https://saju-fortune-nu.vercel.app/privacy-policy.html';
const contactEmail = 'support.hym@gmail.com';
const effectiveDate = '2026년6월29일';

const relatedDocs = [
  'docs/PRIVACY_POLICY_CONTACT_EFFECTIVE_DATE_CONFIRMATION.md',
  'docs/PRIVACY_POLICY_FINAL_CONTENT_REVIEW_READINESS.md',
  'docs/PRIVACY_POLICY_PUBLIC_URL_CONFIRMATION.md',
  'docs/PRIVACY_POLICY_FINALIZATION_READINESS.md',
  'docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md',
  'docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md',
  'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const requiredDeploymentDocSnippets = [
  'Privacy policy public URL | Confirmed | https://saju-fortune-nu.vercel.app/privacy-policy.html',
  'Public no-login access | Confirmed',
  'HTTPS access | Confirmed',
  'Desktop browser re-check | Confirmed',
  'Mobile browser re-check | Confirmed',
  `Contact email deployed content check | Confirmed | ${contactEmail}`,
  `Effective date deployed content check | Confirmed | ${effectiveDate}`,
  'Old contact email placeholder removal check | Confirmed',
  'Old effective date placeholder removal check | Confirmed',
  'Google Play final review notice removal check | Confirmed',
  'Privacy policy final content confirmation | Pending',
  'Privacy policy URL Play Console input | Pending',
  'Actual Google Play Console input | Pending',
  'Data safety form submission | Pending',
  'AAB internal test upload | Pending',
  'Real device QA | Pending',
];

const requiredRelatedDocSnippets = [
  'Privacy policy final HTML deployment re-check: Added',
  'Privacy policy final content confirmation: Pending',
  'Privacy policy URL Play Console input: Pending',
  'Actual Google Play Console input: Pending',
];

const forbiddenSnippets = [
  'Privacy policy final content confirmation: Confirmed',
  'Privacy policy final content confirmation | Confirmed',
  'Privacy policy URL Play Console input: Confirmed',
  'Privacy policy URL Play Console input | Confirmed',
  'Actual Google Play Console input: Confirmed',
  'Actual Google Play Console input | Confirmed',
  'Data safety form | Submitted',
  'Data safety form submission | Submitted',
  'AAB upload | Confirmed',
  'AAB internal test upload | Confirmed',
  'Real device QA | Confirmed',
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

const deploymentDocExists = fs.existsSync(deploymentDocPath);
logResult('privacy_policy_final_html_deployment_recheck_doc_exists', deploymentDocExists, deploymentDocPath);
if (!deploymentDocExists) process.exit(1);

const docsToScan = [
  {
    path: deploymentDocPath,
    source: fs.readFileSync(deploymentDocPath, 'utf8'),
  },
];

const deploymentDoc = docsToScan[0].source;
if (!checkIncludes('deployment_doc', deploymentDoc, requiredDeploymentDocSnippets)) hasFailure = true;

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
  '"check:privacy-policy-final-html-deployment-recheck": "node scripts/checkPrivacyPolicyFinalHtmlDeploymentRecheck.mjs"'
);
logResult('package_script_registered', scriptRegistered);
if (!scriptRegistered) hasFailure = true;

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

const publicUrlRecorded = deploymentDoc.includes(publicUrl);
logResult('privacy_policy_public_url_recorded', publicUrlRecorded);
if (!publicUrlRecorded) hasFailure = true;

if (hasFailure) {
  console.error('Privacy policy final HTML deployment re-check failed');
  process.exit(1);
}

console.log('Privacy policy final HTML deployment re-check passed');
