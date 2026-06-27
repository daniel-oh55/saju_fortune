import fs from 'node:fs';
import { execSync } from 'node:child_process';

const workflowPath = '.github/workflows/android-release-aab.yml';
const gradlePath = 'android/app/build.gradle';
const docPath = 'docs/ANDROID_RELEASE_AAB_WORKFLOW.md';
const releaseWorkflowDesignPath = 'docs/RELEASE_WORKFLOW_DESIGN.md';
const releaseChecklistPath = 'docs/RELEASE_BUILD_SIGNING_CHECKLIST.md';
const roadmapPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';

const requiredPaths = [
  workflowPath,
  gradlePath,
  docPath,
  releaseWorkflowDesignPath,
  releaseChecklistPath,
  roadmapPath,
];

const requiredWorkflowSnippets = [
  'name: Android Release AAB',
  'workflow_dispatch',
  'node-version: 22',
  'npm ci',
  'npm run build',
  'npx cap sync android',
  'Restore release keystore',
  'RUNNER_TEMP',
  'ANDROID_KEYSTORE_BASE64',
  'base64 --decode',
  "printf '%s'",
  'Build signed release AAB',
  'ANDROID_KEYSTORE_FILE',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
  './gradlew bundleRelease',
  'actions/upload-artifact@v4',
  'harupuli-release-aab',
];

const requiredGradleSnippets = [
  'System.getenv("ANDROID_KEYSTORE_FILE")',
  'System.getenv("ANDROID_KEYSTORE_PASSWORD")',
  'System.getenv("ANDROID_KEY_ALIAS")',
  'System.getenv("ANDROID_KEY_PASSWORD")',
  'hasReleaseSigning',
  'storeFile file(releaseKeystoreFile)',
  'storePassword releaseKeystorePassword',
  'keyAlias releaseKeyAlias',
  'keyPassword releaseKeyPassword',
  'signingConfig signingConfigs.release',
];

const forbiddenWorkflowSnippets = [
  'ANDROID_UPLOAD',
  'keystore/upload-keystore.jks',
  'node-version: 20',
  'supply',
  'fastlane',
  'google-play',
  'Play Console upload',
];

const forbiddenGradleSnippets = [
  'ANDROID_UPLOAD',
  'storePassword "',
  "storePassword '",
  'keyPassword "',
  "keyPassword '",
  'keyAlias "',
  "keyAlias '",
  'release-keystore.jks',
];

const forbiddenPatterns = [
  {
    label: 'literal_base64_secret_value_absent',
    pattern: /ANDROID_KEYSTORE_BASE64:\s*['"]?[A-Za-z0-9+/]{80,}={0,2}/,
  },
  {
    label: 'private_keystore_path_absent',
    pattern: /(?:[A-Za-z]:\\|\/(?:Users|home|var|tmp|private)\/)[^\r\n|`<>]*(?:\.jks|\.keystore)/i,
  },
];

const requiredDocSnippets = [
  'GitHub Secrets 기반 signing support: Added',
  'keystore runner temp 임시 복원: Added',
  'release workflow signing support: Added',
  'signed AAB generation: Pending',
  'signed AAB verification: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 기기 QA: Pending',
  'keystore 파일은 repository에 추가하지 않는다.',
  'secrets 값은 log로 출력하지 않는다.',
];

const roadmapSnippets = [
  'GitHub Secrets 실제 입력: Confirmed',
  'release workflow signing 적용: Added',
  'signed AAB 생성: Pending',
  'signed AAB 검증: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 기기 QA: Pending',
];

const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
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

for (const path of requiredPaths) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) process.exit(1);

const workflow = fs.readFileSync(workflowPath, 'utf8');
const gradle = fs.readFileSync(gradlePath, 'utf8');
const doc = fs.readFileSync(docPath, 'utf8');
const roadmap = fs.readFileSync(roadmapPath, 'utf8');

for (const snippet of requiredWorkflowSnippets) {
  const found = workflow.includes(snippet);
  logResult(`workflow_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredGradleSnippets) {
  const found = gradle.includes(snippet);
  logResult(`gradle_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of forbiddenWorkflowSnippets) {
  const absent = !workflow.includes(snippet);
  logResult(`workflow_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const snippet of forbiddenGradleSnippets) {
  const absent = !gradle.includes(snippet);
  logResult(`gradle_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const { label, pattern } of forbiddenPatterns) {
  const absent = !pattern.test(`${workflow}\n${gradle}`);
  logResult(label, absent);
  if (!absent) hasFailure = true;
}

for (const snippet of requiredDocSnippets) {
  const found = doc.includes(snippet);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const path of [releaseWorkflowDesignPath, releaseChecklistPath]) {
  const relatedDoc = fs.readFileSync(path, 'utf8');
  const found = relatedDoc.includes('Android release AAB workflow: docs/ANDROID_RELEASE_AAB_WORKFLOW.md');
  logResult(`${labelFromSnippet(path)}_includes_android_release_aab_workflow_related_doc`, found);
  if (!found) hasFailure = true;
}

for (const snippet of roadmapSnippets) {
  const found = roadmap.includes(snippet);
  logResult(`roadmap_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of wrongPhrases) {
  const absent = !doc.includes(snippet);
  logResult(`wrong_phrase_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const protectedDiff = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = protectedDiff.length === 0;
logResult('android_manifest_resource_src_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

const trackedFiles = execSync('git ls-files', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const statusFiles = execSync('git status --short --untracked-files=all', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''));
const sensitiveFiles = [...trackedFiles, ...statusFiles].filter((path) =>
  ['.aab', '.zip', '.jks', '.keystore'].some((extension) => path.endsWith(extension))
);
const sensitiveFilesAbsent = sensitiveFiles.length === 0;
logResult('artifact_and_keystore_files_not_added_to_repository', sensitiveFilesAbsent);
if (!sensitiveFilesAbsent) hasFailure = true;

if (hasFailure) {
  console.error('Android release AAB workflow check failed');
  process.exit(1);
}

console.log('Android release AAB workflow check passed');
