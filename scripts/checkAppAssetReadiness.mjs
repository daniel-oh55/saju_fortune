import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const failures = [];

const masterAssetPaths = [
  'public/brand/harupuli-app-icon-master.svg',
  'public/brand/harupuli-splash-master.svg',
];

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

const appIconMasterExists = fileExists(masterAssetPaths[0]);
logResult('app_icon_master_exists', appIconMasterExists);
assertCondition(appIconMasterExists, 'public/brand/harupuli-app-icon-master.svg should exist');

const splashMasterExists = fileExists(masterAssetPaths[1]);
logResult('splash_master_exists', splashMasterExists);
assertCondition(splashMasterExists, 'public/brand/harupuli-splash-master.svg should exist');

const pwaIconsStillExist =
  fileExists('public/icons/harupuli-icon.svg') && fileExists('public/icons/harupuli-maskable-icon.svg');
logResult('pwa_icons_still_exist', pwaIconsStillExist);
assertCondition(pwaIconsStillExist, 'PWA SVG icons should still exist');

const masterSvgsHaveViewBox = masterAssetPaths.every((assetPath) => fileExists(assetPath) && readText(assetPath).includes('viewBox'));
logResult('master_svgs_have_viewbox', masterSvgsHaveViewBox);
assertCondition(masterSvgsHaveViewBox, 'master SVG files should include viewBox');

const masterSvgText = masterAssetPaths.filter(fileExists).map(readText).join('\n');

const noExternalImageLinks = !/(<image\b|href=["']https?:\/\/|xlink:href=["']https?:\/\/)/i.test(masterSvgText);
logResult('no_external_image_links', noExternalImageLinks);
assertCondition(noExternalImageLinks, 'master SVG files should not include external image links or image tags');

const noExternalFontLinks = !/(@font-face|font-family\s*:\s*url|googleapis|gstatic)/i.test(masterSvgText);
logResult('no_external_font_links', noExternalFontLinks);
assertCondition(noExternalFontLinks, 'master SVG files should not include external font links');

const manifest = JSON.parse(readText('public/manifest.webmanifest'));
const manifestIconSources = Array.isArray(manifest.icons) ? manifest.icons.map((icon) => icon.src) : [];
const manifestStillReferencesPwaIcons =
  manifestIconSources.includes('/icons/harupuli-icon.svg') &&
  manifestIconSources.includes('/icons/harupuli-maskable-icon.svg');
logResult('manifest_still_references_pwa_icons', manifestStillReferencesPwaIcons);
assertCondition(manifestStillReferencesPwaIcons, 'manifest should still reference existing PWA icons');

const pwaReadinessDoc = readText('docs/PWA_READINESS.md');
const pwaReadinessDocMentionsAppAssets =
  pwaReadinessDoc.includes('APP_ASSET_READINESS') || pwaReadinessDoc.includes('PNG');
logResult('pwa_readiness_doc_mentions_app_assets', pwaReadinessDocMentionsAppAssets);
assertCondition(pwaReadinessDocMentionsAppAssets, 'PWA readiness doc should mention app asset readiness or PNG asset plan');

const appAssetDocExists = fileExists('docs/APP_ASSET_READINESS.md');
logResult('app_asset_doc_exists', appAssetDocExists);
assertCondition(appAssetDocExists, 'docs/APP_ASSET_READINESS.md should exist');

const packageJson = JSON.parse(readText('package.json'));
const allDependencies = {
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {}),
};

const dependencyNames = Object.keys(allDependencies);
const noCapacitorPlatformAdded =
  !dependencyNames.includes('@capacitor/android') && !dependencyNames.includes('@capacitor/ios');
logResult('no_capacitor_platform_added', noCapacitorPlatformAdded);
assertCondition(noCapacitorPlatformAdded, '@capacitor/android and @capacitor/ios should not be added in this PR');

const forbiddenImageLibraries = ['sharp', 'canvas', 'jimp', 'imagemagick', 'gm'];
const noImageGenerationDependencyAdded = !dependencyNames.some((name) =>
  forbiddenImageLibraries.includes(name.toLowerCase()),
);
logResult('no_image_generation_dependency_added', noImageGenerationDependencyAdded);
assertCondition(noImageGenerationDependencyAdded, 'this PR should not add image generation dependencies');

if (failures.length > 0) {
  console.error('App asset readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('App asset readiness check passed');
}
