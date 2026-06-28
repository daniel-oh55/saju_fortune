import fs from 'node:fs';
import { execSync } from 'node:child_process';

const htmlPath = 'public/privacy-policy.html';
const buildOutputPath = 'dist/privacy-policy.html';

const htmlRequiredSnippets = [
  '하루풀이 개인정보 처리방침',
  '서버 DB를 사용하지 않습니다.',
  '로그인 또는 계정 생성을 제공하지 않습니다.',
  '결제 SDK를 사용하지 않습니다.',
  '실제 광고 SDK를 사용하지 않습니다.',
  '외부 분석 SDK를 사용하지 않습니다.',
  '푸시 알림 SDK를 사용하지 않습니다.',
  '개인정보를 서버로 전송하지 않습니다.',
  'localStorage',
  '프로필 생년월일, 성별, 달력 유형',
  '저장된 오늘운세, 동의 및 환경설정',
  '문의 이메일: 출시 전 확정 예정',
  '시행일: 출시 전 확정 예정',
  'Google Play 제출 전 최종 검토가 필요합니다.',
];

const relatedDocs = [
  {
    path: 'docs/PRIVACY_POLICY_HOSTING_OPTIONS.md',
    snippets: [
      'Static privacy policy page draft | Added',
      'Static page path | Confirmed | public/privacy-policy.html',
      'Privacy policy page draft implementation | Confirmed',
      'Routing change | Not changed',
      'Privacy policy final content | Pending',
      'Privacy policy public URL | Pending',
      'Privacy policy URL accessibility check | Pending',
      'Privacy policy URL Play Console input | Pending',
      'Contact email | Pending',
      'Data safety form | Pending',
      'AAB upload | Pending',
      'Real device QA | Pending',
      'Static page draft implementation Confirmed is not privacy policy final content Confirmed.',
      'Static page draft implementation Confirmed is not public URL Confirmed.',
      'Static page draft implementation Confirmed is not Play Console input completion.',
      'Actual contact email value is not recorded.',
    ],
  },
  {
    path: 'docs/PRIVACY_POLICY_FINALIZATION_READINESS.md',
    snippets: [
      'Static privacy policy page draft: Added',
      'Static page path: Confirmed / public/privacy-policy.html',
      'Privacy policy page draft implementation: Confirmed',
      'Routing change: Not changed',
      'Privacy policy final content: Pending',
      'Contact email: Pending',
      'Privacy policy public URL: Pending',
      'URL accessibility check: Pending',
      'Play Console URL input: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md',
    snippets: [
      'Static privacy policy page draft: Added',
      'Static page path: Confirmed / public/privacy-policy.html',
      'Privacy policy page draft implementation: Confirmed',
      'Contact email: Pending',
      'Privacy policy public URL: Pending',
      'Privacy policy URL accessibility check: Pending',
      'Privacy policy URL Play Console input: Pending',
      'Data safety form: Pending',
      'AAB upload: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md',
    snippets: [
      'Static privacy policy page draft: Added',
      'Static page path: Confirmed / public/privacy-policy.html',
      'Privacy policy page draft implementation: Confirmed',
      'Contact email: Pending',
      'Privacy policy public URL: Pending',
      'Data safety form: Pending',
      'Actual Google Play Console input: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md',
    snippets: [
      'Static privacy policy page draft: Added',
      'Static page path: Confirmed / public/privacy-policy.html',
      'Privacy policy page draft implementation: Confirmed',
      'Contact email: Pending',
      'Privacy policy public URL: Pending',
      'Data safety form: Pending',
      'AAB upload to internal test: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
    snippets: [
      'Static privacy policy page draft implementation: Confirmed',
      'Static privacy policy page path: public/privacy-policy.html',
      'Static privacy policy page routing change: Not changed',
      'Static privacy policy page final content: Pending',
      'Static privacy policy page contact email confirmation: Pending',
      'Static privacy policy page URL confirmation: Pending',
      'Static privacy policy page URL accessibility check: Pending',
      'Static privacy policy page URL Play Console input: Pending',
      'Static privacy policy page Data safety form submission: Pending',
      'Static privacy policy page AAB internal test upload: Pending',
      'Static privacy policy page real device QA: Pending',
    ],
  },
];

const forbiddenSnippets = [
  'Privacy policy final content | Confirmed',
  'Privacy policy public URL | Confirmed',
  'Privacy policy URL Play Console input | Confirmed',
  'Contact email | Confirmed',
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
    pattern: /https?:\/\/[^\s"'<>]+/i,
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

const htmlExists = fs.existsSync(htmlPath);
logResult('static_privacy_policy_page_draft_exists', htmlExists, htmlPath);
if (!htmlExists) process.exit(1);

const html = fs.readFileSync(htmlPath, 'utf8');

if (!checkIncludes('html', html, htmlRequiredSnippets)) hasFailure = true;

const htmlHasScriptTag = /<script\b/i.test(html);
logResult('html_external_or_inline_script_tag_absent', !htmlHasScriptTag);
if (htmlHasScriptTag) hasFailure = true;

const htmlHasExternalStylesheet = /<link\b[^>]+href\s*=/i.test(html);
logResult('html_external_stylesheet_absent', !htmlHasExternalStylesheet);
if (htmlHasExternalStylesheet) hasFailure = true;

const buildOutputExists = fs.existsSync(buildOutputPath);
logResult('static_privacy_policy_page_build_output_exists', buildOutputExists, buildOutputPath);
if (!buildOutputExists) hasFailure = true;

const docsAndHtml = [{ path: htmlPath, source: html }];
for (const { path, snippets } of relatedDocs) {
  const relatedExists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, relatedExists);
  if (!relatedExists) {
    hasFailure = true;
    continue;
  }

  const relatedDoc = fs.readFileSync(path, 'utf8');
  docsAndHtml.push({ path, source: relatedDoc });
  if (!checkIncludes(labelFromSnippet(path), relatedDoc, snippets)) hasFailure = true;
}

for (const snippet of forbiddenSnippets) {
  for (const { path, source } of docsAndHtml) {
    const absent = !source.includes(snippet);
    logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}_from_${labelFromSnippet(path)}`, absent);
    if (!absent) hasFailure = true;
  }
}

for (const { label, pattern } of forbiddenPatterns) {
  for (const { path, source } of docsAndHtml) {
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
  console.error('Static privacy policy page draft check failed');
  process.exit(1);
}

console.log('Static privacy policy page draft check passed');
