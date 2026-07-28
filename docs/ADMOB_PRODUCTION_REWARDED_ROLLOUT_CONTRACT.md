# AdMob Production Rewarded Rollout Contract

## 1. Purpose and scope

This contract defines the prerequisites, configuration boundaries, validation
rules, privacy review, release gates, device QA, and rollback criteria that
must be satisfied before 하루풀이 uses a production Rewarded ad unit.

This PR is docs/check-only. It does not create an AdMob ad unit, add a
production identifier, request or serve a production ad, change native code,
or prepare a release artifact. The production implementation requires a
separate, approved PR after the user supplies and confirms the real ad unit
ID.

## 2. Current merged baseline

Completed:

- `@capacitor-community/admob` 8.0.0 is installed.
- The real AdMob App ID is connected to Android metadata.
- The UMP runtime consent coordinator and privacy-options UI are implemented.
- The Google official Rewarded Test Ad provider is implemented.
- Galaxy S23 Ultra functional QA covered fullscreen display, the Test Ad
  label, reward callback, one selected detail unlock, rapid-tap single-ad
  behavior, offline fail-closed and recovery, restart persistence, and the
  AdMob Proxy Promise-assimilation fix.

Not testable / Pending:

- Actual early-dismiss device QA
- Repeated ADB listener-accumulation diagnostics

Not started:

- Production Rewarded ad unit creation
- Production ad unit ID source connection
- Production request/load/show
- Production serving
- Release build, signing, and AAB generation
- Google Play Console new-release upload

Canonical rollout state:

- Production rewarded ad unit: Pending
- Production ad unit ID: None
- Production request/load/show: Not started
- Production serving: Not started
- AdMob Console creation: Not performed
- Privacy/Data Safety final review: Pending
- Release signing/AAB: Pending

## 3. Test and production separation

The Google official Rewarded Test Ad unit ID is a debug/official-test-only
identifier. It is not a production ad unit and must never be used by a
production build.

Standard Android Debug keeps the existing mock provider. Only the dedicated
Rewarded Test Debug mode may use the Google official test ad, with
`isTesting: true`. A future approved Android production release must use only
the user-confirmed production Rewarded ad unit, with `isTesting: false`.
Automatic mixing or fallback between these modes is prohibited.

## 4. AdMob identifier types

The two identifier types have different formats and purposes:

| Identifier | Required format | Purpose |
| --- | --- | --- |
| AdMob App ID | `ca-app-pub-숫자~숫자` | AndroidManifest metadata; not an advertising request ID |
| Ad unit ID | `ca-app-pub-숫자/숫자` | Rewarded advertising requests |

The `~` separator identifies an App ID, while the `/` separator identifies an
ad unit ID. They are not interchangeable. Supplying the App ID where an ad
unit ID is required, or describing the `/` form as an App ID, must fail
closed.

The Google official Rewarded Test Ad unit ID remains restricted to
debug/official-test use and is prohibited in production. The actual
production Rewarded ad unit ID is currently None / Pending. No placeholder,
guessed value, or arbitrary `ca-app-pub` value may be inserted before the user
creates the unit in AdMob Console and supplies the confirmed `/` identifier.

## 5. Production rewarded ad unit creation prerequisites

Before creating or connecting the unit, the owner must confirm:

- The correct 하루풀이 AdMob app and Android package are selected.
- AdMob account and app serving eligibility are in an acceptable state.
- The Rewarded format and detail-unlock placement are approved.
- Reward settings and user-facing reward behavior match one selected detail
  unlock.
- Privacy policy, consent, Google Play Data safety, advertising ID, and target
  audience implications have owners and review dates.
- Production configuration and secrets have a single controlled source.
- Release signing, AAB, device QA, monitoring, and rollback owners are known.

These are gates, not claims that the corresponding Console or release work
has already occurred.

## 6. AdMob Console creation procedure

The recommended user-operated procedure is:

1. Open AdMob Console and select the 하루풀이 app.
2. Enter the ad units menu.
3. Choose the Rewarded format.
4. Use `harupuli_rewarded_detail_unlock_android` as the candidate ad unit
   name.
5. Review the reward amount and reward item settings against the one-detail
   unlock contract.
6. Create the ad unit.
7. Copy and independently verify the real ad unit ID in `/` format.
8. Do not confuse it with the App ID value in `~` format.
9. Record that serving may not stabilize immediately after unit creation.
10. Have the user confirm the ID, then connect it only in a separate
    production implementation PR.

