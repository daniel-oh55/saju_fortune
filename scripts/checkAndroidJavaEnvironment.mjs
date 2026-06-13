import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const failures = [];

function fileExists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function pathExists(targetPath) {
  return Boolean(targetPath) && fs.existsSync(targetPath);
}

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

function logResult(sampleId, isPass) {
  console.log(`sampleId: ${sampleId}`);
  console.log(`result: ${isPass ? 'pass' : 'fail'}`);
  console.log('');
}

function runCommand(command, args) {
  const result = childProcess.spawnSync(command, args, {
    cwd: projectRoot,
    encoding: 'utf8',
  });

  return {
    ok: result.status === 0,
    output: [result.stdout, result.stderr, result.error?.message].filter(Boolean).join('\n').trim(),
  };
}

const javaVersion = runCommand('java', ['-version']);
logResult('java_command_available', javaVersion.ok);
assertCondition(javaVersion.ok, 'java command is required. Install JDK 21 and add java to PATH.');

const javacVersion = runCommand('javac', ['-version']);
logResult('javac_command_available', javacVersion.ok);
assertCondition(javacVersion.ok, 'javac command is required. Install JDK 21 and add javac to PATH.');

const javaHomePresent = Boolean(process.env.JAVA_HOME);
logResult('java_home_present', javaHomePresent);
assertCondition(javaHomePresent, 'JAVA_HOME should be set to the JDK installation path.');

const javaHomePathExists = pathExists(process.env.JAVA_HOME);
logResult('java_home_path_exists', javaHomePathExists);
assertCondition(javaHomePathExists, 'JAVA_HOME should point to an existing JDK directory.');

const javaVersionRecorded = Boolean(javaVersion.output || javacVersion.output);
logResult('java_version_recorded', javaVersionRecorded);
console.log('javaVersionOutput:');
console.log(javaVersion.output || '(not available)');
console.log('');
console.log('javacVersionOutput:');
console.log(javacVersion.output || '(not available)');
console.log('');
assertCondition(javaVersionRecorded, 'java -version or javac -version output should be recorded.');

const gradleWrapperExists = fileExists('android/gradlew') && fileExists('android/gradlew.bat');
logResult('gradle_wrapper_exists', gradleWrapperExists);
assertCondition(gradleWrapperExists, 'android/gradlew and android/gradlew.bat should exist.');

const androidProjectExists = fileExists('android');
logResult('android_project_exists', androidProjectExists);
assertCondition(androidProjectExists, 'android project folder should exist.');

const noIosProjectCreated = !fileExists('ios');
logResult('no_ios_project_created', noIosProjectCreated);
assertCondition(noIosProjectCreated, 'ios project folder should not exist in this PR.');

if (failures.length > 0) {
  console.error('Android Java environment check failed');
  console.error('JDK 21 installation and JAVA_HOME/PATH configuration are required before Android debug build.');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android Java environment check passed');
}
