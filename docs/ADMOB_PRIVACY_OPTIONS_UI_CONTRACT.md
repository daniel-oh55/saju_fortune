# AdMob Privacy Options UI Contract

## Purpose and scope

This docs/check-only contract defines the production behavior for the
`개인정보 및 쿠키 설정` entry point before implementation. It fixes the
visibility rule, the Google UMP action sequence, post-form state refresh,
local-consent boundaries, duplicate-interaction protection, and fail-closed
behavior.

This change does not implement production UI, call a runtime API, request an
ad, or modify either advertising console. The privacy-options UI
implementation remains Pending.

## Current merged baseline

- Baseline: merged PR #407 at
  `60f44f6e89ed388b80fabbc4e9a6bc6408e075d9`.
- `src/main.jsx` starts the native consent bootstrap without blocking React.
- `src/services/admobRuntimeConsentCoordinator.js` exposes immutable snapshot,
  subscription, and single-flight bootstrap APIs.
- The coordinator records `canRequestAds`,
  `privacyOptionsRequirementStatus`, initialization state, and `adGateOpen`.
- The coordinator does not expose a privacy-options action or refresh API.
- AdMob SDK and UMP bootstrap are connected on native Android.
- Production ad units: 0. Ad request/load/show implementation: Not started.

## Existing privacy and consent UI

`SettingsPage` currently renders this order in `settings-menu-list`:

1. 개인정보 안내 보기
2. 데이터 사용 설정
3. 저장 데이터 초기화

The data-use panel edits the app's existing local preferences: `analytics`,
`ads`, and `personalizedAds`. `App.jsx` owns that panel and passes the saved
preferences to `SettingsPage` and `PrivacyInfoPage`.

`PrivacyInfoPage` is an informational page, not the canonical settings action
list. No privacy-options button, native form action, new route, or application
modal currently exists.

## Existing copy accuracy review

`PrivacyInfoPage` and `ConsentSettingsPanel` still say, in effect, that no real
advertising SDK is connected and that only the mock rewarded provider is used.
That copy predates PR #407 and is no longer a complete description.

The production UI PR must make the following facts accurate without implying
that advertisements are already served:

- AdMob SDK and UMP consent bootstrap are connected.
- No production ad unit ID exists in this implementation scope.
- Ad request/load/show remains unimplemented and actual ad serving has not
  started.
- External SDK communication relevant to the privacy notice must be described
  accurately.
- The existing mock rewarded provider still does not request a real ad.

This docs/check-only PR does not edit the JSX copy.

## Plugin v8.0.0 API evidence

The installed package is exactly `@capacitor-community/admob@8.0.0`.
Inspection covered its distributed TypeScript declarations rather than relying
only on the README.

- `requestConsentInfo(options?): Promise<AdmobConsentInfo>` returns
  `status`, `isConsentFormAvailable`, `canRequestAds`, and
  `privacyOptionsRequirementStatus`.
- `showPrivacyOptionsForm(): Promise<void>` returns no
  `AdmobConsentInfo`.
- `showConsentForm(): Promise<AdmobConsentInfo>` is a separate startup consent
  form operation.
- `initialize(options?): Promise<void>` initializes Mobile Ads.
- `PrivacyOptionsRequirementStatus` has `REQUIRED`, `NOT_REQUIRED`, and
  `UNKNOWN`.
- No public Mobile Ads deinitialize, shutdown, or consent-revocation teardown
  API is exposed by the installed plugin.

Therefore a successful privacy-options form dismissal alone cannot update the
JavaScript snapshot with the latest values.

## Plugin Android implementation evidence

The installed Android `AdMob` plugin delegates the privacy-options method to
`AdConsentExecutor`.

`AdConsentExecutor.showPrivacyOptionsForm`:

- obtains the current `Activity` and rejects if it is unavailable;
- calls UMP `UserMessagingPlatform.showPrivacyOptionsForm`;
- rejects the Capacitor call when the UMP dismissal callback contains an
  error;
- otherwise resolves the call with no payload.

`AdConsentExecutor.requestConsentInfo`:

- reuses its `ConsentInformation` instance;
- calls UMP `requestConsentInfoUpdate`;
- on success reads the current consent status, form availability,
  `canRequestAds`, and privacy-options requirement status;
