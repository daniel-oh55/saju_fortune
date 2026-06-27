import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_KEYSTORE_GENERATION_STORAGE_PLAN.md';

const requiredSections = [
  '# Android Keystore Generation Storage Plan',
  '## Current Status',
  '## Decision Result',
  '## Generation Status',
  '## Storage Policy',
  '## Candidate GitHub Secrets Mapping',
  '## Non-Goals for This PR',
];

const requiredSnippets = [
  '| keystore generation | Confirmed |',
  '| keystore actual generation | Confirmed |',
  '| keystore storage | Confirmed |',
  '| keystore backup storage | Confirmed |',
  '| GitHub Secrets actual input | Confirmed | values entered in repository settings |',
  '| release workflow signing support | Added | GitHub Secrets based workflow support added |',
  '| release workflow signing 적용 | Added | workflow support added |',
  '| signed AAB generation | Pending | not generated |',
  '| signing password record | Not recorded | password not recorded in docs/code/PR/logs |',
  '| key alias record | Not recorded | actual alias not recorded |',
  '| keystore base64 value record | Not recorded | actual base64 not recorded |',
  'workflow signing support는 추가되었다.',
  'signed AAB generation remains Pending.',
  'signed AAB verification remains Pending.',
  '실제 keystore 파일명은 기록하지 않는다.',
  '실제 keystore 저장 경로는 기록하지 않는다.',
  '실제 signing password는 기록하지 않는다.',
  '실제 keystore base64 값은 기록하지 않는다.',
  'ANDROID_KEYSTORE_BASE64',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
  'Secret 이름만 기록한다.',
  '실제 Secret 값은 기록하지 않는다.',
  'GitHub Secrets 실제값 기록 없음',
  'signed AAB 생성 결과 기록 없음',
];

const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'release workflow signing support | Pending',
  'GitHub Secrets actual input | Completed',
  'signed AAB generation | Completed',
  'Play Console internal test upload | Completed',
  'real device QA | Completed',
  'upload-keystore.jks',
  '-alias upload',
  'keystore 생성: Completed',
  'keystore 파일 추가: Completed',
  'signing 설정: Completed',
  'Play Console 업로드: Completed',
  '실제 기기 QA: Completed',
];

const forbiddenPatterns = [
  {
    label: 'windows_private_keystore_path_absent',
    pattern: /[A-Za-z]:\\[^\r\n|`<>]*(?:\.jks|\.keystore)/i,
  },
  {
    label: 'unix_private_keystore_path_absent',
    pattern: /\/(?:Users|home|var|tmp|private)\/[^\r\n|`<>]*(?:\.jks|\.keystore)/i,
  },
  {
    label: 'actual_secret_assignment_absent',
    pattern: /ANDROID_(?:KEYSTORE_BASE64|KEYSTORE_PASSWORD|KEY_ALIAS|KEY_PASSWORD)\s*=\s*['"]?[^\s'"<|`]+/i,
  },
  {
    label: 'long_base64_like_value_absent',
    pattern: /(?:[A-Za-z0-9+/]{80,}={0,2})/,
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
logResult('android_keystore_generation_storage_plan_doc_exists', exists, docPath);
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
  console.error('Android keystore generation storage plan check failed');
  process.exit(1);
}

console.log('Android keystore generation storage plan check passed');
