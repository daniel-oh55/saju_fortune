# Calculation Regression Baseline Snapshot Design

## Current Status

- Current status: Pending
- Baseline snapshot design: Documented
- Baseline snapshot generation: Not started
- Baseline snapshot files: Not created
- Baseline result recording: Not started
- Candidate snapshot path: Not finalized
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

This document defines the candidate structure for a future calculation regression baseline snapshot, to be generated before any production calculation change driven by 음력/윤달 샘플 외부 검증 or a 태양시 보정 적용 여부 decision. It does not generate any snapshot file and does not finalize the snapshot path.

## Purpose

- Define how future calculation regression baseline snapshots should be structured
- Prevent ad-hoc snapshot generation before design agreement
- Keep current MVP calculation behavior unchanged
- Prepare a safe path for future before/after calculation comparison
- Keep 음력/윤달 샘플 외부 검증 and 태양시 보정 적용 여부 separate and Pending

## Candidate Snapshot Structure

| Area | Candidate item | Status | Notes |
|---|---|---|---|
| Location | Candidate snapshot directory | Pending | Do not create directory in this PR |
| Naming | Candidate filename convention | Pending | Do not create snapshot file in this PR |
| Metadata | App version/build metadata field | Pending | No value recorded |
| Metadata | Schema version field | Pending | Do not change schemaVersion |
| Sample | LUNAR-001 baseline block | Pending | No result recorded |
| Sample | LEAP-001 baseline block | Pending | No result recorded |
| Sample | BOUNDARY-001 baseline block | Pending | No result recorded |
| Sample | BOUNDARY-002 baseline block | Pending | No result recorded |
| Sample | LATE-NIGHT-001 baseline block | Pending | No result recorded |
| Sample | SOLAR-TIME-001 baseline block | Pending | 태양시 보정 적용 여부 remains Pending |
| Sample | REGRESSION-001 baseline block | Pending | No result recorded |
| Comparison | Before/after comparison field | Pending | No comparison result recorded |
| QA | Android QA follow-up field | Pending | No APK QA required in this PR |

## Candidate JSON Shape

```json
{
  "status": "not_started",
  "snapshotType": "calculation-regression-baseline",
  "snapshotVersion": "candidate-only",
  "generatedAt": "not_recorded",
  "appBuild": "not_recorded",
  "schemaVersion": "unchanged",
  "samples": [
    {
      "sampleId": "LUNAR-001",
      "category": "representative-lunar-birth-sample",
      "input": "not_recorded",
      "currentOutput": "not_recorded",
      "comparisonResult": "not_recorded",
      "status": "pending"
    }
  ]
}
```

This shape is documented as a candidate reference only. No file matching this shape is created in this PR.

## Do Not Record Yet

- Do not generate baseline snapshot files
- Do not finalize candidate snapshot path
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

- Future PR: finalize candidate snapshot path
- Future PR: generate calculation regression baseline snapshot
- Future PR: record LUNAR-001 baseline result
- Future PR: record LEAP-001 baseline result
- Future PR: record BOUNDARY-001 and BOUNDARY-002 baseline result
- Future PR: compare external verification result with baseline
- Future PR: Android QA after any future calculation logic change
