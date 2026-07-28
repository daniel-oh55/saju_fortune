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
const proxySafetyStaticInvariants = [
  'export function createAdmobNativeDependencies({ loadAdMobModule })',
  'let modulePromise = null',
  'modulePromise = loadAdMobModule()',
  'const { AdMob } = await getAdMobModule()',
  'return AdMob.showPrivacyOptionsForm()',
  'let adMobModulePromise = null',
  "adMobModulePromise = import('@capacitor-community/admob')",
  'const productionNativeDependencies = createAdmobNativeDependencies({',
  '...productionNativeDependencies',
]
const validateProxyPromiseSafety = (source) => {
  const validationErrors = []
  for (const token of proxySafetyStaticInvariants) {
    if (!source.includes(token)) {
      validationErrors.push(`proxy Promise safety: missing required text: ${token}`)
    }
  }
  if ((source.match(/import\('@capacitor-community\/admob'\)/gu) ?? []).length !== 1) {
    validationErrors.push('proxy Promise safety: dynamic import must occur exactly once')
  }
  for (const pattern of [
    /import\('@capacitor-community\/admob'\)\s*\.then/u,
    /\.then\s*\(\s*\(\s*\{\s*AdMob\s*\}\s*\)\s*=>\s*AdMob/u,
    /Promise\.resolve\s*\(\s*AdMob\s*\)/u,
    /return\s+AdMob\s*;/u,
    /\bAdMob\.then\b/u,
    /['"]then['"]\s+in\s+AdMob/u,
  ]) {
    if (pattern.test(source)) {
      validationErrors.push(`proxy Promise safety: forbidden pattern matched ${pattern}`)
    }
  }
  if (!source.includes('isNativePlatform: () => Capacitor.isNativePlatform(),')) {
    validationErrors.push('proxy Promise safety: Web platform check must not load the AdMob module')
  }
  return validationErrors
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
errors.push(...validateProxyPromiseSafety(coordinatorSource))
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
    createAdmobNativeDependencies,
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

  let moduleLoads = 0
  let thenAccessCount = 0
  let thenCallCount = 0
  const proxyCalls = []
  const fakeAdMobProxy = new Proxy({
    async requestConsentInfo() {
      proxyCalls.push('requestConsentInfo')
      return info({ canRequestAds: true })
    },
    async showConsentForm() {
      proxyCalls.push('showConsentForm')
      return info({ status: 'OBTAINED', canRequestAds: true })
    },
    async showPrivacyOptionsForm() {
      proxyCalls.push('showPrivacyOptionsForm')
    },
    async initialize() {
      proxyCalls.push('initialize')
    },
  }, {
    get(target, property, receiver) {
      if (property === 'then') {
        thenAccessCount += 1
        return () => {
          thenCallCount += 1
          throw new Error('AdMob.then() must never be called')
        }
      }
      return Reflect.get(target, property, receiver)
    },
  })
  const nativeDependencies = createAdmobNativeDependencies({
    loadAdMobModule: () => {
      moduleLoads += 1
      return Promise.resolve({ AdMob: fakeAdMobProxy })
    },
  })
  const proxyCoordinator = createAdmobRuntimeConsentCoordinator({
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    ...nativeDependencies,
  })
  const proxyResult = await proxyCoordinator.bootstrap()
  assert.deepEqual(
    proxyCalls,
    ['requestConsentInfo', 'showConsentForm', 'initialize'],
  )
  assert.equal(proxyResult.state, ADMOB_RUNTIME_CONSENT_STATE.READY)
  assert.equal(proxyResult.initializeResolved, true)
  assert.equal(proxyResult.adGateOpen, true)
  assert.equal(moduleLoads, 1)
  assert.equal(thenAccessCount, 0)
  assert.equal(thenCallCount, 0)

  const privacyResult = await proxyCoordinator.openPrivacyOptions()
  assert.deepEqual(proxyCalls, [
    'requestConsentInfo',
    'showConsentForm',
    'initialize',
    'showPrivacyOptionsForm',
    'requestConsentInfo',
  ])
  assert.equal(privacyResult.state, ADMOB_RUNTIME_CONSENT_STATE.READY)
  assert.equal(moduleLoads, 1)
  assert.equal(thenAccessCount, 0)
  assert.equal(thenCallCount, 0)

  let webModuleLoads = 0
  const webDependencies = createAdmobNativeDependencies({
    loadAdMobModule: () => {
      webModuleLoads += 1
      return Promise.resolve({ AdMob: fakeAdMobProxy })
    },
  })
  const webCoordinator = createAdmobRuntimeConsentCoordinator({
    isNativePlatform: () => false,
    getPlatform: () => 'web',
    ...webDependencies,
  })
  const webProxyResult = await webCoordinator.bootstrap()
  assert.equal(webProxyResult.state, ADMOB_RUNTIME_CONSENT_STATE.WEB_NOOP)
  assert.equal(webModuleLoads, 0)
  assert.equal(thenAccessCount, 0)
  assert.equal(thenCallCount, 0)

  const reentrant = createScenario()
  let reentrantPromise
  let didReenter = false
  reentrant.coordinator.subscribe(() => {
    if (didReenter) return
    didReenter = true
    reentrantPromise = reentrant.coordinator.bootstrap()
  })
  const reentrantFirstPromise = reentrant.coordinator.bootstrap()
  const reentrantResult = await reentrantFirstPromise
  assert.strictEqual(reentrantPromise, reentrantFirstPromise)
  assert.deepEqual(
    reentrant.calls,
    ['requestConsentInfo', 'showConsentForm', 'initialize'],
  )
  assert.equal(reentrantResult.state, ADMOB_RUNTIME_CONSENT_STATE.READY)
  assert.equal(reentrantResult.adGateOpen, true)

  const webReentrant = createScenario({ native: false })
  let webReentrantPromise
  let didReenterWeb = false
  webReentrant.coordinator.subscribe(() => {
    if (didReenterWeb) return
    didReenterWeb = true
    webReentrantPromise = webReentrant.coordinator.bootstrap()
  })
  const webFirstPromise = webReentrant.coordinator.bootstrap()
  const webResult = await webFirstPromise
  assert.strictEqual(webReentrantPromise, webFirstPromise)
  assert.deepEqual(webReentrant.calls, [])
  assert.equal(webResult.state, ADMOB_RUNTIME_CONSENT_STATE.WEB_NOOP)

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
      canRequestAds: false,
    },
    {
      scenario: createScenario({ formError: new Error('private form error') }),
      stage: 'consent-form',
      calls: ['requestConsentInfo', 'showConsentForm'],
      canRequestAds: false,
    },
    {
      scenario: createScenario({ initializeError: new Error('private init error') }),
      stage: 'initialize',
      calls: ['requestConsentInfo', 'showConsentForm', 'initialize'],
      canRequestAds: true,
      initializeStarted: true,
      initializeResolved: false,
    },
    {
      scenario: createScenario({ platformError: new Error('private platform error') }),
      stage: 'platform',
      calls: [],
      canRequestAds: false,
    },
  ]) {
    const result = await expected.scenario.coordinator.bootstrap()
    assert.equal(result.state, ADMOB_RUNTIME_CONSENT_STATE.FAILED)
    assert.equal(result.lastErrorStage, expected.stage)
    assert.equal(result.canRequestAds, expected.canRequestAds)
    if (expected.initializeStarted !== undefined) {
      assert.equal(result.initializeStarted, expected.initializeStarted)
      assert.equal(result.initializeResolved, expected.initializeResolved)
    }
    assert.equal(result.adGateOpen, false)
    assert.deepEqual(expected.scenario.calls, expected.calls)
    const repeatedPromise = expected.scenario.coordinator.bootstrap()
    assert.strictEqual(repeatedPromise, expected.scenario.coordinator.bootstrap())
    await repeatedPromise
    assert.deepEqual(expected.scenario.calls, expected.calls)
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

const proxySafetyNegativeMutations = [
  {
    name: 'module Promise resolves the AdMob Proxy',
    mutate: (source) => source.replace(
      "adMobModulePromise = import('@capacitor-community/admob')",
      "adMobModulePromise = import('@capacitor-community/admob').then((module) => module.AdMob)",
    ),
  },
  {
    name: 'destructuring then callback returns the AdMob Proxy',
    mutate: (source) => source.replace(
      "adMobModulePromise = import('@capacitor-community/admob')",
      "adMobModulePromise = import('@capacitor-community/admob').then(({ AdMob }) => AdMob)",
    ),
  },
  {
    name: 'Promise.resolve receives the AdMob Proxy',
    mutate: (source) => source.replace(
      'return AdMob.requestConsentInfo();',
      'return Promise.resolve(AdMob);',
    ),
  },
  {
    name: 'async dependency returns the AdMob Proxy',
    mutate: (source) => source.replace(
      'return AdMob.requestConsentInfo();',
      'return AdMob;',
    ),
  },
  {
    name: 'AdMob.then access is introduced',
    mutate: (source) => source.replace(
      'return AdMob.requestConsentInfo();',
      'void AdMob.then;\n      return AdMob.requestConsentInfo();',
    ),
  },
  {
    name: 'then probe occurs before requestConsentInfo',
    mutate: (source) => source.replace(
      'return AdMob.requestConsentInfo();',
      'void ("then" in AdMob);\n      return AdMob.requestConsentInfo();',
    ),
  },
  {
    name: 'dynamic module import is duplicated',
    mutate: (source) => source.replace(
      "adMobModulePromise = import('@capacitor-community/admob');",
      "adMobModulePromise = import('@capacitor-community/admob');\n    void import('@capacitor-community/admob');",
    ),
  },
  {
    name: 'Web platform check starts module loading',
    mutate: (source) => source.replace(
      'isNativePlatform: () => Capacitor.isNativePlatform(),',
      'isNativePlatform: () => { void loadAdMobModule(); return Capacitor.isNativePlatform(); },',
    ),
  },
]

for (const mutation of proxySafetyNegativeMutations) {
  const mutated = mutation.mutate(coordinatorSource)
  if (mutated === coordinatorSource) {
    errors.push(`negative mutation did not apply: ${mutation.name}`)
    continue
  }
  if (validateProxyPromiseSafety(mutated).length === 0) {
    errors.push(`negative mutation escaped: ${mutation.name}`)
  }
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
  `AdMob runtime consent coordinator check passed (${creationMode ? 'creation' : 'post-merge'} mode): 1 Proxy behavioral scenario, ${proxySafetyStaticInvariants.length} Proxy static invariants, ${proxySafetyNegativeMutations.length} negative mutations`,
)
