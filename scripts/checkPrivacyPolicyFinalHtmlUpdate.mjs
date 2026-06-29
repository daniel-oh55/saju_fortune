import fs from 'node:fs';
import { execSync } from 'node:child_process';

const htmlPath = 'public/privacy-policy.html';
const contactEmail = 'support.hym@gmail.com';
const effectiveDate = '2026년6월29일';

const requiredHtmlSnippets = [
  '하루풀이 개인정보 처리방침',
  `문의 이메일: ${contactEmail}`,
  `시행일: ${effectiveDate}`,
  '서버 DB를 사용하지 않습니다.',
  '로그인 또는 계정 생성을 제공하지 않습니다.',
  '결제 SDK를 사용하지 않습니다.',
  '실제 광고 SDK를 사용하지 않습니다.',
  '외부 분석 SDK를 사용하지 않습니다.',
  '푸시 알림 SDK를 사용하지 않습니다.',
  '개인정보를 서버로 전송하지 않습니다.',
  'localStorage',
];

const forbiddenHtmlSnippets = [
  '문의 이메일: 출시 전 확정 예정',
  '시행일: 출시 전 확정 예정',
  'Google Play 제출 전 최종 검토가 필요합니다.',
  '정적 페이지 초안',
  '<script',
  'https://cdn.',
  'http://cdn.',
  'cdnjs.cloudflare.com',
  'unpkg.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

const relatedDocs = [
  'docs/PRIVACY_POLICY_CONTACT_EFFECTIVE_DATE_CONFIRMATION.md',
  'docs/PRIVACY_POLICY_FINAL_CONTENT_REVIEW_READINESS.md',
  'docs/PRIVACY_POLICY_PUBLIC_URL_CONFIRMATION.md',
  'docs/PRIVACY_POLICY_FINALIZATION_READINESS.md',
  'docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md',
  'docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md',
  'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md',
  'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
];

const requiredRelatedDocSnippets = [
  'public/privacy-policy.html final content update: Confirmed',
  'Privacy policy final content confirmation: Pending',
];

const forbiddenDocSnippets = [
  'Privacy policy final content confirmation | Confirmed',
  'Privacy policy URL Play Console input | Confirmed',
  'Actual Google Play Console input | Confirmed',
  'Data safety form | Submitted',
  'Data safety form submission | Submitted',
  'AAB upload | Confirmed',
  'AAB upload to internal test | Confirmed',
  'AAB internal test upload | Confirmed',
  'Real device QA | Confirmed',
  'Play Console upload: Completed',
  '실제 기기 QA: Completed',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
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

const htmlExists = fs.existsSync(htmlPath);
logResult('public_privacy_policy_html_exists', htmlExists, htmlPath);
if (!htmlExists) process.exit(1);

const html = fs.readFileSync(htmlPath, 'utf8');
if (!checkIncludes('html', html, requiredHtmlSnippets)) hasFailure = true;

for (const snippet of forbiddenHtmlSnippets) {
  const absent = !html.includes(snippet);
  logResult(`html_forbidden_snippet_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const htmlSecretPatterns = [
  {
    label: 'html_secret_assignment_absent',
    pattern: /ANDROID_(?:KEYSTORE_BASE64|KEYSTORE_PASSWORD|KEY_ALIAS|KEY_PASSWORD)\s*=\s*['"]?[^\s'"<|`]+/i,
  },
  {
    label: 'html_long_base64_like_value_absent',
    pattern: /[A-Za-z0-9+/]{120,}={0,2}/,
  },
];

for (const { label, pattern } of htmlSecretPatterns) {
  const absent = !pattern.test(html);
  logResult(label, absent);
  if (!absent) hasFailure = true;
}

const docsToScan = [];
for (const path of relatedDocs) {
  const exists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, exists);
  if (!exists) {
    hasFailure = true;
    continue;
  }

  const doc = fs.readFileSync(path, 'utf8');
  docsToScan.push({ path, source: doc });
  if (!checkIncludes(labelFromSnippet(path), doc, requiredRelatedDocSnippets)) hasFailure = true;
}

for (const snippet of forbiddenDocSnippets) {
  for (const { path, source } of docsToScan) {
    const absent = !source.includes(snippet);
    logResult(`forbidden_doc_snippet_absent_${labelFromSnippet(snippet)}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

const docSecretPatterns = [
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
    pattern: /tester(?:\s+email)?\s+list\s*[:|]\s*[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  },
];

for (const { label, pattern } of docSecretPatterns) {
  for (const { path, source } of docsToScan) {
    const absent = !pattern.test(source);
    logResult(`${label}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('android_native_gradle_routing_source_files_unchanged_in_working_diff', protectedFilesUnchanged);
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
  console.error('Privacy policy final HTML update check failed');
  process.exit(1);
}

console.log('Privacy policy final HTML update check passed');
