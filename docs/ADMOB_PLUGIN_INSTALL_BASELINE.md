# AdMob Plugin Install Baseline

- Verification date: 2026-07-27
- PR type: dependency / Android native integration baseline
- AdMob plugin version selection: Completed
- AdMob plugin dependency installation: Completed
- Capacitor Android plugin sync: Completed
- Mobile Ads SDK dependency resolution: Completed
- Mobile Ads SDK resolved version: 24.9.0
- UMP SDK dependency resolution: Completed
- UMP SDK resolved version: 4.0.0
- Debug Gradle build: Completed
- Release Gradle build verification: Blocked by the existing release-signing environment guard
- Debug merged manifest inspection: Completed
- Release merged manifest inspection: Blocked by the existing release-signing environment guard

## Purpose and scope

This baseline installs the exact Capacitor community AdMob plugin, synchronizes
its Android module, and verifies the debug dependency and manifest effects. It
does not configure identifiers, initialize either SDK at runtime, implement a
consent flow, request an ad, display an ad, or change either Console.

## Starting baseline

- Repository: `daniel-oh55/saju_fortune`
- Starting `main` HEAD: `d1d1ff5d6e3256ad6326c6e17e4e57b9d76bbe97`
- PR #404: merged; its merge commit is the starting HEAD.
- Capacitor core / Android / CLI: 8.4.0 / 8.4.0 / 8.4.0
- React / Vite: 18.3.1 / 6.4.2
- Local Node / initial JDK: 24.15.0 / Temurin 17.0.19
- Verification JDK / CI: Temurin 21.0.11 / Node 22 and Temurin 21
- Android SDK: min 24, compile 36, target 36
- Android build: AGP 8.13.0, Gradle 8.14.3, Java source/target 21
- Kotlin: no app Kotlin plugin or source; plugin-internal Kotlin 2.2.20
- Existing synchronized Capacitor plugin: `@capacitor/app@8.1.0`

The starting dependency tree and Android source contained no AdMob plugin,
Mobile Ads SDK, UMP SDK, App ID metadata, native runtime calls, or real ad
requests. Existing rewarded-ad components remain mock/provider scaffolding.

## Installed package

`@capacitor-community/admob@8.0.0` is installed as the exact dependency
`8.0.0`, without a caret or tilde. Existing React, Vite, and Capacitor versions
did not change.

## Package-lock verification

The root dependency entry and `node_modules/@capacitor-community/admob` entry
both resolve to 8.0.0. The registry tarball URL and SHA-512 integrity value are
present. The only new lockfile packages are the plugin and its package-metadata
tooling dependency tree.

## Android plugin registration

`npx cap sync android` registered `:capacitor-community-admob` in
`android/capacitor.settings.gradle` and added it to
`android/app/capacitor.build.gradle`. The sync also restored generated
registration for the already installed `@capacitor/app` plugin. No manual
`MainActivity` registration was added.

## Exact Android dependency pins

The existing `android/variables.gradle` extension now sets:

- `playServicesAdsVersion = '24.9.0'`
- `userMessagingPlatformVersion = '4.0.0'`

SDK levels, AGP, Gradle, Java, Kotlin, and AndroidX versions remain unchanged.

## Resolved dependency tree

`debugRuntimeClasspath` resolved
`com.google.android.gms:play-services-ads:24.9.0` directly from
`:capacitor-community-admob`.

It resolved `com.google.android.ump:user-messaging-platform:4.0.0` directly
from the plugin. `dependencyInsight` records conflict resolution between the
direct 4.0.0 pin and Mobile Ads API's transitive 3.2.0 request, selecting
4.0.0. No floating or 25.x Mobile Ads version was resolved.

`releaseRuntimeClasspath` could not be resolved because the existing app
Gradle script rejects every release-named task when release-signing environment
variables are absent. The same command fails at the same line on a detached
`origin/main` worktree before plugin resolution, so this is not a plugin
dependency regression.

## Debug build verification

With an external temporary Temurin 21 JDK and Android SDK 36, `clean` and
`assembleDebug` completed. The debug APK was generated for build verification
only; no APK installation or device QA was performed.

