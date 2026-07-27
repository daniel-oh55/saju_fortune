# AdMob Runtime Consent Bootstrap Contract

## Purpose and scope

This document defines the Android runtime contract for the next production
implementation of AdMob initialization and Google UMP consent gathering.

This is a docs/check-only change. It does not add runtime calls, request or show
an ad, implement the privacy-options UI, or change either Console. Fortune,
profile, storage, routing, and other app features must continue even when the
advertising bootstrap fails.

## Current merged baseline

- Starting `main` HEAD: `f774e74c0f237184ee68fb03d1d4036003ed62b4`
- Previous PR: #405, merged
- Installed plugin: exact `@capacitor-community/admob@8.0.0`
- Android Mobile Ads dependency: 24.9.0
- Android UMP dependency: 4.0.0
- Approved Harupuli AdMob App ID: configured by the merged baseline
- Runtime Mobile Ads initialization: Not started
- UMP runtime integration: Not started
- Ad load/show implementation: Not started
- Production ad units: 0

No App ID is repeated in this document because the merged baseline is the
single source of truth for that value.

## Repository bootstrap investigation

The current React/Vite entry point is `src/main.jsx`. It renders `App.jsx`
inside `React.StrictMode`. Native checks already use
`Capacitor.isNativePlatform()` in `App.jsx`.

Existing advertising scaffolding is intentionally separated:

- `src/services/rewardedAdService.js` is the feature-facing service.
- `src/services/rewardedAdProvider.loader.js` resolves mock versus SDK mode.
- `src/services/rewardedAdProvider.mock.js` is the current working provider.
- `src/services/rewardedAdProvider.sdk.js` is an SDK-unavailable stub.
- `src/config/rewardedAdSdkConfig.js` owns provider selection.
- `src/components/RewardAdModal.jsx` owns the rewarded-ad interaction.

Existing privacy and settings structure is also separate:

- `src/pages/SettingsPage.jsx` contains settings entry points.
- `src/pages/PrivacyInfoPage.jsx` explains stored data and consent state.
- `src/components/ConsentSettingsPanel.jsx` manages the app's existing local
  preferences.
- `src/utils/consentPreferencesStorage.js` owns the existing storage key and
  schema.

The UMP state is authoritative for Mobile Ads eligibility. It must not be
replaced by, merged into, or persisted through the existing app preference
schema. Existing storage keys and schema versions remain unchanged.

The existing Android Debug Build workflow runs `npm ci`, the web build,
Capacitor sync, and `assembleDebug`. Existing targeted Node checkers provide the
repository's regression-check pattern.

## Plugin v8.0.0 API evidence

The installed package metadata and generated TypeScript declarations were
inspected directly under `node_modules/@capacitor-community/admob`.

The public API exposes:

- `AdMob.initialize(options?): Promise<void>`
- `AdMob.requestConsentInfo(options?): Promise<AdmobConsentInfo>`
- `AdMob.showConsentForm(): Promise<AdmobConsentInfo>`
- `AdMob.showPrivacyOptionsForm(): Promise<void>`
- `AdMob.resetConsentInfo(): Promise<void>`

`AdmobConsentInfo` contains:

- `status: AdmobConsentStatus`
- optional `isConsentFormAvailable`
- `canRequestAds: boolean`
- `privacyOptionsRequirementStatus: PrivacyOptionsRequirementStatus`

`AdmobConsentStatus` has `NOT_REQUIRED`, `OBTAINED`, `REQUIRED`, and `UNKNOWN`.
`PrivacyOptionsRequirementStatus` has `NOT_REQUIRED`, `REQUIRED`, and
`UNKNOWN`.

The declarations establish Promise rejection as the error channel. They do not
expose a separate getter for cached `canRequestAds`, consent information, or
Mobile Ads adapter initialization status.

The package's web implementation is not a safe production consent model: it
logs method calls and returns synthetic consent values. The app-level contract
therefore forbids all plugin calls outside native Android and uses `web-noop`.

## Plugin Android implementation evidence

The installed v8.0.0 Android sources were inspected directly:

- `android/src/main/java/com/getcapacitor/community/admob/AdMob.java`
- `android/src/main/java/com/getcapacitor/community/admob/consent/AdConsentExecutor.java`

`requestConsentInfo` delegates directly to `AdConsentExecutor`. That executor
obtains `ConsentInformation` lazily from `UserMessagingPlatform` and calls
`requestConsentInfoUpdate`. It does not call or inspect `MobileAds.initialize`.
Therefore, on Android in v8.0.0, consent information can be requested before
AdMob initialization.

