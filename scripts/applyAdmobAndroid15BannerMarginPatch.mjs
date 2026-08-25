#!/usr/bin/env node
/**
 * Deterministic, repository-owned correction of the Android 15+ Banner bottom
 * clearance in the installed @capacitor-community/admob 8.0.0 Android source.
 *
 * Why this exists:
 *   android/capacitor.settings.gradle points the Gradle module directly at
 *   node_modules/@capacitor-community/admob/android, so the installed plugin
 *   source is the effective source for both QA and release Android builds.
 *   Released 8.0.0 installs an Android 15+ WindowInsets listener on the Activity
 *   decor view *before* the configured Banner margins are calculated, and that
 *   listener then overwrites those margins with the bare system inset. Upstream
 *   PR #431 (merge commit 86a3347594f41af5b3ec14b18fb7df2b76bc023c) reordered
 *   the two so the configured margin is preserved and the system inset is added
 *   on top of it. That change is published: the known historical release v8.1.0
 *   (2026-08-14) does contain PR #431, and its BannerExecutor still computes the
 *   configured density margin and then adds the Android system inset on top of
 *   it from an Activity DecorView OnApplyWindowInsetsListener. Harupuli stays
 *   pinned to 8.0.0, so this correction is derived against 8.0.0 only.
 *
 * Why this repository no longer backports PR #431 as-is:
 *   Round-4 Android 16 / API 36 real-device QA (Galaxy S23 Ultra) of the
 *   PR #431 backport showed the Banner clearing the BottomNav but leaving an
 *   excessive Banner-to-BottomNav gap, consistent with the native bottom system
 *   inset being *additional* to clearance this app already owns. Harupuli only
 *   ever shows a BOTTOM_CENTER Banner -- src/services/bannerAdService.js holds
 *   the single native showBanner call site and hard-codes
 *   BannerAdPosition.BOTTOM_CENTER, and scripts/checkAdmobBannerProvider.mjs
 *   enforces that as a durable invariant across all production src sources,
 *   failing closed on a second native show call, a show call outside the Banner
 *   adapter, or a reachable TOP_CENTER/CENTER position --
 *   and it already passes its full bottom clearance -- live BottomNav height +
 *   BottomNav base offset + visual gap -- through the `margin` option. Adding
 *   the Android system bottom inset to that double-counts the navigation-bar
 *   area, so this patch stops the plugin from adding it.
 *
 *   Because BOTTOM_CENTER is the only position this app can reach, no Android
 *   15+ inset callback is needed at all, and the patched source therefore does
 *   not install one. That also avoids the Activity decor-view listener
 *   ownership hazard reported in capacitor-community/admob#427 (OPEN), where
 *   the maintainer confirmed the decor-view scope is too broad, is not restored
 *   when the Banner is removed, and should be owned by mAdViewLayout instead.
 *
 *   This is an app-specific correction for Harupuli's BOTTOM_CENTER path. It is
 *   NOT a claim that upstream PR #431 is generally incorrect: an app that lets
 *   the plugin own its safe-area clearance still needs the system inset.
 *
 * Scope: only the Android 15+ inset behavior in BannerExecutor.showBanner. The
 * configured density-adjusted margin and the horizontal centering margin are
 * left exactly as released 8.0.0 computes them. Nothing else is changed.
 *
 * Upgrade / removal policy:
 *   This patch targets exactly 8.0.0 and the version gate below fails closed on
 *   every other installed version. A dependency upgrade must therefore force an
 *   explicit reassessment against the exact target release, not a silent
 *   carry-over.
 *
 *   Do NOT remove this patcher and the package.json postinstall hook merely
 *   because a newer release contains upstream PR #431. v8.1.0 is the concrete
 *   counter-example: it carries PR #431 and is exactly the additive
 *   system-inset behavior this app-specific correction exists to avoid, so
 *   upgrading to it would restore the duplicate bottom clearance rather than
 *   fix it.
 *
 *   Removal is allowed only after the target plugin release is independently
 *   verified to satisfy Harupuli's Banner inset-ownership contract, at minimum:
 *     - configured BOTTOM_CENTER margin ownership behaves correctly for this app
 *     - no extra native bottom system inset produces duplicate clearance
 *     - the relevant Android 15/16 inset and DecorView listener behavior is
 *       acceptable for this app
 *     - real-device Round QA regression evidence supports the removal
 *   Until that verification exists, re-derive this correction against the new
 *   source instead of deleting it.
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
const UPSTREAM_INSET_OWNERSHIP_ISSUE = 'capacitor-community/admob#427';

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
const RELEASED_BLOCK = `            // set Safe Area only for Android 15+
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

/**
 * Exact superseded state produced by this repository's previous PR #431 backport:
 * configured margins first, system insets added on top of them. Recognized only so
 * that an already-installed tree migrates deterministically to the final state; it
 * is never an acceptable end state for --check.
 */
