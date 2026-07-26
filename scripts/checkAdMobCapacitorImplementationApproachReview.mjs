import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const paths = {
  review: 'docs/ADMOB_CAPACITOR_IMPLEMENTATION_APPROACH_REVIEW.md',
  todo: 'TODO.md',
  developmentLog: 'DEVELOPMENT_LOG.md',
  changelog: 'CHANGELOG.md',
  packageJson: 'package.json',
}

const readProjectFile = (path) =>
  readFileSync(resolve(projectRoot, path), 'utf8').replace(/\r\n/g, '\n')

const extractHeadingSection = (content, heading) => {
  const start = content.indexOf(`${heading}\n`)
  if (start < 0) {
    return ''
  }

  const sectionStart = start + heading.length + 1
  const nextHeading = content.indexOf('\n## ', sectionStart)
  return content.slice(start, nextHeading < 0 ? content.length : nextHeading)
}

const extractMarkedSection = (content, startMarker, endMarker) => {
  const start = content.indexOf(startMarker)
  const end = content.indexOf(endMarker, start + startMarker.length)
  if (start < 0 || end < 0) {
    return ''
  }

  return content.slice(start, end + endMarker.length)
}

const errors = []
const requireText = (content, text, label) => {
  if (!content.includes(text)) {
    errors.push(`${label}: missing required text: ${text}`)
  }
}

const review = readProjectFile(paths.review)
const todo = readProjectFile(paths.todo)
const developmentLog = readProjectFile(paths.developmentLog)
const changelog = readProjectFile(paths.changelog)
const packageJsonText = readProjectFile(paths.packageJson)

const todoHeading = '## AdMob Capacitor Implementation Approach Review TODO'
const developmentLogHeading = '## AdMob Capacitor Implementation Approach Review'
const changelogStart =
  '<!-- ADMOB_CAPACITOR_IMPLEMENTATION_APPROACH_REVIEW_CHANGELOG_START -->'
const changelogEnd =
  '<!-- ADMOB_CAPACITOR_IMPLEMENTATION_APPROACH_REVIEW_CHANGELOG_END -->'
const todoSection = extractHeadingSection(todo, todoHeading)
const developmentLogSection = extractHeadingSection(
  developmentLog,
  developmentLogHeading,
)
const changelogSection = extractMarkedSection(
  changelog,
  changelogStart,
  changelogEnd,
)

if (!todoSection) {
  errors.push(`TODO.md: missing section: ${todoHeading}`)
}
if (!developmentLogSection) {
  errors.push(`DEVELOPMENT_LOG.md: missing section: ${developmentLogHeading}`)
}
if (!changelogSection) {
  errors.push('CHANGELOG.md: missing marked AdMob review entry')
}

const requiredReviewText = [
  '# AdMob Capacitor Implementation Approach Review',
  'Verification date: 2026-07-26',
  'PR type: docs/check-only',
  'AdMob account verification: In progress',
  'Ad units: 0',
  'Google Mobile Ads SDK integration: Not started',
  'UMP SDK integration: Not started',
  'Technical review: Completed',
  'Candidate comparison: Completed',
  'Technical recommendation: Completed',
  'Final implementation approval: Pending',
  'Plugin installation: Not started',
  'Inline Adaptive vs Anchored Native Banner',
  '@capacitor-community/admob',
  '@capgo/capacitor-admob',
  'local Capacitor native bridge',
  'Adaptive banner does not automatically mean inline adaptive banner',
  'Plugin recommendation does not mean plugin installation',
  'Test configuration design: Completed',
  'Actual configuration implementation: Pending',
  'Actual advertisement serving: Pending',
]
for (const text of requiredReviewText) {
  requireText(review, text, paths.review)
}