`showConsentForm` similarly uses the UMP object directly and calls
`loadAndShowConsentFormIfRequired`. It does not require prior
`MobileAds.initialize`. On success it resolves with the latest status,
`canRequestAds`, and privacy-options requirement status.

`requestConsentInfo` resolves with all four consent fields on success. Its
failure callback rejects with the UMP error message and returns no cached
consent object. `showConsentForm` also rejects on a form error and returns no
latest consent object. Consequently, the JavaScript wrapper cannot apply
Google's native fallback of checking cached `canRequestAds` after either
rejection. The app contract must fail closed.

`privacyOptionsRequirementStatus` is returned with the Android enum's uppercase
name. `showPrivacyOptionsForm` resolves without a refreshed consent object.

`initialize` calls `MobileAds.initialize`, initializes the banner executor, and
then resolves the plugin call without waiting for the
`OnInitializationCompleteListener`. The plugin source has no app-level
single-flight or completed boolean. Multiple JavaScript calls reach this method.

## Google UMP requirements

Google's Android UMP guidance requires:

- request a consent-information update on every app launch;
- do not rely on a locally cached consent string or app preference;
- after a successful update, load and show a form if required;
- check `canRequestAds` after the update and after consent gathering;
- prevent duplicate ad-request work because either check can become true;
- expose an interactable privacy-options entry point only when its requirement
  status is `REQUIRED`;
- call `showPrivacyOptionsForm` from that user entry point;
- remove consent debug geography and test-device configuration from production.

Google notes that native UMP can retain a prior-session state after an update
error. The installed plugin does not expose that state when its Promise rejects,
so this contract cannot safely use that fallback.

## Mobile Ads initialization considerations

Google requires Mobile Ads initialization once before loading ads. Initialization
can initialize mediation adapters, and the SDK or a mediation partner can
preload ads. Required consent actions and request flags must therefore be
completed before initialization.

Google also recommends waiting for adapter initialization before loading ads
when mediation is used. The installed plugin's Android Promise resolves before
its native initialization callback, so `await AdMob.initialize()` cannot prove
that adapters completed. In this contract, `ready` means the plugin initialize
call resolved; it is not evidence that every mediation adapter is ready.

No ad load or show may be attached to this bootstrap. A later ad-request PR
must re-evaluate adapter-readiness requirements before enabling mediation or the
first request.

## Initialization-order conflict review

The plugin README demonstrates `initialize`, then consent information, then a
form. The installed Android source shows that this order is not technically
required for the consent methods.

Google's current guidance takes precedence because initialization can trigger
SDK or mediation preload before consent actions. The selected contract is
therefore consent first, gate second, initialization third.

This is not an inferred unsupported sequence: the v8.0.0 Android implementation
contains no initialization dependency in either consent method.

## Selected runtime sequence

The next production bootstrap PR must implement this sequence:

1. If the platform is not native Android, enter `web-noop`, call no plugin
   method, and resolve a no-op snapshot.
2. Return the existing module-level bootstrap Promise if one exists.
3. Enter `requesting-consent-info` and call `AdMob.requestConsentInfo()` once
   for this app launch.
4. Record status, form availability, `canRequestAds`, and privacy-options
   requirement status from the successful response.
5. If status is `REQUIRED` and a form is available, enter
   `showing-consent-form` and call `AdMob.showConsentForm()`.
6. Replace the gate and returned fields with the successful form response.
7. If consent is required but a form is unavailable, enter
   `consent-unavailable`, keep the ad gate false, and do not initialize.
8. If the latest `canRequestAds` is not true, enter
   `consent-denied-or-unresolved`, keep the ad gate false, and do not initialize.
9. If `canRequestAds` is true, enter `ready-to-initialize`.
10. Use a separate initialization guard, enter `initializing`, and call
    `AdMob.initialize()` at most once.
11. When the plugin Promise resolves, enter `ready` with the ad gate true.
12. Do not request, load, prepare, or show any ad from the bootstrap.

The coordinator must expose a read-only snapshot or subscription suitable for a
later provider and privacy UI. It must not import or render React components.

## Native and web behavior

Only `Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'android'`
may enter the plugin sequence.

Web, PWA, Vercel, local browser development, and any future non-Android platform
must:

