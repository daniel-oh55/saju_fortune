import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const documentPath = 'docs/ADMOB_PLUGIN_INSTALL_BASELINE.md'
const qaDocumentPath = 'docs/ADMOB_PLUGIN_INSTALL_QA_RUN345.md'
const manifestPath = 'android/app/src/main/AndroidManifest.xml'
const stringsPath = 'android/app/src/main/res/values/strings.xml'
const checkerPath = 'scripts/checkAdmobPluginInstallBaseline.mjs'
const expectedAppId = 'ca-app-pub-9536468405324805~1921427615'
const googleSampleAppId = ['ca-app-pub-3940256099942544', '3347511713'].join('~')
const allowedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  documentPath,
  qaDocumentPath,
  'package.json',
  'package-lock.json',
  checkerPath,
  'android/variables.gradle',
  'android/capacitor.settings.gradle',
  'android/app/capacitor.build.gradle',
  manifestPath,
  stringsPath,
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
if (packageJson.scripts?.[scriptName] !== `node ${checkerPath}`) {
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
  ['floating Mobile Ads range', /playServicesAdsVersion\s*=\s*['"]24(?:\.9)?\.\+['"]/u],
  ['Mobile Ads 25.x', /playServicesAdsVersion\s*=\s*['"]25\./u],
  ['floating UMP range', /userMessagingPlatformVersion\s*=\s*['"]4\.\+['"]/u],
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
requireText(capacitorSettings, 'node_modules/@capacitor-community/admob/android', 'Capacitor registration')
requireText(capacitorBuild, "implementation project(':capacitor-community-admob')", 'Capacitor registration')

const manifest = read(manifestPath)
const strings = read(stringsPath)
const appIdStringMatches = [
  ...strings.matchAll(/<string\s+name=["']admob_app_id["']>\s*([^<]+?)\s*<\/string>/gu),
]
if (appIdStringMatches.length !== 1) {
  errors.push(`${stringsPath}: exactly one admob_app_id string is required`)
} else if (appIdStringMatches[0][1] !== expectedAppId) {
  errors.push(`${stringsPath}: admob_app_id does not match the approved Harupuli App ID`)
}
const metadataMatches = [
  ...manifest.matchAll(/<meta-data\b[^>]*android:name=["']com\.google\.android\.gms\.ads\.APPLICATION_ID["'][^>]*>/gu),
]
if (metadataMatches.length !== 1) {
  errors.push(`${manifestPath}: exactly one APPLICATION_ID metadata entry is required`)
} else if (!/android:value=["']@string\/admob_app_id["']/u.test(metadataMatches[0][0])) {
  errors.push(`${manifestPath}: APPLICATION_ID must reference @string/admob_app_id`)
}
for (const permission of [
  'com.google.android.gms.permission.AD_ID',
  'android.permission.ACCESS_ADSERVICES_AD_ID',
]) {
  const escaped = permission.replaceAll('.', '\\.')
  if (new RegExp(`<uses-permission\\b[^>]*android:name=["']${escaped}["']`, 'u').test(manifest)) {
    errors.push(`${manifestPath}: ${permission} must not be declared manually in source`)
  }
}

const document = read(documentPath)
const qaDocument = read(qaDocumentPath)
const normalizedDocument = document.replace(/\s+/gu, ' ')
const normalizedQaDocument = qaDocument.replace(/\s+/gu, ' ')
for (const section of [
  'Purpose and scope', 'Starting baseline', 'Installed package', 'Package-lock verification',
  'Android plugin registration', 'Exact Android dependency pins', 'Resolved dependency tree',
  'Debug build verification', 'Release build verification', 'Debug merged manifest observations',
  'Release merged manifest observations', 'Advertising ID impact', 'Application ID status',
  'Runtime integration status', 'Files changed', 'Files intentionally unchanged', 'Rollback plan',
  'Blocking conditions', 'Pending work', 'Official references',
]) {
  requireText(document, `## ${section}`, documentPath)
}
for (const text of [
  'AdMob plugin dependency installation: Completed',
  'AdMob App ID configuration: Completed',
  'Debug Gradle build after App ID configuration: Completed',
  'Debug merged manifest App ID verification: Completed',
  'Debug APK artifact generation: Completed',
  'Debug APK artifact download: Completed',
  'Debug APK installation: Completed',
  'Android app launch QA after App ID configuration: Completed',
  'Android startup smoke QA: Pass',
  'ADB logcat verification: Not performed',
  'Full Android regression QA: Not completed',
  'Mobile Ads SDK runtime initialization: Not started',
  'UMP consent flow integration: Not started',
  'Android advertising QA: Not started',
  'Production ad units: 0',
  'Actual ad requests: No data',
  'Actual ad serving: Pending',
  '24.9.0', '4.0.0', 'debugRuntimeClasspath', 'releaseRuntimeClasspath',
  'dependencyInsight', 'Release merged manifest inspection: Blocked',
  '개인정보 및 쿠키 설정',
]) {
  requireText(normalizedDocument, text, documentPath)
}
for (const staleText of [
  'Debug merged manifest App ID verification: Pending',
  'Debug APK installation: Not started',
  'Android app launch QA after App ID configuration: Not started',
]) {
  if (normalizedDocument.includes(staleText)) {
    errors.push(`${documentPath}: stale status remains: ${staleText}`)
  }
}
if (document.split('Mobile Ads SDK runtime initialization: Not started').length - 1 !== 2) {
  errors.push(`${documentPath}: runtime initialization Not started must be recorded twice`)
}

for (const text of [
  'Workflow run: `#345`',
  'Workflow run ID: `30230115096`',
  'Workflow conclusion: Success',
  'Artifact ID: `8639819148`',
  'sha256:4290933add6503a9fe55c8ca02514660fa7f3936b9529f9d06503dfaa196bb26',
  'Test device: Galaxy S23 Ultra',
  'Debug APK artifact download: Completed',
  'APK installation: Completed',
  'App launch: Completed',
  'Home screen display: Normal',
  'Immediate force close: Not observed',
  '`Missing application ID` error: Not observed during actual device launch',
  'ADB logcat verification: Not performed',
  'Full Android regression QA: Not completed',
  'Mobile Ads runtime initialization: Not started',
  'Android advertising QA: Not started',
  'Actual ad requests: No data',
  'Actual ad serving: Pending',
]) {
  requireText(normalizedQaDocument, text, qaDocumentPath)
}
for (const forbiddenClaim of [
  'Mobile Ads SDK integration: Completed', 'UMP integration: Completed',
  'Advertising ID declaration: Completed', 'Data safety: Completed',
  'Official test-ad QA: Completed', 'Android advertising QA: Completed',
  'Actual ad serving: Completed', 'Release signing: Completed',
  'AAB generation: Completed', 'ADB logcat verification: Completed',
  'Full Android regression QA: Completed',
]) {
  if (normalizedDocument.includes(forbiddenClaim) || normalizedQaDocument.includes(forbiddenClaim)) {
    errors.push(`documentation: forbidden completion claim: ${forbiddenClaim}`)
  }
}

const textFiles = [...allowedFiles].filter((path) => /\.(?:md|json|mjs|gradle|xml)$/u.test(path))
const privacyLabel = '개인정보 및 쿠키 설정'
const knownMojibake = '媛쒖씤?뺣낫 諛?荑좏궎 ?ㅼ젙'
for (const path of textFiles) {
  const content = read(path)
  if (content.includes('\uFFFD')) errors.push(`${path}: Unicode replacement character found`)
  if (content.includes(knownMojibake)) errors.push(`${path}: mojibake privacy-options label found`)
}
if (!document.includes(privacyLabel)) errors.push(`${documentPath}: approved privacy-options label is missing`)

const changedContent = [...changedFiles]
  .filter((path) => allowedFiles.has(path))
  .map((path) => read(path))
  .join('\n')
const appIds = changedContent.match(/ca-app-pub-\d+~\d+/gu) ?? []
for (const appId of appIds) {
  if (appId !== expectedAppId) errors.push(`added content: unexpected AdMob App ID found: ${appId}`)
}
if (changedContent.includes(googleSampleAppId)) errors.push('added content: Google sample App ID is forbidden')
if (/ca-app-pub-\d+\/\d+/u.test(changedContent)) {
  errors.push('added content: ad unit ID is forbidden in the install baseline')
}
for (const placeholder of ['YOUR_ADMOB_APP_ID', 'REPLACE_ME', '실제_하루풀이_AdMob_App_ID']) {
  if (changedContent.includes(placeholder)) errors.push(`added content: App ID placeholder is forbidden: ${placeholder}`)
}
for (const testDeviceMarker of ['testDeviceIdentifiers', 'testDeviceId', 'TEST_DEVICE_ID']) {
  if (changedContent.includes(testDeviceMarker)) {
    errors.push(`added content: test-device configuration is forbidden: ${testDeviceMarker}`)
  }
}

if (errors.length) {
  console.error('AdMob plugin install baseline check failed.')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log('AdMob plugin install baseline check passed')
