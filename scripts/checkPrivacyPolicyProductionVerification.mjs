import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const paths = {
  verification: 'docs/PRIVACY_POLICY_PRODUCTION_VERIFICATION.md',
  todo: 'TODO.md',
  developmentLog: 'DEVELOPMENT_LOG.md',
  changelog: 'CHANGELOG.md',
  packageJson: 'package.json',
}

const readProjectFile = (path) =>
  readFileSync(resolve(projectRoot, path), 'utf8').replace(/\r\n/g, '\n')

const extractHeadingSection = (content, heading) => {
  const start = content.indexOf(`${heading}\n`)
  if (start < 0) return ''

  const sectionStart = start + heading.length + 1
  const nextHeading = content.indexOf('\n## ', sectionStart)
  return content.slice(start, nextHeading < 0 ? content.length : nextHeading)
}

const extractMarkedSection = (content, startMarker, endMarker) => {
  const start = content.indexOf(startMarker)
  const end = content.indexOf(endMarker, start + startMarker.length)
  if (start < 0 || end < 0) return ''
  return content.slice(start, end + endMarker.length)
}

const errors = []
const requireText = (content, text, label) => {
  if (!content.includes(text)) {
    errors.push(`${label}: missing required text: ${text}`)
  }
}

const verification = readProjectFile(paths.verification)
const todo = readProjectFile(paths.todo)
const developmentLog = readProjectFile(paths.developmentLog)
const changelog = readProjectFile(paths.changelog)
const packageJsonText = readProjectFile(paths.packageJson)

const todoHeading = '## Privacy Policy Production Verification TODO'
const developmentLogHeading = '## Privacy Policy Production Verification'
const changelogStart =
  '<!-- PRIVACY_POLICY_PRODUCTION_VERIFICATION_CHANGELOG_START -->'
const changelogEnd =
  '<!-- PRIVACY_POLICY_PRODUCTION_VERIFICATION_CHANGELOG_END -->'
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

if (!todoSection) errors.push(`TODO.md: missing section: ${todoHeading}`)
if (!developmentLogSection) {
  errors.push(`DEVELOPMENT_LOG.md: missing section: ${developmentLogHeading}`)
}
if (!changelogSection) {
  errors.push('CHANGELOG.md: missing marked production verification entry')
}

const requiredVerificationText = [
  '# Privacy Policy Production Verification',
  'Verification date: 2026-07-26',
  'PR type: docs/check-only',
  'Website privacy policy update PR: Completed',
  'Production privacy policy deployment: Completed',
  'Production privacy policy live verification: Completed',
  'Production app-ads.txt live verification: Completed',
  'https://hymlounge.com/harupuli/privacy/',
  'https://hymlounge.com/app-ads.txt',
  'Privacy policy final modified date: 2026-07-26',
  'Privacy contact unification: Pending',
  'Legal wording confirmation: Pending',
  'Google Play Data safety update: Pending',
  'Advertising ID decision: Pending',
  'AdMob Privacy & Messaging configuration: Pending',
  'Consent revocation UI: Not started',
  'Ad units: 0',
  'Google Mobile Ads SDK integration: Not started',
  'UMP SDK integration: Not started',
  'Actual advertisement requests: No data',
  'Actual advertisement serving: Pending',
  'First advertising update release: Pending',
  'Mobile privacy-policy page overflow correction: Pending',
  'App privacy policy URL match: Pending',
  'Website deployment completed does not mean SDK integration completed.',
  'app-ads.txt verification does not mean actual advertisement serving.',
]
for (const text of requiredVerificationText) {
  requireText(verification, text, paths.verification)
}

