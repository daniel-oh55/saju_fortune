import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/PRIVACY_POLICY_HOSTING_OPTIONS.md';

const requiredSections = [
  '# Privacy Policy Hosting Options',
  '## Purpose',
  '## Current Status',
  '## Hosting Option Candidates',
  '## Preferred Direction',
  '## Required Follow-up Before URL Confirmation',
  '## Guardrails',
  '## Non-goals for This PR',
  '## Related Docs',
];

const requiredSnippets = [
  'Privacy policy draft | Confirmed',
  'Privacy policy final content | Pending',
  'Hosting option selected | Pending',
  'Preferred hosting option | Candidate | Vercel static privacy page',
  'Privacy policy public URL | Pending',
  'Privacy policy URL accessibility check | Pending',
  'Privacy policy URL Play Console input | Pending',
  'Contact email | Pending',
  'Data safety form | Pending',
  'AAB upload | Pending',
  'Real device QA | Pending',
  'Vercel static privacy page | Candidate',
  'GitHub Pages | Candidate',
  'Google Sites | Candidate',
  'Notion/public document | Candidate',
  'External website | Candidate',
  'Actual implementation | Pending',
  'Routing change | Pending',
  'Public URL confirmation | Pending',
  'Accessibility check | Pending',
  'Play Console input | Pending',
  'Privacy policy final content confirmation | Pending',
  'Contact email confirmation | Pending',
  'Hosting implementation PR | Pending',
  'Production deployment check | Pending',
  'Public URL accessibility check | Pending',
  'Mobile browser check | Pending',
  'No-login access check | Pending',
  'HTTPS check | Pending',
  'Play Console URL input | Pending',
  '실제 개인정보 처리방침 URL은 이번 PR에서 기록하지 않는다.',
  '실제 개인정보 처리방침 페이지 구현은 이번 PR에서 진행하지 않는다.',
  'routing 변경은 이번 PR에서 진행하지 않는다.',
  '실제 문의 이메일 값은 이번 PR에서 기록하지 않는다.',
  '실제 개인정보 처리방침 최종 내용 확정은 이번 PR에서 완료 처리하지 않는다.',
  '실제 Play Console 앱 생성은 이번 PR에서 진행하지 않는다.',
  '실제 Google Play Console 입력은 이번 PR에서 진행하지 않는다.',
  'Data safety form 제출은 Pending으로 유지한다.',
  'AAB 내부 테스트 업로드는 Pending으로 유지한다.',
  '실제 기기 QA는 Pending으로 유지한다.',
  '`.aab`, `.zip`, `.jks`, `.keystore` 파일은 repository에 추가하지 않는다.',
  'Secret 실제값은 문서, 코드, PR, 로그에 기록하지 않는다.',
  'Privacy policy page implementation',
  'Privacy policy public URL confirmation',
  'Actual Google Play Console input',
  'routing change',
  'schemaVersion change',
];

const relatedDocs = [
  {
    path: 'docs/PRIVACY_POLICY_FINALIZATION_READINESS.md',
    snippets: [
      'Privacy policy hosting options checklist: Added',
      'Preferred hosting option: Candidate / Vercel static privacy page',
      'Hosting option selected: Pending',
      'Privacy policy public URL: Pending',
      'Privacy policy page implementation: Pending',
      'Routing change: Pending',
      'URL accessibility check: Pending',
      'Play Console URL input: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_CONTACT_PRIVACY_READINESS.md',
    snippets: [
      'Privacy policy hosting options checklist: Added',
      'Preferred hosting option: Candidate',
      'Privacy policy public URL: Pending',
      'Privacy policy URL accessibility check: Pending',
      'Privacy policy URL Play Console input: Pending',
      'Contact email: Pending',
      'Data safety form: Pending',
      'AAB upload: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_APP_CREATION_FIELDS.md',
    snippets: [
      'Privacy policy hosting options checklist: Added',
      'Preferred hosting option: Candidate',
      'Privacy policy public URL: Pending',
      'Contact email: Pending',
      'Data safety form: Pending',
      'Actual Google Play Console input: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/PLAY_CONSOLE_INTERNAL_TEST_UPLOAD_CHECKLIST.md',
    snippets: [
      'Privacy policy hosting options checklist: Added',
      'Preferred hosting option: Candidate',
      'Privacy policy public URL: Pending',
      'Contact email: Pending',
      'Data safety form: Pending',
      'AAB upload to internal test: Pending',
      'Real device QA: Pending',
    ],
  },
  {
    path: 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md',
    snippets: [
      '개인정보 처리방침 hosting option 후보 정리: Added',
      '개인정보 처리방침 우선 hosting 후보: Candidate',
      '개인정보 처리방침 page implementation: Pending',
      '개인정보 처리방침 URL 확정: Pending',
      '개인정보 처리방침 URL 접근 가능 여부 확인: Pending',
      '개인정보 처리방침 URL Play Console 입력: Pending',
      '문의 이메일 확정: Pending',
      'Data safety form 제출: Pending',
      'AAB 내부 테스트 업로드: Pending',
      '실제 기기 QA: Pending',
    ],
  },
];

const forbiddenSnippets = [
  'Hosting option selected | Confirmed',
  'Privacy policy public URL | Confirmed',
  'Privacy policy URL Play Console input | Confirmed',
  'Privacy policy page implementation | Confirmed',
  'Routing change | Confirmed',
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
logResult('privacy_policy_hosting_options_doc_exists', exists, docPath);
if (!exists) process.exit(1);

const doc = fs.readFileSync(docPath, 'utf8');

if (!checkIncludes('doc', doc, requiredSections)) hasFailure = true;
if (!checkIncludes('doc', doc, requiredSnippets)) hasFailure = true;

for (const { path, snippets } of relatedDocs) {
  const relatedExists = fs.existsSync(path);
  logResult(`${labelFromSnippet(path)}_exists`, relatedExists);
  if (!relatedExists) {
    hasFailure = true;
    continue;
  }
  const relatedDoc = fs.readFileSync(path, 'utf8');
  if (!checkIncludes(labelFromSnippet(path), relatedDoc, snippets)) hasFailure = true;
}

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
  console.error('Privacy policy hosting options check failed');
  process.exit(1);
}

console.log('Privacy policy hosting options check passed');
