# Solar Time Correction Policy

## Current Status

- Current status: Pending / Not implemented
- 태양시 보정 적용 여부: Pending
- Current production fortune calculation does not apply solar time correction
- Birth region values are currently stored for profile/input UX only
- Domestic and overseas birth region values are not used in production calculation yet
- No timezone conversion
- No longitude/latitude handling
- No geocoding API
- No overseas city DB
- No external API
- No schemaVersion change
- No localStorage key change

This document records the current policy before any production calculation change. It does not implement solar time correction and does not change fortune generation behavior.

## Decision Criteria

- Whether solar time correction improves 사주 calculation accuracy enough to justify complexity
- Whether correction should apply only when a precise region is available
- Whether correction should apply to overseas birth regions
- Whether user consent or explicit explanation is needed
- Whether correction should be optional or automatic
- Whether old saved profiles should remain backward-compatible
- Whether external verification is required before production logic changes

## Candidate Scopes

### Option A

- No solar time correction
- Keep current calculation behavior
- Lowest risk
- Best for current MVP

### Option B

- Domestic-only solar time correction
- Use selected Korean region as a future correction hint
- Requires verified region-to-longitude data
- Requires sample validation

### Option C

- Domestic + overseas solar time correction
- Requires timezone, longitude/latitude, city matching, and more user guidance
- Highest complexity
- Not recommended before external verification

## Recommended MVP Policy

- MVP 기준으로는 Option A를 유지합니다.
- Option B/C는 후속 검증 전까지 Pending으로 둡니다.
- 실제 계산 로직 변경은 별도 PR에서만 진행합니다.

## Required Verification Before Implementation

- 태양시 보정 적용 여부 external review
- Region-to-longitude data source review
- Domestic sample date/time validation
- Overseas timezone/longitude policy review
- 음력/윤달 샘플 외부 검증
- Backward compatibility of saved profiles
- Android QA plan after calculation change

## Future PR Plan

- Future PR: external verification checklist for 태양시 보정 적용 여부
- Future PR: 음력/윤달 샘플 외부 검증
- Future PR: region-to-longitude data policy if Option B is selected
- Future PR: calculation regression baseline before any production logic change
- Future PR: production logic implementation only after verification

## Non-Goals For This PR

- No src changes
- No production fortune calculation logic changes
- No 사주/운세 result generation logic changes
- No zodiac fortune engine changes
- No profileRegionMetaStorage.js changes
- No ProfileForm.jsx changes
- No ZodiacFortunePage.jsx changes
- No generated JSON changes
- No docs/generated changes
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes
- No new localStorage key
- No localStorage migration
- No profile storage object shape changes
- No solar time correction calculation logic
- No timezone conversion
- No longitude/latitude handling
- No geocoding API
- No overseas city DB
- No external API
- No privacy file changes
- No Android/Gradle changes
- No package-lock.json changes
- No release build, signing setup, or AAB generation
