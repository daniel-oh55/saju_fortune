import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_RELEASE_AAB_ARTIFACT_QA.md';

const requiredSections = [
  '# Android Release AAB Artifact QA',
  '## Artifact Metadata',
  '## Artifact QA Checklist',
  '## Download and Inspection Notes',
  '## Signing and Upload Status',
  '## Non-Goals for This PR',
];

const requiredSnippets = [
  'Run number | 3',
  'Status | completed',
  'Conclusion | success',
  'Artifact name | harupuli-release-aab',
  'Artifact size | 5.6 MB',
  'sha256:64ba8d4739cb7716893a4bd4a55e8bdcd26a0139febf8a40c6bb86caec45b9b7',
  'app-release.aab',
  '6,016,271 bytes',
  'repository commit 여부: artifact zip과 `.aab` 파일은 commit하지 않음',
  'release workflow signing support: Added',
  'signing 설정: Added',
  'GitHub Secrets 실제 입력: Confirmed',
  'signed AAB generation: Pending',
  'signed AAB artifact QA: Pending',
  'signed AAB verification: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 Google Play Console 입력: Pending',
  '실제 기기 QA: Pending',
  'signed AAB 생성 결과 기록 없음',
  'signed AAB 검증 결과 기록 없음',
  'keystore 파일 추가 없음',
  'signing password 기록 없음',
  'GitHub Secrets 실제값 기록 없음',
  'AndroidManifest.xml 변경 없음',
  'Android resource 파일 변경 없음',
];

const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'signing 설정: Completed',
  'Play Console 업로드: Completed',
  '실제 기기 QA: Completed',
];

const protectedFiles = [
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
logResult('android_non_signing_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
logResult('artifact_and_keystore_files_not_added_to_repository', artifactFilesAbsent);
if (!artifactFilesAbsent) hasFailure = true;

if (hasFailure) {
  console.error('Android release AAB artifact QA check failed');
  process.exit(1);
}

console.log('Android release AAB artifact QA check passed');
