# Zodiac After Snapshot Comparison

## Purpose

This document records the zodiac after-improvement snapshot generation and before/after comparison result.

This PR does not change production engine logic. It generates review artifacts from the current production zodiac engine after the first scoped zodiac improvement and wording fix.

## Current Status

| Item | Status | Note |
|---|---|---|
| Zodiac fortune engine improvement | Implemented in first scope | completed in previous PR |
| Zodiac money focus wording fix | Applied | completed in previous PR |
| Zodiac after snapshot generation | Generated | this PR |
| Snapshot comparison for zodiac improvement | Generated | this PR |
| Zodiac output quality review | Pending | separate follow-up |
| Engine accuracy approval | Pending | not approved in this PR |
| External reference comparison | Pending | not completed |
| 음력/윤달 샘플 외부 검증 | Pending | external verification still required |
| 태양시 보정 적용 여부 | Pending | policy decision still required |
| Today fortune first production improvement | Reviewed | separate completed track |
| Year/monthly fortune first production improvement | Reviewed | separate completed track |

## Snapshot Files

| File | Role | Status |
|---|---|---|
| docs/generated/fortune-engine-sample-snapshot-after-year-monthly-improvement.json | practical baseline before zodiac improvement | Existing |
| docs/generated/fortune-engine-sample-snapshot-after-zodiac-improvement.json | zodiac after-improvement snapshot | Generated |
| docs/generated/zodiac-fortune-snapshot-comparison-result.json | zodiac before/after comparison result | Generated |

## Comparison Summary

| Check | Status | Note |
|---|---|---|
| Sample count preserved | Confirmed | 8 samples |
| Sample IDs preserved | Confirmed | same sample IDs as practical baseline |
| Today fortune output unchanged | Confirmed | no today fortune output drift |
| Year/monthly fortune output unchanged | Confirmed | no year/monthly output drift |
| Manseryeok output unchanged | Confirmed | no manseryeok output drift |
| Saju analysis output unchanged | Confirmed | no saju analysis output drift |
| Zodiac fortune output reviewed for changes | Generated | quality review Pending |
| Zodiac category IDs preserved | Confirmed | overall, money, relationship, work, health |
| selectedYear preserved | Confirmed | same selectedYear as practical baseline |
| selectedAnimal preserved | Confirmed | same selectedAnimal as practical baseline |
| Engine accuracy approval | Pending | remains separate |

## Guardrails

- This PR does not change production engine logic.
- This PR does not change today fortune output logic.
- This PR does not change year/monthly fortune output logic.
- This PR does not change manseryeok calculation.
- This PR does not change saju analysis logic.
- This PR does not change routing.
- This PR does not change UI/design.
- This PR does not change CURRENT_FORTUNE_SCHEMA_VERSION.
- This PR does not change schemaVersion.
- This PR does not change existing localStorage keys.
- Existing baseline snapshot JSON is not regenerated.
- Today after snapshot JSON is not regenerated.
- Today comparison result JSON is not regenerated.
- Year/monthly after snapshot JSON is not regenerated.
- Year/monthly comparison result JSON is not regenerated.
- public/privacy-policy.html is not changed.
- AndroidManifest.xml, Android resource files, and Gradle settings are not changed.
- `.aab`, `.zip`, `.jks`, and `.keystore` files are not added to the repository.
- GitHub Secret actual values are not recorded.
- Engine accuracy approval remains Pending.
- External reference comparison remains Pending.
- 음력/윤달 샘플 외부 검증 remains Pending.
- 태양시 보정 적용 여부 remains Pending.

## Recommended Next Steps

1. Review zodiac output quality using the generated comparison result.
2. Keep engine accuracy approval Pending until external verification is completed.
3. Keep external reference comparison, lunar/leap verification, and solar time policy work in separate PRs.
