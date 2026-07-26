import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const readinessPath = 'docs/ADVERTISING_CONSOLE_READINESS.md'
const allowedChangedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  readinessPath,
  'package.json',
  'scripts/checkAdvertisingConsoleReadiness.mjs',
])

const readProjectFile = (path) =>
  readFileSync(resolve(projectRoot, path), 'utf8').replace(/\r\n/g, '\n')

const gitOutput = (...args) =>
  execFileSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).replace(/\r\n/g, '\n')

const gitLines = (...args) =>
  gitOutput(...args)
    .split('\n')
    .map((line) => line.trim().replaceAll('\\', '/'))
    .filter(Boolean)

const extractHeadingSection = (content, heading, nextLevel = '## ') => {
  const start = content.indexOf(`${heading}\n`)
  if (start < 0) return ''
  const sectionStart = start + heading.length + 1
  const nextHeading = content.indexOf(`\n${nextLevel}`, sectionStart)
  return content.slice(start, nextHeading < 0 ? content.length : nextHeading)
}

const errors = []
const requireText = (content, text, label) => {
  if (!content.includes(text)) errors.push(`${label}: missing required text: ${text}`)
}

const readiness = readProjectFile(readinessPath)
const todo = readProjectFile('TODO.md')
const developmentLog = readProjectFile('DEVELOPMENT_LOG.md')
const changelog = readProjectFile('CHANGELOG.md')
const packageJsonText = readProjectFile('package.json')

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

let packageJson
let basePackageJson
try {
  packageJson = JSON.parse(packageJsonText)
  basePackageJson = JSON.parse(gitOutput('show', 'origin/main:package.json'))
} catch (error) {
  errors.push(`package.json guardrail setup failed: ${error.message}`)
}

