import fs from 'node:fs';

const docPath = 'docs/POST_LAUNCH_MONITORING_READINESS.md';

const requiredFiles = [
  docPath,
  'TODO.md',
  'DEVELOPMENT_LOG.md',
  'CHANGELOG.md',
  'package.json',
];

const requiredDocSnippets = [
  '# Post-Launch Monitoring Readiness',
  'Status: Post-launch monitoring readiness recorded',
  'Google Play review result: Completed',
  'Production release live: Completed',
  'Google Play Store install verification: Completed',
  'Post-launch monitoring plan: Completed',
  'Post-launch monitoring checklist readiness: Completed',
  'Post-launch monitoring execution: Pending',
  'Initial post-launch monitoring review: Pending',
  'First update planning: Pending',
  'Purpose: Prepare the post-launch monitoring plan and checklist',
  'PR type: docs/check-only',
  'This PR records monitoring readiness only',
  'This PR does not claim that monitoring was executed',
  '## 2. Confirmed launch baseline',
  '| Google Play review result | Completed | Recorded in PR #394 |',
  '| Production release live | Completed | Recorded in PR #394 |',
  '| Post-review release verification | Completed | Recorded in PR #394 |',
  '| Google Play Store page access verification | Completed | Recorded in PR #394 |',
  '| Google Play Store install verification | Completed | Recorded in PR #394 |',
  '| Post-launch monitoring plan | Completed | Prepared by this PR |',
  '| Post-launch monitoring checklist readiness | Completed | Prepared by this PR |',
  '| Post-launch monitoring execution | Pending | Not performed by this PR |',
  '### A. Google Play release and policy status',
  '- Production release remains available',
  '### B. Android vitals',
  '- User-perceived crash rate review',
  '### C. Crashes and ANRs',
  '- New crash cluster review',
  '### D. App statistics',
  '- Total installs review',
  '### E. Ratings and reviews',
  '- New rating review',
  '### F. Support and user-reported issues',
  '- Support inbox inquiry review',
  '### G. First update consideration',
  '- First update planning decision',
  '## 4. Recommended monitoring cadence',
  '- Daily manual review recommended',
  '- Weekly manual review recommended',
  '- Monthly review or review before each app update recommended',
  '## 5. Status recording rules',
  '### Completed',
  '### Pending',
  '### No data',
  '### Insufficient data',
  '### Not applicable',
  '### Blocked',
  'No data must not be treated as Pass',
  'Insufficient data must not be treated as Pass',
  'Pending must not be treated as Completed',
  'Store installation verification must not be treated as detailed functional QA',
  'A successful build must not be treated as post-launch monitoring completion',
  '## 6. Initial monitoring record template',
  '| Check date | Monitoring area | Item | Result status | Observed value or message | Evidence source | Action required | Follow-up owner | Follow-up status | Notes |',
  '| TBD | Android vitals | User-perceived crash rate | Pending | Not reviewed | Google Play Console | TBD | TBD | Pending | - |',
  '## 7. Not included in this PR',
  '- No actual post-launch monitoring execution',
  '- No Android vitals review result',
  '- No crash review result',
  '- No ANR review result',
  '- No app statistics review result',
  '- No ratings or reviews review result',
  '- No support inquiry review result',
  '- No first update decision',
  '- No external analytics SDK',
  '- No crash-reporting SDK',
  '- No Play Developer Reporting API integration',
  '- No AAB file committed',
  '- No APK file committed',
  '- No real keystore file',
  '- No signing credentials',
  '- No committed secrets',
  '- No service account key',
  '- No image file changes',
  '- No production UI changes',
  '- No src changes',
  '- No CSS changes',
  '- No AndroidManifest.xml changes',
  '- No Android native/resource changes',
  '- No Gradle changes',
  '- No Capacitor config changes',
  '- No GitHub Actions workflow changes',
  '- No fortune copy/content changes',
  '- No fortune calculation logic changes',
  '- No routing changes',
  '- No schemaVersion changes',
  '- No CURRENT_FORTUNE_SCHEMA_VERSION changes',
  '- No existing localStorage key changes',
  '## 8. Remaining Pending items',
  '| Post-launch monitoring execution | Pending |',
  '| Initial post-launch monitoring review | Pending |',
  '| Android vitals review | Pending |',
  '| Crash and ANR review | Pending |',
  '| App statistics review | Pending |',
  '| Ratings and reviews review | Pending |',
  '| Policy status review | Pending |',
  '| Support inquiry review | Pending |',
  '| Post-install functional QA | Pending |',
  '| Detailed Android device QA | Pending |',
  '| First update planning | Pending |',
  '## 9. Conclusion',
  '- Actual monitoring has not been executed by this PR.',
  '- No Google Play metrics or user feedback results are claimed.',
];

