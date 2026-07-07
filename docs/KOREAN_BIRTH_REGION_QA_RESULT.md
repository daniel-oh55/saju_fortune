# Korean Birth Region QA Result

## Scope

- Review target: Korean birth region selection after PR #292
- APK run number: Android Debug Build #221
- Artifact name: `harupuli-debug-apk`
- Branch: `fix/complete-korean-birth-region-data`
- Related PR: #292
- Build type: Android Debug APK
- Test result source: user-confirmed real device test
- This document records only the targeted Korean birth region selection QA result
- This document also records the targeted in-app top-left back button and home screen Android back exit confirmations from the same test
- This document does not replace full Android smoke QA

## Test Environment

| Item | Value |
|---|---|
| Device model | Samsung Galaxy S23 Ultra |
| OS | One UI 8.0 |
| Artifact | `harupuli-debug-apk` |
| APK run number | Android Debug Build #221 |
| Build type | Android Debug APK |
| Related PR | #292 |
| Test result source | user-confirmed real device test |

## Status Summary

| Item | Status | Result |
|---|---|---|
| 17 province/metropolitan-city options | Completed | 표시 됨 |
| Seoul 25 districts | Completed | 표시 됨 |
| Busan districts/count | Completed | 16개 표시 |
| Daegu Gunwi-gun | Completed | 군위군 포함 9개 |
| Incheon key districts/count | Completed | 미추홀구, 강화군, 옹진군 포함 10개 |
| Sejong option | Completed | 표시 됨 |
| Gyeonggi cities/count | Completed | 31개 표시 |
| Gangwon cities/count | Completed | 18개 표시 |
| Jeonbuk cities/count | Completed | 14개 표시 |
| Jeju city options | Completed | 제주시, 서귀포시 표시 됨 |
| Save selected region | Completed | 저장 됨 |
| Persist selected region after app restart | Completed | 재실행 후 유지 |
| In-app top-left back button | Completed | 됨 |
| Home screen Android back exit | Completed | 됨 |
| Additional issues | Completed | 없음 |
| Overseas birth region input UI | Pending | Not implemented in this PR |
| 태양시 보정 적용 여부 | Pending | Not reviewed in this targeted QA |
| 음력/윤달 샘플 외부 검증 | Pending | Not reviewed in this targeted QA |
| Full regression smoke QA | Pending | Pending unless separately confirmed |
| Google Play Console input | Pending | Not completed in this PR |
| Release build | Pending | Not completed in this PR |
| signing setup | Pending | Not completed in this PR |
| AAB generation | Pending | Not completed in this PR |

## Result Notes

- Android Debug Build #221 was checked on Samsung Galaxy S23 Ultra / One UI 8.0.
- Korean 17 province/metropolitan-city selection was confirmed on the real device.
- Seoul 25 district coverage was confirmed on the real device.
- Busan, Daegu, Incheon, Sejong, Gyeonggi, Gangwon, Jeonbuk, and Jeju representative checks were confirmed on the real device.
- Region save behavior was confirmed on the real device.
- Region persistence after app restart was confirmed on the real device.
- In-app top-left back button was confirmed on the real device.
- Home screen Android back exit behavior was confirmed on the real device.
- No additional issue was reported in this targeted QA.
- Full Android smoke QA remains Pending until separately confirmed.

## Guardrails

- production fortune logic unchanged
- zodiac fortune engine unchanged
- src unchanged
- src/utils/profileRegionMetaStorage.js unchanged
- generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- existing localStorage keys unchanged
- no new localStorage key added
- profile storage object shape unchanged
- routing unchanged
- overseas birth region input UI unchanged
- privacy files unchanged
- Android native source unchanged
- AndroidManifest.xml unchanged
- Android resource files unchanged
- Gradle unchanged
- package-lock.json unchanged
- Capacitor dependencies unchanged
- release build remains Pending
- signing setup remains Pending
- AAB generation remains Pending
