import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const componentPath = 'src/pages/PrivacyInfoPage.jsx';
const stylePath = 'src/styles.css';
const packagePath = 'package.json';
const lockfilePath = 'package-lock.json';
const checkerPath = 'scripts/checkPrivacyPolicyExternalLink.mjs';
const expectedUrl = 'https://www.hymlounge.com/harupuli/privacy/';
const expectedLabel = '전체 개인정보처리방침 보기';
const expectedScriptName = 'check:privacy-policy-external-link';
const expectedScriptCommand = 'node scripts/checkPrivacyPolicyExternalLink.mjs';

const readProjectFile = (filePath) =>
  readFileSync(resolve(projectRoot, filePath), 'utf8').replace(/\r\n/g, '\n');

const gitOutput = (...args) =>
  execFileSync('git', args, {
    cwd: projectRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).replace(/\r\n/g, '\n');

const gitObjectExists = (name) => {
  try {
    execFileSync('git', ['cat-file', '-e', name], {
      cwd: projectRoot,
      stdio: 'ignore',
    });
    return true;
  } catch {
    return false;
  }
};

const errors = [];
const requireCondition = (condition, message) => {
  if (!condition) errors.push(message);
};

const getQuotedAttribute = (openingTag, attributeName) => {
  const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = openingTag.match(
    new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*(["'])(.*?)\\1`, 'i'),
  );
  return match?.[2];
};

const extractClassAnchors = (source, className) => {
  const anchors = [];
  const anchorPattern = /<a\b[^>]*>[\s\S]*?<\/a\s*>/gi;

  for (const match of source.matchAll(anchorPattern)) {
    const anchor = match[0];
    const openingTag = anchor.match(/^<a\b[^>]*>/i)?.[0] ?? '';
    const classValue = getQuotedAttribute(openingTag, 'className') ?? '';
    const classNames = classValue.split(/\s+/).filter(Boolean);

    if (classNames.includes(className)) {
      anchors.push({
        source: anchor,
        openingTag,
        label: anchor
          .replace(/^<a\b[^>]*>/i, '')
          .replace(/<\/a\s*>$/i, '')
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim(),
      });
    }
  }

  return anchors;
};

const extractCssBlock = (source, selector) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return source.match(new RegExp(`${escapedSelector}\\s*\\{([^{}]*)\\}`, 'm'))?.[1];
};

const cssDeclarationValue = (block, property) => {
  if (block === undefined) return undefined;
  const escapedProperty = property.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return block.match(new RegExp(`(?:^|;)\\s*${escapedProperty}\\s*:\\s*([^;]+)`, 'i'))?.[1].trim();
};

const component = readProjectFile(componentPath);
const styles = readProjectFile(stylePath);
const packageJsonText = readProjectFile(packagePath);
const packageJson = JSON.parse(packageJsonText);
const creationMode = !gitObjectExists(`origin/main:${checkerPath}`);

const externalLinkAnchors = extractClassAnchors(component, 'privacy-policy-external-link');
const externalLinkAnchor = externalLinkAnchors[0];
const anchorHref = externalLinkAnchor
  ? getQuotedAttribute(externalLinkAnchor.openingTag, 'href')
  : undefined;
const anchorTarget = externalLinkAnchor
  ? getQuotedAttribute(externalLinkAnchor.openingTag, 'target')
  : undefined;
const anchorRelTokens = externalLinkAnchor
  ? (getQuotedAttribute(externalLinkAnchor.openingTag, 'rel') ?? '').split(/\s+/)
  : [];
const urlMatches = component.match(
  /https?:\/\/[^"'`\s]+(?:privacy|개인정보)[^"'`\s]*/gi,
) ?? [];
const externalLinkBlock = extractCssBlock(styles, '.privacy-policy-external-link');
const focusVisibleBlock = extractCssBlock(
  styles,
  '.privacy-policy-external-link:focus-visible',
);

requireCondition(
  externalLinkAnchors.length === 1,
  'component must contain exactly one semantic <a> with className="privacy-policy-external-link"',
);
requireCondition(anchorHref === expectedUrl, 'external-link anchor has an incorrect production URL');
requireCondition(anchorTarget === '_blank', 'external-link anchor must use target="_blank"');
requireCondition(
  anchorRelTokens.includes('noopener'),
  'external-link anchor rel must include noopener',
);
requireCondition(
  anchorRelTokens.includes('noreferrer'),
  'external-link anchor rel must include noreferrer',
);
requireCondition(
  externalLinkAnchor?.label === expectedLabel,
  'external-link anchor label is missing or incorrect',
);
requireCondition(!component.includes('http://'), 'insecure HTTP URL is not allowed');
requireCondition(
  urlMatches.length === 1 && urlMatches[0] === expectedUrl,
  'component must contain exactly one privacy-policy URL and it must match production',
);
requireCondition(!/window\.location/.test(component), 'window.location navigation is not allowed');
requireCondition(!/\biframe\b/i.test(component), 'iframe is not allowed');
requireCondition(
  externalLinkBlock !== undefined,
  'external-link CSS declaration block is missing',
);
requireCondition(
  cssDeclarationValue(externalLinkBlock, 'display') === 'inline-flex',
  'external-link CSS block must preserve display: inline-flex',
);
requireCondition(
  cssDeclarationValue(externalLinkBlock, 'min-height') === '46px',
  'external-link CSS block must preserve min-height: 46px',
);
requireCondition(
  externalLinkBlock !== undefined &&
    /(?:^|;)\s*padding(?:-(?:top|right|bottom|left|block|block-start|block-end|inline|inline-start|inline-end))?\s*:/i.test(
      externalLinkBlock,
    ),
  'external-link CSS block must preserve touch-target padding',
);
requireCondition(
  focusVisibleBlock !== undefined,
  'external-link focus-visible CSS declaration block is missing',
);
requireCondition(
  cssDeclarationValue(focusVisibleBlock, 'outline') !== undefined,
  'external-link focus-visible CSS block must declare outline',
);
requireCondition(
  cssDeclarationValue(focusVisibleBlock, 'outline-offset') !== undefined,
  'external-link focus-visible CSS block must declare outline-offset',
);

if (creationMode) {
  const basePackageJson = JSON.parse(gitOutput('show', `origin/main:${packagePath}`));

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

  const baseScripts = basePackageJson.scripts ?? {};
  const currentScripts = packageJson.scripts ?? {};

  for (const [scriptName, baseCommand] of Object.entries(baseScripts)) {
    requireCondition(
      Object.hasOwn(currentScripts, scriptName),
      `existing package script was deleted: ${scriptName}`,
    );
    requireCondition(
      currentScripts[scriptName] === baseCommand,
      `existing package script command changed: ${scriptName}`,
    );
  }

  for (const scriptName of Object.keys(currentScripts)) {
    requireCondition(
      Object.hasOwn(baseScripts, scriptName) || scriptName === expectedScriptName,
      `unauthorized new package script: ${scriptName}`,
    );
  }

  requireCondition(
    currentScripts[expectedScriptName] === expectedScriptCommand,
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
    checkerPath,
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

  const productionDiff = [
    gitOutput('diff', 'origin/main...HEAD', '--', 'src', packagePath),
    gitOutput('diff', '--cached', '--', 'src', packagePath),
    gitOutput('diff', '--', 'src', packagePath),
  ].join('\n');
  const addedProductionLines = productionDiff
    .split('\n')
    .filter((line) => line.startsWith('+') && !line.startsWith('+++'))
    .join('\n');
  const forbiddenAddedPatterns = [
    /window\.location/,
    /\biframe\b/i,
    /@capacitor\/browser/i,
    /ca-app-pub-/i,
  ];

  for (const pattern of forbiddenAddedPatterns) {
    requireCondition(
      !pattern.test(addedProductionLines),
      `forbidden production addition: ${pattern}`,
    );
  }
}

if (errors.length > 0) {
  console.error('Privacy policy external-link check failed.');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(
  `Privacy policy external-link check passed (${creationMode ? 'creation' : 'post-merge'} mode).`,
);