## Release build verification

`assembleRelease` stopped during app Gradle evaluation with
`Release signing environment variables are required for release builds.` The
same failure reproduces on `origin/main`. No signing variables, keystore,
signing configuration, AAB, upload, or release-completion claim was added.

## Debug merged manifest observations

`processDebugMainManifest` completed. The generated debug merged manifest
contains the SDK-provided Advertising ID permission and Google Mobile Ads
`AdActivity`, `MobileAdsInitProvider`, `AdService`, and related SDK components.
It contains no Mobile Ads App ID metadata and no real AdMob identifier. No
distinct UMP activity, service, or provider was added.

## Release merged manifest observations

`processReleaseMainManifest` is blocked by the same existing release-signing
environment guard and fails identically on `origin/main`. No release merged
manifest result is claimed or inferred from the debug variant.

## Advertising ID impact

The debug merged manifest contains
`com.google.android.gms.permission.AD_ID`, inherited from the Mobile Ads SDK,
and `android.permission.ACCESS_ADSERVICES_AD_ID`. The source manifest remains
unchanged. This observation does not complete the Google Play Advertising ID
declaration or Data safety work.

## Application ID status

AdMob App ID configuration: Not started. The source and debug merged manifests
contain no `com.google.android.gms.ads.APPLICATION_ID` metadata. There are no
App IDs, ad unit IDs, sample IDs, or test-device identifiers in this change.

## Runtime integration status

- Mobile Ads SDK runtime initialization: Not started
- UMP consent flow integration: Not started
- Consent information request: Not started
- Consent form presentation: Not started
- Privacy options runtime UI: Not started
- Official test-ad request: Not started
- Android device AdMob QA: Not started
- Production ad units: 0
- Actual ad requests: No data
- Actual ad serving: Pending

## Files changed

- Dependency manifest and lockfile
- Exact Android SDK variables
- Capacitor-generated Android Gradle registration files
- This baseline document, project logs, and its targeted checker

## Files intentionally unchanged

Production `src` and `public` files, Capacitor/Vite configuration, source
Android manifest, strings, `MainActivity`, app Gradle file, Gradle wrapper,
workflows, privacy policy, `app-ads.txt`, routing, storage, schema, and fortune
logic are unchanged.

## Rollback plan

Revert this PR commit, run `npm ci`, rebuild the web bundle, and run
`npx cap sync android`. Confirm that the AdMob module registration and both
exact SDK variables disappear, then rerun the existing web and Android checks.
No Console or production identifier rollback is needed because none changed.

## Blocking conditions

- Release dependency, build, and merged-manifest verification remain blocked
  until approved release-signing variables are available.
- Runtime work remains blocked until App ID injection, consent coordination,
  test-only configuration, privacy entry point, and Console work are separately
  approved.
- A production identifier, floating dependency, source change, or claim that
  the pending runtime/Console work is complete blocks this baseline.

## Pending work

- AdMob App ID configuration: Not started
- Mobile Ads SDK runtime initialization: Not started
- UMP consent flow integration: Not started
- Privacy options runtime UI: Not started
- Official test-ad request: Not started
- Android device AdMob QA: Not started
- European regulations message publication: Not started
- Google Play Data safety update: Not started
- Advertising ID declaration: Not started
- Production ad units: 0
- Actual ad requests: No data
- Actual ad serving: Pending
- First advertising app update: Pending

## Official references

- [v8.0.0 package metadata](https://github.com/capacitor-community/admob/blob/v8.0.0/package.json)
- [v8.0.0 Android build](https://github.com/capacitor-community/admob/blob/v8.0.0/android/build.gradle)
- [Google Mobile Ads Android release notes](https://developers.google.com/admob/android/rel-notes)
- [Google UMP Android setup](https://developers.google.com/admob/android/privacy)
- [Google Mobile Ads Android quick start](https://developers.google.com/admob/android/quick-start)
- [Google test ads](https://developers.google.com/admob/android/test-ads)