const completedTodoItems = [
  'Current Capacitor and Android baseline investigation',
  'Existing rewarded-ad architecture investigation',
  'Google Mobile Ads Legacy review',
  'GMA Next-Gen review',
  'UMP SDK review',
  'Capacitor community AdMob plugin review',
  'Capgo AdMob plugin review',
  'Local native bridge review',
  'Inline versus anchored banner distinction',
  'Candidate comparison matrix',
  'Technical recommendation',
  'Test and production configuration design',
  'Android expected change scope',
  'Risk and mitigation review',
  'Validation script',
]
const pendingTodoItems = [
  'Final implementation approval',
  'Initial placement finalization',
  'Exact plugin version approval',
  'Exact Google SDK version approval',
  'Plugin installation',
  'Google Mobile Ads SDK integration',
  'UMP SDK integration',
  'AndroidManifest update',
  'Gradle update',
  'Capacitor sync',
  'Privacy options UI implementation',
  'Official test ad verification',
  'Android advertising QA',
  'Production ad configuration',
  'Actual advertisement serving',
  'First advertising update release',
]
for (const item of completedTodoItems) {
  requireText(todoSection, `- [x] ${item}`, 'TODO.md review section')
}
for (const item of pendingTodoItems) {
  requireText(todoSection, `- [ ] ${item}`, 'TODO.md review section')
}

const requiredDevelopmentLogText = [
  'Verification date: 2026-07-26',
  'Status: Docs/check-only',
  'Capacitor',
  'Android SDK baseline',
  'rewarded',
  '@capacitor-community/admob',
  '@capgo/capacitor-admob',
  'local Capacitor native bridge',
  'Legacy',
  'Next-Gen',
  'UMP',
  'true inline',
  'anchored',
  '395/500',
  '245/500',
  '420/500',
  'Blocking gates',
  'Recommended candidate',
  'Recommendation conditions',
  'Fallback',
  'Test configuration',
  'Production configuration',
  'Expected change files',
  'Risks and mitigations',
  'Follow-up PRs',
  'No SDK or plugin installation',
  'No Android changes',
  'No dependency or package-lock changes',
  'No actual IDs or personal information',
  'Test results',
]
for (const text of requiredDevelopmentLogText) {
  requireText(
    developmentLogSection,
    text,
    'DEVELOPMENT_LOG.md review section',
  )
}

const requiredChangelogText = [
  '## Docs',
  'Added the AdMob Capacitor implementation approach review.',
  'Compared maintained Capacitor AdMob plugins and a local native bridge.',
  'Recorded the Google Mobile Ads Legacy, Next-Gen, and UMP compatibility review.',
  'Distinguished true inline adaptive banners from anchored native banners.',
  'Recorded the technical recommendation, conditions, fallback, and expected Android scope.',
  '## Checks',
  'Added the AdMob Capacitor implementation approach validation check.',
  '## Pending',
  'Final implementation approval',
  'Initial banner placement finalization',
  'Exact plugin and SDK version approval',
  'Plugin and SDK integration',
  'AndroidManifest and Gradle updates',
  'Capacitor sync',
  'Official test-ad verification',
  'Android advertising QA',
  'Production ad configuration',
  'Actual advertisement serving',
  'First advertising update release',
]
for (const text of requiredChangelogText) {
  requireText(changelogSection, text, 'CHANGELOG.md review entry')
}

const forbiddenClaims = [
  'Plugin installation: Completed',
  'Google Mobile Ads SDK integration: Completed',
  'GMA Next-Gen SDK integration: Completed',
  'UMP SDK integration: Completed',
  'AndroidManifest update: Completed',
  'Gradle update: Completed',
  'Capacitor sync: Completed',
  'Test ad verification: Completed',
  'Android advertising QA: Completed',
  'Production ad request: Completed',
  'Actual advertisement serving: Completed',
  'First advertising update release: Completed',
  'Ads are live',
  'Production ads enabled',
]
const newContent = [
  [paths.review, review],
  ['TODO.md review section', todoSection],
  ['DEVELOPMENT_LOG.md review section', developmentLogSection],
  ['CHANGELOG.md review entry', changelogSection],
]
for (const [label, content] of newContent) {
  for (const claim of forbiddenClaims) {
    if (content.includes(claim)) {
      errors.push(`${label}: forbidden completion claim: ${claim}`)
    }
  }
}