const checkScriptName = 'check:advertising-console-readiness'
const expectedCommand = 'node scripts/checkAdvertisingConsoleReadiness.mjs'
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
  if (addedScripts.length !== 1 || addedScripts[0] !== checkScriptName) {
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

const addedTrackedLines = gitOutput(
  'diff',
  '--unified=0',
  '--no-color',
  'origin/main',
  '--',
  ...allowedChangedFiles,
)
  .split('\n')
  .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
  .map((line) => line.slice(1))
  .join('\n')
const untrackedFiles = new Set(gitLines('ls-files', '--others', '--exclude-standard'))
const addedUntrackedLines = [...allowedChangedFiles]
  .filter((path) => untrackedFiles.has(path))
  .map((path) => readProjectFile(path))
  .join('\n')
const addedDiff = `${addedTrackedLines}\n${addedUntrackedLines}`

const sensitivePatterns = [
  ['actual AdMob App ID or ad unit ID', /\bca-app-pub-\d{16}[~/]\d{10}\b/u],
  ['actual publisher ID', /\bpub-\d{8,}\b/iu],
  [
    'actual test or consent debug device ID',
    /\b(?:test|debug|consent)[\w -]*(?:device)?[\w -]*id\s*[:=]\s*[`"']?[A-F0-9-]{12,}/iu,
  ],
  [
    'actual API key or credential',
    /\b(?:api[_ -]?key|client[_ -]?secret|secret|token|password)\s*[:=]\s*[`"'][^`"'\s]{8,}/iu,
  ],
  ['private key material', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/u],
]
for (const [label, pattern] of sensitivePatterns) {
  if (pattern.test(addedDiff)) errors.push(`added lines: detected ${label}`)
}

const requiredStatuses = [
  'AdMob account verification: In progress',
  'Ad units: 0',
  'Google Mobile Ads SDK integration: Not started',
  'UMP SDK integration: Not started',
  'Actual advertisement requests: No data',
  'Actual advertisement serving: Pending',
  'First advertising update release: Pending',
  'Android device external-browser QA: Completed',
  'Store-installed production version link verification: Pending',
  'Google Play Data safety update: Pending',
  'Advertising ID decision: Pending',
  'AdMob Privacy & Messaging configuration: Pending',
  'Consent revocation UI: Not started',
]
for (const status of requiredStatuses) {
  requireText(readiness, status, readinessPath)
}

const forbiddenCompletionClaims = [
  ['Google Play Data safety', 'Completed'],
  ['Advertising ID declaration', 'Completed'],
  ['AdMob Privacy & Messaging', 'Completed'],
  ['UMP SDK integration', 'Completed'],
  ['Mobile Ads SDK integration', 'Completed'],
  ['Ad unit creation', 'Completed'],
  ['Actual advertisement serving', 'Completed'],
  ['First advertising update release', 'Completed'],
  ['Store-installed production version link verification', 'Completed'],
].map(([subject, state]) => `${subject}: ${state}`)

for (const claim of forbiddenCompletionClaims) {
  for (const [label, content] of [
    [readinessPath, readiness],
    ['TODO.md readiness section', extractHeadingSection(todo, '## Advertising Console Readiness TODO')],
    [
      'DEVELOPMENT_LOG.md readiness section',
      extractHeadingSection(developmentLog, '## Advertising Console Readiness'),
    ],
    [
      'CHANGELOG.md readiness section',
      extractHeadingSection(changelog, '## Advertising Console Readiness'),
    ],
  ]) {
    if (content.includes(claim)) {
      errors.push(`${label}: forbidden completion claim: ${claim}`)
    }
  }
}

const requiredSections = [
  'Purpose and scope',
  'Verified current-state snapshot',
  'Current production versus planned advertising update',
  'Google Play Data safety readiness worksheet',
  'Advertising ID decision record',
  'AdMob Privacy & Messaging readiness',
  'Planned UMP consent flow',
  'Privacy options and revocation UI requirement',
  'Console execution checklist',
  'Entry criteria for implementation PR',
  'Official references',
]
for (const section of requiredSections) {
  requireText(readiness, `## ${section}`, readinessPath)
}

const officialUrls = [
  'support.google.com/googleplay/android-developer/answer/10787469',
  'support.google.com/googleplay/android-developer/answer/6048248',
  'developers.google.com/admob/android/privacy/play-data-disclosure',
  'developers.google.com/admob/android/sdk',
  'developers.google.com/admob/android/privacy',
  'support.google.com/admob/answer/10107561',
  'support.google.com/admob/answer/12226986',
]
for (const url of officialUrls) requireText(readiness, url, readinessPath)
requireText(readiness, '2026-07-26', readinessPath)

for (const text of [
  'Currently published production version',
  'Planned first advertising update',
  'No actual Console changes in this PR',
  'No SDK integration in this PR',
  'Final answers pending exact SDK and merged manifest verification',
  'Galaxy S23 Ultra',
  'Android Debug APK',
  'User-confirmed manual QA',
  'Android device external-browser QA: Completed',
  'Store-installed production version link verification: Pending',
  'Advertising flow not tested',
]) {
  requireText(readiness, text, readinessPath)
}

for (const api of [
  'requestConsentInfoUpdate()',
  'loadAndShowConsentFormIfRequired()',
  'getPrivacyOptionsRequirementStatus()',
  'showPrivacyOptionsForm()',
  'canRequestAds()',
  'reset()',
]) {
  requireText(readiness, api, readinessPath)
}
requireText(readiness, '`reset()` is testing only', readinessPath)
requireText(readiness, 'Production use is prohibited', readinessPath)

const consoleSection = extractHeadingSection(
  readiness,
  '## Console execution checklist',
)
requireText(consoleSection, '### Google Play Console', 'Console checklist')
requireText(consoleSection, '### AdMob Console', 'Console checklist')
if (/^- \[[xX]\]/mu.test(consoleSection)) {
  errors.push('Console checklist: completed checkbox found before actual execution')
}
if (!/^- \[ \]/mu.test(consoleSection)) {
  errors.push('Console checklist: no pending checkboxes found')
}

for (const [label, content] of [
  ['TODO.md readiness section', extractHeadingSection(todo, '## Advertising Console Readiness TODO')],
  [
    'DEVELOPMENT_LOG.md readiness section',
    extractHeadingSection(developmentLog, '## Advertising Console Readiness'),
  ],
  [
    'CHANGELOG.md readiness section',
    extractHeadingSection(changelog, '## Advertising Console Readiness'),
  ],
]) {
  if (!content) errors.push(`${label}: section missing`)
}

if (errors.length > 0) {
  console.error('Advertising console readiness check failed.')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log('Advertising console readiness check passed')
