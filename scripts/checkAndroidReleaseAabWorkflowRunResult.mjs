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
  '## Current Run Availability Note',
  '## Signing and Upload Status',
  '## Non-Goals for This PR',
  '## Related Docs',
];

const requiredDocSnippets = [
  'Android Release AAB',
  'workflow_dispatch',
  'AAB artifact name | Pending current workflow run',
  'Run number | Pending current workflow run',
  'Status | Pending current workflow run',
  'Conclusion | Pending current workflow run',
  'AAB artifact 확인 | Pending current workflow run',
  'release AAB workflow 수동 실행: Pending current workflow run',
  'AAB artifact 생성: Pending current workflow run',
  '현재 main의 Android Release AAB workflow run 결과 확인을 시도',
  '신규 run 결과는 아직 확인되지 않았다',
  '현재 workflow run 결과로 기록하지 않는다',
  'workflow dispatch는 이 PR에서 수행하지 않았으며',
  'signing 설정: Pending',
  'GitHub Secrets 실제 입력: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 Google Play Console 입력: Pending',
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
  'AAB artifact size: 5,919,891 bytes',
  'sha256:fb84e7dbc831e18982a2ab8a386bae50943fd20dfbb4aae5f1455e2cd9a2eab7',
];

const relatedDocSnippet = 'Android release AAB workflow run result: docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md';

const roadmapSnippets = [
  'Android release AAB workflow 수동 실행 결과 문서: docs/ANDROID_RELEASE_AAB_WORKFLOW_RUN_RESULT.md 참고',
  'Android release AAB workflow 수동 실행: Pending current workflow run',
  'AAB artifact 확인: Pending current workflow run',
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
