import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md';

const requiredSections = [
  '# Android Release AAB Workflow Run Result',
  '## Android Release AAB Enforced Rerun Result',
  '## Android Release Signing Enforcement Follow-up',
  '## Purpose',
  '## Android Signed Release AAB Workflow Run Result',
  '## Job Result Summary',
  '## Result Details',
  '## Signing and Upload Status',
  '## Non-Goals for This PR',
];

const requiredSnippets = [
  'Workflow | Confirmed | Android Release AAB',
  'Trigger | Confirmed | workflow_dispatch',
  'Branch | Confirmed | main',
  'Run number | Confirmed | 5',
  'Run id | Confirmed | 28309520915',
  'Commit sha | Confirmed | ed5f2a415de6bd0971274d6f87e4f25f99ae961d',
  'Status | Confirmed | completed',
  'Conclusion | Failed | failure',
  'Failed step | Failed | Validate release signing secrets',
  'Validate release signing secrets | Failed | ANDROID_KEYSTORE_BASE64 is not configured',
  'Restore release keystore | Not reached | skipped',
  'Build signed release AAB | Not reached | skipped',
  'Verify signed release AAB | Not reached | skipped',
  'Upload release AAB | Not reached | skipped',
  'unsigned artifact upload prevention | Confirmed | upload step skipped',
  'signed AAB regeneration | Failed | workflow failure',
  'signed AAB re-verification | Pending | verify step not reached',
  'Artifact created | Not created | artifacts total_count 0',
  'Artifact name | Not created | no artifact',
  'Artifact size | Not created | no artifact',
  'Artifact digest | Pending | no artifact digest',
  'Play Console internal test upload | Pending | not uploaded',
  'real device QA | Pending | not performed',
  'https://github.com/daniel-oh55/saju_fortune/actions/runs/28309520915',
  'Secret 실제값, keystore base64 실제값, signing password, key alias 실제값은 기록하지 않았다.',
  'repository에 `.aab`, `.zip`, `.jks`, `.keystore` 파일을 추가하지 않았다.',
  'signed AAB regeneration Failed는 Play Console 업로드 완료가 아니다.',
  'signed AAB re-verification Pending은 실제 기기 QA 완료가 아니다.',
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
    label: 'literal_base64_secret_value_absent',
    pattern: /ANDROID_KEYSTORE_BASE64:\s*['"]?[A-Za-z0-9+/]{80,}={0,2}/,
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

const protectedPaths = [
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

const diffOutput = execSync(`git diff --name-only -- ${protectedPaths.join(' ')}`, {
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
  console.error('Android release AAB workflow run result check failed');
  process.exit(1);
}

console.log('Android release AAB workflow run result check passed');
