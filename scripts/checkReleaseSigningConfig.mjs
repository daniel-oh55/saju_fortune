import fs from 'node:fs';

const docPath = 'docs/RELEASE_SIGNING_CONFIG_RECORD.md';
const gradlePath = 'android/app/build.gradle';

const requiredDocSnippets = [
  '# Release Signing Config Record',
  'Status: Release signing configuration recorded',
  'Release signing config: Already implemented (android/app/build.gradle)',
  'Keystore file: Not committed',
  'Signing credentials: Not committed',
  'Release build: Not started',
  'AAB generation: Not started',
  'Google Play AAB upload: Not started',
  'App submission/review request: Pending',
  'Purpose: Record the existing Android release signing configuration',
  'PR type: Android signing config docs/check',
  'Release signing configuration in android/app/build.gradle was already added in an earlier PR',
  'This PR does not add a new signing configuration',
  'This PR does not add real keystore files',
  'This PR does not add signing credentials',
  'This PR does not create release build',
  'This PR does not generate AAB',
  'This PR does not upload AAB to Google Play Console',
  'This PR does not submit the app for review',
  'This PR does not change production UI or app logic',
  '## 2. Signing input sources',
  'ANDROID_KEYSTORE_FILE',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
  'ANDROID_KEYSTORE_BASE64',
  'Real values must be provided outside the repository',
  'Real keystore files must not be committed',
  '## 3. Security notes',
  'Do not commit *.jks files',
  'Do not commit *.keystore files',
  'Do not commit *.p12 files',
  'Do not commit *.pem files',
  'Do not commit keystore.properties',
  'Do not commit keystore passwords',
  'Do not commit key passwords',
  'Do not commit signing credentials',
  'Keep release signing credentials in a secure local location or CI secrets',
  'Android Debug Build success does not mean release build or AAB generation is complete',
  '## 4. Not included in this PR',
  'No real keystore file',
  'No signing credentials',
  'No new signing configuration (existing configuration only recorded)',
  'No release build',
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
  'No Gradle configuration changes',
  'No fortune copy/content changes',
  'No fortune calculation logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  '| Release build | Not started |',
  '| AAB generation | Not started |',
  '| Release AAB verification | Not started |',
  '| Google Play AAB upload | Not started |',
  '| App submission/review request | Pending |',
  'This PR records the existing release signing configuration only.',
  'No production UI, fortune logic, routing, schemaVersion, localStorage key, image, AAB, or app submission changes are included.',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'Release build: Completed',
  'Release build | Completed',
  'release build 완료',
  'AAB generation: Completed',
  'AAB generation | Completed',
  'AAB 생성 완료',
  'Google Play AAB upload: Completed',
  'Google Play AAB upload | Completed',
  'App submission/review request: Completed',
  'App submission/review request | Completed',
  'app submission 완료',
  'Keystore file: Committed',
  'Signing credentials: Committed',
  'keystore password added',
  'keystore 비밀번호 추가',
  'signing credential 추가 완료',
];

const requiredTodoSnippets = [
  '- [x] release signing configuration 추가',
  '- [x] release signing configuration 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] Keystore creation outside repository',
  '- [ ] Release build',
  '- [ ] AAB generation',
  '- [ ] Release AAB verification',
  '- [ ] Google Play AAB upload',
  '- [ ] App submission/review request',
];

const requiredDevLogSnippets = [
  '## Release Signing Config',
  'PR 목적: Android release signing configuration 추가',
  'Status: Android signing config/docs/check',
  'Release signing config: Completed',
  'Keystore file: Not committed',
  'Signing credentials: Not committed',
  'Release build: Not started',
  'AAB generation: Not started',
  'Google Play AAB upload: Not started',
  'App submission/review request: Pending',
  'production UI 변경 없음',
  'src 변경 없음',
  'CSS 파일 변경 없음',
  'AndroidManifest.xml 변경 없음',
  'Android native/resource 변경 없음',
  'Gradle signing configuration 외 Android 변경 없음',
  '운세 문구/content 변경 없음',
  '운세 계산 로직 변경 없음',
  'routing 변경 없음',
  'schemaVersion 변경 없음',
  'CURRENT_FORTUNE_SCHEMA_VERSION 변경 없음',
  '기존 localStorage key 변경 없음',
  '실제 keystore 파일 추가 없음',
  'signing credentials 추가 없음',
  'release build 생성 없음',
  'AAB 생성 없음',
  'Google Play AAB upload 없음',
  'app submission/review request 없음',
];

const requiredChangelogSnippets = [
  'Added release signing configuration using external signing values.',
  'Recorded release signing configuration and security notes.',
  'Added release signing configuration check.',
];

const requiredPackageJsonSnippets = [
  '"check:release-signing-config": "node scripts/checkReleaseSigningConfig.mjs"',
];

const requiredGitignoreSnippets = ['*.jks', '*.keystore', '*.p12', '*.pem', 'keystore.properties'];

const requiredGradleSnippets = [
  'ANDROID_KEYSTORE_FILE',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
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
  console.error('Release signing configuration check failed.');
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');
const gitignore = fs.readFileSync('.gitignore', 'utf8');
const gradle = fs.readFileSync(gradlePath, 'utf8');
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

// docs/RELEASE_SIGNING_CONFIG_RECORD.md and CHANGELOG.md have no history of legitimately
// referencing these wrong phrases, so a whole-file scan is safe for them. TODO.md and
// DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g. documenting that
// a check for these phrases exists), so their scan is scoped to this PR's section only.
const todoSection = sectionText(todo, '## Release Signing Config TODO');
const devLogSection = sectionText(devLog, '## Release Signing Config');

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

for (const snippet of requiredGitignoreSnippets) {
  logResult(`gitignore_includes_${labelFromSnippet(snippet)}`, gitignore.includes(snippet));
}

for (const snippet of requiredGradleSnippets) {
  logResult(`gradle_includes_${labelFromSnippet(snippet)}`, gradle.includes(snippet));
}

// Guard against real keystore files or password-like literal assignments entering the repo.
const keystoreFilePattern = /["'][^"'\s]+\.(jks|keystore|p12|pem)["']/i;
const passwordAssignmentPattern = /(storePassword|keyPassword|keystorePassword)\s*[:=]\s*['"][^'"\s]{3,}['"]/;
logResult('doc_excludes_keystore_file_reference', !keystoreFilePattern.test(doc));
logResult('doc_excludes_password_assignment', !passwordAssignmentPattern.test(doc));
logResult('gradle_excludes_password_assignment', !passwordAssignmentPattern.test(gradle));

if (hasFailure) {
  console.error('Release signing configuration check failed.');
  process.exit(1);
}

console.log('Release signing configuration check passed');
