# AdMob Capacitor Implementation Approach Review

- Verification date: 2026-07-26
- PR type: docs/check-only
- Package: `com.harupuli.app`
- Technical review: Completed
- Candidate comparison: Completed
- Technical recommendation: Completed
- Final implementation approval: Pending
- AdMob account verification: In progress
- Ad units: 0
- Plugin installation: Not started
- Google Mobile Ads SDK integration: Not started
- GMA Next-Gen SDK integration: Not started
- UMP SDK integration: Not started
- Test configuration design: Completed
- Production configuration design: Completed
- Actual configuration implementation: Pending
- Test ad verification: Pending
- Production ad request: Pending
- Actual advertisement serving: Pending

## 1. Purpose and decision boundary

이 문서는 React + Vite + Capacitor Android 앱에 Google Mobile Ads와 UMP를 연결하는 방법을 조사하고, 후속 production 구현 PR의 우선 후보와 결정 게이트를 기록한다.

이 PR은 기술 검토와 설계만 수행한다. plugin 추천은 설치 승인이 아니며, SDK 버전 검토는 dependency 추가가 아니다. 첫 광고 구현 대상은 배너 하나이며 기존 rewarded mock flow와 운세 해제 로직은 유지한다.

### Current external state

| Item | State |
| --- | --- |
| Google Play production release | Completed |
| AdMob app registration | Completed |
| AdMob app-ads.txt verification | Completed |
| AdMob app verification | Completed |
| App readiness review | Completed — Approved |
| App-level ad serving limit | Lifted |
| AdMob account verification | In progress |
| Ad units | 0 |
| Google Mobile Ads SDK integration | Not started |
| UMP SDK integration | Not started |
| Implementation approach selection | Pending final approval |
| Initial ad placement finalization | Pending |
| Actual advertisement requests | No data |
| Actual advertisement serving | Pending |
| First advertising update release | Pending |

`No data`는 광고 요청 성공이나 Pass가 아니다. 앱 승인, 계정 인증, 광고 게재 제한 해제와 실제 광고 게재는 각각 별도 상태다. PR #398과 PR #399의 역사 문서는 소급 수정하지 않는다.

## 2. Current JavaScript and Capacitor baseline

| Area | Declared source | Locked or observed value |
| --- | --- | --- |
| React | `package.json` | `18.3.1` |
| Vite | `package.json` | `6.4.2` |
| `@capacitor/core` | `package.json` | `8.4.0` |
| `@capacitor/android` | `package.json` | `8.4.0` |
| `@capacitor/cli` | `package.json` | `8.4.0` |
| Capacitor major | package dependency set | `8` |
| Capacitor runtime plugin | `package.json` | `@capacitor/app` `8.1.0` |
| Package manager | `package-lock.json` | npm, lockfile version 3 |
| Node baseline | `.github/workflows/android-debug-build.yml` | Node 22 |
| Local review runtime | command output | Node `24.15.0`, npm `11.12.1` |

Version 근거:

- 선언 범위는 `package.json`의 caret range다.
- 정확한 설치 기준은 `package-lock.json`의 `node_modules/*` entry다.
- `android/app/src/main/assets/capacitor.plugins.json`은 현재 빈 배열이다. package dependency에는 `@capacitor/app`이 있으므로 후속 구현에서는 `npx cap sync` 후 생성 상태를 다시 확인해야 한다.
- 광고 관련 npm dependency: 없음.
- UMP 관련 npm dependency: 없음.
- `package-lock.json`에도 AdMob plugin, Google Mobile Ads 또는 UMP package가 없다.

## 3. Current Android baseline

| Area | Value | Source |
| --- | --- | --- |
| `minSdkVersion` | 24 | `android/variables.gradle` |
| `compileSdkVersion` | 36 | `android/variables.gradle` |
| `targetSdkVersion` | 36 | `android/variables.gradle` |
| Android Gradle Plugin | 8.13.0 | `android/build.gradle` |
| Gradle wrapper | 8.14.3 | `android/gradle/wrapper/gradle-wrapper.properties` |
| Java source/target | 21 | `android/app/capacitor.build.gradle` |
| CI JDK | Temurin 21 | `.github/workflows/android-debug-build.yml` |
| Local shell JDK during review | Temurin 17.0.19 | `java -version`, informational only |
| Kotlin | Not used by app code | no Kotlin source or app Kotlin plugin/version |
| MainActivity | empty `BridgeActivity` subclass | `android/app/src/main/java/com/harupuli/app/MainActivity.java` |
| R8/minify | disabled | `android/app/build.gradle`, `minifyEnabled false` |
| ProGuard rules | template only | `android/app/proguard-rules.pro` |

