import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const componentPath = 'src/pages/PrivacyInfoPage.jsx';
const stylePath = 'src/styles.css';
const packagePath = 'package.json';
const lockfilePath = 'package-lock.json';
const expectedUrl = 'https://hymlounge.com/harupuli/privacy/';
const expectedLabel = '전체 개인정보처리방침 보기';

const readProjectFile = (filePath) =>
  readFileSync(resolve(projectRoot, filePath), 'utf8').replace(/\r\n/g, '\n');

const gitOutput = (...args) =>
  execFileSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).replace(/\r\n/g, '\n');

const errors = [];
const requireCondition = (condition, message) => {
  if (!condition) errors.push(message);
};

const component = readProjectFile(componentPath);
const styles = readProjectFile(stylePath);
const packageJsonText = readProjectFile(packagePath);
const packageJson = JSON.parse(packageJsonText);
const basePackageJson = JSON.parse(gitOutput('show', `origin/main:${packagePath}`));

const urlMatches = component.match(
  /https?:\/\/[^"'`\s]+(?:privacy|개인정보)[^"'`\s]*/gi,
) ?? [];

requireCondition(component.includes(`href="${expectedUrl}"`), 'production URL href is missing');
requireCondition(component.includes(expectedLabel), 'external-link label is missing');
requireCondition(component.includes('target="_blank"'), 'target="_blank" is missing');
requireCondition(
  /rel="[^"]*\bnoopener\b[^"]*\bnoreferrer\b[^"]*"/.test(component),
  'rel must include noopener and noreferrer',
);
requireCondition(!component.includes('http://'), 'insecure HTTP URL is not allowed');
requireCondition(
  urlMatches.length === 1 && urlMatches[0] === expectedUrl,
  'component must contain exactly one privacy-policy URL and it must match production',
);
requireCondition(!/window\.location/.test(component), 'window.location navigation is not allowed');
requireCondition(!/<iframe\b/i.test(component), 'iframe is not allowed');
requireCondition(
  styles.includes('.privacy-policy-external-link:focus-visible'),
  'visible keyboard focus style is missing',
);
requireCondition(
  styles.includes('min-height: 46px'),
  'external link must preserve a mobile-friendly touch target',
);

for (const sectionName of [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies',
]) {
  requireCondition(
    JSON.stringify(packageJson[sectionName]) === JSON.stringify(basePackageJson[sectionName]),
    `package.json ${sectionName} changed`,
  );
}

requireCondition(
  packageJson.scripts?.['check:privacy-policy-external-link'] ===
    'node scripts/checkPrivacyPolicyExternalLink.mjs',
  'targeted package script is missing or incorrect',
);

const changedFiles = [
  ...gitOutput('diff', '--name-only', 'origin/main...HEAD').split('\n'),
  ...gitOutput('diff', '--name-only', '--cached').split('\n'),
  ...gitOutput('diff', '--name-only').split('\n'),
  ...gitOutput('ls-files', '--others', '--exclude-standard').split('\n'),
]
  .map((filePath) => filePath.trim().replaceAll('\\', '/'))
  .filter(Boolean);

const allowedChangedFiles = new Set([
  'CHANGELOG.md',
  'DEVELOPMENT_LOG.md',
  'TODO.md',
  packagePath,
  'scripts/checkPrivacyPolicyExternalLink.mjs',
  componentPath,
  stylePath,
]);

for (const filePath of changedFiles) {
  requireCondition(allowedChangedFiles.has(filePath), `unexpected changed file: ${filePath}`);
}

requireCondition(!changedFiles.includes(lockfilePath), 'package-lock.json must remain unchanged');
requireCondition(
  !changedFiles.some((filePath) => filePath.startsWith('android/')),
  'Android native files must remain unchanged',
);

const productionDiff = gitOutput('diff', '--', 'src', packagePath);
const addedProductionLines = productionDiff
  .split('\n')
  .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
  .join('\n');
const forbiddenAddedPatterns = [
  /window\.location/,
  /<iframe\b/i,
  /@capacitor\/browser/i,
  /ca-app-pub-/i,
  /advertising[_ -]?id/i,
  /google mobile ads sdk/i,
  /ump sdk/i,
];

for (const pattern of forbiddenAddedPatterns) {
  requireCondition(!pattern.test(addedProductionLines), `forbidden production addition: ${pattern}`);
}

if (errors.length > 0) {
  console.error('Privacy policy external-link check failed.');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Privacy policy external-link check passed.');
