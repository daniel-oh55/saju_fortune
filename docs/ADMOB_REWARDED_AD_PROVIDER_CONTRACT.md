# AdMob Rewarded Ad Provider Contract

## 1. Status and scope

- Status: Contract design Completed; runtime implementation Pending.
- PR: #410, docs/check-only.
- Baseline: merged `main` at `871c81c48e0c8a787eb635679c0b2f0d32b25071`.
- Installed plugin: `@capacitor-community/admob@8.0.0`.
- This PR performs current-state investigation, installed-source investigation,
  provider contract design, and checker creation only.
- No actual ad request/load/show in PR #410.
- No official test-ad request, production ad request, or actual ad serving is
  performed.
- Production UI, application logic, native projects, storage, schema, and
  console configuration remain unchanged.

Completed in this PR:

- Current mock/provider inventory
- Installed plugin v8.0.0 source investigation
- Provider selection and dual gate design
- Authoritative reward and exactly-once design
- Test/production separation design
- PR #411 implementation file plan
- Targeted creation/post-merge checker

Checker lifecycle:

- PR #410 creation mode validates the exact docs/check-only scope and the
  current stub baseline. It rejects production source, dependency, lockfile,
  workflow, runtime prepare/show, storage, schema, and routing changes.
- After merge, the same contract checker validates only the durable contract,
  package script, document quality, preserved local-file rules, dependency-map
  shape, and completion-claim guardrails.
- Post-merge mode does not require the SDK provider to remain a stub, retain
  `SDK_UNAVAILABLE`, omit `prepareRewardVideoAd`, omit `showRewardVideoAd`, or
  retain mock-specific loader/modal implementation details.
- PR #411 must not modify this contract checker merely to permit the planned
  implementation. Production behavior and implementation correctness belong
  to the separate `scripts/checkAdmobRewardedAdProvider.mjs` checker planned
  for that PR.

Pending:

- SDK provider production code
- Official test-ad request, ad load, and ad show
- Actual reward event device verification
- Production ad unit and actual ad serving
- Android test-ad QA and ADB logcat
- Google Play disclosure update
- Release signing, AAB generation, and Play upload

## 2. Current implementation inventory

The current default provider is `mock`. `rewardedAdSdkConfig.js` reads
`VITE_REWARDED_AD_PROVIDER` and `VITE_REWARDED_AD_SDK_ENABLED`; an absent or
unknown provider resolves to mock.

The SDK selection path checks only `consentPreferences.ads === true`.
`getAdmobRuntimeConsentSnapshot()` and its `adGateOpen` value are not yet
connected to the rewarded request path. The SDK provider is an
`SDK_UNAVAILABLE` stub. There is no ad unit ID and no actual advertising
request, load, show, or serving.

The existing mock flow waits two seconds. `RewardAdModal` renders the mock
countdown, calls the selected provider after the countdown, and calls
`onRewardComplete` only when `result.ok` is true. `App.handleUnlockDetail`
currently guards the fortune ID, receives the category ID from its callers,
and persists through `saveRewardUnlock`. PR #411 must explicitly require both
IDs before persistence. The current storage key and shape remain unchanged.

Relevant flow:

1. `RewardAdModal`
2. `showRewardedAd`
3. `showRewardedAdWithResolvedProvider`
4. mock completion or SDK stub result
5. `result.ok === true`
6. `onRewardComplete`
7. `App.handleUnlockDetail`
8. `saveRewardUnlock`

## 3. Installed plugin v8.0.0 evidence

The following installed, read-only files are the authority for this contract:

