# Lunar Leap External Verification Checklist

## Current Status

- Current status: Pending
- 음력/윤달 샘플 외부 검증: Pending
- Actual external verification: Pending
- Current production calculation: unchanged
- Lunar/leap sample result recording: Not completed
- Solar time correction implementation: Not implemented
- 태양시 보정 적용 여부: Pending
- No production fortune logic changes
- No generated JSON changes
- No schemaVersion change
- No localStorage key change
- No external API
- No Android QA required in this PR

This document adds the follow-up checklist for 음력/윤달 샘플 외부 검증 referenced by docs/SOLAR_TIME_CORRECTION_POLICY.md and docs/SOLAR_TIME_EXTERNAL_VERIFICATION_CHECKLIST.md. It does not perform any external verification and does not change production calculation behavior.

## Purpose

- Define what must be checked before recording 음력/윤달 샘플 외부 검증 result
- Prevent accidental production calculation changes before external verification
- Prepare a safe follow-up path for sample collection and result recording
- Keep current MVP calculation behavior unchanged
- Keep 태양시 보정 적용 여부 separate and Pending

## Verification Checklist

| Area | Check item | Status | Notes |
|---|---|---|---|
| Scope | Confirm sample verification scope | Pending | No result recorded in this PR |
| External source | Select external reference source | Pending | Source not finalized |
| Lunar sample | Prepare representative lunar birth sample | Pending | No sample value recorded |
| Leap month sample | Prepare representative leap month sample | Pending | No sample value recorded |
| Boundary sample | Prepare month-boundary sample | Pending | No sample value recorded |
| Late-night sample | Review late-night birth time sample need | Pending | No calculation change |
| Solar time | Confirm 태양시 보정 적용 여부 remains separate | Pending | No solar time correction |
| Regression | Prepare calculation regression baseline before implementation | Pending | No generated JSON change |
| Android QA | Prepare Android QA plan after future calculation change | Pending | No APK QA required in this PR |

## Do Not Record Yet

- Do not record actual external verification result
- Do not record sample expected values
- Do not change production calculation logic
- Do not change fortune result generation
- Do not change generated JSON
- Do not change schemaVersion
- Do not change existing localStorage keys
- Do not add external API
- Do not add timezone conversion
- Do not add solar time correction calculation

## Follow-up PRs

- Future PR: select external reference source for 음력/윤달 샘플 외부 검증
- Future PR: record lunar sample verification result
- Future PR: record leap month sample verification result
- Future PR: record boundary sample verification result
- Future PR: prepare calculation regression baseline before any implementation
- Future PR: Android QA after any future calculation logic change
