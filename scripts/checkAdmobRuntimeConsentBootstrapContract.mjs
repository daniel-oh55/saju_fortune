import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const documentPath = 'docs/ADMOB_RUNTIME_CONSENT_BOOTSTRAP_CONTRACT.md'
const checkerPath = 'scripts/checkAdmobRuntimeConsentBootstrapContract.mjs'
const scriptName = 'check:admob-runtime-consent-bootstrap-contract'
const allowedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  documentPath,
  'package.json',
  checkerPath,
])
const ignoredLocalUntrackedFiles = new Set([
  'pr405-review.json',
  'pr405.diff',
])
const errors = []
const read = (path) => readFileSync(resolve(root, path), 'utf8').replace(/\r\n/g, '\n')
const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n')
const lines = (...args) =>
  git(...args).split('\n').map((line) => line.trim().replaceAll('\\', '/')).filter(Boolean)
const requireText = (content, text, label) => {
  if (!content.includes(text)) errors.push(`${label}: missing required text: ${text}`)
}

const untrackedFiles = lines('ls-files', '--others', '--exclude-standard')
const unexpectedUntrackedFiles = untrackedFiles.filter(
  (path) => !ignoredLocalUntrackedFiles.has(path),
)
const changedFiles = new Set([
  ...lines('diff', '--name-only', 'origin/main...HEAD'),
  ...lines('diff', '--name-only', '--cached'),
  ...lines('diff', '--name-only'),
  ...unexpectedUntrackedFiles,
])

for (const path of changedFiles) {
  if (!allowedFiles.has(path)) errors.push(`change scope: unexpected changed file: ${path}`)
}
for (const path of allowedFiles) {
  if (!changedFiles.has(path)) errors.push(`change scope: expected changed file is missing: ${path}`)
}
for (const ignoredPath of ignoredLocalUntrackedFiles) {
  if (
    lines('diff', '--name-only', 'origin/main...HEAD').includes(ignoredPath) ||
    lines('diff', '--name-only', '--cached').includes(ignoredPath) ||
    lines('ls-files').includes(ignoredPath)
  ) {
    errors.push(`preserved local file must remain untracked and uncommitted: ${ignoredPath}`)
  }
}

const forbiddenPrefixes = [
  'src/',
  'public/',
  'android/',
  'ios/',
  '.github/workflows/',
]
for (const prefix of forbiddenPrefixes) {
  if ([...changedFiles].some((path) => path.startsWith(prefix))) {
    errors.push(`docs/check-only scope: ${prefix} must remain unchanged`)
  }
}
for (const pattern of [
  /^capacitor\.config\./u,
  /^vite\.config\./u,
  /service-worker/iu,
  /package-lock\.json$/u,
]) {
  if ([...changedFiles].some((path) => pattern.test(path))) {
    errors.push(`docs/check-only scope: forbidden changed path matching ${pattern}`)
  }
}

const packageJson = JSON.parse(read('package.json'))
const basePackageJson = JSON.parse(git('show', 'origin/main:package.json'))
if (packageJson.scripts?.[scriptName] !== `node ${checkerPath}`) {
  errors.push(`package.json: incorrect ${scriptName} command`)
}
const currentScripts = { ...packageJson.scripts }
delete currentScripts[scriptName]
if (JSON.stringify(currentScripts) !== JSON.stringify(basePackageJson.scripts)) {
  errors.push('package.json: an existing script changed')
}
if (JSON.stringify(packageJson.dependencies) !== JSON.stringify(basePackageJson.dependencies)) {
  errors.push('package.json: dependencies changed')
}
if (JSON.stringify(packageJson.devDependencies) !== JSON.stringify(basePackageJson.devDependencies)) {
  errors.push('package.json: devDependencies changed')
}

const document = read(documentPath)
const requiredSections = [
  'Purpose and scope',
  'Current merged baseline',
  'Repository bootstrap investigation',
  'Plugin v8.0.0 API evidence',
  'Plugin Android implementation evidence',
  'Google UMP requirements',
  'Mobile Ads initialization considerations',
  'Initialization-order conflict review',
  'Selected runtime sequence',
  'Native and web behavior',
  'Consent state model',
  'canRequestAds gate',
  'Duplicate execution guard',
  'Error handling and fail-closed behavior',
  'Privacy options contract',
  'Production implementation file plan',
  'Test plan',
  'Android device QA plan',
  'Blocking conditions',
  'Explicitly excluded work',
  'Pending work',
  'Rollback plan',
  'Official references',
]
for (const section of requiredSections) {
  requireText(document, `## ${section}`, documentPath)
}
for (const text of [
  '개인정보 및 쿠키 설정',
  'consent first, gate second, initialization third',
  'requestConsentInfoUpdate',
  'loadAndShowConsentFormIfRequired',
  'React.StrictMode',
  'single-flight Promise',
  'fail closed',
  'web-noop',
  'consent-info',
  'consent-form',
  'ready-to-initialize',
  'privacyOptionsRequirementStatus',
  'Production ad units: 0',
  'APK installation and device QA are Not performed',
  'Runtime consent coordinator implementation',
]) {
  requireText(document, text, documentPath)
}

