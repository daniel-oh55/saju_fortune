import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md';

const requiredSections = [
  '# Android Release AAB Artifact QA',
  '## Purpose',
  '## Artifact Metadata',
  '## Artifact QA Checklist',
  '## Download and Inspection Notes',
  '## Signing and Upload Status',
  '## Non-Goals for This PR',
  '## Related Docs',
];

const requiredSnippets = [
  'Run number | 3',
  'Status | completed',
  'Conclusion | success',
  'Artifact name | harupuli-release-aab',
  'Artifact size | 5.6 MB',
  'sha256:64ba8d4739cb7716893a4bd4a55e8bdcd26a0139febf8a40c6bb86caec45b9b7',
  'Artifact 확인 | Confirmed',
  'AAB artifact 생성은 Play Console 업로드 완료가 아니다',
  'AAB artifact 생성은 실제 기기 QA 완료가 아니다',
  'AAB artifact 생성은 signing 설정 완료가 아니다',
  'artifact 다운로드 | Pending',
  'artifact 압축 해제 | Pending',
  '`.aab` 파일 존재 확인 | Pending',
  'Play Console 업로드 가능 여부 | Pending',
  'signing 상태 확인 | Pending',
  '실제 기기 QA | Pending',
  'signing 설정: Pending',
  'GitHub Secrets 실제 입력: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 Google Play Console 입력: Pending',
  'workflow 파일 변경 없음',
  'signing 설정 적용 없음',
  'keystore 파일 추가 없음',
  'signing password 기록 없음',
  'GitHub Secrets 실제 입력 없음',
  'AndroidManifest.xml 변경 없음',
  'Android resource 파일 변경 없음',
  'Gradle 설정 변경 없음',
];

const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const protectedFiles = [
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

for (const snippet of wrongPhrases) {
  const absent = !doc.includes(snippet);
  logResult(`wrong_phrase_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('workflow_android_gradle_production_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Android release AAB artifact QA check failed');
  process.exit(1);
}

console.log('Android release AAB artifact QA check passed');
