# Advertising Console Readiness

- Review date: 2026-07-26
- PR type: docs/check-only
- Starting main HEAD: `547467a3ec3b04068dab4d730deeead86dd91c06`
- Source baseline: PR #402 merged into `main`

## Purpose and scope

This document is a preparation record for the first advertising update before any
Google Play Console or AdMob Console input is performed.

- No actual Console changes in this PR.
- No Google Play Console values are changed.
- No AdMob Console values are changed.
- No SDK integration in this PR.
- No UMP integration, ad unit creation, Android native change, or advertising
  identifier is included.
- Final answers pending exact SDK and merged manifest verification.
- Exact plugin and transitive SDK versions must be selected in the implementation
  PR before final Console answers are prepared.
- This is not legal advice.
- Final privacy and legal wording confirmation is Pending.

## Verified current-state snapshot

Console-only states below are carried forward from the user-confirmed and existing
readiness records. Repository evidence is used only for states that can be checked
locally. A completed app or publication milestone does not imply that advertising
implementation is complete.

| Item | Current state | Evidence | Notes |
| --- | --- | --- | --- |
| Google Play production status | Live | User-confirmed baseline; `docs/ADMOB_CAPACITOR_IMPLEMENTATION_APPROACH_REVIEW.md` | Store installation verification for the currently published version is Completed. |
| AdMob account verification | In progress | User-confirmed baseline; existing AdMob readiness documents | This is separate from app verification and readiness approval. |
| AdMob app registration | Completed | User-confirmed baseline; existing AdMob readiness documents | No Console action was performed in this PR. |
| Google Play linking | Completed | User-confirmed baseline; existing AdMob readiness documents | AdMob-to-Play linking does not install an SDK. |
| app-ads.txt | Completed | User-confirmed baseline; `docs/PRIVACY_POLICY_PRODUCTION_VERIFICATION.md` | Publication and live URL verification do not mean ads are serving. |
| AdMob app verification | Completed | User-confirmed baseline; existing AdMob readiness documents | App verification is distinct from account verification. |
| AdMob app readiness | Approved | User-confirmed baseline; `docs/ADMOB_CAPACITOR_IMPLEMENTATION_APPROACH_REVIEW.md` | Approval does not create ad units or requests. |
| App-level serving limit | Lifted | User-confirmed baseline; `docs/ADMOB_CAPACITOR_IMPLEMENTATION_APPROACH_REVIEW.md` | Account verification remains In progress. |
| Ad units | 0 | User-confirmed baseline; existing readiness records | No production or test unit was created in this PR. |
| Mobile Ads SDK | Not started | `package.json`, `package-lock.json`, Android Gradle files, generated debug merged manifest | No Google Mobile Ads or AdMob plugin dependency exists. |
| UMP SDK | Not started | `package.json`, `package-lock.json`, Android Gradle files | No UMP dependency or native API call exists. |
| Actual requests | No data | User-confirmed baseline; repository inventory | Existing rewarded-ad behavior uses a mock provider. |
| Actual serving | Pending | User-confirmed baseline | No ad unit or SDK exists. |
| App privacy-policy link | Completed | PR #402; `src/pages/PrivacyInfoPage.jsx` | Production link implementation and source URL match are complete. |
| Android external-browser QA | Completed | User-confirmed PR #402 manual QA | Galaxy S23 Ultra, Android Debug APK, 2026-07-26. |
| Store-installed updated-version verification | Pending | User-confirmed PR #402 QA boundary | The tested APK was not a Google Play store-installed updated version. |

Required status strings:

- AdMob account verification: In progress
- Ad units: 0
- Google Mobile Ads SDK integration: Not started
- UMP SDK integration: Not started
- Actual advertisement requests: No data
- Actual advertisement serving: Pending
- First advertising update release: Pending
- Android device external-browser QA: Completed
- Store-installed production version link verification: Pending
- Google Play Data safety update: Pending
- Advertising ID decision: Pending
- AdMob Privacy & Messaging configuration: Pending
- Consent revocation UI: Not started

### PR #402 Android manual QA record

