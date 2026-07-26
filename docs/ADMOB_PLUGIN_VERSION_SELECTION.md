# AdMob Plugin Version Selection

- Verification date: 2026-07-26
- PR type: docs/check-only
- Plugin selection: Completed
- Selected exact version: `@capacitor-community/admob@8.0.0`
- Plugin installation: Not started
- Mobile Ads SDK integration: Not started
- UMP integration: Not started
- Android native configuration: Not started
- European regulations message: Draft
- European regulations message publication: Not started
- US state regulations message: Not started
- Ad units: 0
- Actual ad requests: No data
- Actual ad serving: Pending

## Purpose and scope

This document selects an exact Capacitor AdMob plugin baseline for a later
implementation PR. It records compatibility, UMP and Android impact without
installing a plugin or SDK, changing native files, configuring identifiers, or
making an ad request.

## Current project baseline

| Area | Verified value | Source |
| --- | --- | --- |
| React / Vite | 18.3.1 / 6.4.2 | `package-lock.json`, `npm ls` |
| Capacitor core / Android / CLI | 8.4.0 / 8.4.0 / 8.4.0 | `package-lock.json`, `npm ls` |
| Capacitor config | `com.harupuli.app`, `dist` web directory | `capacitor.config.json` |
| Node / Java CI | Node 22 / Temurin 21 | Android GitHub Actions workflows |
| Android SDK | min 24, compile 36, target 36 | `android/variables.gradle` |
| Android build | AGP 8.13.0, Gradle 8.14.3 | Gradle build and wrapper files |
| Java / Kotlin | Java source and target 21; no app Kotlin plugin or source | generated Capacitor Gradle file and app source |
| Manifest | Internet permission only; no advertising metadata or permission | source manifest |
| Debug merged manifest | Previously regenerated on PR #403 baseline; no AdMob App ID metadata or `AD_ID` | `DEVELOPMENT_LOG.md` |

The current dependency tree, lockfile, source manifest, generated Capacitor
dependency block, production source, and existing advertising readiness checks
show no AdMob plugin, Google Mobile Ads SDK, UMP SDK, AdMob App ID, ad unit ID,
`AD_ID` permission, actual ad request, or actual UMP consent flow. Existing
rewarded-ad code is a mock/provider scaffold and is not a native ad integration.

Google Play production targeted countries/regions: 1

- Targeted country: South Korea
- Verification source: User-provided Google Play Console screenshot
- Verification date: 2026-07-26
- No country/region setting was changed.
- United States is not currently targeted.
- EEA, UK, and Switzerland are not currently targeted.
- A consent message can still be selected according to a user's current
  location, so the European regulations message remains Draft.

## Candidate plugins and versions

The official npm registry and repository were checked on 2026-07-26. The npm
package declares Capacitor core as a dependency rather than a peer dependency.

| Candidate | Capacitor compatibility | Android SDK dependency | UMP support | Privacy options | Maintenance | Risks | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `@capacitor-community/admob@8.0.0` | `@capacitor/core ^8.0.0`; Node 22+; matches this project's major | `play-services-ads` default `24.9.+`; UMP 4.0.0 | Plugin consent bridge included | `showPrivacyOptionsForm`, status, `canRequestAds` | npm latest; stable release/tag; repository activity observed in 2026 | Floating Mobile Ads default must be overridden and verified; native banner lifecycle needs QA | Select |
| `@capacitor-community/admob@7.2.0` | Capacitor 7 line; not compatible with the project's selected major without downgrade | Older major baseline | Consent APIs exist | Available in the 7 line | Stable prior major | Would introduce a Capacitor major mismatch | Reject |
| `@capacitor-community/admob@6.2.0` | Capacitor 6 line | Older major baseline | Consent APIs exist | Older API baseline | Stable older major | Two-major mismatch and unnecessary downgrade | Reject |

Prereleases such as `8.0.0-0` and `7.2.1-0` are not selected. The npm latest
major and the current-project-compatible major are both 8, so choosing latest is
an outcome of compatibility evidence, not a latest-by-default policy.

## Compatibility matrix

