import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md';
const androidReleaseWorkflowDocPath = 'docs/ANDROID_RELEASE_AAB_WORKFLOW.md';
const releaseWorkflowDesignPath = 'docs/RELEASE_WORKFLOW_DESIGN.md';
const releaseChecklistPath = 'docs/RELEASE_BUILD_SIGNING_CHECKLIST.md';
const roadmapPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';

const requiredPaths = [
  docPath,
  androidReleaseWorkflowDocPath,
  releaseWorkflowDesignPath,
  releaseChecklistPath,
  roadmapPath,
];

const requiredSections = [
  '# Android Release AAB Workflow Run Result',
  '## Purpose',
  '## Workflow Run Summary',
  '## Result Details',
  '## Actual Current Run Note',
  '## Signing and Upload Status',
  '## Non-Goals for This PR',
  '## Related Docs',
];

const requiredDocSnippets = [
  'Android Release AAB',
  'workflow_dispatch',
  'Run number | 3',
  'Status | completed',
  'Conclusion | success',
  'AAB artifact name | harupuli-release-aab',
  'AAB artifact 확인 | Confirmed',
  'release AAB workflow 수동 실행: Completed',
  'AAB artifact 생성: Confirmed',
  'AAB artifact size: 5.6 MB',
  'sha256:64ba8d4739cb7716893a4bd4a55e8bdcd26a0139febf8a40c6bb86caec45b9b7',
  'GitHub Actions run number: 3',
  'run number 3은 success로 완료',
  '이전 run number 2의 Node.js 버전 오류는 PR #184에서 Node.js 22로 보정했다',
  'harupuli-release-aab` artifact가 생성되었다',
  'AAB artifact 생성은 Play Console 업로드 완료가 아니다',
  'signing 설정과 Play Console 업로드 가능 여부는 별도 검토가 필요하다',
  'signing 설정: Pending',
  'GitHub Secrets 실제 입력: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 Google Play Console 입력: Pending',
  '실제 기기 QA: Pending',
  'workflow 파일 변경 없음',
  'signing 설정 적용 없음',
  'keystore 파일 추가 없음',
  'signing password 기록 없음',
  'GitHub Secrets 실제 입력 없음',
  'Play Console 내부 테스트 업로드 없음',
  'AndroidManifest.xml 변경 없음',
  'Android resource 파일 변경 없음',
  'Gradle 설정 변경 없음',
];

const forbiddenDocSnippets = [
  '28070724112',
  'Check signing secrets',
  'Restore upload keystore',
  'Run number | 1',
  'Run number | 2',
  'Conclusion | failure',
  'AAB artifact 확인 | Not created',
  'AAB artifact size: 5,919,891 bytes',
  'sha256:fb84e7dbc831e18982a2ab8a386bae50943fd20dfbb4aae5f1455e2cd9a2eab7',
  'signing 설정: Completed',
  'Play Console 업로드: Completed',
  '실제 기기 QA: Completed',
];

const relatedDocSnippet = 'Android release AAB workflow run result: docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md';

const roadmapSnippets = [
  'Android release AAB workflow 수동 실행 결과 문서: docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md 참고',
  'Android release AAB workflow 수동 실행: completed / success',
  'Android Release AAB run number: 3',
  'AAB artifact 확인: Confirmed',
  'AAB artifact name: harupuli-release-aab',
  'signing 설정: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 기기 QA: Pending',
];

const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const unchangedFiles = [
  '.github/workflows/android-release-aab.yml',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
  'android/app/build.gradle',
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

let hasFailure = false;

for (const path of requiredPaths) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) {
  process.exit(1);
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

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`doc_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const path of [androidReleaseWorkflowDocPath, releaseWorkflowDesignPath]) {
  const relatedDoc = fs.readFileSync(path, 'utf8');
  const found = relatedDoc.includes(relatedDocSnippet);
  logResult(`${labelFromSnippet(path)}_includes_android_release_aab_workflow_run_result_related_doc`, found);
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

const diffOutput = execSync(`git diff --name-only -- ${unchangedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('workflow_android_gradle_production_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Android release AAB workflow run result check failed');
  process.exit(1);
}

console.log('Android release AAB workflow run result check passed');
