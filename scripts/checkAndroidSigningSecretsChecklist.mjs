import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_SIGNING_SECRETS_CHECKLIST.md';

const requiredSections = [
  '# Android Signing Secrets Checklist',
  '## Current Status',
  '## Secrets Input Status',
  '## Candidate Secrets',
  '## Security Rules',
  '## Not Yet Done',
  '## Non-Goals for This PR',
];

const requiredSnippets = [
  '| GitHub Secrets actual input | Confirmed | values entered in repository settings |',
  '| ANDROID_KEYSTORE_BASE64 | Confirmed | Not recorded |',
  '| ANDROID_KEYSTORE_PASSWORD | Confirmed | Not recorded |',
  '| ANDROID_KEY_ALIAS | Confirmed | Not recorded |',
  '| ANDROID_KEY_PASSWORD | Confirmed | Not recorded |',
  '| Secret actual values record | Not recorded | docs/code/PR/logs do not contain values |',
  '| keystore base64 value record | Not recorded | actual base64 not recorded |',
  '| signing password record | Not recorded | actual password not recorded |',
  '| key alias value record | Not recorded | actual alias not recorded |',
  '| release workflow signing support | Added | GitHub Secrets based workflow support added |',
  '| signed AAB generation | Confirmed | Android Release AAB run number 4 success |',
  '| signed AAB verification | Pending | not performed |',
  '| Play Console internal test upload | Pending | not uploaded |',
  '| real device QA | Pending | not performed |',
  'workflow에서만 Secrets를 사용한다.',
  'PR body/log/doc에는 Secret 값을 기록하지 않는다.',
  'GitHub Secrets input Confirmed는 Secret 입력 여부만 의미하며, signed AAB generation Confirmed와 구분한다.',
  'release workflow signing support: Added',
  'signed AAB 생성: Confirmed',
  'signed AAB 검증: Pending',
  'GitHub Secrets 실제값 기록 없음',
  'signed AAB 검증 결과 기록 없음',
];

const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'GitHub Secrets actual input | Pending',
  'GitHub Secrets actual input: Pending',
  'GitHub Secrets 실제 입력: Pending',
  'release workflow signing support | Pending',
  'signed AAB generation | Completed',
  'signed AAB verification | Completed',
  'Play Console internal test upload | Completed',
  'real device QA | Completed',
  'signing 설정: Completed',
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
logResult('android_signing_secrets_checklist_doc_exists', exists, docPath);
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
  console.error('Android signing secrets checklist check failed');
  process.exit(1);
}

console.log('Android signing secrets checklist check passed');
