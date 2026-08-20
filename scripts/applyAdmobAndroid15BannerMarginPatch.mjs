#!/usr/bin/env node
/**
 * Deterministic, repository-owned backport of the Android 15+ Banner margin fix
 * from capacitor-community/admob PR #431 ("Fix: calculate banner margins
 * correctly for Android 15+ / #390", merge commit
 * 86a3347594f41af5b3ec14b18fb7df2b76bc023c) onto the installed
 * @capacitor-community/admob 8.0.0 Android source.
 *
 * Why this exists:
 *   android/capacitor.settings.gradle points the Gradle module directly at
 *   node_modules/@capacitor-community/admob/android, so the installed plugin
 *   source is the effective source for both QA and release Android builds.
 *   Released 8.0.0 installs its Android 15+ WindowInsets listener *before* the
 *   configured Banner margins are calculated, and the listener then overwrites
 *   those margins with the bare system inset. Upstream fixed this after 8.0.0
 *   was published and no newer release exists on npm yet.
 *
 * Scope: only the PR #431 margin-preservation behavior, so that the configured
 * Banner margin and the Android system inset become additive instead of
 * mutually replacing each other. Nothing else from upstream is backported.
 *
 * Remove this patcher and the package.json postinstall hook as soon as
 * @capacitor-community/admob is upgraded to a release that already contains the
 * fix; the version gate below fails closed until that happens.
 *
 * Usage:
 *   node scripts/applyAdmobAndroid15BannerMarginPatch.mjs           # apply, idempotent
 *   node scripts/applyAdmobAndroid15BannerMarginPatch.mjs --check   # verify only, never writes
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_NAME = 'applyAdmobAndroid15BannerMarginPatch';
const REQUIRED_PLUGIN_VERSION = '8.0.0';
const UPSTREAM_PROVENANCE =
  'capacitor-community/admob PR #431 (merge commit 86a3347594f41af5b3ec14b18fb7df2b76bc023c)';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pluginRoot = path.join(repositoryRoot, 'node_modules', '@capacitor-community', 'admob');
const pluginPackageJsonPath = path.join(pluginRoot, 'package.json');
const bannerExecutorPath = path.join(
  pluginRoot,
  'android',
  'src',
  'main',
  'java',
  'com',
  'getcapacitor',
  'community',
  'admob',
  'banner',
  'BannerExecutor.java'
);

/** Exact released 8.0.0 block: inset listener installed before the configured margins. */
const UNPATCHED_BLOCK = `            // set Safe Area only for Android 15+
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM) {
                View rootView = activitySupplier.get().getWindow().getDecorView();
                rootView.setOnApplyWindowInsetsListener((v, insets) -> {
                    int bottomInset = insets.getSystemWindowInsetBottom();
                    int topInset = insets.getSystemWindowInsetTop();

                    if ("TOP_CENTER".equals(adOptions.position)) {
                        mAdViewLayoutParams.setMargins(0, topInset, 0, 0);
                    } else {
                        mAdViewLayoutParams.setMargins(0, 0, 0, bottomInset);
                    }

                    mAdViewLayout.setLayoutParams(mAdViewLayoutParams);
                    return insets;
                });
            }

            mAdViewLayout.setLayoutParams(mAdViewLayoutParams);

            int densityMargin = (int) (adOptions.margin * density);

            // Center Banner Ads
            int adWidth = (int) (adOptions.adSize.getSize().getWidth() * density);

            if (adWidth <= 0 || adOptions.adSize.toString().equals("ADAPTIVE_BANNER")) {
                int margin = 0;
                if (fullscreen) {
                    margin = (realWidthPixels - defaultWidthPixels) / 2;
                }
                mAdViewLayoutParams.setMargins(margin, densityMargin, margin, densityMargin);
            } else {
                int sideMargin = ((int) defaultWidthPixels - adWidth) / 2;
                if (fullscreen) {
                    sideMargin = (realWidthPixels - adWidth) / 2;
                }
                mAdViewLayoutParams.setMargins(sideMargin, densityMargin, sideMargin, densityMargin);
            }
`;