AdMob Console was not changed as part of this docs/check-only work.

## 7. Required user-supplied values

The production implementation cannot begin until the user supplies or
confirms:

- The real production Rewarded ad unit ID copied from AdMob Console
- Confirmation that it belongs to the 하루풀이 Android app
- The approved reward amount and reward item
- The intended release environment and rollout owner
- Privacy/Data Safety review decisions and any required disclosure updates
- Release signing and Play Console ownership

The production ID must be treated as absent until those values are confirmed.
It must not be inferred from the App ID or synthesized from examples.

## 8. Production configuration design

A future implementation must:

- Manage the production ID in exactly one configuration source.
- Keep test and production IDs separate.
- Validate both build mode and provider mode before importing or calling the
  native SDK.
- Fail closed if release mode receives a test ID.
- Fail closed if debug mode receives a production ID.
- Fail closed when the production ID is missing or malformed.
- Fail closed when an App ID is supplied as an ad unit ID.
- Prohibit SDK-to-mock fallback.
- Prohibit unlock after an advertising failure.
- Treat only a valid reward result as unlock authority.
- Preserve exactly-once settlement, caller request ownership, native reward
  action ownership, and reward session epoch checks.
- Keep every existing localStorage key and stored shape unchanged.
- Preserve existing mock behavior.
- Preserve the existing UMP runtime and local consent dual gate, including
  fresh checks at the established lifecycle boundaries.

Configuration failure must return a non-reward outcome without initiating a
native request.

## 9. Build-mode matrix

| Build mode | Provider and identifier | Native SDK request | Required behavior |
| --- | --- | --- | --- |
| Web / Vercel | Mock or no-op | Prohibited | No native import or request |
| Standard Android Debug | Existing mock | Production request prohibited | Preserve current mock behavior |
| Dedicated Rewarded Test Debug | Google official test ad; `isTesting: true` | Test request only | Production ID prohibited |
| Android Release before production configuration | None | 0 requests | Fail closed |
| Android Release after approved production implementation | Actual production Rewarded ad unit; `isTesting: false` | Production request only | Release/signing/AAB and device QA required |

No row may silently fall back to a rewarding mock after an SDK or
configuration failure.

## 10. Fail-closed requirements

The provider must make zero ad requests and grant no unlock when any of these
conditions applies:

- Build mode and provider mode do not form an approved pair.
- A test ID appears in release mode.
- A production ID appears in debug or official-test mode.
- The required production ID is missing, malformed, guessed, or placeholder.
- An App ID is supplied where an ad unit ID is required.
- Either the local consent gate or latest UMP runtime gate is not satisfied.
- Consent changes before prepare or show.
- Load, show, lifecycle, dismiss, timeout, listener, or SDK processing fails.
- The result is missing a valid authoritative reward.
- Request ownership, action ownership, exactly-once, or session epoch checks
  fail.

Failure must not become success through an SDK-to-mock fallback. Only a
validated reward result may authorize the existing unlock persistence path.

## 11. Consent and privacy requirements

The existing local consent and UMP runtime dual gate remains mandatory. The
implementation must continue fresh gate reads at the established action,
pre-prepare, and pre-show boundaries. EEA/UK/Switzerland UMP messaging and the
privacy-options entry point must remain available.

The following remain Pending or require follow-up review before production
activation:

- Privacy policy wording related to the advertising SDK
- Google Play Data safety form
- Whether and how the advertising ID is used
- User data collection and sharing declarations
- Final disclosure review for production advertising

This contract is not professional legal advice and does not mark any Console
privacy submission as complete.

## 12. Google Play disclosure impact

Before enabling production advertising, the release owner must reconcile the
actual SDK behavior and configured mediation with:

- The published privacy policy
- Google Play Data safety collection and sharing answers
- The advertising ID declaration
- Target audience and Families requirements, if applicable
- Consent messaging regions and privacy-options availability
- Store listing or in-app disclosure requirements

Google Play disclosure review is Pending. No Play Console form was submitted
or changed in this PR, and no status in this section represents approval.

## 13. Source implementation plan

A separate production implementation PR may evaluate these candidates:

- `src/config/rewardedAdSdkConfig.js`
- `src/services/rewardedAdProvider.loader.js`
- `src/services/rewardedAdProvider.sdk.js`
- A production configuration checker
- Release environment configuration
- Related documentation and logs

