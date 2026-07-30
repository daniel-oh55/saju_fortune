import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const checkerPath = 'scripts/checkAdmobPrivacyOptionsUi.mjs'
const coordinatorPath = 'src/services/admobRuntimeConsentCoordinator.js'
const scriptName = 'check:admob-privacy-options-ui'
const allowedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  'package.json',
  checkerPath,
  coordinatorPath,
  'src/App.jsx',
  'src/pages/SettingsPage.jsx',
  'src/pages/PrivacyInfoPage.jsx',
  'src/components/ConsentSettingsPanel.jsx',
  'src/styles.css',
])
const preservedUntrackedFiles = new Set(['pr405-review.json', 'pr405.diff'])
const errors = []
const read = (path) => readFileSync(resolve(root, path), 'utf8').replace(/\r\n/g, '\n')
const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n')
const lines = (...args) =>
  git(...args).split('\n').map((line) => line.trim().replaceAll('\\', '/')).filter(Boolean)
const gitObjectExists = (name) => {
  try {
    execFileSync('git', ['cat-file', '-e', name], { cwd: root, stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}
const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
const hasValidPackageMap = (value) =>
  isPlainObject(value) &&
  Object.entries(value).every(
    ([name, version]) => name.length > 0 && typeof version === 'string' && version.length > 0,
  )
const requireText = (content, text, label) => {
  if (!content.includes(text)) errors.push(`${label}: missing required text: ${text}`)
}
const forbidPattern = (content, pattern, label) => {
  if (pattern.test(content)) errors.push(`${label}: forbidden content matched ${pattern}`)
}

const untrackedFiles = lines('ls-files', '--others', '--exclude-standard')
const unexpectedUntrackedFiles = untrackedFiles.filter(
  (path) => !preservedUntrackedFiles.has(path),
)
const creationSelfTestMode =
  process.env.ADMOB_PRIVACY_OPTIONS_CHECK_CREATION_SELF_TEST === '1'
const creationMode =
  creationSelfTestMode ||
  (
    process.env.ADMOB_PRIVACY_OPTIONS_CHECK_POST_MERGE !== '1' &&
    !gitObjectExists(`origin/main:${checkerPath}`)
  )
const committedChanges = lines('diff', '--name-only', 'origin/main...HEAD')
const stagedChanges = lines('diff', '--name-only', '--cached')
const workingChanges = lines('diff', '--name-only')
const changedFiles = new Set([
  ...committedChanges,
  ...stagedChanges,
  ...workingChanges,
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

const trackedFiles = new Set(lines('ls-files'))
for (const path of preservedUntrackedFiles) {
  if (
    committedChanges.includes(path) ||
    stagedChanges.includes(path) ||
    trackedFiles.has(path)
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
const appSource = read('src/App.jsx')
const settingsSource = read('src/pages/SettingsPage.jsx')
const privacySource = read('src/pages/PrivacyInfoPage.jsx')
const consentPanelSource = read('src/components/ConsentSettingsPanel.jsx')
const stylesSource = read('src/styles.css')
const documentationSource = [
  read('CHANGELOG.md'),
  read('DEVELOPMENT_LOG.md'),
  read('TODO.md'),
].join('\n')

for (const text of [
  'ADMOB_PRIVACY_OPTIONS_ACTION_STATE',
  'shouldShowAdmobPrivacyOptionsEntry',
  'openAdmobPrivacyOptions',
  'openPrivacyOptions',
  'privacyOptionsPromise',
  'showPrivacyOptionsForm',
  'await dependencies.requestConsentInfo()',
  'privacy-options-form',
  'privacy-options-refresh',
  'lastPrivacyOptionsErrorStage',
  'isPrivacyOptionsActionPending',
]) {
  requireText(coordinatorSource, text, coordinatorPath)
}
for (const text of [
  '() => getAdmobRuntimeConsentSnapshot()',
  'setAdmobSnapshot(getAdmobRuntimeConsentSnapshot())',
  'return subscribeAdmobRuntimeConsent',
  'shouldShowAdmobPrivacyOptionsEntry(admobSnapshot)',
  'void openAdmobPrivacyOptions()',
]) {
  requireText(appSource, text, 'src/App.jsx')
}
for (const text of [
  '개인정보 및 쿠키 설정',
  'shouldShowPrivacyOptionsEntry &&',
  'shouldShowPrivacyOptionsEntry && privacyOptionsActionMessage &&',
  'disabled={isPrivacyOptionsActionPending}',
  "aria-busy={isPrivacyOptionsActionPending ? 'true' : undefined}",
  'const isPrivacyOptionsError =',
  "privacyOptionsActionState === 'failed';",
  "isPrivacyOptionsError ? 'alert' : 'status';",
  "role={privacyOptionsMessageRole}",
  "aria-live={isPrivacyOptionsError ? undefined : 'polite'}",
]) {
  requireText(settingsSource, text, 'src/pages/SettingsPage.jsx')
}
for (const text of [
  'Google AdMob 보상형 광고',
  '일반 사용자 대상 Production 업데이트는 아직 수행되지 않았으므로',
  '현재 모든 이용자에게',
  '광고가 제공되고 있다고 단정하지 않습니다',
  'IP 주소를 통해 추정될 수 있는 대략적인 위치',
  '앱 상호작용',
  '진단 정보',
  'Android 광고 ID',
  '앱 세트 ID',
  'TLS를 이용하여 전송 중 암호화',
  'GPS를 이용한 정확한 위치 수집을 의미하지 않습니다',
  '운세 입력 정보를 Google에 광고 목적으로 제공하거나',
  '광고 식별자와 결합하지 않습니다',
  '앱 내부 선택은 Google UMP 선택을 대신하지 않습니다',
  '개인정보 및 쿠키 설정',
  '핵심 운세 기능은 계속 이용할 수 있습니다',
  '별도의 외부 분석 전용 SDK는 아직 연결되지 않음',
  '실제 결제 SDK는 아직 연결되지 않음',
  '하루풀이 자체 서버/DB로 프로필을 전송하지 않음',
  'AdMob과 UMP는 광고·동의 처리를 위해 Google 서비스와 통신할 수 있음',
  'https://www.hymlounge.com/harupuli/privacy/',
  'mailto:hym.lounge@gmail.com',
]) {
  requireText(privacySource, text, 'src/pages/PrivacyInfoPage.jsx')
}
for (const text of [
  'app-level 선택 설정',
  'Google UMP 개인정보 선택과',
  'UMP 선택을 대신하지 않습니다',
  '공식 테스트 및 승인된 production Rewarded 경로 모두',
  '앱 내부 광고 데이터 사용',
  'Google UMP runtime gate',
  '공식 테스트 및 승인된 production Rewarded 광고 요청 경로',
  '이 선택이 true가',
  'non-personalized 광고 요청으로 제한',
  '외부 분석 SDK는 아직 연결되지 않았으며',
]) {
  requireText(consentPanelSource, text, 'src/components/ConsentSettingsPanel.jsx')
}
for (const text of [
  '.settings-privacy-options-button',
  '.settings-privacy-options-message',
  '.settings-privacy-options-message.is-error',
]) {
  requireText(stylesSource, text, 'src/styles.css')
}

if (/bootstrapAdmobRuntimeConsent/u.test(appSource)) {
  errors.push('src/App.jsx: bootstrap must not be imported or called')
}
if (!/return\s+subscribeAdmobRuntimeConsent\s*\(/u.test(appSource)) {
  errors.push('src/App.jsx: subscription cleanup must be returned')
}
if (/async\s+function\s+openPrivacyOptions\s*\(/u.test(coordinatorSource)) {
  errors.push(`${coordinatorPath}: openPrivacyOptions must preserve Promise identity`)
}
if (!/if\s*\(privacyOptionsPromise\)\s+return privacyOptionsPromise;/u.test(coordinatorSource)) {
  errors.push(`${coordinatorPath}: privacy-options single-flight guard is missing`)
}
if (!/if\s*\(initializePromise\)\s+return initializePromise;/u.test(coordinatorSource)) {
  errors.push(`${coordinatorPath}: initialize-once guard is missing`)
}
if (!coordinatorSource.includes("snapshot?.privacyOptionsRequirementStatus === 'REQUIRED'")) {
  errors.push(`${coordinatorPath}: REQUIRED visibility gate is missing`)
}
if (!coordinatorSource.includes('snapshot?.isNativeAndroid === true &&')) {
  errors.push(`${coordinatorPath}: native Android visibility gate is missing`)
}
if (!coordinatorSource.includes('dependencies.isNativePlatform() === true &&')) {
  errors.push(`${coordinatorPath}: native platform action gate is missing`)
}
if (!coordinatorSource.includes("dependencies.getPlatform() === 'android'")) {
  errors.push(`${coordinatorPath}: native Android action gate is missing`)
}
if ((coordinatorSource.match(/snapshot\.canRequestAds !== true/g) ?? []).length < 2) {
  errors.push(`${coordinatorPath}: latest consent gate recheck is missing`)
}
if ((coordinatorSource.match(/dependencies\.showConsentForm/g) ?? []).length !== 1) {
  errors.push(`${coordinatorPath}: privacy refresh must not call showConsentForm`)
}
if (/showPrivacyOptionsForm/u.test(`${appSource}\n${settingsSource}`)) {
  errors.push('UI source: plugin privacy-options API must only be called by the coordinator')
}
if (/localStorage|sessionStorage|indexedDB|document\.cookie/u.test(coordinatorSource)) {
  errors.push(`${coordinatorPath}: runtime consent state must not be persisted`)
}
if (/consentPreferences/u.test(coordinatorSource)) {
  errors.push(`${coordinatorPath}: local consent preferences must not gate Google UMP`)
}
forbidPattern(privacySource, /실제 광고 SDK(?:가 연결되어 있지 않| 없음)/u, 'privacy copy')
forbidPattern(privacySource, /외부 SDK로 개인정보를 전송하지 않습니다/u, 'privacy copy')
forbidPattern(
  privacySource,
  /https:\/\/hymlounge\.com\/harupuli\/privacy\//u,
  'privacy noncanonical policy URL',
)
forbidPattern(
  privacySource,
  /release workflow 실행, AAB 생성, 기기 QA, serving은 아직 수행하지 않았습니다/u,
  'privacy stale release-status copy',
)
forbidPattern(
  privacySource,
  /production(?: 광고)? 활성화 전 개인정보\/Data Safety(?: 최종 검토)?/u,
  'privacy stale pre-production review copy',
)
forbidPattern(
  privacySource,
  /외부 공개 개인정보처리방침[^.]*최종 검토/u,
  'privacy stale external-policy review copy',
)
forbidPattern(
  privacySource,
  /광고 관련 disclosure[^.]*최종 검토/u,
  'privacy stale advertising-disclosure review copy',
)
forbidPattern(
  privacySource,
  /일반 사용자(?: 대상)? Production 업데이트(?:는|가)? (?:완료|수행 완료)/u,
  'privacy production-update completion claim',
)
forbidPattern(
  privacySource,
  /Actual general-user production serving:\s*Completed/u,
  'privacy production-serving completion claim',
)
forbidPattern(
  privacySource,
  /모든 (?:사용자|이용자)에게 (?:production )?광고가 제공되고 (?:있습니다|있음|있는 상태입니다)/u,
  'privacy universal-ad-serving claim',
)
forbidPattern(
  privacySource,
  /운세 입력 정보를[^.]*광고 식별자와 결합할 수 있습니다/u,
  'privacy fortune-ad-identifier linkage claim',
)
forbidPattern(
  consentPanelSource,
  /production 광고 (?:request\/load\/show )?기능은 아직 구현되지 않았습니다/u,
  'consent copy',
)

const runtimePayload = `${coordinatorSource}\n${appSource}\n${settingsSource}`
const guardedPayload = `${runtimePayload}\n${privacySource}\n${consentPanelSource}\n${documentationSource}`
for (const pattern of [
  /ca-app-pub-\d+[~/]\d+/u,
  /\b(?:YOUR_ADMOB_APP_ID|REPLACE_ME|SAMPLE_APP_ID|APP_ID_PLACEHOLDER)\b/u,
  /\btestDeviceIdentifiers?\b/u,
  /\bTEST_DEVICE_ID\b/u,
  /\bdebugGeography\b/u,
]) {
  forbidPattern(guardedPayload, pattern, 'advertising guardrail')
}
for (const pattern of [
  /\.(?:showBanner|hideBanner|resumeBanner|removeBanner|prepareInterstitial|showInterstitial|prepareRewardVideoAd|showRewardVideoAd|showRewardedAd|loadAd|showAd)\s*\(/u,
  /\bresetConsentInfo\s*\(/u,
]) {
  forbidPattern(runtimePayload, pattern, 'runtime advertising guardrail')
}
if (guardedPayload.includes('\uFFFD')) errors.push('text quality: U+FFFD found')
for (const marker of [
  ['媛쒖씤', '?뺣낫'].join(''),
  ['荑좏궎', '?ㅼ젙'].join(''),
]) {
  if (guardedPayload.includes(marker)) errors.push(`text quality: known mojibake found: ${marker}`)
}
for (const claim of [
  'Actual ad request: Completed',
  'Actual ad serving: Completed',
  'AdMob advertising integration: Completed',
]) {
  if (documentationSource.includes(claim)) {
    errors.push(`documentation: forbidden completion claim: ${claim}`)
  }
}

if (creationMode) {
  for (const prefix of ['public/', 'android/', 'ios/', '.github/workflows/']) {
    if ([...changedFiles].some((path) => path.startsWith(prefix))) {
      errors.push(`change scope: ${prefix} must remain unchanged`)
    }
  }
  for (const path of [
    'package-lock.json',
    'src/main.jsx',
    'src/components/ConsentBanner.jsx',
    'src/services/rewardedAdService.js',
    'src/services/rewardedAdProvider.loader.js',
    'src/services/rewardedAdProvider.mock.js',
    'src/services/rewardedAdProvider.sdk.js',
  ]) {
    if (changedFiles.has(path)) errors.push(`change scope: forbidden changed file: ${path}`)
  }
}

const deferred = () => {
  let resolvePromise
  let rejectPromise
  const promise = new Promise((resolveValue, rejectValue) => {
    resolvePromise = resolveValue
    rejectPromise = rejectValue
  })
  return { promise, resolve: resolvePromise, reject: rejectPromise }
}

async function runBehavioralChecks() {
  const moduleUrl = pathToFileURL(resolve(root, coordinatorPath)).href
  const {
    ADMOB_PRIVACY_OPTIONS_ACTION_STATE,
    ADMOB_RUNTIME_CONSENT_STATE,
    createAdmobRuntimeConsentCoordinator,
    shouldShowAdmobPrivacyOptionsEntry,
  } = await import(`${moduleUrl}?privacy-options-checker=${Date.now()}`)

  const info = (overrides = {}) => ({
    status: 'REQUIRED',
    isConsentFormAvailable: true,
    canRequestAds: false,
    privacyOptionsRequirementStatus: 'REQUIRED',
    ...overrides,
  })
  const createScenario = ({
    native = true,
    getPlatform = () => 'android',
    startupRequest = info(),
    startupForm = info(),
    privacyRefreshes = [info()],
    privacyForm,
    initialize,
  } = {}) => {
    const calls = []
    let requestCount = 0
    const coordinator = createAdmobRuntimeConsentCoordinator({
      isNativePlatform: () => native,
      getPlatform,
      requestConsentInfo: async () => {
        calls.push('requestConsentInfo')
        const result = requestCount === 0
          ? startupRequest
          : privacyRefreshes[Math.min(requestCount - 1, privacyRefreshes.length - 1)]
        requestCount += 1
        if (result instanceof Error) throw result
        return result
      },
      showConsentForm: async () => {
        calls.push('showConsentForm')
        if (startupForm instanceof Error) throw startupForm
        return startupForm
      },
      showPrivacyOptionsForm: async () => {
        calls.push('showPrivacyOptionsForm')
        if (privacyForm instanceof Error) throw privacyForm
        if (privacyForm?.then) await privacyForm
      },
      initialize: async () => {
        calls.push('initialize')
        if (initialize instanceof Error) throw initialize
        if (initialize?.then) await initialize
      },
    })
    return { calls, coordinator }
  }

  for (const scenario of [
    createScenario({ native: false }),
    createScenario({ getPlatform: () => 'ios' }),
  ]) {
    await scenario.coordinator.bootstrap()
    assert.equal(shouldShowAdmobPrivacyOptionsEntry(scenario.coordinator.getSnapshot()), false)
    await scenario.coordinator.openPrivacyOptions()
    assert.deepEqual(scenario.calls, [])
  }

  const denied = createScenario()
  await denied.coordinator.bootstrap()
  assert.equal(shouldShowAdmobPrivacyOptionsEntry(denied.coordinator.getSnapshot()), true)
  await denied.coordinator.openPrivacyOptions()
  assert.equal(denied.calls.filter((call) => call === 'showPrivacyOptionsForm').length, 1)
  assert.equal(denied.calls.filter((call) => call === 'requestConsentInfo').length, 2)
  assert.equal(denied.calls.filter((call) => call === 'showConsentForm').length, 1)

  for (const requirement of ['NOT_REQUIRED', 'UNKNOWN']) {
    const scenario = createScenario({
      startupRequest: info({ privacyOptionsRequirementStatus: requirement }),
      startupForm: info({ privacyOptionsRequirementStatus: requirement }),
    })
    await scenario.coordinator.bootstrap()
    assert.equal(shouldShowAdmobPrivacyOptionsEntry(scenario.coordinator.getSnapshot()), false)
    await scenario.coordinator.openPrivacyOptions()
    assert.equal(scenario.calls.includes('showPrivacyOptionsForm'), false)
  }

  const grant = createScenario({
    privacyRefreshes: [info({ status: 'OBTAINED', canRequestAds: true })],
  })
  await grant.coordinator.bootstrap()
  const grantResult = await grant.coordinator.openPrivacyOptions()
  assert.equal(grantResult.state, ADMOB_RUNTIME_CONSENT_STATE.READY)
  assert.equal(grantResult.adGateOpen, true)
  assert.equal(grantResult.initializeResolved, true)
  assert.equal(grant.calls.filter((call) => call === 'initialize').length, 1)

  const ready = createScenario({
    startupForm: info({ status: 'OBTAINED', canRequestAds: true }),
    privacyRefreshes: [info({ status: 'OBTAINED', canRequestAds: true })],
  })
  await ready.coordinator.bootstrap()
  await ready.coordinator.openPrivacyOptions()
  assert.equal(ready.calls.filter((call) => call === 'initialize').length, 1)
  assert.equal(ready.coordinator.getSnapshot().adGateOpen, true)

  const revoke = createScenario({
    startupForm: info({ status: 'OBTAINED', canRequestAds: true }),
    privacyRefreshes: [info({ canRequestAds: false })],
  })
  await revoke.coordinator.bootstrap()
  const revokeResult = await revoke.coordinator.openPrivacyOptions()
  assert.equal(revokeResult.canRequestAds, false)
  assert.equal(revokeResult.adGateOpen, false)
  assert.equal(revokeResult.state, ADMOB_RUNTIME_CONSENT_STATE.CONSENT_DENIED_OR_UNRESOLVED)
  assert.equal(revoke.calls.filter((call) => call === 'initialize').length, 1)

  const revokeAndRegrant = createScenario({
    startupForm: info({ status: 'OBTAINED', canRequestAds: true }),
    privacyRefreshes: [
      info({ canRequestAds: false }),
      info({ status: 'OBTAINED', canRequestAds: true }),
    ],
  })
  await revokeAndRegrant.coordinator.bootstrap()
  const revokedResult = await revokeAndRegrant.coordinator.openPrivacyOptions()
  assert.equal(revokedResult.adGateOpen, false)
  assert.equal(revokedResult.canRequestAds, false)
  assert.equal(revokeAndRegrant.calls.filter((call) => call === 'initialize').length, 1)
  const regrantAction = revokeAndRegrant.coordinator.openPrivacyOptions()
  assert.ok(regrantAction instanceof Promise)
  const regrantedResult = await regrantAction
  assert.equal(regrantedResult.adGateOpen, true)
  assert.equal(regrantedResult.canRequestAds, true)
  assert.equal(regrantedResult.initializeResolved, true)
  assert.equal(revokeAndRegrant.calls.filter((call) => call === 'initialize').length, 1)
  assert.equal(revokeAndRegrant.calls.filter((call) => call === 'showPrivacyOptionsForm').length, 2)
  assert.equal(revokeAndRegrant.calls.filter((call) => call === 'requestConsentInfo').length, 3)
  assert.equal(revokeAndRegrant.calls.filter((call) => call === 'showConsentForm').length, 1)

  const requiredToNotRequired = createScenario({
    startupForm: info({ status: 'OBTAINED', canRequestAds: true }),
    privacyRefreshes: [
      info({
        status: 'OBTAINED',
        canRequestAds: true,
        privacyOptionsRequirementStatus: 'NOT_REQUIRED',
      }),
    ],
  })
  await requiredToNotRequired.coordinator.bootstrap()
  assert.equal(
    shouldShowAdmobPrivacyOptionsEntry(requiredToNotRequired.coordinator.getSnapshot()),
    true,
  )
  const notRequiredResult = await requiredToNotRequired.coordinator.openPrivacyOptions()
  assert.equal(notRequiredResult.privacyOptionsRequirementStatus, 'NOT_REQUIRED')
  assert.equal(shouldShowAdmobPrivacyOptionsEntry(notRequiredResult), false)
  assert.equal(
    requiredToNotRequired.calls.filter((call) => call === 'showPrivacyOptionsForm').length,
    1,
  )
  assert.equal(
    requiredToNotRequired.calls.filter((call) => call === 'requestConsentInfo').length,
    2,
  )
  assert.equal(requiredToNotRequired.calls.filter((call) => call === 'showConsentForm').length, 1)
  const beforeBlockedActionCalls = [...requiredToNotRequired.calls]
  const blockedActionResult = await requiredToNotRequired.coordinator.openPrivacyOptions()
  assert.strictEqual(blockedActionResult, requiredToNotRequired.coordinator.getSnapshot())
  assert.deepEqual(requiredToNotRequired.calls, beforeBlockedActionCalls)

  const formFailure = createScenario({
    startupForm: info({ status: 'OBTAINED', canRequestAds: true }),
    privacyForm: new Error('private native message'),
  })
  await formFailure.coordinator.bootstrap()
  const beforeFormFailure = formFailure.coordinator.getSnapshot()
  const formFailureResult = await formFailure.coordinator.openPrivacyOptions()
  assert.equal(formFailureResult.canRequestAds, beforeFormFailure.canRequestAds)
  assert.equal(formFailureResult.adGateOpen, beforeFormFailure.adGateOpen)
  assert.equal(formFailureResult.privacyOptionsActionState, ADMOB_PRIVACY_OPTIONS_ACTION_STATE.FAILED)
  assert.equal(formFailureResult.lastPrivacyOptionsErrorStage, 'privacy-options-form')
  assert.equal(formFailureResult.isPrivacyOptionsActionPending, false)
  assert.equal(formFailure.calls.filter((call) => call === 'requestConsentInfo').length, 1)

  const refreshFailure = createScenario({
    startupForm: info({ status: 'OBTAINED', canRequestAds: true }),
    privacyRefreshes: [new Error('private refresh message')],
  })
  await refreshFailure.coordinator.bootstrap()
  const beforeRefreshFailure = refreshFailure.coordinator.getSnapshot()
  const refreshFailureResult = await refreshFailure.coordinator.openPrivacyOptions()
  assert.equal(refreshFailureResult.canRequestAds, beforeRefreshFailure.canRequestAds)
  assert.equal(
    refreshFailureResult.privacyOptionsRequirementStatus,
    beforeRefreshFailure.privacyOptionsRequirementStatus,
  )
  assert.equal(refreshFailureResult.state, ADMOB_RUNTIME_CONSENT_STATE.FAILED)
  assert.equal(refreshFailureResult.adGateOpen, false)
  assert.equal(refreshFailureResult.lastPrivacyOptionsErrorStage, 'privacy-options-refresh')

  const initializeFailure = createScenario({
    privacyRefreshes: [
      info({ status: 'OBTAINED', canRequestAds: true }),
      info({ status: 'OBTAINED', canRequestAds: true }),
    ],
    initialize: new Error('private initialize message'),
  })
  await initializeFailure.coordinator.bootstrap()
  const initializeFailureResult = await initializeFailure.coordinator.openPrivacyOptions()
  assert.equal(initializeFailureResult.canRequestAds, true)
  assert.equal(initializeFailureResult.initializeStarted, true)
  assert.equal(initializeFailureResult.initializeResolved, false)
  assert.equal(initializeFailureResult.adGateOpen, false)
  assert.equal(initializeFailureResult.lastPrivacyOptionsErrorStage, 'initialize')
  await initializeFailure.coordinator.openPrivacyOptions()
  assert.equal(initializeFailure.calls.filter((call) => call === 'initialize').length, 1)

  const privacyFormDeferred = deferred()
  const singleFlight = createScenario({ privacyForm: privacyFormDeferred.promise })
  await singleFlight.coordinator.bootstrap()
  const firstAction = singleFlight.coordinator.openPrivacyOptions()
  const secondAction = singleFlight.coordinator.openPrivacyOptions()
  assert.strictEqual(firstAction, secondAction)
  let reentrantAction
  const unsubscribeReentrant = singleFlight.coordinator.subscribe((nextSnapshot) => {
    if (
      nextSnapshot.privacyOptionsActionState === ADMOB_PRIVACY_OPTIONS_ACTION_STATE.OPENING &&
      !reentrantAction
    ) {
      reentrantAction = singleFlight.coordinator.openPrivacyOptions()
    }
  })
  for (let index = 0; index < 4 && !reentrantAction; index += 1) {
    await Promise.resolve()
  }
  assert.strictEqual(reentrantAction, firstAction)
  privacyFormDeferred.resolve()
  await firstAction
  unsubscribeReentrant()
  assert.equal(singleFlight.calls.filter((call) => call === 'showPrivacyOptionsForm').length, 1)
  assert.equal(singleFlight.calls.filter((call) => call === 'requestConsentInfo').length, 2)
  const laterAction = singleFlight.coordinator.openPrivacyOptions()
  assert.notStrictEqual(laterAction, firstAction)
  await laterAction
  assert.equal(singleFlight.calls.filter((call) => call === 'showPrivacyOptionsForm').length, 2)

  let currentPlatform = 'android'
  const staleUi = createScenario({ getPlatform: () => currentPlatform })
  await staleUi.coordinator.bootstrap()
  currentPlatform = 'web'
  await staleUi.coordinator.openPrivacyOptions()
  assert.equal(staleUi.calls.includes('showPrivacyOptionsForm'), false)

  const bootstrapInitializeDeferred = deferred()
  const serialized = createScenario({
    startupForm: info({ status: 'OBTAINED', canRequestAds: true }),
    initialize: bootstrapInitializeDeferred.promise,
    privacyRefreshes: [info({ canRequestAds: false })],
  })
  const bootstrapPromise = serialized.coordinator.bootstrap()
  await Promise.resolve()
  await Promise.resolve()
  const serializedAction = serialized.coordinator.openPrivacyOptions()
  await Promise.resolve()
  assert.equal(serialized.calls.includes('showPrivacyOptionsForm'), false)
  bootstrapInitializeDeferred.resolve()
  await bootstrapPromise
  const serializedResult = await serializedAction
  assert.equal(serialized.calls.filter((call) => call === 'showConsentForm').length, 1)
  assert.equal(serializedResult.adGateOpen, false)

  const observable = createScenario()
  let healthyListenerCalls = 0
  observable.coordinator.subscribe(() => {
    throw new Error('listener failure')
  })
  const unsubscribe = observable.coordinator.subscribe(() => {
    healthyListenerCalls += 1
  })
  await observable.coordinator.bootstrap()
  await observable.coordinator.openPrivacyOptions()
  assert.ok(healthyListenerCalls > 0)
  unsubscribe()
  const frozenSnapshot = observable.coordinator.getSnapshot()
  assert.ok(Object.isFrozen(frozenSnapshot))
  assert.throws(() => {
    frozenSnapshot.adGateOpen = true
  }, TypeError)
}

try {
  await runBehavioralChecks()
} catch (error) {
  errors.push(`behavioral check failed: ${error?.stack ?? error}`)
}

if (process.argv.includes('--negative-self-test')) {
  const append = (path, text) =>
    writeFileSync(resolve(root, path), `${read(path)}${text}`, 'utf8')
  const replace = (path, from, to) => {
    const source = read(path)
    assert.ok(source.includes(from), `${path}: negative probe source is missing`)
    writeFileSync(resolve(root, path), source.replace(from, to), 'utf8')
  }
  const replaceAll = (path, from, to) => {
    const source = read(path)
    assert.ok(source.includes(from), `${path}: negative probe source is missing`)
    writeFileSync(resolve(root, path), source.replaceAll(from, to), 'utf8')
  }
  const mutatePackage = (mutate) => {
    const value = JSON.parse(read('package.json'))
    mutate(value)
    writeFileSync(resolve(root, 'package.json'), `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  }
  const unexpectedSrcPath = 'src/admobPrivacyOptionsUnexpectedProbe.js'
  const unexpectedRootPath = 'admob-privacy-options-unexpected.tmp'
  const syntheticProductionAdUnitId = [
    'ca-app-pub-',
    ['1234', '5678', '9012', '3456'].join(''),
    '/',
    ['12345', '67890'].join(''),
  ].join('')
  const mutationCases = [
    ['unexpected src file', () => writeFileSync(resolve(root, unexpectedSrcPath), 'export default true\n', 'utf8')],
    ['src/main.jsx', () => append('src/main.jsx', '\n// privacy-options negative probe\n')],
    ['ConsentBanner', () => append('src/components/ConsentBanner.jsx', '\n// negative probe\n')],
    ['rewarded provider', () => append('src/services/rewardedAdProvider.sdk.js', '\n// negative probe\n')],
    ['AndroidManifest', () => append('android/app/src/main/AndroidManifest.xml', '\n<!-- negative probe -->\n')],
    ['Gradle', () => append('android/app/build.gradle', '\n// negative probe\n')],
    ['workflow', () => append('.github/workflows/android-debug-build.yml', '\n# negative probe\n')],
    ['package-lock', () => append('package-lock.json', '\n')],
    ['dependency', () => mutatePackage((value) => { value.dependencies['negative-probe'] = '1.0.0' })],
    ['existing package script', () => mutatePackage((value) => { value.scripts.build = 'vite build --negative-probe' })],
    ['ad unit ID', () => append(coordinatorPath, `\n// ${syntheticProductionAdUnitId}\n`)],
    ['Google sample ID', () => append(coordinatorPath, '\n// ca-app-pub-3940256099942544~3347511713\n')],
    ['placeholder', () => append(coordinatorPath, '\n// YOUR_ADMOB_APP_ID\n')],
    ['test-device marker', () => append(coordinatorPath, '\n// testDeviceIdentifiers\n')],
    ['debugGeography', () => append(coordinatorPath, '\n// debugGeography\n')],
    ['ad request API', () => append(coordinatorPath, '\n// AdMob.prepareInterstitial()\n')],
    ['ad load API', () => append(coordinatorPath, '\n// AdMob.loadAd()\n')],
    ['ad show API', () => append(coordinatorPath, '\n// AdMob.showAd()\n')],
    ['resetConsentInfo', () => append(coordinatorPath, '\n// AdMob.resetConsentInfo()\n')],
    ['UMP localStorage', () => append(coordinatorPath, '\n// localStorage.setItem("ump", "value")\n')],
    ['local consent as UMP', () => append(coordinatorPath, '\n// consentPreferences.ads\n')],
    ['App bootstrap', () => append('src/App.jsx', '\n// bootstrapAdmobRuntimeConsent()\n')],
    ['subscribe-only hydration', () => replace('src/App.jsx', '() => getAdmobRuntimeConsentSnapshot(),', '() => ({}),')],
    ['effect re-read', () => replace('src/App.jsx', 'setAdmobSnapshot(getAdmobRuntimeConsentSnapshot());', '// snapshot re-read removed')],
    ['cleanup', () => replace('src/App.jsx', 'return subscribeAdmobRuntimeConsent', 'subscribeAdmobRuntimeConsent')],
    ['REQUIRED gate', () => replaceAll(coordinatorPath, "privacyOptionsRequirementStatus === 'REQUIRED'", "privacyOptionsRequirementStatus === 'NOT_REQUIRED'")],
    ['NOT_REQUIRED visibility', () => replace(coordinatorPath, "snapshot?.privacyOptionsRequirementStatus === 'REQUIRED'", "snapshot?.privacyOptionsRequirementStatus !== 'UNKNOWN'")],
    ['Web visibility', () => replace(coordinatorPath, 'snapshot?.isNativeAndroid === true &&', 'true &&')],
    ['Web plugin', () => replaceAll(coordinatorPath, 'dependencies.isNativePlatform() === true &&', 'true &&')],
    ['entry label', () => replaceAll('src/pages/SettingsPage.jsx', '개인정보 및 쿠키 설정', '개인정보 설정')],
    ['pending disabled', () => replace('src/pages/SettingsPage.jsx', 'disabled={isPrivacyOptionsActionPending}', 'disabled={false}')],
    ['failed polite live region', () => replace('src/pages/SettingsPage.jsx', "aria-live={isPrivacyOptionsError ? undefined : 'polite'}", 'aria-live="polite"')],
    ['failed status role', () => replace('src/pages/SettingsPage.jsx', "isPrivacyOptionsError ? 'alert' : 'status';", "isPrivacyOptionsError ? 'status' : 'status';")],
    ['non-error polite live region', () => replace('src/pages/SettingsPage.jsx', "aria-live={isPrivacyOptionsError ? undefined : 'polite'}", 'aria-live={undefined}')],
    ['single-flight', () => replace(coordinatorPath, 'if (privacyOptionsPromise) return privacyOptionsPromise;', '// single-flight removed')],
    ['Promise identity', () => replace(coordinatorPath, 'function openPrivacyOptions() {', 'async function openPrivacyOptions() {')],
    ['refresh', () => replace(coordinatorPath, 'refreshedConsentInfo = await dependencies.requestConsentInfo();', 'refreshedConsentInfo = snapshot;')],
    ['showConsentForm after refresh', () => replace(coordinatorPath, 'await openPrivacyForm();', 'await openPrivacyForm();\n      await dependencies.showConsentForm();')],
    ['revocation gate', () => replace(coordinatorPath, 'state:\n          ADMOB_RUNTIME_CONSENT_STATE.CONSENT_DENIED_OR_UNRESOLVED,\n        canRequestAds: false,\n        adGateOpen: false,', 'state:\n          ADMOB_RUNTIME_CONSENT_STATE.CONSENT_DENIED_OR_UNRESOLVED,\n        canRequestAds: false,\n        adGateOpen: true,')],
    ['refresh failure gate', () => replace(coordinatorPath, "lastErrorStage: 'privacy-options-refresh',\n        privacyOptionsActionState:", "lastErrorStage: 'privacy-options-refresh',\n        adGateOpen: true,\n        privacyOptionsActionState:")],
    ['duplicate initialize', () => replace(coordinatorPath, 'if (initializePromise) return initializePromise;', '// initialize guard removed')],
    ['stale bootstrap gate', () => replace(coordinatorPath, 'snapshot.canRequestAds !== true ||\n        privacyRefreshGateBlocked', 'false ||\n        false')],
    ['stale SDK copy', () => append('src/pages/PrivacyInfoPage.jsx', '\n실제 광고 SDK가 연결되어 있지 않음\n')],
    [
      'privacy TLS copy',
      () => replace('src/pages/PrivacyInfoPage.jsx', 'TLS를 이용하여 전송 중 암호화됩니다', '안전하게 전송됩니다'),
      'missing required text: TLS를 이용하여 전송 중 암호화',
    ],
    [
      'privacy data category',
      () => replace(
        'src/pages/PrivacyInfoPage.jsx',
        "  'IP 주소를 통해 추정될 수 있는 대략적인 위치',\n",
        '',
      ),
      'missing required text: IP 주소를 통해 추정될 수 있는 대략적인 위치',
    ],
    [
      'stale pre-production review copy',
      () => append('src/pages/PrivacyInfoPage.jsx', '\nproduction 활성화 전 개인정보/Data Safety 최종 검토\n'),
      'privacy stale pre-production review copy',
    ],
    [
      'production update completion claim',
      () => replace(
        'src/pages/PrivacyInfoPage.jsx',
        '일반 사용자 대상 Production 업데이트는 아직 수행되지 않았으므로',
        '일반 사용자 대상 Production 업데이트는 완료되었으므로',
      ),
      'privacy production-update completion claim',
    ],
    [
      'fortune input identifier linkage',
      () => replace(
        'src/pages/PrivacyInfoPage.jsx',
        '광고 식별자와 결합하지 않습니다',
        '광고 식별자와 결합할 수 있습니다',
      ),
      'privacy fortune-ad-identifier linkage claim',
    ],
    [
      'privacy canonical URL',
      () => replace(
        'src/pages/PrivacyInfoPage.jsx',
        'https://www.hymlounge.com/harupuli/privacy/',
        'https://hymlounge.example/harupuli/privacy/',
      ),
      'missing required text: https://www.hymlounge.com/harupuli/privacy/',
    ],
    [
      'privacy noncanonical URL',
      () => append(
        'src/pages/PrivacyInfoPage.jsx',
        '\nhttps://hymlounge.com/harupuli/privacy/\n',
      ),
      'privacy noncanonical policy URL',
    ],
    ['ad request completion claim', () => append('CHANGELOG.md', '\nActual ad request: Completed\n')],
    ['ad serving completion claim', () => append('CHANGELOG.md', '\nActual ad serving: Completed\n')],
    ['U+FFFD', () => append('CHANGELOG.md', '\n\uFFFD\n')],
    ['known mojibake', () => append('CHANGELOG.md', `\n${['媛쒖씤', '?뺣낫'].join('')}\n`)],
    ['unexpected untracked', () => writeFileSync(resolve(root, unexpectedRootPath), 'negative probe\n', 'utf8')],
  ]
  assert.equal(mutationCases.length, 55)
  const totalChecks = mutationCases.length + 1
  const restorePaths = [
    'src/main.jsx',
    'src/components/ConsentBanner.jsx',
    'src/services/rewardedAdProvider.sdk.js',
    'android/app/src/main/AndroidManifest.xml',
    'android/app/build.gradle',
    '.github/workflows/android-debug-build.yml',
    'package-lock.json',
    'package.json',
    coordinatorPath,
    'src/App.jsx',
    'src/pages/SettingsPage.jsx',
    'src/pages/PrivacyInfoPage.jsx',
    'CHANGELOG.md',
  ]
  let passed = 0
  for (const [name, mutate, expectedError] of mutationCases) {
    const originals = new Map(
      restorePaths.map((path) => [path, readFileSync(resolve(root, path), 'utf8')]),
    )
    try {
      mutate()
      const result = spawnSync(process.execPath, [resolve(root, checkerPath)], {
        cwd: root,
        encoding: 'utf8',
        env: {
          ...process.env,
          ADMOB_PRIVACY_OPTIONS_CHECK_CREATION_SELF_TEST: '1',
          ADMOB_PRIVACY_OPTIONS_CHECK_POST_MERGE: '0',
        },
      })
      if (result.status === 0) {
        throw new Error(`${name}: checker unexpectedly accepted the mutation`)
      }
      if (
        expectedError &&
        !`${result.stdout ?? ''}\n${result.stderr ?? ''}`.includes(expectedError)
      ) {
        throw new Error(`${name}: checker output is missing expected error: ${expectedError}`)
      }
      passed += 1
      console.log(`PASS ${passed}/${totalChecks}: ${name}`)
    } finally {
      for (const [path, content] of originals) {
        writeFileSync(resolve(root, path), content, 'utf8')
      }
      for (const path of [unexpectedSrcPath, unexpectedRootPath]) {
        if (existsSync(resolve(root, path))) unlinkSync(resolve(root, path))
      }
    }
  }
  const postMergeResult = spawnSync(process.execPath, [resolve(root, checkerPath)], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      ADMOB_PRIVACY_OPTIONS_CHECK_CREATION_SELF_TEST: '0',
      ADMOB_PRIVACY_OPTIONS_CHECK_POST_MERGE: '1',
    },
  })
  if (postMergeResult.status !== 0) {
    throw new Error(`post-merge mode failed:\n${postMergeResult.stdout}\n${postMergeResult.stderr}`)
  }
  passed += 1
  console.log(`PASS ${passed}/${totalChecks}: post-merge mode`)
  console.log(`AdMob privacy options UI negative verification passed (${passed}/${totalChecks})`)
  process.exit(0)
}

if (errors.length) {
  console.error('AdMob privacy options UI check failed.')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log(`AdMob privacy options UI check passed (${creationMode ? 'creation' : 'post-merge'} mode)`)
