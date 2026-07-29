# AdMob Production Rewarded Rollout Contract

## 1. Purpose and scope

This contract defines the prerequisites, configuration boundaries, validation
rules, privacy review, release gates, device QA, and rollback criteria that
must be satisfied before 하루풀이 uses a production Rewarded ad unit.

The source-side production Rewarded connection capability and the release
workflow injection path are implemented. The release path maps an
owner-managed repository Secret into the preflight and web build only after a
manual main-branch confirmation guard. This PR does not configure the actual
Secret value, run the release workflow, request or serve a production ad,
change native code, or prepare a release artifact. Production activation
remains a separate, owner-approved release operation.

## 2. Current merged baseline

Completed:

- `@capacitor-community/admob` 8.0.0 is installed.
- The real AdMob App ID is connected to Android metadata.
- The owner created the 하루풀이 Android Rewarded ad unit in AdMob Console.
- The owner supplied and retained the real production Rewarded ad unit ID
  outside the repository.
- The production ad unit ID has the valid `/` form and its publisher prefix
  matches the existing App ID.
- The UMP runtime consent coordinator and privacy-options UI are implemented.
- The Google official Rewarded Test Ad provider is implemented.
- Galaxy S23 Ultra functional QA covered fullscreen display, the Test Ad
  label, reward callback, one selected detail unlock, rapid-tap single-ad
  behavior, offline fail-closed and recovery, restart persistence, and the
  AdMob Proxy Promise-assimilation fix.

Not testable / Pending:

- Actual early-dismiss device QA
- Repeated ADB listener-accumulation diagnostics

Implemented:

- Production source connection capability
- Production Rewarded release workflow injection support
- Release environment preflight support
- App ID/ad-unit publisher prefix verification
- Full Rewarded provider checker before release build
- Existing release signing infrastructure
- Existing signed AAB workflow

Not started:

- GitHub Secret actual value configuration
- Production-configured release workflow run
- Production Rewarded-configured signed AAB generation
- Production request/load/show
- Production serving
- Production Android device QA
- Google Play Console new-release upload

Canonical rollout state:

- Production rewarded ad unit creation: Completed
- Production rewarded ad unit: Created
- Production ad unit ID supplied by owner: Yes
- Production ad unit ID: Supplied by owner and held out of repository
- Production ad unit ID format validation: Pass
- Production ad unit ID format: Valid `/` form
- Exact production ad unit ID committed to repository: No
- Production source connection capability: Implemented
- Production Rewarded release workflow injection support: Implemented
- Release environment preflight support: Implemented
- App ID/ad-unit publisher prefix verification: Implemented
- Full Rewarded provider checker before release build: Implemented
- GitHub Secret actual value configuration: Not started
- Production-configured release workflow run: Not started
- Production request/load/show: Not started
- Production serving: Not started
- AdMob Console creation: Completed
- Privacy/Data Safety final review: Pending
- External public privacy policy final review: Pending
- Advertising disclosure final review: Pending
- Existing release signing infrastructure: Confirmed
- Existing signed AAB workflow: Confirmed
- Production Rewarded-configured signed AAB: Not started
- Production device QA: Not started
- Play Console release upload: Not started

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
debug/official-test use and is prohibited in production. The owner has
supplied the actual production Rewarded ad unit ID, confirmed its `/` form,
and retained its exact value outside the repository. Its publisher prefix
matches the existing App ID. No placeholder, guessed value, arbitrary
`ca-app-pub` value, or exact owner-held production ID may be committed.

## 5. Production rewarded ad unit creation prerequisites

The owner confirmed these creation prerequisites:

- The correct 하루풀이 AdMob app and Android package are selected.
- The Rewarded format and detail-unlock placement use the ad unit name
  `harupuli_rewarded_detail_unlock_android`.
- The reward amount is 1 and the reward item is `상세 풀이 해금`.
- The enabled ad types are video and interactive.
- Server-side verification is not configured.
- Frequency capping is disabled.
- Minimum eCPM uses Google optimization / all prices.
- The copied ad unit ID uses the `/` form and its publisher prefix matches the
  existing App ID.

Before a production-configured workflow run or rollout, the owner must also
confirm:

- AdMob account and app serving eligibility are in an acceptable state.
- Privacy policy, consent, Google Play Data safety, advertising ID, and target
  audience implications have owners and review dates.
- Production configuration and secrets have a single controlled source.
- Release signing, AAB, device QA, monitoring, and rollback owners are known.

The creation facts, source connection, release injection path, and preflight
support are complete. Secret configuration, workflow execution, artifact
generation, device QA, and rollout remain gates, not claims that release work
has occurred.

## 6. AdMob Console creation procedure

The owner completed this user-operated procedure:

1. Opened AdMob Console and selected the 하루풀이 Android app.
2. Entered the ad units menu and chose the Rewarded format.
3. Named the unit `harupuli_rewarded_detail_unlock_android`.
4. Set reward amount 1 and reward item `상세 풀이 해금`.
5. Enabled video and interactive ad types.
6. Left server-side verification unconfigured.
7. Disabled frequency capping.
8. Selected Google optimization / all prices for minimum eCPM.
9. Created the ad unit.
10. Copied the real ad unit ID, verified the `/` form and publisher-prefix
    match, and retained the exact value outside the repository.

AdMob Console creation: Completed. The Console was changed by the owner
outside this source implementation PR. The source connection capability is
implemented without embedding the owner-held identifier. The release workflow
injection path is also implemented, while actual Secret configuration,
workflow execution, and activation remain separate approved operations.

## 7. Required user-supplied values

Supplied and confirmed by the owner:

- The real production Rewarded ad unit ID copied from AdMob Console, with the
  exact value held out of the repository
- Confirmation that it belongs to the 하루풀이 Android app
- Valid `/` form and matching App ID publisher prefix
- Reward amount 1 and reward item `상세 풀이 해금`

Still required before production rollout:

- Configuration of the actual owner-held value in the repository Secret
  `ADMOB_REWARDED_PRODUCTION_AD_UNIT_ID`
- An owner-confirmed production-configured workflow run from `main`
- The intended release environment and rollout owner
- Privacy/Data Safety review decisions and any required disclosure updates
- Production device QA and Play Console ownership

The exact production ID must not be inferred from the App ID, synthesized
from examples, or committed to documentation, logs, checker fixtures, commit
messages, or PR text.

## 8. Production configuration design

The implemented source connection:

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
| Android Release after approved owner-held ID injection | Actual production Rewarded ad unit; `isTesting: false` | Production request only | Release/signing/AAB and device QA required |

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

The current source and release implementation uses:

- `src/config/rewardedAdSdkConfig.js`
- `src/services/rewardedAdProvider.loader.js`
- `src/services/rewardedAdProvider.sdk.js`
- `.github/workflows/android-release-aab.yml`
- The existing production configuration and release workflow checkers
- Related rollout documentation and rolling project state

The source implementation adds narrowly scoped configuration validation before
any SDK request. The release workflow passes the same production provider,
SDK, mode, build-target, and Secret-backed ad-unit environment to a fail-closed
preflight and the web build. It preserves the current public APIs, provider
behavior outside production, storage compatibility, routing, schema version,
fortune calculation, and result-generation logic.

No owner-held production identifier or Android native file is changed. The
actual Secret value remains outside the repository and is not configured by
this PR.

## 14. CI and release configuration plan

The implemented release workflow:

- Remains `workflow_dispatch`-only and requires an explicit boolean
  confirmation from `main`.
- Uses `permissions: contents: read`.
- Runs the full Rewarded provider checker before the release preflight and web
  build without passing the production Rewarded environment or Secret.
- Maps `ADMOB_REWARDED_PRODUCTION_AD_UNIT_ID` to
  `VITE_REWARDED_AD_UNIT_ID` only for the preflight and web build.
- Validate the identifier format and mode pairing during CI.
- Reads the approved Android `admob_app_id` resource and fails closed unless
  its publisher prefix matches the production Rewarded ad unit publisher
  prefix.
- Reject a release containing the Google official test ID.
- Reject missing, malformed, App ID, debug-target, official-test, mock, or
  SDK-disabled production release configuration before the web build.
- Keep default Web/Vercel and standard Android Debug behavior unchanged.
- Preserve the existing signing validation, runner-temp keystore restore,
  signed release build, `jarsigner` verification, and artifact ordering.

The workflow has not been run with production Rewarded configuration in this
PR. The actual repository Secret value is not configured, and no AAB or
artifact is generated.

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

- Missing actual owner-held value in the approved repository Secret
- Identifier type, format, or ownership ambiguity
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

- AdMob Console changes or ad unit creation performed by this PR
- The exact real production ad unit ID
- GitHub Secret actual value configuration
- Release workflow execution
- Production request/load/show or serving
- `android/**`, `ios/**`, or `public/**` changes
- Dependency, lockfile, Capacitor, Vite, routing, or schema changes
- Existing localStorage key or shape changes
- Fortune calculation or result-generation changes
- Production-configured AAB generation or Play Console upload
- Privacy policy, Data safety, or advertising ID Console submission

## 19. Pending work

- Production rewarded ad unit creation: Completed
- Production rewarded ad unit: Created
- Production ad unit ID supplied by owner: Yes
- Production ad unit ID: Supplied by owner and held out of repository
- Production ad unit ID format validation: Pass
- Production ad unit ID format: Valid `/` form
- Exact production ad unit ID committed to repository: No
- Production source connection capability: Implemented
- Production Rewarded release workflow injection support: Implemented
- Release environment preflight support: Implemented
- App ID/ad-unit publisher prefix verification: Implemented
- Full Rewarded provider checker before release build: Implemented
- GitHub Secret actual value configuration: Not started
- Production-configured release workflow run: Not started
- Production request/load/show: Not started
- Production serving: Not started
- AdMob Console creation: Completed
- Privacy/Data Safety final review: Pending
- External public privacy policy final review: Pending
- Advertising disclosure final review: Pending
- Existing release signing infrastructure: Confirmed
- Existing signed AAB workflow: Confirmed
- Production Rewarded-configured signed AAB: Not started
- Production device QA: Not started
- Play Console release upload: Not started
- Actual early-dismiss device QA: Pending
- Repeated ADB listener-accumulation diagnostics: Pending

## 20. Completion criteria

This release injection contract update is complete only when:

- All 20 required sections exist in this order.
- The identifier types, mode matrix, fail-closed rules, consent gates,
  disclosure impact, implementation boundaries, QA, and rollback requirements
  are documented.
- The checker, lifecycle self-test, and negative mutations pass.
- Existing AdMob provider, consent, content-safety, and docs/source guardrail
  checks pass.
- Workflow changes remain limited to manual authorization, Secret-backed
  production environment injection, the full provider gate, fail-closed
  publisher-prefix preflight, and durable verification.
- No owner-held identifier, native, runtime source, lockfile, storage, schema,
  routing, UI, or fortune behavior changes exist.
- The two pre-existing untracked review files remain untracked and unstaged.

Production rollout completion is a separate milestone. It requires actual
Secret configuration, an owner-confirmed workflow run, final
privacy/disclosure review, a production Rewarded-configured signed AAB, and
production device QA.
