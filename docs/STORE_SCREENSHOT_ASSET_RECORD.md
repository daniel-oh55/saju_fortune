# Store Screenshot Asset Record

- Status: Actual store screenshot image production recorded
- 기존 생성 스토어 스크린샷 이미지 사용: Confirmed
- 실제 스토어 스크린샷 이미지 제작: Completed
- Store screenshot upload: Pending
- Google Play Console input: Pending
- Google Play 데이터 보안 양식 최종 입력: Pending
- Release build: Not started
- Signing setup: Not started
- AAB generation: Not started

## 1. Scope

- Purpose: Record existing generated store screenshot image files for Google Play preparation
- PR type: asset/docs/check
- Existing generated screenshot images are used as final assets
- Output folder: store-assets/google-play/screenshots
- No new screenshot capture
- No new screenshot generation
- No image redesign
- No Store screenshot upload
- No Google Play Console input
- No release build/signing/AAB
- No production UI or app logic changes

## 2. Screenshot files

The existing generated screenshots were found at `store-assets/screenshots/android/` and copied byte-for-byte (verified by checksum, no re-encoding or re-editing) into `store-assets/google-play/screenshots/`. Each file's original name assumed a different topic than what it actually depicts, so the files below are named to match their real, verified content rather than their original filenames.

| No. | File | Source screen (verified from actual image content) | Status |
| --- | --- | --- | --- |
| 1 | store-assets/google-play/screenshots/01-home.png | Home / 오늘의 운세 진입 화면 | Added |
| 2 | store-assets/google-play/screenshots/02-time-slot-fortune.png | 오늘의 시간대 운세 / 아침·점심·저녁 카드 | Added |
| 3 | store-assets/google-play/screenshots/03-today-flow-five-elements.png | 오늘흐름 / 오행 이미지 화면 | Added |
| 4 | store-assets/google-play/screenshots/04-year-monthly-fortune.png | 2026년 월별 운세 화면 | Added |
| 5 | store-assets/google-play/screenshots/05-zodiac-fortune.png | 띠별운세 화면 | Added |
| 6 | store-assets/google-play/screenshots/06-daily-hints.png | 오늘의 힌트 / 저장한 풀이 화면 | Added |

### Note on scope vs. docs/STORE_SCREENSHOT_PRODUCTION_GUIDE.md

`docs/STORE_SCREENSHOT_PRODUCTION_GUIDE.md`'s recommended 6-screen set included a dedicated "오늘운세 결과 화면" (individual category detail/score page) screenshot. None of the existing generated images depicts that specific screen — the closest existing captures are the Home screen (which already shows the 총운/재물운 preview cards) and a "오늘의 힌트 / 저장한 풀이" screen that was not on the guide's list. Per this PR's asset/docs/check scope (existing generated images only, no new capture or generation), the 6 files above are registered as-is: 5 of the 6 guide topics are covered directly, and 오늘의 힌트/저장한 풀이 is included in place of a dedicated 오늘운세 결과 화면 shot. A dedicated 오늘운세 결과 screenshot can be captured and added in a later PR if needed.

## 3. Content guardrails

- Existing generated images are used without redesign
- No unavailable features shown
- No login shown
- No payment or premium feature shown
- No actual ad SDK shown
- No server sync or account sync shown
- No AI 상담 feature shown as active
- No medical/legal/investment guarantee copy
- No exaggerated fortune guarantee copy

## 4. Not included in this PR

- No Store screenshot upload
- No Google Play Console input
- No Google Play 데이터 보안 양식 최종 입력
- No release build
- No signing setup
- No keystore file added
- No AAB generation
- No src changes
- No CSS changes
- No AndroidManifest.xml changes
- No Android native/resource changes
- No Gradle changes
- No Capacitor config changes
- No fortune copy/content changes
- No fortune calculation logic changes
- No routing changes
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes

## 5. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| Store screenshot file QA | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 6. Recommended next sequence

1. Store screenshot file QA
2. Store screenshot upload
3. Google Play Console 실제 입력
4. Google Play 데이터 보안 양식 최종 입력
5. release build/signing/AAB 준비

## 7. Conclusion

- This PR adds existing generated store screenshot image files as final Google Play screenshot assets.
- Store screenshot upload, Google Play Console input, Google Play 데이터 보안 양식 최종 입력, release build, signing setup, and AAB generation remain Pending/Not started.
- No production code, Android packaging, signing, AAB, or Console input changes are included.
