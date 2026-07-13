# Store Screenshot Production Guide

- Status: Store screenshot production guide recorded
- PR type: docs/check-only
- 실제 스토어 스크린샷 이미지 제작: Pending
- Store screenshot upload: Pending
- Google Play Console input: Pending
- Google Play 데이터 보안 양식 최종 입력: Pending
- Release build: Not started
- Signing setup: Not started
- AAB generation: Not started

## 1. Purpose

- Purpose: Define production criteria before creating actual store screenshot images
- This PR records screenshot production standards only
- This PR does not create actual store screenshot image files
- This PR does not upload screenshots to Google Play Console
- This PR does not change production UI or Android packaging

## 2. Screenshot count and format

- Minimum required screenshot count: 6
- Recommended screenshot count: 6 to 8
- Target platform: Google Play
- Target device frame: Android phone portrait
- Screenshot orientation: portrait
- Screenshot style: edited promotional screenshot based on actual app screen
- Source screens should come from the latest main build
- Use actual app UI captures as the base
- Do not misrepresent unavailable features
- Do not show login, payment, AI 상담, actual ad SDK, or server features as active if they are not implemented

## 3. Visual direction

- 하루풀이 design concept: 고요한 밤의 운세 다이어리
- Warm ivory background
- Bright beige cards
- Deep navy point color
- Subtle gold accents
- Calm landscape-inspired visuals
- Traditional but not fortune-teller-shop style
- Personal insight app feeling
- Wide spacing and readable text
- Store screenshots should feel polished but should not overpromise features

## 4. Recommended screenshot set

1. Home / 오늘의 운세 진입 화면
2. 오늘운세 결과 화면
3. 오늘의 시간대 운세 / 아침·점심·저녁 카드
4. 오늘흐름 / 오행 이미지 화면
5. 2026년 월별 운세 화면
6. 띠별운세 화면

선택 추가 후보:

7. 초기 로딩 화면
8. 저장/공유 또는 내정보 화면

주의:

- 초기 로딩 화면은 실제 앱 경험의 일부이지만, 스토어 대표 스크린샷으로 넣을지는 최종 선택으로 둡니다.
- 스토어 스크린샷용 홍보 문구는 과장하지 않습니다.
- "AI 상담", "광고 제거", "프리미엄 결제", "로그인 동기화"처럼 아직 구현되지 않은 기능을 표현하지 않습니다.

## 5. Copy guidelines

- 문구는 짧고 명확하게
- 사용자가 얻는 가치를 중심으로
- 과도한 운명 단정, 질병/사고 예측, 금전 보장 표현 금지
- 의료/법률/투자 판단을 유도하지 않기
- 실제 앱에 존재하는 기능만 표현하기
- Store screenshot copy improvements are not part of this PR
- Actual store screenshot image files will be created in a later PR

## 6. Production checklist before image creation

- Latest main build is available
- Android actual device QA is recorded
- Startup loading screen v2 Android QA is recorded
- Today fortune practical copy is merged
- Small text readability polish is merged
- Five element images are merged
- Home time-slot background images are merged
- Store listing text final review is recorded
- Google Play data safety final review is recorded
- Privacy policy final values are recorded
- No release build/signing/AAB yet
- No Store screenshot upload yet
- No Google Play Console actual input yet

## 7. Not included in this PR

- No actual store screenshot image files
- No Store screenshot upload
- No Google Play Console input
- No Google Play 데이터 보안 양식 최종 입력
- No release build
- No signing setup
- No keystore file added
- No AAB generation
- No src changes
- No CSS changes
- No image file changes
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

## 8. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| 실제 스토어 스크린샷 이미지 제작 | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 9. Recommended next sequence

1. 실제 스토어 스크린샷 이미지 제작
2. Store screenshot file QA
3. Store screenshot upload
4. Google Play Console 실제 입력
5. Google Play 데이터 보안 양식 최종 입력
6. release build/signing/AAB 준비

## 10. Conclusion

- This PR records store screenshot production standards only.
- Actual store screenshot image files will be created in a later PR.
- Store screenshot upload, Google Play Console input, Google Play 데이터 보안 양식 최종 입력, release build, signing setup, and AAB generation remain Pending/Not started.
- No production code, UI, image file, Android packaging, signing, AAB, or Console input changes are included.
