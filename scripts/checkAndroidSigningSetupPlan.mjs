import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_SIGNING_SETUP_PLAN.md';

const requiredSections = [
  '# Android Signing Setup Plan',
  '## Current Signing Status',
  '## Signing Goal',
  '## Candidate GitHub Secrets',
  '## Keystore Policy',
  '## Proposed Future Workflow Approach',
  '## Non-Goals for This PR',
];

const requiredSnippets = [
  '| signing setup applied | Partially added | Gradle release signing config uses environment variables |',
  '| release workflow signing support | Added | GitHub Secrets based workflow support added |',
  '| GitHub Secrets actual input | Confirmed | values entered in repository settings |',
  '| signed AAB 생성 | Confirmed | Android Release AAB run number 4 success |',
  '| signed AAB verification | Failed | jarsigner result: jar is unsigned |',
  '| Play Console internal test upload | Pending | not uploaded |',
  '| real device QA | Pending | not performed |',
  'ANDROID_KEYSTORE_BASE64',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
  'workflow signing support 추가 이후 signed AAB generation은 run number 4에서 Confirmed로 기록했다.',
  'workflow signing support 추가는 Play Console 업로드 완료가 아니다.',
  'workflow signing support 추가는 실제 기기 QA 완료가 아니다.',
  'signed AAB 검증 결과는 Failed로 기록했다.',
  'release workflow signing support: Added',
  'GitHub Secrets 실제 입력: Confirmed',
  'signed AAB 생성: Confirmed',
  'signed AAB 검증: Failed',
  'Play Console 내부 테스트 업로드: Pending',
  'real device QA: Pending',
  'GitHub Secrets 실제값 기록 없음',
  'signed AAB 검증 결과 기록: Failed',
];

const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'release workflow signing support | Pending',
  'GitHub Secrets actual input | Pending',
  'signing 설정: Completed',
  'signed AAB 생성: Completed',
  'signed AAB 검증: Completed',
  'signed AAB verification | Confirmed',
  'Play Console 업로드: Completed',
  '실제 기기 QA: Completed',
];

const forbiddenPatterns = [
  {
    label: 'actual_secret_assignment_absent',
    pattern: /ANDROID_(?:KEYSTORE_BASE64|KEYSTORE_PASSWORD|KEY_ALIAS|KEY_PASSWORD)\s*=\s*['"]?[^\s'"<|`]+/i,
  },
  {
    label: 'long_base64_like_value_absent',
    pattern: /(?:[A-Za-z0-9+/]{80,}={0,2})/,
  },
  {
    label: 'private_keystore_path_absent',
    pattern: /(?:[A-Za-z]:\\|\/(?:Users|home|var|tmp|private)\/)[^\r\n|`<>]*(?:\.jks|\.keystore)/i,
  },
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

for (const { label, pattern } of forbiddenPatterns) {
  const absent = !pattern.test(doc);
  logResult(label, absent);
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