- `node_modules/@capacitor-community/admob/package.json`
- `node_modules/@capacitor-community/admob/dist/esm/definitions.d.ts`
- `node_modules/@capacitor-community/admob/dist/esm/reward/reward-definitions.interface.d.ts`
- `node_modules/@capacitor-community/admob/dist/esm/reward/reward-ad-plugin-events.enum.d.ts`
- `node_modules/@capacitor-community/admob/dist/esm/reward/reward-item.interface.d.ts`
- `node_modules/@capacitor-community/admob/android/src/main/java/com/getcapacitor/community/admob/rewarded/AdRewardExecutor.java`
- `node_modules/@capacitor-community/admob/android/src/main/java/com/getcapacitor/community/admob/rewarded/RewardedAdCallbackAndListeners.kt`
- `node_modules/@capacitor-community/admob/android/src/main/java/com/getcapacitor/community/admob/rewarded/RewardAdPluginEvents.kt`
- `node_modules/@capacitor-community/admob/android/src/main/java/com/getcapacitor/community/admob/helpers/FullscreenPluginCallback.kt`
- `node_modules/@capacitor/core/types/definitions.d.ts`

Installed declarations:

- `prepareRewardVideoAd(options): Promise<AdLoadInfo>`
- `showRewardVideoAd(): Promise<AdMobRewardItem>`
- `AdMobRewardItem` has `type: string` and `amount: number`.
- `addListener(...)` returns `Promise<PluginListenerHandle>`.
- `PluginListenerHandle.remove()` returns `Promise<void>`.

Installed Android implementation:

- Prepare constructs a request and calls `RewardedAd.load`.
- `onAdLoaded` stores the native ad, installs the fullscreen callback, resolves
  prepare with `AdLoadInfo`, and emits `RewardAdPluginEvents.Loaded`.
- `onAdFailedToLoad` emits `FailedToLoad` and rejects prepare.
- Show rejects immediately and emits `FailedToLoad` if no prepared ad exists.
- Show calls the native ad with an `OnUserEarnedRewardListener`.
- Only `OnUserEarnedRewardListener` creates `{type, amount}`, emits `Rewarded`,
  and resolves the show call.
- `FullscreenPluginCallback` emits `Showed`, `FailedToShow`, and `Dismissed`.
  It does not resolve or reject the show call.

Consequently, a dismissal or a FailedToShow event before reward can leave the
show Promise pending. The implementation must combine event observation with
bounded timeouts and cleanup, without treating those events as rewards.

`RewardAdPluginEvents` semantics:

- `Loaded`: the ad is prepared; it is not a reward.
- `Showed`: the fullscreen ad became visible; it is not a reward.
- `FailedToLoad`: preparation failed, or show found no prepared ad.
- `FailedToShow`: fullscreen presentation failed.
- `Dismissed`: the ad is no longer visible. Dismissed is not reward and can
  occur both before and after a reward.
- `Rewarded`: the native reward callback emitted the reward payload.

## 4. Official test-ad guidance

PR #411 may use only the Google official rewarded demo ad path for development
and Galaxy S23 Ultra QA. No live production ad may be clicked during
development.

This document intentionally contains no demo ad unit ID, production ad unit
ID, placeholder unit ID, test-device ID, or `debugGeography` value. Any future
official demo identifier must be centrally configured and protected from
production use.

## 5. Provider selection contract

- `provider=mock`: preserve the existing mock flow and two-second test UI.
- `provider=sdk` with `sdkEnabled=false`: return `SDK_UNAVAILABLE`; no mock
  fallback.
- `provider=sdk` on Web, PWA, iOS, or another non-Android runtime: return
  `SDK_UNAVAILABLE` or another safe zero-call result; make zero plugin calls
  and use no mock fallback.
- `provider=sdk` with either gate closed: fail closed, make no plugin ad call,
  and use no SDK-to-mock fallback.

The default remains mock until an explicit, valid SDK configuration is
selected. An SDK failure must never be hidden by reporting mock success.

## 6. Dual gate contract

Every SDK action requires both independent gates:

1. Local ads consent gate: `consentPreferences.ads === true`.
2. Latest AdMob runtime gate from `getAdmobRuntimeConsentSnapshot()`:
   `isNativeAndroid === true`, `consentInfoCompleted === true`,
   `canRequestAds === true`, `initializeResolved === true`, and
   `adGateOpen === true`.

The implementation must read fresh state:

1. Before the rewarded action starts.
2. At the pre-prepare gate immediately before `prepareRewardVideoAd`.
3. At the pre-show gate after prepare succeeds and immediately before
   `showRewardVideoAd`.

