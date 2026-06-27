import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_KEYSTORE_GENERATION_STORAGE_PLAN.md';

const requiredSections = [
  '# Android Keystore Generation Storage Plan',
  '## Purpose',
  '## Current Status',
  '## Decision Result',
  '## Proposed Keystore Generation Method',
  '## Storage Policy',
  '## Backup Policy',
  '## Candidate GitHub Secrets Mapping',
  '## Decision Checklist',
  '## Non-Goals for This PR',
  '## Follow-up PR Order',
  '## Related Docs',
];

const requiredSnippets = [
  '| AAB signing verification result | Confirmed | Unsigned |',
  '| keystore generation plan | Draft |',
  '| keystore generation decision | Decided |',
  '| keystore generation | Pending |',
  '| keystore storage decision | Decided |',
  '| keystore backup decision | Decided |',
  '이번 결정은 실제 keystore 생성이 아니라 생성/보관/백업 방식의 운영 기준 결정이다.',
  '| keystore 생성 방식 | local secure environment에서 JDK keytool 사용 | Decided |',
  '| keystore 생성 명령 | keytool 기반 생성 방식 사용 | Decided |',
  '| keystore 파일 repository commit 여부 | commit하지 않음 | Decided |',
  '| `.jks` 파일 repository commit 여부 | commit하지 않음 | Decided |',
  '| `.keystore` 파일 repository commit 여부 | commit하지 않음 | Decided |',
  '| keystore 보관 방식 | 비공개 안전 위치에 보관 | Decided |',
  '| keystore backup 방식 | 별도 비공개 안전 위치에 백업 | Decided |',
  '| password 보관 방식 | password manager 또는 내부 보안 저장소 사용 | Decided |',
  '| GitHub Actions 사용 방식 | keystore 원본 대신 base64 Secret 후보 사용 | Decided |',
  '| GitHub Secrets 실제 입력 | Pending | Not started |',
  '| release workflow signing 적용 | Pending | Not started |',
  '| signed AAB 생성 | Pending | Not started |',
  '실제 keystore 파일은 이번 PR에서 생성하지 않는다.',
  '실제 keystore 파일은 repository에 commit하지 않는다.',
  '실제 keystore 보관 위치는 문서에 기록하지 않는다.',
  '실제 password는 문서, 코드, PR, 로그에 기록하지 않는다.',
  '실제 keystore base64 값은 문서, 코드, PR, 로그에 기록하지 않는다.',
  'GitHub Secrets 실제 입력은 별도 작업에서 진행한다.',
  'signing 설정 적용은 별도 PR에서 진행한다.',
  'keytool -genkeypair',
  '이 명령은 예시이며 이번 PR에서 실행하지 않는다.',
  '실제 alias, password, 파일명은 문서에 기록하지 않는다.',
  'keystore 파일은 repository에 commit하지 않는다.',
  '`.jks` 파일은 repository에 commit하지 않는다.',
  '`.keystore` 파일은 repository에 commit하지 않는다.',
  'base64 실제값은 문서, 코드, PR, 로그에 기록하지 않는다.',
  '실제 보관 위치, 비밀번호, recovery owner 개인 정보는 repository 문서에 기록하지 않는다.',
  'ANDROID_KEYSTORE_BASE64',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
  '| keystore 생성 담당자 | Decided | 실제 개인 정보 기록 금지 |',
  '| keystore 생성 환경 | Decided | local secure environment |',
  '| keystore 파일명 정책 | Decided | 실제 파일명 문서 기록 금지 |',
  '| key alias 정책 | Decided | 실제 alias 문서 기록 금지 |',
  '| password 보관 방식 | Decided | 내부 보안 저장소 사용 |',
  '| primary backup 위치 | Decided | 실제 경로 기록 금지 |',
  '| secondary backup 위치 | Decided | 실제 경로 기록 금지 |',
  '| GitHub Secrets 입력 시점 | Pending | 별도 PR 이후 |',
  '| workflow signing 적용 시점 | Pending | 별도 PR |',
  'Secret 이름만 기록한다.',
  '실제 Secret 값은 기록하지 않는다.',
  'keystore 파일 실제 생성 없음',
  'keystore 파일 추가 없음',
  'keystore 파일 commit 없음',
  '`.jks` 파일 commit 없음',
  '`.keystore` 파일 commit 없음',
  'signing password 기록 없음',
  'keystore base64 실제값 기록 없음',
  'GitHub Secrets 실제 입력 없음',
  'signing 설정 적용 없음',
  'workflow 파일 변경 없음',
  'Gradle 설정 변경 없음',
  'AndroidManifest.xml 변경 없음',
  'Android resource 파일 변경 없음',
  'Play Console 내부 테스트 업로드 없음',
  '실제 기기 QA 없음',
];

const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'keystore generation | Completed',
  'GitHub Secrets actual input | Completed',
  'release workflow signing support | Completed',
  'signed AAB generation | Completed',
  'Play Console internal test upload | Completed',
  'real device QA | Completed',
  'signing 설정: Completed',
  'GitHub Secrets 실제 입력: Completed',
  'keystore 파일 생성: Completed',
  'keystore 파일 추가: Completed',
  'Play Console 업로드: Completed',
  '실제 기기 QA: Completed',
  'keystore 생성: Completed',
  'keystore 파일 추가: Completed',
  'GitHub Secrets 실제 입력: Completed',
  'signing 설정: Completed',
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
  console.error('Android keystore generation storage plan check failed');
  process.exit(1);
}

console.log('Android keystore generation storage plan check passed');
