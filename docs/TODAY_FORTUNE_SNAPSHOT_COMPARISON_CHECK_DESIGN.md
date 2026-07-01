# Today Fortune Snapshot Comparison Check Design

## Today Fortune After Snapshot Comparison

- After snapshot generation: Generated
- Snapshot comparison after implementation: Generated
- Output quality review after implementation: Pending
- Engine accuracy approval: Pending
- Production today fortune engine improvement: Implemented in first scope
- CURRENT_FORTUNE_SCHEMA_VERSION decision: Incremented for cache refresh
- Year/monthly fortune engine improvement: Pending
- Zodiac fortune engine improvement: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending

## Today Fortune First Production Scope

- Today fortune first production scope: Added
- Production today fortune engine improvement: Pending
- Production engine logic change: Pending
- CURRENT_FORTUNE_SCHEMA_VERSION decision: Proposed
- Snapshot comparison after implementation: Pending
- Engine accuracy approval: Pending

## Purpose

This document defines the comparison check design for reviewing before/after today fortune engine output changes.

This document is not a production logic change and does not approve final engine accuracy.

## Current Status

| Item | Status | Note |
|---|---|---|
| Today fortune engine improvement design | Confirmed | completed in previous PR |
| Today fortune engine implementation plan | Confirmed | completed in previous PR |
| Today fortune snapshot comparison check design | Added | this document |
| Before/after snapshot comparison check | Pending | not implemented in this PR |
| Production today fortune engine improvement | Pending | not implemented in this PR |
| Production engine logic change | Pending | not changed in this PR |
| Snapshot comparison after implementation | Pending | separate PR after implementation |
| CURRENT_FORTUNE_SCHEMA_VERSION decision | Pending | decide in implementation PR |
| Engine accuracy approval | Pending | not approved in this PR |

## Comparison Targets

| Area | Must Compare | Status |
|---|---|---|
| snapshotVersion | unchanged or intentionally documented | Pending |
| dateKey | fixed 2026-06-30 | Pending |
| targetYear | fixed 2026 | Pending |
| sample count | 8 samples preserved | Pending |
| sample IDs | all existing sample IDs preserved | Pending |
| todayFortuneSummary categoryIds | overall, money, love, work, study, health preserved | Pending |
| todayFortuneSummary categoryScores | compare before/after score movement | Pending |
| todayFortuneSummary categorySummaries | compare wording quality and category relevance | Pending |
| sajuAnalysisSummary | shape preserved | Pending |
| manseryeokSummary | shape preserved | Pending |
| yearFortuneSummary | no unintended change | Pending |
| zodiacFortuneSummary | no unintended change | Pending |

## Allowed Difference Policy

| Difference Type | Allowed? | Note |
|---|---|---|
| today fortune score movement | Allowed with review | expected after scoring improvement |
| today fortune summary/detail wording | Allowed with review | expected after text improvement |
| category ids changed | Not allowed | required output shape must be preserved |
| sample count changed | Not allowed | baseline sample matrix must be preserved |
| year/monthly fortune output changed | Not allowed unless separately approved | should not change in today fortune PR |
| zodiac fortune output changed | Not allowed unless separately approved | should not change in today fortune PR |
| manseryeok output changed | Not allowed | manseryeok logic is out of scope |
| schemaVersion changed | Allowed only if explicitly decided | must be documented in implementation PR |
| existing localStorage keys changed | Not allowed | requires separate migration plan |

## Proposed Check Script Behavior

| Check | Status | Note |
|---|---|---|
| Load before snapshot | Pending | use docs/generated/fortune-engine-sample-snapshot.json |
| Load after snapshot | Pending | generated after implementation in a separate output file |
| Validate sample IDs | Pending | all 8 sample IDs preserved |
| Validate required category IDs | Pending | overall, money, love, work, study, health |
| Detect unintended year/monthly changes | Pending | should be blocked unless approved |
| Detect unintended zodiac changes | Pending | should be blocked unless approved |
| Detect unintended manseryeok changes | Pending | should be blocked |
| Summarize today fortune changes | Pending | score/text movement review |
| Report schemaVersion decision | Pending | required in implementation PR |

## Proposed Future File Names

| File | Purpose | Status |
|---|---|---|
| docs/generated/fortune-engine-sample-snapshot.json | existing before snapshot | Existing |
| docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json | future after snapshot | Pending |
| docs/generated/today-fortune-snapshot-comparison-result.json | future comparison result | Pending |
| scripts/checkTodayFortuneSnapshotComparison.mjs | future comparison check | Pending |

## Guardrails

- This PR adds snapshot comparison check design only.
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
- Existing snapshot JSON is not regenerated.
- Routing is not changed.
- UI/design is not changed.
- public/privacy-policy.html is not changed.
- AndroidManifest.xml, Android resource files, and Gradle settings are not changed.
- `.aab`, `.zip`, `.jks`, and `.keystore` files are not added to the repository.
- GitHub Secret actual values are not recorded.
- Play Console input remains separate.
- AAB upload remains separate.
- Real device QA remains separate.

## Recommended Next Steps

1. Decide the first small today fortune production change.
2. Decide whether CURRENT_FORTUNE_SCHEMA_VERSION should be incremented.
3. Implement one small today fortune engine improvement.
4. Generate after snapshot in a separate file.
5. Run before/after comparison and review output.
