# Manseryeok External Reference Selection Criteria

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

## Purpose

This document defines criteria for selecting external references for the 하루풀이 manseryeok verification process.

This document is not external reference selection completion, actual external comparison completion, or final engine accuracy approval.

## Current Status

| Item | Status | Note |
|---|---|---|
| Manseryeok external verification plan | Confirmed | completed in previous PR |
| Manseryeok external comparison template | Confirmed | completed in previous PR |
| Manseryeok external reference selection criteria | Added | this document |
| External manseryeok reference selection | Pending | not selected in this PR |
| Actual external reference comparison | Pending | not completed in this PR |
| Manual comparison sheet completion | Pending | not completed in this PR |
| Discrepancy log | Pending | not created in this PR |
| 음력/윤달 샘플 외부 검증 | Pending | external reference check required |
| 태양시 보정 적용 여부 | Pending | policy decision required |
| Engine accuracy approval | Pending | not approved in this PR |
| Production engine logic change | Pending | not changed in this PR |

## Reference Selection Requirements

| Requirement | Status | Note |
|---|---|---|
| Reference should provide solar-lunar conversion | Pending | needed for convertedSolar/convertedLunar checks |
| Reference should provide year/month/day/hour pillars | Pending | needed for pillar comparison |
| Reference should disclose timezone or 기준점 | Pending | needed for policy-sensitive checks |
| Reference should disclose 23시 이후 자시 policy if possible | Pending | needed for same_day/next_day comparison |
| Reference should disclose 태양시 보정 policy if possible | Pending | needed for policy difference classification |
| Reference should support 음력/윤달 input or conversion | Pending | needed for 음력/윤달 샘플 외부 검증 |
| Reference should support 절기 경계 samples | Pending | needed for term-boundary review |
| Reference should be reproducible by manual access | Pending | needed for future review |

## Preferred Reference Types

| Reference Type | Selection Status | Note |
|---|---|---|
| Public institution calendar/conversion source | Pending | useful for solar-lunar conversion baseline |
| Independent manseryeok calculator source | Pending | useful for pillar comparison |
| Second independent manseryeok calculator source | Pending | useful for cross-checking discrepancies |
| Library or algorithm documentation | Pending | useful for policy explanation only, not sole verification source |

## Reference Candidate Slots

| Slot | Status | Source Name | URL/Citation | Access Date | Role |
|---|---|---|---|---|---|
| External reference 1 | Pending | Pending | Pending | Pending | primary comparison source |
| External reference 2 | Pending | Pending | Pending | Pending | secondary comparison source |
| Optional reference 3 | Pending | Pending | Pending | Pending | discrepancy review support |

## Policy Fields To Record Per Reference

| Policy Field | Status | Note |
|---|---|---|
| Timezone / 기준점 | Pending | required before comparison |
| 태양시 보정 policy | Pending | record whether applied, not applied, or unknown |
| 23시 이후 자시 policy | Pending | record same_day, next_day, or unknown |
| 절기 기준 | Pending | record source explanation if available |
| 음력/윤달 handling | Pending | record source explanation if available |

## Selection Pass/Fail Criteria

| Criteria | Status | Note |
|---|---|---|
| At least two references selected | Pending | required before actual comparison |
| At least one source can verify solar-lunar conversion | Pending | required before 음력/윤달 comparison |
| At least one source can verify pillars | Pending | required before pillar comparison |
| Source policies are recorded | Pending | needed before mismatch classification |
| Source limitations are documented | Pending | needed before engine accuracy approval |
| Engine accuracy approval | Pending | not allowed at selection stage |

## Guardrails

- This PR defines reference selection criteria only.
- This PR is not external reference selection completion.
- This PR is not actual external comparison completion.
- This PR is not final engine accuracy approval.
- External manseryeok reference selection remains Pending.
- Actual external reference comparison remains Pending.
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

- External reference selection completion
- Actual external reference comparison completion
- Manual comparison sheet completion
- Discrepancy log completion
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

1. Select at least two external references using this criteria document.
2. Record selected reference names, access dates, and known policies in a separate PR.
3. Fill the manual comparison template.
4. Record mismatches in a discrepancy log.
5. Decide 태양시 보정 적용 여부 in a separate policy PR.
