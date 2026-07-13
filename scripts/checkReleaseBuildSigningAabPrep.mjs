import fs from 'node:fs';

const docPath = 'docs/RELEASE_BUILD_SIGNING_AAB_PREP.md';

const requiredDocSnippets = [
  '# Release Build Signing AAB Preparation',
  'Status: Release build signing AAB preparation recorded',
  'Google Play Console actual input: Completed',
  'Google Play 데이터 보안 양식 최종 입력: Completed',
  'App submission/review request: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'Keystore file: Not started',
  'AAB generation: Not started',
  'Purpose: Prepare release build, signing setup, and AAB generation',
  'PR type: docs/check-only',
  'Google Play Console input and Google Play 데이터 보안 양식 최종 입력 were already completed',
  'This PR records release preparation only',
  'This PR does not create release build',
  'This PR does not configure signing',
  'This PR does not add keystore files',
  'This PR does not generate AAB',
  'This PR does not submit the app for review',
  'This PR does not change production UI or app logic',
  '## 2. Completed pre-release items',
  '| Store screenshot upload | Completed | Recorded in PR #380 |',
  '| App icon final upload | Completed | Recorded in PR #383 |',
  '| Feature graphic final upload | Completed | Recorded in PR #383 |',
  '| Google Play Console actual input | Completed | Recorded in PR #384 |',
  '| Google Play 데이터 보안 양식 최종 입력 | Completed | Recorded in PR #385 |',
  '## 3. Release preparation checklist',
  '| Release build strategy | Pending | Define before implementation |',
  '| Signing setup plan | Pending | Do not commit real keystore or passwords |',
  '| Keystore creation | Not started | Must be handled securely outside docs/check PR |',
  '| Keystore storage policy | Pending | Secrets must not be committed |',
  '| Gradle signing configuration | Not started | Separate implementation PR required |',
  '| AAB generation | Not started | Separate build PR/run required |',
  '| Release AAB verification | Not started | Requires actual generated AAB |',
  '| Google Play AAB upload | Not started | Requires actual release AAB |',
  '| App submission/review request | Pending | Submit only after release checks pass |',
  '## 4. Security notes',
  'Do not commit real keystore files',
  'Do not commit keystore passwords',
  'Do not commit signing credentials',
  'Use secure local storage or repository secrets for sensitive signing values',
  'Keep debug build and release build status clearly separated',
  'Android Debug Build success does not mean release build, signing, or AAB generation is complete',
  'No release build',
  'No signing setup',
  'No keystore file added',
  'No signing credentials added',
  'No AAB generation',
  'No Google Play AAB upload',
  'No app submission/review request',
  'No image file changes',
  'No new screenshot capture',
  'No new image generation',
  'No image redesign',
  'No src changes',
  'No CSS changes',
  'No AndroidManifest.xml changes',
  'No Android native/resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No fortune copy/content changes',
  'No fortune calculation logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  '| Release build strategy | Pending |',
  '| Signing setup | Not started |',
  '| Keystore file | Not started |',
  '| AAB generation | Not started |',
  '| Release AAB verification | Not started |',
  '| Google Play AAB upload | Not started |',
  '| App submission/review request | Pending |',
  'This PR records release build, signing, and AAB preparation only.',
  'No production code, Android packaging, signing, AAB, or app submission changes are included.',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'Release build: Completed',
  'Release build | Completed',
  'release build 완료',
  'Signing setup: Completed',
  'Signing setup | Completed',
  'signing 설정 완료',
  'Keystore file: Completed',
  'Keystore file | Completed',
  'keystore 파일 추가 완료',
  'AAB generation: Completed',
  'AAB generation | Completed',
  'AAB 생성 완료',
  'Google Play AAB upload: Completed',
  'Google Play AAB upload | Completed',
  'App submission/review request: Completed',
  'App submission/review request | Completed',
  'app submission 완료',
  'keystore password added',
  'keystore 비밀번호 추가',
  'signing credential 추가 완료',
];

const requiredTodoSnippets = [
  '- [x] release build/signing/AAB 준비 문서화',
  '- [x] release build signing AAB preparation 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] Release build strategy',
  '- [ ] signing 설정 준비',
  '- [ ] keystore 생성/보관 정책 확정',
  '- [ ] AAB 생성',
  '- [ ] Release AAB verification',
  '- [ ] Google Play AAB upload',
  '- [ ] App submission/review request',
];

