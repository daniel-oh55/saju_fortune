import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function read(relativePath) {
  const absolutePath = path.join(root, relativePath);
  return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : '';
}

function extract(pattern, text) {
  const match = text.match(pattern);
  return match?.[1] ?? null;
}

function log(label, status, detail = '') {
  const suffix = detail ? ` - ${detail}` : '';
  console.log(`${label}: ${status}${suffix}`);
}

function findPotentialKeystores(startDir) {
  const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'build']);
  const matches = [];

  function walk(currentDir) {
    if (!fs.existsSync(currentDir)) return;

    for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = path.join(currentDir, entry.name);
      const relativePath = path.relative(root, fullPath).replaceAll(path.sep, '/');

      if (entry.isDirectory()) {
        if (ignoredDirs.has(entry.name)) continue;
        walk(fullPath);
        continue;
      }

      if (/\.(jks|keystore|p12|pem|key)$/i.test(entry.name) || /keystore/i.test(entry.name)) {
        matches.push(relativePath);
      }
    }
  }

  walk(path.join(root, startDir));
  return matches;
}

const capacitorConfig = read('capacitor.config.json');
const appBuildGradle = read('android/app/build.gradle');
const variablesGradle = read('android/variables.gradle');
const stringsXml = read('android/app/src/main/res/values/strings.xml');
const manifestXml = read('android/app/src/main/AndroidManifest.xml');
const debugWorkflow = read('.github/workflows/android-debug-build.yml');
const releaseWorkflow = read('.github/workflows/android-release-aab.yml');
const gitignore = read('.gitignore');
const releaseAabDoc = read('docs/ANDROID_RELEASE_AAB_WORKFLOW.md');