If either gate closes after prepare and before show, show is called zero times,
no reward is delivered, no new request is automatically retried, and the
action returns fail closed with `AD_GATE_CLOSED`.

Local consent and Google UMP state remain independent. The app must not copy
one into the other or silently change local consent.

## 7. Reward authority and exactly-once contract

The single authoritative reward signal is a successfully resolved
`showRewardVideoAd()` Promise containing a valid `AdMobRewardItem`.

This choice follows the installed Android v8.0.0 source: the show call is
resolved only inside `OnUserEarnedRewardListener`, using the same payload that
is emitted through `RewardAdPluginEvents.Rewarded`. The `Rewarded` event is not
a second unlock authority. It may be observed for lifecycle diagnostics, but
Promise and event must never each unlock.

The payload is valid only when:

- It is a non-null object.
- `amount` is a finite number greater than zero.
- `type` is a string.

An invalid payload is not `COMPLETED`. The returned amount never grants
multiple unlocks or creates currency. One verified action unlocks the existing
detail once.

Each action has explicit `settled` and `rewardDelivered` guards at the
provider/service boundary:

- `onRewardComplete` at most once.
- `saveRewardUnlock` at most once.
- Duplicate Rewarded events at most one reward.
- Promise and event arrival at most one reward.
- Late events after dismiss or settlement produce no additional reward.
- React rerender and StrictMode produce no additional reward.
- Rapid repeated taps produce no duplicate ad or reward.

Storage idempotency is defense in depth, not the primary exactly-once guard.
Reward only after verified signal. Loaded, Showed, Dismissed, a mere Promise
completion without a valid payload, action start, failure, and early close
must never unlock content.

## 8. Load/show lifecycle

Required sequence:

1. Check the dedicated rewarded single-flight.
2. Validate provider and configuration.
3. Validate native Android.
4. Validate local ads consent.
5. Validate the latest AdMob runtime gate.
6. Validate ad mode and unit ID.
7. Register required listeners.
8. Run the pre-prepare gate and call `prepareRewardVideoAd`.
9. Map prepare rejection or FailedToLoad to `LOAD_FAILED`.
10. Run the pre-show gate.
11. Call `showRewardVideoAd`.
12. Await the authoritative reward, dismissal/failure observation, or timeout.
13. Settle exactly once.
14. Remove listener handles.
15. Clear single-flight state.

Lifecycle mapping:

- Loaded: prepared only; no reward.
- Showed: visible only; no reward.
- Valid resolved reward Promise: authoritative reward and `COMPLETED`.
- Dismissed before reward: `CANCELED` or `NO_REWARD`.
- Dismissed after reward: keep the completed result; no duplicate reward.
- FailedToLoad: `LOAD_FAILED`.
- FailedToShow or show rejection: `SHOW_FAILED`.

If the runtime gate closes after a native ad is already shown, do not
arbitrarily tear down that in-progress fullscreen ad. A genuine authoritative
reward from that current action may still be honored. All later new requests
must be blocked until the gate reopens.

## 9. Single-flight and concurrency

Maintain one module/service-level in-flight Promise for rewarded ads. If an
action is already running, every caller receives the single-flight same
Promise object, not an async wrapper. There must be no duplicate prepare,
duplicate show, or overlapping native fullscreen ad.

Clear the shared reference in `finally`. After settlement and cleanup, a
deliberate new user attempt creates a new Promise.

## 10. Listener cleanup

When listeners are used:

- Await and store each returned `PluginListenerHandle`.
- In `finally`, call each handle's `remove()`.
- removeAllListeners is prohibited because it could remove listeners owned
  by consent, banner, interstitial, or other AdMob features.
- Clean up handles even when only part of setup succeeded.
- Isolate listener callback exceptions from the provider Promise.
- Ignore late callbacks through `settled` and `rewardDelivered` guards.
- Leave no listener accumulation after settlement.

Cleanup failure must not reverse an already verified reward result. Continue
best-effort cleanup, avoid exposing native error text, and ensure the next
action is not intentionally attached to old handles.

