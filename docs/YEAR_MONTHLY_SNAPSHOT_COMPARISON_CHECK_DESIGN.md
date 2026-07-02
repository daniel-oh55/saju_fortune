# Year Monthly Snapshot Comparison Check Design

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

## Purpose

This document defines the before/after snapshot comparison design for reviewing year/monthly fortune engine output changes.

This document is not a production logic change and does not approve final engine accuracy.

## Current Status

| Item | Status | Note |
|---|---|---|
| Year/monthly fortune engine improvement design | Confirmed | completed in previous PR |
| Year/monthly fortune implementation plan | Confirmed | completed in previous PR |
| Year/monthly snapshot comparison check design | Added | this document |
| Year/monthly fortune engine improvement | Pending | not implemented in this PR |
| Production engine logic change | Pending | not changed in this PR |
| Snapshot comparison for year/monthly improvement | Pending | future PR |
| Engine accuracy approval | Pending | not approved in this PR |
| External reference comparison | Pending | not completed |
| 음력/윤달 샘플 외부 검증 | Pending | external reference comparison still required |
| 태양시 보정 적용 여부 | Pending | policy decision required |
| Today fortune first production improvement | Reviewed | separate completed track |
| Zodiac fortune engine improvement | Pending | separate track |

## Practical Baseline

| File | Role | Status |
|---|---|---|
| docs/generated/fortune-engine-sample-snapshot.json | original baseline before today improvement | Existing |
| docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json | practical baseline before year/monthly improvement | Existing |
| docs/generated/today-fortune-snapshot-comparison-result.json | today fortune comparison result | Existing |

## Future Comparison Files

| File | Purpose | Status |
|---|---|---|
| docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json | future after snapshot | Pending |
| docs/generated/year-monthly-fortune-snapshot-comparison-result.json | future comparison result | Pending |
| scripts/runYearMonthlyFortuneAfterSnapshot.mjs | future snapshot runner | Pending |
| scripts/checkYearMonthlyFortuneSnapshotComparison.mjs | future comparison checker | Pending |

## Comparison Targets

| Area | Must Compare | Status |
|---|---|---|
| sample count | 8 samples preserved | Pending |
| sample IDs | all existing sample IDs preserved | Pending |
| todayFortuneSummary | unchanged from after-today baseline | Pending |
| manseryeokSummary | unchanged from after-today baseline | Pending |
| sajuAnalysisSummary | unchanged from after-today baseline | Pending |
| zodiacFortuneSummary | unchanged from after-today baseline | Pending |
| yearFortuneSummary | expected to change with review | Pending |
| targetYear | 2026 preserved | Pending |
| monthly entries count | 12 monthly entries preserved | Pending |
| monthly score movement | allowed with review | Pending |
| monthly text changes | allowed with review | Pending |

## Allowed Difference Policy

| Difference Type | Allowed? | Note |
|---|---|---|
| year/monthly fortune score movement | Allowed with review | expected after year/monthly improvement |
| year/monthly fortune summary/text change | Allowed with review | expected after text improvement |
| monthly entries count changed | Not allowed | must remain 12 |
| targetYear changed | Not allowed | must remain 2026 |
| today fortune output changed | Not allowed | today track already reviewed |
| zodiac fortune output changed | Not allowed | separate track |
| manseryeok output changed | Not allowed | out of scope |
| saju analysis output changed | Not allowed | out of scope |
| CURRENT_FORTUNE_SCHEMA_VERSION changed | Not planned | year/monthly-only PR should not change it |
| existing localStorage keys changed | Not allowed | requires separate migration plan |

## Proposed Check Script Behavior

| Check | Status | Note |
|---|---|---|
| Load practical baseline snapshot | Pending | docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json |
| Load future after snapshot | Pending | generated after year/monthly implementation |
| Validate sample IDs | Pending | all 8 sample IDs preserved |
| Validate today output unchanged | Pending | compare todayFortuneSummary |
| Validate manseryeok output unchanged | Pending | compare manseryeokSummary |
| Validate saju analysis output unchanged | Pending | compare sajuAnalysisSummary |
| Validate zodiac output unchanged | Pending | compare zodiacFortuneSummary |
| Validate year/monthly output changed or reviewed | Pending | expected change |
| Validate monthly entries count | Pending | 12 monthly entries preserved |
| Report engine accuracy status | Pending | must remain Pending |

## Guardrails

- This PR adds year/monthly snapshot comparison check design only.
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

1. Define the first small year/monthly production change scope.
2. Implement one small year/monthly fortune production improvement.
3. Generate year/monthly after snapshot.
4. Run before/after comparison.
5. Review year/monthly output quality.