- resolves those values as `AdmobConsentInfo`;
- rejects on update failure.

The refresh method does not itself call `showConsentForm`. The latter maps to
the separate UMP `loadAndShowConsentFormIfRequired` operation. The installed
source therefore supports refreshing consent information without automatically
opening a second consent form.

## Google UMP privacy-options requirements

Current Google Android UMP guidance requires an app to:

- request updated consent information on each app launch;
- check privacy-options requirement status after the update;
- provide a visible, interactable entry point only when the status is
  `REQUIRED`;
- hide or make the entry point non-interactable when it is not required;
- present the UMP privacy-options form from the publisher-rendered entry point;
- check `canRequestAds` before any ad request;
- prevent duplicate ad-request work when consent is checked from more than one
  callback.

Google also documents privacy options as the mechanism by which applicable
users can modify or withdraw choices. Closing the form is not proof that a
choice changed.

## Local consent versus UMP boundary

These are independent controls.

**Data use settings**

- App-level, optional preferences stored under the existing localStorage key.
- Contains `analytics`, `ads`, and `personalizedAds`.
- Keeps the existing policy/schema and remains under application control.

**개인정보 및 쿠키 설정**

- Opens the native Google UMP privacy-options form.
- Exists only when the current UMP requirement status is `REQUIRED`.
- UMP values are not copied into localStorage.
- It does not mutate `consentPreferences.ads` or any other app preference.

The controls must not share a button or toggle. This work must not delete the
existing preferences, change `schemaVersion`, or change a localStorage key.
Future ad request/load/show code must independently require both the app-level
advertising preference and the runtime UMP `adGateOpen`; this PR does not
implement that request path.

## Entry-point visibility contract

Define:

`shouldShowPrivacyOptionsEntry =
isNativeAndroid && consentInfoCompleted &&
privacyOptionsRequirementStatus === 'REQUIRED'`

The entry is visible and interactable only when that expression is true. It is
hidden, without an error message, on Web, Vercel, PWA, iOS, non-Android,
pre-bootstrap state, `null`, `UNKNOWN`, `NOT_REQUIRED`, and a failed state in
which the requirement cannot be established.

The action must re-check native Android and `REQUIRED` immediately before
calling the plugin. A stale visible button is not authority to call native
code.

## Selected UI location

`SettingsPage` is the single canonical entry point. The production order is:

1. 개인정보 안내 보기
2. 데이터 사용 설정
3. 개인정보 및 쿠키 설정, only when required
4. 저장 데이터 초기화

Use the existing `settings-menu-list` button treatment, including its mobile
touch target and typography. Do not duplicate the action on
`PrivacyInfoPage`. A second entry point adds state wiring and duplicate-action
risk without improving discoverability because users already reach both
privacy and data controls from Settings.

No new route, app modal, Context, Redux store, or external state library is
needed. Google UMP supplies the native form.

## Privacy-options action sequence

The production action contract is:

1. Re-check native Android and current `REQUIRED` status.
2. If an action Promise exists, return that same Promise.
3. Publish pending/opening UI state and disable the button.
4. Invoke the plugin privacy-options form.
5. After successful dismissal, enter refreshing state.
6. Request fresh consent information.
7. Publish the latest `privacyOptionsRequirementStatus` and recompute entry
   visibility.
8. Publish the latest `canRequestAds` and reconcile initialization and
   `adGateOpen`.
9. Clear pending state and publish completed or failed feedback.
10. Do not request, load, or show an ad.

The native call count is zero when the platform or requirement precondition
fails.

## Post-form consent refresh contract

Candidate A is selected:

`privacy-options form -> requestConsentInfo -> snapshot refresh`

Candidate B is unavailable because plugin v8.0.0 exposes no JavaScript getter
for the Android executor's current `ConsentInformation`. Candidate C is
rejected because waiting for an app restart leaves `canRequestAds` and entry
visibility stale.

The selected refresh:

- can immediately return current `canRequestAds` and
  `privacyOptionsRequirementStatus`;
- uses a public plugin v8.0.0 API;
- does not require a restart;
- does not reset or reuse the startup bootstrap Promise;
- does not call `showConsentForm` after refresh;
- does not automatically display another consent form after the
  privacy-options form closes.

