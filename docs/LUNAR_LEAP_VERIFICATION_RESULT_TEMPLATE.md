# Lunar Leap Verification Result Template

## Current Status

- Current status: Pending
- Result template: Prepared
- 음력/윤달 샘플 외부 검증: Pending
- Reference source selection: Pending
- Actual external verification: Pending
- Source name: Not recorded
- Source version: Not recorded
- Source access date: Not recorded
- Sample dates: Not recorded
- Sample expected values: Not recorded
- Sample actual values: Not recorded
- Sample comparison result: Not recorded
- Current production calculation: unchanged
- 태양시 보정 적용 여부: Pending
- Solar time correction implementation: Not implemented
- No production fortune logic changes
- No generated JSON changes
- No schemaVersion change
- No localStorage key change
- No external API
- No Android QA required in this PR

This document defines the result recording template to use once docs/LUNAR_LEAP_REFERENCE_SOURCE_POLICY.md's external reference source is finalized and 음력/윤달 샘플 외부 검증 is actually performed. It does not record any actual source metadata, sample date, expected value, actual value, or comparison result.

## Purpose

- Define a safe recording template for future 음력/윤달 샘플 외부 검증 results
- Prevent mixing actual verification values into planning PRs
- Keep production calculation unchanged before external verification
- Preserve the sample IDs defined in docs/LUNAR_LEAP_SAMPLE_CASE_PLAN.md
- Keep 태양시 보정 적용 여부 separate and Pending

## Source Record Template

| Field | Status | Value |
|---|---|---|
| Source name | Pending | Not recorded |
| Source version | Pending | Not recorded |
| Source access date | Pending | Not recorded |
| Source method | Pending | Not recorded |
| Source independence review | Pending | Not recorded |
| Privacy/security review | Pending | Not recorded |

## Sample Result Template

| Sample ID | Category | Source expected value | App current value | Comparison result | Status | Notes |
|---|---|---|---|---|---|---|
| LUNAR-001 | Representative lunar birth sample | Not recorded | Not recorded | Not recorded | Pending | No date or value recorded |
| LEAP-001 | Representative leap month sample | Not recorded | Not recorded | Not recorded | Pending | No date or value recorded |
| BOUNDARY-001 | Month-boundary sample | Not recorded | Not recorded | Not recorded | Pending | No date or value recorded |
| BOUNDARY-002 | Year-boundary sample | Not recorded | Not recorded | Not recorded | Pending | No date or value recorded |
| LATE-NIGHT-001 | Late-night birth time sample | Not recorded | Not recorded | Not recorded | Pending | No calculation change |
| SOLAR-TIME-001 | Solar time separation sample | Not recorded | Not recorded | Not recorded | Pending | 태양시 보정 적용 여부 remains separate |
| REGRESSION-001 | Regression baseline sample | Not recorded | Not recorded | Not recorded | Pending | No generated JSON change |
| ANDROID-QA-001 | Android QA sample | Not recorded | Not recorded | Not recorded | Pending | No APK QA required in this PR |

## Do Not Record Yet

- Do not record actual sample dates
- Do not record source name, URL, version, or access date
- Do not record actual external verification result
- Do not record sample expected values
- Do not record app current values
- Do not record sample comparison result
- Do not finalize external reference source
- Do not change production calculation logic
- Do not change fortune result generation
- Do not change generated JSON
- Do not change schemaVersion
- Do not change existing localStorage keys
- Do not add external API
- Do not add timezone conversion
- Do not add solar time correction calculation

## Follow-up PRs

- Future PR: finalize external reference source for 음력/윤달 샘플 외부 검증
- Future PR: record source name/version/access date
- Future PR: record LUNAR-001 verification result
- Future PR: record LEAP-001 verification result
- Future PR: record BOUNDARY-001 and BOUNDARY-002 verification result
- Future PR: decide whether LATE-NIGHT-001 requires separate policy
- Future PR: prepare calculation regression baseline before any implementation
- Future PR: Android QA after any future calculation logic change
