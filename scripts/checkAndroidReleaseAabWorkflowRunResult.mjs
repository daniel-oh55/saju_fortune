import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md';
const androidReleaseWorkflowDocPath = 'docs/ANDROID_RELEASE_AAB_WORKFLOW.md';
const artifactQaDocPath = 'docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md';
const signingSetupPlanPath = 'docs/ANDROID_SIGNING_SETUP_PLAN.md';
const signingSecretsChecklistPath = 'docs/ANDROID_SIGNING_SECRETS_CHECKLIST.md';
const roadmapPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';

const requiredPaths = [
  docPath,
  androidReleaseWorkflowDocPath,
  artifactQaDocPath,
  signingSetupPlanPath,
  signingSecretsChecklistPath,
  roadmapPath,
];

const requiredSections = [
  '# Android Release AAB Workflow Run Result',
  '## Purpose',
  '## Android Signed Release AAB Workflow Run Result',
  '## Job Result Summary',
  '## Result Details',
  '## Signing and Upload Status',
  '## Non-Goals for This PR',
  '## Related Docs',
];

const requiredDocSnippets = [
  'Workflow | Android Release AAB',
  'Trigger | workflow_dispatch',
  'Branch | main',
  'Run number | 4',
  'Run id | 28293198750',
  'Commit sha | fbf84f5102b75e2b999902b4c4755ba8214d60ef',
  'Status | completed',
  'Conclusion | success',
  'release workflow signing support | Added',
  'signed AAB generation | Confirmed',
  'Artifact name | harupuli-release-aab',
  'Artifact size | 5,875,942 bytes',
  'Artifact digest | sha256:6a88573362f259fe6797a4c28a40678a32770e571714a5dd51a47a7351564b98',
  'signed AAB artifact download | Confirmed',
  'signed AAB artifact extract | Confirmed',
  '`.aab` file existence | Confirmed',
  '`.aab` filename | app-release.aab',
  '`.aab` file size | 6,016,271 bytes',
  'jarsigner result | Failed',
  'signed AAB verification | Failed',
  'Play Console internal test upload | Pending',
  'real device QA | Pending',
  'https://github.com/daniel-oh55/saju_fortune/actions/runs/28293198750',
  'Restore release keystore | success',
  'Build signed release AAB | success',
  'Upload release AAB | success',
  'signed AAB generation Confirmed is not Play Console upload complete.',
  'signed AAB generation Confirmed is not signed AAB verification complete.',
  'signed AAB generation Confirmed is not real device QA complete.',
  'signed AAB artifact inspection Confirmed is not signed AAB verification complete.',
  'signed AAB verification Failed는 Play Console upload complete가 아니다.',
  'GitHub Secrets actual values record: 없음',
  'keystore 파일 추가 없음',
  'signing password 기록 없음',
  'AndroidManifest.xml 변경 없음',
  'Android resource 파일 변경 없음',
  'Gradle 설정 변경 없음',
  'production 계산 로직 변경 없음',
  'UI/디자인 변경 없음',
];

const relatedDocSnippets = [
  'Android Release AAB run number 4: completed / success',
  'signed AAB generation: Confirmed',
  'Artifact digest: sha256:6a88573362f259fe6797a4c28a40678a32770e571714a5dd51a47a7351564b98',
];

const roadmapSnippets = [
  'release workflow signing 적용: Added',
  'signed AAB 생성: Confirmed',
  'signed AAB 검증: Failed',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 Google Play Console 입력: Pending',
  '실제 기기 QA: Pending',
  'Android Release AAB run number: 4',
  'AAB artifact 확인: Confirmed',
  'AAB artifact digest: sha256:6a88573362f259fe6797a4c28a40678a32770e571714a5dd51a47a7351564b98',
];

const forbiddenDocSnippets = [
  'Run number | 1',
  'Run number | 2',
  'Run number | 3',
  'Run id | 28225624458',
  '28225624458',
  'sha256:64ba8d4739cb7716893a4bd4a55e8bdcd26a0139febf8a40c6bb86caec45b9b7',
  'Conclusion | failure',
  'AAB artifact 확인 | Not created',
  'Play Console upload: Completed',
  'Play Console 내부 테스트 업로드: Completed',
  'real device QA | Completed',
  'signed AAB verification | Confirmed',
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
    label: 'private_keystore_path_absent',
    pattern: /(?:[A-Za-z]:\\|\/(?:Users|home|var|tmp|private)\/)[^\r\n|`<>]*(?:\.jks|\.keystore)/i,
  },
];

const protectedPaths = [
  '.github/workflows/android-release-aab.yml',
  'android/app/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
  'android/build.gradle',
  'android/gradle.properties',
  'android/settings.gradle',
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

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

let hasFailure = false;

for (const path of requiredPaths) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) {
  process.exit(1);
}

const doc = read(docPath);

for (const section of requiredSections) {
  const found = doc.includes(section);
  logResult(`doc_includes_${labelFromSnippet(section)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredDocSnippets) {
  const found = doc.includes(snippet);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`doc_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const { label, pattern } of forbiddenPatterns) {
  const absent = !pattern.test(doc);
  logResult(label, absent);
  if (!absent) hasFailure = true;
}

const relatedDocs = [
  androidReleaseWorkflowDocPath,
  artifactQaDocPath,
  signingSetupPlanPath,
  signingSecretsChecklistPath,
];

for (const path of relatedDocs) {
  const content = read(path);
  for (const snippet of relatedDocSnippets) {
    const found = content.includes(snippet);
    logResult(`${labelFromSnippet(path)}_includes_${labelFromSnippet(snippet)}`, found);
    if (!found) hasFailure = true;
  }
}

const roadmap = read(roadmapPath);
for (const snippet of roadmapSnippets) {
  const found = roadmap.includes(snippet);
  logResult(`roadmap_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${protectedPaths.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('workflow_android_gradle_production_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

const statusOutput = execSync('git status --short', { encoding: 'utf8' });
const artifactFileTracked = /\.(?:aab|zip|jks|keystore)$/im.test(statusOutput);
logResult('no_aab_zip_jks_keystore_in_git_status', !artifactFileTracked);
if (artifactFileTracked) hasFailure = true;

if (hasFailure) {
  console.error('Android signed AAB workflow run result check failed');
  process.exit(1);
}

console.log('Android signed AAB workflow run result check passed');
