import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/ANDROID_SIGNING_SETUP_PLAN.md';

const requiredSections = [
  '# Android Signing Setup Plan',
  '## Android Release AAB Enforced Rerun Result',
  '## Android Release Signing Enforcement Follow-up',
  '## Current Signing Status',
  '## Signing Goal',
  '## Candidate GitHub Secrets',
  '## Keystore Policy',
  '## Proposed Future Workflow Approach',
  '## Non-Goals for This PR',
];

const requiredSnippets = [
  'Android Release AAB enforced rerun result: Failed',
  'Run number: 5',
  'Run id: 28309520915',
  'Failed step: Validate release signing secrets',
  'Failure summary: `ANDROID_KEYSTORE_BASE64 is not configured`',
  'release signing secrets validation: Failed',
  'signed AAB regeneration: Failed',
  'signed AAB re-verification: Pending',
  'Play Console internal test upload: Pending',
  'real device QA: Pending',
  '이번 결과는 signing enforcement가 Secret 누락을 초기에 차단한 기록이다.',
  'GitHub Secrets 보정 후 Android Release AAB workflow를 다시 실행해야 한다.',
];

const forbiddenSnippets = [
  'signed AAB re-verification: Confirmed',
  'Play Console internal test upload | Confirmed',
  'real device QA | Confirmed',
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

for (const snippet of forbiddenSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`forbidden_snippet_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${protectedFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const protectedFilesUnchanged = diffOutput.length === 0;
logResult('workflow_android_gradle_native_src_files_unchanged_in_working_diff', protectedFilesUnchanged);
if (!protectedFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Android signing setup plan check failed');
  process.exit(1);
}

console.log('Android signing setup plan check passed');
