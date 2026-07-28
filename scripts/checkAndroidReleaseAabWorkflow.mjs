import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const workflowPath = '.github/workflows/android-release-aab.yml';
const gradlePath = 'android/app/build.gradle';
const docPath = 'docs/ANDROID_RELEASE_AAB_WORKFLOW.md';
const roadmapPath = 'docs/SAJU_ENGINE_ACCURACY_ROADMAP.md';
const negativeSelfTest = process.argv.includes('--negative-self-test');

const requiredPaths = [workflowPath, gradlePath, docPath, roadmapPath];
const normalizedRead = (path) => fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n');

function stepBlock(workflow, name) {
  const marker = `      - name: ${name}`;
  const start = workflow.indexOf(marker);
  if (start === -1) return '';
  const next = workflow.indexOf('\n      - name:', start + marker.length);
  return workflow.slice(start, next === -1 ? workflow.length : next);
}

function validateWorkflow(workflow) {
  const errors = [];
  const requireMatch = (pattern, message) => {
    if (!pattern.test(workflow)) errors.push(message);
  };
  const requireText = (text, message) => {
    if (!workflow.includes(text)) errors.push(message);
  };

  const triggerBlock = workflow.slice(workflow.indexOf('on:\n'), workflow.indexOf('\njobs:'));
  if (!/^on:\n  workflow_dispatch:\n/m.test(triggerBlock)) {
    errors.push('workflow must use workflow_dispatch');
  }
  if (/^  (?:push|pull_request|schedule|repository_dispatch):/m.test(triggerBlock)) {
    errors.push('workflow must remain workflow_dispatch only');
  }
  requireMatch(
    /^      confirm_production_rewarded_release:\n        description: [^\n]*production Rewarded release[^\n]*\n        required: true\n        type: boolean\n        default: false$/m,
    'production confirmation boolean input is required',
  );
  requireMatch(
    /^permissions:\n  contents: read$/m,
    'workflow permissions must be contents read',
  );

  const authorization = stepBlock(workflow, 'Validate manual production release authorization');
  if (!authorization.includes('RELEASE_REF: ${{ github.ref }}') ||
      !authorization.includes('if [ "$RELEASE_REF" != "refs/heads/main" ]; then')) {
    errors.push('main branch guard is required');
  }
  if (!authorization.includes(
    'OWNER_CONFIRMED: ${{ inputs.confirm_production_rewarded_release }}',
  ) || !authorization.includes('if [ "$OWNER_CONFIRMED" != "true" ]; then')) {
    errors.push('owner confirmation guard is required');
  }

  const productionEnv = [
    'VITE_REWARDED_AD_PROVIDER: sdk',
    'VITE_REWARDED_AD_SDK_ENABLED: "true"',
    'VITE_REWARDED_AD_MODE: production',
    'VITE_REWARDED_AD_BUILD_TARGET: release',
    'VITE_REWARDED_AD_UNIT_ID: ${{ secrets.ADMOB_REWARDED_PRODUCTION_AD_UNIT_ID }}',
  ];
  const preflight = stepBlock(workflow, 'Validate production Rewarded release configuration');
  const build = stepBlock(workflow, 'Build web app');
  requireText(
    'node scripts/checkAdmobRewardedAdProvider.mjs --release-env-preflight',
    'production Rewarded release preflight command is required',
  );
  for (const entry of productionEnv) {
    if (!preflight.includes(entry)) errors.push(`preflight missing production env: ${entry}`);
    if (!build.includes(entry)) errors.push(`build missing production env: ${entry}`);
    if (workflow.split(entry).length - 1 !== 2) {
      errors.push(`production env must be limited to preflight and build: ${entry}`);
    }
  }
  if (preflight.includes('VITE_REWARDED_AD_MODE: official_test') ||
      preflight.includes('VITE_REWARDED_AD_BUILD_TARGET: debug')) {
    errors.push('preflight may not enable an isTesting configuration');
  }

  const stepOrder = [
    'Checkout repository',
    'Set up Node.js',
    'Install dependencies',
    'Validate manual production release authorization',
    'Validate release signing secrets',
    'Validate production Rewarded release configuration',
    'Build web app',
    'Set up JDK',
    'Sync Android project',
    'Restore release keystore',
    'Build signed release AAB',
    'Verify signed release AAB',
    'Upload release AAB',
  ];
  let previousIndex = -1;
  for (const name of stepOrder) {
    const index = workflow.indexOf(`      - name: ${name}`);
    if (index === -1) {
      errors.push(`required workflow step missing: ${name}`);
    } else if (index <= previousIndex) {
      errors.push(`workflow step order invalid at: ${name}`);
    }
    previousIndex = index;
  }

  for (const required of [
    'node-version: 22',
    'jarsigner -verify',
    'jar verified.',
    'actions/upload-artifact@v4',
    'harupuli-release-aab',
    'ANDROID_KEYSTORE_BASE64: ${{ secrets.ANDROID_KEYSTORE_BASE64 }}',
    'ANDROID_KEYSTORE_PASSWORD: ${{ secrets.ANDROID_KEYSTORE_PASSWORD }}',
    'ANDROID_KEY_ALIAS: ${{ secrets.ANDROID_KEY_ALIAS }}',
    'ANDROID_KEY_PASSWORD: ${{ secrets.ANDROID_KEY_PASSWORD }}',
  ]) {
    requireText(required, `existing release invariant missing: ${required}`);
  }

  if (/\bca-app-pub-\d{16}[~/]\d{10}\b/u.test(workflow)) {
    errors.push('workflow may not contain a concrete AdMob identifier');
  }
  if (workflow.includes(['ca-app-pub-3940256099942544', '5224354917'].join('/'))) {
    errors.push('workflow may not contain the Google official Rewarded Test ID');
  }
  for (const pattern of [
    /\bset -x\b/u,
    /\bprintenv\b/u,
    /^\s*env\s*$/mu,
    /\$\{\{\s*toJSON\(secrets\)\s*\}\}/u,
    /\.env(?:\s|$)/u,
    /\bcontinue-on-error\s*:\s*true\b/u,
    /\bif\s*:\s*\$\{\{\s*always\(\)\s*\}\}/u,
    /(?:echo|printf)[^\n]*(?:VITE_REWARDED_AD_UNIT_ID|ADMOB_REWARDED_PRODUCTION_AD_UNIT_ID)/u,
    /(?:echo|printf)[^\n]*(?:ANDROID_KEYSTORE_PASSWORD|ANDROID_KEY_ALIAS|ANDROID_KEY_PASSWORD)(?![^\n]*>)/u,
    /(?:^|\s)(?:supply|fastlane)(?:\s|$)/u,
    /(?:uses:|run:)[^\n]*(?:deploy|deployment|rollout|google-play|play-store|publishBundle|publishReleaseBundle)/iu,
  ]) {
    if (pattern.test(workflow)) errors.push(`forbidden workflow pattern: ${pattern}`);
  }

  return errors;
}

