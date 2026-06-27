import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md';

const requiredSections = [
  '# Android Release AAB Workflow Run Result',
  '## Android Release Signing Enforcement Follow-up',
  '## Purpose',
  '## Android Signed Release AAB Workflow Run Result',
  '## Job Result Summary',
  '## Result Details',
  '## Signing and Upload Status',
  '## Non-Goals for This PR',
];

const requiredSnippets = [
  'previous signed AAB verification: Failed',
  'previous jarsigner result summary: `jar is unsigned.`',
  'run number 4 signed AAB verification: Failed',
  'signing enforcement fix: Added',
  'release signing secrets validation: Added',
  'workflow jarsigner verification step: Added',
  'Gradle release signing env enforcement: Added',
  'next signed AAB workflow rerun: Pending',
  'signed AAB regeneration: Pending',
  'next signed AAB verification: Pending',
  'signed AAB re-verification: Pending',
  'Play Console internal test upload: Pending',
  'real device QA: Pending',
  'Run number | 4',
  'Run id | 28293198750',
  'Conclusion | success',
  'jarsigner result | Failed',
  'signed AAB verification | Failed',
];

const wrongPhrases = [
  'Run number | 1',
  'Run number | 2',
  'Run number | 3',
  'Conclusion | failure',
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
    label: 'literal_base64_secret_value_absent',
    pattern: /ANDROID_KEYSTORE_BASE64:\s*['"]?[A-Za-z0-9+/]{80,}={0,2}/,
  },
  {
    label: 'private_keystore_path_absent',
    pattern: /(?:[A-Za-z]:\\|\/(?:Users|home|var|tmp|private)\/)[^\r\n|`<>]*(?:\.jks|\.keystore)/i,
  },
];

const protectedPaths = [
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
logResult('android_release_aab_workflow_run_result_doc_exists', exists, docPath);
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

const diffOutput = execSync(`git diff --name-only -- ${protectedPaths.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('android_manifest_resource_src_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Android signed AAB workflow run result check failed');
  process.exit(1);
}

console.log('Android signed AAB workflow run result check passed');
