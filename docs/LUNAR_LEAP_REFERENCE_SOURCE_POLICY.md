# Lunar Leap Reference Source Policy

## Current Status

- Current status: Pending
- Reference source selection: Pending
- 음력/윤달 샘플 외부 검증: Pending
- Actual external verification: Pending
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

This document defines the selection criteria for the external reference source used by docs/LUNAR_LEAP_EXTERNAL_VERIFICATION_CHECKLIST.md. It does not finalize a source and does not record any sample result.

## Purpose

- Define how to select a reliable external reference source before 음력/윤달 샘플 외부 검증
- Prevent recording unverifiable sample results
- Keep production calculation unchanged before external verification
- Prepare a safe follow-up path for actual sample result recording
- Keep 태양시 보정 적용 여부 separate and Pending

## Source Selection Criteria

| Area | Criteria | Status | Notes |
|---|---|---|---|
| Reliability | Source should provide stable lunar/leap month conversion reference | Pending | Source not finalized |
| Reproducibility | Same input should produce repeatable result | Pending | No sample result recorded |
| Coverage | Source should support lunar date and leap month cases | Pending | No coverage confirmed |
| Boundary cases | Source should help review month-boundary cases | Pending | No boundary sample recorded |
| Late-night cases | Source should help review late-night birth time cases if needed | Pending | No calculation change |
| Documentation | Source name/version/access date should be recordable | Pending | No source selected |
| Independence | Source should be external to current app implementation | Pending | No external value recorded |
| Solar time separation | Source selection should keep 태양시 보정 적용 여부 separate | Pending | No solar time correction |
| Privacy/security | Source usage should not require uploading user personal data | Pending | No external API integration |

## Do Not Record Yet

- Do not record selected external source as finalized
- Do not record actual external verification result
- Do not record sample expected values
- Do not record sample comparison result
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
- Future PR: record lunar sample verification result
- Future PR: record leap month sample verification result
- Future PR: record boundary sample verification result
- Future PR: prepare calculation regression baseline before any implementation
- Future PR: Android QA after any future calculation logic change
