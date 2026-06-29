import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/PRIVACY_POLICY_CONTACT_EFFECTIVE_DATE_CONFIRMATION.md';
const confirmedUrl = 'https://saju-fortune-nu.vercel.app/privacy-policy.html';
const contactEmailPlaceholder = '<CONFIRMED_CONTACT_EMAIL>';
const effectiveDatePlaceholder = '<CONFIRMED_EFFECTIVE_DATE>';

const requiredSections = [
  '# Privacy Policy Contact and Effective Date Confirmation',
  '## Purpose',
  '## Confirmed Values',
  '## Current Placeholder Replacement Plan',
  '## Remaining Before Final Privacy Policy Content Confirmation',
  '## Guardrails',
  '## Non-goals for This PR',
  '## Related Docs',
];

const requiredSnippets = [
  'This document is not final privacy policy content confirmation.',
  'Contact email confirmation | Confirmed',
  'Effective date confirmation | Confirmed',
  `Privacy policy public URL final confirmation | Confirmed | ${confirmedUrl}`,
  'public/privacy-policy.html final content update | Pending',
  'Privacy policy final content confirmation | Pending',
  'Privacy policy URL Play Console input | Pending',
  'Actual Google Play Console input | Pending',
  'Data safety form submission | Pending',
  'AAB internal test upload | Pending',
  'Real device QA | Pending',
  '문의 이메일: 출시 전 확정 예정 | Confirmed value ready',
  '시행일: 출시 전 확정 예정 | Confirmed value ready',
  'Google Play 제출 전 최종 검토가 필요합니다. | Pending',
  'Contact email replacement in HTML | Pending',
  'Effective date replacement in HTML | Pending',
  'Final submission notice removal decision | Pending',
  'This PR records contact email and effective date confirmation only.',
  'public/privacy-policy.html is not changed in this PR.',
  'React routing is not changed.',
  'Production saju/fortune calculation logic is not changed.',
  'schemaVersion and existing localStorage keys are not changed.',
  'GitHub Secret values are not recorded in docs, code, PR, or logs.',
  'Tester email list is not recorded in this PR.',
  'Signing password, keystore path, key alias, and keystore base64 are not recorded in this PR.',
];

const relatedDocs = [
  'docs/PRIVACY_POLICY_FINAL_CONTENT_REVIEW_READINESS.md',
  'docs/PRIVACY_POLICY_PUBLIC_URL_CONFIRMATION.md',
  'docs/PRIVACY_POLICY_FINALIZATION_READINESS.md',
  'docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md',
  'docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md',
  'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const relatedDocSnippets = [
  'Privacy policy contact and effective date confirmation: Added',
  'Contact email confirmation: Confirmed',
  'Effective date confirmation: Confirmed',
  'Privacy policy final content confirmation: Pending',
];

const forbiddenSnippets = [
  'public/privacy-policy.html final content update | Confirmed',
  'Privacy policy final content confirmation | Confirmed',
  'Privacy policy URL Play Console input | Confirmed',
  'Actual Google Play Console input | Confirmed',
  'Data safety form | Submitted',
  'Data safety form submission | Submitted',
  'AAB upload | Confirmed',
  'AAB upload to internal test | Confirmed',
  'AAB internal test upload | Confirmed',
  'Real device QA | Confirmed',
  'Play Console upload: Completed',
  '실제 기기 QA: Completed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
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
logResult('privacy_policy_contact_effective_date_confirmation_doc_exists', exists, docPath);
if (!exists) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');
const docsToScan = [{ path: docPath, source: doc }];

if (!checkIncludes('doc', doc, requiredSections)) hasFailure = true;
if (!checkIncludes('doc', doc, requiredSnippets)) hasFailure = true;

const contactPlaceholderReplaced = !doc.includes(contactEmailPlaceholder);
logResult('confirmed_contact_email_placeholder_replaced', contactPlaceholderReplaced);
if (!contactPlaceholderReplaced) hasFailure = true;

const effectiveDatePlaceholderReplaced = !doc.includes(effectiveDatePlaceholder);
logResult('confirmed_effective_date_placeholder_replaced', effectiveDatePlaceholderReplaced);
if (!effectiveDatePlaceholderReplaced) hasFailure = true;

const confirmedContactEmailRowPresent =
  /\| Contact email confirmation \| Confirmed \| [A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,} \|/i.test(doc);
logResult('confirmed_contact_email_actual_value_present_in_confirmation_row', confirmedContactEmailRowPresent);
if (!confirmedContactEmailRowPresent) hasFailure = true;

const confirmedEffectiveDateRowPresent =
  /\| Effective date confirmation \| Confirmed \| \d{4}년\d{1,2}월\d{1,2}일 \|/.test(doc);
logResult('confirmed_effective_date_actual_value_present_in_confirmation_row', confirmedEffectiveDateRowPresent);
if (!confirmedEffectiveDateRowPresent) hasFailure = true;

for (const path of relatedDocs) {
  const relatedExists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, relatedExists);
  if (!relatedExists) {
    hasFailure = true;
    continue;
  }

  const relatedDoc = fs.readFileSync(path, 'utf8');
  docsToScan.push({ path, source: relatedDoc });
  if (!checkIncludes(labelFromSnippet(path), relatedDoc, relatedDocSnippets)) hasFailure = true;
}

for (const snippet of forbiddenSnippets) {
  for (const { path, source } of docsToScan) {
    const absent = !source.includes(snippet);
    logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

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
];

for (const { label, pattern } of secretPatterns) {
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
  console.error('Privacy policy contact and effective date confirmation check failed');
  process.exit(1);
}

console.log('Privacy policy contact and effective date confirmation check passed');
