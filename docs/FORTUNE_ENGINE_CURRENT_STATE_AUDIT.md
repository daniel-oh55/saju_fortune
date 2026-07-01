# Fortune Engine Current State Audit

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

## Year Monthly Fortune Implementation Plan

- Year/monthly fortune implementation plan: Added
- Year/monthly fortune engine improvement: Pending
- Production engine logic change: Pending
- Snapshot comparison for year/monthly improvement: Pending
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Today fortune first production improvement: Reviewed
- Zodiac fortune engine improvement: Pending

## Year Monthly Fortune Engine Improvement Design

- Year/monthly fortune engine improvement design: Added
- Year/monthly fortune engine improvement: Pending
- Production engine logic change: Pending
- Snapshot comparison for year/monthly improvement: Pending
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Today fortune first production improvement: Reviewed
- Zodiac fortune engine improvement: Pending

## Today Fortune Engine Implementation Plan

- Today fortune engine implementation plan: Added
- Today fortune engine improvement: Pending
- Production engine logic change: Pending
- Snapshot comparison after implementation: Pending
- CURRENT_FORTUNE_SCHEMA_VERSION decision: Pending
- Engine accuracy approval: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending

## Today Fortune Engine Improvement Design

- Today fortune engine improvement design: Added
- Today fortune engine improvement: Pending
- Production engine logic change: Pending
- Engine accuracy approval: Pending
- Snapshot JSON regeneration: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending

## Manseryeok External Verification Plan

- Manseryeok external verification plan: Added
- Actual external reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Engine accuracy approval: Pending
- Production engine logic change: Pending

## Fortune Engine Sample Snapshot Quality Review

- Fortune engine sample snapshot quality review: Added
- Snapshot output quality review: Confirmed
- Production engine logic change: Pending
- Engine accuracy approval: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending

## Fortune Engine Sample Snapshot Result

- Fortune engine sample snapshot result: Added
- Actual output snapshot generation: Confirmed
- Snapshot runner script: Added
- Snapshot check script: Added
- Production engine logic change: Pending
- Engine accuracy approval: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending

## Fortune Engine Sample Snapshot Readiness

- Fortune engine sample snapshot readiness: Added
- Actual output snapshot generation: Pending
- Production engine logic change: Pending
- Engine accuracy approval: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending

## Fortune Engine Sample QA Baseline

- Fortune engine sample QA baseline: Added
- Actual output snapshot generation: Pending
- Production engine logic change: Pending
- Engine accuracy approval: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending

## Purpose

This document records the current state of the 하루풀이 fortune engines before planning production engine improvements.

This document is not a production logic change.

## Current Engine Areas

| Engine Area | Current Status | Main Files |
|---|---|---|
| Today fortune engine | Existing | src/utils/fortuneEngine.js |
| Saju analysis engine | Existing | src/domain/saju/createSajuAnalysis.js |
| Manseryeok engine | Existing | src/domain/saju/manseryeokEngine.js |
| Element analyzer | Existing | src/domain/saju/elementAnalyzer.js |
| Year fortune engine | Existing | src/domain/fortune/yearFortuneEngine.js |
| Zodiac fortune engine | Existing | src/domain/fortune/zodiacFortuneEngine.js |
| Zodiac fortune composer | Existing | src/lib/zodiacFortuneComposer.ts |

## Current Today Fortune Engine Notes

- createTodayFortune uses profile, dateKey, and sajuAnalysis.
- Fortune cache depends on profileId, dateKey, schemaVersion, and required categories.
- Current score generation is seed-based.
- Current category detail text is template-based with sajuAnalysis keywords.
- Production output logic is not changed in this PR.
- CURRENT_FORTUNE_SCHEMA_VERSION is not changed in this PR.

## Current Saju Analysis Notes

- createSajuAnalysis uses calculateManseryeok and analyzeElements.
- Manseryeok failure can return mock fallback analysis.
- Current manseryeok engine is library-based and still needs external sample verification.
- 태양시 보정 적용 여부 remains a future review item.
- 음력/윤달 샘플 외부 검증 remains a future review item.
- 23시 이후 자시 기준 remains a policy-sensitive review item.
- Production calculation logic is not changed in this PR.

## Current Element Analysis Notes

- Current element analysis is based on visible heavenly stems and earthly branches.
- Hidden stems are not included in the current element distribution.
- Hidden stems and ten-gods mapping already have related check scripts and should be reviewed before production interpretation changes.
- Production interpretation logic is not changed in this PR.

## Current Year and Monthly Fortune Notes

- createYearFortune currently uses profile.id, targetYear, and sajuAnalysis dominant element as seed basis.
- Year categories and monthly flows are template-based.
- Monthly scores are generated by seed.
- Target year stem/branch relationship and monthly ganji flow are not yet explicitly documented as production calculation factors.
- Production year/monthly fortune logic is not changed in this PR.

## Current Zodiac Fortune Notes

- Zodiac page prioritizes the saju year pillar branch when available.
- Birth-year zodiac is used as fallback.
- Zodiac yearly list is a general reference list.
- Zodiac fortune uses zodiac composition and seed-based category scoring.
- Production zodiac fortune logic is not changed in this PR.

## Improvement Candidates

| Area | Candidate | Status |
|---|---|---|
| Manseryeok accuracy | 음력/윤달 샘플 외부 검증 | Pending |
| Manseryeok policy | 태양시 보정 적용 여부 | Pending |
| Manseryeok policy | 23시 이후 자시 기준 QA | Pending |
| Saju analysis | Hidden stems integration review | Pending |
| Saju analysis | Ten-gods interpretation review | Pending |
| Today fortune | Day flow and user day-master relationship design | Pending |
| Today fortune | Category score rule design | Pending |
| Year fortune | Target year ganji relationship design | Pending |
| Monthly fortune | Monthly ganji flow design | Pending |
| Zodiac fortune | Saju year pillar vs birth-year explanation refinement | Pending |
| Zodiac fortune | Zodiac text variety and repetition review | Pending |

## Guardrails

- This PR records current engine state only.
- This PR is not a production logic change.
- Today fortune output logic is not changed.
- Saju analysis logic is not changed.
- Manseryeok logic is not changed.
- Year/monthly fortune logic is not changed.
- Zodiac fortune logic is not changed.
- CURRENT_FORTUNE_SCHEMA_VERSION is not changed.
- schemaVersion is not changed.
- Existing localStorage keys are not changed.
- Routing is not changed.
- UI/design is not changed.
- public/privacy-policy.html is not changed.
- AndroidManifest.xml, Android resource files, and Gradle settings are not changed.
- `.aab`, `.zip`, `.jks`, and `.keystore` files are not added to the repository.
- GitHub Secret actual values are not recorded.

## Non-goals for This PR

- Production fortune engine change
- Today fortune logic change
- Year fortune logic change
- Monthly fortune logic change
- Zodiac fortune logic change
- Manseryeok calculation change
- Hidden stems production integration
- Ten-gods production integration
- schemaVersion change
- localStorage key change
- UI/design change
- Android native change
- Play Console input
- AAB upload
- Real device QA

## Recommended Next Steps

1. Add engine sample QA baseline.
2. Expand manseryeok sample verification plan.
3. Design saju interpretation layer improvements.
4. Improve today fortune engine in a separate PR.
5. Improve year/monthly fortune engine in a separate PR.
6. Improve zodiac fortune engine in a separate PR.