function runNegativeMutationSelfTest(workflow) {
  const officialTestId = ['ca-app-pub-3940256099942544', '5224354917'].join('/');
  const replaceRequired = (source, from, to, name) => {
    assert(source.includes(from), `negative mutation source missing: ${name}`);
    return source.replace(from, to);
  };
  const moveStepBefore = (source, movingName, destinationName) => {
    const moving = stepBlock(source, movingName);
    assert(moving, `negative mutation source missing: ${movingName}`);
    const without = source.replace(`${moving}\n`, '');
    const destination = stepBlock(without, destinationName);
    assert(destination, `negative mutation destination missing: ${destinationName}`);
    return without.replace(destination, `${moving}\n${destination}`);
  };
  const mutations = [
    ['pull_request trigger added', (source) =>
      source.replace('  workflow_dispatch:\n', '  pull_request:\n  workflow_dispatch:\n')],
    ['confirmation guard removed', (source) => replaceRequired(
      source,
      'if [ "$OWNER_CONFIRMED" != "true" ]; then',
      'if false; then',
      'confirmation guard',
    )],
    ['main guard removed', (source) => replaceRequired(
      source,
      'if [ "$RELEASE_REF" != "refs/heads/main" ]; then',
      'if false; then',
      'main guard',
    )],
    ['production secret mapping removed', (source) =>
      source.replaceAll(
        '${{ secrets.ADMOB_REWARDED_PRODUCTION_AD_UNIT_ID }}',
        '${{ secrets.WRONG_REWARDED_SECRET }}',
      )],
    ['official test ID used', (source) =>
      source.replaceAll('${{ secrets.ADMOB_REWARDED_PRODUCTION_AD_UNIT_ID }}', officialTestId)],
    ['mode changed to official_test', (source) =>
      source.replaceAll('VITE_REWARDED_AD_MODE: production', 'VITE_REWARDED_AD_MODE: official_test')],
    ['target changed to debug', (source) =>
      source.replaceAll('VITE_REWARDED_AD_BUILD_TARGET: release', 'VITE_REWARDED_AD_BUILD_TARGET: debug')],
    ['isTesting path enabled', (source) => source
      .replaceAll('VITE_REWARDED_AD_MODE: production', 'VITE_REWARDED_AD_MODE: official_test')
      .replaceAll('VITE_REWARDED_AD_BUILD_TARGET: release', 'VITE_REWARDED_AD_BUILD_TARGET: debug')
      .replaceAll('${{ secrets.ADMOB_REWARDED_PRODUCTION_AD_UNIT_ID }}', officialTestId)],
    ['preflight moved after build', (source) =>
      moveStepBefore(source, 'Build web app', 'Validate production Rewarded release configuration')],
    ['secret output added', (source) => replaceRequired(
      source,
      'run: npm run build',
      'run: echo "$VITE_REWARDED_AD_UNIT_ID"\n        # npm run build',
      'secret output',
    )],
    ['jarsigner verification removed', (source) =>
      replaceRequired(source, 'jarsigner -verify', '# verification removed', 'jarsigner')],
    ['upload moved before verify', (source) =>
      moveStepBefore(source, 'Upload release AAB', 'Verify signed release AAB')],
  ];

  let detected = 0;
  for (const [name, mutate] of mutations) {
    const mutated = mutate(workflow);
    assert.notEqual(mutated, workflow, `negative mutation did not apply: ${name}`);
    const errors = validateWorkflow(mutated);
    assert(errors.length > 0, `negative mutation escaped: ${name}`);
    detected += 1;
  }
  console.log(`Android release AAB workflow negative verification passed (${detected}/${mutations.length})`);
}