- Device: Galaxy S23 Ultra
- Build type: Android Debug APK
- Verification source: User-confirmed manual QA
- Verification date: 2026-07-26
- External browser opening: Completed
- Android back-to-app behavior: Completed
- This was not a Google Play store-installed updated version.
- Advertising flow not tested.
- No advertising SDK or consent flow was tested.

## Current production versus planned advertising update

### A. Currently published production version

- This is the version currently available through Google Play.
- Store installation verification for the currently published version: Completed.
- The repository baseline has no Google Mobile Ads SDK, analytics SDK, or UMP SDK.
- Ad units: 0.
- No actual advertisement request is implemented.
- Source inspection found no `fetch`, `XMLHttpRequest`, `WebSocket`, or
  `sendBeacon` request in `src`.
- User-entered fortune data and the existing consent-preference placeholder are
  stored locally. The app includes a user-initiated external privacy-policy link.
- The existing consent banner and settings panel are local future-feature
  placeholders; they are not UMP consent or revocation controls.
- The rewarded-ad adapter resolves to a mock provider unless a future SDK adapter
  is enabled. No actual advertising SDK is installed.
- Current Google Play Data safety answers are not changed by this PR.
- Store-installed production version link verification: Pending for the version
  containing the PR #402 link update.

### B. Planned first advertising update

- Planned first advertising update has not been built.
- No release AAB for the advertising update exists.
- No advertising update has been uploaded to Play Console.
- No Google Mobile Ads SDK or UMP SDK has been installed.
- Exact plugin and SDK versions will be decided in the implementation PR.
- The post-integration dependency tree and merged manifest are unverified.
- Final Data safety answers and the Advertising ID declaration are unconfirmed.
- Privacy & Messaging is not configured.
- No ad unit has been created.
- Planning statements in this section are not current production behavior.

## Google Play Data safety readiness worksheet

The current column is based on repository source and dependency inspection. The
planned column is a preparation draft based on Google's latest Mobile Ads SDK data
disclosure reviewed on 2026-07-26. Google SDK guidance is not the final answer for
the whole app. The developer must verify the complete app data flow, exact plugin
and transitive SDK version, optional features, mediation, dependency tree, merged
manifest, and Console answers after implementation.

| Data type | Current published version | Planned ad-enabled version | Collection | Sharing | Purpose | Required evidence | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| IP address | No programmatic external request or ad/analytics SDK found in the repository baseline | Latest Mobile Ads SDK disclosure says the device IP address is collected and may estimate general location | Planned; final answer depends on exact SDK and app behavior | Draft indicates SDK sharing; Console classification must be confirmed | Advertising, analytics, fraud prevention | Exact SDK disclosure, dependency tree, traffic/implementation review | Draft for planned update |
| User product interactions | No external collection found; fortune interaction state remains local | SDK disclosure includes app launch, taps, and video views | Planned draft | Planned draft | Advertising, analytics, fraud prevention | Exact SDK version, enabled formats/features, app-wide flow review | Draft for planned update |
| Diagnostic information | No external diagnostics or analytics SDK found | SDK disclosure includes app/SDK performance information | Planned draft | Planned draft | Advertising, analytics, fraud prevention | Exact SDK version, crash/diagnostic feature inventory | Draft for planned update |
| Device and account identifiers | No advertising or analytics SDK dependency found | SDK disclosure includes advertising ID, app set ID, and applicable signed-in account identifiers | Planned draft | Planned draft | Advertising, analytics, fraud prevention | Exact SDK and plugin versions, identifier configuration, merged manifest | Pending SDK integration |
| Android advertising ID | No source permission, direct API use, or advertising dependency found | May be available to the SDK unless collection is disabled through a verified configuration | Pending decision | Pending decision | Advertising and related measurement; final purpose must be confirmed | Merged manifest, SDK configuration, Play declaration decision | Pending manifest verification |
| App set ID | No direct API use or relevant SDK dependency found | Listed within the SDK's device/account identifiers disclosure | Planned draft | Planned draft | Analytics and fraud prevention are listed SDK purposes | Exact SDK/version behavior and app-wide identifier inventory | Pending SDK integration |
| Encryption in transit | Not applicable to an absent ad SDK; no app programmatic external requests found | Google states Mobile Ads SDK user data is encrypted in transit with TLS | Planned SDK statement only | Planned SDK statement only | Security practice, not a standalone collection purpose | Verify every app/SDK data flow uses encryption in transit | Draft for planned update |
| Advertising purpose | No actual ad request or serving | Expected SDK purpose; exact formats and configuration remain unselected | Planned draft | Planned draft | Advertising or marketing | Final ad format, consent, SDK and Console review | Pending Console confirmation |
| Analytics purpose | No analytics SDK or external analytics request found | Included in the SDK's disclosed purposes | Planned draft | Planned draft | Analytics | Exact SDK features and any optional reporting inventory | Draft for planned update |
| Fraud prevention purpose | No advertising SDK data flow found | Included in the SDK's disclosed purposes | Planned draft | Planned draft | Fraud prevention, security, and compliance | Exact SDK behavior and whole-app data inventory | Draft for planned update |

