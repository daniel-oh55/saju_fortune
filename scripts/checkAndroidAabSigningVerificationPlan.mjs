import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_AAB_SIGNING_VERIFICATION_PLAN.md';

const requiredSections = [
  '# Android AAB Signing Verification Plan',
  '## Purpose',
  '## Current Artifact Status',
  '## Signing Verification Questions',
  '## Proposed Verification Commands',
  '## Signing Verification Result',
  '## Expected Result Categories',
  '## Secret and Keystore Policy',
  '## Current Pending Items',
  '## Non-Goals for This PR',
  '## Related Docs',
];

const requiredSnippets = [
  'app-release.aab',
  '| AAB 파일 크기 | Confirmed | 6,016,271 bytes |',
  '| signing 상태 확인 | Confirmed | jarsigner 기준 Unsigned |',
  '| Play Console 업로드 가능 여부 | Pending |',
  'upload key/keystore 필요 여부: Pending',
  'GitHub Secrets 필요 여부: Pending',
  'jarsigner -verify -verbose -certs app-release.aab',
  'apksigner verify --verbose app-release.aab',
  'signing 검증 명령 실제 실행: Confirmed',
  'jarsigner 실행 가능 여부: Confirmed',
  'jarsigner result: Unsigned',
  'jarsigner result summary: `jar is unsigned.`',
  'apksigner 실행 가능 여부: Not available',
  'apksigner result: Not available',
  'signing 상태 확인 결과: Unsigned',
  'signing setup plan: Required',
  'Play Console 업로드 가능 여부: Pending',
  'GitHub Secrets 실제 입력: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 Google Play Console 입력: Pending',
  '실제 기기 QA: Pending',
  'Signed는 Play Console 업로드 완료가 아니다.',
  'Signed는 실제 기기 QA 완료가 아니다.',
  'Unsigned는 바로 signing 설정을 적용한다는 뜻이 아니다.',
  'keystore 파일을 repository에 commit하지 않는다.',
  'signing password를 코드, 문서, 로그에 기록하지 않는다.',
  'GitHub Secrets 실제값을 문서에 기록하지 않는다.',
  'signing 설정 적용 없음',
  'keystore 파일 추가 없음',
  'signing password 기록 없음',
  'GitHub Secrets 실제 입력 없음',
  'workflow 파일 변경 없음',
  'AndroidManifest.xml 변경 없음',
  'Android resource 파일 변경 없음',
  'Gradle 설정 변경 없음',
  'artifact zip 파일 commit 없음',
  '`.aab` 파일 commit 없음',
];

const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'signing 상태 확인: Completed',
  'Play Console 업로드 가능 여부: Completed',
  '실제 기기 QA: Completed',
  'GitHub Secrets 실제 입력: Completed',
  'keystore 파일 추가: Completed',
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
logResult('android_aab_signing_verification_plan_doc_exists', exists, docPath);
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

const trackedFiles = execSync('git ls-files', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const statusFiles = execSync('git status --short --untracked-files=all', { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''));
const artifactFiles = [...trackedFiles, ...statusFiles].filter((path) =>
  path.endsWith('.aab') || path.endsWith('.zip')
);
const artifactFilesAbsent = artifactFiles.length === 0;
logResult('artifact_zip_and_aab_files_not_added_to_repository', artifactFilesAbsent);
if (!artifactFilesAbsent) hasFailure = true;

if (hasFailure) {
  console.error('Android AAB signing verification plan check failed');
  process.exit(1);
}

console.log('Android AAB signing verification plan check passed');
