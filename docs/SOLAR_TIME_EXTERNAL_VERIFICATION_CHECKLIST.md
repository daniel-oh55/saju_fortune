# Solar Time External Verification Checklist

## Current Status

- Current status: Pending
- 태양시 보정 적용 여부 external review: Pending
- Actual external verification: Pending
- Current production calculation: unchanged
- Solar time correction implementation: Not implemented
- Birth region values remain profile/input UX data only
- No timezone conversion
- No longitude/latitude handling
- No geocoding API
- No external API
- No region-to-longitude dataset
- No generated JSON changes

This document adds the follow-up external verification checklist referenced by docs/SOLAR_TIME_CORRECTION_POLICY.md. It does not perform any external verification and does not change production calculation behavior.

## Purpose

- Determine whether 태양시 보정 적용 여부 should remain disabled for MVP
- Identify what external references are needed before any calculation logic change
- Prevent accidental production calculation changes before verification
- Preserve backward compatibility with existing saved profiles
- Prepare a safe path for future Option B/C review from PR #297

## Verification Checklist

| Area | Check item | Status | Notes |
|---|---|---|---|
| Policy | Confirm current MVP keeps Option A | Pending | No calculation change |
| External review | 태양시 보정 적용 여부 external review | Pending | Requires reviewer/source |
| Data source | Region-to-longitude data source review | Pending | No dataset added |
| Domestic samples | Domestic sample date/time validation | Pending | No sample result recorded |
| Overseas samples | Overseas timezone/longitude policy review | Pending | No timezone conversion |
| Backward compatibility | Saved profile compatibility review | Pending | Existing localStorage key unchanged |
| QA | Android QA plan after future calculation change | Pending | No APK QA required in this PR |
| Regression | Calculation regression baseline before implementation | Pending | No generated JSON change |
| Lunar/leap | 음력/윤달 샘플 외부 검증 | Pending | Separate follow-up PR |

## Do Not Implement Before Verification

- Do not add solar time correction calculation
- Do not use birth region values in production calculation
- Do not add timezone conversion
- Do not add longitude/latitude handling
- Do not add geocoding API
- Do not add external city DB
- Do not change schemaVersion
- Do not change existing localStorage keys
- Do not change generated JSON
- Do not change production fortune result generation

## Follow-up PRs

- Future PR: record 태양시 보정 적용 여부 external review result
- Future PR: document region-to-longitude data source policy
- Future PR: record domestic sample validation result
- Future PR: record overseas timezone/longitude policy
- Future PR: complete 음력/윤달 샘플 외부 검증
- Future PR: calculation regression baseline before any implementation
