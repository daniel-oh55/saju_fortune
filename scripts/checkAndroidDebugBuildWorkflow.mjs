import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const workflowPath = '.github/workflows/android-debug-build.yml';
const failures = [];

function readText(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

function logResult(sampleId, isPass) {
  console.log(`sampleId: ${sampleId}`);
  console.log(`result: ${isPass ? 'pass' : 'fail'}`);
  console.log('');
}

const workflowExists = fileExists(workflowPath);
logResult('android_debug_build_workflow_exists', workflowExists);
assertCondition(workflowExists, `${workflowPath} should exist`);

const workflow = workflowExists ? readText(workflowPath) : '';
const normalizedWorkflow = workflow.toLowerCase();

const pullRequestTriggerExists = /^\s+pull_request:\s*$/m.test(workflow) || normalizedWorkflow.includes('pull_request:');
logResult('pull_request_trigger_exists', pullRequestTriggerExists);
assertCondition(pullRequestTriggerExists, 'workflow should run on pull_request');

const workflowDispatchTriggerExists =
  /^\s+workflow_dispatch:\s*$/m.test(workflow) || normalizedWorkflow.includes('workflow_dispatch:');
logResult('workflow_dispatch_trigger_exists', workflowDispatchTriggerExists);
assertCondition(workflowDispatchTriggerExists, 'workflow should support workflow_dispatch');

const setupNodeExists =
  normalizedWorkflow.includes('actions/setup-node') && normalizedWorkflow.includes('node-version');
logResult('setup_node_exists', setupNodeExists);
assertCondition(setupNodeExists, 'workflow should configure Node.js with node-version');

const dependencyInstallExists = normalizedWorkflow.includes('npm ci') || normalizedWorkflow.includes('npm install');
logResult('dependency_install_exists', dependencyInstallExists);
assertCondition(dependencyInstallExists, 'workflow should install npm dependencies');

const webBuildExists = normalizedWorkflow.includes('npm run build');
logResult('web_build_exists', webBuildExists);
assertCondition(webBuildExists, 'workflow should run npm run build');

const setupJavaExists =
  normalizedWorkflow.includes('actions/setup-java') && normalizedWorkflow.includes('java-version');
logResult('setup_java_exists', setupJavaExists);
assertCondition(setupJavaExists, 'workflow should configure JDK with setup-java and java-version');

const capacitorSyncExists = normalizedWorkflow.includes('npx cap sync android');
logResult('capacitor_sync_android_exists', capacitorSyncExists);
assertCondition(capacitorSyncExists, 'workflow should run npx cap sync android');

const workflowVerifiesJavaEnvironment =
  workflow.includes('java -version') &&
  workflow.includes('javac -version') &&
  workflow.includes('JAVA_HOME');
logResult('workflow_verifies_java_environment', workflowVerifiesJavaEnvironment);
assertCondition(
  workflowVerifiesJavaEnvironment,
  'workflow should print java -version, javac -version, and JAVA_HOME',
);

const workflowChmodsGradlew = workflow.includes('chmod +x android/gradlew');
logResult('workflow_chmods_gradlew', workflowChmodsGradlew);
assertCondition(workflowChmodsGradlew, 'workflow should chmod +x android/gradlew');

const workflowVerifiesGradleWrapper = workflow.includes('./gradlew --version');
logResult('workflow_verifies_gradle_wrapper', workflowVerifiesGradleWrapper);
assertCondition(workflowVerifiesGradleWrapper, 'workflow should verify the Gradle wrapper version');

const assembleDebugExists = normalizedWorkflow.includes('assembledebug');
logResult('assemble_debug_exists', assembleDebugExists);
assertCondition(assembleDebugExists, 'workflow should run assembleDebug');

const workflowRunsAssembleDebugWithStacktrace = workflow.includes('assembleDebug --stacktrace');
logResult('workflow_runs_assemble_debug_with_stacktrace', workflowRunsAssembleDebugWithStacktrace);
assertCondition(
  workflowRunsAssembleDebugWithStacktrace,
  'workflow should run assembleDebug with --stacktrace',
);

const uploadArtifactExists =
  normalizedWorkflow.includes('actions/upload-artifact') &&
  workflow.includes('harupuli-debug-apk') &&
  workflow.includes('android/app/build/outputs/apk/debug/app-debug.apk');
logResult('upload_debug_apk_artifact_exists', uploadArtifactExists);
assertCondition(uploadArtifactExists, 'workflow should upload the debug APK artifact');

const noAssembleRelease = !normalizedWorkflow.includes('assemblerelease');
logResult('no_assemble_release', noAssembleRelease);
assertCondition(noAssembleRelease, 'workflow should not run assembleRelease');

const noSigningConfig =
  !/signingConfig|keystore|keyAlias|storePassword|keyPassword/i.test(workflow);
logResult('no_signing_or_keystore_config', noSigningConfig);
assertCondition(noSigningConfig, 'workflow should not include signing or keystore configuration');

const noIosFolder = !fileExists('ios');
logResult('no_ios_folder', noIosFolder);
assertCondition(noIosFolder, 'ios folder should not exist in this PR');

const packageJson = JSON.parse(readText('package.json'));
const allDependencies = {
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {}),
};
const dependencyNames = Object.keys(allDependencies);

const realAdSdkMarkers = ['google-ads', 'admob', 'adsense', 'applovin', 'unity-ads', 'google-mobile-ads'];
const noRealAdSdkDependency = dependencyNames.every((packageName) => {
  const normalizedName = packageName.toLowerCase();
  return realAdSdkMarkers.every((marker) => !normalizedName.includes(marker));
});
logResult('no_real_ad_sdk_dependency', noRealAdSdkDependency);
assertCondition(noRealAdSdkDependency, 'real ad SDK dependencies should not be added');

if (failures.length > 0) {
  console.error('Android debug build workflow check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android debug build workflow check passed');
}
