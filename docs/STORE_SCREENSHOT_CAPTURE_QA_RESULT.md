# STORE_SCREENSHOT_CAPTURE_QA_RESULT

## Android device QA execution result 연계

- 스토어 스크린샷 실제 캡처 전 Android device QA execution result를 확인해야 합니다.
- 문서 경로는 `docs/ANDROID_DEVICE_QA_EXECUTION_RESULT.md`입니다.
- 실제 캡처 이미지는 아직 생성하지 않습니다.

## 샘플 프로필 화면 QA 결과 연계

- 테스트용 샘플 프로필 입력 및 주요 화면 확인 결과 문서를 추가했습니다.
- 문서 경로는 `docs/STORE_SCREENSHOT_SAMPLE_PROFILE_SCREEN_QA_RESULT.md`입니다.
- 실제 스크린샷 이미지는 아직 생성하지 않습니다.
- 화면 확인 완료 전에는 실제 캡처 단계로 넘어가지 않습니다.

이 문서는 하루풀이 Google Play 스토어 스크린샷 실제 캡처 전 QA 결과를 기록하기 위한 템플릿입니다.
이번 PR은 캡처 QA 결과 기록 양식 준비가 목적이며, 실제 스크린샷 이미지 생성, Google Play Console 입력, release build, signing, AAB 생성, production 앱 로직 변경은 진행하지 않습니다.

## 1. 목적

- Google Play 스토어 스크린샷 제작 전 화면별 캡처 대상을 정리합니다.
- 테스트용 샘플 프로필 입력 기준을 확인합니다.
- 민감정보 노출 여부를 점검합니다.
- 단정적 표현, 과장 표현, 투자/건강/합격 보장 표현이 없는지 점검합니다.
- 실제 스크린샷 이미지는 후속 단계에서 제작합니다.

## 2. 현재 상태

- 스크린샷 실제 이미지 생성 상태: Pending
- 테스트용 샘플 프로필 실제 입력 상태: Pending
- Android 실제 기기 또는 에뮬레이터 캡처 상태: Pending
- Google Play Console 업로드 상태: Not started
- 실제 개인정보 처리방침 URL 확인 상태: Pending
- 개인정보 처리방침 문의처 상태: Pending

## 3. 기준 문서

- 스크린샷 준비 문서: `docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md`
- 샘플 프로필 문서: `docs/STORE_SCREENSHOT_SAMPLE_PROFILE.md`
- 데이터 보안 입력 준비 문서: `docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md`
- 개인정보 처리방침 문의처 준비 문서: `docs/PRIVACY_POLICY_CONTACT_READINESS.md`
- Android Debug Build 복구 결과 문서: `docs/ANDROID_DEBUG_BUILD_RECOVERY_RESULT.md`

## 4. 캡처 대상 화면

| 화면 | 목적 | 상태 | 비고 |
| --- | --- | --- | --- |
| 홈 화면 | 앱 첫인상과 주요 기능 진입 확인 | Pending | 실제 캡처 전 |
| 프로필 입력 화면 | 생년월일시, 성별 입력 흐름 확인 | Pending | 민감정보 노출 주의 |
| 오늘의 풀이 화면 | 핵심 운세 결과 화면 확인 | Pending | 단정 표현 점검 |
| 사주 인사이트 화면 | 사주 기반 해석 화면 확인 | Pending | 참고용 문구 확인 |
| 저장한 풀이 화면 | 저장 기능 설명 확인 | Pending | 기능명은 저장한 풀이 |
| 설정 또는 개인정보 안내 화면 | 개인정보 안내 접근 확인 | Pending | 문의처 Pending 유지 |

## 5. 샘플 프로필 기준

- 샘플 프로필은 실제 사용자의 개인정보가 아니어야 합니다.
- `STORE_SCREENSHOT_SAMPLE_PROFILE.md` 기준을 따릅니다.
- 기능명은 `저장한 풀이`로 표기합니다.
- 피해야 할 문구 예시는 `투자하면 성공합니다.` 기준으로 점검합니다.

## 6. 금지 표현 점검 기준

스토어 스크린샷에는 아래 유형의 문구를 사용하지 않습니다.

- 합격을 보장합니다
- 투자하면 성공합니다
- 병이 낫습니다
- 반드시 돈을 법니다
- 결혼이 확정됩니다
- 결과를 보장합니다
- 100% 맞습니다
- 전문가 진단을 대체합니다

## 7. 민감정보 점검 기준

- 실제 이름 사용 금지
- 실제 생년월일 사용 금지
- 실제 연락처 사용 금지
- 실제 이메일 사용 금지
- 실제 가족 정보 사용 금지
- 실제 결제 정보 노출 금지
- 실제 위치 정보 노출 금지

## 8. 현재 보류 항목

- 실제 스토어 스크린샷 이미지 제작 미진행
- 테스트용 샘플 프로필 실제 입력 미진행
- Android 실제 기기 또는 에뮬레이터 캡처 미진행
- Google Play Console 스크린샷 업로드 미진행
- 개인정보 처리방침 URL 실제 확인 미진행
- 개인정보 처리방침 문의처 미확정
- release build 미진행
- signing 미진행
- AAB 생성 미진행

## 9. 다음 단계

- 테스트용 샘플 프로필 실제 입력
- 주요 화면 표시 확인
- Android 실제 기기 또는 에뮬레이터에서 캡처
- 민감정보 노출 여부 확인
- 금지 표현 여부 확인
- 실제 스토어 스크린샷 이미지 제작
- Google Play Console 업로드 준비
