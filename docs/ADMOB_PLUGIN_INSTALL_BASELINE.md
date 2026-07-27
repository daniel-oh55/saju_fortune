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
- AdMob App ID configuration: Completed
- Debug Gradle build after App ID configuration: Completed
- Debug merged manifest App ID verification: Completed
- Debug APK artifact generation: Completed
- Debug APK artifact download: Completed
- Debug APK installation: Completed
- Android app launch QA after App ID configuration: Completed
- Android startup smoke QA: Pass
- ADB logcat verification: Not performed
- Full Android regression QA: Not completed
- Release Gradle build verification: Blocked by the existing release-signing environment guard
- Release merged manifest inspection: Blocked by the existing release-signing environment guard

## Purpose and scope

This baseline installs the exact Capacitor community AdMob plugin, synchronizes
its Android module, pins the selected Android SDK versions, and configures the
approved Harupuli AdMob App ID through an Android string resource referenced by
the source manifest.

It does not initialize either SDK at runtime, implement a consent flow, request
an ad, display an ad, configure an ad unit, add a test-device identifier, or
change either the AdMob Console or Google Play Console.

The official privacy-options label remains:

`개인정보 및 쿠키 설정`

## Starting baseline

- Repository: `daniel-oh55/saju_fortune`
- Starting `main` HEAD: `d1d1ff5d6e3256ad6326c6e17e4e57b9d76bbe97`
- PR #404: merged; its merge commit is the starting HEAD.
- Capacitor core / Android / CLI: 8.4.0 / 8.4.0 / 8.4.0
- React / Vite: 18.3.1 / 6.4.2
- Android SDK: min 24, compile 36, target 36
- Android build: AGP 8.13.0, Gradle 8.14.3, Java source/target 21
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
present.

## Android plugin registration

`npx cap sync android` registered `:capacitor-community-admob` in
`android/capacitor.settings.gradle` and added it to
`android/app/capacitor.build.gradle`. The sync also restored generated
registration for the already installed `@capacitor/app` plugin. No manual
`MainActivity` registration was added.

## Exact Android dependency pins

The existing `android/variables.gradle` extension sets:

- `playServicesAdsVersion = '24.9.0'`
- `userMessagingPlatformVersion = '4.0.0'`

SDK levels, AGP, Gradle, Java, Kotlin, and AndroidX versions remain unchanged.

## Resolved dependency tree

`debugRuntimeClasspath` resolved
`com.google.android.gms:play-services-ads:24.9.0` directly from
`:capacitor-community-admob`.

It resolved `com.google.android.ump:user-messaging-platform:4.0.0` directly
from the plugin. `dependencyInsight` recorded conflict resolution between the
direct 4.0.0 pin and Mobile Ads API's transitive 3.2.0 request, selecting
4.0.0. No floating or 25.x Mobile Ads version was resolved.

`releaseRuntimeClasspath` could not be resolved because the existing app
Gradle script rejects release-named tasks when release-signing environment
variables are absent. The same behavior was reproduced on `origin/main` before
this App ID update.

## Debug build verification

Android Debug Build run #345 completed successfully for tested HEAD
`07f85a8dfe2b9fbc6551b25dd6731c81ee04d231`.

- Workflow run ID: `30230115096`
- Artifact name: `harupuli-debug-apk`
- Artifact ID: `8639819148`
- Artifact digest: `sha256:4290933add6503a9fe55c8ca02514660fa7f3936b9529f9d06503dfaa196bb26`

The artifact was downloaded, installed on a Galaxy S23 Ultra, and launched to
the home screen without an immediate force close.

## Release build verification

`assembleRelease` remains blocked by the existing release-signing environment
guard. No signing variables, keystore, signing configuration, signed APK, AAB,
upload, or release-completion claim was added in this PR.

## Debug merged manifest observations

The run #345 Debug APK was inspected directly. Its compiled manifest contains
exactly one `com.google.android.gms.ads.APPLICATION_ID` metadata element whose
value references resource ID `0x7f0d001b`.

The APK resource table resolves that resource ID to:

- Resource key: `admob_app_id`
- Resource value: `ca-app-pub-9536468405324805~1921427615`

The compiled manifest also contains `MobileAdsInitProvider` and inherited
Advertising ID permissions. The source manifest does not manually declare
those permissions.

## Release merged manifest observations

`processReleaseMainManifest` remains blocked by the same existing
release-signing environment guard. No release merged-manifest result is claimed
or inferred from the debug variant.

## Advertising ID impact

The compiled debug manifest inherits
`com.google.android.gms.permission.AD_ID` and
`android.permission.ACCESS_ADSERVICES_AD_ID` from the Mobile Ads SDK. Neither
permission is manually declared in the source manifest. This observation does
not complete the Google Play Advertising ID declaration or Data safety work.

## Application ID status

AdMob App ID configuration: Completed.

- Android package: `com.harupuli.app`
- Resource name: `admob_app_id`
- Configured App ID: `ca-app-pub-9536468405324805~1921427615`
- Source manifest metadata name: `com.google.android.gms.ads.APPLICATION_ID`
- Source manifest metadata value: `@string/admob_app_id`
- Compiled APK metadata resource: `0x7f0d001b`
- Compiled APK resource value: `ca-app-pub-9536468405324805~1921427615`
- Google sample App ID: not used
- Ad unit ID: not added
- Test-device identifier: not added
- Placeholder value: not used

The App ID was provided by the user as the value copied for the Harupuli app in
AdMob. It is an application identifier embedded in the Android package, not an
API secret.

## Runtime integration status

- Mobile Ads SDK runtime initialization: Not started
- UMP consent flow integration: Not started
- Consent information request: Not started
- Consent form presentation: Not started
- Privacy options runtime UI: Not started
- Official test-ad request: Not started
- Android advertising QA: Not started
- Production ad units: 0
- Actual ad requests: No data
- Actual ad serving: Pending

The user completed a startup smoke QA on a Galaxy S23 Ultra. The app launched to
the home screen, no immediate force close was observed, and no
`Missing application ID` error was observed during actual launch. ADB logcat
verification and full Android regression QA were not performed.

## Files changed

- Dependency manifest and lockfile
- Exact Android SDK variables
- Capacitor-generated Android Gradle registration files
- `android/app/src/main/AndroidManifest.xml`
- `android/app/src/main/res/values/strings.xml`
- Baseline and QA documents, project logs, TODO, and targeted checker

## Files intentionally unchanged

Production `src` and `public` files, Capacitor/Vite configuration,
`MainActivity`, app Gradle file, Gradle wrapper, workflows, privacy policy,
`app-ads.txt`, routing, storage, schema, and fortune logic remain unchanged.

No Mobile Ads initialization, UMP runtime call, ad load, or ad show code was
added.

## Rollback plan

Revert the PR commits, run `npm ci`, rebuild the web bundle, and run
`npx cap sync android`. Confirm that the AdMob module registration, exact SDK
variables, App ID string resource, and APPLICATION_ID metadata disappear, then
rerun the existing web and Android checks.

No Console rollback is needed because this PR does not change either Console.

## Blocking conditions

- Release dependency, build, and merged-manifest verification remain Blocked
  until approved release-signing variables are available.
- Runtime advertising work remains out of scope until initialization, consent,
  test-ad configuration, privacy entry point, and Console work are separately
  approved.
- A sample App ID, ad unit ID, placeholder, committed test-device identifier,
  manual source AD_ID declaration, or runtime ad request blocks this baseline.

## Pending work

- ADB logcat verification: Not performed
- Full Android regression QA: Not completed
- Mobile Ads SDK runtime initialization: Not started
- UMP consent flow integration: Not started
- Privacy options runtime UI: Not started
- Official test-ad request: Not started
- Android advertising QA: Not started
- European regulations message publication: Not started
- Google Play Data safety update: Not started
- Advertising ID declaration: Not started
- Release signing: Not started
- Signed APK: Not started
- AAB generation: Not started
- Google Play advertising update upload: Not started
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
