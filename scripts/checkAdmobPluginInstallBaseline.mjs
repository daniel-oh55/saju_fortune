import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const documentPath = 'docs/ADMOB_PLUGIN_INSTALL_BASELINE.md'
const checkerPath = 'scripts/checkAdmobPluginInstallBaseline.mjs'
const allowedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  documentPath,
  'package.json',
  'package-lock.json',
  checkerPath,
  'android/variables.gradle',
  'android/capacitor.settings.gradle',
  'android/app/capacitor.build.gradle',
])
const requiredChangedFiles = new Set(allowedFiles)
const errors = []
const read = (path) => readFileSync(resolve(root, path), 'utf8').replace(/\r\n/g, '\n')
const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n')
const lines = (...args) =>
  git(...args).split('\n').map((line) => line.trim().replaceAll('\\', '/')).filter(Boolean)
const requireText = (content, text, label) => {
  if (!content.includes(text)) errors.push(`${label}: missing required text: ${text}`)
}

const changedFiles = new Set([
  ...lines('diff', '--name-only', 'origin/main...HEAD'),
  ...lines('diff', '--name-only', '--cached'),
  ...lines('diff', '--name-only'),
  ...lines('ls-files', '--others', '--exclude-standard'),
])

for (const path of changedFiles) {
  if (!allowedFiles.has(path)) errors.push(`change scope: unexpected changed file: ${path}`)
}
for (const path of requiredChangedFiles) {
  if (!changedFiles.has(path)) errors.push(`change scope: expected changed file is missing: ${path}`)
}
for (const prefix of ['src/', 'public/']) {
  if ([...changedFiles].some((path) => path.startsWith(prefix))) {
    errors.push(`production source: ${prefix} must remain unchanged`)
  }
}
for (const pattern of [
  /^capacitor\.config\./u,
  /^vite\.config\./u,
  /^android\/app\/src\/main\/AndroidManifest\.xml$/u,
  /^android\/app\/src\/main\/res\/values\/strings\.xml$/u,
  /^android\/app\/src\/main\/(?:java|kotlin)\//u,
  /^android\/gradle\/wrapper\//u,
  /^android\/build\.gradle$/u,
  /^android\/app\/build\.gradle$/u,
  /^\.github\/workflows\//u,
]) {
  if ([...changedFiles].some((path) => pattern.test(path))) {
    errors.push(`Android/native scope: forbidden changed path matching ${pattern}`)
  }
}

const packageJson = JSON.parse(read('package.json'))
const basePackageJson = JSON.parse(git('show', 'origin/main:package.json'))
if (packageJson.dependencies?.['@capacitor-community/admob'] !== '8.0.0') {
  errors.push('package.json: @capacitor-community/admob must be exact 8.0.0')
}
if (/^[~^]/u.test(packageJson.dependencies?.['@capacitor-community/admob'] ?? '')) {
  errors.push('package.json: floating AdMob plugin range is forbidden')
}
const currentDependencies = { ...packageJson.dependencies }
delete currentDependencies['@capacitor-community/admob']
if (JSON.stringify(currentDependencies) !== JSON.stringify(basePackageJson.dependencies)) {
  errors.push('package.json: an existing dependency changed')
}
if (JSON.stringify(packageJson.devDependencies) !== JSON.stringify(basePackageJson.devDependencies)) {
  errors.push('package.json: devDependencies changed')
}
const scriptName = 'check:admob-plugin-install-baseline'
const expectedCommand = `node ${checkerPath}`
if (packageJson.scripts?.[scriptName] !== expectedCommand) {
  errors.push(`package.json: incorrect ${scriptName} command`)
}
const currentScripts = { ...packageJson.scripts }
delete currentScripts[scriptName]
if (JSON.stringify(currentScripts) !== JSON.stringify(basePackageJson.scripts)) {
  errors.push('package.json: an existing script changed')
}

const packageLock = JSON.parse(read('package-lock.json'))
const rootLockVersion = packageLock.packages?.['']?.dependencies?.['@capacitor-community/admob']
const pluginLock = packageLock.packages?.['node_modules/@capacitor-community/admob']
if (rootLockVersion !== '8.0.0') errors.push('package-lock.json: root exact version is missing')
if (pluginLock?.version !== '8.0.0') errors.push('package-lock.json: resolved plugin version is not 8.0.0')
if (!pluginLock?.resolved?.endsWith('/admob-8.0.0.tgz')) {
  errors.push('package-lock.json: exact resolved tarball is missing')
}
if (!pluginLock?.integrity) errors.push('package-lock.json: plugin integrity is missing')

