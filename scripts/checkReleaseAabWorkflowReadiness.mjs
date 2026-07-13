import fs from 'node:fs';

const docPath = 'docs/RELEASE_AAB_WORKFLOW_READINESS.md';
const workflowPath = '.github/workflows/android-release-aab.yml';

const requiredDocSnippets = [
  '# Release AAB Workflow Readiness',
  'Status: Release AAB workflow readiness recorded',
  'Release signing config: Completed',
  'Keystore file: Not committed',
  'Signing credentials: Not committed',
  'Release AAB workflow: Existing workflow recorded',
  'Release build: Pending manual workflow run',
  'AAB generation: Pending manual workflow run',
  'Release AAB verification: Not started',
  'Google Play AAB upload: Not started',
  'App submission/review request: Pending',
  'Purpose: Record release AAB workflow readiness',
  'PR type: workflow/docs/check',
  'Release signing configuration was already recorded in PR #387',
  'This PR does not add real keystore files',
  'This PR does not add signing credentials',
  'This PR does not upload AAB to Google Play Console',
  'This PR does not submit the app for review',
  'This PR does not change production UI or app logic',
  '## 2. Required GitHub Secrets',
  'ANDROID_KEYSTORE_BASE64',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
  'Real secret values must be stored only in GitHub Secrets',
  'Real secret values must not be committed to the repository',
  '## 3. Workflow readiness checklist',
  '| Release signing config | Completed | Recorded in PR #387 |',
  '| Keystore file | Not committed | Must remain outside repo |',
  '| Signing credentials | Not committed | Must be provided via GitHub Secrets |',
  '| Release AAB workflow | Ready | Manual GitHub Actions run required |',
  '| Release build | Pending manual workflow run | Not completed in this PR |',
  '| AAB generation | Pending manual workflow run | Not completed in this PR |',
  '| Release AAB verification | Not started | Requires generated AAB artifact |',
  '| Google Play AAB upload | Not started | Requires verified AAB |',
  '| App submission/review request | Pending | Submit only after final checks pass |',
  '## 4. Existing workflow summary',
  'No workflow changes were required in this PR because the existing workflow is already correct.',
  '## 5. Not included in this PR',
  'No real keystore file',
  'No signing credentials',
  'No committed secrets',
  'No release build completion',
  'No AAB generation completion',
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
  'No fortune copy/content changes',
  'No fortune calculation logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  '| GitHub Secrets final input | Pending user confirmation |',
  '| Release build | Pending manual workflow run |',
  '| AAB generation | Pending manual workflow run |',
  '| Release AAB verification | Not started |',
  '| Google Play AAB upload | Not started |',
  '| App submission/review request | Pending |',
  'This PR records release AAB workflow readiness only.',
  'Release build and AAB generation require a separate manual workflow run.',
  'No production UI, fortune logic, routing, schemaVersion, localStorage key, image, signing credential, AAB upload, or app submission changes are included.',
];

const requiredWorkflowSnippets = [
  'workflow_dispatch',
  'ANDROID_KEYSTORE_BASE64',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD',
  'bundleRelease',
  'npm ci',
  'npm run build',
  'cap sync android',
  'upload-artifact',
];

const wrongPhrases = [
  '\u{AE08}(\u{91D1})',
  '실제 스토어 스크린샷 이미지 시작',
  '서양식 보정 적용 여부',
  '양력/음력 샘플 추가 검증',
  'Release build: Completed',
  'Release build | Completed',
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
];

const requiredTodoSnippets = [
  '- [x] release AAB workflow readiness 문서화',
  '- [x] release AAB workflow readiness 검증 스크립트 추가',
];

const pendingTodoSnippets = [
  '- [ ] GitHub Secrets final input',
  '- [ ] Release build',
  '- [ ] AAB generation',
  '- [ ] Release AAB verification',
  '- [ ] Google Play AAB upload',
  '- [ ] App submission/review request',
];

const requiredDevLogSnippets = [
  '## Release AAB Workflow Readiness',
  'PR 목적: release AAB workflow readiness 문서화',
  'Status: Docs/check-only',
  'Release signing config: Completed',
  'Keystore file: Not committed',
  'Signing credentials: Not committed',
  'Release AAB workflow: Existing workflow recorded',
  'Release build: Pending manual workflow run',
  'AAB generation: Pending manual workflow run',
  'Release AAB verification: Not started',
  'Google Play AAB upload: Not started',
  'App submission/review request: Pending',
  'production UI 변경 없음',
  'src 변경 없음',
  'CSS 파일 변경 없음',
  'AndroidManifest.xml 변경 없음',
  'Android native/resource 변경 없음',
  '운세 문구/content 변경 없음',
  '운세 계산 로직 변경 없음',
  'routing 변경 없음',
  'schemaVersion 변경 없음',
  'CURRENT_FORTUNE_SCHEMA_VERSION 변경 없음',
  '기존 localStorage key 변경 없음',
  '실제 keystore 파일 추가 없음',
  'signing credentials 추가 없음',
  'release build 완료 없음',
  'AAB generation 완료 없음',
  'Google Play AAB upload 없음',
  'app submission/review request 없음',
];

const requiredChangelogSnippets = [
  'Recorded release AAB workflow readiness.',
  'Added release AAB workflow readiness check.',
];

const requiredPackageJsonSnippets = [
  '"check:release-aab-workflow-readiness": "node scripts/checkReleaseAabWorkflowReadiness.mjs"',
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
logResult('workflow_exists', fs.existsSync(workflowPath));
if (!fs.existsSync(docPath) || !fs.existsSync(workflowPath)) {
  console.error('Release AAB workflow readiness check failed.');
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');
const workflow = fs.readFileSync(workflowPath, 'utf8');
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

for (const snippet of requiredWorkflowSnippets) {
  logResult(`workflow_includes_${labelFromSnippet(snippet)}`, workflow.includes(snippet));
}

// docs/RELEASE_AAB_WORKFLOW_READINESS.md and CHANGELOG.md have no history of legitimately
// referencing these wrong phrases, so a whole-file scan is safe for them. TODO.md and
// DEVELOPMENT_LOG.md are running logs with legitimate past mentions (e.g. documenting that
// a check for these phrases exists), so their scan is scoped to this PR's section only.
const todoSection = sectionText(todo, '## Release AAB Workflow Readiness TODO');
const devLogSection = sectionText(devLog, '## Release AAB Workflow Readiness');

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

// Guard against real keystore files or password-like literal assignments entering the repo.
const keystoreFilePattern = /["'][^"'\s]+\.(jks|keystore|p12|pem)["']/i;
const passwordAssignmentPattern = /(storePassword|keyPassword|keystorePassword)\s*[:=]\s*['"][^'"\s]{3,}['"]/;
const secretLiteralPattern = /(ANDROID_KEYSTORE_BASE64|ANDROID_KEYSTORE_PASSWORD|ANDROID_KEY_ALIAS|ANDROID_KEY_PASSWORD)\s*[:=]\s*['"][^'"\s]+['"]/;
logResult('doc_excludes_keystore_file_reference', !keystoreFilePattern.test(doc));
logResult('doc_excludes_password_assignment', !passwordAssignmentPattern.test(doc));
logResult('doc_excludes_secret_literal', !secretLiteralPattern.test(doc));
logResult('workflow_excludes_secret_literal', !secretLiteralPattern.test(workflow));

if (hasFailure) {
  console.error('Release AAB workflow readiness check failed.');
  process.exit(1);
}

console.log('Release AAB workflow readiness check passed');