| Requirement | Project | Plugin 8.0.0 | Result |
| --- | --- | --- | --- |
| Capacitor core | 8.4.0 | `^8.0.0` | Compatible |
| Node | CI 22 | `>=22.0.0` | Compatible |
| min SDK | 24 | default 24 | Compatible |
| compile / target SDK | 36 / 36 | default 36 / 36 | Compatible |
| AGP | 8.13.0 | plugin build 8.13.0 | Aligned |
| Java | 21 | source, target, JVM target 21 | Aligned |
| Kotlin | no app Kotlin | plugin Kotlin 2.2.20 internally | Plugin adds its own Kotlin build requirement |
| Google Mobile Ads | none | default `24.9.+` | Later exact override required |
| UMP | none | exact 4.0.0 | Later dependency integration required |

## Selected baseline

Select `@capacitor-community/admob@8.0.0`.

The exact version has an official npm release and GitHub `v8.0.0` tag, declares
`@capacitor/core ^8.0.0`, and aligns its Android SDK, AGP, Java, and Node floors
with this repository. The later implementation PR must install the exact plugin
version without a caret and must replace the plugin's floating
`playServicesAdsVersion` default with an exact, officially supported version
after dependency-tree verification. The plugin's default is not approval to
ship that floating version.

## UMP and privacy options support

Plugin API names are not identical to the underlying Google UMP native API:

| Required concept | Plugin 8.0.0 API/result | Underlying UMP concept |
| --- | --- | --- |
| Refresh consent information | `requestConsentInfo(options)` | `requestConsentInfoUpdate()` |
| Show required consent form | inspect availability, then `showConsentForm()` | load/show required form |
| Ad request eligibility | returned `canRequestAds` | `ConsentInformation.canRequestAds()` |
| Privacy-options requirement | returned `privacyOptionsRequirementStatus` | native requirement status |
| Re-enter privacy options | `showPrivacyOptionsForm()` | native privacy-options form |
| Test geography | `debugGeography` | UMP debug geography |
| Test device identifiers | `testDeviceIdentifiers` | UMP debug settings |
| Reset test state | `resetConsentInfo()` | native `reset()` |

The plugin also exposes initialization, banners, interstitials, rewarded ads,
rewarded interstitials, test mode, and testing devices. Android-only use is
possible: the package supports both platforms, but importing and invoking the
Android bridge does not require creating iOS project files. No iOS configuration
is part of the Android-only implementation PR.

`requestConsentInfo()` must run each app session. A form error is not consent.
The returned `canRequestAds` gate must be checked before any request. Reset,
debug geography, and test device identifiers are test-only.

## Android native impact

The implementation PR is expected to change `package.json`, `package-lock.json`,
the source manifest, Android string resources or an equivalent non-secret
resource strategy, `android/variables.gradle`, a `src` AdMob/consent adapter,
privacy-options UI, and targeted tests/checks.

- Add the App ID metadata required by Google Mobile Ads under `<application>`.
- Store the App ID through an approved build/resource strategy; do not commit a
  production identifier in this planning PR.
- Pin an exact `playServicesAdsVersion`; do not accept the plugin's `24.9.+`.
- The plugin explicitly adds UMP 4.0.0 and Kotlin 2.2.20 by default.
- Run `npm install --save-exact @capacitor-community/admob@8.0.0`, then
  `npx cap sync android`.
- No manual `MainActivity` registration is expected for a standard Capacitor
  plugin, but generated registration must be inspected after sync.
- No extra plugin ProGuard rules are currently defined. R8 remains disabled in
  this app, but release dependency consumer rules still require verification.
- No min/compile SDK conflict is expected from the recorded defaults.
- No iOS directory, file, or configuration is required for Android-only work.

## Manifest and Advertising ID impact

Google requires the Mobile Ads App ID metadata; omitting it can crash startup.
Mobile Ads 20.4.0 and later declares `AD_ID` in the library manifest, so it can
appear through manifest merging even when absent from the app source manifest.
The implementation PR must inspect the generated debug and release merged
manifests, confirm the exact dependency tree, and align the Play Console
Advertising ID declaration and Data safety answers before release.

This PR adds neither metadata nor permission. Directly editing `AD_ID` without
first confirming the merged result is not the implementation strategy.

## Test-ad strategy

