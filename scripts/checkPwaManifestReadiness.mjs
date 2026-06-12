import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const failures = [];

function assertCondition(condition, message) {
  if (!condition) failures.push(message);
}

function logResult(sampleId, isPass) {
  console.log(`sampleId: ${sampleId}`);
  console.log(`result: ${isPass ? 'pass' : 'fail'}`);
  console.log('');
}

function readText(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

function fileExists(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

const manifestPath = 'public/manifest.webmanifest';
const manifestFileExists = fileExists(manifestPath);
logResult('manifest_file_exists', manifestFileExists);
assertCondition(manifestFileExists, 'public/manifest.webmanifest should exist');

let manifest = null;
let manifestValidJson = false;

if (manifestFileExists) {
  try {
    manifest = JSON.parse(readText(manifestPath));
    manifestValidJson = true;
  } catch {
    manifestValidJson = false;
  }
}

logResult('manifest_valid_json', manifestValidJson);
assertCondition(manifestValidJson, 'manifest should be valid JSON');

const requiredFields = [
  'name',
  'short_name',
  'start_url',
  'scope',
  'display',
  'background_color',
  'theme_color',
  'icons',
];
const manifestRequiredFields = Boolean(
  manifest && requiredFields.every((fieldName) => Object.prototype.hasOwnProperty.call(manifest, fieldName)),
);
logResult('manifest_required_fields', manifestRequiredFields);
assertCondition(manifestRequiredFields, `manifest should include fields: ${requiredFields.join(', ')}`);

const manifestDisplayStandalone = manifest?.display === 'standalone';
logResult('manifest_display_standalone', manifestDisplayStandalone);
assertCondition(manifestDisplayStandalone, 'manifest display should be standalone');

const manifestStartScopeRoot = manifest?.start_url === '/' && manifest?.scope === '/';
logResult('manifest_start_scope_root', manifestStartScopeRoot);
assertCondition(manifestStartScopeRoot, 'manifest start_url and scope should be /');

const icons = Array.isArray(manifest?.icons) ? manifest.icons : [];
const manifestIconsExist =
  icons.length >= 2 &&
  icons.every((icon) => typeof icon.src === 'string' && fileExists(path.join('public', icon.src.replace(/^\//, ''))));
logResult('manifest_icons_exist', manifestIconsExist);
assertCondition(manifestIconsExist, 'manifest should include at least two existing icon files');

const manifestHasMaskableIcon = icons.some((icon) => String(icon.purpose || '').includes('maskable'));
logResult('manifest_has_maskable_icon', manifestHasMaskableIcon);
assertCondition(manifestHasMaskableIcon, 'manifest should include a maskable icon');

const svgIcons = icons.filter((icon) => String(icon.type || '').includes('svg'));
const iconSvgValidBasic = svgIcons.length > 0 && svgIcons.every((icon) => {
  const iconPath = path.join('public', icon.src.replace(/^\//, ''));
  if (!fileExists(iconPath)) return false;
  const svg = readText(iconPath).trim();
  return svg.includes('<svg') && svg.includes('viewBox');
});
logResult('icon_svg_valid_basic', iconSvgValidBasic);
assertCondition(iconSvgValidBasic, 'all manifest SVG icons should include <svg and viewBox');

const indexHtml = readText('index.html');
const indexLinksManifest =
  /rel=["']manifest["'][^>]*href=["']\/manifest\.webmanifest["']/.test(indexHtml) ||
  /href=["']\/manifest\.webmanifest["'][^>]*rel=["']manifest["']/.test(indexHtml);
logResult('index_links_manifest', indexLinksManifest);
assertCondition(indexLinksManifest, 'index.html should link /manifest.webmanifest');

const indexHasThemeColor = /<meta\s+name=["']theme-color["']\s+content=["']#338f8b["']\s*\/?>/.test(indexHtml);
logResult('index_has_theme_color', indexHasThemeColor);
assertCondition(indexHasThemeColor, 'index.html should include theme-color meta');

const forbiddenServiceWorkerPaths = [
  'public/service-worker.js',
  'public/sw.js',
  'src/service-worker.js',
  'src/sw.js',
];
const packageJson = JSON.parse(readText('package.json'));
const allDependencies = {
  ...(packageJson.dependencies || {}),
  ...(packageJson.devDependencies || {}),
};
const noServiceWorkerAdded =
  forbiddenServiceWorkerPaths.every((relativePath) => !fileExists(relativePath)) &&
  !Object.keys(allDependencies).some((name) => name.toLowerCase().includes('workbox'));
logResult('no_service_worker_added', noServiceWorkerAdded);
assertCondition(noServiceWorkerAdded, 'this PR should not add service worker or Workbox dependency');

const noCapacitorAdded = !Object.keys(allDependencies).some((name) => name.startsWith('@capacitor'));
logResult('no_capacitor_added', noCapacitorAdded);
assertCondition(noCapacitorAdded, 'this PR should not add Capacitor dependency');

if (failures.length > 0) {
  console.error('PWA manifest readiness check failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('PWA manifest readiness check passed');
}