const sensitivePatterns = [
  ['real Google Mobile Ads identifier', /\bca-app-pub-\d{16}[~/]\d{10}\b/i],
  ['publisher identifier', /\bpub-\d{16}\b/i],
  [
    'test device identifier value',
    /\b(?:test(?:\s*device)?(?:\s*id)?|testDeviceIds?)\s*[:=]\s*[`"']?[A-F0-9-]{12,}[`"']?/i,
  ],
  [
    'Android Advertising ID value',
    /\b(?:advertising(?:\s*id)?|aaid)\s*[:=]\s*[`"']?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[`"']?/i,
  ],
  [
    'payment profile value',
    /\bpayment\s*profile(?:\s*id)?\s*[:=]\s*[`"']?[A-Za-z0-9_-]{6,}[`"']?/i,
  ],
  ['email address', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i],
  [
    'detailed street address',
    /\b\d{1,6}\s+[A-Za-z0-9가-힣.-]+\s+(?:street|st\.|road|rd\.|avenue|ave\.|lane|ln\.|길|로)\b/i,
  ],
  [
    'bank account value',
    /\b(?:bank\s*account|account\s*number|계좌번호)\s*[:=]\s*[`"']?[\d -]{8,}[`"']?/i,
  ],
  [
    'token, credential, or secret value',
    /\b(?:access[_ -]?token|api[_ -]?token|credential|client[_ -]?secret|api[_ -]?secret)\s*[:=]\s*[`"'][^`"'\s]{8,}[`"']/i,
  ],
  ['private key material', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i],
  [
    'keystore or signing secret value',
    /\b(?:keystore|keyAlias|keyPassword|storePassword|signing)\s*[:=]\s*[`"'][^`"'\s]{4,}[`"']/i,
  ],
]
for (const [label, content] of newContent) {
  const contentWithoutAllowedExample = content.replaceAll(
    'ca-app-pub-xxxxxxxxxxxxxxxx~yyyyyyyyyy',
    '',
  )
  for (const [patternLabel, pattern] of sensitivePatterns) {
    if (pattern.test(contentWithoutAllowedExample)) {
      errors.push(`${label}: detected ${patternLabel}`)
    }
  }
}

const expectedScript =
  'node scripts/checkAdMobCapacitorImplementationApproachReview.mjs'
try {
  const packageJson = JSON.parse(packageJsonText)
  if (
    packageJson.scripts?.[
      'check:admob-capacitor-implementation-approach-review'
    ] !== expectedScript
  ) {
    errors.push('package.json: missing or incorrect AdMob review check script')
  }
} catch (error) {
  errors.push(`package.json: invalid JSON (${error.message})`)
}

const allowedChangedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  'docs/ADMOB_CAPACITOR_IMPLEMENTATION_APPROACH_REVIEW.md',
  'package.json',
  'scripts/checkAdMobCapacitorImplementationApproachReview.mjs',
])

const gitLines = (...args) => {
  const output = execFileSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  return output
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim().replaceAll('\\', '/'))
    .filter(Boolean)
}

try {
  const changedFiles = new Set([
    ...gitLines('diff', '--name-only', 'origin/main...HEAD'),
    ...gitLines('diff', '--name-only', '--cached'),
    ...gitLines('diff', '--name-only'),
    ...gitLines('ls-files', '--others', '--exclude-standard'),
  ])
  for (const path of changedFiles) {
    if (!allowedChangedFiles.has(path)) {
      errors.push(`change scope: unexpected changed file: ${path}`)
    }
  }
} catch (error) {
  errors.push(
    `change scope: could not inspect git changes from ${relative(
      process.cwd(),
      projectRoot,
    ) || '.'} (${error.message})`,
  )
}

if (errors.length > 0) {
  console.error('AdMob Capacitor implementation approach review check failed.')
  for (const error of errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log('AdMob Capacitor implementation approach review check passed')
