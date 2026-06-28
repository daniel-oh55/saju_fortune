import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_SIGNING_SECRETS_CHECKLIST.md';

const requiredSections = [
  '# Android Signing Secrets Checklist',
  '## Android Release AAB Secret Correction Rerun Result',
  '## Android Release AAB Enforced Rerun Result',
  '## Android Release Signing Enforcement Follow-up',
  '## Current Status',
  '## Secrets Input Status',
  '## Candidate Secrets',
  '## Security Rules',
  '## Not Yet Done',
  '## Non-Goals for This PR',
];

const requiredSnippets = [
  'ANDROID_KEYSTORE_BASE64 configuration: Confirmed',
  'Android Release AAB run number 6: completed / success',
  'Run id: 28310971077',
  'Secret actual values: Not recorded',
  'keystore base64 actual value: Not recorded',
  'signing password actual value: Not recorded',
  'key alias actual value: Not recorded',
  'signed AAB regeneration: Confirmed',
  'signed AAB re-verification: Confirmed',
  'signed AAB artifact download/extract: Confirmed',
  '`.aab` file existence: Confirmed',
  '`.aab` filename: app-release.aab',
  '`.aab` file size: 6,046,282 bytes',
  'Play Console internal test upload: Pending',
  'real device QA: Pending',
  'Secret 이름과 설정 여부만 기록하고 실제값은 기록하지 않는다.',
];

const forbiddenSnippets = [
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

let hasFailure = false;
const exists = fs.existsSync(docPath);
logResult('android_signing_secrets_checklist_doc_exists', exists, docPath);
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

for (const snippet of forbiddenSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}`, absent);
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
logResult('workflow_android_gradle_native_src_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Android signing secrets checklist check failed');
  process.exit(1);
}

console.log('Android signing secrets checklist check passed');