Important boundaries:

- UMP use itself must not be confused with Mobile Ads SDK data collection.
- Optional features, experiments, or mediation require a new review.
- The current Console has not been updated by this worksheet.
- Final answers require the implemented artifact, merged dependency tree, and
  merged manifest.

## Advertising ID decision record

### Current production

- AD_ID permission source inspection: no
  `com.google.android.gms.permission.AD_ID` declaration in
  `android/app/src/main/AndroidManifest.xml`.
- Debug merged manifest inspection: after `npm ci`, `npm run build`,
  `npx cap sync android`, and `gradlew.bat :app:processDebugMainManifest` in an
  ASCII-path temporary `origin/main` worktree, the generated debug merged
  manifest contained neither `AD_ID` nor
  `com.google.android.gms.ads.APPLICATION_ID`.
- Direct AD_ID API usage inspection: no Advertising ID API call found in `src` or
  Android source.
- Advertising SDK dependency inspection: none in `package.json`,
  `package-lock.json`, `android/app/build.gradle`, or
  `android/app/capacitor.build.gradle`.
- Current Advertising ID use conclusion: no evidence that the repository baseline
  requests or uses Advertising ID. The generated baseline debug merged manifest
  also excludes the permission. Release-artifact verification remains required if
  the shipped artifact differs from this baseline.
- Evidence command:
  `rg -n -i "AD_ID|AdvertisingId|play-services-ads|ca-app-pub|admob" package.json package-lock.json android src`.
- Console update performed: No.

### Planned advertising update

- Google Play's Advertising ID guidance states that Mobile Ads SDK dependencies
  may declare `AD_ID` in their library manifest and merge it into the app manifest.
- The implementation PR must inspect the final merged manifest.
- If `AD_ID` is present, prepare and confirm the Play Console Advertising ID
  declaration before submission.
- Disabling ad ID collection is an option only after the exact SDK's official
  configuration is verified.
- Personalized advertising and the existence of Advertising ID are not equivalent
  decisions.
- Do not assume non-personalized ads use no identifiers.
- Final decision: Pending.
- Actual Play Console Advertising ID declaration: Pending.

| Option | Description | Benefits | Risks | Required changes | Data safety effect | Decision |
| --- | --- | --- | --- | --- | --- | --- |
| SDK default Advertising ID behavior | Use the exact SDK's documented default behavior | Simplest supported integration and measurement path | Identifier handling, consent, policy and disclosure obligations | SDK/plugin integration, merged manifest and Console declaration review | Device or other IDs likely require disclosure | Pending |
| Review disabling Advertising ID collection | Verify and use the exact SDK's supported manifest/configuration control | May reduce identifier collection | May affect measurement, revenue, features, and may not remove other identifiers | Official configuration verification, testing, merged manifest and traffic review | Must be reassessed; other SDK identifiers may remain | Pending |
| Review Limited Ads or restricted processing | Evaluate Google's supported limited-ad behavior for applicable cases | May reduce some identifier/data transmission in supported conditions | Behavior varies by SDK/version/region and is not a blanket no-data guarantee | Product, technical, consent and policy review | Requires exact behavior evidence and updated draft | Pending |
| Defer until implementation evidence | Make no selection until exact dependencies and merged manifest are available | Avoids asserting an unsupported configuration | Blocks final Console answers and production release | Exact version selection, implementation, manifest/dependency verification | Final answers remain open | Pending |