const requiredTodoSnippets = [
  '- [x] Post-launch monitoring plan',
  '- [x] Post-launch monitoring checklist readiness',
  '- [x] Post-launch monitoring readiness 문서 작성',
  '- [x] Post-launch monitoring readiness 검증 스크립트 추가',
  '- [ ] Post-launch monitoring execution',
  '- [ ] Initial post-launch monitoring review',
  '- [ ] Android vitals review',
  '- [ ] Crash and ANR review',
  '- [ ] App statistics review',
  '- [ ] Ratings and reviews review',
  '- [ ] Policy status review',
  '- [ ] Support inquiry review',
  '- [ ] Post-install functional QA',
  '- [ ] Detailed Android device QA',
  '- [ ] First update planning',
];

const requiredDevLogSnippets = [
  'PR 목적: Google Play 출시 후 모니터링 계획 및 체크리스트 준비',
  'Status: Docs/check-only',
  'Google Play review result: Completed',
  'Production release live: Completed',
  'Google Play Store install verification: Completed',
  'Post-launch monitoring plan: Completed',
  'Post-launch monitoring checklist readiness: Completed',
  'Post-launch monitoring execution: Pending',
  'Initial post-launch monitoring review: Pending',
  'Android vitals review: Pending',
  'Crash and ANR review: Pending',
  'App statistics review: Pending',
  'Ratings and reviews review: Pending',
  'Policy status review: Pending',
  'Support inquiry review: Pending',
  'Post-install functional QA: Pending',
  'Detailed Android device QA: Pending',
  'First update planning: Pending',
  '실제 Google Play Console 모니터링 실행 없음',
  '실제 Android vitals 확인 없음',
  '실제 crash/ANR 결과 확인 없음',
  '실제 앱 통계 확인 없음',
  '실제 평점/리뷰 확인 없음',
  '외부 분석 SDK 추가 없음',
  'crash-reporting SDK 추가 없음',
  'Play Developer Reporting API 연동 없음',
  '실제 AAB/APK 파일 추가 없음',
  '실제 keystore 파일 추가 없음',
  'signing credentials 추가 없음',
  'committed secrets 없음',
  'service account key 추가 없음',
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
  'npm run check:post-launch-monitoring-readiness 결과',
  'npm run check:google-play-release-live-record 결과',
];

const requiredChangelogSnippets = [
  'Added the Google Play post-launch monitoring plan and readiness checklist.',
  'Added the post-launch monitoring readiness check.',
  '- Post-launch monitoring execution',
  '- Initial post-launch monitoring review',
  '- Android vitals review',
  '- Crash and ANR review',
  '- App statistics review',
  '- Ratings and reviews review',
  '- Post-install functional QA',
  '- Detailed Android device QA',
  '- First update planning',
];

const forbiddenCompletionClaims = [
  'Post-launch monitoring: Completed',
  'Post-launch monitoring execution: Completed',
  'Initial post-launch monitoring review: Completed',
  'Android vitals review: Completed',
  'Crash and ANR review: Completed',
  'App statistics review: Completed',
  'Ratings and reviews review: Completed',
  'Policy status review: Completed',
  'Support inquiry review: Completed',
  'Post-install functional QA: Completed',
  'Detailed Android device QA: Completed',
  'First update planning: Completed',
  'Initial monitoring completed',
  'All post-launch checks completed',
  'All Android QA completed',
];

