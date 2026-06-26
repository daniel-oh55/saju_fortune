import fs from 'node:fs';
import { execSync } from 'node:child_process';

const docPath = 'docs/RELEASE_BUILD_SIGNING_CHECKLIST.md';
const screenshotChecklistPath = 'docs/GOOGLE_PLAY_SCREENSHOT_PRODUCTION_CHECKLIST.md';
const appMetadataPath = 'docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md';
const roadmapPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';

const requiredPaths = [
  docPath,
  screenshotChecklistPath,
  appMetadataPath,
  roadmapPath,
];

const requiredSections = [
  '# Release Build Signing Checklist',
  '## Purpose',
  '## Current Android Build Status',
  '## Release Preparation Checklist',
  '## Secret and Keystore Policy',
  '## AAB Readiness Notes',
  '## Non-Goals for This PR',
  '## Related Docs',
];

const requiredDocSnippets = [
  'Android Debug Build GitHub Actions 사용 중',
  'Debug APK artifact 생성 가능',
  'release build: Pending',
  'signing 설정: Pending',
  'keystore 파일: Pending',
  'AAB 생성: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 기기 QA: Pending',
  'keystore 파일은 repository에 commit하지 않는다.',
  'signing password를 코드, 문서, 로그에 기록하지 않는다.',
  'release build 생성 없음',
  'signing 설정 적용 없음',
  'keystore 파일 추가 없음',
  'signing password 기록 없음',
  'AAB 생성 없음',
  'AndroidManifest.xml 변경 없음',
  'Android resource 파일 변경 없음',
  'Gradle 설정 변경 없음',
];

const relatedDocSnippet = 'Release build signing checklist: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md';
const relatedDocPaths = [screenshotChecklistPath, appMetadataPath];

const roadmapSnippets = [
  'release build/signing/AAB 준비 체크리스트 문서: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md 참고',
  'release build: Pending',
  'signing 설정: Pending',
  'AAB 생성: Pending',
  'Play Console 내부 테스트 업로드: Pending',
  '실제 기기 QA: Pending',
];

const forbiddenDocSnippets = ['Completed', 'Pass', 'Done'];
const wrongPhrases = [
  '실제 스토어 스크린샷 이미지 제작',
  '태양시 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
];

const androidNativeGradleSigningFiles = [
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/res',
  'android/app/build.gradle',
  'android/build.gradle',
  'android/gradle.properties',
  'android/settings.gradle',
  'android/gradle',
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

for (const path of requiredPaths) {
  const exists = fs.existsSync(path);
  logResult(`${path}_exists`, exists);
  if (!exists) hasFailure = true;
}

if (hasFailure) {
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');

for (const section of requiredSections) {
  const found = doc.includes(section);
  logResult(`doc_includes_${labelFromSnippet(section)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of requiredDocSnippets) {
  const found = doc.includes(snippet);
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const path of relatedDocPaths) {
  const relatedDoc = fs.readFileSync(path, 'utf8');
  const found = relatedDoc.includes(relatedDocSnippet);
  logResult(`${labelFromSnippet(path)}_includes_release_build_signing_related_doc`, found);
  if (!found) hasFailure = true;
}

const roadmap = fs.readFileSync(roadmapPath, 'utf8');
for (const snippet of roadmapSnippets) {
  const found = roadmap.includes(snippet);
  logResult(`roadmap_includes_${labelFromSnippet(snippet)}`, found);
  if (!found) hasFailure = true;
}

for (const snippet of wrongPhrases) {
  const absent = !doc.includes(snippet);
  logResult(`wrong_phrase_absent_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

for (const snippet of forbiddenDocSnippets) {
  const absent = !doc.includes(snippet);
  logResult(`doc_excludes_${labelFromSnippet(snippet)}`, absent);
  if (!absent) hasFailure = true;
}

const diffOutput = execSync(`git diff --name-only -- ${androidNativeGradleSigningFiles.join(' ')}`, {
  encoding: 'utf8',
}).trim();
const androidNativeGradleSigningFilesUnchanged = diffOutput.length === 0;
logResult('android_native_gradle_signing_files_unchanged_in_working_diff', androidNativeGradleSigningFilesUnchanged);
if (!androidNativeGradleSigningFilesUnchanged) hasFailure = true;

if (hasFailure) {
  console.error('Release build signing checklist check failed');
  process.exit(1);
}

console.log('Release build signing checklist check passed');
