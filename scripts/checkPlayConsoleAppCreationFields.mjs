import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md';

const requiredSections = [
  '# Play Console App Creation Fields',
  '## Purpose',
  '## App Creation Field Status',
  '## App Creation Field Decision Result',
  '## Confirmed Technical Status',
  '## Current App Capability Status',
  '## Guardrails',
  '## Non-goals for This PR',
  '## Related Docs',
];

const requiredSnippets = [
  'App name | Confirmed | 하루풀이',
  'App or game | Confirmed | App',
  'Free or paid | Confirmed | Free',
  'Default language | Confirmed | Korean',
  'App category | Confirmed | Lifestyle',
  'Store listing short description | Pending',
  'Store listing full description | Pending',
  'Contact email | Pending',
  'Privacy policy URL | Pending',
  'Developer name | Pending',
  'Phone screenshots | Pending | 실제 스토어 스크린샷 이미지 제작 필요',
  'Data safety form | Pending',
  'Internal test track | Pending',
  'AAB upload | Pending',
  'Real device QA | Pending',
  '이번 결정은 Play Console 입력 완료가 아니다.',
  '실제 Contact email 값은 문서에 기록하지 않는다.',
  '실제 Privacy policy URL은 확정 전까지 Pending으로 유지한다.',
  '실제 스토어 스크린샷 이미지 제작은 Pending으로 유지한다.',
  'Signed AAB generation | Confirmed',
  'Signed AAB re-verification | Confirmed',
  'AAB filename | Confirmed | app-release.aab',
  'AAB file size | Confirmed | 6,046,282 bytes',
  'Artifact name | Confirmed | harupuli-release-aab',
  'Artifact id | Confirmed | 7930942301',
  'sha256:7a2efee684ee16f85d55de4c2e101c88efbf12611c312c9d73cc75084ffc796c',
  'Server DB | Not used',
  'Login | Not used',
  'Payment SDK | Not used',
  'Ad SDK | Not used',
  'External analytics SDK | Not used',
  'Personal data server transfer | Not used',
  'localStorage usage | Used',
  '실제 Play Console 앱 생성은 이번 PR에서 진행하지 않는다.',
  '실제 Google Play Console 입력은 이번 PR에서 진행하지 않는다.',
  '실제 문의 이메일 값은 문서에 기록하지 않는다.',
  '실제 개인정보 처리방침 URL은 확정 전까지 Pending으로 유지한다.',
  '실제 테스터 이메일 목록은 문서에 기록하지 않는다.',
  '실제 스토어 스크린샷 이미지 제작은 Pending으로 유지한다.',
  'Data safety form 제출은 Pending으로 유지한다.',
  'AAB 내부 테스트 업로드는 Pending으로 유지한다.',
  '실제 기기 QA는 Pending으로 유지한다.',
  '`.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않는다.',
  'Secret 실제값은 문서, 코드, PR, 로그에 기록하지 않는다.',
  'Play Console app creation',
  'Actual Google Play Console input',
  'AndroidManifest.xml change',
  'Android resource change',
  'Gradle setting change',
  'Production logic change',
  'UI/design change',
];

const internalTestUploadSnippets = [
  'Play Console app creation fields checklist: Added',
  'Free or paid: Confirmed',
  'Default language: Confirmed',
  'App category: Confirmed',
  'Play Console app creation: Pending',
  'Actual Google Play Console input: Pending',
  'Contact email: Pending',
  'Privacy policy URL: Pending',
  'Store screenshots upload: Pending',
  'Data safety form: Pending',
  'AAB upload to internal test: Pending',
  'Real device QA: Pending',
];

const roadmapSnippets = [
  'Play Console 앱 생성 입력값 체크리스트: Added',
  'Play Console 앱 생성 입력값 1차 결정: Added',
  'Free or paid 선택: Confirmed',
  'Default language 선택: Confirmed',
  'App category 선택: Confirmed',
  'Play Console 앱 생성: Pending',
  '실제 Google Play Console 입력: Pending',
  '문의 이메일 확정: Pending',
  '개인정보 처리방침 URL 확정: Pending',
  '실제 스토어 스크린샷 이미지 제작: Pending',
  'Data safety form 제출: Pending',
  'AAB 내부 테스트 업로드: Pending',
  '실제 기기 QA: Pending',
];

const forbiddenSnippets = [
  'Play Console app creation | Confirmed',
  'Actual Google Play Console input | Confirmed',
  'Contact email | Confirmed',
  'Privacy policy URL | Confirmed',
  'Developer name | Confirmed',
  'Store screenshots upload | Confirmed',
  'Data safety form | Submitted',
  'AAB upload | Confirmed',
  'Internal test rollout | Confirmed',
  'Real device QA | Confirmed',
  'Play Console upload: Completed',
  '실제 기기 QA: Completed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const forbiddenPatterns = [
  {
    label: 'actual_secret_assignment_absent',
    pattern: /ANDROID_(?:KEYSTORE_BASE64|KEYSTORE_PASSWORD|KEY_ALIAS|KEY_PASSWORD)\s*=\s*['"]?[^\s'"<|`]+/i,
  },
  {
    label: 'long_base64_like_value_absent',
    pattern: /[A-Za-z0-9+/]{120,}={0,2}/,
  },
  {
    label: 'tester_email_list_absent',
    pattern: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}(?:\s*,\s*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})+/i,
  },
  {
    label: 'confirmed_privacy_policy_url_absent',
    pattern: /Privacy policy URL\s*\|\s*Confirmed\s*\|\s*https?:\/\//i,
  },
  {
    label: 'confirmed_contact_email_absent',
    pattern: /Contact email\s*\|\s*Confirmed\s*\|\s*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
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
logResult('play_console_app_creation_fields_doc_exists', exists, docPath);
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

const internalUploadPath = 'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md';
const internalUploadExists = fs.existsSync(internalUploadPath);
logResult('play_console_internal_test_upload_checklist_doc_exists', internalUploadExists, internalUploadPath);
if (!internalUploadExists) {
  hasFailure = true;
} else {
  const internalUploadDoc = fs.readFileSync(internalUploadPath, 'utf8');
  if (!checkIncludes('internal_upload_doc', internalUploadDoc, internalTestUploadSnippets)) hasFailure = true;
}

const roadmapPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';
const roadmapExists = fs.existsSync(roadmapPath);
logResult('saju_engine_accuracy_roadmap_doc_exists', roadmapExists, roadmapPath);
if (!roadmapExists) {
  hasFailure = true;
} else {
  const roadmap = fs.readFileSync(roadmapPath, 'utf8');
  if (!checkIncludes('roadmap', roadmap, roadmapSnippets)) hasFailure = true;
}

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
  console.error('Play Console app creation fields check failed');
  process.exit(1);
}

console.log('Play Console app creation fields check passed');