/** Exact upstream PR #431 block: configured margins first, insets added on top of them. */
const PATCHED_BLOCK = `            mAdViewLayout.setLayoutParams(mAdViewLayoutParams);

            int densityMargin = (int) (adOptions.margin * density);
            int[] margins = new int[] { 0, densityMargin, 0, densityMargin };

            // Center Banner Ads
            int adWidth = (int) (adOptions.adSize.getSize().getWidth() * density);

            if (adWidth <= 0 || adOptions.adSize.toString().equals("ADAPTIVE_BANNER")) {
                int margin = 0;
                if (fullscreen) {
                    margin = (realWidthPixels - defaultWidthPixels) / 2;
                }
                margins[0] = margin;
                margins[2] = margin;
                mAdViewLayoutParams.setMargins(margin, densityMargin, margin, densityMargin);
            } else {
                int sideMargin = ((int) defaultWidthPixels - adWidth) / 2;
                if (fullscreen) {
                    sideMargin = (realWidthPixels - adWidth) / 2;
                }
                margins[0] = sideMargin;
                margins[2] = sideMargin;
                mAdViewLayoutParams.setMargins(sideMargin, densityMargin, sideMargin, densityMargin);
            }

            // set Safe Area only for Android 15+
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM) {
                View rootView = activitySupplier.get().getWindow().getDecorView();
                rootView.setOnApplyWindowInsetsListener((v, insets) -> {
                    int bottomInset = insets.getSystemWindowInsetBottom();
                    int topInset = insets.getSystemWindowInsetTop();

                    if ("TOP_CENTER".equals(adOptions.position)) {
                        mAdViewLayoutParams.setMargins(margins[0], margins[1] + topInset, margins[2], margins[3]);
                    } else {
                        mAdViewLayoutParams.setMargins(margins[0], margins[1], margins[2], margins[3] + bottomInset);
                    }

                    mAdViewLayout.setLayoutParams(mAdViewLayoutParams);
                    return insets;
                });
            }
`;

/** Overwrite-only inset margin calls that must not survive anywhere in the patched source. */
const OVERWRITE_ONLY_MARKERS = [
  'mAdViewLayoutParams.setMargins(0, topInset, 0, 0);',
  'mAdViewLayoutParams.setMargins(0, 0, 0, bottomInset);'
];

function fail(message) {
  console.error(`[${SCRIPT_NAME}] FAIL: ${message}`);
  process.exit(1);
}

function info(message) {
  console.log(`[${SCRIPT_NAME}] ${message}`);
}

function countOccurrences(haystack, needle) {
  let count = 0;
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    count += 1;
    index = haystack.indexOf(needle, index + needle.length);
  }
  return count;
}

function parseArgs(argv) {
  let checkOnly = false;
  for (const arg of argv) {
    if (arg === '--check') {
      checkOnly = true;
      continue;
    }
    fail(`unknown argument "${arg}"; supported usage is no arguments (apply) or --check (verify only)`);
  }
  return { checkOnly };
}

function readPluginVersion() {
  if (!existsSync(pluginPackageJsonPath)) {
    fail(
      `@capacitor-community/admob is not installed at ${path.relative(repositoryRoot, pluginRoot)}; ` +
        'run npm ci before applying the Android 15 Banner margin backport'
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(pluginPackageJsonPath, 'utf8'));
  } catch (error) {
    fail(`could not parse the installed plugin package.json: ${error.message}`);
  }

  const version = typeof parsed.version === 'string' ? parsed.version : '';
  if (version !== REQUIRED_PLUGIN_VERSION) {
    fail(
      `installed @capacitor-community/admob version is "${version || 'unknown'}" but this backport targets ` +
        `exactly ${REQUIRED_PLUGIN_VERSION}. Reassess the backport against the new plugin release: if it already ` +
        `contains ${UPSTREAM_PROVENANCE}, delete this script and the package.json postinstall hook; otherwise ` +
        're-derive the patch against the new source.'
    );
  }

  return version;
}

