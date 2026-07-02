# Zodiac Fortune Engine Improvement Design

## Purpose

This document defines the design direction for improving the 하루풀이 zodiac fortune engine before production logic changes.

This document is not a production logic change and does not approve final engine accuracy.

## Current Status

| Item | Status | Note |
|---|---|---|
| Today fortune first production improvement | Reviewed | completed track |
| Year/monthly fortune first production improvement | Reviewed | completed track |
| Zodiac fortune engine improvement design | Added | this document |
| Zodiac fortune engine improvement | Pending | not implemented in this PR |
| Production engine logic change | Pending | not changed in this PR |
| Snapshot comparison for zodiac improvement | Pending | future PR |
| Zodiac output quality review | Pending | future PR |
| Engine accuracy approval | Pending | not approved in this PR |
| External reference comparison | Pending | not completed |
| 음력/윤달 샘플 외부 검증 | Pending | external reference comparison still required |
| 태양시 보정 적용 여부 | Pending | policy decision required |

## Current Zodiac Fortune Baseline

| Area | Current Baseline |
|---|---|
| Main engine file | src/domain/fortune/zodiacFortuneEngine.js |
| Input basis | profile, selectedYear, selectedAnimal, selectedIcon, dateKey |
| Current output basis | deterministic seed-based zodiac composition |
| Current categories | overall, money, relationship, work, health |
| Current limitation | zodiac result is useful but can feel somewhat generic across animals |
| Snapshot baseline | docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json |
| Production logic status | unchanged in this PR |

## Improvement Goals

| Goal | Status | Note |
|---|---|---|
| Improve animal-specific tone | Pending design | make each zodiac animal feel more distinct |
| Improve category-specific guidance | Pending design | overall/money/relationship/work/health should feel less repetitive |
| Improve selectedAnimal relevance | Pending design | connect summary and detail more clearly to selectedAnimal |
| Improve caution wording | Pending design | keep advice mild and non-fear-based |
| Preserve deterministic output | Pending design | same selected animal/dateKey should remain stable |
| Preserve output shape | Pending design | avoid UI breakage |
| Preserve current storage safety | Pending design | no existing localStorage key change |

## Proposed Input Signals

| Signal | Use Case | Status |
|---|---|---|
| selectedAnimal | animal-specific tone and summary | Existing |
| selectedIcon | UI display support only | Existing |
| selectedYear | deterministic seed and age/year context | Existing |
| dateKey | daily deterministic variation | Existing |
| profile | profile identity and deterministic seed | Existing |
| animal trait map | future animal tone mapping | Pending design |
| category focus map | future category-specific guidance | Pending design |

## Proposed Zodiac Design

| Area | Proposed Direction | Status |
|---|---|---|
| animal summary | connect selectedAnimal with a simple personality-like daily tone | Pending design |
| overall category | describe the day's general rhythm | Pending design |
| money category | focus on spending, checking, and small decisions | Pending design |
| relationship category | focus on conversation, distance, and emotional tone | Pending design |
| work category | focus on task rhythm and practical action | Pending design |
| health category | focus on condition and routine without medical overclaim | Pending design |
| detail text | combine animal tone, category advice, and mild caution | Pending design |

## Output Compatibility Requirements

| Requirement | Status | Note |
|---|---|---|
| selectedYear preserved | Required | existing selected year basis should remain |
| selectedAnimal preserved | Required | existing animal selection should remain |
| existing category IDs preserved | Required | overall, money, relationship, work, health |
| existing output keys preserved | Required | avoid UI/schema breakage |
| deterministic output preserved | Required | same input/dateKey should be stable |
| today fortune output unchanged | Required | separate completed track |
| year/monthly fortune output unchanged | Required | separate completed track |
| manseryeok output unchanged | Required | out of scope |
| saju analysis output unchanged | Required | out of scope |

## Implementation Phasing

| Phase | Status | Note |
|---|---|---|
| Phase 1 design | Added | this PR |
| Phase 2 implementation plan | Pending | separate PR |
| Phase 3 snapshot comparison check design | Pending | separate PR |
| Phase 4 first small production change | Pending | separate PR |
| Phase 5 after snapshot and comparison | Pending | separate PR |
| Phase 6 output quality review | Pending | separate PR |

## Guardrails

- This PR adds zodiac fortune engine improvement design only.
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

1. Add a zodiac fortune implementation plan.
2. Define before/after snapshot comparison requirements for zodiac output.
3. Implement one small zodiac fortune production improvement in a separate PR.
4. Generate zodiac after snapshot and compare unintended today/year/monthly/manseryeok/saju changes.
5. Keep engine accuracy approval Pending until external verification is completed.
