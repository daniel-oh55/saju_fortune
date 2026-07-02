# Year Monthly Fortune Implementation Plan

## Year Monthly First Production Change

- Year/monthly fortune engine improvement: Implemented in first scope
- Production engine logic change: Year/monthly only
- CURRENT_FORTUNE_SCHEMA_VERSION decision: Unchanged for year/monthly-only PR
- schemaVersion decision: Unchanged because output shape is preserved
- Year/monthly after snapshot generation: Pending
- Snapshot comparison for year/monthly improvement: Pending
- Year/monthly output quality review: Pending
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Today fortune first production improvement: Reviewed
- Zodiac fortune engine improvement: Pending

## Year Monthly First Production Scope

- Year/monthly first production scope: Added
- Year/monthly fortune engine improvement: Pending
- Production engine logic change: Pending
- Snapshot comparison for year/monthly improvement: Pending
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Today fortune first production improvement: Reviewed
- Zodiac fortune engine improvement: Pending

## Year Monthly Snapshot Comparison Check Design

- Year/monthly snapshot comparison check design: Added
- Year/monthly fortune engine improvement: Pending
- Production engine logic change: Pending
- Snapshot comparison for year/monthly improvement: Pending
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Today fortune first production improvement: Reviewed
- Zodiac fortune engine improvement: Pending

## Purpose

This document defines the implementation plan for improving the 하루풀이 year/monthly fortune engine in a future production PR.

This document is not a production logic change and does not approve final engine accuracy.

## Current Status

| Item | Status | Note |
|---|---|---|
| Year/monthly fortune engine improvement design | Confirmed | completed in previous PR |
| Year/monthly fortune implementation plan | Added | this document |
| Year/monthly fortune engine improvement | Pending | not implemented in this PR |
| Production engine logic change | Pending | not changed in this PR |
| Snapshot comparison for year/monthly improvement | Pending | future PR |
| Engine accuracy approval | Pending | not approved in this PR |
| External reference comparison | Pending | not completed |
| 음력/윤달 샘플 외부 검증 | Pending | external reference comparison still required |
| 태양시 보정 적용 여부 | Pending | policy decision required |
| Today fortune first production improvement | Reviewed | separate completed track |
| Zodiac fortune engine improvement | Pending | separate track |

## Planned Production Scope

| Area | Planned Change | Status |
|---|---|---|
| src/domain/fortune/yearFortuneEngine.js | improve annual/monthly score and text composition in a small scoped PR | Pending |
| annual summary composition | make annual narrative more tied to sajuAnalysis elements and targetYear | Pending |
| monthly entries | preserve 12 monthly entries while improving variation and rationale | Pending |
| today fortune engine | no change | Required |
| zodiac fortune engine | no change | Required |
| manseryeok engine | no change | Required |
| saju analysis engine | no change | Required |
| UI/design | no change unless separately approved | Required |

## Implementation Principles

- Keep the first year/monthly production PR small.
- Change only year/monthly fortune logic.
- Do not change today fortune output logic.
- Do not change zodiac fortune logic.
- Do not change manseryeok calculation logic.
- Do not change saju analysis logic.
- Do not change routing or UI/design.
- Preserve deterministic output for the same profile/targetYear.
- Preserve 12 monthly entries.
- Preserve existing output shape unless explicitly documented.
- Preserve existing localStorage keys.
- Compare before/after output using the current after-today snapshot as the practical baseline.

## Practical Snapshot Baseline

| File | Role | Status |
|---|---|---|
| docs/generated/fortune-engine-sample-snapshot.json | original before today improvement snapshot | Existing |
| docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json | practical baseline before year/monthly improvement | Existing |
| docs/generated/today-fortune-snapshot-comparison-result.json | today improvement comparison result | Existing |
| future year/monthly after snapshot | Pending | separate PR after production change |
| future year/monthly comparison result | Pending | separate PR after production change |

## Proposed First Production PR Scope

| Item | Plan | Status |
|---|---|---|
| Annual narrative relevance | add small composition layer using dominant/weak element and targetYear seed | Pending |
| Monthly score rationale | add deterministic month-specific modifier with explanation | Pending |
| Monthly text variation | add month focus labels to reduce repetitive wording | Pending |
| Advice/caution structure | add practical advice and mild caution where useful | Pending |
| Output compatibility | preserve existing keys and 12 monthly entries | Required |
| Snapshot comparison | run after snapshot and compare unchanged today/zodiac/manseryeok outputs | Pending |

## Schema Version Decision Plan

| Case | Decision Direction | Status |
|---|---|---|
| Today fortune output unchanged | CURRENT_FORTUNE_SCHEMA_VERSION should not change for year/monthly-only PR | Proposed |
| Year/monthly output shape unchanged | avoid schema/localStorage changes | Proposed |
| Year/monthly content changes only | document content refresh behavior without changing existing localStorage keys | Pending |
| Existing localStorage key change needed | not planned; requires separate migration plan | Pending |
| Output shape changes needed | not planned for first production PR | Pending |

## Before/After Snapshot Comparison Plan

| Step | Status | Note |
|---|---|---|
| Use after-today snapshot as practical baseline | Pending | docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json |
| Implement small year/monthly change | Pending | separate production PR |
| Generate year/monthly after snapshot | Pending | separate generated file |
| Compare sample count and sample IDs | Pending | 8 samples preserved |
| Compare today fortune output | Pending | should remain unchanged from after-today baseline |
| Compare manseryeok output | Pending | should remain unchanged |
| Compare zodiac fortune output | Pending | should remain unchanged |
| Compare year/monthly output | Pending | expected to change with review |
| Review 12 monthly entries | Pending | must remain 12 |

## Risk Checklist

| Risk | Mitigation | Status |
|---|---|---|
| Month entries shape changes unexpectedly | preserve existing output keys and 12 entries | Pending |
| Today fortune changes again unintentionally | comparison must block unintended today changes | Pending |
| Zodiac output changes unintentionally | comparison must block unintended zodiac changes | Pending |
| Manseryeok output changes unintentionally | comparison must block unintended manseryeok changes | Pending |
| Text becomes too generic | add monthly focus labels and practical advice | Pending |
| Engine accuracy overclaimed | keep engine accuracy approval Pending | Pending |

## Guardrails

- This PR adds year/monthly fortune implementation plan only.
- This PR is not a production logic change.
- This PR is not final engine accuracy approval.
- Year/monthly fortune output logic is not changed.
- Today fortune output logic is not changed.
- Zodiac fortune output logic is not changed.
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

1. Add year/monthly before/after snapshot comparison design.
2. Define first small year/monthly production change scope.
3. Implement one small year/monthly fortune production improvement in a separate PR.
4. Generate year/monthly after snapshot and comparison result.
5. Review output quality before any wider engine changes.