const unsupportedResultClaims = [
  'Crash rate: 0%',
  'ANR rate: 0%',
  'No crashes confirmed',
  'No ANRs confirmed',
  'No crashes',
  'No ANRs',
  'No negative reviews',
  'No support inquiries',
  'No issues confirmed',
  'All users installed successfully',
  'Monitoring completed',
  'Android vitals: Pass',
  'Crash and ANR: Pass',
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

for (const filePath of requiredFiles) {
  logResult(`file_exists_${labelFromSnippet(filePath)}`, fs.existsSync(filePath));
}

if (requiredFiles.some((filePath) => !fs.existsSync(filePath))) {
  console.error('Post-launch monitoring readiness check failed.');
  process.exit(1);
}

const doc = fs.readFileSync(docPath, 'utf8');
const todo = fs.readFileSync('TODO.md', 'utf8');
const devLog = fs.readFileSync('DEVELOPMENT_LOG.md', 'utf8');
const changelog = fs.readFileSync('CHANGELOG.md', 'utf8');
const packageJsonText = fs.readFileSync('package.json', 'utf8');
const todoSection = sectionText(todo, '## Post-Launch Monitoring Readiness TODO');
const devLogSection = sectionText(devLog, '## Post-Launch Monitoring Readiness');
const firstDocsHeading = changelog.indexOf('## Docs');
const nextDocsHeading = changelog.indexOf('\n## Docs', firstDocsHeading + '## Docs'.length);
const changelogEntry =
  nextDocsHeading === -1 ? changelog : changelog.slice(0, nextDocsHeading);

logResult('todo_has_post_launch_monitoring_readiness_section', todoSection.length > 0);
logResult('dev_log_has_post_launch_monitoring_readiness_section', devLogSection.length > 0);

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
  logResult(`changelog_entry_includes_${labelFromSnippet(snippet)}`, changelogEntry.includes(snippet));
}

for (const [scopeName, scopeText] of [
  ['doc', doc],
  ['todo_section', todoSection],
  ['dev_log_section', devLogSection],
]) {
  for (const phrase of [...forbiddenCompletionClaims, ...unsupportedResultClaims]) {
    logResult(`${scopeName}_excludes_${labelFromSnippet(phrase)}`, !scopeText.includes(phrase));
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
  'package_json_has_post_launch_monitoring_readiness_script',
  packageJson?.scripts?.['check:post-launch-monitoring-readiness']
    === 'node scripts/checkPostLaunchMonitoringReadiness.mjs',
);

// Detect real artifact paths and credential assignments while allowing safe
// guardrail statements such as "No AAB file committed".
const changedContent = [doc, todoSection, devLogSection, changelogEntry].join('\n');
const artifactPathPattern =
  /(?:^|[\s"'`(])(?:[^\s"'`()]+[\\/])?[^\s"'`()]+\.(?:aab|apk|jks|keystore|p12|pem)(?=$|[\s"'`),])/imu;
const passwordAssignmentPattern =
  /(?:storePassword|keyPassword|keystorePassword)\s*[:=]\s*['"][^'"\s]{3,}['"]/u;
const keystoreBase64LiteralPattern =
  /ANDROID_KEYSTORE_BASE64\s*[:=]\s*['"]?[A-Za-z0-9+/]{24,}={0,2}['"]?/u;
const privateKeyPattern = /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u;
const serviceAccountPrivateKeyPattern = /"private_key"\s*:\s*"-----BEGIN PRIVATE KEY-----/u;
const googlePlayTokenPattern =
  /(?:GOOGLE_PLAY_API_TOKEN|PLAY_DEVELOPER_REPORTING_TOKEN)\s*[:=]\s*['"][^'"\s]{12,}['"]/u;

logResult('changed_content_excludes_artifact_path', !artifactPathPattern.test(changedContent));
logResult('changed_content_excludes_password_assignment', !passwordAssignmentPattern.test(changedContent));
logResult('changed_content_excludes_keystore_base64_literal', !keystoreBase64LiteralPattern.test(changedContent));
logResult('changed_content_excludes_private_key', !privateKeyPattern.test(changedContent));
logResult(
  'changed_content_excludes_service_account_private_key',
  !serviceAccountPrivateKeyPattern.test(changedContent),
);
logResult('changed_content_excludes_google_play_token', !googlePlayTokenPattern.test(changedContent));

if (hasFailure) {
  console.error('Post-launch monitoring readiness check failed.');
  process.exit(1);
}

console.log('Post-launch monitoring readiness check passed');