const SUPERSEDED_ADDITIVE_INSET_BLOCK = `            mAdViewLayout.setLayoutParams(mAdViewLayoutParams);

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

/**
 * Final state: released 8.0.0 margin math untouched, Android 15+ inset callback
 * not installed. The leading comment is part of the exact match so this state is
 * distinguishable from released 8.0.0, whose margin math is otherwise identical.
 */
const FINAL_BLOCK = `            mAdViewLayout.setLayoutParams(mAdViewLayoutParams);

            // Harupuli app-specific Android 15+ Banner clearance ownership.
            // The released 8.0.0 / upstream PR #431 window-inset callback is
            // intentionally not installed here. This app only ever shows a
            // BOTTOM_CENTER Banner and already passes its full bottom clearance
            // (BottomNav height + BottomNav base offset + visual gap) through
            // adOptions.margin, so adding the Android system bottom inset on top
            // of that double-counts the navigation-bar area. Not installing the
            // callback also avoids the Activity decor-view listener ownership
            // hazard reported in capacitor-community/admob#427.
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

/**
 * Substrings that must not survive anywhere in the patched source. Together they
 * prove that neither the released overwrite-only inset margins, nor the
 * superseded additive inset margins, nor any Android 15+ inset callback remain.
 * None of these appear elsewhere in released 8.0.0 BannerExecutor.java.
 */
