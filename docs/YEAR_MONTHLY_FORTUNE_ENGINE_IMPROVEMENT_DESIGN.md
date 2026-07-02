# Year Monthly Fortune Engine Improvement Design

## Year Monthly First Production Scope

- Year/monthly first production scope: Added
- Year/monthly fortune engine improvement: Pending
- Production engine logic change: Pending
- Snapshot comparison for year/monthly improvement: Pending
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Today fortune first production improvement: Reviewed
- Zodiac fortune engine improvement: Pending

## Year Monthly Snapshot Comparison Check Design

- Year/monthly snapshot comparison check design: Added
- Year/monthly fortune engine improvement: Pending
- Production engine logic change: Pending
- Snapshot comparison for year/monthly improvement: Pending
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Today fortune first production improvement: Reviewed
- Zodiac fortune engine improvement: Pending

## Year Monthly Fortune Implementation Plan

- Year/monthly fortune implementation plan: Added
- Year/monthly fortune engine improvement: Pending
- Production engine logic change: Pending
- Snapshot comparison for year/monthly improvement: Pending
- Engine accuracy approval: Pending
- External reference comparison: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending
- Today fortune first production improvement: Reviewed
- Zodiac fortune engine improvement: Pending

## Purpose

This document defines the design direction for improving the 하루풀이 year/monthly fortune engine before production logic changes.

This document is not a production logic change and does not approve final engine accuracy.

## Current Status

| Item | Status | Note |
|---|---|---|
| Today fortune first production improvement | Reviewed | output quality review completed in previous PR |
| Year/monthly fortune engine improvement design | Added | this document |
| Year/monthly fortune engine improvement | Pending | not implemented in this PR |
| Production engine logic change | Pending | not changed in this PR |
| Snapshot comparison for year/monthly improvement | Pending | future PR |
| Engine accuracy approval | Pending | not approved in this PR |
| External reference comparison | Pending | not completed |
| 음력/윤달 샘플 외부 검증 | Pending | external reference comparison still required |
| 태양시 보정 적용 여부 | Pending | policy decision required |
| Zodiac fortune engine improvement | Pending | separate track |

## Current Year/Monthly Fortune Baseline

| Area | Current Baseline |
|---|---|
| Main engine file | src/domain/fortune/yearFortuneEngine.js |
| Input basis | profile, sajuAnalysis, targetYear |
| Current target year | 2026 |
| Output basis | deterministic seed-based annual/monthly composition |
| Monthly output | 12 monthly entries |
| Current limitation | month flow is useful but not yet strongly tied to saju/monthly relationship logic |
| Snapshot baseline | docs/generated/fortune-engine-sample-snapshot.json |
| After today improvement snapshot | docs/generated/fortune-engine-sample-snapshot-after-today-improvement.json |
| Production logic status | unchanged in this PR |

## Improvement Goals

| Goal | Status | Note |
|---|---|---|
| Improve annual narrative relevance | Pending design | connect annual flow more clearly to sajuAnalysis |
| Improve monthly variation | Pending design | reduce generic month-to-month feeling |
| Improve score rationale | Pending design | make monthly score changes easier to understand |
| Improve monthly advice quality | Pending design | include reason, advice, caution style where useful |
| Preserve deterministic output | Pending design | same profile/targetYear should remain stable |
| Preserve output shape | Pending design | avoid UI breakage |
| Preserve current storage safety | Pending design | no existing localStorage key change |

## Proposed Input Signals

| Signal | Use Case | Status |
|---|---|---|
| profile | profile identity and deterministic seed | Existing |
| sajuAnalysis.elements.dominant | annual/monthly tone personalization | Existing |
| sajuAnalysis.elements.weak | caution and balancing advice | Pending design |
| sajuAnalysis.pillars.year | broad annual relationship basis | Pending design |
| sajuAnalysis.pillars.month | seasonal/monthly interpretation basis | Pending design |
| targetYear | annual fortune scope | Existing |
| month index | monthly deterministic variation | Existing |
| future year ganji | future implementation candidate | Pending design |
| future month flow | future implementation candidate | Pending design |

## Proposed Annual Design

| Area | Proposed Direction | Status |
|---|---|---|
| annual summary | connect targetYear, dominant/weak element, and user rhythm | Pending design |
| annual score | keep deterministic baseline with explainable adjustment | Pending design |
| opportunity theme | describe where growth or support may appear | Pending design |
| caution theme | describe where overuse or imbalance may appear | Pending design |
| action theme | give practical annual habit or planning advice | Pending design |

## Proposed Monthly Design

| Area | Proposed Direction | Status |
|---|---|---|
| monthly score | keep deterministic but improve month-specific rationale | Pending design |
| monthly title | make title more connected to month flow | Pending design |
| monthly summary | include category-like focus for the month | Pending design |
| monthly advice | include practical action guidance | Pending design |
| monthly caution | include mild warning without fear-based wording | Pending design |
| month-to-month rhythm | reduce repetitive phrasing across 12 months | Pending design |

## Output Compatibility Requirements

| Requirement | Status | Note |
|---|---|---|
| targetYear preserved | Required | 2026 output should remain targetYear-based |
| 12 monthly entries preserved | Required | UI expects 12 months |
| existing output keys preserved | Required | avoid UI/schema breakage |
| deterministic output preserved | Required | same profile/targetYear should be stable |
| today fortune output unchanged | Required | today fortune track already reviewed |
| zodiac fortune output unchanged | Required | separate track |
| manseryeok output unchanged | Required | out of scope |

## Implementation Phasing

| Phase | Status | Note |
|---|---|---|
| Phase 1 design | Added | this PR |
| Phase 2 implementation plan | Pending | separate PR |
| Phase 3 first small production change | Pending | separate PR |
| Phase 4 after snapshot generation | Pending | separate PR |
| Phase 5 snapshot comparison and quality review | Pending | separate PR |

## Guardrails

- This PR adds year/monthly fortune engine improvement design only.
- This PR is not a production logic change.
- This PR is not final engine accuracy approval.
- Year/monthly fortune output logic is not changed.
- Today fortune output logic is not changed.
- Saju analysis logic is not changed.
- Manseryeok logic is not changed.
- Zodiac fortune logic is not changed.
- CURRENT_FORTUNE_SCHEMA_VERSION is not changed.
- schemaVersion is not changed.
- Existing localStorage keys are not changed.
- Snapshot JSON files are not regenerated.
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

1. Add a year/monthly fortune implementation plan.
2. Define before/after snapshot comparison requirements for year/monthly output.
3. Implement one small year/monthly fortune production improvement in a separate PR.
4. Generate after snapshot and compare unintended today/zodiac/manseryeok changes.
5. Keep engine accuracy approval Pending until external verification is completed.
