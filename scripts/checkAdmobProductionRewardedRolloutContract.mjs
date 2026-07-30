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
const projectStatePath = 'docs/PROJECT_STATE.md'
const checkerPath = 'scripts/checkAdmobProductionRewardedRolloutContract.mjs'
const scriptName = 'check:admob-production-rewarded-rollout-contract'
const fixtureFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  documentPath,
  projectStatePath,
  checkerPath,
])
const canonicalInternalTestRolloutState = [
  'Production source connection capability: Implemented',
  'Production Rewarded release workflow injection support: Implemented',
  'Release environment preflight support: Implemented',
  'GitHub Secret actual value configuration: Completed',
  'Production-configured release workflow run: Completed',
  'Production-configured registered-test-device request/load/show: Pass - Test Ad',
  'Production-configured internal-test device QA: Pass',
  'Exactly-once reward: Pass',
  'Production-configured internal-test offline failure/recovery: Not performed / Pending',
  'Privacy/Data Safety final review: Completed',
  'External public privacy policy final review: Completed',
  'Advertising disclosure final review: Completed',
  'Existing release signing infrastructure: Confirmed',
  'Existing signed AAB workflow: Confirmed',
  'Production Rewarded-configured signed AAB: Completed',
  'Play Console internal-testing AAB upload: Completed',
  'Actual general-user production serving: Not started',
  'General-user Production update: Not started',
  'Play Console Production-track upload: Not started',
  'Actual production-serving device QA: Not started',
  'Actual advertisement revenue: Not verified',
  'Rollout monitoring and rollback operational verification: Pending',
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
const assertSuccessfulCheck = (result, label, expectedMode) => {
  const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
  if (result.status !== 0) throw new Error(`${label}: expected Pass\n${output}`)
  if (!output.includes(`mode ${expectedMode}`)) {
    throw new Error(`${label}: expected mode ${expectedMode}\n${output}`)
  }
  console.log(output.trim())
  console.log(`PASS lifecycle: ${label}`)
}
const writeFixture = (fixtureRoot, path, content) => {
  const target = resolve(fixtureRoot, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}
const createSyntheticInternalTestRolloutFixture = () => {
  const temporaryRoot = mkdtempSync(join(tmpdir(), 'admob-rollout-lifecycle-'))
  const fixtureRoot = resolve(temporaryRoot, 'repository')

  try {
    const sourceCommit = git('rev-parse', 'HEAD').trim()
    const canonicalFiles = new Map(
      [...fixtureFiles].map((path) => [path, Buffer.from(read(path), 'utf8')]),
    )
    const currentDocument = canonicalFiles.get(documentPath).toString('utf8')
    if (!canonicalInternalTestRolloutState.every((state) => currentDocument.includes(state))) {
      throw new Error('current rollout contract does not contain the canonical internal-test rollout state')
    }

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
    execFileSync(
      'git',
      ['checkout', '--quiet', '-b', 'internal-test-rollout-lifecycle', sourceCommit],
      { cwd: fixtureRoot },
    )
    execFileSync('git', ['config', 'user.name', 'Rollout Contract Self-Test'], { cwd: fixtureRoot })
    execFileSync('git', ['config', 'user.email', 'rollout-self-test@example.invalid'], {
      cwd: fixtureRoot,
    })

    for (const [path, content] of canonicalFiles) writeFixture(fixtureRoot, path, content)
    const staleDocument = currentDocument
      .replace(
        'GitHub Secret actual value configuration: Completed',
        'GitHub Secret actual value configuration: Not started',
      )
      .replace(
        'Production-configured release workflow run: Completed',
        'Production-configured release workflow run: Not started',
      )
    if (staleDocument === currentDocument) {
      throw new Error('synthetic stale baseline did not change the canonical rollout state')
    }
    writeFixture(fixtureRoot, documentPath, staleDocument)
    execFileSync('git', ['add', '--', ...fixtureFiles], { cwd: fixtureRoot })
    execFileSync('git', ['commit', '--quiet', '-m', 'fixture: synthetic stale rollout baseline'], {
      cwd: fixtureRoot,
    })
    const baselineCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: fixtureRoot,
      encoding: 'utf8',
    }).trim()
    execFileSync('git', ['update-ref', 'refs/remotes/origin/main', baselineCommit], {
      cwd: fixtureRoot,
    })

    for (const [path, content] of canonicalFiles) writeFixture(fixtureRoot, path, content)
    execFileSync('git', ['add', '--', ...fixtureFiles], { cwd: fixtureRoot })
    execFileSync('git', ['commit', '--quiet', '-m', 'fixture: synthetic internal-test rollout'], {
      cwd: fixtureRoot,
    })
    const syntheticTransitionHead = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: fixtureRoot,
      encoding: 'utf8',
    }).trim()
    if (syntheticTransitionHead === baselineCommit) {
      throw new Error('internal-test rollout baseline and synthetic HEAD must differ')
    }
    const transitionPaths = execFileSync(
      'git',
      ['diff', '--name-only', `${baselineCommit}..${syntheticTransitionHead}`],
      { cwd: fixtureRoot, encoding: 'utf8' },
    ).replace(/\r\n/g, '\n').trim().split('\n').filter(Boolean)
    if (![documentPath, projectStatePath].some((path) => transitionPaths.includes(path))) {
      throw new Error(
        `synthetic transition does not include a rollout state file\n${transitionPaths.join('\n')}`,
      )
    }
    const substantiveTransition = run(
      'git',
      [
        'diff',
        '--quiet',
        '--ignore-space-at-eol',
        baselineCommit,
        syntheticTransitionHead,
        '--',
        documentPath,
        projectStatePath,
      ],
      fixtureRoot,
    )
    if (substantiveTransition.status !== 1) {
      throw new Error(
        `synthetic transition must contain a non-line-ending state change (git status ${substantiveTransition.status})`,
      )
    }
    const fixtureStatus = execFileSync('git', ['status', '--porcelain'], {
      cwd: fixtureRoot,
      encoding: 'utf8',
    }).trim()
    if (fixtureStatus) {
      throw new Error(`synthetic transition checkout is not clean\n${fixtureStatus}`)
    }
    return {
      fixtureRoot,
      baselineCommit,
      syntheticTransitionHead,
      temporaryRoot,
    }
  } catch (error) {
    rmSync(temporaryRoot, { recursive: true, force: true })
    throw error
  }
}
const runLifecycleSelfTest = () => {
  const {
    fixtureRoot,
    baselineCommit,
    syntheticTransitionHead,
    temporaryRoot,
  } = createSyntheticInternalTestRolloutFixture()

  try {
    console.log(`Internal-test rollout fixture baseline commit: ${baselineCommit}`)
    const check = () => run(process.execPath, [resolve(fixtureRoot, checkerPath)], fixtureRoot)
    assertSuccessfulCheck(
      check(),
      'A. current canonical internal-test rollout state (mode canonical)',
      'canonical',
    )

    const packagePath = resolve(fixtureRoot, 'package.json')

    execFileSync('git', ['update-ref', 'refs/remotes/origin/main', syntheticTransitionHead], {
      cwd: fixtureRoot,
    })
    const postMergeCommittedDiff = run(
      'git',
      ['diff', '--name-only', 'origin/main...HEAD'],
      fixtureRoot,
    ).stdout.trim()
    if (postMergeCommittedDiff) {
      throw new Error(`B. post-merge main simulation: expected zero committed diff\n${postMergeCommittedDiff}`)
    }
    assertSuccessfulCheck(
      check(),
      'B. post-merge main simulation with zero committed diff (mode canonical)',
      'canonical',
    )

    execFileSync('git', ['checkout', '--quiet', '-b', 'future-unrelated'], { cwd: fixtureRoot })
    writeFixture(fixtureRoot, 'notes/unrelated-follow-up.md', '# Unrelated follow-up fixture\n')
    execFileSync('git', ['add', '--', 'notes/unrelated-follow-up.md'], { cwd: fixtureRoot })
    execFileSync('git', ['commit', '--quiet', '-m', 'fixture: unrelated follow-up'], {
      cwd: fixtureRoot,
    })
    assertSuccessfulCheck(
      check(),
      'C. future unrelated PR simulation (mode canonical)',
      'canonical',
    )

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
    assertSuccessfulCheck(
      check(),
      'D. future approved production implementation simulation (mode canonical)',
      'canonical',
    )

    execFileSync('git', ['checkout', '--quiet', '--detach', 'origin/main'], { cwd: fixtureRoot })
    execFileSync('git', ['checkout', '--quiet', '-b', 'future-rolling-state'], {
      cwd: fixtureRoot,
    })
    const projectStateFixturePath = resolve(fixtureRoot, projectStatePath)
    const currentProjectState = readFileSync(projectStateFixturePath, 'utf8')
    const rollingMetadataUpdates = [
      ['- 기준일: 2026-07-29', '- 기준일: 2026-07-30'],
      ['- Android versionCode: 2', '- Android versionCode: 3'],
      ['- Android versionName: 1.0.1', '- Android versionName: 1.0.2'],
      ['- 작업 시작 전 Open PR: 없음', '- 작업 시작 전 Open PR: #421 (Draft/Open)'],
    ]
    const futureProjectState = rollingMetadataUpdates.reduce((content, [from, to]) => {
      if (!content.includes(from)) throw new Error(`rolling-state fixture missing: ${from}`)
      return content.replace(from, to)
    }, currentProjectState)
    writeFileSync(projectStateFixturePath, futureProjectState)
    execFileSync('git', ['add', '--', projectStatePath], { cwd: fixtureRoot })
    execFileSync('git', ['commit', '--quiet', '-m', 'fixture: synthetic future rolling state'], {
      cwd: fixtureRoot,
    })
    assertSuccessfulCheck(
      check(),
      'E. synthetic future rolling project metadata simulation (mode canonical)',
      'canonical',
    )

    console.log('AdMob rollout lifecycle verification passed (scenarios 5/5)')
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

const runNegativeMutationSelfTest = (fixtureRoot) => {
  const readFixture = (path) =>
    readFileSync(resolve(fixtureRoot, path), 'utf8').replace(/\r\n/g, '\n')
  const append = (path, text) =>
    writeFileSync(resolve(fixtureRoot, path), `${readFixture(path)}${text}`, 'utf8')
  const replace = (path, from, to) => {
    const content = readFixture(path)
    if (!content.includes(from)) throw new Error(`self-test fixture missing: ${from}`)
    writeFileSync(resolve(fixtureRoot, path), content.replace(from, to), 'utf8')
  }
  const syntheticConcreteId = [
    'ca-app-pub-',
    ['1234', '5678', '9012', '3456'].join(''),
    '/',
    ['12345', '67890'].join(''),
  ].join('')
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
      () => append(documentPath, `\n${syntheticConcreteId}\n`),
      'concrete AdMob ad unit ID',
    ],
    [
      'production source capability regression',
      () => replace(
        documentPath,
        'Production source connection capability: Implemented',
        'Production source connection capability: Not started',
      ),
      'forbidden state regression',
    ],
    [
      'release workflow injection regression',
      () => replace(
        documentPath,
        'Production Rewarded release workflow injection support: Implemented',
        'Production Rewarded release workflow injection support: Not started',
      ),
      'forbidden state regression',
    ],
    [
      'release preflight regression',
      () => replace(
        documentPath,
        'Release environment preflight support: Implemented',
        'Release environment preflight support: Not started',
      ),
      'forbidden state regression',
    ],
    [
      'publisher prefix verification regression',
      () => replace(
        documentPath,
        'App ID/ad-unit publisher prefix verification: Implemented',
        'App ID/ad-unit publisher prefix verification: Not started',
      ),
      'forbidden state regression',
    ],
    [
      'full provider release gate regression',
      () => replace(
        documentPath,
        'Full Rewarded provider checker before release build: Implemented',
        'Full Rewarded provider checker before release build: Not started',
      ),
      'forbidden state regression',
    ],
    [
      'GitHub Secret state regression',
      () => replace(
        documentPath,
        'GitHub Secret actual value configuration: Completed',
        'GitHub Secret actual value configuration: Not started',
      ),
      'forbidden state regression',
    ],
    [
      'production workflow run state regression',
      () => replace(
        documentPath,
        'Production-configured release workflow run: Completed',
        'Production-configured release workflow run: Not started',
      ),
      'forbidden state regression',
    ],
    [
      'production Rewarded AAB state regression',
      () => replace(
        documentPath,
        'Production Rewarded-configured signed AAB: Completed',
        'Production Rewarded-configured signed AAB: Not started',
      ),
      'forbidden state regression',
    ],
    [
      'internal-testing upload state regression',
      () => replace(
        documentPath,
        'Play Console internal-testing AAB upload: Completed',
        'Play Console internal-testing AAB upload: Not started',
      ),
      'forbidden state regression',
    ],
    [
      'Privacy Data Safety state regression',
      () => replace(
        documentPath,
        'Privacy/Data Safety final review: Completed',
        'Privacy/Data Safety final review: Pending',
      ),
      'forbidden state regression',
    ],
    [
      'external privacy policy state regression',
      () => replace(
        documentPath,
        'External public privacy policy final review: Completed',
        'External public privacy policy final review: Pending',
      ),
      'forbidden state regression',
    ],
    [
      'advertising disclosure state regression',
      () => replace(
        documentPath,
        'Advertising disclosure final review: Completed',
        'Advertising disclosure final review: Pending',
      ),
      'forbidden state regression',
    ],
    [
      'registered test-device QA state regression',
      () => replace(
        documentPath,
        'Production-configured registered-test-device request/load/show: Pass - Test Ad',
        'Production-configured registered-test-device request/load/show: Not started',
      ),
      'forbidden state regression',
    ],
    [
      'exactly-once reward state regression',
      () => replace(documentPath, 'Exactly-once reward: Pass', 'Exactly-once reward: Not started'),
      'forbidden state regression',
    ],
    [
      'production-configured internal-test offline QA false completion',
      () => replace(
        documentPath,
        'Production-configured internal-test offline failure/recovery: Not performed / Pending',
        'Production-configured internal-test offline failure/recovery: Pass',
      ),
      'forbidden completion claim',
    ],
    [
      'actual general-user serving false completion',
      () => replace(
        documentPath,
        'Actual general-user production serving: Not started',
        'Actual general-user production serving: Completed',
      ),
      'forbidden completion claim',
    ],
    [
      'general-user Production update false completion',
      () => replace(
        documentPath,
        'General-user Production update: Not started',
        'General-user Production update: Completed',
      ),
      'forbidden completion claim',
    ],
    [
      'Production-track upload false completion',
      () => replace(
        documentPath,
        'Play Console Production-track upload: Not started',
        'Play Console Production-track upload: Completed',
      ),
      'forbidden completion claim',
    ],
    [
      'actual production-serving device QA false completion',
      () => replace(
        documentPath,
        'Actual production-serving device QA: Not started',
        'Actual production-serving device QA: Completed',
      ),
      'forbidden completion claim',
    ],
    [
      'actual advertisement revenue false confirmation',
      () => replace(
        documentPath,
        'Actual advertisement revenue: Not verified',
        'Actual advertisement revenue: Confirmed',
      ),
      'forbidden completion claim',
    ],
    [
      'ambiguous production request load show completion',
      () => append(documentPath, '\nProduction request/load/show: Completed\n'),
      'forbidden completion claim',
    ],
    [
      'ambiguous production device QA completion',
      () => append(documentPath, '\nProduction device QA: Completed\n'),
      'forbidden completion claim',
    ],
    [
      'ambiguous Play Console upload completion',
      () => append(documentPath, '\nPlay Console release upload: Completed\n'),
      'forbidden completion claim',
    ],
    [
      'unrestricted production readiness claim',
      () => append(documentPath, '\nReady for unrestricted production\n'),
      'forbidden completion claim',
    ],
    [
      'existing signing infrastructure regression',
      () => replace(
        documentPath,
        'Existing release signing infrastructure: Confirmed',
        'Existing release signing infrastructure: Pending',
      ),
      'forbidden state regression',
    ],
    [
      'existing signed AAB workflow regression',
      () => replace(
        documentPath,
        'Existing signed AAB workflow: Confirmed',
        'Existing signed AAB workflow: Pending',
      ),
      'forbidden state regression',
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
      'required section deletion',
      () => replace(documentPath, '## 10. Fail-closed requirements', '### Fail-closed notes'),
      'required section missing',
    ],
    [
      'required section order and rolling project metadata format regressions',
      () => {
        replace(
          documentPath,
          '## 8. Production configuration design',
          '## 10. Fail-closed requirements (moved)\n\n## 8. Production configuration design',
        )
        replace(projectStatePath, '- 기준일: 2026-07-29', '- 기준일: 2026/07/30')
        replace(
          projectStatePath,
          '- Android versionCode: 2',
          '- Android versionCode: 0\n- Android versionCode: -1\n- Android versionCode: three',
        )
        replace(projectStatePath, '- Android versionName: 1.0.1', '- Android versionName: 1.0')
        replace(projectStatePath, '- 작업 시작 전 Open PR: 없음', '- 작업 시작 전 Open PR: ')
      },
      [
        'required section order',
        'invalid 기준일',
        'invalid Android versionCode',
        'invalid Android versionName',
        'invalid 작업 시작 전 Open PR',
      ],
    ],
  ]
  const pathsToRestore = [documentPath, projectStatePath]
  const originalContents = new Map(
    pathsToRestore.map((path) => [path, readFileSync(resolve(fixtureRoot, path))]),
  )
  let mutationPasses = 0
  for (const [name, mutate, expected] of cases) {
    try {
      mutate()
      const result = spawnSync(process.execPath, [resolve(fixtureRoot, checkerPath)], {
        cwd: fixtureRoot,
        encoding: 'utf8',
      })
      const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`
      const expectedMessages = Array.isArray(expected) ? expected : [expected]
      const missingMessages = expectedMessages.filter((message) => !output.includes(message))
      if (result.status === 0 || missingMessages.length > 0) {
        throw new Error(
          `${name}: expected rejection containing "${expectedMessages.join('", "')}"\n${output}`,
        )
      }
      mutationPasses += 1
      console.log(`PASS mutation ${mutationPasses}/${cases.length}: ${name}`)
    } finally {
      for (const [path, content] of originalContents) {
        writeFileSync(resolve(fixtureRoot, path), content)
        if (!readFileSync(resolve(fixtureRoot, path)).equals(content)) {
          throw new Error(`${name}: ${path} was not restored exactly`)
        }
      }
    }
  }
  console.log(
    `AdMob production rewarded rollout contract negative fixture restoration passed (byte-for-byte ${mutationPasses}/${cases.length})`,
  )
  console.log(
    `AdMob production rewarded rollout contract negative verification passed (mutations ${mutationPasses}/${cases.length})`,
  )
}

if (negativeSelfTestRequested) {
  const { fixtureRoot, temporaryRoot } = createSyntheticInternalTestRolloutFixture()
  try {
    runNegativeMutationSelfTest(fixtureRoot)
  } finally {
    rmSync(temporaryRoot, { recursive: true, force: true })
  }
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
  'Production source connection capability: Implemented',
  'Production Rewarded release workflow injection support: Implemented',
  'Release environment preflight support: Implemented',
  'App ID/ad-unit publisher prefix verification: Implemented',
  'Full Rewarded provider checker before release build: Implemented',
  'GitHub Secret actual value configuration: Completed',
  'Production-configured release workflow run: Completed',
  'Privacy/Data Safety final review: Completed',
  'External public privacy policy final review: Completed',
  'Advertising disclosure final review: Completed',
  'Existing release signing infrastructure: Confirmed',
  'Existing signed AAB workflow: Confirmed',
  'Production Rewarded-configured signed AAB: Completed',
  'Play Console internal-testing AAB upload: Completed',
  'Production-configured registered-test-device request/load/show: Pass - Test Ad',
  'Production-configured internal-test device QA: Pass',
  'Exactly-once reward: Pass',
  'Rapid-tap duplicate ad prevention: Pass',
  'Production-configured internal-test offline failure/recovery: Not performed / Pending',
  'Restart reward persistence: Pass',
  'Duplicate reward after restart: Not observed',
  'Actual general-user production serving: Not started',
  'General-user Production update: Not started',
  'Play Console Production-track upload: Not started',
  'Actual production-serving device QA: Not started',
  'Actual advertisement revenue: Not verified',
  'Actual early-dismiss device QA: N/A for observed creative / Pending for future early-dismiss-capable creative',
  'Repeated ADB listener-accumulation diagnostics: Pending',
  'Rollout monitoring and rollback operational verification: Pending',
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
  'approximate location, app interactions, diagnostics, and device or other identifiers',
  'Its last-updated date is 2026-07-29',
  'EEA/UK/Switzerland UMP messaging',
  '`src/config/rewardedAdSdkConfig.js`',
  '`src/services/rewardedAdProvider.loader.js`',
  '`src/services/rewardedAdProvider.sdk.js`',
  '`.github/workflows/android-release-aab.yml`',
  'No owner-held production identifier or Android native file is changed',
  '`ADMOB_REWARDED_PRODUCTION_AD_UNIT_ID`',
  'The workflow was run successfully with production Rewarded configuration',
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
  'Actual general-user production serving: Completed',
  'General-user Production update: Completed',
  'Play Console Production-track upload: Completed',
  'Actual production-serving device QA: Completed',
  'Actual advertisement revenue: Confirmed',
  'Production request/load/show: Completed',
  'Production serving: Completed',
  'Production device QA: Completed',
  'Play Console release upload: Completed',
  'Production serving enabled',
  'Ready for unrestricted production',
  'Production-configured internal-test offline failure/recovery: Pass',
]) {
  if (document.includes(claim)) errors.push(`forbidden completion claim: ${claim}`)
}

for (const regression of [
  'Production source connection capability: Not started',
  'Production Rewarded release workflow injection support: Not started',
  'Release environment preflight support: Not started',
  'App ID/ad-unit publisher prefix verification: Not started',
  'Full Rewarded provider checker before release build: Not started',
  'GitHub Secret actual value configuration: Not started',
  'Production-configured release workflow run: Not started',
  'Production Rewarded-configured signed AAB: Not started',
  'Play Console internal-testing AAB upload: Not started',
  'Privacy/Data Safety final review: Pending',
  'External public privacy policy final review: Pending',
  'Advertising disclosure final review: Pending',
  'Production-configured registered-test-device request/load/show: Not started',
  'Exactly-once reward: Not started',
  'Existing release signing infrastructure: Pending',
  'Existing signed AAB workflow: Pending',
  'AdMob Console creation: Not performed',
  'Production rewarded ad unit: Pending',
  'Production ad unit ID supplied by owner: No',
  'Production ad unit ID: None',
]) {
  if (document.includes(regression)) errors.push(`forbidden state regression: ${regression}`)
}

const projectState = read(projectStatePath)
if (!/State baseline main HEAD: `[0-9a-f]{40}`/u.test(projectState)) {
  errors.push(`${projectStatePath}: invalid State baseline main HEAD`)
}
for (const [label, pattern] of [
  ['기준일', /^- 기준일: \d{4}-\d{2}-\d{2}$/mu],
  ['Android versionCode', /^- Android versionCode: [1-9]\d*$/mu],
  ['Android versionName', /^- Android versionName: \d+\.\d+\.\d+$/mu],
  ['작업 시작 전 Open PR', /^- 작업 시작 전 Open PR: \S.*$/mu],
]) {
  if (!pattern.test(projectState)) errors.push(`${projectStatePath}: invalid ${label}`)
}

const checkedContent = [
  document,
  projectState,
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
    'PR #420 - AdMob Internal Test and Policy State Reconciliation',
    'Explicitly separated completed internal testing from unstarted general-user',
    'PR #416 - Production Rewarded Source Connection',
    'VITE_REWARDED_AD_UNIT_ID',
    'Owner-held production ID release injection',
  ]],
  [projectStatePath, [
    'AI workflow harness: merged / active',
    'production source connection capability: Implemented',
    'production Rewarded release workflow injection support: Implemented',
    'GitHub Secret actual value configuration: Completed',
    'Production-configured release workflow run: Completed',
    'Production Rewarded-configured signed AAB: Completed',
    'Play Console internal-testing AAB upload: Completed',
    'Google Play 제출 활동 상태: 출시됨',
    'Production-configured registered-test-device request/load/show: Pass - Test Ad',
    'Production-configured internal-test offline failure/recovery: Not performed / Pending',
    'Privacy/Data Safety final review: Completed',
    '외부 개인정보처리방침 PR #4: Merged',
    '외부 개인정보처리방침 Vercel status: success',
    'Actual general-user production serving: Not started',
    'General-user Production update: Not started',
    'Play Console Production-track upload: Not started',
    'Actual production-serving device QA: Not started',
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
  `AdMob production rewarded rollout contract check passed (mode canonical; sections ${requiredHeadings.length}/${requiredHeadings.length})`,
)