## 11. Timeout and fail-closed behavior

PR #411 must define centrally managed, injectable/testable bounded constants
for:

- Ad load timeout
- Native show-start timeout
- Reward/dismiss lifecycle timeout

On timeout:

- Deliver no reward.
- Clear pending and disabled UI state.
- Clean up listeners.
- Return `TIMEOUT` or a more specific already-known failure.
- Do not retry automatically.
- Permit a later deliberate user retry.

Infinite loading, a permanently pending show Promise, and a permanently
disabled button are prohibited. Native error payloads and messages must not be
shown to users or stored in localStorage.

Installed Android v8.0.0 source has an important unsettled-call limitation:
`Dismissed` and `FailedToShow` notify listeners, but those callbacks do not
resolve or reject the `showRewardVideoAd` `PluginCall`. Only the reward callback
resolves that call; synchronous setup failures can reject it.

App-level timeout does not cancel or settle the native PluginCall. It settles
only this app action, restores the app UI, and ignores late callbacks.
Listener handle cleanup is separate from native PluginCall settlement and must
not be described as canceling or settling the native call.

This is an **Unsettled native call risk; device verification required**, not a
confirmed native memory leak. Android QA and ADB logcat must cover repeated
early dismissal, any reproducible `FailedToShow` path, a later deliberate
retry, listener accumulation, stuck fullscreen or pending state, and recovery
after retry. Those checks remain Pending until they run on the target device.

## 12. UI and persistence boundary

Mock provider:

- May retain the current two-second countdown and current test behavior.

SDK provider:

- Must not use the fake two-second viewing countdown.
- The native rewarded ad performs playback.
- Show an honest preparation/pending state after the user's tap.
- Disable duplicate action while prepare/show is pending.
- Update modal state when the native lifecycle settles.
- Close and call `onRewardComplete` only for `COMPLETED`.
- Keep the modal usable for retry after failure, cancellation, or a closed
  gate.
- Never claim “광고 시청 완료” when no real ad was watched.
- Replace stale mock-only copy before enabling the SDK path.

If local ads consent is false, the UI may guide the user to the existing data
use settings. If the runtime gate is closed, it may guide the user to review
privacy and cookie settings. An ad-button tap must not automatically open a
UMP form; the Settings privacy-options entry remains the user-controlled path.

The provider/service decides reward validity. `App.handleUnlockDetail` only
persists a verified decision. It must save nothing without a fortune ID or
category ID.

Do not store UMP status, `canRequestAds`, `adGateOpen`, native reward payload,
native errors, or ad load objects in localStorage. Existing storage/schema
unchanged means the reward unlock key and shape, consent key, and fortune
schema remain untouched.

## 13. Test/production configuration

Future configuration requires:

- Existing `VITE_REWARDED_AD_PROVIDER`
- Existing `VITE_REWARDED_AD_SDK_ENABLED`
- A separate rewarded ad mode: `official_test` or `production`
- One centrally resolved rewarded ad unit ID
- Fail-closed validation before any plugin request

Official test mode:

- Uses only the official Google demo rewarded path.
- Passes `isTesting` explicitly.
- Is used for development and device QA.

Production mode:

- Production ad unit pending and Blocked until a real centrally supplied ID
  and required console/disclosure work exist.
- A missing ID causes zero ad requests and fail closed.
- Debug builds must not select production IDs.
- Production builds must not select demo IDs.
- Test and production modes must never merge or fall back into each other.

## 14. Outcome mapping

Keep existing `REWARDED_AD_OUTCOME` values and add the minimum explicit values
needed by PR #411:

| Outcome | Contract meaning |
| --- | --- |
| `COMPLETED` | Valid authoritative reward received |
| `SDK_UNAVAILABLE` | SDK disabled, unsupported, or safely unavailable |
| `ADS_CONSENT_REQUIRED` | Local `consentPreferences.ads` is not true |
| `AD_GATE_CLOSED` | Latest native/UMP/initialization runtime gate is closed |
| `LOAD_FAILED` | Prepare rejected or FailedToLoad occurred |
| `SHOW_FAILED` | Show rejected or FailedToShow occurred |
| `CANCELED` | User dismissed before authoritative reward |
| `NO_REWARD` | Lifecycle ended without authoritative reward |
| `TIMEOUT` | A bounded load/show/lifecycle deadline elapsed |
| `UNEXPECTED_ERROR` | Sanitized, unclassified provider failure |

