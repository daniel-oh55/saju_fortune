# Today Fortune Engine Improvement Design

## Today Fortune Engine Implementation Plan

- Today fortune engine implementation plan: Added
- Today fortune engine improvement: Pending
- Production engine logic change: Pending
- Snapshot comparison after implementation: Pending
- CURRENT_FORTUNE_SCHEMA_VERSION decision: Pending
- Engine accuracy approval: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 태양시 보정 적용 여부: Pending

## Purpose

This document defines the design direction for improving the 하루풀이 today fortune engine before production logic changes.

This document is not a production logic change and does not approve final engine accuracy.

## Current Status

| Item | Status | Note |
|---|---|---|
| Fortune engine current state audit | Confirmed | completed in previous PR |
| Fortune engine sample snapshot | Confirmed | generated before engine changes |
| Snapshot output quality review | Confirmed | completed in previous PR |
| Manseryeok external verification plan | Added | external verification still Pending |
| Today fortune engine improvement design | Added | this document |
| Today fortune engine improvement | Pending | not implemented in this PR |
| Production engine logic change | Pending | not changed in this PR |
| Engine accuracy approval | Pending | not approved in this PR |
| 음력/윤달 샘플 외부 검증 | Pending | external reference comparison still required |
| 태양시 보정 적용 여부 | Pending | policy decision required |

## Current Today Fortune Engine Baseline

| Area | Current Baseline |
|---|---|
| Main engine file | src/utils/fortuneEngine.js |
| Input basis | profile, dateKey, sajuAnalysis |
| Cache basis | profileId, dateKey, schemaVersion, required categories |
| Score generation | seed-based |
| Detail text | template-based with sajuAnalysis keywords |
| Required categories | overall, money, love, work, study, health |
| Snapshot baseline | docs/generated/fortune-engine-sample-snapshot.json |
| Production logic status | unchanged in this PR |

## Improvement Goals

| Goal | Status | Note |
|---|---|---|
| Improve personal relevance | Pending design | use day-master and element balance more clearly |
| Improve date-specific flow | Pending design | reflect dateKey/day flow more meaningfully |
| Improve category score rationale | Pending design | make category scores feel less random |
| Reduce repetitive text | Pending design | improve template variety and category-specific wording |
| Preserve deterministic output | Pending design | same profile/date should remain stable |
| Preserve cache compatibility | Pending design | schemaVersion decision required only in future implementation PR |
| Preserve current storage safety | Pending design | no existing localStorage key change |

## Proposed Input Signals

| Signal | Use Case | Status |
|---|---|---|
| profile | personalize greeting and profile identity | Existing |
| dateKey | deterministic daily fortune seed | Existing |
| sajuAnalysis.elements.dominant | personalize lucky keywords and tone | Existing |
| sajuAnalysis.elements.weak | category caution and balancing advice | Pending design |
| sajuAnalysis.pillars.day | day-master relationship basis | Pending design |
| current day ganji | date-specific daily flow | Pending design |
| current month flow | broader monthly mood | Pending design |
| required category ids | output shape preservation | Existing |

## Proposed Category Design

| Category | Proposed Improvement | Status |
|---|---|---|
| overall | combine daily flow, dominant element, and weak element | Pending design |
| money | reflect resource/flow/caution tone rather than random score only | Pending design |
| love | reflect communication and emotional balance signals | Pending design |
| work | reflect focus, timing, and decision-making signals | Pending design |
| study | reflect concentration and consistency signals | Pending design |
| health | reflect rest, rhythm, and overuse caution signals | Pending design |

## Proposed Score Design

| Rule Area | Proposed Direction | Status |
|---|---|---|
| Base score | keep deterministic seed-based baseline | Pending design |
| Element adjustment | apply small adjustment from dominant/weak element relationship | Pending design |
| Category adjustment | category-specific modifier by day flow | Pending design |
| Score range | avoid overly uniform scores while preventing extreme volatility | Pending design |
| Explanation consistency | score should match summary/detail tone | Pending design |
| Snapshot comparison | compare against PR #229 baseline before/after implementation | Pending |

## Proposed Text Design

| Text Area | Proposed Direction | Status |
|---|---|---|
| greeting | keep friendly daily diary tone | Pending design |
| keyword | use luckyKeywords plus daily flow keyword | Pending design |
| category summary | make category-specific and less repetitive | Pending design |
| category detail | include reason + advice + caution structure | Pending design |
| luckyColor | preserve existing shape, improve relationship to element balance later | Pending design |
| luckyItem | preserve existing shape, improve variety later | Pending design |

## Implementation Phasing

| Phase | Status | Note |
|---|---|---|
| Phase 1 design | Added | this PR |
| Phase 2 implementation plan | Pending | separate PR |
| Phase 3 small production logic change | Pending | separate PR |
| Phase 4 snapshot comparison | Pending | separate PR after logic change |
| Phase 5 UI wording adjustment if needed | Pending | separate UI PR only if needed |

## Required Guardrails for Future Implementation

- Compare output against docs/generated/fortune-engine-sample-snapshot.json before and after changes.
- Decide whether CURRENT_FORTUNE_SCHEMA_VERSION needs to change in the implementation PR.
- Do not change existing localStorage keys without a separate migration plan.
- Do not mix today fortune logic changes with year/monthly or zodiac fortune logic changes.
- Do not mix production engine changes with UI/design changes.
- Keep manseryeok external verification status separate from today fortune UX improvement status.
- Keep 음력/윤달 샘플 외부 검증 Pending until actual external comparison is completed.
- Keep 태양시 보정 적용 여부 Pending until policy decision is made.

## Guardrails

- This PR adds today fortune engine improvement design only.
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
- Snapshot JSON is not regenerated.
- Routing is not changed.
- UI/design is not changed.
- public/privacy-policy.html is not changed.
- AndroidManifest.xml, Android resource files, and Gradle settings are not changed.
- `.aab`, `.zip`, `.jks`, and `.keystore` files are not added to the repository.
- GitHub Secret actual values are not recorded.
- Play Console input remains separate.
- AAB upload remains separate.
- Real device QA remains separate.

## Non-goals for This PR

- Production today fortune engine change
- Production fortune engine change
- Year/monthly fortune logic change
- Zodiac fortune logic change
- Manseryeok calculation change
- Hidden stems production integration
- Ten-gods production integration
- External manseryeok verification completion
- 음력/윤달 샘플 외부 검증 completion
- 태양시 보정 policy decision
- Engine accuracy approval
- Snapshot regeneration
- CURRENT_FORTUNE_SCHEMA_VERSION change
- schemaVersion change
- localStorage key change
- UI/design change
- Android native change
- Play Console input
- AAB upload
- Real device QA

## Recommended Next Steps

1. Add a today fortune engine implementation plan.
2. Define before/after snapshot comparison checks.
3. Implement one small today fortune scoring/text improvement in a separate PR.
4. Compare generated output against the existing sample snapshot.
5. Review whether CURRENT_FORTUNE_SCHEMA_VERSION needs to be incremented in the implementation PR.
