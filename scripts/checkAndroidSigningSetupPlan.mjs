import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_SIGNING_SETUP_PLAN.md';

const requiredSections = [
  '# Android Signing Setup Plan',
  '## Purpose',
  '## Current Signing Status',
  '## Signing Goal',
  '## Required Decisions',
  '## Candidate GitHub Secrets',
  '## Keystore Policy',
  '## Proposed Future Workflow Approach',
  '## Non-Goals for This PR',
  '## Follow-up PR Order',
  '## Related Docs',
];

const requiredSnippets = [
  '| jarsigner result | Confirmed | Unsigned |',
  '| signing status result | Confirmed | Unsigned |',
  '| signing setup plan | Required |',
  '| signing setup applied | Pending |',
  '| keystore file | Pending |',
  '| signing password | Pending |',
  '| GitHub Secrets actual input | Pending |',
  '| Play Console internal test upload | Pending |',
  'ANDROID_KEYSTORE_BASE64',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
  '실제 값이 아니다.',
  'keystore 파일은 repository에 commit하지 않는다.',
  'signing password는 코드, 문서, 로그에 기록하지 않는다.',
  'GitHub Secrets 실제값은 문서에 기록하지 않는다.',
  'signing 설정 적용 없음',
  'keystore 파일 생성 없음',
  'keystore 파일 추가 없음',
  'GitHub Secrets 실제 입력 없음',
  'workflow 파일 변경 없음',
  'Gradle 설정 변경 없음',
  'AndroidManifest.xml 변경 없음',
  'Android resource 파일 변경 없음',
  'Play Console 내부 테스트 업로드 없음',
  '실제 기기 QA 없음',
  'artifact zip 파일 commit 없음',
  '`.aab` 파일 commit 없음',
];

const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'signing 설정: Completed',
  'GitHub Secrets 실제 입력: Completed',
  'keystore 파일 추가: Completed',
  'Play Console 업로드: Completed',
  '실제 기기 QA: Completed',
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
logResult('android_signing_setup_plan_doc_exists', exists, docPath);
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
const sensitiveFiles = [...trackedFiles, ...statusFiles].filter((path) =>
  ['.aab', '.zip', '.jks', '.keystore'].some((extension) => path.endsWith(extension))
);
const sensitiveFilesAbsent = sensitiveFiles.length === 0;
logResult('artifact_and_keystore_files_not_added_to_repository', sensitiveFilesAbsent);
if (!sensitiveFilesAbsent) hasFailure = true;

if (hasFailure) {
  console.error('Android signing setup plan check failed');
  process.exit(1);
}

console.log('Android signing setup plan check passed');
