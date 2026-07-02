# Zodiac Snapshot Comparison Check Design

## Zodiac After Snapshot Comparison

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

## Purpose

This document defines the before/after snapshot comparison design for reviewing zodiac fortune engine output changes.

This document is not a production logic change and does not approve final engine accuracy.

## Current Status

| Item | Status | Note |
|---|---|---|
| Zodiac fortune engine improvement design | Confirmed | completed in previous PR |
| Zodiac fortune implementation plan | Confirmed | completed in previous PR |
| Zodiac snapshot comparison check design | Added | this document |
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

## Practical Baseline

| File | Role | Status |
|---|---|---|
| docs/generated/fortune-engine-sample-snapshot.json | original baseline before today improvement | Existing |
| docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json | baseline after today improvement | Existing |
| docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json | practical baseline before zodiac improvement | Existing |
| docs/generated/year-monthly-fortune-snapshot-comparison-result.json | year/monthly comparison result | Existing |

## Future Comparison Files

| File | Purpose | Status |
|---|---|---|
| docs/generated/fortune-engine-sample-snapshot-after-zodiac-improvement.json | future after snapshot | Pending |
| docs/generated/zodiac-fortune-snapshot-comparison-result.json | future comparison result | Pending |
| scripts/runZodiacFortuneAfterSnapshot.mjs | future snapshot runner | Pending |
| scripts/checkZodiacFortuneSnapshotComparison.mjs | future comparison checker | Pending |

## Comparison Targets

| Area | Must Compare | Status |
|---|---|---|
| sample count | 8 samples preserved | Pending |
| sample IDs | all existing sample IDs preserved | Pending |
| todayFortuneSummary | unchanged from practical baseline | Pending |
| yearFortuneSummary | unchanged from practical baseline | Pending |
| manseryeokSummary | unchanged from practical baseline | Pending |
| sajuAnalysisSummary | unchanged from practical baseline | Pending |
| zodiacFortuneSummary | expected to change with review | Pending |
| zodiac category IDs | overall, money, relationship, work, health preserved | Pending |
| selectedYear | preserved | Pending |
| selectedAnimal | preserved | Pending |

## Allowed Difference Policy

| Difference Type | Allowed? | Note |
|---|---|---|
| zodiac fortune score movement | Allowed with review | expected after zodiac improvement |
| zodiac fortune summary/detail text change | Allowed with review | expected after text improvement |
| zodiac category IDs changed | Not allowed | must preserve overall, money, relationship, work, health |
| selectedYear changed | Not allowed | existing selected year basis should remain |
| selectedAnimal changed | Not allowed | existing animal selection should remain |
| today fortune output changed | Not allowed | separate completed track |
| year/monthly fortune output changed | Not allowed | separate completed track |
| manseryeok output changed | Not allowed | out of scope |
| saju analysis output changed | Not allowed | out of scope |
| CURRENT_FORTUNE_SCHEMA_VERSION changed | Not planned | zodiac-only PR should not change it |
| existing localStorage keys changed | Not allowed | requires separate migration plan |

## Proposed Check Script Behavior

| Check | Status | Note |
|---|---|---|
| Load practical baseline snapshot | Pending | docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json |
| Load future after snapshot | Pending | generated after zodiac implementation |
| Validate sample IDs | Pending | all 8 sample IDs preserved |
| Validate today output unchanged | Pending | compare todayFortuneSummary |
| Validate year/monthly output unchanged | Pending | compare yearFortuneSummary |
| Validate manseryeok output unchanged | Pending | compare manseryeokSummary |
| Validate saju analysis output unchanged | Pending | compare sajuAnalysisSummary |
| Validate zodiac output changed or reviewed | Pending | expected change |
| Validate zodiac category IDs | Pending | overall, money, relationship, work, health preserved |
| Report engine accuracy status | Pending | must remain Pending |

## Guardrails

- This PR adds zodiac snapshot comparison check design only.
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

1. Define the first small zodiac production change scope.
2. Implement one small zodiac fortune production improvement.
3. Generate zodiac after snapshot.
4. Run before/after comparison.
5. Review zodiac output quality.
