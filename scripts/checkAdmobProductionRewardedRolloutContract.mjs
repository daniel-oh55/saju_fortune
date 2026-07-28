import { execFileSync, spawnSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const documentPath = 'docs/ADMOB_PRODUCTION_REWARDED_ROLLOUT_CONTRACT.md'
const checkerPath = 'scripts/checkAdmobProductionRewardedRolloutContract.mjs'
const scriptName = 'check:admob-production-rewarded-rollout-contract'
const expectedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  documentPath,
  checkerPath,
])
const preservedUntrackedFiles = new Set(['pr405-review.json', 'pr405.diff'])
const protectedPaths = [
  'src',
  'android',
  'ios',
  'public',
  '.github/workflows',
  'package.json',
  'package-lock.json',
  'capacitor.config.json',
  'capacitor.config.js',
  'capacitor.config.ts',
  'vite.config.js',
  'vite.config.ts',
]
const requiredHeadings = [
  '## 1. Purpose and scope',
  '## 2. Current merged baseline',
  '## 3. Test and production separation',
  '## 4. AdMob identifier types',
  '## 5. Production rewarded ad unit creation prerequisites',
  '## 6. AdMob Console creation procedure',
  '## 7. Required user-supplied values',
  '## 8. Production configuration design',
  '## 9. Build-mode matrix',
  '## 10. Fail-closed requirements',
  '## 11. Consent and privacy requirements',
  '## 12. Google Play disclosure impact',
  '## 13. Source implementation plan',
  '## 14. CI and release configuration plan',
  '## 15. Production device QA plan',
  '## 16. Failure and rollback plan',
  '## 17. Blocking conditions',
  '## 18. Explicitly excluded work',
  '## 19. Pending work',
  '## 20. Completion criteria',
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
const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
const validPackageMap = (value) =>
  isPlainObject(value) &&
  Object.entries(value).every(
    ([name, version]) => name.length > 0 && typeof version === 'string' && version.length > 0,
  )
const run = (command, args, cwd = root) =>
  spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
  })