The installed Android implementation shows that a repeated
`requestConsentInfo` call maps to `requestConsentInfoUpdate` and is callable.
Google requires fresh information at launch and exposes the update API for
current status. Direct official guidance specifically requiring a second
network update after privacy-options dismissal was not found; this extra call
is the necessary plugin-level bridge because the plugin discards the native
dismissal callback's updated getter state. Android device QA must verify this
bridge against the configured production UMP message.

## Consent revocation behavior

When the refreshed result has `canRequestAds === false`:

- store raw `canRequestAds: false`;
- immediately publish `adGateOpen: false`;
- publish the latest privacy-options requirement status;
- do not reinitialize or attempt to deinitialize Mobile Ads;
- prevent every later ad request/load/show path;
- preserve all non-ad application features.

The plugin exposes no production teardown API for an initialized Mobile Ads
SDK. Revocation is therefore enforced by closing the request gate, not by
inventing a teardown operation.

## Consent grant behavior

When the refreshed result has `canRequestAds === true`:

- retain raw `canRequestAds: true`;
- if the existing initialize Promise resolved, `adGateOpen` may become true;
- if initialization has never started, invoke the existing initialize-once
  guard and open the gate only after it resolves;
- if initialization rejects, preserve raw `canRequestAds: true` but keep
  `adGateOpen: false`;
- do not automatically retry a rejected initialize Promise in the same
  coordinator lifetime;
- do not request, load, or show an ad.

If initial consent denied access, PR #407's initialize guard remains unused, so
a later grant can start the one allowed initialization attempt. If Mobile Ads
was already initialized before revocation, a later grant reuses the resolved
guard rather than initializing again.

## Single-flight and duplicate interaction guard

Maintain a privacy-options action Promise separate from the bootstrap Promise
and initialize Promise.

- The first valid tap creates the action Promise.
- Every tap while opening or refreshing returns that exact Promise.
- The button remains disabled while the Promise is pending.
- The action Promise is cleared in `finally`, allowing a deliberate later
  attempt.
- Bootstrap is neither reset nor called again.
- Initialize continues to use the existing initialize-once guard.
- No action callback performs ad request/load/show work.

This prevents multiple native forms and duplicate initialization work while
allowing a retry after a visible action or refresh failure.

## UI state model

The minimal conceptual states are `hidden`, `available`, `opening`,
`refreshing`, `completed`, and `failed`.

Required view values:

- `shouldShowPrivacyOptionsEntry`
- `privacyOptionsRequirementStatus`
- `isPrivacyOptionsActionPending`
- `privacyOptionsActionMessage`
- `lastPrivacyOptionsErrorStage`

`lastPrivacyOptionsErrorStage` is either `privacy-options-form`,
`privacy-options-refresh`, or `initialize`; it is not an exception object.
Messages are short, user-facing, and held in memory only. Do not persist raw
errors, native messages, or action state in localStorage. Dismissal alone must
not produce copy that claims consent changed.

## Error handling and fail-closed behavior

**Form failure**

- Preserve app availability and the last known consent snapshot.
- Never change the snapshot to an allowed state.
- Keep or close the existing gate according to the already verified snapshot;
  never open it because of the failure.
- Clear pending state and allow a later user retry.
- Show a short message such as "설정 화면을 열지 못했어요. 잠시 후 다시 시도해 주세요."
- Do not automatically retry.

**Refresh failure**

- Preserve app availability and non-ad features.
- Record `privacy-options-refresh` without persisting the exception.
- Because the plugin rejection contains no fresh cached consent object, set
  `adGateOpen: false` as a fail closed result.
- Do not overwrite raw prior values with invented values.
- Recompute the entry only from a subsequently verified snapshot.
- Do not call a consent form and do not retry automatically.

**Initialize failure after grant**

- Keep raw `canRequestAds: true`.
- Keep `adGateOpen: false`.
- Do not perform ad work.

## Native and web behavior

Native Android with completed consent information and `REQUIRED` status is the
only supported path.

Web, Vercel, PWA, iOS, and every non-Android runtime:

- hide the entry;
- perform zero plugin calls;
- do not show a privacy-options error;
- keep all existing features operational.

Although the plugin package contains a Web implementation, the app must not
use its mock-returning consent methods for this feature.

## Initial snapshot hydration and late subscribers

`src/main.jsx` calls `bootstrapAdmobRuntimeConsent()` before React render. The
coordinator's `subscribe(listener)` API only registers the listener; subscribe
does not replay current snapshot. App state initializes from
getAdmobRuntimeConsentSnapshot, because relying exclusively on the
subscription would miss a bootstrap result that was published before mount.

The production `App.jsx` contract is:

```jsx
const [admobSnapshot, setAdmobSnapshot] = useState(
  () => getAdmobRuntimeConsentSnapshot(),
)

useEffect(() => {
  setAdmobSnapshot(getAdmobRuntimeConsentSnapshot())

  return subscribeAdmobRuntimeConsent((nextSnapshot) => {
    setAdmobSnapshot(nextSnapshot)
  })
}, [])
```

App effect re-reads current snapshot before registering the subscription so a
change between render and effect registration is synchronized. These
operations are consecutive synchronous effect statements, so a publish cannot
interleave between the re-read and listener registration. App subscribes for
future snapshots after that re-read and returns the coordinator unsubscribe
function as the effect cleanup.

SettingsPage visibility is derived from this hydrated `admobSnapshot`, not
from a default React value or persisted state. Late subscribers must not miss
completed bootstrap state. Bootstrap is not restarted from App, and
localStorage does not supply the AdMob runtime snapshot. The App must not reset
the coordinator or assume that a subscription automatically replays an
earlier publish.

The required late-subscriber outcomes are:

- If bootstrap reaches `ready` before App mount, the lazy state initializer
  reads that snapshot and the entry is visible when its requirement is
  `REQUIRED`.
- If bootstrap reaches `consent-denied-or-unresolved` before App mount, the
  initializer reads that state. A verified `REQUIRED` requirement may expose
  the entry, while `adGateOpen` remains `false`.
- If bootstrap reaches `failed` before App mount without a verified
  requirement, the entry remains hidden. If the snapshot preserves an earlier
  completed and verified `REQUIRED` requirement, the entry remains visible
  under the normal visibility expression while `adGateOpen` remains `false`.
- If bootstrap publishes after App mount, the subscriber receives the latest
  snapshot and immediately updates the derived UI.

Changing `subscribe` to emit the current snapshot immediately is an
alternative API design, but it is not selected for this implementation. The
selected contract remains App-side snapshot reads plus subscription.

## Production implementation file plan

The next production PR should be limited to these candidates:

- `src/services/admobRuntimeConsentCoordinator.js`: add a dedicated
  single-flight privacy-options action, refresh path, snapshot fields, and gate
  reconciliation while reusing initialize-once.
- `src/App.jsx`: import `getAdmobRuntimeConsentSnapshot` and
  `subscribeAdmobRuntimeConsent`; hydrate current state with a lazy `useState`
  initializer; re-read the latest snapshot in the effect; subscribe for future
  snapshots; return the subscription cleanup; and pass the action and derived
  state to Settings. Do not restart bootstrap. App props, routing, and storage
  remain unchanged.
- `src/pages/SettingsPage.jsx`: add the conditional canonical button and
  pending/status presentation.
- `src/pages/PrivacyInfoPage.jsx`: correct the stale advertising SDK status
  explanation.
- `src/components/ConsentSettingsPanel.jsx`: explain that local preferences do
  not replace Google UMP choices and correct stale SDK copy.
- `src/styles.css`: add only minimal pending/status styling if existing styles
  cannot cover it.
- `scripts/checkAdmobPrivacyOptionsUi.mjs`: targeted runtime/UI behavior and
  scope checks.
- `package.json`, `CHANGELOG.md`, `DEVELOPMENT_LOG.md`, and `TODO.md`: one
  checker command and accurate implementation records.

No new route or state-management dependency is planned. Investigation found
all listed production candidates relevant; `src/main.jsx` is excluded because
the existing bootstrap entry remains correct.

## Test plan

The production implementation PR must test:

