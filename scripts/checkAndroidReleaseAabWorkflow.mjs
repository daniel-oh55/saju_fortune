import fs from 'node:fs';
import { execSync } from 'node:child_process';

const workflowPath = '.github/workflows/android-release-aab.yml';
const gradlePath = 'android/app/build.gradle';
const docPath = 'docs/ANDROID_RELEASE_AAB_WORKFLOW.md';
const roadmapPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';

const requiredPaths = [workflowPath, gradlePath, docPath, roadmapPath];

const requiredWorkflowSnippets = [
  'name: Android Release AAB',
  'workflow_dispatch',
  'node-version: 22',
  'npm ci',
  'npm run build',
  'npx cap sync android',
  'Validate release signing secrets',
  'ANDROID_KEYSTORE_BASE64',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
  'Restore release keystore',
  'RUNNER_TEMP',
  'base64 --decode',
  "printf '%s'",
  'test -s "$RUNNER_TEMP/android-signing/release-keystore.jks"',
  'Build signed release AAB',
  './gradlew bundleRelease',
  'Verify signed release AAB',
  'jarsigner -verify',
  'jar verified.',
  'Upload release AAB',
  'actions/upload-artifact@v4',
  'harupuli-release-aab',
];

const requiredGradleSnippets = [
  'System.getenv("ANDROID_KEYSTORE_FILE")',
  'System.getenv("ANDROID_KEYSTORE_PASSWORD")',
  'System.getenv("ANDROID_KEY_ALIAS")',
  'System.getenv("ANDROID_KEY_PASSWORD")',
  'hasReleaseSigning',
  'isReleaseBuildTask',
  'gradle.startParameter.taskNames',
  'throw new GradleException("Release signing environment variables are required for release builds.")',
  'storeFile file(releaseKeystoreFile)',
  'storePassword releaseKeystorePassword',
  'keyAlias releaseKeyAlias',
  'keyPassword releaseKeyPassword',
  'signingConfig signingConfigs.release',
];

const requiredDocSnippets = [
  'previous signed AAB verification: Failed',
  'previous jarsigner result summary: `jar is unsigned.`',
  'signing enforcement fix: Added',
  'release signing secrets validation: Added',
  'workflow jarsigner verification step: Added',
  'Gradle release signing env enforcement: Added',
  'signed AAB regeneration: Pending',
  'signed AAB re-verification: Pending',
  'Play Console internal test upload: Pending',
  'real device QA: Pending',
  'signing enforcement fix Added는 signed AAB 재검증 완료가 아니다.',
];

const forbiddenSnippets = [
  'node-version: 20',
  'supply',
  'fastlane',
  'google-play',
  'Play Console upload',
  'storePassword "',
  "storePassword '",
  'keyPassword "',
  "keyPassword '",
  'keyAlias "',
  "keyAlias '",
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
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

function checkIncludes(content, snippets, prefix) {
  let failed = false;
  for (const snippet of snippets) {
    const found = content.includes(snippet);
    logResult(`${prefix}_includes_${labelFromSnippet(snippet)}`, found);
    if (!found) failed = true;
  }
  return failed;
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
const combined = `${workflow}\n${gradle}\n${doc}\n${roadmap}`;

hasFailure = checkIncludes(workflow, requiredWorkflowSnippets, 'workflow') || hasFailure;
hasFailure = checkIncludes(gradle, requiredGradleSnippets, 'gradle') || hasFailure;
hasFailure = checkIncludes(`${doc}\n${roadmap}`, requiredDocSnippets, 'docs') || hasFailure;

const verifyIndex = workflow.indexOf('Verify signed release AAB');
const uploadIndex = workflow.indexOf('Upload release AAB');
const uploadAfterVerify = verifyIndex !== -1 && uploadIndex !== -1 && uploadIndex > verifyIndex;
logResult('upload_release_aab_step_after_verify_signed_release_aab_step', uploadAfterVerify);
if (!uploadAfterVerify) hasFailure = true;

for (const snippet of forbiddenSnippets) {
  const absent = !combined.includes(snippet);
  logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const { label, pattern } of forbiddenPatterns) {
  const absent = !pattern.test(combined);
  logResult(label, absent);
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
