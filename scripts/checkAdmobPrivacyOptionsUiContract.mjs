import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const documentPath = 'docs/ADMOB_PRIVACY_OPTIONS_UI_CONTRACT.md'
const checkerPath = 'scripts/checkAdmobPrivacyOptionsUiContract.mjs'
const scriptName = 'check:admob-privacy-options-ui-contract'
const allowedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  'package.json',
  documentPath,
  checkerPath,
])
const preservedUntrackedFiles = new Set(['pr405-review.json', 'pr405.diff'])
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
  const replace = (path, from, to) =>
    writeFileSync(resolve(root, path), read(path).replace(from, to), 'utf8')
  const replaceAll = (path, from, to) =>
    writeFileSync(resolve(root, path), read(path).replaceAll(from, to), 'utf8')
  const unexpectedPath = 'admob-privacy-options-unexpected.tmp'
  const cases = [
    ['src file change', () => append('src/App.jsx', '\n// negative scope probe\n'), 'src/'],
    [
      'SettingsPage UI change',
      () => append('src/pages/SettingsPage.jsx', '\n// privacy options UI probe\n'),
      'src/',
    ],
    [
      'coordinator runtime change',
      () => append('src/services/admobRuntimeConsentCoordinator.js', '\n// runtime probe\n'),
      'src/',
    ],
    [
      'AndroidManifest change',
      () => append('android/app/src/main/AndroidManifest.xml', '\n<!-- negative probe -->\n'),
      'android/',
    ],
    [
      'package dependency change',
      () => {
        const value = JSON.parse(read('package.json'))
        value.dependencies['negative-contract-probe'] = '1.0.0'
        writeFileSync(resolve(root, 'package.json'), `${JSON.stringify(value, null, 2)}\n`, 'utf8')
      },
      'dependencies changed',
    ],
    [
      'existing package script change',
      () => {
        const value = JSON.parse(read('package.json'))
        value.scripts.build = 'vite build --negative-probe'
        writeFileSync(resolve(root, 'package.json'), `${JSON.stringify(value, null, 2)}\n`, 'utf8')
      },
      'existing script changed',
    ],
    [
      'package-lock change',
      () => append('package-lock.json', '\n'),
      'package-lock',
    ],
    [
      'ad unit ID',
      () => append(documentPath, '\nca-app-pub-1234567890123456/1234567890\n'),
      'ad unit ID',
    ],
    [
      'Google sample ID',
      () => append(documentPath, '\nca-app-pub-3940256099942544~3347511713\n'),
      'AdMob App ID',
    ],
    [
      'placeholder',
      () => append(documentPath, '\nYOUR_ADMOB_APP_ID\n'),
      'forbidden placeholder',
    ],
    [
      'test-device marker',
      () => append(documentPath, '\nTEST-DEVICE-HASHED-ID\n'),
      'test marker',
    ],
    [
      'debugGeography',
      () => append('CHANGELOG.md', '\ndebugGeography: 1\n'),
      'debugGeography',
    ],
    [
      'showPrivacyOptionsForm runtime call',
      () => append('CHANGELOG.md', '\nAdMob.showPrivacyOptionsForm()\n'),
      'runtime call',
    ],
    [
      'advertising request/load/show code',
      () => append('CHANGELOG.md', '\nloadRewarded()\n'),
      'advertising request/load/show',
    ],
    [
      'official entry label removal',
      () => replaceAll(documentPath, '개인정보 및 쿠키 설정', 'privacy entry'),
      '개인정보 및 쿠키 설정',
    ],
    [
      'always-visible contract',
      () => append(documentPath, '\nprivacy-options entry is always visible\n'),
      'forbidden contract meaning',
    ],
    [
      'NOT_REQUIRED visibility contract',
      () => append(documentPath, '\nshow the entry for NOT_REQUIRED\n'),
      'forbidden contract meaning',
    ],
    [
      'local consent used as UMP',
      () => append(documentPath, '\nuse consentPreferences.ads as the UMP value\n'),
      'forbidden contract meaning',
    ],
    [
      'UMP persisted to localStorage',
      () => append(documentPath, '\ncopy UMP values into localStorage\n'),
      'forbidden contract meaning',
    ],
    [
      'revocation leaves gate open',
      () => append(documentPath, '\nkeep adGateOpen true after revocation\n'),
      'forbidden contract meaning',
    ],
    [
      'single-flight guard removal',
      () => replace(documentPath, 'return that same Promise', 'start another Promise'),
      'return that same Promise',
    ],
    [
      'post-form refresh removal',
      () => replace(documentPath, 'Candidate A is selected', 'Candidate C is selected'),
      'Candidate A is selected',
    ],
    [
      'privacy-options completion overclaim',
      () => append(documentPath, '\nprivacy-options UI implementation: Completed\n'),
      'forbidden contract meaning',
    ],
    [
      'ad implementation completion overclaim',
      () => append(documentPath, '\nActual ad request/load/show: Completed\n'),
      'forbidden contract meaning',
    ],
    [
      'Unicode replacement character',
      () => append(documentPath, '\n\uFFFD\n'),
      'U+FFFD',
    ],
    [
      'known mojibake',
      () => append(documentPath, `\n${['媛쒖씤', '?뺣낫'].join('')}\n`),
      'known mojibake',
    ],
    [
      'unexpected untracked file',
      () => writeFileSync(resolve(root, unexpectedPath), 'negative probe\n', 'utf8'),
      'unexpected changed file',
    ],
    [
      'initial snapshot hydration removal',
      () =>
        replace(
          documentPath,
          'App state initializes from\ngetAdmobRuntimeConsentSnapshot',
          'App state starts from a default value',
        ),
      'App state initializes from getAdmobRuntimeConsentSnapshot',
    ],
    [
      'effect snapshot resynchronization removal',
      () =>
        replace(
          documentPath,
          'App effect re-reads current snapshot',
          'App effect keeps the render-time value',
        ),
      'App effect re-reads current snapshot',
    ],
    [
      'future snapshot subscription removal',
      () =>
        replace(
          documentPath,
          'App subscribes for\nfuture snapshots',
          'App ignores future snapshots',
        ),
      'App subscribes for future snapshots',
    ],
    [
      'subscribe-only implementation contract',
      () => append(documentPath, '\nApp uses subscribe only\n'),
      'forbidden contract meaning',
    ],
    [
      'App bootstrap restart contract',
      () => append(documentPath, '\nApp starts bootstrap again to obtain the snapshot\n'),
      'forbidden contract meaning',
    ],
    [
      'localStorage runtime snapshot contract',
      () => append(documentPath, '\nlocalStorage supplies the AdMob runtime snapshot\n'),
      'forbidden contract meaning',
    ],
    [
      'late-subscriber test plan removal',
      () =>
        replace(
          documentPath,
          'bootstrap completes before App mount (late subscriber)',
          'bootstrap timing smoke test',
        ),
      'bootstrap completes before App mount (late subscriber)',
    ],
    [
      'StrictMode subscription cleanup verification removal',
      () =>
        replace(
          documentPath,
          'React StrictMode effect re-registration leaves no duplicate listener',
          'React development mode smoke test',
        ),
      'React StrictMode effect re-registration leaves no duplicate listener',
    ],
  ]
  let passed = 0
  for (const [name, mutate, expected] of cases) {
    const originals = new Map()
    for (const path of [
      'src/App.jsx',
      'src/pages/SettingsPage.jsx',
      'src/services/admobRuntimeConsentCoordinator.js',
      'android/app/src/main/AndroidManifest.xml',
      'package.json',
      'package-lock.json',
      'CHANGELOG.md',
      documentPath,
    ]) {
      originals.set(path, readFileSync(resolve(root, path), 'utf8'))
    }
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
      passed += 1
      console.log(`PASS ${passed}/${cases.length}: ${name}`)
    } finally {
      for (const [path, content] of originals) {
        writeFileSync(resolve(root, path), content, 'utf8')
      }
      if (existsSync(resolve(root, unexpectedPath))) unlinkSync(resolve(root, unexpectedPath))
    }
  }
  console.log(`AdMob privacy options UI contract negative verification passed (${passed}/${cases.length})`)
  process.exit(0)
}

