import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const documentPath = 'docs/ADMOB_PLUGIN_VERSION_SELECTION.md'
const allowedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  documentPath,
  'package.json',
  'scripts/checkAdmobPluginVersionSelection.mjs',
])
const read = (path) => readFileSync(resolve(root, path), 'utf8').replace(/\r\n/g, '\n')
const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n')
const lines = (...args) =>
  git(...args).split('\n').map((line) => line.trim().replaceAll('\\', '/')).filter(Boolean)
const errors = []
const requireText = (content, text, label) => {
  if (!content.includes(text)) errors.push(`${label}: missing required text: ${text}`)
}

const document = read(documentPath)
const packageJson = JSON.parse(read('package.json'))
const basePackageJson = JSON.parse(git('show', 'origin/main:package.json'))
const changedFiles = new Set([
  ...lines('diff', '--name-only', 'origin/main...HEAD'),
  ...lines('diff', '--name-only', '--cached'),
  ...lines('diff', '--name-only'),
  ...lines('ls-files', '--others', '--exclude-standard'),
])

for (const path of changedFiles) {
  if (!allowedFiles.has(path)) errors.push(`change scope: unexpected changed file: ${path}`)
}
for (const path of allowedFiles) {
  if (!changedFiles.has(path)) errors.push(`change scope: expected changed file is missing: ${path}`)
}
for (const forbiddenPrefix of ['src/', 'public/', 'android/']) {
  if ([...changedFiles].some((path) => path.startsWith(forbiddenPrefix))) {
    errors.push(`change scope: ${forbiddenPrefix} must remain unchanged`)
  }
}
if ([...changedFiles].some((path) => /^capacitor\.config\./u.test(path))) {
  errors.push('change scope: Capacitor config must remain unchanged')
}
if (changedFiles.has('package-lock.json')) errors.push('change scope: package-lock.json changed')

for (const section of [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
]) {
  if (JSON.stringify(packageJson[section]) !== JSON.stringify(basePackageJson[section])) {
    errors.push(`package.json: ${section} changed`)
  }
}
const scriptName = 'check:admob-plugin-version-selection'
const command = 'node scripts/checkAdmobPluginVersionSelection.mjs'
const baseScripts = basePackageJson.scripts ?? {}
const currentScripts = packageJson.scripts ?? {}
const addedScripts = Object.keys(currentScripts).filter(
  (name) => !Object.hasOwn(baseScripts, name),
)
if (addedScripts.length !== 1 || addedScripts[0] !== scriptName) {
  errors.push(`package.json: only ${scriptName} may be added`)
}
for (const [name, value] of Object.entries(baseScripts)) {
  if (currentScripts[name] !== value) errors.push(`package.json: existing script changed: ${name}`)
}
if (currentScripts[scriptName] !== command) errors.push(`package.json: incorrect ${scriptName}`)

const requiredSections = [
  'Purpose and scope',
  'Current project baseline',
  'Candidate plugins and versions',
  'Compatibility matrix',
  'Selected baseline',
  'UMP and privacy options support',
  'Android native impact',
  'Manifest and Advertising ID impact',
  'Test-ad strategy',
  'Consent-flow implementation order',
  'Entry criteria for implementation PR',
  'Blocking conditions',
  'Rollback plan',
  'Official references',
  'Pending work',
]
for (const section of requiredSections) requireText(document, `## ${section}`, documentPath)
for (const status of [
  'Plugin selection: Completed',
  'Plugin installation: Not started',
  'Mobile Ads SDK integration: Not started',
  'UMP integration: Not started',
  'Android native configuration: Not started',
  'European regulations message: Draft',
  'European regulations message publication: Not started',
  'US state regulations message: Not started',
  'Ad units: 0',
  'Actual ad requests: No data',
  'Actual ad serving: Pending',
]) requireText(document, status, documentPath)
for (const evidence of [
  '@capacitor-community/admob@8.0.0',
  '`@capacitor/core ^8.0.0`',
  'Capacitor core | 8.4.0',
  'showPrivacyOptionsForm',
  'canRequestAds',
  'npmjs.com/package/@capacitor-community/admob',
  'github.com/capacitor-community/admob',
  'developers.google.com/admob/android/privacy',
]) requireText(document, evidence, documentPath)
if (!/Selected exact version: `@capacitor-community\/admob@\d+\.\d+\.\d+`/u.test(document)) {
  errors.push(`${documentPath}: exact plugin version is not recorded`)
}

const diff = git('diff', '--unified=0', 'origin/main', '--', ...allowedFiles)
const forbiddenSecrets = [
  ['Google Mobile Ads identifier', /\bca-app-pub-\d{16}[~/]\d{10}\b/u],
  ['test device identifier', /\b[A-F0-9]{24,}\b/u],
]
for (const [label, pattern] of forbiddenSecrets) {
  if (pattern.test(diff)) errors.push(`added content: ${label} is forbidden`)
}
if (/\b(?:Plugin installation|Mobile Ads SDK integration|UMP integration|Android native configuration): Completed\b/u.test(document)) {
  errors.push(`${documentPath}: implementation completion is forbidden`)
}

if (errors.length) {
  console.error('AdMob plugin version selection check failed.')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log('AdMob plugin version selection check passed')
