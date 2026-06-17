# STORE_SCREENSHOT_SAMPLE_PROFILE_SCREEN_QA_RESULT

## debug APK QA handoff 준비

- 테스트용 샘플 프로필 화면 확인 전 debug APK QA handoff 상태를 확인해야 합니다.
- 문서 경로는 `docs/ANDROID_DEBUG_APK_QA_HANDOFF_READINESS.md`입니다.
- 실제 앱 실행 전까지 주요 화면 확인 상태는 Pending입니다.

## Android device QA execution result 연계

- 테스트용 샘플 프로필 화면 확인은 Android device QA execution result와 연결됩니다.
- 문서 경로는 `docs/ANDROID_DEVICE_QA_EXECUTION_RESULT.md`입니다.
- 실제 기기 또는 에뮬레이터에서 화면을 확인하기 전까지 Pending 상태를 유지합니다.

이 문서는 하루풀이 Google Play 스토어 스크린샷 제작 전 테스트용 샘플 프로필 입력 및 주요 화면 확인 결과를 기록하기 위한 문서입니다.
이번 PR은 샘플 프로필 화면 QA 결과 기록 양식 준비가 목적이며, 실제 스크린샷 이미지 생성, Google Play Console 입력, release build, signing, AAB 생성, production 앱 로직 변경은 진행하지 않습니다.

## 1. 목적

- 테스트용 샘플 프로필을 앱에 입력하기 전 확인 기준을 정리합니다.
- 샘플 프로필 입력 후 주요 화면 표시 상태를 기록할 수 있도록 합니다.
- 실제 사용자의 개인정보가 노출되지 않도록 점검합니다.
- 스토어 스크린샷 제작 전 화면 문구, 기능명, 금지 표현을 확인합니다.
- 실제 스크린샷 이미지는 후속 단계에서 제작합니다.

## 2. 현재 상태

- 테스트용 샘플 프로필 실제 입력 상태: Pending
- 주요 화면 확인 상태: Pending
- Android 실제 기기 또는 에뮬레이터 확인 상태: Pending
- 실제 스크린샷 이미지 생성 상태: Pending
- Google Play Console 스크린샷 업로드 상태: Not started
- 실제 개인정보 처리방침 URL 확인 상태: Pending
- 개인정보 처리방침 문의처 상태: Pending

## 3. 기준 문서

- 샘플 프로필 문서: `docs/STORE_SCREENSHOT_SAMPLE_PROFILE.md`
- 스토어 스크린샷 캡처 QA 문서: `docs/STORE_SCREENSHOT_CAPTURE_QA_RESULT.md`
- 스크린샷 준비 문서: `docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md`
- 데이터 보안 입력 준비 문서: `docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md`
- Android Debug Build 복구 결과 문서: `docs/ANDROID_DEBUG_BUILD_RECOVERY_RESULT.md`

## 4. 화면 확인 대상

| 화면 | 확인 항목 | 상태 | 비고 |
| --- | --- | --- | --- |
| 홈 화면 | 서비스명 하루풀이와 주요 진입 버튼 표시 | Pending | 실제 확인 전 |
| 프로필 입력 화면 | 생년월일시, 성별 입력 흐름 표시 | Pending | 실제 개인정보 사용 금지 |
| 오늘의 풀이 화면 | 핵심 풀이 결과 표시 | Pending | 단정 표현 점검 |
| 사주 인사이트 화면 | 참고용 해석 문구 표시 | Pending | 전문 자문 대체 금지 고지 확인 |
| 저장한 풀이 화면 | 저장 기능명 표시 | Pending | 저장한 풀이 기준 |
| 개인정보 안내 화면 | localStorage, 서버 DB 없음, 삭제 방법 안내 | Pending | 문의처 Pending 유지 |

## 5. 샘플 프로필 입력 기준

- 실제 사용자의 이름을 사용하지 않습니다.
- 실제 사용자의 생년월일을 사용하지 않습니다.
- 실제 연락처나 이메일을 사용하지 않습니다.
- `STORE_SCREENSHOT_SAMPLE_PROFILE.md` 기준을 따릅니다.
- 민감정보가 노출될 수 있는 값은 사용하지 않습니다.
- 화면 캡처 전 입력값이 테스트용 샘플임을 확인합니다.

## 6. 문구 확인 기준

- 서비스명은 하루풀이로 표시합니다.
- 기능명은 저장한 풀이로 표시합니다.
- 금지 문구 기준은 투자하면 성공합니다 입니다.
- 합격 보장, 투자 성공 보장, 질병 치료 보장, 결혼 확정, 100% 적중 같은 문구를 사용하지 않습니다.
- 참고용 콘텐츠이며 전문적인 자문을 대체하지 않는다는 고지를 유지합니다.

## 7. 현재 보류 항목

- 테스트용 샘플 프로필 실제 입력 미진행
- 주요 화면 확인 미진행
- Android 실제 기기 또는 에뮬레이터 확인 미진행
- 실제 스토어 스크린샷 이미지 제작 미진행
- Google Play Console 스크린샷 업로드 미진행
- 실제 개인정보 처리방침 URL 확인 미진행
- 개인정보 처리방침 문의처 미확정
- release build 미진행
- signing 미진행
- AAB 생성 미진행

## 8. 다음 단계

- 테스트용 샘플 프로필 실제 입력
- 주요 화면 표시 확인
- 금지 표현 및 민감정보 노출 여부 확인
- Android 실제 기기 또는 에뮬레이터에서 화면 확인
- 실제 스토어 스크린샷 이미지 제작
- Google Play Console 업로드 준비