### Manifest and dependency observations

- `android/app/src/main/AndroidManifest.xml` has one `<application>`, one exported `MainActivity`, and one `FileProvider`.
- `android:hardwareAccelerated` is not explicitly declared. For the current target SDK the Android default is enabled, but the merged manifest and real banner video behavior must be checked in the implementation PR.
- Current `AD_ID` permission: absent.
- Current Google Mobile Ads App ID meta-data: absent.
- Current Google Mobile Ads SDK dependency: absent.
- Current GMA Next-Gen SDK dependency: absent.
- Current UMP dependency: absent.
- `android/app/capacitor.build.gradle` has an empty generated dependency block.
- Current debug workflow: `npm ci` → `npm run build` → `npx cap sync android` → JDK 21 → `./gradlew assembleDebug --stacktrace`.
- This docs/check-only PR does not execute `npx cap sync` or an Android build.

## 4. Existing advertising abstraction

### Current rewarded components and services

| Layer | Current file and behavior |
| --- | --- |
| CTA container | `src/components/AdRewardBox.jsx`; opens the reward modal and shows unlocked state |
| Modal | `src/components/RewardAdModal.jsx`; two-second mock countdown and result handling |
| Facade | `src/services/rewardedAdService.js`; exposes outcomes and `showRewardedAd()` |
| Provider adapter | `src/services/rewardedAdProvider.loader.js`; selects mock or SDK provider and applies the existing app-level ads-consent gate |
| Mock provider | `src/services/rewardedAdProvider.mock.js`; returns deterministic completed/failed/canceled/no-reward results |
| SDK adapter | `src/services/rewardedAdProvider.sdk.js`; scaffold that always returns `sdk_unavailable` |
| Provider contract | `src/services/rewardedAdProvider.types.js`; provider and outcome constants |
| Placement resolver | `src/config/rewardedAdPlacements.js`; logical placement names and optional Vite overrides |
| Provider config | `src/config/rewardedAdSdkConfig.js`; mock/SDK selection flags |
| Consent storage | `src/utils/consentPreferencesStorage.js`; `harupuli_consent_preferences_v1` |
| Reward unlock storage | `src/utils/storage.js`; `aiTodayFortune.rewardUnlocks` |

`REWARDED_AD_PLACEMENTS` includes today fortune detail, Saju deep dive, year fortune detail, and zodiac fortune detail. The application currently makes no real SDK call.

### Existing result contract

- Success: `{ ok: true, provider, placementId, categoryLabel, rewardedAt }`
- Failure/cancel: `{ ok: false, provider, placementId, categoryLabel, reason, rewardedAt: null }`
- Known reasons: `load_failed`, `canceled`, `no_reward`, `sdk_unavailable`, `ads_consent_required`
- The mock provider remains the default and deliberately keeps its development behavior.

### Reusable parts

- facade/provider separation pattern
- environment-aware provider resolution pattern
- logical placement naming pattern
- listener cleanup expectations captured by existing tests
- explicit success/failure contract style
- web fallback concept
- existing regression checks for service, outcomes, placements, resolver, provider adapter, SDK scaffold and consent gate

### Parts that must not be reused as AdMob truth

- The mock countdown is not an ad lifecycle.
- `harupuli_consent_preferences_v1` is an app preference and is not a replacement for UMP consent information.
- The rewarded outcome contract does not describe banner loaded/failed/size/lifecycle events.
- Existing rewarded placement values are not AdMob ad unit IDs.
- Existing `sdk_unavailable` scaffold is not an initialized native SDK.
- Reward unlock storage and UI must not be coupled to the first banner release.

The first advertising update must keep the existing rewarded mock contract and must not connect rewarded flow to real AdMob.

## 5. Official Google SDK review

### Google Mobile Ads SDK Legacy

- Latest public version on the verification date: `25.4.0`.
- Artifact: `com.google.android.gms:play-services-ads`.
- Minimum SDK: 23.
- Compile SDK: 35 or higher.
- Initialization: call `MobileAds.initialize()` once, ideally at app launch; Google recommends a background thread.
- App ID: `com.google.android.gms.ads.APPLICATION_ID` meta-data in `AndroidManifest.xml`.
- UMP: Legacy `25.x` carries UMP `4.0.0` in its dependency line, but the app still needs the UMP flow and manifest App ID.
- Banner support: anchored adaptive and true inline adaptive APIs are both available in the native SDK.
- Test safety: Google official demo ad units or registered test devices; Android emulators are automatically test devices.
- `AD_ID`: Legacy `20.4.0+` declares `com.google.android.gms.permission.AD_ID` in the SDK manifest, so the implementation PR must inspect the merged manifest and align Play Console/Data safety decisions.
- Hardware acceleration: required for video ads in banner views.
- Release state: supported, but Google labels the Legacy SDK maintenance mode and directs new work toward GMA Next-Gen.

