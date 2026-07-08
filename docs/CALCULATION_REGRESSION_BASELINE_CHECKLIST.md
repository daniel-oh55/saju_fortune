# Calculation Regression Baseline Checklist

## Current Status

- Current status: Pending
- Calculation regression baseline: Pending
- Baseline snapshot generation: Not started
- Baseline result recording: Not started
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Current production calculation: unchanged
- Solar time correction implementation: Not implemented
- No production fortune logic changes
- No generated JSON changes
- No docs/generated changes
- No schemaVersion change
- No localStorage key change
- No external API
- No Android QA required in this PR

This document defines what must be baselined before any future production calculation change, including changes driven by 음력/윤달 샘플 외부 검증 or a 태양시 보정 적용 여부 decision. It does not generate any baseline snapshot or record any baseline result.

## Purpose

- Define what must be baselined before any future production calculation change
- Prevent accidental calculation changes without before/after comparison
- Keep current MVP calculation behavior unchanged
- Prepare a safe path for future 음력/윤달 샘플 외부 검증 result recording
- Keep 태양시 보정 적용 여부 separate and Pending

## Baseline Checklist

| Area | Baseline item | Status | Notes |
|---|---|---|---|
| Current behavior | Record current production calculation behavior summary | Pending | No result recorded in this PR |
| Lunar sample | Prepare baseline for LUNAR-001 | Pending | No generated JSON change |
| Leap sample | Prepare baseline for LEAP-001 | Pending | No generated JSON change |
| Boundary sample | Prepare baseline for BOUNDARY-001 | Pending | No generated JSON change |
| Boundary sample | Prepare baseline for BOUNDARY-002 | Pending | No generated JSON change |
| Late-night sample | Prepare baseline for LATE-NIGHT-001 | Pending | No calculation change |
| Solar time sample | Prepare baseline for SOLAR-TIME-001 | Pending | 태양시 보정 적용 여부 remains Pending |
| Regression sample | Prepare baseline for REGRESSION-001 | Pending | No generated JSON change |
| Android QA | Prepare Android QA baseline plan | Pending | No APK QA required in this PR |
| Backward compatibility | Review saved profile compatibility baseline | Pending | Existing localStorage key unchanged |

## Do Not Record Yet

- Do not generate baseline snapshot files
- Do not record baseline results
- Do not record sample expected values
- Do not record app current values
- Do not record sample comparison result
- Do not finalize external reference source
- Do not complete 음력/윤달 샘플 외부 검증
- Do not decide 태양시 보정 적용 여부
- Do not change production calculation logic
- Do not change fortune result generation
- Do not change generated JSON
- Do not change docs/generated
- Do not change schemaVersion
- Do not change existing localStorage keys
- Do not add external API
- Do not add timezone conversion
- Do not add solar time correction calculation

## Follow-up PRs

- Future PR: finalize external reference source for 음력/윤달 샘플 외부 검증
- Future PR: generate calculation regression baseline snapshot
- Future PR: record LUNAR-001 baseline result
- Future PR: record LEAP-001 baseline result
- Future PR: record BOUNDARY-001 and BOUNDARY-002 baseline result
- Future PR: compare external verification result with baseline
- Future PR: Android QA after any future calculation logic change
