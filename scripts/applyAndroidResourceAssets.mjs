import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const failures = [];

const copyTargets = [
  ['public/generated-icons/android/icon-48.png', 'android/app/src/main/res/mipmap-mdpi/ic_launcher.png'],
  ['public/generated-icons/android/icon-48.png', 'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png'],
  ['public/generated-icons/android/icon-72.png', 'android/app/src/main/res/mipmap-hdpi/ic_launcher.png'],
  ['public/generated-icons/android/icon-72.png', 'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png'],
  ['public/generated-icons/android/icon-96.png', 'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png'],
  ['public/generated-icons/android/icon-96.png', 'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png'],
  ['public/generated-icons/android/icon-144.png', 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png'],
  ['public/generated-icons/android/icon-144.png', 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png'],
  ['public/generated-icons/android/icon-192.png', 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png'],
  ['public/generated-icons/android/icon-192.png', 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png'],
  [
    'public/generated-icons/android-adaptive/foreground-432.png',
    'android/app/src/main/res/drawable-nodpi/ic_launcher_foreground.png',
  ],
  [
    'public/generated-icons/android-adaptive/background-432.png',
    'android/app/src/main/res/drawable-nodpi/ic_launcher_background.png',
  ],
  [
    'public/generated-splash/android/splash-1080x1920.png',
    'android/app/src/main/res/drawable-nodpi/harupuli_splash.png',
  ],
  [
    'public/generated-splash/android/splash-icon-432.png',
    'android/app/src/main/res/drawable-nodpi/harupuli_splash_icon.png',
  ],
];

const adaptiveIconXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>
`;

function resolvePath(relativePath) {
  return path.join(projectRoot, relativePath);
}

function ensureDirForFile(relativePath) {
  fs.mkdirSync(path.dirname(resolvePath(relativePath)), { recursive: true });
}

for (const [source, target] of copyTargets) {
  const sourcePath = resolvePath(source);
  const targetPath = resolvePath(target);

  if (!fs.existsSync(sourcePath)) {
    failures.push(`Missing source asset: ${source}`);
    continue;
  }

  ensureDirForFile(target);
  fs.copyFileSync(sourcePath, targetPath);
}

const adaptiveXmlTargets = [
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
  'android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
];

for (const target of adaptiveXmlTargets) {
  ensureDirForFile(target);
  fs.writeFileSync(resolvePath(target), adaptiveIconXml, 'utf8');
}

if (failures.length > 0) {
  console.error('Android resource assets apply failed');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exitCode = 1;
} else {
  console.log('Android resource assets applied');
}