const untrackedFiles = lines('ls-files', '--others', '--exclude-standard')
const unexpectedUntrackedFiles = untrackedFiles.filter(
  (path) => !preservedUntrackedFiles.has(path),
)
const creationMode = !gitObjectExists(`origin/main:${documentPath}`)
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

if (creationMode) {
  const forbiddenPrefixes = ['src/', 'public/', 'android/', 'ios/', '.github/workflows/']
  for (const prefix of forbiddenPrefixes) {
    if ([...changedFiles].some((path) => path.startsWith(prefix))) {
      errors.push(`docs/check-only scope: ${prefix} must remain unchanged`)
    }
  }
  const forbiddenPaths = [
    /^capacitor\.config\./u,
    /^vite\.config\./u,
    /service-worker/iu,
    /package-lock\.json$/u,
  ]
  for (const pattern of forbiddenPaths) {
    if ([...changedFiles].some((path) => pattern.test(path))) {
      errors.push(`docs/check-only scope: forbidden changed path matching ${pattern}`)
    }
  }
}

const packageJson = JSON.parse(read('package.json'))
if (packageJson.scripts?.[scriptName] !== `node ${checkerPath}`) {
  errors.push(`package.json: incorrect ${scriptName} command`)
}
if (!validPackageMap(packageJson.dependencies)) {
  errors.push('package.json: dependencies must remain a valid package map')
}
if (!validPackageMap(packageJson.devDependencies)) {
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

const document = read(documentPath)
const requiredSections = [
  'Purpose and scope',
  'Current merged baseline',
  'Existing privacy and consent UI',
  'Existing copy accuracy review',
  'Plugin v8.0.0 API evidence',
  'Plugin Android implementation evidence',
  'Google UMP privacy-options requirements',
  'Local consent versus UMP boundary',
  'Entry-point visibility contract',
  'Selected UI location',
  'Privacy-options action sequence',
  'Post-form consent refresh contract',
  'Consent revocation behavior',
  'Consent grant behavior',
  'Single-flight and duplicate interaction guard',
  'UI state model',
  'Error handling and fail-closed behavior',
  'Native and web behavior',
  'Initial snapshot hydration and late subscribers',
  'Production implementation file plan',
  'Test plan',
  'Android device QA plan',
  'Blocking conditions',
  'Explicitly excluded work',
  'Pending work',
  'Rollback plan',
  'Official references',
]
let previousIndex = -1
for (const section of requiredSections) {
  const heading = `## ${section}`
  const index = document.indexOf(heading)
  if (index === -1) {
    errors.push(`${documentPath}: missing required text: ${heading}`)
  } else if (index <= previousIndex) {
    errors.push(`${documentPath}: section is out of order: ${heading}`)
  } else {
    previousIndex = index
  }
}

const compactDocument = document.replace(/\s+/gu, ' ')
for (const text of [
  '# AdMob Privacy Options UI Contract',
  '개인정보 및 쿠키 설정',
  "privacyOptionsRequirementStatus === 'REQUIRED'",
  '`SettingsPage` is the single canonical entry point',
  'UMP values are not copied into localStorage',
  'does not mutate `consentPreferences.ads`',
  'Future ad request/load/show code must independently require both',
  'showPrivacyOptionsForm(): Promise<void>',
  'requestConsentInfo(options?): Promise<AdmobConsentInfo>',
  'Candidate A is selected',
  'does not call `showConsentForm` after refresh',
  'adGateOpen: false',
  'initialize-once',
  'return that same Promise',
  'Web, Vercel, PWA, iOS, and every non-Android runtime',
  'perform zero plugin calls',
  'Production ad units: 0',
  'Ad request/load/show implementation: Not started',
  'privacy-options UI implementation remains Pending',
  'APK installation and device QA are Not performed',
  'App state initializes from getAdmobRuntimeConsentSnapshot',
  'App effect re-reads current snapshot',
  'App subscribes for future snapshots',
  'Late subscribers must not miss completed bootstrap state',
  'subscribe does not replay current snapshot',
  'Bootstrap is not restarted from App',
  'bootstrap completes before App mount (late subscriber)',
  'React StrictMode effect re-registration leaves no duplicate listener',
]) {
  requireText(compactDocument, text)
}

const forbiddenContractMeanings = [
  'privacy-options entry is always visible',
  'show the entry for NOT_REQUIRED',
  'show the entry for UNKNOWN',
  'use consentPreferences.ads as the UMP value',
  'copy UMP values into localStorage',
  'keep adGateOpen true after revocation',
  'privacy-options UI implementation: Completed',
  'Actual ad request/load/show: Completed',
  'App uses subscribe only',
  'App waits for the next publish',
  'App starts bootstrap again to obtain the snapshot',
  'localStorage supplies the AdMob runtime snapshot',
  'subscribe automatically replays the current snapshot',
]
for (const meaning of forbiddenContractMeanings) {
  if (compactDocument.includes(meaning)) {
    errors.push(`${documentPath}: forbidden contract meaning: ${meaning}`)
  }
}

const payloadPaths = [...allowedFiles].filter((path) => path !== checkerPath)
const payloadPathsToScan = creationMode
  ? payloadPaths.filter((path) => changedFiles.has(path))
  : [documentPath]
const checkedPayload = payloadPathsToScan.map((path) => read(path)).join('\n')
const nonContractPayload = creationMode
  ? payloadPaths
      .filter((path) => path !== documentPath && changedFiles.has(path))
      .map((path) => read(path))
      .join('\n')
  : ''
const checkerSource = read(checkerPath)
const textQualityPayload = `${checkedPayload}\n${checkerSource}`

if (textQualityPayload.includes('\uFFFD')) {
  errors.push('text quality: Unicode replacement character U+FFFD found')
}
const knownMojibake = [
  ['媛쒖씤', '?뺣낫'].join(''),
  ['荑좏궎', '?ㅼ젙'].join(''),
  ['?대쾲', ' PR'].join(''),
]
for (const marker of knownMojibake) {
  if (textQualityPayload.includes(marker)) {
    errors.push(`text quality: known mojibake found: ${marker}`)
  }
}

if (/ca-app-pub-\d+~\d+/u.test(checkedPayload)) {
  errors.push('content safety: an AdMob App ID was added')
}
if (/ca-app-pub-\d+\/\d+/u.test(checkedPayload)) {
  errors.push('content safety: an ad unit ID was added')
}
if (/\b[A-F0-9]{32}\b/u.test(checkedPayload)) {
  errors.push('content safety: a test-device identifier was added')
}
const markerTokens = [
  ['YOUR', 'ADMOB', 'APP', 'ID'].join('_'),
  ['REPLACE', 'ME'].join('_'),
  ['SAMPLE', 'APP', 'ID'].join('_'),
  ['TEST', 'DEVICE', 'HASHED', 'ID'].join('-'),
]
for (const token of markerTokens) {
  if (checkedPayload.includes(token)) {
    errors.push(`content safety: forbidden placeholder or test marker: ${token}`)
  }
}

if (/debugGeography\s*[:=]/u.test(nonContractPayload)) {
  errors.push('docs/check-only scope: debugGeography configuration was added')
}
const forbiddenRuntimeCalls = [
  ['AdMob', 'showPrivacyOptionsForm'].join('.'),
  ['AdMob', 'requestConsentInfo'].join('.'),
  ['AdMob', 'initialize'].join('.'),
]
for (const callName of forbiddenRuntimeCalls) {
  const escaped = callName.replace('.', '\\.')
  if (new RegExp(`${escaped}\\s*\\(`, 'u').test(nonContractPayload)) {
    errors.push(`docs/check-only scope: runtime call outside contract document: ${callName}`)
  }
}
if (/\b(?:request|load|show)(?:Banner|Interstitial|Rewarded|Ad)\s*\(/u.test(nonContractPayload)) {
  errors.push('docs/check-only scope: advertising request/load/show code was added')
}

if (errors.length) {
  console.error('AdMob privacy options UI contract check failed.')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}
console.log(
  `AdMob privacy options UI contract check passed (${creationMode ? 'creation' : 'post-merge'} mode)`,
)
