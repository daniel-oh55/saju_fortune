# Fortune Engine Sample Snapshot Readiness

## Fortune Engine Sample Snapshot Result

- Fortune engine sample snapshot result: Added
- Actual output snapshot generation: Confirmed
- Snapshot runner script: Added
- Snapshot check script: Added
- Production engine logic change: Pending
- Engine accuracy approval: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending

## Purpose

This document prepares the snapshot generation process for the 하루풀이 fortune engine sample QA baseline before production engine improvements.

This document is not a production logic change and does not approve final engine accuracy.

## Current Readiness Status

| Item | Status | Note |
|---|---|---|
| Fortune engine current state audit | Confirmed | completed in previous PR |
| Fortune engine sample QA baseline | Confirmed | completed in previous PR |
| Sample profile matrix | Confirmed | defined in baseline document |
| Sample output snapshot readiness | Added | this document |
| Actual output snapshot generation | Pending | separate run or generated file required |
| Production engine logic change | Pending | not changed in this PR |
| Engine accuracy approval | Pending | not approved in this PR |
| 음력/윤달 샘플 외부 검증 | Pending | separate verification required |
| 태양시 보정 적용 여부 | Pending | separate policy decision required |

## Snapshot Target Areas

| Area | Snapshot Target | Status |
|---|---|---|
| Today fortune | createTodayFortune sample output | Pending |
| Saju analysis | createSajuAnalysis sample output | Pending |
| Manseryeok | calculateManseryeok sample output | Pending |
| Year fortune | createYearFortune 2026 sample output | Pending |
| Zodiac fortune | createZodiacFortune sample output | Pending |

## Snapshot Sample IDs

| Sample ID | Purpose |
|---|---|
| solar-known-time-01 | standard solar known-time sample |
| solar-unknown-time-01 | birthTimeUnknown 시주 미상 sample |
| solar-late-night-same-day-01 | 23시 이후 자시 same-day policy sample |
| solar-late-night-next-day-01 | 23시 이후 자시 next-day policy sample |
| lunar-non-leap-01 | 음력 일반 월 sample |
| lunar-leap-01 | 음력/윤달 샘플 외부 검증 대상 |
| term-boundary-01 | 절기 경계 sample |
| profile-zodiac-boundary-01 | 사주 연주 띠와 일반 출생연도 띠 차이 검토 sample |

## Snapshot Output Requirements

| Requirement | Status |
|---|---|
| Snapshot should include sampleId | Pending |
| Snapshot should include profile input summary | Pending |
| Snapshot should include today fortune shape summary | Pending |
| Snapshot should include saju analysis shape summary | Pending |
| Snapshot should include manseryeok status summary | Pending |
| Snapshot should include year/monthly fortune shape summary | Pending |
| Snapshot should include zodiac fortune shape summary | Pending |
| Snapshot should avoid storing private user data | Pending |
| Snapshot should avoid secrets or signing data | Pending |
| Snapshot should be deterministic for a fixed dateKey | Pending |

## Proposed Fixed Snapshot Date

| Item | Value |
|---|---|
| dateKey | 2026-06-30 |
| targetYear | 2026 |

## Snapshot Safety Rules

- Snapshot data must use only artificial sample profiles.
- Snapshot data must not include real user information.
- Snapshot data must not include GitHub Secret values.
- Snapshot data must not include signing passwords, keystore paths, key aliases, or keystore base64.
- Snapshot data must not include `.aab`, `.zip`, `.jks`, or `.keystore` artifacts.
- Snapshot generation must not change production engine logic.
- Snapshot generation must not change CURRENT_FORTUNE_SCHEMA_VERSION.
- Snapshot generation must not change schemaVersion.
- Snapshot generation must not change existing localStorage keys.

## Guardrails

- This PR prepares sample snapshot generation only.
- This PR is not a production logic change.
- This PR is not final engine accuracy approval.
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
- External manseryeok verification completion
- Engine accuracy approval
- schemaVersion change
- localStorage key change
- UI/design change
- Android native change
- Play Console input
- AAB upload
- Real device QA

## Recommended Next Steps

1. Add or run sample output snapshot script.
2. Record current sample outputs.
3. Compare snapshot outputs before and after future production engine changes.
4. Expand manseryeok external sample verification.
5. Design saju interpretation layer improvements.