const assertSuccessfulCheck = (result, label) => {
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
  if (result.status !== 0) throw new Error(`${label}: expected Pass\n${output}`)
  console.log(`PASS lifecycle: ${label}`)
}
const assertRejectedCheck = (result, label, expected) => {
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
  if (result.status === 0 || !output.includes(expected)) {
    throw new Error(`${label}: expected rejection containing "${expected}"\n${output}`)
  }
  console.log(`PASS lifecycle: ${label}`)
}
const writeFixture = (fixtureRoot, path, content) => {
  const target = resolve(fixtureRoot, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}
const runLifecycleSelfTest = () => {
  const temporaryRoot = mkdtempSync(join(tmpdir(), 'admob-rollout-lifecycle-'))
  const fixtureRoot = resolve(temporaryRoot, 'repository')
  const currentHead = git('rev-parse', 'HEAD').trim()

  try {
    const clone = run(
      'git',
      [
        '-c',
        'safe.directory=*',
        'clone',
        '--quiet',
        '--no-hardlinks',
        '--no-checkout',
        root,
        fixtureRoot,
      ],
      temporaryRoot,
    )
    if (clone.status !== 0) {
      throw new Error(`lifecycle fixture clone failed\n${clone.stdout ?? ''}\n${clone.stderr ?? ''}`)
    }

    execFileSync('git', ['config', 'core.autocrlf', 'false'], { cwd: fixtureRoot })
    execFileSync('git', ['checkout', '--quiet', '-b', 'readiness-transition', currentHead], {
      cwd: fixtureRoot,
    })
    for (const path of expectedFiles) {
      writeFixture(fixtureRoot, path, readFileSync(resolve(root, path)))
    }
    execFileSync('git', ['config', 'user.name', 'Rollout Contract Self-Test'], { cwd: fixtureRoot })
    execFileSync('git', ['config', 'user.email', 'rollout-self-test@example.invalid'], {
      cwd: fixtureRoot,
    })
    if (run('git', ['status', '--porcelain'], fixtureRoot).stdout.trim()) {
      execFileSync('git', ['add', '--', ...expectedFiles], { cwd: fixtureRoot })
      execFileSync('git', ['commit', '--quiet', '-m', 'fixture: current transition tree'], {
        cwd: fixtureRoot,
      })
    }

    const check = () => run(process.execPath, [resolve(fixtureRoot, checkerPath)], fixtureRoot)
    assertSuccessfulCheck(check(), 'A. PR #413 readiness transition exact-five scope')

    const transitionMutations = [
      [
        'A. transition source mutation rejected',
        'src/services/rewardedAdProvider.sdk.js',
        '\n// lifecycle source probe\n',
        'forbidden protected path changed',
      ],
      [
        'A. transition Android mutation rejected',
        'android/app/src/main/AndroidManifest.xml',
        '\n<!-- lifecycle Android probe -->\n',
        'forbidden protected path changed',
      ],
      [
        'A. transition workflow mutation rejected',
        '.github/workflows/android-debug-build.yml',
        '\n# lifecycle workflow probe\n',
        'forbidden protected path changed',
      ],
    ]
    for (const [label, path, suffix, expected] of transitionMutations) {
      const target = resolve(fixtureRoot, path)
      const original = readFileSync(target)
      try {
        writeFileSync(target, Buffer.concat([original, Buffer.from(suffix)]))
        assertRejectedCheck(check(), label, expected)
      } finally {
        writeFileSync(target, original)
      }
      if (!readFileSync(target).equals(original)) {
        throw new Error(`${label}: fixture content was not restored exactly`)
      }
    }

    const packagePath = resolve(fixtureRoot, 'package.json')
    const originalPackage = readFileSync(packagePath)
    try {
      const packageJson = JSON.parse(originalPackage.toString('utf8'))
      packageJson.scripts['check:lifecycle-package-probe'] = 'node --version'
      writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`)
      assertRejectedCheck(check(), 'A. transition package mutation rejected', 'scripts changed')
    } finally {
      writeFileSync(packagePath, originalPackage)
    }
    if (!readFileSync(packagePath).equals(originalPackage)) {
      throw new Error('A. transition package mutation: fixture content was not restored exactly')
    }

    const finalTransitionHead = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: fixtureRoot,
      encoding: 'utf8',
    }).trim()
    execFileSync('git', ['update-ref', 'refs/remotes/origin/main', finalTransitionHead], {
      cwd: fixtureRoot,
    })
    assertSuccessfulCheck(check(), 'B. post-merge main simulation with zero committed diff')

    execFileSync('git', ['checkout', '--quiet', '-b', 'future-unrelated'], { cwd: fixtureRoot })
    writeFixture(fixtureRoot, 'notes/unrelated-follow-up.md', '# Unrelated follow-up fixture\n')
    execFileSync('git', ['add', '--', 'notes/unrelated-follow-up.md'], { cwd: fixtureRoot })
    execFileSync('git', ['commit', '--quiet', '-m', 'fixture: unrelated follow-up'], {
      cwd: fixtureRoot,
    })
    assertSuccessfulCheck(check(), 'C. future unrelated PR simulation')

    execFileSync('git', ['checkout', '--quiet', '--detach', 'origin/main'], { cwd: fixtureRoot })
    execFileSync('git', ['checkout', '--quiet', '-b', 'future-production'], { cwd: fixtureRoot })
    writeFixture(
      fixtureRoot,
      'src/config/rewardedAdProductionFixture.js',
      'export const productionFixtureConfigured = false\n',
    )
    const futurePackageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
    futurePackageJson.scripts['check:future-production-fixture'] = 'node --version'
    writeFileSync(packagePath, `${JSON.stringify(futurePackageJson, null, 2)}\n`)
    execFileSync(
      'git',
      [
        'add',
        '--',
        'src/config/rewardedAdProductionFixture.js',
        'package.json',
      ],
      { cwd: fixtureRoot },
    )
    execFileSync('git', ['commit', '--quiet', '-m', 'fixture: approved production follow-up'], {
      cwd: fixtureRoot,
    })
    assertSuccessfulCheck(check(), 'D. future approved production implementation simulation')

    console.log('AdMob rollout lifecycle verification passed (scenarios 4/4)')
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true })
  }
}

const lifecycleSelfTestRequested = process.argv.includes('--lifecycle-self-test')
const negativeSelfTestRequested = process.argv.includes('--negative-self-test')
if (lifecycleSelfTestRequested || negativeSelfTestRequested) {
  runLifecycleSelfTest()
}
if (lifecycleSelfTestRequested && !negativeSelfTestRequested) {
  process.exit(0)
}

if (negativeSelfTestRequested) {
  const append = (path, text) => writeFileSync(resolve(root, path), `${read(path)}${text}`, 'utf8')
  const replace = (path, from, to) => {
    const content = read(path)
    if (!content.includes(from)) throw new Error(`self-test fixture missing: ${from}`)
    writeFileSync(resolve(root, path), content.replace(from, to), 'utf8')
  }
  const cases = [
    [
      'Console creation regression',
      () => replace(documentPath, 'AdMob Console creation: Completed', 'AdMob Console creation: Not performed'),
      'forbidden state regression',
    ],
    [
      'production ad unit regression',
      () => replace(documentPath, 'Production rewarded ad unit: Created', 'Production rewarded ad unit: Pending'),
      'forbidden state regression',
    ],
    [
      'owner-supplied ID regression',
      () => replace(documentPath, 'Production ad unit ID supplied by owner: Yes', 'Production ad unit ID supplied by owner: No'),
      'forbidden state regression',
    ],
    [
      'App ID used for ad request',
      () => append(documentPath, '\nUse an AdMob App ID for rewarded ad requests.\n'),
      'forbidden contract meaning',
    ],
    [
      'tilde described as ad unit format',
      () => append(documentPath, '\nThe `~` form is the ad unit ID format.\n'),
      'forbidden contract meaning',
    ],
    [
      'slash described as App ID format',
      () => append(documentPath, '\nThe `/` form is the App ID format.\n'),
      'forbidden contract meaning',
    ],
    [
      'concrete production identifier',
      () => append(documentPath, '\nca-app-pub-1234567890123456/1234567890\n'),
      'concrete AdMob ad unit ID',
    ],
    [
      'production source connection false completion',
      () => replace(documentPath, 'Production source connection: Not started', 'Production source connection: Completed'),
      'forbidden completion claim',
    ],
    [
      'production request load show false completion',
      () => replace(documentPath, 'Production request/load/show: Not started', 'Production request/load/show: Completed'),
      'forbidden completion claim',
    ],
    [
      'production serving false completion',
      () => replace(documentPath, 'Production serving: Not started', 'Production serving: Completed'),
      'forbidden completion claim',
    ],
    [
      'Privacy Data Safety false completion',
      () => replace(documentPath, 'Privacy/Data Safety final review: Pending', 'Privacy/Data Safety final review: Completed'),
      'forbidden completion claim',
    ],
    [
      'release signing AAB false completion',
      () => replace(documentPath, 'Release signing/AAB: Pending', 'Release signing/AAB: Completed'),
      'forbidden completion claim',
    ],
    [
      'production device QA false completion',
      () => replace(documentPath, 'Production device QA: Not started', 'Production device QA: Completed'),
      'forbidden completion claim',
    ],
    [
      'Play Console upload false completion',
      () => replace(documentPath, 'Play Console release upload: Not started', 'Play Console release upload: Completed'),
      'forbidden completion claim',
    ],
    [
      'official test ID used in production',
      () => append(documentPath, '\nUse the Google official Rewarded Test Ad unit ID in production.\n'),
      'forbidden contract meaning',
    ],
    [
      'debug geography',
      () => append(documentPath, '\ndebugGeography: EEA\n'),
      'debugGeography',
    ],
    [
      'test device identifier',
      () => append(documentPath, '\ntestDeviceIdentifier: ABCDEF\n'),
      'testDeviceIdentifier',
    ],
    [
      'SDK-to-mock fallback allowed',
      () => append(documentPath, '\nSDK-to-mock fallback is allowed.\n'),
      'forbidden contract meaning',
    ],
    [
      'unlock without reward',
      () => append(documentPath, '\nUnlock without a valid reward is allowed.\n'),
      'forbidden contract meaning',
    ],
    [
      'storage key change allowed',
      () => append(documentPath, '\nChanging an existing localStorage key is allowed.\n'),
      'forbidden contract meaning',
    ],
    [
      'source change',
      () => append('src/services/rewardedAdProvider.sdk.js', '\n// rollout probe\n'),
      'forbidden protected path changed',
    ],
    [
      'Android native change',
      () => append('android/app/src/main/AndroidManifest.xml', '\n<!-- rollout probe -->\n'),
      'forbidden protected path changed',
    ],
    [
      'workflow change',
      () => append('.github/workflows/android-debug-build.yml', '\n# rollout probe\n'),
      'forbidden protected path changed',
    ],
    [
      'required section deletion',
      () => replace(documentPath, '## 10. Fail-closed requirements', '### Fail-closed notes'),
      'required section missing',
    ],
    [
      'required section order change',
      () => replace(
        documentPath,
        '## 8. Production configuration design',
        '## 10. Fail-closed requirements (moved)\n\n## 8. Production configuration design',
      ),
      'required section order',
    ],
  ]
  const pathsToRestore = [
    documentPath,
    'src/services/rewardedAdProvider.sdk.js',
    'android/app/src/main/AndroidManifest.xml',
    '.github/workflows/android-debug-build.yml',
  ]
  const originalContents = new Map(
    pathsToRestore.map((path) => [path, readFileSync(resolve(root, path))]),
  )
  let mutationPasses = 0
  for (const [name, mutate, expected] of cases) {
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
      for (const [path, content] of originalContents) {
        writeFileSync(resolve(root, path), content)
        if (!readFileSync(resolve(root, path)).equals(content)) {
          throw new Error(`${name}: ${path} was not restored exactly`)
        }
      }
    }
  }
  console.log(
    `AdMob production rewarded rollout contract negative verification passed (mutations ${mutationPasses}/${cases.length})`,
  )
  process.exit(0)
}

if (!existsSync(resolve(root, documentPath))) {
  console.error(`AdMob production rewarded rollout contract check failed\n- missing ${documentPath}`)
  process.exit(1)
}

const packageJson = JSON.parse(read('package.json'))
if (packageJson.scripts?.[scriptName] !== `node ${checkerPath}`) {
  errors.push(`package.json: incorrect ${scriptName} command`)
}
if (!validPackageMap(packageJson.dependencies)) errors.push('package.json: invalid dependencies map')
if (!validPackageMap(packageJson.devDependencies)) errors.push('package.json: invalid devDependencies map')

const document = read(documentPath)
const compactDocument = document.replace(/\s+/gu, ' ')
const baseDocument = git('show', `origin/main:${documentPath}`)
const readinessTransitionMode =
  baseDocument.includes('Production rewarded ad unit: Pending') &&
  baseDocument.includes('Production ad unit ID: None') &&
  baseDocument.includes('AdMob Console creation: Not performed') &&
  document.includes('Production rewarded ad unit: Created') &&
  document.includes('Production ad unit ID supplied by owner: Yes') &&
  document.includes('AdMob Console creation: Completed')

if (readinessTransitionMode) {
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

  for (const path of changedFiles) {
    if (!expectedFiles.has(path)) errors.push(`change scope: unexpected changed file: ${path}`)
  }
  for (const path of expectedFiles) {
    if (!changedFiles.has(path)) errors.push(`change scope: expected changed file is missing: ${path}`)
  }

  const trackedFiles = new Set(lines('ls-files'))
  for (const path of preservedUntrackedFiles) {
    if (committedChanges.includes(path) || stagedChanges.includes(path) || trackedFiles.has(path)) {
      errors.push(`preserved local file must remain untracked and uncommitted: ${path}`)
    }
  }

  for (const path of protectedPaths) {
    const normalizedPath = path.replaceAll('\\', '/')
    if (
      [...changedFiles].some(
        (changed) => changed === normalizedPath || changed.startsWith(`${normalizedPath}/`),
      )
    ) {
      errors.push(`docs/check-only scope: forbidden protected path changed: ${path}`)
    }
  }
  const protectedDiff = lines('diff', '--name-only', 'origin/main', '--', ...protectedPaths)
  if (protectedDiff.length) {
    errors.push(`docs/check-only scope: protected diff exists: ${protectedDiff.join(', ')}`)
  }

  const basePackageJson = JSON.parse(git('show', 'origin/main:package.json'))
  if (JSON.stringify(packageJson.scripts) !== JSON.stringify(basePackageJson.scripts)) {
    errors.push('package.json: scripts changed')
  }
  if (JSON.stringify(packageJson.dependencies) !== JSON.stringify(basePackageJson.dependencies)) {
    errors.push('package.json: dependencies changed')
  }
  if (JSON.stringify(packageJson.devDependencies) !== JSON.stringify(basePackageJson.devDependencies)) {
    errors.push('package.json: devDependencies changed')
  }
}

let priorHeadingIndex = -1
for (const heading of requiredHeadings) {
  const headingIndex = document.indexOf(heading)
  if (headingIndex === -1) {
    errors.push(`required section missing: ${heading}`)
  } else if (headingIndex <= priorHeadingIndex) {
    errors.push(`required section order is incorrect at: ${heading}`)
  }
  priorHeadingIndex = headingIndex
}

for (const text of [
  '`@capacitor-community/admob` 8.0.0',
  'Actual early-dismiss device QA',
  'Repeated ADB listener-accumulation diagnostics',
  '`ca-app-pub-숫자~숫자`',
  '`ca-app-pub-숫자/숫자`',
  'The `~` separator identifies an App ID',
  'the `/` separator identifies an ad unit ID',
  'Google official Rewarded Test Ad unit ID',
  'must never be used by a production build',
  'harupuli_rewarded_detail_unlock_android',
  'AdMob Console creation: Completed',
  'Production rewarded ad unit creation: Completed',
  'Production rewarded ad unit: Created',
  'Production ad unit ID supplied by owner: Yes',
  'Production ad unit ID: Supplied by owner and held out of repository',
  'Production ad unit ID format validation: Pass',
  'Production ad unit ID format: Valid `/` form',
  'Exact production ad unit ID committed to repository: No',
  'Production source connection: Not started',
  'Production request/load/show: Not started',
  'Production serving: Not started',
  'Privacy/Data Safety final review: Pending',
  'Release signing/AAB: Pending',
  'Production device QA: Not started',
  'Play Console release upload: Not started',
  'Manage the production ID in exactly one configuration source.',
  'Fail closed if release mode receives a test ID.',
  'Fail closed if debug mode receives a production ID.',
  'Fail closed when the production ID is missing or malformed.',
  'Fail closed when an App ID is supplied as an ad unit ID.',
  'Prohibit SDK-to-mock fallback.',
  'Treat only a valid reward result as unlock authority.',
  'Preserve exactly-once settlement',
  'Keep every existing localStorage key and stored shape unchanged.',
  'Preserve existing mock behavior.',
  'Preserve the existing UMP runtime and local consent dual gate',
  '| Web / Vercel | Mock or no-op | Prohibited |',
  '| Standard Android Debug | Existing mock | Production request prohibited |',
  '| Dedicated Rewarded Test Debug | Google official test ad; `isTesting: true` |',
  '| Android Release before production configuration | None | 0 requests | Fail closed |',
  'Actual production Rewarded ad unit; `isTesting: false`',
  'Privacy policy wording related to the advertising SDK',
  'Google Play Data safety form',
  'EEA/UK/Switzerland UMP messaging',
  '`src/config/rewardedAdSdkConfig.js`',
  '`src/services/rewardedAdProvider.loader.js`',
  '`src/services/rewardedAdProvider.sdk.js`',
  'No production source or Android native file is changed',
  'No workflow or release environment configuration is changed',
]) {
  requireText(compactDocument, text)
}

for (const [meaning, label] of [
  ['Use an AdMob App ID for rewarded ad requests.', 'App ID request misuse'],
  ['The `~` form is the ad unit ID format.', 'tilde format misuse'],
  ['The `/` form is the App ID format.', 'slash format misuse'],
  ['Use the Google official Rewarded Test Ad unit ID in production.', 'test ID production misuse'],
  ['SDK-to-mock fallback is allowed.', 'SDK-to-mock fallback'],
  ['Unlock without a valid reward is allowed.', 'unlock without reward'],
  ['Changing an existing localStorage key is allowed.', 'storage key mutation'],
]) {
  if (document.includes(meaning)) errors.push(`forbidden contract meaning: ${label}`)
}

for (const claim of [
  'Production source connection: Completed',
  'Production request/load/show: Completed',
  'Production serving: Completed',
  'Privacy/Data Safety final review: Completed',
  'Release signing/AAB: Completed',
  'Production device QA: Completed',
  'Play Console release upload: Completed',
  'Google Play disclosure: Completed',
  'Production serving enabled',
  'Ready for production',
]) {
  if (document.includes(claim)) errors.push(`forbidden completion claim: ${claim}`)
}

for (const regression of [
  'AdMob Console creation: Not performed',
  'Production rewarded ad unit: Pending',
  'Production ad unit ID supplied by owner: No',
  'Production ad unit ID: None',
]) {
  if (document.includes(regression)) errors.push(`forbidden state regression: ${regression}`)
}

const checkedContent = [
  document,
  read('DEVELOPMENT_LOG.md'),
  read('TODO.md'),
  read('CHANGELOG.md'),
].join('\n')
if (/\bca-app-pub-\d{16}\/\d{10}\b/u.test(checkedContent)) {
  errors.push('identifier safety: concrete AdMob ad unit ID is prohibited')
}
for (const token of ['debugGeography', 'testDeviceIdentifier']) {
  if (checkedContent.includes(token)) errors.push(`identifier safety: ${token} is prohibited`)
}
if (checkedContent.includes('\uFFFD')) {
  errors.push('encoding safety: U+FFFD replacement character')
}
for (const mojibake of ['媛쒖', '?뺣낫', '吏', '?묒뾽']) {
  if (checkedContent.includes(mojibake)) {
    errors.push(`encoding safety: known mojibake: ${mojibake}`)
  }
}

for (const [path, snippets] of [
  ['DEVELOPMENT_LOG.md', [
    '2026-07-28 AdMob Production Rewarded Unit Readiness',
    'Status: Docs/check-only',
    'Production rewarded ad unit: Created',
    'Production ad unit ID supplied by owner: Yes',
    'Production source connection: Not started',
  ]],
  ['TODO.md', [
    'PR #413 - AdMob Production Rewarded Unit Readiness TODO',
    'Record the completed production Rewarded ad unit creation',
    'Implement production source connection in a separate approved PR',
  ]],
  ['CHANGELOG.md', [
    'PR #413 - AdMob Production Rewarded Unit Readiness',
    'Recorded the owner-completed production Rewarded ad unit creation',
    'Production source connection, request/load/show, and serving',
  ]],
]) {
  const content = read(path)
  for (const snippet of snippets) requireText(content, snippet, path)
}

if (errors.length) {
  console.error('AdMob production rewarded rollout contract check failed')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(
  `AdMob production rewarded rollout contract check passed (mode ${
    readinessTransitionMode ? 'readiness-transition' : 'canonical'
  }; sections ${requiredHeadings.length}/${requiredHeadings.length})`,
)
