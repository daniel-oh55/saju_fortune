# Overseas Region And Zodiac QA Result

## Test Environment

- APK run number: Android Debug Build #224
- Artifact name: harupuli-debug-apk
- Related PRs: #294, #295
- Branches:
  - feat/overseas-birth-region-input
  - refactor/compress-zodiac-explanation-cards
- Test device: Samsung Galaxy S23 Ultra
- OS: One UI 8.0
- Build type: Android Debug APK
- Test result source: user-confirmed real device test
- Test scope: targeted QA for overseas birth region input and zodiac explanation card compression

## QA Result

| Area | Item | Status | Result |
|---|---|---|---|
| Overseas birth region | Overseas option in region list | Completed | 문제 없음 |
| Overseas birth region | Domestic 17 province/metropolitan-city list preserved | Completed | 문제 없음 |
| Overseas birth region | Existing Seoul district selection preserved | Completed | 문제 없음 |
| Overseas birth region | Direct input shown for overseas selection | Completed | 문제 없음 |
| Overseas birth region | Placeholder shown | Completed | 문제 없음 |
| Overseas birth region | Empty overseas input validation | Completed | 문제 없음 |
| Overseas birth region | Save overseas city/region | Completed | 문제 없음 |
| Overseas birth region | Persist overseas region after app restart | Completed | 문제 없음 |
| Overseas birth region | Switch from overseas back to domestic region | Completed | 문제 없음 |
| Overseas birth region | Save domestic region after switching back | Completed | 문제 없음 |
| Zodiac explanation | Explanation cards compressed to two cards | Completed | 문제 없음 |
| Zodiac explanation | Cards remain below zodiac grid | Completed | 문제 없음 |
| Zodiac explanation | Cards remain above year list | Completed | 문제 없음 |
| Zodiac explanation | 1~2월 절기 기준 안내 | Completed | 문제 없음 |
| Zodiac explanation | Year-list reference guidance | Completed | 문제 없음 |
| Common | In-app top-left back button | Completed | 문제 없음 |
| Common | Home screen Android back exit | Completed | 문제 없음 |
| Common | Additional issues | Completed | 없음 |

## Pending Items

| Item | Status |
|---|---|
| Full Android smoke QA | Pending |
| 태양시 보정 적용 여부 | Pending |
| 음력/윤달 샘플 외부 검증 | Pending |
| Google Play Console input | Pending |
| Release build | Pending |
| signing setup | Pending |
| AAB generation | Pending |
| Store screenshots | Pending |
| Privacy policy URL final confirmation | Pending |

## Scope Confirmation

- Production fortune logic unchanged
- Zodiac fortune engine unchanged
- src unchanged
- ProfileForm.jsx unchanged
- profileRegionMetaStorage.js unchanged
- ZodiacFortunePage.jsx unchanged
- Generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- Existing localStorage keys unchanged
- Android/Gradle unchanged
- Privacy policy unchanged
- Release build/signing/AAB remain Pending
