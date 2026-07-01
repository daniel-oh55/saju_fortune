# Manseryeok External Reference Candidates

## Purpose

This document records external reference candidates for the 하루풀이 manseryeok verification process.

This document is not actual external comparison completion, manual comparison sheet completion, or final engine accuracy approval.

## Current Status

| Item | Status | Note |
|---|---|---|
| Manseryeok external verification plan | Confirmed | completed in previous PR |
| Manseryeok external comparison template | Confirmed | completed in previous PR |
| Manseryeok external reference selection criteria | Confirmed | completed in previous PR |
| Manseryeok external reference candidates | Added | this document |
| External manseryeok reference selection | Candidate recorded | not final verification completion |
| Actual external reference comparison | Pending | not completed in this PR |
| Manual comparison sheet completion | Pending | not completed in this PR |
| Discrepancy log | Pending | not created in this PR |
| 음력/윤달 샘플 외부 검증 | Pending | external reference comparison still required |
| 태양시 보정 적용 여부 | Pending | policy decision required |
| Engine accuracy approval | Pending | not approved in this PR |
| Production engine logic change | Pending | not changed in this PR |

## Candidate References

| Slot | Candidate Status | Source Name | URL/Citation | Access Date | Planned Role |
|---|---|---|---|---|---|
| External reference 1 | Candidate recorded | 한국천문연구원 천문우주지식정보 생활천문관 | https://astro.kasi.re.kr/life/pageView/5 | 2026-07-01 | solar-lunar conversion and ganji/monthly calendar reference |
| External reference 2 | Pending selection | Pending | Pending | Pending | independent manseryeok pillar comparison source |
| Optional reference 3 | Pending selection | Pending | Pending | Pending | discrepancy review support |

## Candidate 1 Notes

| Field | Status | Note |
|---|---|---|
| Source type | Candidate recorded | public astronomy/calendar information source |
| Solar-lunar conversion support | Candidate recorded | supports 양력/음력 reference usage |
| Ganji calendar support | Candidate recorded | monthly table can include 음력간지 |
| Timezone / 기준시 policy | Pending review | record manually during comparison |
| 태양시 보정 policy | Pending review | not decided by this PR |
| 23시 이후 자시 policy | Pending review | not decided by this PR |
| 음력/윤달 handling | Pending review | verify manually during comparison |

## Candidate 2 Selection Requirements

| Requirement | Status | Note |
|---|---|---|
| Independent manseryeok calculator source | Pending | select in a later step |
| Provides year/month/day/hour pillars | Pending | required for pillar comparison |
| Discloses timezone or 기준시 if possible | Pending | required for policy-sensitive review |
| Discloses 태양시 보정 policy if possible | Pending | required for policy difference classification |
| Discloses 23시 이후 자시 policy if possible | Pending | required for same_day/next_day comparison |
| Supports 음력/윤달 input or conversion if possible | Pending | useful for 음력/윤달 샘플 외부 검증 |

## Verification Still Required

| Item | Status | Note |
|---|---|---|
| External reference 2 selection | Pending | required before full comparison |
| Actual external reference comparison | Pending | not completed |
| Manual comparison sheet completion | Pending | not completed |
| Discrepancy log | Pending | not created |
| 음력/윤달 샘플 외부 검증 | Pending | not completed |
| 태양시 보정 적용 여부 | Pending | not decided |
| Engine accuracy approval | Pending | not approved |

## Guardrails

- This PR records external reference candidates only.
- This PR is not actual external comparison completion.
- This PR is not manual comparison sheet completion.
- This PR is not final engine accuracy approval.
- External reference 2 selection remains Pending.
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

- Full external reference selection completion
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

1. Select External reference 2 as an independent manseryeok pillar comparison source.
2. Record External reference 2 name, URL/citation, access date, and known policy notes.
3. Fill the manual comparison template.
4. Record mismatches in a discrepancy log.
5. Decide 태양시 보정 적용 여부 in a separate policy PR.