const appId = extract(/"appId"\s*:\s*"([^"]+)"/, capacitorConfig);
const appName = extract(/<string\s+name="app_name">([^<]+)<\/string>/, stringsXml);
const applicationId = extract(/applicationId\s+["']([^"']+)["']/, appBuildGradle);
const versionCode = extract(/versionCode\s+(\d+)/, appBuildGradle);
const versionName = extract(/versionName\s+["']([^"']+)["']/, appBuildGradle);
const minSdk = extract(/minSdkVersion\s*=\s*(\d+)/, variablesGradle);
const compileSdk = extract(/compileSdkVersion\s*=\s*(\d+)/, variablesGradle);
const targetSdk = extract(/targetSdkVersion\s*=\s*(\d+)/, variablesGradle);
const hasReleaseBuildType = /buildTypes\s*\{[\s\S]*release\s*\{/.test(appBuildGradle);
const hasReleaseSigningConfig = /signingConfigs\s*\{[\s\S]*release\s*\{/.test(appBuildGradle)
  || /signingConfig\s+signingConfigs\.release/.test(appBuildGradle);
const hasBundleReleaseTaskShape = exists('android/gradlew') && exists('android/app/build.gradle');
const keystoreMatches = findPotentialKeystores('.');
const uploadArtifactBlock = extract(/uses:\s*actions\/upload-artifact@v4\s*[\s\S]*?with:\s*([\s\S]*?)(?:\n\s*-\s+name:|\n\S|$)/, debugWorkflow) ?? '';
const debugArtifactName = extract(/^\s*name:\s*([^\r\n]+)/m, uploadArtifactBlock);
const debugArtifactPath = extract(/^\s*path:\s*([^\r\n]+)/m, uploadArtifactBlock);
const releaseUploadArtifactBlock = extract(/uses:\s*actions\/upload-artifact@v4\s*[\s\S]*?with:\s*([\s\S]*?)(?:\n\s*-\s+name:|\n\S|$)/, releaseWorkflow) ?? '';
const releaseArtifactName = extract(/^\s*name:\s*([^\r\n]+)/m, releaseUploadArtifactBlock);
const releaseArtifactPath = extract(/^\s*path:\s*([^\r\n]+)/m, releaseUploadArtifactBlock);
const manifestPermissions = [...manifestXml.matchAll(/<uses-permission\s+android:name="([^"]+)"/g)].map((match) => match[1]);
const requiredSigningSecrets = [
  'ANDROID_UPLOAD_KEYSTORE_BASE64',
  'ANDROID_UPLOAD_KEYSTORE_PASSWORD',
  'ANDROID_UPLOAD_KEY_ALIAS',
  'ANDROID_UPLOAD_KEY_PASSWORD',
];
const missingWorkflowSecrets = requiredSigningSecrets.filter((secret) => !releaseWorkflow.includes(secret));
const missingDocSecrets = requiredSigningSecrets.filter((secret) => !releaseAabDoc.includes(secret));
const missingGitignoreRules = ['*.jks', '*.keystore', 'android/app/keystore/', 'android/keystore/'].filter(
  (rule) => !gitignore.includes(rule),
);

console.log('Android release readiness check');
console.log('');

log('android_directory', exists('android') ? 'Found' : 'Missing', 'android/');
log('capacitor_config', exists('capacitor.config.json') ? 'Found' : 'Missing', appId ? `appId=${appId}` : '');
log('android_app_build_gradle', exists('android/app/build.gradle') ? 'Found' : 'Missing');
log('application_id', applicationId ? 'Found' : 'Missing', applicationId ?? '');
log('app_name_resource', appName ? 'Found' : 'Missing', appName ?? '');
log('version_code', versionCode ? 'Found' : 'Missing', versionCode ?? '');
log('version_name', versionName ? 'Found' : 'Missing', versionName ?? '');
log('min_sdk', minSdk ? 'Found' : 'Missing', minSdk ?? '');
log('compile_sdk', compileSdk ? 'Found' : 'Missing', compileSdk ?? '');
log('target_sdk', targetSdk ? 'Found' : 'Missing', targetSdk ?? '');
log(
  'google_play_target_sdk_requirement',
  Number(targetSdk) >= 35 ? 'Found' : 'Pending',
  targetSdk ? `targetSdk=${targetSdk}, required>=35 for new apps/app updates from 2025-08-31` : 'targetSdk not found',
);
log('debug_build_workflow', exists('.github/workflows/android-debug-build.yml') ? 'Found' : 'Missing');
log('debug_artifact', debugArtifactName && debugArtifactPath ? 'Found' : 'Missing', `${debugArtifactName ?? ''} ${debugArtifactPath ?? ''}`.trim());
log('release_build_type', hasReleaseBuildType ? 'Found' : 'Missing');
log('bundle_release_task_shape', hasBundleReleaseTaskShape ? 'Found' : 'Missing', 'Gradle project can be checked with ./gradlew bundleRelease');
log('release_signing_config', hasReleaseSigningConfig ? 'Found' : 'Pending', hasReleaseSigningConfig ? 'release signing config present' : 'no release signing config in android/app/build.gradle');
log('release_aab_workflow', exists('.github/workflows/android-release-aab.yml') ? 'Found' : 'Missing');
log('release_workflow_signing_secrets', missingWorkflowSecrets.length === 0 ? 'Found' : 'Missing', missingWorkflowSecrets.length === 0 ? 'all required secret names referenced' : missingWorkflowSecrets.join(', '));
log('release_aab_doc', exists('docs/ANDROID_RELEASE_AAB_WORKFLOW.md') ? 'Found' : 'Missing');
log('release_aab_doc_signing_secrets', missingDocSecrets.length === 0 ? 'Found' : 'Missing', missingDocSecrets.length === 0 ? 'all required secret names documented' : missingDocSecrets.join(', '));
log('keystore_gitignore_rules', missingGitignoreRules.length === 0 ? 'Found' : 'Missing', missingGitignoreRules.length === 0 ? 'keystore ignore rules present' : missingGitignoreRules.join(', '));
log('keystore_files_in_repo', keystoreMatches.length === 0 ? 'Found' : 'Review required', keystoreMatches.length === 0 ? 'no keystore-like files found outside ignored dirs' : keystoreMatches.join(', '));
log('manifest_permissions', manifestPermissions.length > 0 ? 'Found' : 'Missing', manifestPermissions.join(', '));
log(
  'notification_permission',
  manifestPermissions.includes('android.permission.POST_NOTIFICATIONS') ? 'Found' : 'Pending',
  'only required if native notifications are implemented for Android 13+',
);
log('release_aab_generation', 'Pending', hasReleaseSigningConfig ? 'needs GitHub Secrets and actual workflow run' : 'blocked until release signing/secrets are configured');
log('github_actions_release_artifact', releaseArtifactName && releaseArtifactPath ? 'Pending' : 'Missing', releaseArtifactName && releaseArtifactPath ? `${releaseArtifactName} ${releaseArtifactPath}` : 'release AAB artifact upload not configured');
log('github_secrets_values', 'Pending', 'cannot verify repository secret values locally');
