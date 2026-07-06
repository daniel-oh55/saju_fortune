# Android Debug APK QA Result

## Scope

- Review target: Android Debug APK manual smoke QA
- Artifact name: `harupuli-debug-apk`
- Workflow: Android Debug Build
- Workflow run number: `#210`
- PR source: PR #281
- This document records actual APK download, install, and launch confirmation
- This document records follow-up issues found during manual QA
- This document does not confirm Google Play Console input
- This document does not confirm release build
- This document does not confirm signing setup
- This document does not confirm AAB generation
- This document does not change production logic

## Test Environment

| Item | Value |
|---|---|
| Tester | Daniel Oh |
| Device model | Samsung Galaxy S23 Ultra |
| Android/OS info | One UI 8.0 |
| Artifact | `harupuli-debug-apk` |
| Workflow run | `#210` |
| Test date | 2026-07-06 |
| Build type | Debug APK |

## Tested Screens

- Home
- 오늘운세
- 오늘흐름
- 2026운세
- 띠별운세
- 내정보

## Status Summary

| Item | Status | Note |
|---|---|---|
| APK download | Completed | artifact was downloaded manually |
| APK install | Completed | debug APK was installed on Android device |
| App launch test | Completed | app launched successfully |
| Basic Android smoke QA | Completed with follow-up issues | no blocking launch issue observed, but improvements remain |
| Home screen QA | Completed with follow-up issues | improvement items recorded below |
| Today fortune QA | Completed with follow-up issues | back navigation and content improvements remain |
| Today flow QA | Completed with follow-up issues | no blocking issue reported |
| 2026 fortune QA | Completed with follow-up issues | no blocking issue reported |
| Zodiac fortune QA | Completed with follow-up issues | layout improvement remains |
| My info QA | Completed with follow-up issues | birth region data improvement remains |
| Quick menu customization QA | Completed with follow-up issues | scroll position improvement remains |
| Google Play Console input | Pending | not completed in this PR |
| release build | Pending | not completed in this PR |
| signing setup | Pending | not completed in this PR |
| AAB generation | Pending | not completed in this PR |

## Smoke QA Notes

- APK was installed successfully on Samsung Galaxy S23 Ultra.
- App launched successfully.
- No blocking launch issue was observed.
- The following screens were checked: Home, 오늘운세, 오늘흐름, 2026운세, 띠별운세, 내정보
- Several UI/UX and feature improvement items were noticed and will be handled in follow-up PRs.
- This result does not replace full release QA.
- This result does not confirm Play Console readiness.
- This result does not confirm release build readiness.

## Follow-up Issues

| No. | Area | Issue | Suggested follow-up |
|---|---|---|---|
| 1 | 내정보 / 출생지역 | 서울특별시 일부 지역에서 모든 행정구역이 표시되지 않음 | Update birth region district data |
| 2 | 오늘운세 / Navigation | 오늘운세 상세내용에서 뒤로가기를 누르면 이전 화면 대신 앱이 종료됨 | Fix detail back navigation behavior |
| 3 | Navigation / Scroll | 빠른메뉴 포함 각 메뉴 이동 시 화면 중간 또는 하단 위치가 보임 | Scroll to top on menu navigation |
| 4 | Home | 홈화면에 아침운세/점심운세/저녁운세를 모두 표시 필요 | Add morning/lunch/evening fortune section |
| 5 | App startup | 앱 시작 시 간단하고 직관적인 로딩화면 필요 | Add lightweight startup loading screen |
| 6 | App branding | 앱 아이콘 제작 필요 | Prepare app icon assets in separate PR |
| 7 | 오행 안내 | `오행기운 이해하기`와 `오행을 쉽게보면` 내용 중복 | Deduplicate five elements guidance cards |
| 8 | 공유 기능 | 저장한 내용을 카카오톡/문자메시지로 공유하는 기능 필요 | Add saved reading share flow |
| 9 | 띠별운세 | 12간지 카드 위 설명 카드들을 하단으로 이동 필요 | Move zodiac explanation cards below zodiac cards |

## Follow-up Priority

1. Fix today fortune detail back navigation behavior
2. Scroll to top on menu navigation
3. Update birth region district data
4. Deduplicate five elements guidance cards
5. Move zodiac explanation cards below zodiac cards
6. Add morning/lunch/evening fortune display on home
7. Add saved reading share flow
8. Add lightweight startup loading screen
9. Prepare app icon assets

## Guardrails

- production fortune logic unchanged
- zodiac fortune engine unchanged
- src production UI unchanged
- generated JSON unchanged
- docs/generated unchanged
- schemaVersion unchanged
- CURRENT_FORTUNE_SCHEMA_VERSION unchanged
- existing localStorage keys unchanged
- no new localStorage key added
- routing unchanged
- privacy files unchanged
- Android/Gradle unchanged
- Google Play Console input remains Pending
- release build remains Pending
- signing setup remains Pending
- AAB generation remains Pending