Only `COMPLETED` has `ok: true`. User messages must be stable, friendly,
action-oriented copy and must not include native error originals.

## 15. PR #411 implementation plan

PR #411 is limited to a native-Android official test rewarded path, dual
consent gate, dedicated single-flight, exactly-once reward, test ad
request/load/show, and Android device QA. It does not enable production ad
units or actual production serving.

Planned files:

- `src/services/rewardedAdProvider.sdk.js`: native SDK lifecycle, reward
  validation, guards, listener cleanup, and timeouts.
- `src/services/rewardedAdProvider.loader.js`: strict provider/platform/gate
  dispatch without mock fallback.
- `src/services/rewardedAdProvider.types.js`: explicit outcomes.
- `src/services/rewardedAdService.js`: sanitized outcome messages and
  single-flight boundary if not owned by the SDK provider.
- `src/config/rewardedAdSdkConfig.js`: explicit mode, build, enablement, and
  fail-closed ID resolution.
- `src/components/RewardAdModal.jsx`: separate honest mock and SDK UI states.
- `package.json`: targeted behavioral checker command only.
- `scripts/checkAdmobRewardedAdProvider.mjs`: production and behavioral
  guardrails.
- `CHANGELOG.md`, `DEVELOPMENT_LOG.md`, and `TODO.md`: verified status only.

`src/App.jsx` is removed from the plan because its current persistence callback
already has the correct boundary and should not change unless implementation
evidence proves otherwise. Placement configuration is also unchanged unless a
central ad-unit resolver cannot cleanly live in `rewardedAdSdkConfig.js`.

## 16. Automated test plan

PR #411 must cover:

1. Provider mock default path
2. SDK disabled
3. Web with SDK selected
4. iOS/non-Android with SDK selected
5. Local ads consent false
6. `adGateOpen` false
7. `initializeResolved` false
8. Missing test/production ad unit
9. Prepare success
10. Prepare failure
11. Prepare timeout
12. Gate withdrawn after prepare
13. Show success with valid reward
14. Show failure
15. Show timeout
16. Dismiss before reward
17. Reward then dismiss
18. Duplicate Rewarded event
19. Promise and Rewarded event duplicate
20. Invalid reward payload
21. Rapid repeated taps receive the same Promise
22. Listener reentry receives the same Promise
23. Deliberate retry after completion
24. Partial listener setup cleanup
25. Callback throw isolation
26. Unmount/background/resume
27. Local consent and UMP remain unchanged
28. Reward unlock at most once
29. Unlock zero times on ad failure
30. No SDK-to-mock fallback
31. Missing production ID fails closed
32. Production build rejects demo ID

## 17. Android device QA plan

All items are Pending until PR #411 is implemented and tested on Galaxy S23
Ultra:

- Official Test Ad display and Test Ad label
- Prepare success and native fullscreen show
- Full viewing unlocks one detail
- Early close does not unlock
- Rapid repeated taps show one ad
- Duplicate reward is not delivered
- Closed UMP gate makes zero requests
- Local ads setting false makes zero requests
- Offline load failure
- Background/resume and app restart
- ADB logcat review
- Existing fortune feature regression
- Confirmation that no production ad is displayed

Android test-ad QA pending. This PR performs no device advertising QA.

## 18. Blockers and pending work

- Production ad unit creation and safe environment delivery
- Release-mode gate that excludes demo IDs
- Google Play and privacy disclosure review
- PR #411 implementation and automated behavioral verification
- Galaxy S23 Ultra official test-ad QA
- ADB logcat verification
- Production readiness review before any live advertising

Until these are completed, production ad request/load/show and actual ad
serving remain Blocked and must not be reported as Completed.