const variables = read('android/variables.gradle')
for (const pin of [
  "playServicesAdsVersion = '24.9.0'",
  "userMessagingPlatformVersion = '4.0.0'",
]) {
  requireText(variables, pin, 'android/variables.gradle')
}
for (const [label, pattern] of [
  ['floating Mobile Ads 24.9 range', /playServicesAdsVersion\s*=\s*['"]24\.9\.\+['"]/u],
  ['floating Mobile Ads 24 range', /playServicesAdsVersion\s*=\s*['"]24\.\+['"]/u],
  ['Mobile Ads 25.x', /playServicesAdsVersion\s*=\s*['"]25\./u],
  ['floating UMP 4 range', /userMessagingPlatformVersion\s*=\s*['"]4\.\+['"]/u],
]) {
  if (pattern.test(variables)) errors.push(`android/variables.gradle: ${label} is forbidden`)
}
for (const key of ['minSdkVersion', 'compileSdkVersion', 'targetSdkVersion']) {
  const current = variables.match(new RegExp(`${key}\\s*=\\s*(\\d+)`, 'u'))?.[1]
  const base = git('show', 'origin/main:android/variables.gradle')
    .match(new RegExp(`${key}\\s*=\\s*(\\d+)`, 'u'))?.[1]
  if (current !== base) errors.push(`android/variables.gradle: ${key} changed`)
}

const capacitorSettings = read('android/capacitor.settings.gradle')
const capacitorBuild = read('android/app/capacitor.build.gradle')
requireText(capacitorSettings, "include ':capacitor-community-admob'", 'Capacitor registration')
requireText(
  capacitorSettings,
  "node_modules/@capacitor-community/admob/android",
  'Capacitor registration',
)
requireText(
  capacitorBuild,
  "implementation project(':capacitor-community-admob')",
  'Capacitor registration',
)

const document = read(documentPath)
const normalizedDocument = document.replace(/\s+/gu, ' ')
for (const section of [
  'Purpose and scope',
  'Starting baseline',
  'Installed package',
  'Package-lock verification',
  'Android plugin registration',
  'Exact Android dependency pins',
  'Resolved dependency tree',
  'Debug build verification',
  'Release build verification',
  'Debug merged manifest observations',
  'Release merged manifest observations',
  'Advertising ID impact',
  'Application ID status',
  'Runtime integration status',
  'Files changed',
  'Files intentionally unchanged',
  'Rollback plan',
  'Blocking conditions',
  'Pending work',
  'Official references',
]) {
  requireText(document, `## ${section}`, documentPath)
}
for (const text of [
  'AdMob plugin dependency installation: Completed',
  'Mobile Ads SDK runtime initialization: Not started',
  'UMP consent flow integration: Not started',
  'AdMob App ID configuration: Not started',
  'Production ad units: 0',
  'Actual ad requests: No data',
  'Actual ad serving: Pending',
  '24.9.0',
  '4.0.0',
  'debugRuntimeClasspath',
  'releaseRuntimeClasspath',
  'dependencyInsight',
  'Debug merged manifest inspection: Completed',
  'Release merged manifest inspection: Blocked',
]) {
  requireText(normalizedDocument, text, documentPath)
}
const runtimeNotStarted = 'Mobile Ads SDK runtime initialization: Not started'
if (document.split(runtimeNotStarted).length - 1 !== 2) {
  errors.push(`${documentPath}: runtime initialization Not started must be recorded twice`)
}
for (const forbiddenClaim of [
  'Mobile Ads SDK integration: Completed',
  'UMP integration: Completed',
  'Android native configuration: Completed',
  'Advertising ID declaration: Completed',
  'Data safety: Completed',
  'Official test-ad QA: Completed',
  'Actual ad serving: Completed',
  'Release signing: Completed',
  'AAB generation: Completed',
]) {
  if (normalizedDocument.includes(forbiddenClaim)) {
    errors.push(`${documentPath}: forbidden completion claim: ${forbiddenClaim}`)
  }
}

const textFiles = [...allowedFiles].filter((path) => /\.(?:md|json|mjs|gradle)$/u.test(path))
for (const path of textFiles) {
  const content = read(path)
  if (content.includes('\uFFFD')) errors.push(`${path}: Unicode replacement character found`)
}
const privacyLabel = '개인정보 및 쿠키 설정'
if (document.includes('개인정보') && document.includes('쿠키') && !document.includes(privacyLabel)) {
  errors.push(`${documentPath}: privacy-options label is not valid UTF-8`)
}

const identifierPrefix = `${['ca', 'app', 'pub'].join('-')}-`
const changedContent = [...changedFiles]
  .filter((path) => allowedFiles.has(path))
  .map((path) => read(path))
  .join('\n')
if (changedContent.includes(identifierPrefix)) {
  errors.push('added content: AdMob identifier prefix is forbidden')
}

const runtimeCalls = [
  ['AdMob', 'initialize'].join('.'),
  'requestConsentInfo(',
  'showConsentForm(',
  'showPrivacyOptionsForm(',
]
for (const path of [...changedFiles].filter((item) => item.startsWith('src/'))) {
  const content = read(path)
  for (const call of runtimeCalls) {
    if (content.includes(call)) errors.push(`${path}: runtime call is forbidden: ${call}`)
  }
}

if (errors.length) {
  console.error('AdMob plugin install baseline check failed.')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log('AdMob plugin install baseline check passed')