- make zero AdMob/UMP plugin calls;
- emit no error merely because the native plugin is unavailable;
- use `web-noop`;
- keep the runtime ad gate false;
- leave existing mock advertising and non-ad app behavior unchanged.

This PR does not define iOS behavior and does not add `@capacitor/ios`.

## Consent state model

The minimum coordinator states are:

- `idle`
- `requesting-consent-info`
- `showing-consent-form`
- `consent-unavailable`
- `consent-denied-or-unresolved`
- `ready-to-initialize`
- `initializing`
- `ready`
- `failed`
- `web-noop`

The state snapshot must distinguish:

- native-Android platform eligibility;
- whether consent information completed;
- whether a consent form was shown;
- the latest `canRequestAds`;
- the latest `privacyOptionsRequirementStatus`;
- whether Mobile Ads initialization was invoked and resolved;
- the last error stage, without storing a raw sensitive payload;
- whether a bootstrap Promise or initialization guard is already active.

Actual ad loaded/showing states are explicitly outside this model.

## canRequestAds gate

The runtime advertising gate starts false. Only a successful plugin response
whose latest `canRequestAds` is exactly true may open it.

The gate is false for unknown, missing, rejected, stale, or locally persisted
values. `AdmobConsentStatus.OBTAINED` alone is not a substitute for the gate.
The app's existing `consentPreferences.ads` flag is also not a substitute for
UMP's runtime gate.

The later rewarded-ad provider must require both its existing product-level
permission and this runtime UMP gate. It must also use a separate per-placement
or per-request single-flight guard.

## Duplicate execution guard

The coordinator must use a module-level single-flight Promise. All callers in
the same JavaScript runtime receive the same Promise and final snapshot.

This protects:

- React StrictMode development effects;
- repeated bootstrap calls from app components;
- the interval between consent update completion and form dismissal;
- the interval between a true gate and initialization completion.

Initialization requires an additional monotonic guard such as
`initializeStarted` plus `initializeResolved`. A failed initialization must not
loop or retry automatically in the same session. User-driven retry requires a
future, explicit policy and is not part of this contract.

Ad load/request deduplication is a separate responsibility and must be
implemented only in the later ad-request PR.

## Error handling and fail-closed behavior

All advertising bootstrap errors are isolated from normal app startup,
navigation, saved data, fortune generation, and settings.

- `requestConsentInfo` failure: enter `failed`, record
  `lastErrorStage = consent-info`, keep the gate false, do not show a form, and
  do not initialize.
- `showConsentForm` failure: enter `failed`, record
  `lastErrorStage = consent-form`, keep the gate false, and do not initialize.
- `AdMob.initialize` failure: enter `failed`, record
  `lastErrorStage = initialize`, keep the gate false, and do not auto-retry.
- Unsupported/non-native environment: use `web-noop`, not `failed`.

Errors may be logged through the project's normal non-sensitive diagnostics but
must not be persisted to localStorage. Existing schema versions and storage
keys are unchanged.

## Privacy options contract

The official visible label is:

> 개인정보 및 쿠키 설정

After a successful consent-information update, the coordinator exposes
`privacyOptionsRequirementStatus`. When it is `REQUIRED`, a later production UI
PR must add the visible, interactable entry point and invoke
`AdMob.showPrivacyOptionsForm()` on click.

Google's current Android guidance says the UI element should not be visible or
interactable when the status is not required. Therefore the recommendation is
conditional visibility, not an always-visible UMP entry point. Existing local
data settings may remain separately available under their current label.

The coordinator must not import `SettingsPage`, `PrivacyInfoPage`, or any UI
component. Privacy-form completion and errors will need a UI-specific refresh
contract in that later PR.

## Production implementation file plan

Candidate scope for the next runtime-bootstrap PR:

- Add `src/services/admobRuntimeConsentCoordinator.js` for platform gating,
  state, single-flight execution, error isolation, and the initialize guard.
- Update `src/main.jsx` to start the coordinator once without coupling it to
  React rendering success.
- Add a targeted Node regression checker for native/web sequence, state
  transitions, duplicate calls, and failures.
- Update only the related logs and TODO.

Candidate scope for later, separate PRs:

- Update `src/services/rewardedAdProvider.sdk.js` to consume the coordinator
  gate and add ad-request guards.
- Update `src/pages/SettingsPage.jsx` or `src/pages/PrivacyInfoPage.jsx` for the
  conditional privacy-options entry point.
- Add official test-ad configuration and device QA without committing a test
  device identifier or release debug geography.