const completedTodoItems = [
  'Website privacy policy update PR merge',
  'Website local cleanup',
  'Production privacy policy deployment',
  'Production privacy policy live verification',
  'Production app-ads.txt live verification',
  'Privacy policy dates verification',
  'Conditional advertising disclosure verification',
  'Google privacy-policy external-link verification',
  'Desktop and mobile rendering verification',
  'App privacy policy URL investigation',
  'Validation script',
]
const pendingTodoItems = [
  'App privacy policy URL match',
  'Mobile privacy-policy page overflow correction',
  'Privacy contact unification',
  'Legal wording confirmation',
  'Google Play Data safety update',
  'Advertising ID decision',
  'AdMob Privacy & Messaging configuration',
  'Consent revocation UI',
  'Mobile Ads integration',
  'UMP integration',
  'Official test-ad verification',
  'Android advertising QA',
  'Ad unit creation',
  'Production ad configuration',
  'Actual advertisement serving',
  'First advertising update release',
]
for (const item of completedTodoItems) {
  requireText(todoSection, `- [x] ${item}`, 'TODO.md verification section')
}
for (const item of pendingTodoItems) {
  requireText(todoSection, `- [ ] ${item}`, 'TODO.md verification section')
}

const requiredDevelopmentLogText = [
  'Verification date: 2026-07-26',
  'Status: Docs/check-only',
  'daniel-oh55/hym-lounge-website',
  'PR #3',
  'https://hymlounge.com/harupuli/privacy/',
  'https://hymlounge.com/app-ads.txt',
  '2026-07-13',
  '2026-07-26',
  'hym.lounge@gmail.com',
  'src/pages/SettingsPage.jsx',
  'src/pages/PrivacyInfoPage.jsx',
  'App privacy policy URL match: Pending',
  'conditional',
  'Desktop rendering',
  'Mobile rendering',
  'app-ads.txt content unchanged',
  'Legal wording confirmation: Pending',
  'Privacy contact unification: Pending',
  'Google Play Data safety update: Pending',
  'Advertising ID decision: Pending',
  'AdMob Privacy & Messaging configuration: Pending',
  'Consent revocation UI: Not started',
  'Google Mobile Ads SDK integration: Not started',
  'UMP SDK integration: Not started',
  'Ad units: 0',
  'Actual advertisement requests: No data',
  'Actual advertisement serving: Pending',
  'First advertising update release: Pending',
  'Mobile privacy-policy page overflow correction: Pending',
  'Tests',
  'Changed files',
]
for (const text of requiredDevelopmentLogText) {
  requireText(
    developmentLogSection,
    text,
    'DEVELOPMENT_LOG.md verification section',
  )
}

const requiredChangelogText = [
  '## Docs',
  'Recorded the production deployment of the updated Harupuli privacy policy.',
  'Recorded live verification of the privacy policy and app-ads.txt URLs.',
  'Recorded the app privacy-policy URL investigation and match result.',
  'Preserved legal wording and privacy-contact confirmation as Pending.',
  '## Checks',
  'Added the privacy-policy production verification check.',
  '## Pending',
  'Privacy contact unification',
  'Legal wording confirmation',
  'Google Play Data safety update',
  'Advertising ID decision',
  'AdMob Privacy & Messaging configuration',
  'Mobile Ads and UMP integration',
  'Test-ad verification',
  'Android advertising QA',
  'Ad unit creation',
  'Production ad configuration',
  'Actual advertisement serving',
  'First advertising update release',
]
for (const text of requiredChangelogText) {
  requireText(changelogSection, text, 'CHANGELOG.md verification entry')
}

const forbiddenClaims = [
  'Google Play Data safety update: Completed',
  'Advertising ID decision: Completed',
  'AdMob Privacy & Messaging configuration: Completed',
  'Consent revocation UI: Completed',
  'Google Mobile Ads SDK integration: Completed',
  'UMP SDK integration: Completed',
  'Ad unit creation: Completed',
  'Actual advertisement requests: Completed',
  'Actual advertisement serving: Completed',
  'First advertising update release: Completed',
  'Ads are live',
  'Production ads enabled',
]
const newContent = [
  [paths.verification, verification],
  ['TODO.md verification section', todoSection],
  ['DEVELOPMENT_LOG.md verification section', developmentLogSection],
  ['CHANGELOG.md verification entry', changelogSection],
]
for (const [label, content] of newContent) {
  for (const claim of forbiddenClaims) {
    if (content.includes(claim)) {
      errors.push(`${label}: forbidden completion claim: ${claim}`)
    }
  }
}

