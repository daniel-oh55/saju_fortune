# Manseryeok External Verification Plan

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

## Manseryeok External Comparison Template

- Manseryeok external comparison template: Added
- Actual external reference comparison: Pending
- External manseryeok reference selection: Pending
- Manual comparison sheet completion: Pending
- Discrepancy log: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Engine accuracy approval: Pending
- Production engine logic change: Pending

## Purpose

This document defines the external verification plan for the 하루풀이 manseryeok engine before production engine improvements.

This document is not external verification completion and does not approve final engine accuracy.

## Current Verification Status

| Item | Status | Note |
|---|---|---|
| Fortune engine sample snapshot quality review | Confirmed | completed in previous PR |
| Manseryeok external verification plan | Added | this document |
| Actual external reference comparison | Pending | not completed in this PR |
| 음력/윤달 샘플 외부 검증 | Pending | external reference check required |
| 태양시 보정 적용 여부 | Pending | policy decision required |
| Engine accuracy approval | Pending | not approved in this PR |
| Production engine logic change | Pending | not changed in this PR |

## Current Engine Basis

| Item | Status | Note |
|---|---|---|
| Manseryeok engine | Existing | src/domain/saju/manseryeokEngine.js |
| Engine version | Existing | manseryeok_core_v0 |
| Library basis | Existing | lunar-javascript |
| Snapshot file | Existing | docs/generated/fortune-engine-sample-snapshot.json |
| Snapshot dateKey | Existing | 2026-06-30 |
| Snapshot targetYear | Existing | 2026 |
| 태양시 보정 | Not applied | current engine note |
| 23시 이후 자시 기준 | Policy-based | same_day or next_day by user selection |

## External Verification Sample Matrix

| Sample ID | Verification Focus | Status |
|---|---|---|
| solar-known-time-01 | standard solar known-time pillars | Pending |
| solar-unknown-time-01 | birthTimeUnknown 시주 미상 handling | Pending |
| solar-late-night-same-day-01 | 23시 이후 자시 same_day policy | Pending |
| solar-late-night-next-day-01 | 23시 이후 자시 next_day policy | Pending |
| lunar-non-leap-01 | lunar non-leap conversion and pillars | Pending |
| lunar-leap-01 | 음력/윤달 샘플 외부 검증 | Pending |
| term-boundary-01 | 절기 경계 year/month pillar check | Pending |
| profile-zodiac-boundary-01 | 사주 연주 띠 and birth-year zodiac boundary | Pending |

## Verification Fields

| Field | Status | Note |
|---|---|---|
| convertedSolar | Pending | compare against external reference |
| convertedLunar | Pending | compare against external reference |
| year pillar | Pending | compare against external reference |
| month pillar | Pending | compare against external reference |
| day pillar | Pending | compare against external reference |
| hour pillar | Pending | compare against external reference when birth time is known |
| dayMaster | Pending | compare against day pillar stem |
| zodiac from year pillar | Pending | compare against year pillar branch |
| notes | Pending | confirm policy-sensitive notes remain visible |

## Verification Sources To Prepare

| Source Type | Status | Note |
|---|---|---|
| External manseryeok reference 1 | Pending | source not recorded in this PR |
| External manseryeok reference 2 | Pending | source not recorded in this PR |
| Manual comparison sheet | Pending | separate PR or manual record |
| Discrepancy log | Pending | separate PR if mismatches are found |

## Pass/Fail Criteria Draft

| Criteria | Status | Note |
|---|---|---|
| Solar known-time sample matches reference pillars | Pending | external comparison required |
| Lunar non-leap sample matches reference conversion and pillars | Pending | external comparison required |
| Lunar leap-month sample verified against reference | Pending | 음력/윤달 샘플 외부 검증 |
| Term-boundary sample reviewed with reference | Pending | 절기 기준 확인 필요 |
| Late-night same_day and next_day policies are separately documented | Pending | policy-sensitive comparison |
| 태양시 보정 적용 여부 is decided | Pending | separate policy decision |
| Engine accuracy approval | Pending | only after external comparison and discrepancy review |

## Discrepancy Handling Plan

| Case | Planned Handling |
|---|---|
| External reference differs only around 절기 경계 | record source, time, and policy difference |
| External reference differs for 윤달 conversion | block production accuracy approval until reviewed |
| External reference differs for 23시 이후 자시 | separate same_day and next_day policy review |
| External reference assumes 태양시 보정 | record as 태양시 보정 policy difference |
| Current engine fallback occurs | record fallback reason and block accuracy approval for that sample |

## Guardrails

- This PR defines the manseryeok external verification plan only.
- This PR is not external verification completion.
- This PR is not final engine accuracy approval.
- Actual external reference comparison remains Pending.
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

- Production manseryeok calculation change
- Production fortune engine change
- Actual external reference comparison completion
- 음력/윤달 샘플 외부 검증 completion
- 태양시 보정 policy decision
- Engine accuracy approval
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
2. Compare all eight sample outputs against the references.
3. Record mismatches in a separate discrepancy log.
4. Decide 태양시 보정 적용 여부 in a separate policy PR.
5. Only then design production manseryeok or interpretation improvements.
