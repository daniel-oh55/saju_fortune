import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md';

const requiredSections = [
  '# Android Release AAB Artifact QA',
  '## Android Release Signing Enforcement Follow-up',
  '## Artifact Metadata',
  '## Signed AAB Artifact Inspection Result',
  '## Artifact QA Checklist',
  '## Download and Inspection Notes',
  '## Signing and Upload Status',
  '## Non-Goals for This PR',
];

const requiredSnippets = [
  'previous signed AAB verification: Failed',
  'previous jarsigner result summary: `jar is unsigned.`',
  'signing enforcement fix: Added',
  'release signing secrets validation: Added',
  'workflow jarsigner verification step: Added',
  'Gradle release signing env enforcement: Added',
  'signed AAB artifact regeneration: Pending',
  'signed AAB artifact re-inspection: Pending',
  'signed AAB regeneration: Pending',
  'signed AAB re-verification: Pending',
  'Play Console internal test upload: Pending',
  'real device QA: Pending',
  'Run number | 4',
  'Run id | 28293198750',
  'Artifact name | harupuli-release-aab',
  'signed AAB verification | Failed',
  'app-release.aab',
  '6,016,271 bytes',
];

const wrongPhrases = [
  'signed AAB verification | Confirmed',
  'Play Console internal test upload | Confirmed',
  'real device QA | Confirmed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const forbiddenPatterns = [
  {
    label: 'actual_secret_assignment_absent',
    pattern: /ANDROID_(?:KEYSTORE_BASE64|KEYSTORE_PASSWORD|KEY_ALIAS|KEY_PASSWORD)\s*=\s*['"]?[^\s'"<|`]+/i,
  },
  {
    label: 'long_base64_like_value_absent',
    pattern: /[A-Za-z0-9+/]{120,}={0,2}/,
  },
  {
    label: 'private_keystore_path_absent',
    pattern: /(?:[A-Za-z]:\\|\/(?:Users|home|var|tmp|private)\/)[^\r\n|`<>]*(?:\.jks|\.keystore)/i,
  },
  {
    label: 'private_aab_path_absent',
    pattern: /(?:[A-Za-z]:\\|\/(?:Users|home|var|tmp|private)\/)[^\r\n|`<>]*\.aab/i,
  },
];

const protectedFiles = [
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

let hasFailure = false;
const exists = fs.existsSync(docPath);
logResult('android_release_aab_artifact_qa_doc_exists', exists, docPath);
if (!exists) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');

for (const section of requiredSections) {
  const found = doc.includes(section);
  logResult(`doc_includes_${labelFromSnippet(section)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredSnippets) {
  const found = doc.includes(snippet);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of wrongPhrases) {
  const absent = !doc.includes(snippet);
  logResult(`wrong_phrase_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const { label, pattern } of forbiddenPatterns) {
  const absent = !pattern.test(doc);
  logResult(label, absent);
  if (!absent) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('android_manifest_resource_src_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Android release AAB artifact QA check failed');
  process.exit(1);
}

console.log('Android release AAB artifact QA check passed');