- Use only Google's official demo/test units or the plugin's explicit test mode.
- Do not commit a production App ID, ad unit ID, or test-device identifier.
- Do not request any ad until the fresh consent update/form path reports
  `canRequestAds`.
- Use EEA debug geography only on registered test devices.
- Verify EEA and non-EEA paths, consent, refusal, privacy-options re-entry,
  restart behavior, and duplicate-call guards.
- Remove debug geography and device configuration from release builds.
- Never click a live ad during development.

## Consent-flow implementation order

1. Install the exact plugin version.
2. Run Capacitor sync.
3. Apply reviewed Android native configuration.
4. Define the official sample/test App ID strategy without production IDs.
5. Refresh consent information at app start.
6. Show a consent form when required.
7. Confirm `canRequestAds`.
8. Verify the order of AdMob initialization.
9. Block duplicate initialization and duplicate requests.
10. Check privacy-options requirement status.
11. Provide a `개인정보 및 쿠키 설정` entry point when required.
12. Request only official test ads.
13. Run EEA debug-geography QA.
14. Run non-EEA QA.
15. Test refusal, consent, and options management.
16. Test state behavior after restart.
17. Inspect merged manifests.
18. Inspect the Gradle dependency tree.
19. Correct the Data safety draft.
20. Correct the privacy-policy advertising disclosure.
21. Publish the European regulations message.
22. Apply production ad units only in a later, separately approved stage.

## Entry criteria for implementation PR

- Exact plugin version remains `@capacitor-community/admob@8.0.0`.
- Exact Mobile Ads transitive version is selected and officially supported.
- Install/sync diff is reviewed before application code changes.
- App ID injection and official test-only configuration are approved.
- Consent coordinator, duplicate-call guard, and Android platform gate are designed.
- Privacy-options UI location and accessible label are approved.
- European regulations message is testable; publication remains a later gate.
- Data safety, Advertising ID, merged-manifest, dependency-tree, and rollback
  verification steps are assigned.
- Existing rewarded mock behavior and storage compatibility remain protected.

## Blocking conditions

- Any production App ID, ad unit ID, or test-device identifier is committed.
- Ads can initialize or request before the fresh consent gate.
- The Mobile Ads dependency remains floating.
- Legacy and another Mobile Ads SDK family are both present.
- Debug geography or reset behavior can enter a release build.
- Generated plugin registration, dependency tree, or merged manifest is unknown.
- Privacy-options re-entry is absent when UMP reports it required.
- Console or legal status is claimed complete without evidence.
- Build, official test-ad QA, or existing rewarded regression checks fail.

## Rollback plan

Before production identifiers exist, revert the implementation commit, remove the
exact plugin dependency, run Capacitor sync, and verify that generated Gradle and
manifest changes disappear. Restore the existing mock/provider configuration,
then rerun the web build, rewarded checks, dependency-tree check, and merged
manifest check. Console and production-ID changes must remain in later,
separately reversible steps.

## Official references

Accessed 2026-07-26; recheck before implementation because versions and guidance
can change.

- [npm package](https://www.npmjs.com/package/@capacitor-community/admob)
- [Official GitHub repository](https://github.com/capacitor-community/admob)
- [Official v8.0.0 release](https://github.com/capacitor-community/admob/releases/tag/v8.0.0)
- [v8.0.0 package metadata](https://github.com/capacitor-community/admob/blob/v8.0.0/package.json)
- [v8.0.0 Android dependencies](https://github.com/capacitor-community/admob/blob/v8.0.0/android/build.gradle)
- [Plugin README and API](https://github.com/capacitor-community/admob/blob/v8.0.0/README.md)
- [Google Mobile Ads Android setup](https://developers.google.com/admob/android/quick-start)
- [Google UMP setup](https://developers.google.com/admob/android/privacy)
- [Google test ads](https://developers.google.com/admob/android/test-ads)
- [Google Play Advertising ID](https://support.google.com/googleplay/android-developer/answer/6048248)

## Pending work

- Plugin installation
- Android native configuration
- Mobile Ads SDK integration
- UMP integration
- Privacy options UI
- Privacy policy advertising update
- European regulations message publication
- Google Play Data safety update
- Advertising ID declaration
- Official test-ad QA
- Production ad unit creation
- Actual ad requests
- Actual ad serving
- First advertising update release
