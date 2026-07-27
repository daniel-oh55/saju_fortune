import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const coordinatorPath = 'src/services/admobRuntimeConsentCoordinator.js'
const checkerPath = 'scripts/checkAdmobRuntimeConsentCoordinator.mjs'
const scriptName = 'check:admob-runtime-consent-coordinator'
const allowedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  'package.json',
  'src/main.jsx',
  coordinatorPath,
  checkerPath,
])
const preservedUntrackedFiles = new Set(['pr405-review.json', 'pr405.diff'])
const errors = []
const read = (path) => readFileSync(resolve(root, path), 'utf8').replace(/\r\n/g, '\n')
const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n')
const lines = (...args) =>
  git(...args).split('\n').map((line) => line.trim().replaceAll('\\', '/')).filter(Boolean)
const requireText = (content, text, label) => {
  if (!content.includes(text)) errors.push(`${label}: missing required text: ${text}`)
}
const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
const hasValidPackageMap = (value) =>
  isPlainObject(value) &&
  Object.entries(value).every(
    ([name, version]) => name.length > 0 && typeof version === 'string' && version.length > 0,
  )
const gitObjectExists = (objectName) => {
  try {
    execFileSync('git', ['cat-file', '-e', objectName], { cwd: root, stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

const untrackedFiles = lines('ls-files', '--others', '--exclude-standard')
const unexpectedUntrackedFiles = untrackedFiles.filter(
  (path) => !preservedUntrackedFiles.has(path),
)
const creationMode = !gitObjectExists(`origin/main:${coordinatorPath}`)
const changedFiles = new Set([
  ...lines('diff', '--name-only', 'origin/main...HEAD'),
  ...lines('diff', '--name-only', '--cached'),
  ...lines('diff', '--name-only'),
  ...unexpectedUntrackedFiles,
])

if (creationMode) {
  for (const path of changedFiles) {
    if (!allowedFiles.has(path)) errors.push(`change scope: unexpected changed file: ${path}`)
  }
  for (const path of allowedFiles) {
    if (!changedFiles.has(path)) errors.push(`change scope: expected changed file is missing: ${path}`)
  }
}
for (const path of preservedUntrackedFiles) {
  if (
    lines('diff', '--name-only', 'origin/main...HEAD').includes(path) ||
    lines('diff', '--name-only', '--cached').includes(path) ||
    lines('ls-files').includes(path)
  ) {
    errors.push(`preserved local file must remain untracked and uncommitted: ${path}`)
  }
}

const packageJson = JSON.parse(read('package.json'))
if (packageJson.scripts?.[scriptName] !== `node ${checkerPath}`) {
  errors.push(`package.json: incorrect ${scriptName} command`)
}
if (!hasValidPackageMap(packageJson.dependencies)) {
  errors.push('package.json: dependencies must remain a valid package map')
}
if (!hasValidPackageMap(packageJson.devDependencies)) {
  errors.push('package.json: devDependencies must remain a valid package map')
}
if (creationMode) {
  const basePackageJson = JSON.parse(git('show', 'origin/main:package.json'))
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
}

const coordinatorSource = read(coordinatorPath)
const mainSource = read('src/main.jsx')
for (const text of [
  'ADMOB_RUNTIME_CONSENT_STATE',
  'createAdmobRuntimeConsentCoordinator',
  'bootstrapAdmobRuntimeConsent',
  'getAdmobRuntimeConsentSnapshot',
  'subscribeAdmobRuntimeConsent',
  'requestConsentInfo',
  'showConsentForm',
  'initialize',
  'web-noop',
  'consent-denied-or-unresolved',
  'ready-to-initialize',
  'lastErrorStage',
  'adGateOpen',
  "import('@capacitor-community/admob')",
]) {
  requireText(coordinatorSource, text, coordinatorPath)
}
requireText(mainSource, 'void bootstrapAdmobRuntimeConsent().catch(() => {})', 'src/main.jsx')
if (/await\s+bootstrapAdmobRuntimeConsent/u.test(mainSource)) {
  errors.push('src/main.jsx: bootstrap must not block render')
}
if (/async\s+function\s+bootstrap\s*\(/u.test(coordinatorSource)) {
  errors.push(`${coordinatorPath}: bootstrap must preserve Promise identity`)
}
requireText(
  coordinatorSource,
  'if (initializePromise) return initializePromise;',
  coordinatorPath,
)
if (/if\s*\((?!typeof\b)[^)]*isConsentFormAvailable[^)]*\)/u.test(coordinatorSource)) {
  errors.push(`${coordinatorPath}: isConsentFormAvailable must not be a call or terminal gate`)
}

const requestIndex = coordinatorSource.indexOf('await dependencies.requestConsentInfo()')
const formIndex = coordinatorSource.indexOf('await dependencies.showConsentForm()')
const latestGateIndex = coordinatorSource.indexOf('formResult?.canRequestAds !== true')
const initializeIndex = coordinatorSource.indexOf('await initializeOnce()')
if (
  requestIndex === -1 ||
  formIndex <= requestIndex ||
  latestGateIndex <= formIndex ||
  initializeIndex <= latestGateIndex
) {
  errors.push(`${coordinatorPath}: required request -> form -> latest gate -> initialize order is missing`)
}

const runtimePayload = `${coordinatorSource}\n${mainSource}`
const documentationPayload = [
  read('CHANGELOG.md'),
  read('DEVELOPMENT_LOG.md'),
  read('TODO.md'),
].join('\n')
const guardedPayload = `${runtimePayload}\n${documentationPayload}`
if (guardedPayload.includes('\uFFFD')) errors.push('text quality: U+FFFD found')
for (const marker of [
  ['媛쒖씤', '?뺣낫'].join(''),
  ['荑좏궎', '?ㅼ젙'].join(''),
  ['?대쾲', ' PR'].join(''),
]) {
  if (guardedPayload.includes(marker)) errors.push(`text quality: known mojibake found: ${marker}`)
}
for (const pattern of [
  /\blocalStorage\b/u,
  /\bsessionStorage\b/u,
  /\bindexedDB\b/u,
  /\bdocument\.cookie\b/u,
  /\bdebugGeography\b/u,
  /\btestDeviceIdentifiers?\b/u,
  /\bshowPrivacyOptionsForm\s*\(/u,
  /\bresetConsentInfo\s*\(/u,
  /\.(?:showBanner|hideBanner|resumeBanner|removeBanner|prepareInterstitial|showInterstitial|prepareRewardVideoAd|showRewardVideoAd|showRewardedAd|loadAd|showAd)\s*\(/u,
]) {
  if (pattern.test(runtimePayload)) errors.push(`forbidden runtime content matched ${pattern}`)
}
for (const pattern of [
  /ca-app-pub-\d+[~/]\d+/u,
  /\b(?:YOUR_ADMOB_APP_ID|REPLACE_ME|SAMPLE_APP_ID|APP_ID_PLACEHOLDER)\b/u,
  /\btestDeviceIdentifiers?\b/u,
  /\bdebugGeography\b/u,
]) {
  if (pattern.test(guardedPayload)) errors.push(`forbidden content matched ${pattern}`)
}
for (const claim of [
  'Actual ad request: Completed',
  'Actual ad serving: Completed',
  'Ad request/show implementation: Completed',
  'Android device QA: Completed',
]) {
  if (documentationPayload.includes(claim)) {
    errors.push(`documentation: forbidden completion claim: ${claim}`)
  }
}
const runBootstrapSource = coordinatorSource.slice(
  coordinatorSource.indexOf('async function runBootstrap()'),
  coordinatorSource.indexOf('function bootstrap()'),
)
if (runBootstrapSource.includes('loadAdMobApi')) {
  errors.push(`${coordinatorPath}: plugin loading must remain behind injected native dependencies`)
}

if (creationMode) {
  for (const prefix of ['public/', 'android/', 'ios/', '.github/workflows/']) {
    if ([...changedFiles].some((path) => path.startsWith(prefix))) {
      errors.push(`change scope: ${prefix} must remain unchanged`)
    }
  }
  for (const forbiddenPath of [
    'package-lock.json',
    'src/App.jsx',
    'src/services/rewardedAdProvider.loader.js',
    'src/services/rewardedAdProvider.mock.js',
    'src/services/rewardedAdProvider.sdk.js',
  ]) {
    if (changedFiles.has(forbiddenPath)) {
      errors.push(`change scope: forbidden changed file: ${forbiddenPath}`)
    }
  }
}

async function runBehavioralChecks() {
  const moduleUrl = pathToFileURL(resolve(root, coordinatorPath)).href
  const {
    ADMOB_RUNTIME_CONSENT_STATE,
    createAdmobRuntimeConsentCoordinator,
  } = await import(`${moduleUrl}?checker=${Date.now()}`)

  const info = (overrides = {}) => ({
    status: 'REQUIRED',
    isConsentFormAvailable: true,
    canRequestAds: false,
    privacyOptionsRequirementStatus: 'REQUIRED',
    ...overrides,
  })
  const createScenario = ({
    native = true,
    platform = 'android',
    requestResult = info(),
    formResult = info({ status: 'OBTAINED', canRequestAds: true }),
    requestError,
    formError,
    initializeError,
    platformError,
  } = {}) => {
    const calls = []
    const coordinator = createAdmobRuntimeConsentCoordinator({
      isNativePlatform: () => {
        if (platformError) throw platformError
        return native
      },
      getPlatform: () => platform,
      requestConsentInfo: async () => {
        calls.push('requestConsentInfo')
        if (requestError) throw requestError
        return requestResult
      },
      showConsentForm: async () => {
        calls.push('showConsentForm')
        if (formError) throw formError
        return formResult
      },
      initialize: async () => {
        calls.push('initialize')
        if (initializeError) throw initializeError
      },
    })
    return { calls, coordinator }
  }

  for (const scenario of [
    createScenario({ native: false }),
    createScenario({ platform: 'ios' }),
  ]) {
    const result = await scenario.coordinator.bootstrap()
    assert.equal(result.state, ADMOB_RUNTIME_CONSENT_STATE.WEB_NOOP)
    assert.equal(result.adGateOpen, false)
    assert.deepEqual(scenario.calls, [])
  }

  const ready = createScenario({
    requestResult: info({ isConsentFormAvailable: false, canRequestAds: true }),
    formResult: info({
      status: 'NOT_REQUIRED',
      isConsentFormAvailable: false,
      canRequestAds: true,
      privacyOptionsRequirementStatus: 'NOT_REQUIRED',
    }),
  })
  const firstPromise = ready.coordinator.bootstrap()
  const secondPromise = ready.coordinator.bootstrap()
  assert.strictEqual(firstPromise, secondPromise)
  const readyResult = await firstPromise
  assert.deepEqual(ready.calls, ['requestConsentInfo', 'showConsentForm', 'initialize'])
  assert.equal(readyResult.state, ADMOB_RUNTIME_CONSENT_STATE.READY)
  assert.equal(readyResult.adGateOpen, true)
  assert.equal(readyResult.initializeStarted, true)
  assert.equal(readyResult.initializeResolved, true)
  assert.strictEqual(ready.coordinator.bootstrap(), firstPromise)
  assert.equal(ready.calls.filter((call) => call === 'initialize').length, 1)

  const denied = createScenario({
    requestResult: info({ canRequestAds: true }),
    formResult: info({ status: 'REQUIRED', canRequestAds: false }),
  })
  const deniedResult = await denied.coordinator.bootstrap()
  assert.equal(deniedResult.state, ADMOB_RUNTIME_CONSENT_STATE.CONSENT_DENIED_OR_UNRESOLVED)
  assert.equal(deniedResult.adGateOpen, false)
  assert.deepEqual(denied.calls, ['requestConsentInfo', 'showConsentForm'])

  const allowedByForm = createScenario({
    requestResult: info({ canRequestAds: false, isConsentFormAvailable: false }),
    formResult: info({
      status: 'OBTAINED',
      canRequestAds: true,
      isConsentFormAvailable: false,
    }),
  })
  const allowedResult = await allowedByForm.coordinator.bootstrap()
  assert.equal(allowedResult.state, ADMOB_RUNTIME_CONSENT_STATE.READY)
  assert.deepEqual(allowedByForm.calls, ['requestConsentInfo', 'showConsentForm', 'initialize'])

  for (const expected of [
    {
      scenario: createScenario({ requestError: new Error('private request error') }),
      stage: 'consent-info',
      calls: ['requestConsentInfo'],
    },
    {
      scenario: createScenario({ formError: new Error('private form error') }),
      stage: 'consent-form',
      calls: ['requestConsentInfo', 'showConsentForm'],
    },
    {
      scenario: createScenario({ initializeError: new Error('private init error') }),
      stage: 'initialize',
      calls: ['requestConsentInfo', 'showConsentForm', 'initialize'],
    },
    {
      scenario: createScenario({ platformError: new Error('private platform error') }),
      stage: 'platform',
      calls: [],
    },
  ]) {
    const result = await expected.scenario.coordinator.bootstrap()
    assert.equal(result.state, ADMOB_RUNTIME_CONSENT_STATE.FAILED)
    assert.equal(result.lastErrorStage, expected.stage)
    assert.equal(result.canRequestAds, false)
    assert.equal(result.adGateOpen, false)
    assert.deepEqual(expected.scenario.calls, expected.calls)
    assert.strictEqual(
      expected.scenario.coordinator.bootstrap(),
      expected.scenario.coordinator.bootstrap(),
    )
  }

  const observable = createScenario()
  let healthyListenerCalls = 0
  observable.coordinator.subscribe(() => {
    throw new Error('listener failure')
  })
  const unsubscribe = observable.coordinator.subscribe(() => {
    healthyListenerCalls += 1
  })
  const observableResult = await observable.coordinator.bootstrap()
  assert.equal(observableResult.state, ADMOB_RUNTIME_CONSENT_STATE.READY)
  assert.ok(healthyListenerCalls > 0)
  unsubscribe()
  assert.ok(Object.isFrozen(observableResult))
  assert.throws(() => {
    observableResult.adGateOpen = false
  }, TypeError)
  assert.equal(observable.coordinator.getSnapshot().adGateOpen, true)

  const independentA = createScenario()
  const independentB = createScenario()
  assert.notStrictEqual(independentA.coordinator.bootstrap(), independentB.coordinator.bootstrap())
  await Promise.all([
    independentA.coordinator.bootstrap(),
    independentB.coordinator.bootstrap(),
  ])
}

try {
  await runBehavioralChecks()
} catch (error) {
  errors.push(`behavioral check failed: ${error?.stack ?? error}`)
}

if (errors.length) {
  console.error('AdMob runtime consent coordinator check failed.')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log(
  `AdMob runtime consent coordinator check passed (${creationMode ? 'creation' : 'post-merge'} mode)`,
)