- bootstrap completes before App mount (late subscriber);
- the lazy `useState` initializer reads the current snapshot;
- the effect re-reads the current snapshot;
- the subscription receives future publishes without assuming past replay;
- mount-before-render `REQUIRED` shows the entry;
- mount-before-render `NOT_REQUIRED` hides the entry;
- mount-before-render Web no-op hides the entry;
- a snapshot change between render and effect registration is synchronized;
- component unmount invokes the subscription cleanup;
- React StrictMode effect re-registration leaves no duplicate listener;
- native Android + `REQUIRED` visible state;
- all hidden platform/status cases;
- stale-status re-check before the call;
- form resolve/reject;
- refresh resolve/reject;
- latest requirement status and visibility update;
- revocation closes `adGateOpen`;
- first grant invokes initialize-once;
- resolved initialization is reused;
- initialization failure keeps the gate closed;
- repeated taps share one Promise and one native form;
- local preferences and storage remain unchanged;
- no ad request/load/show side effect;
- web/non-Android zero-call behavior;
- build, targeted checker, content safety, share text, and doc/src guardrails.

This PR runs only repository checks. APK installation and device QA are Not
performed.

## Android device QA plan

On an Android device with the configured UMP message:

1. Verify startup bootstrap reaches a known requirement status.
2. Verify the entry appears only for `REQUIRED`.
3. Rapidly tap and confirm only one native form.
4. Close without changing choices and confirm no change is claimed.
5. Withdraw and confirm the refreshed gate closes before any ad work.
6. Grant and confirm initialize-once behavior without an ad request.
7. Exercise form and refresh failure paths.
8. Background/foreground and revisit Settings.
9. Confirm Web/PWA builds expose no entry and make no plugin call.
10. Capture ADB logcat for UMP action, refresh, and initialization stages
    without recording private consent payloads.

Android privacy-options device QA, offline QA, and ADB logcat remain Pending.

## Blocking conditions

Production UI implementation: Ready within this documented coordinator,
Settings, and copy-alignment scope.

The following remain blocking before any real advertising request:

- no rewarded-ad SDK provider is implemented;
- no approved official test-ad request path exists;
- no ad unit is configured for this work;
- Android privacy-options behavior and the post-dismiss refresh bridge are not
  device-verified;
- request-level app preference and UMP gate integration is not implemented;
- required advertising and Google Play disclosures are not updated.

The absence of an official plugin getter after dismissal is not a UI blocker
because Candidate A is implementable, but its device result remains a QA
requirement.

## Explicitly excluded work

- Production `src`, `public`, Android, iOS, CSS, or workflow changes
- UI button, route, modal, or runtime call implementation
- Package dependency or lockfile changes
- Capacitor, Vite, Gradle, manifest, resource, or service-worker changes
- Existing localStorage key, consent schema, or `schemaVersion` changes
- Ad application/unit identifiers or release debug configuration
- Ad request/load/show or actual ad serving
- AdMob Console or Google Play Console changes
- Release build, signing, AAB, APK, install, and device QA

## Pending work

- 개인정보 및 쿠키 설정 UI implementation
- `showPrivacyOptionsForm` runtime call
- Post-form runtime refresh
- Android privacy-options device QA
- Offline QA and ADB logcat
- Rewarded-ad SDK provider
- Official test-ad request
- Ad unit creation
- Actual ad request/load/show and serving
- Google Play disclosure update
- Release build/signing/AAB/Play upload

## Rollback plan

This PR adds only documentation, a checker, and project records. Revert the
six-file commit to remove the contract. A future production rollback should
remove the Settings entry and privacy-options action while retaining PR #407's
startup coordinator; it must not delete or rewrite existing local consent
preferences.

## Official references

- Google, Set up UMP SDK for Android:
  https://developers.google.com/admob/android/privacy
- Google, Disclose to EEA users and consent revocation:
  https://developers.google.com/admob/android/privacy/gdpr
- Google, UMP Android release notes:
  https://developers.google.com/admob/android/privacy/release-notes
- Installed package declarations:
  `node_modules/@capacitor-community/admob/dist/esm/consent/`
- Installed Android implementation:
  `node_modules/@capacitor-community/admob/android/src/main/java/com/getcapacitor/community/admob/consent/AdConsentExecutor.java`
