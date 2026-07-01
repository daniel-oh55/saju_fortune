# Manseryeok External Comparison Template

## Manseryeok External Reference Candidates

- Manseryeok external reference candidates: Added
- External manseryeok reference selection: Candidate recorded
- External reference 2 selection: Pending
- Actual external reference comparison: Pending
- Manual comparison sheet completion: Pending
- Discrepancy log: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Engine accuracy approval: Pending
- Production engine logic change: Pending

## Manseryeok External Reference Selection Criteria

- Manseryeok external reference selection criteria: Added
- External manseryeok reference selection: Pending
- Actual external reference comparison: Pending
- Manual comparison sheet completion: Pending
- Discrepancy log: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Engine accuracy approval: Pending
- Production engine logic change: Pending

## Purpose

This document provides a manual comparison template for checking the 하루풀이 manseryeok sample outputs against external references.

This document is not actual external verification completion and does not approve final engine accuracy.

## Current Status

| Item | Status | Note |
|---|---|---|
| Manseryeok external verification plan | Confirmed | completed in previous PR |
| Manseryeok external comparison template | Added | this document |
| Actual external reference comparison | Pending | not completed in this PR |
| External manseryeok reference selection | Pending | source not confirmed in this PR |
| Manual comparison sheet completion | Pending | not completed in this PR |
| Discrepancy log | Pending | not created in this PR |
| 음력/윤달 샘플 외부 검증 | Pending | external reference check required |
| 태양시 보정 적용 여부 | Pending | policy decision required |
| Engine accuracy approval | Pending | not approved in this PR |
| Production engine logic change | Pending | not changed in this PR |

## Fixed Snapshot Inputs

| Item | Value |
|---|---|
| Snapshot file | docs/generated/fortune-engine-sample-snapshot.json |
| dateKey | 2026-06-30 |
| targetYear | 2026 |
| sample source | artificial sample profiles only |
| engine version | manseryeok_core_v0 |
| library basis | lunar-javascript |

## External Reference Columns To Fill Manually

| Column | Status | Note |
|---|---|---|
| Reference source name | Pending | fill manually |
| Reference URL or citation | Pending | fill manually |
| Reference access date | Pending | fill manually |
| Reference timezone/policy | Pending | fill manually |
| Reference 태양시 보정 policy | Pending | fill manually |
| Reference 23시 이후 자시 policy | Pending | fill manually |

## Sample Comparison Template

| Sample ID | Field | Current Snapshot Value | External Reference 1 | External Reference 2 | Match Status | Notes |
|---|---|---|---|---|---|---|
| solar-known-time-01 | convertedSolar | Pending fill from snapshot | Pending | Pending | Pending | standard solar known-time sample |
| solar-known-time-01 | convertedLunar | Pending fill from snapshot | Pending | Pending | Pending | standard solar known-time sample |
| solar-known-time-01 | year pillar | Pending fill from snapshot | Pending | Pending | Pending | standard solar known-time sample |
| solar-known-time-01 | month pillar | Pending fill from snapshot | Pending | Pending | Pending | standard solar known-time sample |
| solar-known-time-01 | day pillar | Pending fill from snapshot | Pending | Pending | Pending | standard solar known-time sample |
| solar-known-time-01 | hour pillar | Pending fill from snapshot | Pending | Pending | Pending | standard solar known-time sample |
| solar-unknown-time-01 | hour pillar | 시주 미상 expected | Pending | Pending | Pending | birthTimeUnknown 시주 미상 handling |
| solar-late-night-same-day-01 | day pillar | Pending fill from snapshot | Pending | Pending | Pending | 23시 이후 자시 same_day policy |
| solar-late-night-same-day-01 | hour pillar | Pending fill from snapshot | Pending | Pending | Pending | 23시 이후 자시 same_day policy |
| solar-late-night-next-day-01 | day pillar | Pending fill from snapshot | Pending | Pending | Pending | 23시 이후 자시 next_day policy |
| solar-late-night-next-day-01 | hour pillar | Pending fill from snapshot | Pending | Pending | Pending | 23시 이후 자시 next_day policy |
| lunar-non-leap-01 | convertedSolar | Pending fill from snapshot | Pending | Pending | Pending | lunar non-leap conversion |
| lunar-non-leap-01 | convertedLunar | Pending fill from snapshot | Pending | Pending | Pending | lunar non-leap conversion |
| lunar-non-leap-01 | year/month/day/hour pillar | Pending fill from snapshot | Pending | Pending | Pending | lunar non-leap pillars |
| lunar-leap-01 | convertedSolar | Pending fill from snapshot | Pending | Pending | Pending | 음력/윤달 샘플 외부 검증 |
| lunar-leap-01 | convertedLunar | Pending fill from snapshot | Pending | Pending | Pending | 음력/윤달 샘플 외부 검증 |
| lunar-leap-01 | year/month/day/hour pillar | Pending fill from snapshot | Pending | Pending | Pending | 음력/윤달 샘플 외부 검증 |
| term-boundary-01 | year pillar | Pending fill from snapshot | Pending | Pending | Pending | 절기 경계 sample |
| term-boundary-01 | month pillar | Pending fill from snapshot | Pending | Pending | Pending | 절기 경계 sample |
| profile-zodiac-boundary-01 | year pillar | Pending fill from snapshot | Pending | Pending | Pending | 사주 연주 띠 boundary |
| profile-zodiac-boundary-01 | zodiac from year pillar | Pending fill from snapshot | Pending | Pending | Pending | 일반 출생연도 띠와 비교 |

## Match Status Values

| Value | Meaning |
|---|---|
| Pending | comparison not performed |
| Match | current snapshot matches external reference |
| Mismatch | current snapshot differs from external reference |
| Policy difference | difference caused by 태양시 보정, 절기 기준, timezone, or 23시 이후 자시 policy |
| Needs review | requires manual review before engine accuracy approval |

## Discrepancy Log Template

| Sample ID | Field | Current Snapshot Value | External Reference Value | Difference Type | Review Status | Planned Follow-up |
|---|---|---|---|---|---|---|
| Pending | Pending | Pending | Pending | Pending | Pending | Pending |

## Guardrails

- This PR adds a manual comparison template only.
- This PR is not actual external verification completion.
- This PR is not final engine accuracy approval.
- Actual external reference comparison remains Pending.
- External manseryeok reference selection remains Pending.
- Manual comparison sheet completion remains Pending.
- Discrepancy log remains Pending.
- 음력/윤달 샘플 외부 검증 remains Pending.
- 태양시 보정 적용 여부 remains Pending.
- Production engine logic is not changed.
- Manseryeok calculation logic is not changed.
- Today fortune output logic is not changed.
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

- Actual external reference comparison completion
- External reference selection completion
- 음력/윤달 샘플 외부 검증 completion
- 태양시 보정 policy decision
- Engine accuracy approval
- Production manseryeok calculation change
- Production fortune engine change
- Snapshot regeneration
- schemaVersion change
- localStorage key change
- UI/design change
- Android native change
- Play Console input
- AAB upload
- Real device QA

## Recommended Next Steps

1. Select at least two external manseryeok references.
2. Fill the manual comparison template with snapshot and external reference values.
3. Record mismatches in a discrepancy log.
4. Decide 태양시 보정 적용 여부 in a separate policy PR.
5. Decide whether production manseryeok changes are needed.
