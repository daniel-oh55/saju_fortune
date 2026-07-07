# Birth Region Expansion Policy

## Scope

- Review target: birth region expansion policy for Korean nationwide and overseas selections
- Current implementation is localStorage-based
- No server DB
- No login
- No external geocoding API
- No analytics SDK
- Seoul district list was expanded to 25 districts in PR #285
- Other Korean regions still need expansion
- Overseas birth region selection policy is not implemented yet
- Actual production data update remains Pending
- Android QA for final region selection remains Pending

## Current State

The current birth region flow stores profile input locally on the device. It does not use a server DB, login account, external geocoding API, or analytics SDK.

PR #285 completed the Seoul district list, but the rest of Korea still needs a clear data and UI policy before production data is expanded. This PR documents the policy only. It does not change `src/utils/profileRegionMetaStorage.js`, production UI, profile object shape, or fortune calculation logic.

## Korean Region Selection Policy

### Step 1: Country Selection

- Default country: 대한민국
- Keep the country selection extensible so overseas birth region selection can be added later.
- The first production data update should avoid changing existing profile storage shape.

### Step 2: Province Or Metropolitan City Selection

When 대한민국 is selected, show the 17 province/metropolitan-city level options:

- 서울특별시
- 부산광역시
- 대구광역시
- 인천광역시
- 광주광역시
- 대전광역시
- 울산광역시
- 세종특별자치시
- 경기도
- 강원특별자치도
- 충청북도
- 충청남도
- 전북특별자치도
- 전라남도
- 경상북도
- 경상남도
- 제주특별자치도

### Step 3: City, County, Or District Selection

- For 특별시 and 광역시, prefer 구 or 군 level options.
- For 도 and 특별자치도, choose one consistent policy before implementation: 시/군 level only, or 시/군/구 level.
- 세종특별자치시는 separate 시/군/구 options are not required, so a single 세종특별자치시 option or 전체/세종시 option should be reviewed.
- 제주특별자치도 should be reviewed with 제주시 and 서귀포시 as the likely city-level options.

This PR does not add the actual nationwide city/district dataset. The production data update remains Pending for a follow-up PR.

## Overseas Birth Region Policy

The overseas birth region flow should be decided before UI implementation. The MVP policy is:

- Add an 해외 option to the country selection.
- Use direct input, 즉 해외 도시 또는 지역은 직접 입력 방식으로 받습니다.
- Keep solar time correction policy as Pending.
- Keep latitude, longitude, timezone, and automatic solar time correction out of scope for the first MVP.
- Do not add an overseas city DB, geocoding API, or external region API at this stage.
- Store only user-entered values with the existing localStorage-based profile flow, without adding a new localStorage key or migration.

Alternative policy options can be reviewed later:

- Option A: country = 해외, direct city/region input, solar time correction Pending.
- Option B: provide a country list, direct city input, timezone/longitude-based correction Pending.

## Calculation And Verification Notes

- Domestic region expansion is a UI input improvement that may support future correction policy, but this PR does not change current saju calculation logic.
- The current production calculation continues to use the existing birth date and time inputs.
- 태양시 보정 적용 여부 remains Pending until a separate policy and verification PR.
- 음력/윤달 샘플 외부 검증 remains Pending until a separate verification PR.
- Do not mark 태양시 보정 적용 여부 as Confirmed in this policy PR.
- Do not mark 음력/윤달 샘플 외부 검증 as Confirmed in this policy PR.

## Follow-Up Plan

- Future PR: add Korean 17 province/metropolitan-city and major city/district data.
- Future PR: implement minimal overseas birth region input UI.
- Future PR: update birth region Android QA checklist.
- Future PR: document 태양시 보정 적용 여부 policy.
- Future PR: document 음력/윤달 샘플 외부 검증.

## Guardrails

- src unchanged
- production UI unchanged
- `src/utils/profileRegionMetaStorage.js` unchanged
- production fortune logic unchanged
- zodiac fortune engine unchanged
- generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- existing localStorage keys unchanged
- no new localStorage key added
- no localStorage migration added
- profile storage object shape unchanged
- routing unchanged
- privacy files unchanged
- Android native source unchanged
- AndroidManifest.xml unchanged
- Android resource files unchanged
- Gradle unchanged
- Capacitor dependencies unchanged
- package-lock.json unchanged
- release build remains Pending
- signing setup remains Pending
- AAB generation remains Pending
