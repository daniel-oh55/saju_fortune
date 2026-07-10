# Store Screenshot APK Launch QA Template

- Status: Template only
- Android Debug Build run #265: Success
- Capture APK download: Pending
- Debug APK install for screenshot capture: Pending
- App launch for screenshot capture: Pending
- 실제 스토어 스크린샷 이미지 제작: Pending
- Store screenshot upload: Pending
- Google Play Console input: Pending
- This document does not include actual screenshot image files.

## 1. Scope

- Purpose: Provide a QA result template for Debug APK install and app launch before actual Google Play store screenshot image production
- PR type: docs/check-only
- App name: 하루풀이
- Related Store screenshot capture basis readiness PR: #336
- Related Store screenshot capture/copy readiness PR: #335
- Related Store screenshot sample profile PR: #334
- Related Store screenshot production plan PR: #333
- Current screenshot image production status: Pending
- Current Google Play Console input status: Pending
- Current release build status: Not started
- No production code changes
- No Android native/resource changes
- No screenshot image files added

## 2. Build candidate

| Item | Status | Note |
| --- | --- | --- |
| Android Debug Build run #265 | Success | GitHub Actions 기준 |
| Capture APK download | Pending | 실제 다운로드 확인 전 |
| Debug APK install for screenshot capture | Pending | 실제 설치 확인 전 |
| App launch for screenshot capture | Pending | 실제 실행 확인 전 |
| Capture device finalization | Pending | 실제 캡처 기기 확정 전 |
| Release build screenshot basis | Not started | release build 미생성 |
| Signing setup | Not started | signing 미진행 |
| AAB generation | Not started | AAB 미생성 |

주의:

- run #265 success는 GitHub Actions 결과만 의미합니다.
- 실제 APK 다운로드, 실제 설치, 실제 앱 실행은 아직 Pending으로 유지합니다.
- 실제 설치/실행을 확인하지 않았다면 Completed로 쓰지 마세요.

## 3. QA result template

| QA item | Status | Evidence to fill later |
| --- | --- | --- |
| APK downloaded from GitHub Actions artifact | Pending | artifact name / download time |
| APK installed on capture device | Pending | device name / OS version |
| App launched on capture device | Pending | launch time / first screen |
| Home screen visible | Pending | visual check |
| Sample profile input possible | Pending | sample profile 기준 |
| Today fortune result screen reachable | Pending | screenshot target 2 |
| Saju flow screen reachable | Pending | screenshot target 3 |
| 2026 fortune screen reachable | Pending | screenshot target 4 |
| Zodiac fortune screen reachable | Pending | screenshot target 5 |
| Saved readings screen reachable | Pending | screenshot target 6 |
| No real user data used | Pending | sample profile only |
| Screenshot image export | Pending | 실제 이미지 제작 전 |
| Google Play upload | Pending | Console 입력 없음 |

## 4. Screenshot target reminder

| Screenshot | Capture screen | Copy candidate | Status |
| --- | --- | --- | --- |
| 1 | 홈 화면 | 오늘의 운세를 차분하게 살펴보세요 | Pending actual capture |
| 2 | 오늘운세 결과 | 하루의 흐름을 한눈에 확인 | Pending actual capture |
| 3 | 나의 사주 흐름 | 나의 성향과 흐름을 조용히 정리 | Pending actual capture |
| 4 | 2026 운세 | 한 해의 흐름을 참고용으로 확인 | Pending actual capture |
| 5 | 띠별운세 | 띠별 흐름을 가볍게 살펴보기 | Pending actual capture |
| 6 | 저장한 풀이 | 다시 보고 싶은 풀이를 저장 | Pending actual capture |

## 5. Sample profile reminder

- Sample profile source: docs/STORE_SCREENSHOT_SAMPLE_PROFILE.md
- Sample profile label: 샘플 사용자 A
- Birth date: 1990-05-15
- Birth time: 07:30
- Birth place: 서울특별시 종로구
- Gender: 여성
- Calendar type: 양력
- Leap month: 해당 없음
- 실제 사용자 데이터가 아님
- 실제 사용자 이름/생년월일/출생시간/출생지/연락처/이메일 노출 금지

## 6. Not included in this PR

- No src changes
- No CSS changes
- No production UI changes
- No AndroidManifest.xml changes
- No Android native code changes
- No Android resource changes
- No Gradle changes
- No Capacitor config changes
- No screenshot image files added
- No actual screenshot production
- No 실제 스토어 스크린샷 이미지 제작 completion
- No APK install completion
- No app launch completion
- No Google Play Console input
- No Store listing finalization
- No 개인정보 처리방침 URL finalization
- No 문의처 이메일/지원 연락처 finalization
- No Google Play 데이터 보안 양식 completion
- No release build
- No signing setup
- No keystore file added
- No AAB generation
- No actual ad SDK
- No actual payment SDK
- No login
- No server DB
- No external analytics SDK
- No production fortune logic changes
- No routing changes
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes

## 7. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| Capture APK download | Pending |
| Debug APK install for screenshot capture | Pending |
| App launch for screenshot capture | Pending |
| Capture device finalization | Pending |
| 실제 스토어 스크린샷 이미지 제작 | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Store listing final text | Pending |
| 개인정보 처리방침 URL 확정 | Pending |
| 문의처 이메일/지원 연락처 확정 | Pending |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Screenshot resolution validation | Pending |
| Screenshot crop/safe-area check | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 8. Recommended next sequence

1. GitHub Actions run #265 artifact에서 APK 다운로드
2. 캡처 기기에 APK 설치
3. 앱 실행 확인
4. 샘플 프로필 입력 또는 확인
5. 6개 캡처 대상 화면 접근 확인
6. 실제 스토어 스크린샷 이미지 제작
7. 제작된 이미지 QA
8. Store listing 최종 문구 확정
9. Google Play Console 입력은 최종값 확정 후 진행

## 9. Conclusion

- This PR adds a QA result template only.
- APK download, APK install, and app launch for screenshot capture remain Pending.
- 실제 스토어 스크린샷 이미지 제작 remains Pending.
- Google Play Console input, Store listing final text, 개인정보 처리방침 URL, 문의처 이메일/지원 연락처, and Google Play 데이터 보안 양식 remain Pending.
- No production code, Android packaging, release build, signing, AAB, or Console input changes are included.
