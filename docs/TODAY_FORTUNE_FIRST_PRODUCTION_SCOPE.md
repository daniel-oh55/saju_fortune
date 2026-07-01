# Today Fortune First Production Scope

## Today Fortune After Snapshot Comparison

- After snapshot generation: Generated
- Snapshot comparison after implementation: Generated
- Output quality review after implementation: Pending
- Engine accuracy approval: Pending
- Production today fortune engine improvement: Implemented in first scope
- CURRENT_FORTUNE_SCHEMA_VERSION decision: Incremented for cache refresh
- Year/monthly fortune engine improvement: Pending
- Zodiac fortune engine improvement: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending

## Today Fortune First Production Change

- Production today fortune engine improvement: Implemented in first scope
- Production engine logic change: Today fortune only
- CURRENT_FORTUNE_SCHEMA_VERSION decision: Incremented for cache refresh
- Snapshot comparison after implementation: Pending
- After snapshot generation: Pending
- Engine accuracy approval: Pending
- Year/monthly fortune engine improvement: Pending
- Zodiac fortune engine improvement: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending

## Purpose

This document defines the first small production change scope for the 하루풀이 today fortune engine.

This document is not a production logic change and does not approve final engine accuracy.

## Current Status

| Item | Status | Note |
|---|---|---|
| Today fortune engine improvement design | Confirmed | completed in previous PR |
| Today fortune engine implementation plan | Confirmed | completed in previous PR |
| Today fortune snapshot comparison check design | Confirmed | completed in previous PR |
| Today fortune first production scope | Added | this document |
| Production today fortune engine improvement | Pending | not implemented in this PR |
| Production engine logic change | Pending | not changed in this PR |
| CURRENT_FORTUNE_SCHEMA_VERSION decision | Proposed | implementation PR should increment version if cached text must refresh |
| Snapshot comparison after implementation | Pending | separate PR after implementation |
| Engine accuracy approval | Pending | not approved in this PR |

## First Production PR Scope

| Area | Decision | Status |
|---|---|---|
| Target file | src/utils/fortuneEngine.js | Proposed |
| Primary change | add small category-specific scoring and text composition adjustment | Proposed |
| Category ids | preserve overall, money, love, work, study, health | Required |
| Output shape | preserve existing today fortune output shape | Required |
| Deterministic behavior | preserve same profile/dateKey stability | Required |
| Existing localStorage keys | preserve | Required |
| UI/design | no change | Required |
| Year/monthly fortune | no change | Required |
| Zodiac fortune | no change | Required |
| Manseryeok calculation | no change | Required |

## Proposed First Logic Change

| Item | Proposed Direction | Status |
|---|---|---|
| Category score rationale | add small modifier per category using dominant/weak element and category seed | Proposed |
| Category summary tone | make summary more aligned with category and score range | Proposed |
| Detail structure | reason + advice + caution style | Proposed |
| Lucky keyword use | keep existing luckyKeywords but add clearer category relation | Proposed |
| Score range | keep within current safe range and avoid extreme volatility | Proposed |
| Output compatibility | keep existing keys and category ids | Required |

## CURRENT_FORTUNE_SCHEMA_VERSION Decision

| Decision Item | Status | Note |
|---|---|---|
| Output shape change | Not planned | keys/category ids should remain unchanged |
| Output content change | Planned | text and scores may change |
| Existing cached fortune refresh | Needed | old cached text may remain otherwise |
| Proposed version decision | Increment in implementation PR | do not change in this PR |
| Existing localStorage key change | Not needed | cache invalidation should use schemaVersion only |

## Snapshot Comparison Requirement

| Step | Status | Note |
|---|---|---|
| Use existing before snapshot | Required | docs/generated/fortune-engine-sample-snapshot.json |
| Generate after snapshot | Pending | implementation or follow-up PR |
| Compare sample count | Required | 8 samples preserved |
| Compare sample IDs | Required | all sample IDs preserved |
| Compare today category ids | Required | overall, money, love, work, study, health |
| Review score movement | Required | expected and reviewed |
| Review text quality | Required | expected and reviewed |
| Block unintended manseryeok changes | Required | out of scope |
| Block unintended year/monthly changes | Required | out of scope |
| Block unintended zodiac changes | Required | out of scope |

## Implementation PR Guardrails

- Change only src/utils/fortuneEngine.js unless a small template helper change is explicitly required.
- Do not change routing.
- Do not change UI/design.
- Do not change manseryeok calculation.
- Do not change year/monthly fortune logic.
- Do not change zodiac fortune logic.
- Preserve required category ids.
- Preserve output shape unless explicitly documented.
- Increment CURRENT_FORTUNE_SCHEMA_VERSION only in the implementation PR if cache refresh is required.
- Do not change existing localStorage keys.
- Generate and review after snapshot separately.
- Keep engine accuracy approval Pending.
- Keep 음력/윤달 샘플 외부 검증 Pending.
- Keep 태양시 보정 적용 여부 Pending.

## Guardrails

- This PR defines first production change scope only.
- This PR is not a production logic change.
- This PR is not final engine accuracy approval.
- Today fortune output logic is not changed.
- Saju analysis logic is not changed.
- Manseryeok logic is not changed.
- Year/monthly fortune logic is not changed.
- Zodiac fortune logic is not changed.
- CURRENT_FORTUNE_SCHEMA_VERSION is not changed in this PR.
- schemaVersion is not changed in this PR.
- Existing localStorage keys are not changed.
- Existing snapshot JSON is not regenerated.
- Routing is not changed.
- UI/design is not changed.
- public/privacy-policy.html is not changed.
- AndroidManifest.xml, Android resource files, and Gradle settings are not changed.
- `.aab`, `.zip`, `.jks`, and `.keystore` files are not added to the repository.
- GitHub Secret actual values are not recorded.
- Play Console input remains separate.
- AAB upload remains separate.
- Real device QA remains separate.

## Recommended Next Steps

1. Implement the first small today fortune engine change.
2. Increment CURRENT_FORTUNE_SCHEMA_VERSION in the implementation PR if cache refresh is required.
3. Generate after snapshot.
4. Compare before/after snapshot.
5. Review output quality before any wider engine changes.
