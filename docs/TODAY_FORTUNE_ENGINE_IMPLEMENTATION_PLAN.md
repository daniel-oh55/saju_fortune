# Today Fortune Engine Implementation Plan

## Today Fortune Snapshot Comparison Check Design

- Today fortune snapshot comparison check design: Added
- Before/after snapshot comparison check: Pending
- Production today fortune engine improvement: Pending
- Production engine logic change: Pending
- Snapshot comparison after implementation: Pending
- CURRENT_FORTUNE_SCHEMA_VERSION decision: Pending
- Engine accuracy approval: Pending

## Purpose

This document defines the implementation plan for improving the 하루풀이 today fortune engine in a future production PR.

This document is not a production logic change and does not approve final engine accuracy.

## Current Status

| Item | Status | Note |
|---|---|---|
| Today fortune engine improvement design | Confirmed | completed in previous PR |
| Today fortune engine implementation plan | Added | this document |
| Today fortune engine improvement | Pending | not implemented in this PR |
| Production engine logic change | Pending | not changed in this PR |
| Snapshot comparison after implementation | Pending | separate PR after implementation |
| CURRENT_FORTUNE_SCHEMA_VERSION decision | Pending | decide in implementation PR |
| Engine accuracy approval | Pending | not approved in this PR |
| 음력/윤달 샘플 외부 검증 | Pending | external reference comparison still required |
| 태양시 보정 적용 여부 | Pending | policy decision required |

## Planned Production Scope

| Area | Planned Change | Status |
|---|---|---|
| src/utils/fortuneEngine.js | improve today fortune scoring/text composition in a small scoped PR | Pending |
| fortune templates | review whether template variety needs extension | Pending |
| sample snapshot comparison | compare before/after output against existing snapshot | Pending |
| schemaVersion | decide whether CURRENT_FORTUNE_SCHEMA_VERSION increment is required | Pending |
| existing localStorage keys | preserve unless separate migration plan is created | Pending |
| UI/design | no change in implementation PR unless separately approved | Pending |

## Implementation Principles

- Keep the first production PR small.
- Change only today fortune engine logic.
- Do not change year/monthly fortune logic.
- Do not change zodiac fortune logic.
- Do not change manseryeok calculation logic.
- Do not change routing or UI/design.
- Preserve deterministic output for the same profile/dateKey.
- Preserve required category ids: overall, money, love, work, study, health.
- Preserve output shape unless schemaVersion is intentionally reviewed and updated.
- Compare before/after output against docs/generated/fortune-engine-sample-snapshot.json.

## Proposed Step 1 Scope

| Item | Plan | Status |
|---|---|---|
| Category score rationale | add small category-specific adjustment layer | Pending |
| Element balance use | use dominant/weak element to influence tone and caution | Pending |
| Text structure | make detail text follow reason + advice + caution structure | Pending |
| Repetition reduction | add category-specific wording variation | Pending |
| Lucky keyword use | combine existing luckyKeywords with daily flow label | Pending |
| Snapshot comparison | run existing snapshot before and after implementation | Pending |

## Proposed Non-goals for First Production PR

- Do not implement hidden stems production integration.
- Do not implement ten-gods production integration.
- Do not change manseryeok calculation.
- Do not change 2026/year/monthly fortune engine.
- Do not change zodiac fortune engine.
- Do not change UI/design.
- Do not change storage keys.
- Do not add server DB, login, ad SDK, payment SDK, or analytics SDK.
- Do not mark external manseryeok verification as completed.

## Schema Version Decision Plan

| Case | Decision Direction | Status |
|---|---|---|
| Output shape unchanged but contents change | review whether schemaVersion increment is needed | Pending |
| Category ids unchanged | preserve required category validation | Pending |
| Cached old text may remain after update | decide whether cache invalidation is needed | Pending |
| schemaVersion increment needed | update CURRENT_FORTUNE_SCHEMA_VERSION in the implementation PR only | Pending |
| schemaVersion not needed | document why cache compatibility is acceptable | Pending |

## Before/After Snapshot Comparison Plan

| Step | Status | Note |
|---|---|---|
| Run existing snapshot before implementation | Pending | use npm run snapshot:fortune-engine-samples only when intentionally comparing |
| Save comparison result | Pending | separate generated comparison doc or console result |
| Implement small today fortune change | Pending | separate production PR |
| Run snapshot after implementation | Pending | compare output shape and qualitative changes |
| Review category ids and months count | Pending | ensure output structure remains valid |
| Review deterministic behavior | Pending | fixed dateKey/profile should be stable |

## Risk Checklist

| Risk | Mitigation | Status |
|---|---|---|
| Existing cached fortune becomes stale | schemaVersion decision before implementation | Pending |
| Text changes become too broad | first PR limits to today fortune only | Pending |
| Score changes feel random | category-specific rationale required | Pending |
| Snapshot diffs become noisy | avoid generatedAt/current-time values | Pending |
| UI unexpectedly changes | no UI/design changes in implementation PR | Pending |
| Engine accuracy overclaimed | keep external verification Pending | Pending |

## Guardrails

- This PR adds today fortune engine implementation plan only.
- This PR is not a production logic change.
- This PR is not final engine accuracy approval.
- Today fortune output logic is not changed.
- Saju analysis logic is not changed.
- Manseryeok logic is not changed.
- Year/monthly fortune logic is not changed.
- Zodiac fortune logic is not changed.
- CURRENT_FORTUNE_SCHEMA_VERSION is not changed.
- schemaVersion is not changed.
- Existing localStorage keys are not changed.
- Snapshot JSON is not regenerated.
- Routing is not changed.
- UI/design is not changed.
- public/privacy-policy.html is not changed.
- AndroidManifest.xml, Android resource files, and Gradle settings are not changed.
- `.aab`, `.zip`, `.jks`, and `.keystore` files are not added to the repository.
- GitHub Secret actual values are not recorded.
- Play Console input remains separate.
- AAB upload remains separate.
- Real device QA remains separate.

## Non-goals for This PR

- Production today fortune engine change
- Production fortune engine change
- Year/monthly fortune logic change
- Zodiac fortune logic change
- Manseryeok calculation change
- Hidden stems production integration
- Ten-gods production integration
- External manseryeok verification completion
- 음력/윤달 샘플 외부 검증 completion
- 태양시 보정 policy decision
- Engine accuracy approval
- Snapshot regeneration
- CURRENT_FORTUNE_SCHEMA_VERSION change
- schemaVersion change
- localStorage key change
- UI/design change
- Android native change
- Play Console input
- AAB upload
- Real device QA

## Recommended Next Steps

1. Add a before/after snapshot comparison check design.
2. Decide the first small today fortune production change scope.
3. Decide whether CURRENT_FORTUNE_SCHEMA_VERSION should be incremented.
4. Implement one small today fortune engine improvement in a separate production PR.
5. Run snapshot comparison after implementation.
