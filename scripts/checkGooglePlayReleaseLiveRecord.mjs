import fs from 'node:fs';

const docPath = 'docs/GOOGLE_PLAY_RELEASE_LIVE_RECORD.md';

const requiredDocSnippets = [
  '# Google Play Release Live Record',
  'Status: Google Play production release live verified',
  'Verification date: 2026-07-23',
  'PR type: docs/check-only',
  'Final pre-submission review: Completed',
  'App submission/review request: Completed',
  'Google Play review result: Completed',
  'Production release live: Completed',
  'Post-review release verification: Completed',
  'Google Play Store page access verification: Completed',
  'Google Play Store install verification: Completed',
  'Future updates: Pending',
  'Post-launch monitoring: Pending',
  'Purpose: Record Google Play review result, production release live, and store install verification completion',
  'This PR records confirmed manual verification results only',
  'This PR does not perform or modify the production release',
  'This PR does not change production UI or app logic',
  '## 2. Release verification record',
  '| Final pre-submission review | Completed | Recorded in PR #392 |',
  '| App submission/review request | Completed | Recorded in PR #393 |',
  '| Google Play review result | Completed | Review completed |',
  '| Production release live | Completed | Published production release confirmed |',
  '| Post-review release verification | Completed | Console and Store state verified |',
  '| Google Play Store page access verification | Completed | Store page accessible |',
  '| Google Play Store install verification | Completed | Installation from Google Play confirmed |',
  '## 3. Manual verification evidence',
  'Google Play Console showed “게시되지 않은 변경사항이 없습니다”',
  'Google Play Console showed “앱 업데이트가 게시되었습니다”',
  '“Google Play에서 보기” link was available',
  'Google Play Store listing page was accessible',
  'Installation from the Google Play Store was confirmed',
  'No screenshot or external evidence file is committed by this PR.',
  '## 5. Not included in this PR',
  'No AAB file committed',
  'No APK file committed',
  'No real keystore file',
  'No signing credentials',
  'No committed secrets',
  'No service account key',
  'No new release build',
  'No new AAB generation',
  'No Google Play Console modification performed by this PR',
  'No image file changes',
  'No screenshot file changes',
  'No production UI changes',
  'No src changes',
  'No CSS changes',
  'No AndroidManifest.xml changes',
  'No Android native/resource changes',
  'No Gradle changes',
  'No Capacitor config changes',
  'No GitHub Actions workflow changes',
  'No fortune copy/content changes',
  'No fortune calculation logic changes',
  'No routing changes',
  'No schemaVersion changes',
  'No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  'No existing localStorage key changes',
  '| Future updates | Pending |',
  '| Post-launch monitoring | Pending |',
  '| Post-install functional QA | Pending |',
  '| Detailed Android device QA | Pending |',
  '| First update planning | Pending |',
  'This PR is a docs/check-only record of manual verification.',
  'Detailed post-install functional QA is not claimed as completed by this PR.',
];

const requiredTodoSnippets = [
  '- [x] Google Play review result',
  '- [x] Production release live',
  '- [x] Post-review release verification',
  '- [x] Google Play Store page access verification',
  '- [x] Google Play Store install verification',
  '- [x] Google Play release live record 작성',
  '- [x] Google Play release live record 검증 스크립트 추가',
  '- [ ] Future updates',
  '- [ ] Post-launch monitoring',
  '- [ ] Post-install functional QA',
  '- [ ] Detailed Android device QA',
  '- [ ] First update planning',
];

const requiredDevLogSnippets = [
  'PR 목적: Google Play review result / production release live / install verification 완료 기록',
  'Status: Docs/check-only',
  'Verification date: 2026-07-23',
  'Final pre-submission review: Completed',
  'App submission/review request: Completed',
  'Google Play review result: Completed',
  'Production release live: Completed',
  'Post-review release verification: Completed',
  'Google Play Store page access verification: Completed',
  'Google Play Store install verification: Completed',
  'Future updates: Pending',
  'Post-launch monitoring: Pending',
  'Post-install functional QA: Pending',
  'Detailed Android device QA: Pending',
  '실제 AAB 파일 추가 없음',
  '실제 APK 파일 추가 없음',
  '실제 keystore 파일 추가 없음',
  'signing credentials 추가 없음',
  'committed secrets 없음',
  'service account key 추가 없음',
  '새 release build 없음',
  '새 AAB generation 없음',
  'production UI 변경 없음',
  'src/CSS/Android/Gradle/Capacitor 변경 없음',
  'GitHub Actions workflow 변경 없음',
  '운세 문구/콘텐츠 변경 없음',
  '운세 계산 로직 변경 없음',
  'routing 변경 없음',
  'schemaVersion 변경 없음',
  'CURRENT_FORTUNE_SCHEMA_VERSION 변경 없음',
  '기존 localStorage key 변경 없음',
  'npm run build 결과',
  'npm run check:google-play-release-live-record 결과',
  'npm run check:google-play-submission-record 결과',
];