## AdMob Privacy & Messaging readiness

No message was created or published in AdMob Console by this PR.

| Item | Current state | Execution condition |
| --- | --- | --- |
| AdMob Privacy & Messaging page access | Pending | User signs in and confirms the current app/account page. |
| GDPR message | Not started | Draft only after app, policy URL, consent choices, and implementation test plan are ready. |
| EEA and UK scope | Pending | Confirm the applicable regulation/message scope in AdMob. |
| Switzerland scope | Pending | Re-check current AdMob coverage and legal/product requirements. |
| US state regulations message | Pending review | Decide whether a separate message is needed and verify supported choices. |
| Default consent choices | Pending review | Align product behavior, legal review, and UMP implementation. |
| Consent message language | Pending review | Confirm Korean/default/fallback language behavior in preview and test. |
| Privacy policy URL | Candidate available | Verify the production URL and final wording before publication. |
| App name and branding | Pending confirmation | Confirm the AdMob app name matches the released app. |
| Vendor list | Pending review | Review selected ad technology providers before message publication. |
| Message publication | Not started | Publish only after preview, legal/product review, and test readiness. |
| UMP App ID linkage | Not started | Exact AdMob App ID and Android manifest integration are implementation-PR work. |
| Privacy options entry point | Not started | Implement visible UI only when UMP reports it is required. |
| Consent revocation UI | Not started | Distinguish it from the existing privacy-policy link and local placeholder settings. |
| Testing geography | Not started | Configure only on registered test devices, then remove debug settings. |
| Test device configuration | Not started | Use a non-production test identifier outside committed source. |
| Production message verification | Not started | Verify published message, region behavior, re-entry, and ad gate on a release candidate. |

- AdMob Privacy & Messaging configuration: Pending
- Message creation: Not started
- Message publication: Not started
- Consent revocation UI: Not started
- Android consent QA: Not started

## Planned UMP consent flow

This is a future implementation sequence based on the official Android UMP guide.
No UMP API is called in this PR.

1. Start the app.
2. Request a consent information update on every launch with
   `requestConsentInfoUpdate()`.
3. Determine whether consent is required using the updated status.
4. Load and present a required form with
   `loadAndShowConsentFormIfRequired()`.
5. Check `getPrivacyOptionsRequirementStatus()` after the update.
6. When required, expose a visible and interactable entry point and use
   `showPrivacyOptionsForm()` so the user can reopen privacy choices.
7. Check `canRequestAds()`.
8. Request ads only after the consent flow and only when requests are allowed.
9. Guard initialization so the first request and callback paths cannot cause
   duplicate ad requests.
10. On an update/form error, evaluate whether the SDK's previous valid consent
    status permits requests; do not infer consent from the app's local placeholder.
11. On registered test devices, force test geography and verify all required
    message paths.
12. Before production, remove debug geography and debug device configuration.

`reset()` is testing only. Production use is prohibited because it clears UMP
consent state and is not a user-facing revocation implementation.

## Privacy options and revocation UI requirement

Candidate locations for a future production entry point:

- My information
- The existing privacy information screen
- A settings area

Candidate user-facing labels:

- 개인정보 및 광고 설정
- 개인정보 및 쿠키 설정

Requirements:

- Do not use an icon without a text label.
- Support keyboard focus and activation.
- Provide a comfortable mobile touch target.
- Consider showing/enabling it only when UMP reports that an entry point is
  required.
- Allow users to reopen and change a previous choice.
- Keep its function distinct from the existing privacy-policy link.
- Avoid visual emphasis that makes the control look like an advertisement.
- Preserve the existing localStorage structure until an implementation PR
  explicitly designs a compatible migration.

Consent revocation UI: Not started

## Console execution checklist

