# Fortune Engine Sample QA Baseline

## Purpose

This document defines sample QA baseline cases for the 하루풀이 fortune engines before production engine improvements.

This document is not a production logic change and does not record final engine accuracy approval.

## Baseline Scope

| Area | Status | Note |
|---|---|---|
| Today fortune sample QA baseline | Added | sample cases defined before engine changes |
| Saju analysis sample QA baseline | Added | profile/date inputs defined |
| Manseryeok sample QA baseline | Added | external verification remains Pending |
| Year/monthly fortune sample QA baseline | Added | target-year/monthly output shape checks defined |
| Zodiac fortune sample QA baseline | Added | saju year pillar vs birth-year checks defined |
| Production engine logic change | Pending | not changed in this PR |
| Engine accuracy approval | Pending | not approved in this PR |
| 음력/윤달 샘플 외부 검증 | Pending | separate verification required |
| 태양시 보정 적용 여부 | Pending | separate policy decision required |

## Sample Profile Matrix

| Sample ID | Calendar Type | Birth Date | Birth Time | Birth Time Unknown | Leap Month | Late-night Jasi Policy | Purpose |
|---|---|---|---|---|---|---|---|
| solar-known-time-01 | solar | 1990-03-15 | 09:30 | false | false | same_day | standard solar known-time sample |
| solar-unknown-time-01 | solar | 1988-07-21 | null | true | false | same_day | birthTimeUnknown 사주 미상 sample |
| solar-late-night-same-day-01 | solar | 1992-11-08 | 23:30 | false | false | same_day | 23시 이후 자시 same-day policy sample |
| solar-late-night-next-day-01 | solar | 1992-11-08 | 23:30 | false | false | next_day | 23시 이후 자시 next-day policy sample |
| lunar-non-leap-01 | lunar | 1991-01-10 | 14:20 | false | false | same_day | 음력 일반 월 sample |
| lunar-leap-01 | lunar | 1995-08-10 | 10:10 | false | true | same_day | 음력/윤달 샘플 외부 검증 대상 |
| term-boundary-01 | solar | 1990-02-04 | 05:00 | false | false | same_day | 절기 경계 sample |
| profile-zodiac-boundary-01 | solar | 1988-02-03 | 12:00 | false | false | same_day | 사주 연주 띠와 일반 출생연도 띠 차이 검토 sample |

## Today Fortune Output Shape Checks

| Check Area | Expected Baseline |
|---|---|
| Fortune id | includes profileId and dateKey |
| schemaVersion | CURRENT_FORTUNE_SCHEMA_VERSION unchanged |
| averageScore | number |
| greeting | includes nickname and score |
| keyword | derived from sajuAnalysis luckyKeywords |
| categories | includes required categories |
| required category ids | overall, money, love, work, study, health |
| sajuAnalysis | included |
| monetization | existing flags preserved |
| aiConsult | remains disabled unless separately changed |

## Saju Analysis Shape Checks

| Check Area | Expected Baseline |
|---|---|
| birth | profile birth data reflected |
| pillars.year | present or fallback state documented |
| pillars.month | present or fallback state documented |
| pillars.day | present or fallback state documented |
| pillars.hour | present or 사주 미상 when birthTimeUnknown=true |
| manseryeok | included when calculation succeeds |
| elements.dominant | present |
| elements.weak | present |
| traits | non-empty array |
| weakPoints | non-empty array |
| luckyKeywords | non-empty array |
| engineStatus | documented |

## Manseryeok QA Notes

- Current manseryeok engine is library-based.
- External reference comparison is still required before claiming high accuracy.
- 음력/윤달 샘플 외부 검증 remains Pending.
- 태양시 보정 적용 여부 remains Pending.
- 23시 이후 자시 기준 requires same_day and next_day sample comparison.
- 절기 경계 sample requires external reference comparison.
- This PR does not change manseryeok calculation logic.

## Year and Monthly Fortune Shape Checks

| Check Area | Expected Baseline |
|---|---|
| targetYear | 2026 by current page usage |
| averageScore | number |
| summary | present |
| keyword | based on sajuAnalysis luckyKeywords |
| categories | present |
| months | 12 items |
| month score | number |
| month note | present |
| month detail | present |
| target year ganji relationship | Pending design |
| monthly ganji flow | Pending design |

## Zodiac Fortune Shape Checks

| Check Area | Expected Baseline |
|---|---|
| zodiac selection | saju year pillar branch preferred when available |
| birth-year fallback | used when saju year pillar is unavailable |
| selected year | present |
| selected animal | present |
| category scores | generated |
| category summaries | generated |
| detail | generated |
| saju year pillar vs birth-year explanation | Pending refinement |
| text repetition review | Pending |

## Future Snapshot Plan

| Step | Status | Note |
|---|---|---|
| Define sample profile matrix | Added | this document |
| Add sample output snapshot script | Pending | separate PR |
| Record current today fortune outputs | Pending | separate PR |
| Record current year/monthly outputs | Pending | separate PR |
| Record current zodiac outputs | Pending | separate PR |
| Compare outputs after production engine changes | Pending | future PR |

## Guardrails

- This PR defines sample QA baselines only.
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
- Play Console input remains separate.
- AAB upload remains separate.
- Real device QA remains separate.

## Non-goals for This PR

- Production fortune engine change
- Today fortune logic change
- Year fortune logic change
- Monthly fortune logic change
- Zodiac fortune logic change
- Manseryeok calculation change
- Hidden stems production integration
- Ten-gods production integration
- Actual output snapshot generation
- External manseryeok verification completion
- schemaVersion change
- localStorage key change
- UI/design change
- Android native change
- Play Console input
- AAB upload
- Real device QA

## Recommended Next Steps

1. Add sample output snapshot script.
2. Run today/year/monthly/zodiac sample outputs against the baseline.
3. Expand manseryeok external sample verification.
4. Design saju interpretation layer improvements.
5. Improve today fortune engine in a separate production PR.
