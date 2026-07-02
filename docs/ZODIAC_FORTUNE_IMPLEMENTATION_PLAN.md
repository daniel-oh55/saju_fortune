# Zodiac Fortune Implementation Plan

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

## Zodiac First Production Scope

- Zodiac first production scope: Added
- Zodiac fortune engine improvement: Pending
- Production engine logic change: Pending
- Snapshot comparison for zodiac improvement: Pending
- Zodiac output quality review: Pending
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Today fortune first production improvement: Reviewed
- Year/monthly fortune first production improvement: Reviewed

## Zodiac Snapshot Comparison Check Design

- Zodiac snapshot comparison check design: Added
- Zodiac fortune engine improvement: Pending
- Production engine logic change: Pending
- Snapshot comparison for zodiac improvement: Pending
- Zodiac output quality review: Pending
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Today fortune first production improvement: Reviewed
- Year/monthly fortune first production improvement: Reviewed

## Purpose

This document defines the implementation plan for improving the 하루풀이 zodiac fortune engine in a future production PR.

This document is not a production logic change and does not approve final engine accuracy.

## Current Status

| Item | Status | Note |
|---|---|---|
| Zodiac fortune engine improvement design | Confirmed | completed in previous PR |
| Zodiac fortune implementation plan | Added | this document |
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

## Planned Production Scope

| Area | Planned Change | Status |
|---|---|---|
| src/domain/fortune/zodiacFortuneEngine.js | improve zodiac summary/detail/category text composition in a small scoped PR | Pending |
| animal tone composition | make selectedAnimal feel more distinct | Pending |
| category summaries | make overall/money/relationship/work/health guidance less repetitive | Pending |
| detail text | combine animal tone, category advice, and mild caution | Pending |
| today fortune engine | no change | Required |
| year/monthly fortune engine | no change | Required |
| manseryeok engine | no change | Required |
| saju analysis engine | no change | Required |
| UI/design | no change unless separately approved | Required |

## Implementation Principles

- Keep the first zodiac production PR small.
- Change only zodiac fortune logic.
- Do not change today fortune output logic.
- Do not change year/monthly fortune output logic.
- Do not change manseryeok calculation logic.
- Do not change saju analysis logic.
- Do not change routing or UI/design.
- Preserve deterministic output for the same selectedAnimal/dateKey.
- Preserve existing category IDs: overall, money, relationship, work, health.
- Preserve existing output shape unless explicitly documented.
- Preserve existing localStorage keys.
- Compare before/after output using the current after-year/monthly snapshot as the practical baseline.

## Practical Snapshot Baseline

| File | Role | Status |
|---|---|---|
| docs/generated/fortune-engine-sample-snapshot.json | original baseline before today improvement | Existing |
| docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json | baseline after today improvement | Existing |
| docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json | practical baseline before zodiac improvement | Existing |
| docs/generated/year-monthly-fortune-snapshot-comparison-result.json | year/monthly comparison result | Existing |
| future zodiac after snapshot | Pending | separate PR after production change |
| future zodiac comparison result | Pending | separate PR after production change |

## Proposed First Production PR Scope

| Item | Plan | Status |
|---|---|---|
| Animal-specific tone | add small animal trait map for selectedAnimal | Pending |
| Category focus | add category-specific focus map for overall/money/relationship/work/health | Pending |
| Score rationale | keep deterministic score but make category text more explainable | Pending |
| Detail composition | add animal tone, advice, and mild caution structure | Pending |
| Output compatibility | preserve existing keys and category IDs | Required |
| Snapshot comparison | run after snapshot and compare unchanged today/year/monthly/manseryeok/saju outputs | Pending |

## Schema Version Decision Plan

| Case | Decision Direction | Status |
|---|---|---|
| Today fortune output unchanged | CURRENT_FORTUNE_SCHEMA_VERSION should not change for zodiac-only PR | Proposed |
| Zodiac output shape unchanged | avoid schema/localStorage changes | Proposed |
| Zodiac content changes only | document content refresh behavior without changing existing localStorage keys | Pending |
| Existing localStorage key change needed | not planned; requires separate migration plan | Pending |
| Output shape changes needed | not planned for first production PR | Pending |

## Before/After Snapshot Comparison Plan

| Step | Status | Note |
|---|---|---|
| Use after-year/monthly snapshot as practical baseline | Pending | docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json |
| Implement small zodiac change | Pending | separate production PR |
| Generate zodiac after snapshot | Pending | separate generated file |
| Compare sample count and sample IDs | Pending | 8 samples preserved |
| Compare today fortune output | Pending | should remain unchanged from practical baseline |
| Compare year/monthly fortune output | Pending | should remain unchanged from practical baseline |
| Compare manseryeok output | Pending | should remain unchanged |
| Compare saju analysis output | Pending | should remain unchanged |
| Compare zodiac output | Pending | expected to change with review |
| Compare zodiac category IDs | Pending | overall, money, relationship, work, health preserved |

## Risk Checklist

| Risk | Mitigation | Status |
|---|---|---|
| Zodiac category IDs change unexpectedly | preserve overall/money/relationship/work/health | Pending |
| Today fortune changes unintentionally | comparison must block unintended today changes | Pending |
| Year/monthly output changes unintentionally | comparison must block unintended year/monthly changes | Pending |
| Manseryeok output changes unintentionally | comparison must block unintended manseryeok changes | Pending |
| Saju analysis output changes unintentionally | comparison must block unintended saju changes | Pending |
| Text becomes too generic | add animal tone and category focus map | Pending |
| Text becomes fear-based | keep caution mild and non-threatening | Pending |
| Engine accuracy overclaimed | keep engine accuracy approval Pending | Pending |

## Guardrails

- This PR adds zodiac fortune implementation plan only.
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

1. Add zodiac before/after snapshot comparison design.
2. Define first small zodiac production change scope.
3. Implement one small zodiac fortune production improvement in a separate PR.
4. Generate zodiac after snapshot and comparison result.
5. Review zodiac output quality before any wider engine changes.