Sources: [Legacy setup](https://developers.google.com/admob/android/quick-start), [release notes](https://developers.google.com/admob/android/rel-notes), [deprecation schedule](https://developers.google.com/admob/android/deprecation), [banner guide](https://developers.google.com/admob/android/banner), [inline adaptive guide](https://developers.google.com/admob/android/banner/inline-adaptive), [test ads](https://developers.google.com/admob/android/test-ads).

### GMA Next-Gen SDK

- Latest public version on the verification date: `1.3.0`, released 2026-07-21.
- Stable/general availability interpretation: the `1.x` line is the non-preview line; `1.0.0` was released 2026-04-14 after the earlier alpha/beta series.
- Artifact: `com.google.android.libraries.ads.mobile.sdk:ads-mobile-sdk`.
- Minimum SDK: 24.
- Compile SDK: 35 or higher in the current setup guide.
- Kotlin requirement: Kotlin 1.9 or higher when the app uses Kotlin.
- Java: Java initialization is supported; current project Java 21 exceeds the documented Java 11 support floor.
- Initialization: mandatory before ad loading, on a background thread, with an `InitializationConfig` containing the App ID.
- App ID: provided programmatically to `InitializationConfig`; UMP still requires the App ID meta-data in `AndroidManifest.xml`.
- Banner support: anchored adaptive and true inline adaptive native APIs.
- Test safety: Google official demo ad units or test devices; Android emulators are automatically test devices.
- UMP relationship: the Next-Gen release line has carried UMP as a dependency, but the app still needs an explicit consent coordinator and privacy-options entry point.
- Migration constraint: remove/exclude Legacy `play-services-ads`; do not ship Legacy and Next-Gen together because of duplicate symbols and divergent package APIs.
- Mediation constraint: integrate without mediation or use AdMob as the mediation platform; other mediation platforms are not supported by the documented migration path.

Sources: [Next-Gen setup](https://developers.google.com/admob/android/next-gen/quick-start), [release notes](https://developers.google.com/admob/android/next-gen/rel-notes), [migration guide](https://developers.google.com/admob/android/next-gen/migration), [banner guide](https://developers.google.com/admob/android/next-gen/banner), [inline adaptive guide](https://developers.google.com/admob/android/next-gen/banner/inline-adaptive), [test ads](https://developers.google.com/admob/android/next-gen/test-ads).

### UMP SDK

- Latest public version: `4.0.0`.
- Artifact: `com.google.android.ump:user-messaging-platform`.
- Minimum SDK: the `4.0.0` release notes raise the minimum to 23. The setup page summary still contains an older API 21 prerequisite, so the release note for the selected current version is authoritative for this review.
- UMP `2.2.0+` no longer uses Advertising ID.
- Call `requestConsentInfoUpdate()` on every app launch.
- After the update, call `loadAndShowConsentFormIfRequired()` or use the load/show APIs in an equivalent safe sequence.
- `canRequestAds()` stays false until `requestConsentInfoUpdate()` has been called.
- Check `canRequestAds()` immediately after the update and again after consent gathering, while guarding against duplicate initialization or ad requests.
- Check `getPrivacyOptionsRequirementStatus()` and expose a visible entry point only when required.
- Use `showPrivacyOptionsForm()` from that entry point.
- Debug geography works only for registered test devices.
- UMP emulators are automatically recognized as test devices.
- The same UMP API is used alongside Legacy and Next-Gen; the ad SDK artifact differs, but the UMP consent gate remains separate.

Sources: [UMP setup](https://developers.google.com/admob/android/privacy), [UMP release notes](https://developers.google.com/admob/android/privacy/release-notes).

## 6. Candidate A — `@capacitor-community/admob`

### Compatibility and maintenance

- Exact reviewed plugin version: `8.0.0`.
- Capacitor compatibility: package dependency `@capacitor/core ^8.0.0`; compatible with this project’s Capacitor 8.4.0.
- Published: 2025-12-27.
- Repository: 294 stars, 94 forks and 66 combined open issues/PRs observed during review; recent repository commits were present in June 2026.
- Maintenance signal: established community package with active source updates, but the latest npm release is seven months old and important banner layout issues remain open.

### Android SDK and UMP

- Android uses Google Mobile Ads Legacy, not Next-Gen.
- Default Legacy version in the published `8.0.0` Android source: `24.9.+`.
- Default UMP version: `4.0.0`.
- Android defaults match the project baseline: min 24, compile/target 36, AGP 8.13.0 and Java 21.
- Plugin adds Kotlin Gradle support and defaults Kotlin to `2.2.20`; the current app does not otherwise use Kotlin.
- UMP APIs include `requestConsentInfo`, `showConsentForm`, `canRequestAds`, privacy-options requirement status and `showPrivacyOptionsForm`.
- UMP test device identifiers and debug geography are exposed.

### Test, banner and rewarded APIs

- `isTesting: true` swaps to a Google official demo unit unless the device is explicitly registered as a test device.
- Initialization also accepts test device IDs.
- Banner events include loaded, failed, size changed, opened, closed and impression.
- Lifecycle methods include show, hide, resume and remove; remove destroys the native `AdView`.
- Rewarded and rewarded-interstitial APIs exist, but this project must not connect them in the first advertising release.
- Web implementation is a logging stub. The application adapter must enforce a true no-op on web/Vercel rather than trusting the stub’s synthetic consent response.

### Placement behavior

- `ADAPTIVE_BANNER` calls `getCurrentOrientationAnchoredAdaptiveBannerAdSize()`.
- Supported positions are native `TOP_CENTER`, `CENTER`, and `BOTTOM_CENTER`.
- The native view is attached to the root activity view hierarchy above the WebView.
- It is not inserted into React DOM and does not move with WebView content scrolling.
- Therefore Candidate A does not provide true inline adaptive banners.
- A loaded/failed/size listener can drive a DOM spacer or route padding, but that produces an anchored overlay composition, not scrollable inline content.
- An open Android 15/16 issue reports ignored margin, navigation overlap and orientation artifacts. This directly affects the planned bottom navigation and safe-area QA.

### Expected native scope

- `package.json` and `package-lock.json`
- `android/app/src/main/AndroidManifest.xml`
- `android/app/src/main/res/values/strings.xml`
- `android/variables.gradle` if versions are pinned
- generated Capacitor Android files after sync
- application adapters/services and privacy-options UI
- no MainActivity change expected for the standard plugin path, subject to implementation verification
- merged manifest, R8 and release AAB review

Sources: [npm package](https://www.npmjs.com/package/@capacitor-community/admob), [v8.0.0 Android build](https://github.com/capacitor-community/admob/blob/v8.0.0/android/build.gradle), [banner source](https://github.com/capacitor-community/admob/blob/v8.0.0/android/src/main/java/com/getcapacitor/community/admob/banner/BannerExecutor.java), [consent source](https://github.com/capacitor-community/admob/blob/v8.0.0/android/src/main/java/com/getcapacitor/community/admob/consent/AdConsentExecutor.java), [plugin API source](https://github.com/capacitor-community/admob/blob/v8.0.0/android/src/main/java/com/getcapacitor/community/admob/AdMob.java), [Android 15/16 banner issue](https://github.com/capacitor-community/admob/issues/390).

## 7. Candidate B — `@capgo/capacitor-admob`

### Compatibility and maintenance

- Exact reviewed plugin version: `8.1.12`.
- Capacitor compatibility: peer dependency `@capacitor/core >=8.0.0`; README maps plugin v8 to Capacitor v8.
- Published: 2026-07-11.
- Repository: 12 stars, 1 fork and 6 combined open issues/PRs observed during review; the repository had July 2026 activity and frequent npm releases.
- Maintenance signal: frequent releases, but a much smaller adopter/reviewer base and limited issue history.

### Android SDK and source/API consistency

- Android uses GMA Next-Gen, not Legacy.
- Published `8.1.12` source defaults to `0.25.0-beta01`, although Google’s current stable release is `1.3.0`.
- The source comment still describes Next-Gen as beta.
- The native `getPluginVersion()` constant reports `8.0.15`, not the npm package version `8.1.12`.
- These mismatches require exact artifact and runtime version verification before approval.
- Android defaults otherwise match min 24, compile/target 36, AGP 8.13.0 and Java 21.
- Plugin adds Kotlin `2.3.21`.

### Consent, test and banner APIs

- No UMP dependency in the published Android build file.
- No `requestConsentInfoUpdate`, `canRequestAds`, privacy-options requirement or `showPrivacyOptionsForm` bridge in the TypeScript/native API.
- A separate local UMP bridge would therefore be required.
- Request configuration accepts test device IDs.
- No `isTesting` switch or plugin-owned official demo-unit selection is exposed; the application must inject the Google official demo banner unit in development and enforce release checks.
- Banner events include load, load failure, click, open, close and impression.
- Public banner API supports load, show and hide. A public destroy/remove method is not exposed by the TypeScript class even though native objects implement an internal `destroy()`.
- This creates a route cleanup and native-view lifetime gate.

### Placement behavior

- The Android banner uses `getCurrentOrientationAnchoredAdaptiveBannerAdSize()`.
- Positions are only `top` and `bottom`.
- The native code removes the WebView from its parent, wraps it in a vertical `LinearLayout`, and adds the banner before or after the WebView.
- It is not a DOM child, cannot target a specific React card, and does not scroll with WebView content.
- Therefore Candidate B does not provide true inline adaptive banners.

### Expected native scope

- `package.json` and `package-lock.json`
- `AndroidManifest.xml` App ID meta-data
- version override in `variables.gradle` if moving from the plugin default beta artifact
- separate UMP dependency and local Capacitor consent bridge
- possible MainActivity/local plugin registration depending on bridge design
- source banner adapter and privacy-options UI
- generated Capacitor Android files after sync
- merged manifest, R8 and release AAB review

Sources: [npm package](https://www.npmjs.com/package/@capgo/capacitor-admob), [8.1.12 Android build](https://github.com/Cap-go/capacitor-admob/blob/8.1.12/android/build.gradle), [banner source](https://github.com/Cap-go/capacitor-admob/blob/8.1.12/android/src/main/kotlin/admob/plus/capacitor/ads/Banner.kt), [native plugin source](https://github.com/Cap-go/capacitor-admob/blob/8.1.12/android/src/main/kotlin/admob/plus/capacitor/AdMobPlusPlugin.kt), [TypeScript definitions](https://github.com/Cap-go/capacitor-admob/blob/8.1.12/src/definitions.ts), [official Capgo API page](https://capgo.app/docs/plugins/admob/).

## 8. Candidate C — local Capacitor native bridge

Candidate C is a project-owned local Capacitor native bridge using either the current Legacy SDK or GMA Next-Gen plus UMP directly.

### Capability

- Exact Legacy or Next-Gen versions can be pinned and updated deliberately.
- UMP `requestConsentInfoUpdate`, `canRequestAds`, required form and privacy-options APIs can be mapped exactly.
- Native banner events, loaded size, failure reason and destroy semantics can be designed for the app contract.
- Google official demo units and test-device configuration can be separated from production at the application boundary.
- A platform-neutral TypeScript contract could later have an iOS implementation, but this review does not add iOS.

### True inline options and cost

A native `AdView` cannot be a React DOM child. True inline behavior needs one of these Android-specific designs:

1. Restructure the native view hierarchy so the ad is a native child in a native scrolling layout coordinated with the WebView.
2. Keep the ad as a native overlay and continuously synchronize its bounds with a DOM placeholder using route, scroll, resize, orientation, keyboard and safe-area events.

The second approach can visually behave like inline content but is still a synchronized overlay and needs clipping, visibility and accessibility testing. Either design requires:

- route and scroll lifecycle synchronization
- background/foreground pause, resume and removal
- orientation and viewport recomputation
- safe-area and bottom-navigation collision handling
- native view removal on route/unmount
- event bridge and duplicate-listener prevention
- UMP Activity/form lifecycle handling
- offline/no-fill/failure collapse
- broader Android QA
- project ownership of SDK migrations and future iOS parity

Candidate C is technically capable of true inline behavior, but that capability is conditional on implementing and proving the native lifecycle. It has the highest implementation and maintenance cost.

## Inline Adaptive vs Anchored Native Banner

### Inline adaptive banner

- sits inside scrollable content flow
- moves with the content when the WebView scrolls
- appears at the chosen content position
- can use variable height
- requires a real native insertion strategy or precise DOM/native position synchronization

### Anchored adaptive banner

- stays fixed at the top or bottom of the screen
- can be a native overlay above the WebView or a native sibling around it
- does not move with page scrolling
- can collide with bottom navigation and safe-area
- can require a DOM placeholder, bottom padding or route-scoped layout compensation

### Candidate result

| Candidate | True inline | Anchored support | React card insertion |
| --- | --- | --- | --- |
| Candidate A | No | Yes: top/center/bottom native overlay | No |
| Candidate B | No | Yes: top/bottom native sibling around WebView | No |
| Candidate C | Conditional: custom implementation required | Yes | Conditional through synchronization/native layout work |

The current UX plan names an inline banner after content. Candidate A and B therefore conflict with that plan if “scrolls with content at a specific card position” is mandatory.

A route-scoped anchored banner is the lowest-risk practical alternative if the user approves:

- display only on one selected result route
- use top anchoring or a bottom position proven not to overlap bottom navigation
- reserve UI space only after the loaded/size event
- remove the space and native view on failure, no-fill, offline, consent refusal, route change and unmount

If true inline is mandatory, Candidate C is required. Adaptive banner does not automatically mean inline adaptive banner.

## 9. Weighted candidate evaluation

Scores are 1–5. Weighted total is `score × weight`; maximum is 500. The matrix guides comparison but does not override blocking gates.

| Criterion | Weight | Candidate A | Candidate B | Candidate C |
| --- | ---: | --- | --- | --- |
| Capacitor version compatibility | 15 | 5 — v8 package matches Capacitor 8 | 5 — v8 peer range accepts Capacitor 8 | 5 — built against the current app |
| Android SDK compatibility | 10 | 4 — Android baseline fits, but Legacy default is 24.9.x in maintenance mode | 2 — baseline fits, but plugin ships old beta while Google stable is 1.3.0 | 5 — exact current Legacy or Next-Gen version can be selected |
| UMP and privacy options support | 15 | 5 — UMP 4.0.0, `canRequestAds` and privacy options exposed | 1 — no UMP bridge or privacy-options API | 5 — direct official UMP mapping is possible |
| True inline adaptive support | 15 | 1 — anchored overlay only | 1 — anchored WebView sibling only | 5 — possible with custom native/DOM coordination |
| Banner lifecycle and event support | 10 | 5 — load/fail/size plus hide/resume/remove/destroy | 2 — useful events and hide, but no public remove/destroy contract | 5 — can design the complete contract |
| Test-ad safety | 10 | 5 — demo-unit test mode and test devices | 3 — test devices supported; demo/production separation is app-owned | 5 — explicit demo configuration and release guards can be enforced |
| Existing adapter integration | 10 | 4 — facade/no-op patterns reusable; banner adapter must be separate | 3 — object API can be wrapped but consent must be separate | 3 — new bridge and banner contract required |
| Maintenance and release health | 5 | 3 — established project, slower npm release and open banner issues | 4 — frequent releases, but small project and source/version drift | 1 — all maintenance moves to this project |
| Native change complexity | 5 | 4 — standard plugin/config/sync changes | 2 — plugin plus custom UMP/version/lifecycle work | 1 — full local native implementation |
| Android QA burden | 5 | 3 — anchored layout and Android 15/16 issue require focused QA | 2 — SDK pin, UMP and cleanup require broader QA | 1 — widest route/scroll/lifecycle matrix |
| **Weighted total** | **100** | **395/500 (79/100)** | **245/500 (49/100)** | **420/500 (84/100)** |

Candidate C scores highly on achievable capability, especially true inline, but the score does not price schedule and ownership risk strongly enough to make it the default.

## 10. Blocking gates

| Gate | Candidate A | Candidate B | Candidate C |
| --- | --- | --- | --- |
| Capacitor major mismatch | Pass | Pass | Pass by construction |
| UMP and privacy options possible | Pass | **Block: separate bridge required** | Conditional pass |
| Test-ad safety clear | Pass with release guard | Conditional; app-owned demo configuration | Conditional pass |
| True inline required | **Block** | **Block** | Conditional pass |
| minSdk/compileSdk mismatch | Pass | Pass | Pass for reviewed SDKs |
| Production and test IDs separable | Pass by design, implementation pending | Pass by app design, implementation pending | Pass by design, implementation pending |
| Native view lifecycle can be cleaned | Supported, Android QA pending | **Block until public destruction strategy exists** | Pending implementation proof |
| Legacy and Next-Gen mixed | Must remain Legacy-only | Must remain Next-Gen-only | Must choose exactly one |

Any blocked gate prevents production approval regardless of weighted score.

## 11. Technical recommendation

- Preferred implementation: Candidate A
- Preferred package: `@capacitor-community/admob`
- Reviewed compatible major: 8
- Exact plugin version approval: Pending
- Exact Google SDK version approval: Pending
- Placement limitation: true inline unsupported
- Approved first-release placement: Pending user decision
- Recommended first-release alternative: one route-scoped anchored adaptive banner
- Custom bridge fallback: Candidate C
- Candidate B status: not recommended for the first release while it lacks UMP/privacy-options APIs, exposes no reliable public banner destruction contract, and pins an outdated Next-Gen beta by default

### Conditions for Candidate A approval

1. User accepts a route-scoped anchored placement instead of true inline.
2. Implementation pins an exact Google Mobile Ads Legacy version; it must not leave a floating `24.9.+` production dependency.
3. UMP update/form/privacy-options flow is verified against UMP 4.0.0.
4. Initialization and ad request happen only after `canRequestAds`.
5. Official demo configuration is enforced in development and excluded from release.
6. Banner loaded/failed/size events control reserved UI space.
7. Android 15/16, Galaxy S23 Ultra, bottom navigation, safe-area, route and rotation QA pass.
8. `removeBanner()` and all listener handles are cleaned on route exit/unmount.
9. Merged manifest, `AD_ID`, Data safety, privacy policy, R8 and release AAB are reviewed in later PRs.
10. Existing rewarded mock flow and localStorage structures remain unchanged.

If the user rejects anchored placement and requires content-scrolling true inline, final approval must switch to Candidate C.

## 12. Recommended follow-up architecture

No modules are created in this PR. The implementation PR should keep banner and rewarded concerns separate.

| Proposed module | Responsibility |
| --- | --- |
| `adEnvironmentConfig` | Android/web detection; development demo configuration; production configuration validation |
| `adConsentCoordinator` | one UMP update per launch; form flow; privacy-options requirement; deduplicated `canRequestAds` gate |
| `adMobNativeAdapter` | plugin initialization and normalized native error/event mapping |
| `bannerAdController` | route-scoped load/show/hide/remove; size events; background/foreground behavior |
| banner UI adapter | loaded-only spacing and privacy-options entry state |
| existing rewarded adapters | unchanged mock contract; no first-release real SDK connection |

### Required control flow

1. Web/Vercel returns a no-op banner adapter and never initializes the native plugin.
2. Android native starts `adConsentCoordinator`.
3. Every app launch calls the UMP consent information update.
4. Required consent form is loaded/shown.
5. Privacy-options requirement updates the UI entry point.
6. A single guarded path checks `canRequestAds`.
7. Only then initialize/request Mobile Ads, following the selected plugin’s safe order.
8. The selected route asks `bannerAdController` to load the banner.
9. UI reserves space only after the loaded/size event.
10. Failure, no-fill, offline or consent-disabled states remove the space and native view.
11. Route change/unmount removes listeners and native view.
12. Background/foreground does not create duplicate listeners or requests.

Actual plugin initialization order must be verified in the implementation PR because Google warns that some SDKs or mediation partners may preload ads during initialization.

## 13. Development and production configuration design

### Development

- Use the Google official demo banner ad unit without copying its numeric value into this document.
- Use Candidate A `isTesting` or the selected adapter’s explicit test mode.
- Confirm Android emulators are automatic test devices for both ads and UMP.
- Galaxy S23 Ultra is the physical test-device candidate.
- Do not commit a test device ID.
- Confirm the visible `Test Ad` label.
- Never click a live ad; ad interaction testing is limited to official test ads.
- Force UMP debug geography only on a registered test device and never in release configuration.

### Production

- Inject the real App ID and ad unit ID through a controlled release configuration.
- Do not repeat actual IDs in source, docs or logs.
- Fail the release check if a Google demo ID or `isTesting` reaches the release configuration.
- Fail the PR check if a production-format ID appears in docs or logs.
- Reconfirm AdMob account verification before the first real request.
- Make the first real request only after internal test approval.
- Inspect the merged manifest for App ID, permissions and SDK-added components.

Status:

- Test configuration design: Completed
- Production configuration design: Completed
- Actual configuration implementation: Pending
- Test ad verification: Pending
- Production ad request: Pending

## 14. Expected Android implementation scope

| File or area | Candidate A | Candidate B | Candidate C |
| --- | --- | --- | --- |
| `package.json` | plugin dependency | plugin dependency | possibly no external Capacitor plugin package |
| `package-lock.json` | expected | expected | expected if SDK helper package is added; otherwise no npm dependency |
| `AndroidManifest.xml` | App ID meta-data and merged-manifest review | App ID meta-data for UMP/plugin lookup | App ID meta-data for UMP |
| `strings.xml` | likely App ID resource reference | optional based on configuration design | optional based on configuration design |
| `variables.gradle` | exact Legacy/UMP pin | exact Next-Gen/UMP pin | exact SDK/UMP pin |
| app Gradle | transitive plugin dependencies; review | plugin plus UMP/exclusions | direct selected SDK and UMP dependencies |
| Capacitor generated files | sync expected | sync expected | local plugin registration/sync expected |
| MainActivity/native | normally unchanged | may change for UMP/local cleanup bridge | plugin class and possibly registration/layout work |
| `src` adapter/service | new banner and consent adapters | new banner and consent adapters | new banner and consent adapters |
| privacy options UI | required when UMP says required | required | required |
| tests/check scripts | configuration, lifecycle, ID and regression checks | same plus UMP bridge tests | same plus native bridge tests |

Implementation expectation flags:

- dependency change expected
- package-lock change expected
- Android native change expected
- Manifest change expected
- Gradle change expected
- Capacitor sync expected
- R8 review expected
- merged manifest review expected
- release AAB review expected

These are later-PR expectations, not changes completed here.

## 15. Risk and mitigation register

| Risk | Mitigation |
| --- | --- |
| Capacitor/plugin major mismatch | Pin a Capacitor-8 plugin and verify peer/dependency ranges before install. |
| Legacy and Next-Gen mixed | Select one SDK family; inspect the Gradle dependency tree and exclude Legacy when using Next-Gen. |
| Floating or stale SDK version | Pin an exact reviewed version; reject `24.9.+` and outdated beta defaults for production. |
| UMP duplicate initialization | Centralize launch update/form work in one coordinator with an in-flight promise. |
| Ad request before consent check | Require a successful update and `canRequestAds`; do not infer from app localStorage. |
| Duplicate ad listeners | Register once per controller instance and remove every handle on unmount. |
| Native banner remains after route change | Route controller must call remove/destroy in `finally` and during unmount. |
| Bottom navigation overlap | Prefer top anchored for initial QA or calculate loaded-size compensation; test the selected bottom route if used. |
| Safe-area overlap | Use measured insets and Galaxy S23 Ultra/Android 15+ QA; do not assume plugin margin correctness. |
| Banner failure leaves empty space | Reserve space after loaded only; size zero and remove on failure/no-fill/offline. |
| Test ID ships in production | Add release-time assertions and scan built resources/configuration. |
| Developer clicks a live ad | Use official demo units or registered test mode and verify `Test Ad` label. |
| Test device ID committed | Inject locally or through non-repository configuration and scan diffs. |
| `AD_ID` declaration mismatch | Inspect merged manifest and align Play Console/Data safety before AAB approval. |
| Data safety differs from SDK behavior | Recheck the exact selected SDK’s official disclosure and actual configuration. |
| R8 release behavior differs from debug | Test minified release behavior when R8 is later enabled; review consumer rules even while minify is off. |
| Debug build treated as completed QA | Keep build, emulator, physical-device, release AAB and internal-test gates separate. |
| Existing rewarded mock regression | Keep banner adapter separate and run all rewarded regression checks. |
| Web stub reports synthetic consent | Application platform gate must return a no-op without calling the plugin on web. |
| Capgo source/version drift | Verify runtime/plugin/Gradle versions before any approval; do not trust the package label alone. |
| Native view cleanup impossible | Treat lack of public destroy/remove as a blocking gate. |
| Background/foreground duplicates | Pause/resume or recreate through one controller, guarded by current route and native-view state. |

## 16. Proposed follow-up PRs

- PR #401: production 개인정보처리방침 변경 및 홈페이지 배포
- PR #402: Google Play Data safety와 광고 ID Console 입력 준비
- PR #403: 승인된 광고 plugin과 UMP를 Google 공식 test mode로 통합
- PR #404: 개인정보 옵션 UI와 test banner Android QA
- PR #405: 실제 광고 단위 configuration 준비
- PR #406: release AAB와 내부 테스트
- PR #407: 첫 광고 포함 Google Play 업데이트 준비

번호는 계획 후보이며 실제 PR 번호는 달라질 수 있다.

## 17. Status interpretation rules

- Completed: 실제 조사 또는 결정 기록 완료
- Recommended: 기술 검토상 우선 후보
- Conditional: 명시된 조건 충족 시 선택
- Pending: 실제 결정 또는 구현 전
- Not started: 설치·구현 시작 전
- No data: 실제 광고 요청 데이터 없음
- Plugin recommendation does not mean plugin installation
- SDK version review does not mean dependency installation
- Test configuration design does not mean test ads were loaded
- Build success does not mean Android advertising QA completed
- App approval does not mean account verification completed
- Adaptive banner does not automatically mean inline adaptive banner
- Native overlay does not automatically behave like scrollable content
- Internal testing does not mean production release completed

## 18. Not included

- No plugin installation
- No dependency changes
- No lockfile changes
- No Google Mobile Ads SDK
- No GMA Next-Gen SDK
- No UMP SDK
- No AndroidManifest changes
- No Gradle changes
- No MainActivity changes
- No native plugin code
- No Capacitor sync
- No App ID
- No ad unit ID
- No publisher ID
- No test device ID
- No Advertising ID value
- No production UI changes
- No privacy policy changes
- No Console changes
- No actual ad request
- No actual ad serving
- No Android QA execution
- No release build
- No AAB generation

Actual advertisement serving: Pending