const baseProductionPaths = [
  'src',
  'public',
  'android',
  'capacitor.config.json',
  'vite.config.js',
  '.github/workflows',
]
const productionDiff = lines('diff', '--name-only', 'origin/main', '--', ...baseProductionPaths)
if (productionDiff.length) {
  errors.push(`production/native source changed: ${productionDiff.join(', ')}`)
}

const payloadPaths = [...allowedFiles].filter((path) => path !== checkerPath)
const changedPayload = payloadPaths
  .filter((path) => changedFiles.has(path))
  .map((path) => read(path))
  .join('\n')
const nonContractPayload = payloadPaths
  .filter((path) => path !== documentPath && changedFiles.has(path))
  .map((path) => read(path))
  .join('\n')
const allCheckedText = [...payloadPaths, checkerPath].map((path) => read(path)).join('\n')
if (allCheckedText.includes('\uFFFD')) {
  errors.push('text quality: Unicode replacement character U+FFFD found')
}
const knownMojibake = [
  ['媛쒖씤', '?뺣낫'].join(''),
  ['荑좏궎', '?ㅼ젙'].join(''),
  ['?대쾲', ' PR'].join(''),
]
for (const marker of knownMojibake) {
  if (allCheckedText.includes(marker)) errors.push(`text quality: known mojibake found: ${marker}`)
}

const appIds = changedPayload.match(/ca-app-pub-\d+~\d+/gu) ?? []
if (appIds.length) errors.push('content safety: an AdMob App ID was repeated')
if (/ca-app-pub-\d+\/\d+/u.test(changedPayload)) {
  errors.push('content safety: an ad unit ID was added')
}
if (/\b[A-F0-9]{32}\b/u.test(changedPayload)) {
  errors.push('content safety: a test-device hashed identifier was added')
}
const googleSampleAppId = ['ca-app-pub-3940256099942544', '3347511713'].join('~')
if (changedPayload.includes(googleSampleAppId)) {
  errors.push('content safety: Google sample App ID was added')
}
const forbiddenPlaceholders = [
  ['YOUR', 'ADMOB', 'APP', 'ID'].join('_'),
  ['REPLACE', 'ME'].join('_'),
  ['SAMPLE', 'APP', 'ID'].join('_'),
]
for (const placeholder of forbiddenPlaceholders) {
  if (changedPayload.includes(placeholder)) {
    errors.push(`content safety: placeholder was added: ${placeholder}`)
  }
}

const forbiddenRuntimeCalls = [
  ['MobileAds', 'initialize'].join('.'),
  ['AdMob', 'initialize'].join('.'),
  ['AdMob', 'requestConsentInfo'].join('.'),
  ['AdMob', 'showConsentForm'].join('.'),
  ['AdMob', 'showPrivacyOptionsForm'].join('.'),
]
for (const callName of forbiddenRuntimeCalls) {
  if (new RegExp(`${callName.replace('.', '\\.')}\\s*\\(`, 'u').test(nonContractPayload)) {
    errors.push(`docs/check-only scope: runtime call outside contract document: ${callName}`)
  }
}
if (/debugGeography\s*[:=]/u.test(nonContractPayload)) {
  errors.push('docs/check-only scope: debugGeography configuration was added')
}

const forbiddenCompletionClaims = [
  ['UMP integration', 'Completed'].join(': '),
  ['Production runtime implementation', 'Completed'].join(': '),
  ['Ad request/show implementation', 'Completed'].join(': '),
  ['Android device QA', 'Completed'].join(': '),
]
for (const claim of forbiddenCompletionClaims) {
  if (changedPayload.includes(claim)) {
    errors.push(`documentation: forbidden completion claim: ${claim}`)
  }
}

if (errors.length) {
  console.error('AdMob runtime consent bootstrap contract check failed.')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log('AdMob runtime consent bootstrap contract check passed')