const requiredChangelogSnippets = [
  'Recorded Google Play review completion, production release live status, and Store installation verification.',
  'Added Google Play release live record check.',
];

const forbiddenDocPhrases = [
  'Google Play review result: Pending',
  'Production release live: Pending',
  'Post-review release verification: Pending',
  'Google Play Store install verification: Pending',
  'Google Play review result: Not started',
  'Production release live: Not started',
];

const forbiddenOverclaims = [
  'Detailed Android device QA: Completed',
  'Post-install functional QA: Completed',
  'All Android QA completed',
  'All future updates completed',
  'Post-launch monitoring: Completed',
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

function sectionText(markdown, heading) {
  const start = markdown.indexOf(heading);
  if (start === -1) return '';
  const nextHeading = markdown.indexOf('\n## ', start + heading.length);
  return nextHeading === -1 ? markdown.slice(start) : markdown.slice(start, nextHeading);
}

logResult('doc_exists', fs.existsSync(docPath));
if (!fs.existsSync(docPath)) {
  console.error('Google Play release live record check failed.');
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');
const todo = fs.readFileSync('TODO.md', 'utf8');
const devLog = fs.readFileSync('DEVELOPMENT_LOG.md', 'utf8');
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
const packageJsonText = fs.readFileSync('package.json', 'utf8');
const todoSection = sectionText(todo, '## Google Play Release Live Record TODO');
const devLogSection = sectionText(devLog, '## Google Play Release Live Record');

logResult('todo_has_release_live_section', todoSection.length > 0);
logResult('dev_log_has_release_live_section', devLogSection.length > 0);

for (const snippet of requiredDocSnippets) {
  logResult(`doc_includes_${labelFromSnippet(snippet)}`, doc.includes(snippet));
}

for (const snippet of requiredTodoSnippets) {
  logResult(`todo_section_includes_${labelFromSnippet(snippet)}`, todoSection.includes(snippet));
}

for (const snippet of requiredDevLogSnippets) {
  logResult(`dev_log_section_includes_${labelFromSnippet(snippet)}`, devLogSection.includes(snippet));
}

for (const snippet of requiredChangelogSnippets) {
  logResult(`changelog_includes_${labelFromSnippet(snippet)}`, changelog.includes(snippet));
}

for (const phrase of forbiddenDocPhrases) {
  logResult(`doc_excludes_${labelFromSnippet(phrase)}`, !doc.includes(phrase));
}

for (const content of [
  ['doc', doc],
  ['todo_section', todoSection],
  ['dev_log_section', devLogSection],
]) {
  const [label, text] = content;
  for (const phrase of forbiddenOverclaims) {
    logResult(`${label}_excludes_${labelFromSnippet(phrase)}`, !text.includes(phrase));
  }
}

let packageJson;
try {
  packageJson = JSON.parse(packageJsonText);
  logResult('package_json_parses', true);
} catch (error) {
  logResult('package_json_parses', false, error.message);
}

logResult(
  'package_json_has_release_live_script',
  packageJson?.scripts?.['check:google-play-release-live-record']
    === 'node scripts/checkGooglePlayReleaseLiveRecord.mjs',
);

// Detect real artifact paths and credential assignments without rejecting safe
// statements such as "No AAB file committed".
const artifactPathPattern =
  /(?:^|[\s"'`(])(?:[^\s"'`()]+[\\/])?[^\s"'`()]+\.(?:aab|apk|jks|keystore|p12|pem)(?=$|[\s"'`),])/imu;
const passwordAssignmentPattern =
  /(?:storePassword|keyPassword|keystorePassword)\s*[:=]\s*['"][^'"\s]{3,}['"]/u;
const keystoreBase64LiteralPattern =
  /ANDROID_KEYSTORE_BASE64\s*[:=]\s*['"]?[A-Za-z0-9+/]{24,}={0,2}['"]?/u;

logResult('doc_excludes_artifact_path', !artifactPathPattern.test(doc));
logResult('doc_excludes_password_assignment', !passwordAssignmentPattern.test(doc));
logResult('doc_excludes_keystore_base64_literal', !keystoreBase64LiteralPattern.test(doc));

if (hasFailure) {
  console.error('Google Play release live record check failed.');
  process.exit(1);
}

console.log('Google Play release live record check passed');
