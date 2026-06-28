import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md';

const requiredSections = [
  '# Android Release AAB Artifact QA',
  '## Android Release AAB Secret Correction Rerun Result',
  '## Android Release AAB Enforced Rerun Result',
  '## Android Release Signing Enforcement Follow-up',
  '## Artifact Metadata',
  '## Signed AAB Artifact Inspection Result',
  '## Artifact QA Checklist',
  '## Download and Inspection Notes',
  '## Signing and Upload Status',
  '## Non-Goals for This PR',
];

const requiredSnippets = [
  'ANDROID_KEYSTORE_BASE64 configuration: Confirmed',
  'Android Release AAB run number 6: completed / success',
  'Run id: 28310971077',
  'signed AAB regeneration: Confirmed',
  'signed AAB re-verification: Confirmed',
  'Artifact count: Confirmed 1',
  'Artifact name: harupuli-release-aab',
  'Artifact size: 5,925,298 bytes',
  'Artifact digest: sha256:7a2efee684ee16f85d55de4c2e101c88efbf12611c312c9d73cc75084ffc796c',
  'signed AAB artifact download/extract: Pending',
  'Play Console internal test upload: Pending',
  'real device QA: Pending',
  'artifact 다운로드/압축 해제 확인은 이번 PR에서 진행하지 않았다.',
  '`.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않았다.',
];

const forbiddenSnippets = [
  'Play Console internal test upload | Confirmed',
  'real device QA | Confirmed',
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

for (const snippet of forbiddenSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('workflow_android_gradle_native_src_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Android release AAB artifact QA check failed');
  process.exit(1);
}

console.log('Android release AAB artifact QA check passed');
