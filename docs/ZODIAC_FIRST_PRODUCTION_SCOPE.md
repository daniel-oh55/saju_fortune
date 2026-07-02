# Zodiac First Production Scope

## Zodiac Output Quality Review

- Zodiac output quality review: Reviewed
- Zodiac category focus particle fix: Applied
- Zodiac after snapshot regenerated after particle fix: Generated
- Snapshot comparison for zodiac improvement: Generated
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Zodiac fortune engine improvement: Implemented in first scope
- Production engine logic change: Zodiac only
- Today fortune first production improvement: Reviewed
- Year/monthly fortune first production improvement: Reviewed

## Zodiac After Snapshot Comparison

- Zodiac category focus particle fix: Applied
- Zodiac after snapshot regenerated after particle fix: Generated
- Zodiac after snapshot generation: Generated
- Snapshot comparison for zodiac improvement: Generated
- Zodiac output quality review: Pending
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Zodiac fortune engine improvement: Implemented in first scope
- Production engine logic change: Zodiac only
- Today fortune first production improvement: Reviewed
- Year/monthly fortune first production improvement: Reviewed

## Zodiac First Production Change

- Zodiac fortune engine improvement: Implemented in first scope
- Production engine logic change: Zodiac only
- Zodiac first production change: Implemented
- Zodiac after snapshot generation: Pending
- Snapshot comparison for zodiac improvement: Pending
- Zodiac output quality review: Pending
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Today fortune first production improvement: Reviewed
- Year/monthly fortune first production improvement: Reviewed

## Purpose

This document defines the first small production change scope for the 하루풀이 zodiac fortune engine.

This document is not a production logic change and does not approve final engine accuracy.

## Current Status

| Item | Status | Note |
|---|---|---|
| Zodiac fortune engine improvement design | Confirmed | completed in previous PR |
| Zodiac fortune implementation plan | Confirmed | completed in previous PR |
| Zodiac snapshot comparison check design | Confirmed | completed in previous PR |
| Zodiac first production scope | Added | this document |
| Zodiac fortune engine improvement | Pending | not implemented in this PR |
| Production engine logic change | Pending | not changed in this PR |
| Snapshot comparison for zodiac improvement | Pending | future PR |
| Zodiac output quality review | Pending | future PR |
| Engine accuracy approval | Pending | not approved in this PR |
| External reference comparison | Pending | not completed |
| 음력/윤달 샘플 외부 검증 | Pending | external reference comparison still required |
| 태양시 보정 적용 여부 | Pending | policy decision required |
| Today fortune first production improvement | Reviewed | separate completed track |
| Year/monthly fortune first production improvement | Reviewed | separate completed track |

## First Production PR Scope

| Area | Decision | Status |
|---|---|---|
| Target file | src/domain/fortune/zodiacFortuneEngine.js | Proposed |
| Primary change | add small animal-specific tone and category text composition adjustment | Proposed |
| Category IDs | preserve overall, money, relationship, work, health | Required |
| selectedYear | preserve existing selected year basis | Required |
| selectedAnimal | preserve existing selected animal basis | Required |
| Output shape | preserve existing zodiac output keys | Required |
| Deterministic behavior | preserve same selectedAnimal/dateKey stability | Required |
| Today fortune output | no change | Required |
| Year/monthly fortune output | no change | Required |
| Manseryeok output | no change | Required |
| Saju analysis output | no change | Required |
| Existing localStorage keys | preserve | Required |
| UI/design | no change | Required |

## Proposed First Logic Change

| Item | Proposed Direction | Status |
|---|---|---|
| Animal-specific tone | add small animal trait map for selectedAnimal | Proposed |
| Category focus | add category focus phrases for overall, money, relationship, work, health | Proposed |
| Score rationale | keep deterministic score but make category summary more explainable | Proposed |
| Detail composition | combine animal tone, advice, and mild caution | Proposed |
| Caution wording | keep mild and non-fear-based | Proposed |
| Health wording | avoid medical overclaim and keep routine-focused phrasing | Proposed |
| Output compatibility | keep existing keys and category IDs | Required |

## Schema Version Decision

| Decision Item | Status | Note |
|---|---|---|
| CURRENT_FORTUNE_SCHEMA_VERSION change | Not planned | zodiac-only PR should not change today fortune cache schema |
| schemaVersion change | Not planned | output shape change is not planned |
| Existing localStorage key change | Not planned | requires separate migration plan |
| Output content change | Planned | zodiac summary/detail/category text may change |
| Output shape change | Not planned | first production PR should preserve shape |

## Snapshot Comparison Requirement

| Step | Status | Note |
|---|---|---|
| Use practical baseline snapshot | Required | docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json |
| Generate zodiac after snapshot | Pending | separate PR after implementation or same implementation PR only if explicitly scoped |
| Compare sample count | Required | 8 samples preserved |
| Compare sample IDs | Required | all sample IDs preserved |
| Compare today fortune output | Required | unchanged from practical baseline |
| Compare year/monthly fortune output | Required | unchanged from practical baseline |
| Compare manseryeok output | Required | unchanged |
| Compare saju analysis output | Required | unchanged |
| Compare zodiac output | Required | expected to change with review |
| Compare zodiac category IDs | Required | overall, money, relationship, work, health preserved |
| Compare selectedYear | Required | preserved |
| Compare selectedAnimal | Required | preserved |

## Implementation PR Guardrails

- Change only src/domain/fortune/zodiacFortuneEngine.js unless a small helper in the same zodiac fortune domain is explicitly required.
- Do not change today fortune output logic.
- Do not change year/monthly fortune output logic.
- Do not change manseryeok calculation.
- Do not change saju analysis logic.
- Do not change routing.
- Do not change UI/design.
- Do not change CURRENT_FORTUNE_SCHEMA_VERSION.
- Do not change schemaVersion.
- Do not change existing localStorage keys.
- Preserve zodiac category IDs: overall, money, relationship, work, health.
- Preserve selectedYear and selectedAnimal behavior.
- Preserve output shape unless explicitly documented.
- Generate and review zodiac after snapshot separately.
- Keep engine accuracy approval Pending.
- Keep External reference comparison Pending.
- Keep 음력/윤달 샘플 외부 검증 Pending.
- Keep 태양시 보정 적용 여부 Pending.

## Guardrails

- This PR defines first zodiac production change scope only.
- This PR is not a production logic change.
- This PR is not final engine accuracy approval.
- Zodiac fortune output logic is not changed.
- Today fortune output logic is not changed.
- Year/monthly fortune output logic is not changed.
- Saju analysis logic is not changed.
- Manseryeok logic is not changed.
- CURRENT_FORTUNE_SCHEMA_VERSION is not changed.
- schemaVersion is not changed.
- Existing localStorage keys are not changed.
- Snapshot JSON files are not regenerated.
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

1. Implement one small zodiac fortune production improvement.
2. Keep CURRENT_FORTUNE_SCHEMA_VERSION unchanged for the zodiac-only PR.
3. Generate zodiac after snapshot.
4. Compare before/after snapshot.
5. Review zodiac output quality before wider engine changes.