const FORBIDDEN_MARKERS = [
  ['mAdViewLayoutParams.setMargins(0, topInset, 0, 0);', 'released 8.0.0 overwrite-only top inset margin'],
  ['mAdViewLayoutParams.setMargins(0, 0, 0, bottomInset);', 'released 8.0.0 overwrite-only bottom inset margin'],
  ['margins[1] + topInset', 'superseded additive top system inset'],
  ['margins[3] + bottomInset', 'superseded additive bottom system inset'],
  ['setOnApplyWindowInsetsListener', `Android 15+ inset callback (${UPSTREAM_INSET_OWNERSHIP_ISSUE} ownership hazard)`],
  ['getDecorView', 'Activity decor view acquired for the inset callback'],
  ['getSystemWindowInsetBottom', 'system bottom inset read'],
  ['getSystemWindowInsetTop', 'system top inset read'],
  ['VANILLA_ICE_CREAM', 'Android 15+ inset branch'],
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
        'run npm ci before applying the Android 15 Banner inset correction'
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
      `installed @capacitor-community/admob version is "${version || 'unknown'}" but this patch targets exactly ` +
        `${REQUIRED_PLUGIN_VERSION}. Inspect the target plugin release's BannerExecutor and re-derive this ` +
        'app-specific Android 15+ Banner inset correction against that exact source. Do NOT delete this script ' +
        'and the package.json postinstall hook merely because the target release contains upstream PR #431: the ' +
        'known historical release 8.1.0 does contain it and still adds the Android system bottom inset on top of ' +
        'the configured margin via a DecorView inset listener. Remove them only once the target release is ' +
        "independently verified to satisfy Harupuli's Banner inset-ownership contract -- configured BOTTOM_CENTER " +
        'margin ownership correct for this app, no extra native bottom system inset producing duplicate ' +
        'clearance, acceptable Android 15/16 inset and listener behavior, and real-device Round QA regression ' +
        'evidence supporting the removal.'
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

function classify(source) {
  return {
    final: countOccurrences(source, FINAL_BLOCK),
    released: countOccurrences(source, RELEASED_BLOCK),
    superseded: countOccurrences(source, SUPERSEDED_ADDITIVE_INSET_BLOCK),
  };
}

function assertUnambiguous(counts) {
  const present = [
    ['final', counts.final],
    ['released 8.0.0', counts.released],
    ['superseded PR #431 backport', counts.superseded],
  ].filter(([, count]) => count > 0);

  if (present.length > 1) {
    fail(
      'installed BannerExecutor.java contains more than one recognized Android 15 Banner margin state (' +
        present.map(([name, count]) => `${name} x${count}`).join(', ') +
        '); the source is ambiguous, refusing to modify it'
    );
  }

  const [state] = present;
  if (state && state[1] > 1) {
    fail(
      `expected at most 1 ${state[0]} Android 15 Banner margin block but found ${state[1]}; the source is ` +
        'ambiguous, refusing to modify it'
    );
  }
}

function assertFinalStructure(source, stage) {
  const counts = classify(source);

  if (counts.final !== 1) {
    fail(
      `${stage}: expected exactly 1 Harupuli Android 15 Banner inset block but found ${counts.final} in ` +
        path.relative(repositoryRoot, bannerExecutorPath)
    );
  }
  if (counts.released !== 0) {
    fail(`${stage}: the unpatched released 8.0.0 Banner margin block is still present`);
  }
  if (counts.superseded !== 0) {
    fail(`${stage}: the superseded PR #431 additive-inset Banner margin block is still present`);
  }

  for (const [marker, why] of FORBIDDEN_MARKERS) {
    if (source.includes(marker)) {
      fail(`${stage}: ${why} is still present: ${marker}`);
    }
  }
}

function main() {
  const { checkOnly } = parseArgs(process.argv.slice(2));
  const version = readPluginVersion();
  const { source, usesCrlf } = readBannerExecutor();

  const counts = classify(source);
  assertUnambiguous(counts);

  if (checkOnly) {
    if (counts.final === 0) {
      if (counts.released > 0) {
        fail(
          `installed @capacitor-community/admob ${version} BannerExecutor.java is unpatched; run ` +
            'node scripts/applyAdmobAndroid15BannerMarginPatch.mjs (npm ci runs it via postinstall)'
        );
      }
      if (counts.superseded > 0) {
        fail(
          `installed @capacitor-community/admob ${version} BannerExecutor.java still carries the superseded ` +
            'PR #431 additive-inset backport, which adds the Android system bottom inset on top of the ' +
            'configured BOTTOM_CENTER Banner margin; run node scripts/applyAdmobAndroid15BannerMarginPatch.mjs'
        );
      }
      fail(
        'installed BannerExecutor.java matches neither the expected released 8.0.0 source nor any state this ' +
          'patch produces; the Android 15 Banner inset correction must be re-derived'
      );
    }
    assertFinalStructure(source, 'check');
    info(
      `PASS: @capacitor-community/admob ${version} BannerExecutor.java preserves the configured density-adjusted ` +
        'Banner margin and adds no Android system inset to the BOTTOM_CENTER bottom margin'
    );
    return;
  }

  if (counts.final > 0) {
    assertFinalStructure(source, 'verify');
    info(`already patched: @capacitor-community/admob ${version} BannerExecutor.java left unchanged`);
    return;
  }

  let patchedSource;
  if (counts.released === 1) {
    patchedSource = source.replace(RELEASED_BLOCK, FINAL_BLOCK);
  } else if (counts.superseded === 1) {
    patchedSource = source.replace(SUPERSEDED_ADDITIVE_INSET_BLOCK, FINAL_BLOCK);
  } else {
    fail(
      `installed @capacitor-community/admob ${version} BannerExecutor.java does not match the expected released ` +
        '8.0.0 Banner margin block; refusing to patch an unrecognized source'
    );
  }

  assertFinalStructure(patchedSource, 'post-patch verification');

  writeFileSync(bannerExecutorPath, usesCrlf ? patchedSource.replace(/\n/g, '\r\n') : patchedSource, 'utf8');

  const written = readBannerExecutor();
  assertFinalStructure(written.source, 'post-write verification');

  info(
    `applied: @capacitor-community/admob ${version} BannerExecutor.java now uses the configured density-adjusted ` +
      'Banner margin as the final BOTTOM_CENTER clearance and installs no Android 15+ inset callback ' +
      `(app-specific correction; see ${UPSTREAM_INSET_OWNERSHIP_ISSUE})`
  );
}

main();