These are plans, not files created by this PR.

## Test plan

The runtime implementation PR must cover:

- native Android success without a required form;
- native Android success with required and available form;
- required but unavailable form;
- consent denied or unresolved;
- consent information rejection;
- form rejection;
- initialization rejection;
- web/PWA no-op with zero plugin calls;
- non-Android native no-op;
- repeated callers return the same Promise;
- React StrictMode-style duplicate calls;
- initialize invoked at most once;
- no ad request from bootstrap;
- no localStorage write and no schema/key change;
- privacy-options requirement status propagation.

Repository checks must include build, focused checks, existing content and
share checks, and `git diff --check`.

## Android device QA plan

After production runtime code exists, use an approved debug build and an
Android device to verify:

- normal startup remains usable while offline and when UMP errors;
- first-launch form behavior in a supported test geography;
- returning-user behavior;
- form dismissal and denial behavior;
- process restart requests fresh consent information;
- no duplicate form under React StrictMode-equivalent calls;
- no Mobile Ads initialization before the consent gate opens;
- no ad load/show from the bootstrap;
- privacy-options entry visibility and interaction when required;
- useful, non-sensitive logcat diagnostics.

This docs/check-only PR changes no Android runtime file. APK installation and device QA are Not performed and must not be recorded as completed.

## Blocking conditions

The runtime-bootstrap implementation is Ready to enter only within the selected
scope: consent update, optional required form, gate, one initialization call,
state, and web no-op.

The implementation PR is blocked if:

- it cannot preserve consent-before-initialize order;
- it cannot guarantee zero plugin calls on web/non-Android;
- it treats a rejected Promise as permission to request ads;
- it persists UMP state in existing localStorage;
- it combines ad load/show or privacy UI into the bootstrap scope;
- the installed plugin version or Android implementation changes without a new
  evidence review.

The later ad-request PR remains blocked until it addresses the plugin's early
initialization Promise resolution, any mediation adapter-readiness need, a
request-level duplicate guard, approved test-ad configuration, and Android
device QA.

## Explicitly excluded work

- Any `src/**` or `public/**` change
- Android manifest, resources, Java/Kotlin, or Gradle changes
- Package dependency or lockfile changes
- Capacitor, Vite, workflow, service worker, routing, or iOS changes
- Runtime calls to initialize, consent, privacy options, or ads
- Ad unit IDs, test-device identifiers, debug geography, or placeholders
- AdMob Console or Google Play Console changes
- Existing localStorage key or schema changes
- Claims that UMP, runtime advertising, ad requests, or device QA are completed

## Pending work

- Runtime consent coordinator implementation
- Conditional privacy-options UI
- Rewarded-ad SDK provider implementation
- Initialization/mediation readiness decision for the first request
- Official test-ad request
- Android advertising QA
- AdMob Privacy & Messaging publication decision
- Privacy policy and Google Play disclosures
- Production ad units and actual serving

## Rollback plan

Revert the docs/check-only commit. No production source, native project,
dependency, runtime state, stored data, ad request, Console setting, or device
artifact requires rollback.

## Official references

- [Plugin v8.0.0 README](https://github.com/capacitor-community/admob/blob/v8.0.0/README.md)
- [Plugin v8.0.0 Android AdMob.java](https://github.com/capacitor-community/admob/blob/v8.0.0/android/src/main/java/com/getcapacitor/community/admob/AdMob.java)
- [Plugin v8.0.0 Android AdConsentExecutor.java](https://github.com/capacitor-community/admob/blob/v8.0.0/android/src/main/java/com/getcapacitor/community/admob/consent/AdConsentExecutor.java)
- [Plugin v8.0.0 consent info type](https://github.com/capacitor-community/admob/blob/v8.0.0/src/consent/consent-info.interface.ts)
- [Plugin v8.0.0 consent status enum](https://github.com/capacitor-community/admob/blob/v8.0.0/src/consent/consent-status.enum.ts)
- [Plugin v8.0.0 privacy-options status enum](https://github.com/capacitor-community/admob/blob/v8.0.0/src/consent/privacy-options-requirement-status.enum.ts)
- [Google UMP Android setup](https://developers.google.com/admob/android/privacy)
- [Google Mobile Ads Android setup](https://developers.google.com/admob/android/quick-start)
- [Google Mobile Ads initialization optimization](https://developers.google.com/admob/android/optimize-initialization)
- [Google AdMob mediation setup](https://developers.google.com/admob/android/mediation)