const requiredDevLogSnippets = [
  '## Release Build Signing AAB Preparation',
  'PR 목적: release build/signing/AAB 준비 문서화',
  'Status: Docs/check-only',
  'Google Play Console actual input: Completed',
  'Google Play 데이터 보안 양식 최종 입력: Completed',
  'App submission/review request: Pending',
  'Release build: Not started',
  'Signing setup: Not started',
  'Keystore file: Not started',
  'AAB generation: Not started',
  'Google Play AAB upload: Not started',
  '이미지 파일 변경 없음',
  '새 캡처 없음',
  '새 이미지 생성 없음',
  '이미지 재디자인 없음',
  'production UI 변경 없음',
  'src 변경 없음',
  'CSS 파일 변경 없음',
  'AndroidManifest.xml 변경 없음',
  'Android native/resource 변경 없음',
  'Gradle 변경 없음',
  'Capacitor config 변경 없음',
  '운세 문구/content 변경 없음',
  '운세 계산 로직 변경 없음',
  'routing 변경 없음',
  'schemaVersion 변경 없음',
  'CURRENT_FORTUNE_SCHEMA_VERSION 변경 없음',
  '기존 localStorage key 변경 없음',
  'release build 생성 없음',
  'signing 설정 변경 없음',
  'keystore 파일 추가 없음',
  'signing credentials 추가 없음',
  'AAB 생성 없음',
  'Google Play AAB upload 없음',
  'app submission/review request 없음',
];

const requiredChangelogSnippets = [
  'Added release build, signing setup, and AAB preparation checklist.',
  'Kept release build, signing setup, keystore file, AAB generation, Google Play AAB upload, and app submission/review request out of scope.',
  'Added release build signing AAB preparation check.',
];

const requiredPackageJsonSnippets = [
  '"check:release-build-signing-aab-prep": "node scripts/checkReleaseBuildSigningAabPrep.mjs"',
];

let hasFailure = false;

function logResult(name, passed, detail = '') {
  const status = passed ? 'PASS' : 'FAIL';
  console.log(`[${status}] ${name}${detail ? ` - ${detail}` : ''}`);
  if (!passed) hasFailure = true;
}

function labelFromSnippet(snippet) {
  return snippet
    .replaceAll(/\s+/g, '_')
    .replaceAll(/[^\p{L}\p{N}_/-]/gu, '')
    .slice(0, 80);
}

logResult('doc_exists', fs.existsSync(docPath));
if (!fs.existsSync(docPath)) {
  console.error('Release build signing AAB preparation check failed.');
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');
const todo = fs.readFileSync('TODO.md', 'utf8');
const devLog = fs.readFileSync('DEVELOPMENT_LOG.md', 'utf8');
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
const packageJson = fs.readFileSync('package.json', 'utf8');

function sectionText(markdown, heading) {
  const start = markdown.indexOf(heading);
  if (start === -1) return '';
  const nextHeading = markdown.indexOf('\n## ', start + heading.length);
  return nextHeading === -1 ? markdown.slice(start) : markdown.slice(start, nextHeading);
}

for (const snippet of requiredDocSnippets) {
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, doc.includes(snippet));
}

// docs/RELEASE_BUILD_SIGNING_AAB_PREP.md and CHANGELOG.md have no history of legitimately
// referencing these wrong phrases, so a whole-file scan is safe for them. TODO.md and
// DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g. documenting that
// a check for these phrases exists), so their scan is scoped to this PR's section only.
const todoSection = sectionText(todo, '## Release Build Signing AAB Preparation TODO');
const devLogSection = sectionText(devLog, '## Release Build Signing AAB Preparation');

logResult('todo_has_section', todoSection.length > 0);
logResult('dev_log_has_section', devLogSection.length > 0);

for (const file of [
  ['doc', doc],
  ['todo_section', todoSection],
  ['dev_log_section', devLogSection],
  ['changelog', changelog],
]) {
  const [label, content] = file;
  for (const phrase of wrongPhrases) {
    logResult(`${label}_excludes_${labelFromSnippet(phrase)}`, !content.includes(phrase));
  }
}

for (const snippet of requiredTodoSnippets) {
  logResult(`todo_includes_${labelFromSnippet(snippet)}`, todo.includes(snippet));
}

for (const snippet of pendingTodoSnippets) {
  logResult(`todo_keeps_pending_${labelFromSnippet(snippet)}`, todo.includes(snippet));
}

for (const snippet of requiredDevLogSnippets) {
  logResult(`dev_log_includes_${labelFromSnippet(snippet)}`, devLog.includes(snippet));
}

for (const snippet of requiredChangelogSnippets) {
  logResult(`changelog_includes_${labelFromSnippet(snippet)}`, changelog.includes(snippet));
}

for (const snippet of requiredPackageJsonSnippets) {
  logResult(`package_json_includes_${labelFromSnippet(snippet)}`, packageJson.includes(snippet));
}

// Guard against real keystore files or password-like assignments entering the repo.
const keystorePattern = /\.(jks|keystore)\b/i;
const passwordAssignmentPattern = /(storePassword|keyPassword|keystorePassword)\s*[:=]\s*['"][^'"\s]{3,}['"]/;
logResult('doc_excludes_keystore_file_reference', !keystorePattern.test(doc));
logResult('doc_excludes_password_assignment', !passwordAssignmentPattern.test(doc));

if (hasFailure) {
  console.error('Release build signing AAB preparation check failed.');
  process.exit(1);
}

console.log('Release build signing AAB preparation check passed');
