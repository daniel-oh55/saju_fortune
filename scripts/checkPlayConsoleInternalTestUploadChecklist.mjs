import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md';

const requiredSections = [
  '# Play Console Internal Test Upload Checklist',
  '## Purpose',
  '## Current Signed AAB Status',
  '## Pre-upload Checklist',
  '## App Capability Status',
  '## Upload Scope Guardrails',
  '## Upload Result Status',
  '## Non-goals for This PR',
  '## Related Docs',
];

const requiredSnippets = [
  'Android Release AAB run number | Confirmed | 6',
  'Run id | Confirmed | 28310971077',
  'Artifact id | Confirmed | 7930942301',
  'Artifact name | Confirmed | harupuli-release-aab',
  'Artifact size | Confirmed | 5,925,298 bytes',
  'sha256:7a2efee684ee16f85d55de4c2e101c88efbf12611c312c9d73cc75084ffc796c',
  '`.aab` file existence | Confirmed | app-release.aab',
  '`.aab` file size | Confirmed | 6,046,282 bytes',
  'signed AAB re-verification | Confirmed',
  'Play Console app creation | Pending',
  'Privacy policy URL | Pending',
  'Data safety form | Pending',
  'AAB upload to internal test | Pending',
  'Real device install QA | Pending',
  'Server DB | Not used',
  'Login | Not used',
  'Payment SDK | Not used',
  'Ad SDK | Not used',
  'External analytics SDK | Not used',
  'Personal data server transfer | Not used',
  'localStorage usage | Used',
  'Play Console internal test upload은 이번 PR에서 진행하지 않는다.',
  '실제 Google Play Console 입력은 이번 PR에서 진행하지 않는다.',
  '실제 Contact email 값은 문서에 기록하지 않는다.',
  '실제 Privacy policy URL은 확정 전까지 Pending으로 유지한다.',
  '실제 tester email list는 문서에 기록하지 않는다.',
  '`.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않는다.',
  'Secret 실제값은 문서, 코드, PR, 로그에 기록하지 않는다.',
  'Play Console internal test upload | Pending',
  'Actual Google Play Console input | Pending',
  'Internal test rollout | Pending',
  'Real device QA | Pending',
  'Play Console internal test upload',
  'Actual Google Play Console input',
  'AndroidManifest.xml change',
  'Gradle setting change',
  'Production logic change',
];

const relatedDocSnippets = [
  'Play Console internal test upload checklist: Added',
  'Play Console internal test upload: Pending',
  'Actual Google Play Console input: Pending',
  'Real device QA: Pending',
];

const roadmapSnippets = [
  'Play Console 내부 테스트 업로드 체크리스트: Added',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 Google Play Console 입력: Pending',
  '실제 기기 QA: Pending',
];

const forbiddenSnippets = [
  'Play Console internal test upload | Confirmed',
  'Actual Google Play Console input | Confirmed',
  'Internal test rollout | Confirmed',
  'Real device QA | Confirmed',
  'Data safety form | Submitted',
  'Privacy policy URL | Confirmed',
  'Contact email | Confirmed',
  'AAB upload to internal test | Confirmed',
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
    label: 'tester_email_list_absent',
    pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}(?:\s*,\s*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})+/i,
  },
  {
    label: 'confirmed_privacy_policy_url_absent',
    pattern: /Privacy policy URL\s*\|\s*Confirmed\s*\|\s*https?:\/\//i,
  },
];

const protectedFiles = [
  '.github/workflows/android-release-aab.yml',
  'android/app/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
  'src',
];

const relatedDocs = [
  'docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md',
  'docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md',
  'docs/ANDROID_SIGNING_SETUP_PLAN.md',
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
logResult('play_console_internal_test_upload_checklist_doc_exists', exists, docPath);
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

for (const relatedDocPath of relatedDocs) {
  const exists = fs.existsSync(relatedDocPath);
  logResult(`${labelFromSnippet(relatedDocPath)}_exists`, exists);
  if (!exists) {
    hasFailure = true;
    continue;
  }

  const relatedDoc = fs.readFileSync(relatedDocPath, 'utf8');
  for (const snippet of relatedDocSnippets) {
    const found = relatedDoc.includes(snippet);
    logResult(`${labelFromSnippet(relatedDocPath)}_includes_${labelFromSnippet(snippet)}`, found);
    if (!found) hasFailure = true;
  }
}

const roadmap = fs.readFileSync('docs/SAJU_ENGINE_ACCURACY_ROADMAP.md', 'utf8');
for (const snippet of roadmapSnippets) {
  const found = roadmap.includes(snippet);
  logResult(`roadmap_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
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
  console.error('Play Console internal test upload checklist check failed');
  process.exit(1);
}

console.log('Play Console internal test upload checklist check passed');
