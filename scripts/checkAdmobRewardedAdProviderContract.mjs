import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const documentPath = 'docs/ADMOB_REWARDED_AD_PROVIDER_CONTRACT.md'
const checkerPath = 'scripts/checkAdmobRewardedAdProviderContract.mjs'
const scriptName = 'check:admob-rewarded-provider-contract'
const expectedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  documentPath,
  'package.json',
  checkerPath,
])
const preservedUntrackedFiles = new Set(['pr405-review.json', 'pr405.diff'])
const productionPaths = [
  'src',
  'public',
  'android',
  'ios',
  '.github/workflows',
  'package-lock.json',
  'capacitor.config.js',
  'capacitor.config.ts',
  'vite.config.js',
  'vite.config.ts',
]
const errors = []
const read = (path) => readFileSync(resolve(root, path), 'utf8').replace(/\r\n/g, '\n')
const git = (...args) =>
  execFileSync('git', args, { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n')
const lines = (...args) =>
  git(...args).split('\n').map((line) => line.trim().replaceAll('\\', '/')).filter(Boolean)
const requireText = (content, text, label = documentPath) => {
  if (!content.includes(text)) errors.push(`${label}: missing required text: ${text}`)
}
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
const validPackageMap = (value) =>
  isPlainObject(value) &&
  Object.entries(value).every(
    ([name, version]) => name.length > 0 && typeof version === 'string' && version.length > 0,
  )

if (process.argv.includes('--negative-self-test')) {
  const append = (path, text) => writeFileSync(resolve(root, path), `${read(path)}${text}`, 'utf8')
  const replace = (path, from, to) => {
    const content = read(path)
    if (!content.includes(from)) throw new Error(`self-test fixture missing: ${from}`)
    writeFileSync(resolve(root, path), content.replace(from, to), 'utf8')
  }
  const replaceAll = (path, from, to) => {
    const content = read(path)
    if (!content.includes(from)) throw new Error(`self-test fixture missing: ${from}`)
    writeFileSync(resolve(root, path), content.replaceAll(from, to), 'utf8')
  }
  const unexpectedPath = 'unexpected-rewarded-contract.tmp'
  const packageMutation = (mutate) => {
    const value = JSON.parse(read('package.json'))
    mutate(value)
    writeFileSync(resolve(root, 'package.json'), `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  }
  const cases = [
    ['unexpected src file', () => append('src/services/rewardedAdService.js', '\n// probe\n'), 'unexpected changed file'],
    ['SDK provider source', () => append('src/services/rewardedAdProvider.sdk.js', '\n// probe\n'), 'unexpected changed file'],
    ['RewardAdModal source', () => append('src/components/RewardAdModal.jsx', '\n// probe\n'), 'unexpected changed file'],
    ['App source', () => append('src/App.jsx', '\n// probe\n'), 'unexpected changed file'],
    ['AndroidManifest', () => append('android/app/src/main/AndroidManifest.xml', '\n<!-- probe -->\n'), 'unexpected changed file'],
    ['Gradle', () => append('android/app/build.gradle', '\n// probe\n'), 'unexpected changed file'],
    ['workflow', () => append('.github/workflows/android-debug-build.yml', '\n# probe\n'), 'unexpected changed file'],
    ['package lock', () => append('package-lock.json', '\n'), 'unexpected changed file'],
    ['dependency', () => packageMutation((value) => { value.dependencies.probe = '1.0.0' }), 'dependencies changed'],
    ['existing script', () => packageMutation((value) => { value.scripts.build = 'vite build --probe' }), 'existing script changed'],
    ['runtime ad unit ID', () => append('CHANGELOG.md', '\nca-app-pub-1234567890123456/1234567890\n'), 'ad unit ID'],
    ['test device ID', () => append('CHANGELOG.md', `\n${['TEST', 'DEVICE', 'HASHED', 'ID'].join('-')}\n`), 'test-device'],
    ['debug geography', () => append('CHANGELOG.md', '\ndebugGeography = 1\n'), 'debugGeography'],
    ['prepare runtime call', () => append('CHANGELOG.md', `\n${['AdMob', 'prepareRewardVideoAd'].join('.')}({})\n`), 'runtime ad call'],
    ['show runtime call', () => append('CHANGELOG.md', `\n${['AdMob', 'showRewardVideoAd'].join('.')}()\n`), 'runtime ad call'],
    ['Dismissed reward', () => append(documentPath, '\nDismissed is the authoritative reward signal.\n'), 'forbidden contract meaning'],
    ['Showed reward', () => append(documentPath, '\nShowed is the authoritative reward signal.\n'), 'forbidden contract meaning'],
    ['Loaded reward', () => append(documentPath, '\nLoaded is the authoritative reward signal.\n'), 'forbidden contract meaning'],
    ['early unlock', () => append(documentPath, '\nunlock before reward\n'), 'forbidden contract meaning'],
    ['dual unlock', () => append(documentPath, '\nunlock from Promise and event independently\n'), 'forbidden contract meaning'],
    ['exactly-once removal', () => replaceAll(documentPath, 'exactly-once', 'best-effort reward'), 'exactly-once'],
    ['local gate removal', () => replaceAll(documentPath, 'Local ads consent gate', 'Local preference note'), 'Local ads consent gate'],
    ['runtime gate removal', () => replaceAll(documentPath, 'Latest AdMob runtime gate', 'Cached runtime note'), 'Latest AdMob runtime gate'],
    ['pre-show removal', () => replaceAll(documentPath, 'pre-show gate', 'post-load note'), 'pre-show gate'],
    ['SDK mock fallback', () => append(documentPath, '\nSDK failure falls back to mock success.\n'), 'forbidden contract meaning'],
    ['single-flight removal', () => replace(documentPath, 'single-flight same\nPromise', 'new Promise per caller'), 'single-flight same Promise'],
    ['Promise wrapper identity', () => append(documentPath, '\nReturn an async wrapper around the in-flight Promise.\n'), 'forbidden contract meaning'],
    ['listener cleanup removal', () => replaceAll(documentPath, 'Listener cleanup', 'Listener notes'), 'Listener cleanup'],
    ['remove all listeners', () => append(documentPath, `\n${['remove', 'All', 'Listeners'].join('')} is allowed.\n`), 'forbidden contract meaning'],
    ['timeout removal', () => replaceAll(documentPath, 'Ad load timeout', 'Ad load wait'), 'Ad load timeout'],
    ['missing production ID request', () => append(documentPath, '\nMissing production ID may still request an ad.\n'), 'forbidden contract meaning'],
    ['mode mixing', () => append(documentPath, '\nOfficial test and production modes may mix automatically.\n'), 'forbidden contract meaning'],
    ['UMP localStorage', () => append(documentPath, '\nStore UMP status in localStorage.\n'), 'forbidden contract meaning'],
    ['reward payload localStorage', () => append(documentPath, '\nStore native reward payload in localStorage.\n'), 'forbidden contract meaning'],
    ['storage key change', () => append(documentPath, '\nChange the existing reward localStorage key.\n'), 'forbidden contract meaning'],
    ['schema change', () => append(documentPath, '\nIncrement schemaVersion for this PR.\n'), 'forbidden contract meaning'],
    ['request Completed', () => append(documentPath, '\nActual ad request: Completed\n'), 'forbidden completion claim'],
    ['serving Completed', () => append(documentPath, '\nActual ad serving: Completed\n'), 'forbidden completion claim'],
    ['Android QA Pass', () => append(documentPath, '\nAndroid advertising QA: Pass\n'), 'forbidden completion claim'],
    ['replacement character', () => append(documentPath, '\n\uFFFD\n'), 'U+FFFD'],
    ['known mojibake', () => append(documentPath, `\n${['媛쒖씤', '?뺣낫'].join('')}\n`), 'known mojibake'],
    ['unexpected untracked', () => writeFileSync(resolve(root, unexpectedPath), 'probe\n', 'utf8'), 'unexpected changed file'],
  ]
  const pathsToRestore = [
    'src/services/rewardedAdService.js',
    'src/services/rewardedAdProvider.sdk.js',
    'src/components/RewardAdModal.jsx',
    'src/App.jsx',
    'android/app/src/main/AndroidManifest.xml',
    'android/app/build.gradle',
    '.github/workflows/android-debug-build.yml',
    'package-lock.json',
    'package.json',
    'CHANGELOG.md',
    documentPath,
  ]
  let mutationPasses = 0
  for (const [name, mutate, expected] of cases) {
    const originals = new Map(pathsToRestore.map((path) => [path, readFileSync(resolve(root, path), 'utf8')]))
    try {
      mutate()
      const result = spawnSync(process.execPath, [resolve(root, checkerPath)], {
        cwd: root,
        encoding: 'utf8',
      })
      const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
      if (result.status === 0 || !output.includes(expected)) {
        throw new Error(`${name}: expected rejection containing "${expected}"\n${output}`)
      }
      mutationPasses += 1
      console.log(`PASS mutation ${mutationPasses}/${cases.length}: ${name}`)
    } finally {
      for (const [path, content] of originals) writeFileSync(resolve(root, path), content, 'utf8')
      if (existsSync(resolve(root, unexpectedPath))) unlinkSync(resolve(root, unexpectedPath))
    }
  }
  const postMerge = spawnSync(
    process.execPath,
    [resolve(root, checkerPath), '--post-merge-fixture'],
    { cwd: root, encoding: 'utf8' },
  )
  if (postMerge.status !== 0) {
    throw new Error(`post-merge fixture failed:\n${postMerge.stdout}\n${postMerge.stderr}`)
  }
  console.log('PASS post-merge fixture 1/1: expected-file creation checks disabled')
  console.log(
    `AdMob rewarded ad provider contract negative verification passed (mutations ${mutationPasses}/${cases.length}; post-merge fixture 1/1)`,
  )
  process.exit(0)
}

const forcePostMergeFixture = process.argv.includes('--post-merge-fixture')
const creationMode = !forcePostMergeFixture && !gitObjectExists(`origin/main:${documentPath}`)
const untrackedFiles = lines('ls-files', '--others', '--exclude-standard')
const unexpectedUntrackedFiles = untrackedFiles.filter(
  (path) => !preservedUntrackedFiles.has(path),
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
    if (!expectedFiles.has(path)) errors.push(`change scope: unexpected changed file: ${path}`)
  }
  for (const path of expectedFiles) {
    if (!changedFiles.has(path)) errors.push(`change scope: expected changed file is missing: ${path}`)
  }
}

const trackedFiles = new Set(lines('ls-files'))
for (const path of preservedUntrackedFiles) {
  if (committedChanges.includes(path) || stagedChanges.includes(path) || trackedFiles.has(path)) {
    errors.push(`preserved local file must remain untracked and uncommitted: ${path}`)
  }
}

if (creationMode) {
  for (const path of productionPaths) {
    if (
      [...changedFiles].some(
        (changed) => changed === path || changed.startsWith(`${path.replaceAll('\\', '/')}/`),
      )
    ) {
      errors.push(`docs/check-only scope: forbidden production path changed: ${path}`)
    }
  }
  const productionDiff = lines('diff', '--name-only', 'origin/main', '--', ...productionPaths)
  if (productionDiff.length) {
    errors.push(`docs/check-only scope: production diff exists: ${productionDiff.join(', ')}`)
  }
}

const packageJson = JSON.parse(read('package.json'))
if (packageJson.scripts?.[scriptName] !== `node ${checkerPath}`) {
  errors.push(`package.json: incorrect ${scriptName} command`)
}
if (!validPackageMap(packageJson.dependencies)) errors.push('package.json: invalid dependencies map')
if (!validPackageMap(packageJson.devDependencies)) errors.push('package.json: invalid devDependencies map')
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

const document = read(documentPath)
const compactDocument = document.replace(/\s+/gu, ' ')
for (const text of [
  '@capacitor-community/admob@8.0.0',
  'prepareRewardVideoAd(options): Promise<AdLoadInfo>',
  'showRewardVideoAd(): Promise<AdMobRewardItem>',
  'RewardAdPluginEvents',
  'Dismissed is not reward',
  'authoritative reward signal',
  'exactly-once',
  'Local ads consent gate',
  'Latest AdMob runtime gate',
  'pre-prepare gate',
  'pre-show gate',
  'no SDK-to-mock fallback',
  'single-flight same Promise',
  'Listener cleanup',
  'removeAllListeners is prohibited',
  'Ad load timeout',
  'Native show-start timeout',
  'Official test mode',
  'Production ad unit pending',
  'No actual ad request/load/show in PR #410',
  'Reward only after verified signal',
  'Do not store UMP status',
  'Existing storage/schema unchanged',
  'PR #411 implementation plan',
  'Android test-ad QA pending',
]) {
  requireText(compactDocument, text)
}

const forbiddenMeanings = [
  'Dismissed is the authoritative reward signal.',
  'Showed is the authoritative reward signal.',
  'Loaded is the authoritative reward signal.',
  'unlock before reward',
  'unlock from Promise and event independently',
  'SDK failure falls back to mock success.',
  'Return an async wrapper around the in-flight Promise.',
  'removeAllListeners is allowed.',
  'Missing production ID may still request an ad.',
  'Official test and production modes may mix automatically.',
  'Store UMP status in localStorage.',
  'Store native reward payload in localStorage.',
  'Change the existing reward localStorage key.',
  'Increment schemaVersion for this PR.',
]
for (const meaning of forbiddenMeanings) {
  if (compactDocument.includes(meaning)) {
    errors.push(`${documentPath}: forbidden contract meaning: ${meaning}`)
  }
}
for (const claim of [
  'Actual ad request: Completed',
  'Actual ad serving: Completed',
  'Android advertising QA: Pass',
]) {
  if (compactDocument.includes(claim)) {
    errors.push(`${documentPath}: forbidden completion claim: ${claim}`)
  }
}

const payloadPaths = [...expectedFiles].filter((path) => path !== checkerPath)
const payload = (creationMode
  ? payloadPaths.filter((path) => changedFiles.has(path))
  : [documentPath]
).map((path) => read(path)).join('\n')
const nonContractPayload = (creationMode
  ? payloadPaths.filter((path) => path !== documentPath && changedFiles.has(path))
  : []
).map((path) => read(path)).join('\n')
const checkerSource = read(checkerPath)

if (`${payload}\n${checkerSource}`.includes('\uFFFD')) {
  errors.push('text quality: Unicode replacement character U+FFFD found')
}
for (const marker of [
  ['媛쒖씤', '?뺣낫'].join(''),
  ['荑좏궎', '?ㅼ젙'].join(''),
  ['?대쾲', ' PR'].join(''),
]) {
  if (`${payload}\n${checkerSource}`.includes(marker)) {
    errors.push(`text quality: known mojibake found: ${marker}`)
  }
}

if (/ca-app-pub-\d+\/\d+/u.test(payload)) {
  errors.push('content safety: an ad unit ID was added')
}
if (/\b[A-F0-9]{32}\b/u.test(payload)) {
  errors.push('content safety: a test-device identifier was added')
}
for (const token of [
  ['TEST', 'DEVICE', 'HASHED', 'ID'].join('-'),
  ['YOUR', 'ADMOB', 'AD', 'UNIT', 'ID'].join('_'),
  ['REPLACE', 'ME'].join('_'),
]) {
  if (payload.includes(token)) {
    errors.push(`content safety: forbidden placeholder or test-device marker: ${token}`)
  }
}
if (/debugGeography\s*[:=]/u.test(nonContractPayload)) {
  errors.push('docs/check-only scope: debugGeography configuration was added')
}
for (const runtimeCall of [
  ['AdMob', 'prepareRewardVideoAd'].join('.'),
  ['AdMob', 'showRewardVideoAd'].join('.'),
]) {
  if (new RegExp(`${runtimeCall.replace('.', '\\.')}\\s*\\(`, 'u').test(nonContractPayload)) {
    errors.push(`docs/check-only scope: runtime ad call outside contract: ${runtimeCall}`)
  }
}

if (!creationMode) {
  const sdkSource = read('src/services/rewardedAdProvider.sdk.js')
  const loaderSource = read('src/services/rewardedAdProvider.loader.js')
  const modalSource = read('src/components/RewardAdModal.jsx')
  requireText(sdkSource, 'SDK_UNAVAILABLE', 'post-merge SDK source')
  requireText(loaderSource, 'showMockRewardedAd', 'post-merge loader source')
  requireText(modalSource, 'getMockRewardedAdDurationSeconds', 'post-merge modal source')
  if (sdkSource.includes('prepareRewardVideoAd(') || sdkSource.includes('showRewardVideoAd(')) {
    errors.push('post-merge baseline: SDK provider is no longer the expected stub')
  }
}

if (errors.length) {
  console.error('AdMob rewarded ad provider contract check failed.')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log(
  `AdMob rewarded ad provider contract check passed (${creationMode ? 'creation' : 'post-merge'} mode)`,
)