These steps are for future user execution. Nothing below was performed by this PR.

### Google Play Console

- [ ] Confirm the dependency tree of the actual ad-enabled build.
- [ ] Inspect the merged manifest.
- [ ] Confirm whether the `AD_ID` permission is present.
- [ ] Decide the Advertising ID declaration.
- [ ] Back up or capture the existing Data safety answers.
- [ ] Re-check the official SDK Data safety disclosure.
- [ ] Confirm the whole-app data flow, including optional SDK features.
- [ ] Prepare a Data safety answer draft.
- [ ] Confirm consistency with the production privacy policy.
- [ ] Enter values in the actual Console.
- [ ] Review the Console preview.
- [ ] Submit.
- [ ] Confirm the review result.

### AdMob Console

- [ ] Confirm the current Privacy & Messaging state.
- [ ] Select the applicable regulations.
- [ ] Prepare a GDPR message draft.
- [ ] Review US state regulations.
- [ ] Confirm the production privacy-policy URL.
- [ ] Confirm message languages and fallback.
- [ ] Confirm consent choice options.
- [ ] Review vendor settings.
- [ ] Publish the message.
- [ ] Confirm the UMP app linkage.
- [ ] Verify test geography behavior.
- [ ] Verify privacy-options re-entry.

## Entry criteria for implementation PR

Required before implementation starts:

- Final Capacitor AdMob plugin selection.
- Exact plugin version.
- Confirmed transitive Google Mobile Ads SDK version.
- Confirmed UMP delivery and bridge approach.
- AdMob App ID prepared outside committed source until integration is approved.
- Plan to use official demo/test ad units.
- Production ad units remain unused.
- Privacy & Messaging message draft or testable Console state.
- Provisional Advertising ID strategy.
- Data safety draft.
- Selected privacy-options UI location.
- Android Debug QA plan.
- Rollback plan.
- A no-production-request guardrail.

Blocking conditions:

- A real production ad unit ID is hardcoded in source.
- An ad request can occur before consent eligibility is checked.
- Test and production ad configurations are not clearly separated.
- The merged manifest has not been verified.
- No Data safety draft exists.
- Privacy & Messaging state is unknown.
- No Android QA plan exists.
- A Console value is marked complete without evidence.

## Official references

Only official Google sources are used as policy and SDK evidence. Accessed date for
all entries: 2026-07-26. Re-verification is required before release because Console
fields, SDK versions, APIs, and guidance can change.

| Title | URL | Accessed date | Relevant section | What it supports | Re-verification before release |
| --- | --- | --- | --- | --- | --- |
| Provide information for Google Play's Data safety section | https://support.google.com/googleplay/android-developer/answer/10787469 | 2026-07-26 | Overview, developer responsibility, data types and purposes | Whole-app disclosure responsibility, collection/sharing definitions, encryption and purposes | Required |
| Advertising ID | https://support.google.com/googleplay/android-developer/answer/6048248 | 2026-07-26 | Android 13 permission and SDK library-manifest merging | `AD_ID` permission, merged-manifest risk, Advertising ID policy context | Required |
| Google Play data disclosure | https://developers.google.com/admob/android/privacy/play-data-disclosure | 2026-07-26 | Automatically collected/shared data and data handling | IP address, interactions, diagnostics, identifiers, TLS, ad ID and Limited Ads caveats | Required for exact selected SDK version |
| Google Mobile Ads SDK Android | https://developers.google.com/admob/android/sdk | 2026-07-26 | SDK documentation and migration entry point | SDK family/version selection must precede implementation and final answers | Required |
| Set up UMP SDK | https://developers.google.com/admob/android/privacy | 2026-07-26 | Consent update, form, privacy options, request gate, testing | Planned UMP sequence and official API names | Required for exact selected UMP version |
| About Privacy & messaging | https://support.google.com/admob/answer/10107561 | 2026-07-26 | Available regulations and message management | Console message preparation scope | Required |
| Guidelines for using Privacy & messaging | https://support.google.com/admob/answer/12226986 | 2026-07-26 | Message configuration and publication guidance | Console review, publication and user-choice planning | Required |
