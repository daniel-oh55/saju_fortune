import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md';

const requiredSections = [
  '# Android Release AAB Artifact QA',
  '## Android Release AAB Run 6 Artifact Inspection Result',
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
  'Source workflow | Confirmed | Android Release AAB run number 6',
  'Run id | Confirmed | 28310971077',
  'Artifact id | Confirmed | 7930942301',
  'Artifact name | Confirmed | harupuli-release-aab',
  'Artifact size | Confirmed | 5,925,298 bytes',
  'sha256:7a2efee684ee16f85d55de4c2e101c88efbf12611c312c9d73cc75084ffc796c',
  'artifact download | Confirmed | temporary directory only',
  'artifact extract | Confirmed | temporary directory only',
  '`.aab` file existence | Confirmed | app-release.aab',
  '`.aab` filename | Confirmed | app-release.aab',
  '`.aab` file size | Confirmed | 6,046,282 bytes',
  'artifact zip repository commit | Not committed | zip file not committed',
  '`.aab` repository commit | Not committed | `.aab` file not committed',
  'signed AAB re-verification | Confirmed | workflow jarsigner verified',
  'Play Console internal test upload | Pending | not uploaded',
  'real device QA | Pending | not performed',
  'artifact inspection Confirmed는 Play Console 업로드 완료가 아니다.',
  'artifact inspection Confirmed는 실제 기기 QA 완료가 아니다.',
  'Secret 실제값은 기록하지 않는다.',
];

const forbiddenSnippets = [
  'Play Console internal test upload | Confirmed',
  'real device QA | Confirmed',
  'Play Console upload: Completed',
  '실제 기기 QA: Completed',
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
    label: 'private_keystore_or_aab_path_absent',
    pattern: /(?:[A-Za-z]:\\|\/(?:Users|home|var|tmp|private)\/)[^\r\n|`<>]*(?:\.jks|\.keystore|\.aab)/i,
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
  console.error('Android release AAB artifact QA check failed');
  process.exit(1);
}

console.log('Android release AAB artifact QA check passed');