function readBannerExecutor() {
  if (!existsSync(bannerExecutorPath)) {
    fail(`expected plugin source is missing: ${path.relative(repositoryRoot, bannerExecutorPath)}`);
  }

  const raw = readFileSync(bannerExecutorPath, 'utf8');
  const usesCrlf = raw.includes('\r\n');
  return { source: usesCrlf ? raw.replace(/\r\n/g, '\n') : raw, usesCrlf };
}

function assertPatchedStructure(source, stage) {
  const patchedCount = countOccurrences(source, PATCHED_BLOCK);
  if (patchedCount !== 1) {
    fail(
      `${stage}: expected exactly 1 patched Android 15 Banner margin block but found ${patchedCount} in ` +
        path.relative(repositoryRoot, bannerExecutorPath)
    );
  }

  if (countOccurrences(source, UNPATCHED_BLOCK) !== 0) {
    fail(`${stage}: the unpatched released 8.0.0 Banner margin block is still present`);
  }

  for (const marker of OVERWRITE_ONLY_MARKERS) {
    if (source.includes(marker)) {
      fail(`${stage}: overwrite-only inset margin call is still present: ${marker}`);
    }
  }
}

function main() {
  const { checkOnly } = parseArgs(process.argv.slice(2));
  const version = readPluginVersion();
  const { source, usesCrlf } = readBannerExecutor();

  const patchedCount = countOccurrences(source, PATCHED_BLOCK);
  const unpatchedCount = countOccurrences(source, UNPATCHED_BLOCK);

  if (patchedCount > 0 && unpatchedCount > 0) {
    fail(
      'installed BannerExecutor.java contains both patched and unpatched Android 15 Banner margin blocks; ' +
        'the source is ambiguous, refusing to modify it'
    );
  }

  if (checkOnly) {
    if (patchedCount === 0) {
      fail(
        unpatchedCount > 0
          ? `installed @capacitor-community/admob ${version} BannerExecutor.java is unpatched; run ` +
            'node scripts/applyAdmobAndroid15BannerMarginPatch.mjs (npm ci runs it via postinstall)'
          : 'installed BannerExecutor.java matches neither the expected released 8.0.0 source nor the expected ' +
            'patched source; the Android 15 Banner margin backport must be re-derived'
      );
    }
    assertPatchedStructure(source, 'check');
    info(
      `PASS: @capacitor-community/admob ${version} BannerExecutor.java carries the Android 15 Banner margin ` +
        `backport from ${UPSTREAM_PROVENANCE}`
    );
    return;
  }

  if (patchedCount > 0) {
    assertPatchedStructure(source, 'verify');
    info(`already patched: @capacitor-community/admob ${version} BannerExecutor.java left unchanged`);
    return;
  }

  if (unpatchedCount === 0) {
    fail(
      `installed @capacitor-community/admob ${version} BannerExecutor.java does not match the expected released ` +
        '8.0.0 Banner margin block; refusing to patch an unrecognized source'
    );
  }

  if (unpatchedCount > 1) {
    fail(
      `expected exactly 1 released 8.0.0 Banner margin block but found ${unpatchedCount}; the replacement would ` +
        'be ambiguous, refusing to modify the source'
    );
  }

  const patchedSource = source.replace(UNPATCHED_BLOCK, PATCHED_BLOCK);
  assertPatchedStructure(patchedSource, 'post-patch verification');

  writeFileSync(bannerExecutorPath, usesCrlf ? patchedSource.replace(/\n/g, '\r\n') : patchedSource, 'utf8');

  const written = readBannerExecutor();
  assertPatchedStructure(written.source, 'post-write verification');

  info(
    `applied: @capacitor-community/admob ${version} BannerExecutor.java now preserves the configured Banner ` +
      `margin and adds the Android 15+ system inset on top of it (backport of ${UPSTREAM_PROVENANCE})`
  );
}

main();