That PR must add narrowly scoped configuration validation before any SDK
request while preserving the current public APIs, provider behavior outside
production, storage compatibility, routing, schema version, fortune
calculation, and result-generation logic.

No production source or Android native file is changed by this contract PR.

## 14. CI and release configuration plan

A future release change must:

- Source the production identifier from one approved environment-specific
  location without committing secrets or guessed values.
- Validate the identifier format and mode pairing during CI.
- Reject a release containing the Google official test ID.
- Reject debug or official-test output containing a production ID.
- Verify zero native requests when production configuration is absent.
- Keep default Web/Vercel and standard Android Debug behavior unchanged.
- Document signing inputs without committing keystores or credentials.
- Build and verify the signed release/AAB only after configuration approval.

No workflow or release environment configuration is changed in this PR.

## 15. Production device QA plan

On a designated Android device and an approved release candidate, record:

- Clean install, cold start, background/resume, and restart
- Consent allowed, denied, unavailable, changed pre-prepare, and changed
  pre-show
- Production request, load, fullscreen show, reward, and one-detail unlock
- Early dismiss and repeated dismiss without reward or unlock
- Rapid taps yielding one owned in-flight ad
- Offline failure, no unlock, and deliberate recovery retry
- Timeout and app lifecycle transitions
- Exactly-once behavior and restart persistence
- Repeated ADB logcat review for listener accumulation and sanitized errors
- Confirmation that `isTesting` is false and no Test Ad label appears

Test evidence must identify the commit, build, artifact, device, OS, and time
without exposing sensitive identifiers.

## 16. Failure and rollback plan

If production configuration, consent, serving, reward settlement, disclosure,
or device QA fails:

1. Stop or withhold the production rollout.
2. Fail closed with no ad request when configuration is invalid.
3. Disable the production provider through the approved release
   configuration; do not route failures to a rewarding mock.
4. Preserve already valid user unlock state and the existing storage shape.
5. Capture sanitized diagnostics and identify the affected build.
6. Revert the narrow production implementation or redeploy the last known
   safe build.
7. Repeat automated and device QA before resuming rollout.

Rollback must never require a schema, routing, fortune, or existing
localStorage key migration.

## 17. Blocking conditions

Production implementation or rollout is blocked by any of the following:

- Missing or unconfirmed production Rewarded ad unit ID
- Identifier type or ownership ambiguity
- Unapproved build/provider mode pairing
- Missing fail-closed configuration validation
- Any path that unlocks without a valid authoritative reward
- Weakened consent, exactly-once, ownership, or session epoch protections
- Unresolved Privacy/Data Safety disclosure decisions
- Missing release signing/AAB plan or production device QA
- Production-serving eligibility or policy uncertainty
- Source, native, workflow, storage, schema, or fortune changes outside the
  approved follow-up scope

## 18. Explicitly excluded work

This PR explicitly excludes:

- AdMob Console changes or ad unit creation
- Any real production ad unit ID
- Production source implementation
- Production request/load/show or serving
- `src/**`, `android/**`, `ios/**`, `public/**`, or workflow changes
- Dependency, lockfile, Capacitor, Vite, routing, or schema changes
- Existing localStorage key or shape changes
- Fortune calculation or result-generation changes
- Release build, signing, AAB generation, or Play Console upload
- Privacy policy, Data safety, or advertising ID Console submission

## 19. Pending work

- Production rewarded ad unit: Pending
- Production ad unit ID: None
- Production request/load/show: Not started
- Production serving: Not started
- AdMob Console creation: Not performed
- Privacy/Data Safety final review: Pending
- Release signing/AAB: Pending
- Actual early-dismiss device QA: Pending
- Repeated ADB listener-accumulation diagnostics: Pending

## 20. Completion criteria

This contract PR is complete only when:

- All 20 required sections exist in this order.
- The identifier types, mode matrix, fail-closed rules, consent gates,
  disclosure impact, implementation boundaries, QA, and rollback requirements
  are documented.
- The checker and all 18 negative mutations pass.
- Existing AdMob provider, consent, content-safety, and docs/source guardrail
  checks pass.
- Only the six approved docs/check files are changed.
- No source, native, workflow, lockfile, storage, schema, routing, or fortune
  behavior changes exist.
- The two pre-existing untracked review files remain untracked and unstaged.

Production rollout completion is a separate milestone. It requires a
user-confirmed production ID, approved follow-up implementation, final
privacy/disclosure review, signed release/AAB, and production device QA.