const allowedEmail = 'hym.lounge@gmail.com'
const sensitivePatterns = [
  ['Google Mobile Ads identifier', /\bca-app-pub-[A-Za-z0-9~/_-]+\b/i],
  ['publisher identifier value', /\bpub-\d{8,}\b/i],
  [
    'test device identifier value',
    /\btest(?:\s*device)?(?:\s*id)?\s*[:=]\s*[`"']?[A-F0-9-]{12,}/i,
  ],
  [
    'Android Advertising ID value',
    /\b(?:advertising(?:\s*id)?|aaid)\s*[:=]\s*[`"']?[0-9a-f-]{32,}/i,
  ],
  [
    'payment profile value',
    /\bpayment\s*profile(?:\s*id)?\s*[:=]\s*[`"']?[A-Za-z0-9_-]{6,}/i,
  ],
  [
    'bank account value',
    /\b(?:bank\s*account|account\s*number|계좌번호)\s*[:=]\s*[`"']?[\d -]{8,}/i,
  ],
  [
    'token or credential value',
    /\b(?:token|credential|client[_ -]?secret|api[_ -]?secret)\s*[:=]\s*[`"'][^`"'\s]{8,}/i,
  ],
  ['private key material', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i],
  [
    'keystore or signing secret value',
    /\b(?:keystore|keyAlias|keyPassword|storePassword|signing)\s*[:=]\s*[`"'][^`"'\s]{4,}/i,
  ],
  [
    'detailed street address',
    /\b\d{1,6}\s+[A-Za-z0-9가-힣.-]+\s+(?:street|st\.|road|rd\.|avenue|ave\.|lane|ln\.|길|로)\b/i,
  ],
]
for (const [label, content] of newContent) {
  for (const [patternLabel, pattern] of sensitivePatterns) {
    if (pattern.test(content)) {
      errors.push(`${label}: detected ${patternLabel}`)
    }
  }

  const emails = content.match(
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  ) ?? []
  for (const email of emails) {
    if (email.toLowerCase() !== allowedEmail) {
      errors.push(`${label}: detected unapproved email address`)
    }
  }
}

let packageJson
let basePackageJson
try {
  packageJson = JSON.parse(packageJsonText)
  basePackageJson = JSON.parse(
    execFileSync('git', ['show', 'origin/main:package.json'], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }),
  )
} catch (error) {
  errors.push(`package.json guardrail setup failed: ${error.message}`)
}

const checkScriptName = 'check:privacy-policy-production-verification'
const expectedCommand =
  'node scripts/checkPrivacyPolicyProductionVerification.mjs'
if (packageJson && basePackageJson) {
  for (const sectionName of [
    'dependencies',
    'devDependencies',
    'optionalDependencies',
    'peerDependencies',
  ]) {
    if (
      JSON.stringify(packageJson[sectionName]) !==
      JSON.stringify(basePackageJson[sectionName])
    ) {
      errors.push(`package.json: ${sectionName} changed`)
    }
  }

  const baseScripts = basePackageJson.scripts ?? {}
  const currentScripts = packageJson.scripts ?? {}
  const addedScripts = Object.keys(currentScripts).filter(
    (name) => !Object.prototype.hasOwnProperty.call(baseScripts, name),
  )
  if (
    addedScripts.length !== 1 ||
    addedScripts[0] !== checkScriptName
  ) {
    errors.push(`package.json: only ${checkScriptName} may be added`)
  }
  for (const [name, command] of Object.entries(baseScripts)) {
    if (currentScripts[name] !== command) {
      errors.push(`package.json: existing script changed or removed: ${name}`)
    }
  }
  if (currentScripts[checkScriptName] !== expectedCommand) {
    errors.push(`package.json: incorrect command for ${checkScriptName}`)
  }
}

const allowedChangedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  'docs/PRIVACY_POLICY_PRODUCTION_VERIFICATION.md',
  'package.json',
  'scripts/checkPrivacyPolicyProductionVerification.mjs',
])
const gitLines = (...args) =>
  execFileSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim().replaceAll('\\', '/'))
    .filter(Boolean)

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
  for (const path of allowedChangedFiles) {
    if (!changedFiles.has(path)) {
      errors.push(`change scope: expected changed file is missing: ${path}`)
    }
  }
} catch (error) {
  errors.push(`change scope inspection failed: ${error.message}`)
}

if (errors.length > 0) {
  console.error('Privacy policy production verification check failed.')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log('Privacy policy production verification check passed')
