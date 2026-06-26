import fs from 'node:fs';
import { execSync } from 'node:child_process';

const workflowPath = '.github/workflows/android-release-aab.yml';
const docPath = 'docs/ANDROID_RELEASE_AAB_WORKFLOW.md';
const releaseWorkflowDesignPath = 'docs/RELEASE_WORKFLOW_DESIGN.md';
const releaseChecklistPath = 'docs/RELEASE_BUILD_SIGNING_CHECKLIST.md';
const roadmapPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';

const requiredPaths = [
  workflowPath,
  docPath,
  releaseWorkflowDesignPath,
  releaseChecklistPath,
  roadmapPath,
];

const requiredWorkflowSnippets = [
  'name: Android Release AAB',
  'workflow_dispatch',
  'npm ci',
  'npm run build',
  'npx cap sync android',
  './gradlew bundleRelease',
  'actions/upload-artifact@v4',
  'harupuli-release-aab',
];

const forbiddenWorkflowSnippets = [
  '${{ secrets.',
  'ANDROID_UPLOAD',
  'ANDROID_KEYSTORE',
  'keystore/upload-keystore.jks',
  'Check signing secrets',
  'Restore upload keystore',
];

const requiredSections = [
  '# Android Release AAB Workflow',
  '## Purpose',
  '## Workflow Status',
  '## Workflow File',
  '## Workflow Steps',
  '## Signing Status',
  '## AAB Artifact Status',
  '## Non-Goals for This PR',
  '## Related Docs',
];

const requiredDocSnippets = [
  'Android release AAB workflow 파일 추가: Added',
  'release build 실행 시도: Pending workflow run',
  'signing 설정: Pending',
  'keystore 파일: Pending',
  'GitHub Secrets 실제 입력: Pending',
  'AAB artifact 확인: Pending workflow run',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 기기 QA: Pending',
  'signing 설정 적용 없음',
  'keystore 파일 추가 없음',
  'signing password 기록 없음',
  'GitHub Secrets 실제 입력 없음',
  'Play Console 내부 테스트 업로드 없음',
  'AndroidManifest.xml 변경 없음',
  'Android resource 파일 변경 없음',
];

const relatedDocSnippet = 'Android release AAB workflow: docs/ANDROID_RELEASE_AAB_WORKFLOW.md';

const roadmapSnippets = [
  'Android release AAB workflow 문서: docs/ANDROID_RELEASE_AAB_WORKFLOW.md 참고',
  'Android release AAB workflow 파일 추가: Added',
  'Android release AAB workflow 수동 실행: Pending current workflow run',
  'AAB artifact 확인: Pending current workflow run',
  'signing 설정: Pending',
  'Play Console 내부 테스트 업로드: Pending',
];

const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const androidNativeManifestResourceFiles = [
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

if (hasFailure) {
  process.exit(1);
}

const workflow = fs.readFileSync(workflowPath, 'utf8');
for (const snippet of requiredWorkflowSnippets) {
  const found = workflow.includes(snippet);
  logResult(`workflow_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of forbiddenWorkflowSnippets) {
  const absent = !workflow.includes(snippet);
  logResult(`workflow_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const doc = fs.readFileSync(docPath, 'utf8');
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

for (const path of [releaseWorkflowDesignPath, releaseChecklistPath]) {
  const relatedDoc = fs.readFileSync(path, 'utf8');
  const found = relatedDoc.includes(relatedDocSnippet);
  logResult(`${labelFromSnippet(path)}_includes_android_release_aab_workflow_related_doc`, found);
  if (!found) hasFailure = true;
}

const roadmap = fs.readFileSync(roadmapPath, 'utf8');
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

const androidDiffOutput = execSync(`git diff --name-only -- ${androidNativeManifestResourceFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const androidNativeManifestResourceFilesUnchanged = androidDiffOutput.length === 0;
logResult('android_native_manifest_resource_files_unchanged_in_working_diff', androidNativeManifestResourceFilesUnchanged);
if (!androidNativeManifestResourceFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Android release AAB workflow check failed');
  process.exit(1);
}

console.log('Android release AAB workflow check passed');