let hasFailure = false;
for (const path of requiredPaths) {
  if (!fs.existsSync(path)) {
    console.error(`missing required path: ${path}`);
    hasFailure = true;
  }
}
if (hasFailure) process.exit(1);

const workflow = normalizedRead(workflowPath);
const workflowErrors = validateWorkflow(workflow);
if (workflowErrors.length) {
  console.error('Android release AAB workflow check failed');
  for (const error of workflowErrors) console.error(`- ${error}`);
  process.exit(1);
}

const gradle = normalizedRead(gradlePath);
for (const snippet of [
  'isReleaseBuildTask',
  'gradle.startParameter.taskNames',
  'throw new GradleException("Release signing environment variables are required for release builds.")',
  'signingConfig signingConfigs.release',
]) {
  assert(gradle.includes(snippet), `Gradle release signing invariant missing: ${snippet}`);
}

const combinedDocs = `${normalizedRead(docPath)}\n${normalizedRead(roadmapPath)}`;
for (const snippet of [
  'Existing release signing infrastructure: Confirmed',
  'Existing signed AAB workflow: Confirmed',
  'Production Rewarded-configured signed AAB: Not started',
  'ADMOB_REWARDED_PRODUCTION_AD_UNIT_ID',
  'Secret actual values: Not recorded',
  'Play Console internal test upload: Pending',
  'real device QA: Pending',
]) {
  assert(combinedDocs.includes(snippet), `release documentation invariant missing: ${snippet}`);
}

const trackedFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .split(/\r?\n/)
  .filter(Boolean);
const statusFiles = execFileSync(
  'git',
  ['status', '--short', '--untracked-files=all'],
  { encoding: 'utf8' },
)
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => line.slice(3).trim().replace(/^"|"$/g, ''));
const sensitiveFiles = [...trackedFiles, ...statusFiles].filter((path) =>
  ['.aab', '.zip', '.jks', '.keystore'].some((extension) => path.endsWith(extension))
);
assert.equal(sensitiveFiles.length, 0, 'artifact and keystore files must not be added');

if (negativeSelfTest) runNegativeMutationSelfTest(workflow);

console.log('Android release AAB workflow check passed');
