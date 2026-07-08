# Lunar Leap Sample Case Plan

## Current Status

- Current status: Pending
- Sample case planning: Pending
- 음력/윤달 샘플 외부 검증: Pending
- Reference source selection: Pending
- Actual external verification: Pending
- Sample dates: Not recorded
- Sample expected values: Not recorded
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

This document defines the sample case categories to prepare before docs/LUNAR_LEAP_REFERENCE_SOURCE_POLICY.md's external reference source is finalized and 음력/윤달 샘플 외부 검증 results are recorded. It does not record any sample date, expected value, or comparison result.

## Purpose

- Define sample categories needed before 음력/윤달 샘플 외부 검증
- Prevent recording sample dates or expected values before source finalization
- Keep production calculation unchanged before external verification
- Prepare a safe follow-up path for actual sample result recording
- Keep 태양시 보정 적용 여부 separate and Pending

## Sample Case Plan

| Sample ID | Category | Purpose | Status | Notes |
|---|---|---|---|---|
| LUNAR-001 | Representative lunar birth sample | Confirm ordinary lunar date conversion behavior | Pending | No date or expected value recorded |
| LEAP-001 | Representative leap month sample | Confirm leap month handling behavior | Pending | No date or expected value recorded |
| BOUNDARY-001 | Month-boundary sample | Review conversion behavior near lunar month boundary | Pending | No date or expected value recorded |
| BOUNDARY-002 | Year-boundary sample | Review conversion behavior near lunar year boundary | Pending | No date or expected value recorded |
| LATE-NIGHT-001 | Late-night birth time sample | Review whether late-night handling needs separate validation | Pending | No calculation change |
| SOLAR-TIME-001 | Solar time separation sample | Confirm 태양시 보정 적용 여부 remains separate | Pending | No solar time correction |
| REGRESSION-001 | Regression baseline sample | Prepare future before/after calculation comparison | Pending | No generated JSON change |
| ANDROID-QA-001 | Android QA sample | Prepare QA plan after any future calculation logic change | Pending | No APK QA required in this PR |

## Do Not Record Yet

- Do not record actual sample dates
- Do not record actual external verification result
- Do not record sample expected values
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
- Future PR: record LUNAR-001 verification result
- Future PR: record LEAP-001 verification result
- Future PR: record BOUNDARY-001 and BOUNDARY-002 verification result
- Future PR: decide whether LATE-NIGHT-001 requires separate policy
- Future PR: prepare calculation regression baseline before any implementation
- Future PR: Android QA after any future calculation logic change
