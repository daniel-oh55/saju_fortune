import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md';

const requiredSections = [
  '# Play Console Contact and Privacy Readiness',
  '## Purpose',
  '## Current Status',
  '## Contact Email Readiness',
  '## Privacy Policy URL Readiness',
  '## Current App Data Handling Summary',
  '## Guardrails',
  '## Non-goals for This PR',
  '## Related Docs',
];

const requiredSnippets = [
  'App name | Confirmed | 하루풀이',
  'Free or paid | Confirmed | Free',
  'Default language | Confirmed | Korean',
  'App category | Confirmed | Lifestyle',
  'Contact email | Pending | actual value not recorded',
  'Privacy policy URL | Pending | actual URL not confirmed',
  'Actual Google Play Console input | Pending',
  'Data safety form | Pending',
  'AAB upload | Pending',
  'Real device QA | Pending',
  'Contact email candidate selected | Pending',
  'Contact email accessibility check | Pending',
  'Contact email Play Console input | Pending',
  'Contact email actual value in repository | Not recorded',
  'Privacy policy draft | Confirmed',
  'Privacy policy final content | Pending',
  'Privacy policy hosting location | Pending',
  'Privacy policy public URL | Pending',
  'Privacy policy URL accessibility check | Pending',
  'Privacy policy URL Play Console input | Pending',
  'Privacy policy actual URL in repository | Not recorded',
  'Server DB | Not used',
  'Login | Not used',
  'Payment SDK | Not used',
  'Ad SDK | Not used',
  'External analytics SDK | Not used',
  'Personal data server transfer | Not used',
  'localStorage usage | Used',
  '실제 문의 이메일 값은 이번 PR에서 기록하지 않는다.',
  '실제 개인정보 처리방침 URL은 확정 전까지 Pending으로 유지한다.',
  '실제 테스터 이메일 목록은 이번 PR에서 기록하지 않는다.',
  '실제 Play Console 앱 생성은 이번 PR에서 진행하지 않는다.',
  '실제 Google Play Console 입력은 이번 PR에서 진행하지 않는다.',
  'Data safety form 제출은 Pending으로 유지한다.',
  'AAB 내부 테스트 업로드는 Pending으로 유지한다.',
  '실제 기기 QA는 Pending으로 유지한다.',
  '`.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않는다.',
  'Secret 실제값은 문서, 코드, PR, 로그에 기록하지 않는다.',
  'Contact email final confirmation',
  'Privacy policy URL final confirmation',
  'Actual Google Play Console input',
  'AndroidManifest.xml change',
  'Production logic change',
];

const appCreationSnippets = [
  'Contact and privacy readiness checklist: Added',
  'Contact email candidate selected: Pending',
  'Contact email Play Console input: Pending',
  'Privacy policy final content: Pending',
  'Privacy policy public URL: Pending',
  'Privacy policy URL Play Console input: Pending',
  'Actual Google Play Console input: Pending',
  'Real device QA: Pending',
];

const internalUploadSnippets = [
  'Contact and privacy readiness checklist: Added',
  'Contact email: Pending',
  'Privacy policy URL: Pending',
  'Data safety form: Pending',
  'AAB upload to internal test: Pending',
  'Real device QA: Pending',
];

const roadmapSnippets = [
  '문의 이메일 / 개인정보 처리방침 URL 확정 준비 체크리스트: Added',
  '문의 이메일 후보 확정: Pending',
  '문의 이메일 Play Console 입력: Pending',
  '개인정보 처리방침 최종 내용 확정: Pending',
  '개인정보 처리방침 URL 확정: Pending',
  '개인정보 처리방침 URL Play Console 입력: Pending',
  'Data safety form 제출: Pending',
  'AAB 내부 테스트 업로드: Pending',
  '실제 기기 QA: Pending',
];

const forbiddenSnippets = [
  'Contact email | Confirmed',
  'Privacy policy URL | Confirmed',
  'Contact email candidate selected | Confirmed',
  'Privacy policy public URL | Confirmed',
  'Actual Google Play Console input | Confirmed',
  'Data safety form | Submitted',
  'AAB upload | Confirmed',
  'Real device QA | Confirmed',
  'Play Console upload: Completed',
  '실제 기기 QA: Completed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const forbiddenPatterns = [
  {
    label: 'actual_email_value_absent',
    pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  },
  {
    label: 'actual_url_value_absent',
    pattern: /https?:\/\/[^\s)]+/i,
  },
  {
    label: 'actual_secret_assignment_absent',
    pattern: /ANDROID_(?:KEYSTORE_BASE64|KEYSTORE_PASSWORD|KEY_ALIAS|KEY_PASSWORD)\s*=\s*['"]?[^\s'"<|`]+/i,
  },
  {
    label: 'long_base64_like_value_absent',
    pattern: /[A-Za-z0-9+/]{120,}={0,2}/,
  },
];

const protectedFiles = [
  '.github/workflows/android-release-aab.yml',
  'android/app/build.gradle',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
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

function checkIncludes(sourceLabel, source, snippets) {
  let failed = false;
  for (const snippet of snippets) {
    const found = source.includes(snippet);
    logResult(`${sourceLabel}_includes_${labelFromSnippet(snippet)}`, found);
    if (!found) failed = true;
  }
  return !failed;
}

let hasFailure = false;

const exists = fs.existsSync(docPath);
logResult('play_console_contact_privacy_readiness_doc_exists', exists, docPath);
if (!exists) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');

if (!checkIncludes('doc', doc, requiredSections)) hasFailure = true;
if (!checkIncludes('doc', doc, requiredSnippets)) hasFailure = true;

for (const snippet of forbiddenSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const { label, pattern } of forbiddenPatterns) {
  const absent = !pattern.test(doc);
  logResult(label, absent);
  if (!absent) hasFailure = true;
}

const appCreationPath = 'docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md';
const appCreationDoc = fs.readFileSync(appCreationPath, 'utf8');
if (!checkIncludes('app_creation_doc', appCreationDoc, appCreationSnippets)) hasFailure = true;

const internalUploadPath = 'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md';
const internalUploadDoc = fs.readFileSync(internalUploadPath, 'utf8');
if (!checkIncludes('internal_upload_doc', internalUploadDoc, internalUploadSnippets)) hasFailure = true;

const roadmapPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';
const roadmap = fs.readFileSync(roadmapPath, 'utf8');
if (!checkIncludes('roadmap', roadmap, roadmapSnippets)) hasFailure = true;

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('android_native_gradle_production_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
logResult('artifact_zip_and_keystore_files_not_added_to_repository', artifactFilesAbsent);
if (!artifactFilesAbsent) hasFailure = true;

if (hasFailure) {
  console.error('Play Console contact and privacy readiness check failed');
  process.exit(1);
}

console.log('Play Console contact and privacy readiness check passed');
