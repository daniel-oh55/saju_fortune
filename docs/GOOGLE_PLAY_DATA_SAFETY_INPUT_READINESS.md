# GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS

## Related Docs

- Privacy policy content draft: docs/PRIVACY_POLICY_CONTENT_DRAFT.md
- Local storage data inventory: docs/LOCAL_STORAGE_DATA_INVENTORY.md
- Google Play data safety draft checklist: docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT_CHECKLIST.md

## 샘플 프로필 화면 QA 결과 연계

- 샘플 프로필 화면 QA에서 실제 사용자 개인정보가 노출되지 않아야 합니다.
- 화면 QA 결과 문서는 `docs/STORE_SCREENSHOT_SAMPLE_PROFILE_SCREEN_QA_RESULT.md`입니다.
- 실제 스크린샷 이미지는 아직 생성하지 않습니다.

## 스토어 스크린샷 캡처 QA 연계

- 스토어 스크린샷에 개인정보 처리방침, 데이터 보안 양식, 앱 내부 안내와 충돌하는 문구가 없어야 합니다.
- 캡처 QA 결과 문서는 `docs/STORE_SCREENSHOT_CAPTURE_QA_RESULT.md`입니다.
- 실제 캡처 이미지는 아직 생성하지 않습니다.

이 문서는 하루풀이 Android 앱의 Google Play 데이터 보안 양식 최종 입력 전 준비 상태를 정리하기 위한 문서입니다.
이번 PR은 입력 준비 문서화가 목적이며, 실제 Google Play Console 입력, 실제 데이터 보안 양식 제출, release build, signing, AAB 생성, production 앱 로직 변경은 진행하지 않습니다.

## 1. 목적

- Google Play 데이터 보안 양식 최종 입력 전 확인 기준을 정리합니다.
- 현재 앱의 데이터 처리 상태와 개인정보 처리방침 초안의 내용이 충돌하지 않는지 확인합니다.
- 실제 Console 입력 전 차단 조건을 명확히 합니다.
- 실제 입력은 후속 단계에서 수동으로 진행합니다.

## 2. 현재 데이터 처리 상태

- 사용자 입력 프로필은 브라우저 localStorage에 저장됩니다.
- 저장한 풀이도 localStorage에 저장됩니다.
- 방문 기록 또는 연속 방문 정보도 localStorage 중심으로 관리됩니다.
- 서버 DB는 사용하지 않습니다.
- 로그인 기능은 없습니다.
- 실제 광고 SDK는 연결되어 있지 않습니다.
- 실제 결제 SDK는 연결되어 있지 않습니다.
- 외부 분석 SDK는 연결되어 있지 않습니다.
- 현재 앱은 사용자의 개인정보를 외부 서버로 전송하지 않습니다.
- 현재 앱은 제3자에게 사용자 데이터를 공유하지 않습니다.
- 데이터 삭제는 브라우저 데이터 삭제 또는 Android 앱 데이터 삭제로 처리할 수 있습니다.

## 3. 입력 전 필수 확인 항목

- `public/privacy/index.html` 내용 확인
- PrivacyInfoPage 내용 확인
- `docs/PRIVACY_POLICY_DRAFT.md` 내용 확인
- `docs/PRIVACY_POLICY_CONTACT_READINESS.md` 문의처 상태 확인
- `docs/PRIVACY_POLICY_LIVE_URL_RESULT.md` 실제 URL 상태 확인
- localStorage 저장 안내 확인
- 서버 DB 없음 안내 확인
- 로그인 없음 안내 확인
- 실제 광고 SDK 없음 안내 확인
- 실제 결제 SDK 없음 안내 확인
- 외부 분석 SDK 없음 안내 확인
- 데이터 삭제 방법 안내 확인
- 참고용 콘텐츠 고지 확인
- Google Play Console 개인정보 처리방침 URL 입력 상태 확인

## 4. 데이터 보안 양식 입력 준비 상태

| 항목 | 현재 판단 | 상태 |
| --- | --- | --- |
| 데이터 수집 여부 | 서버로 전송하지 않음 | 초안 기준 |
| 데이터 공유 여부 | 제3자 공유 없음 | 초안 기준 |
| 로그인 정보 | 로그인 기능 없음 | 초안 기준 |
| 위치 정보 | 수집하지 않음 | 초안 기준 |
| 연락처 | 수집하지 않음 | 초안 기준 |
| 결제 정보 | 실제 결제 SDK 없음 | 초안 기준 |
| 광고 식별자 | 실제 광고 SDK 없음 | 초안 기준 |
| 분석 데이터 | 외부 분석 SDK 없음 | 초안 기준 |
| 로컬 저장 데이터 | localStorage 사용 | 초안 기준 |
| 삭제 방법 | 브라우저/앱 데이터 삭제 | 초안 기준 |
| 개인정보 처리방침 URL | 실제 URL 미확정 | Pending |
| 문의처 | 미확정 | Pending |
| Console 입력 상태 | Not started | 실제 입력 금지 |

주의:

- 위 표는 현재 구현 상태 기준의 입력 준비 자료입니다.
- 실제 Google Play Console 데이터 보안 양식 입력값으로 확정하지 않습니다.
- 실제 SDK, 로그인, 서버 DB, 분석 도구가 추가되면 반드시 다시 검토해야 합니다.

## 5. 입력 차단 조건

아래 조건 중 하나라도 해당하면 Google Play 데이터 보안 양식을 최종 입력하지 않습니다.

- 실제 개인정보 처리방침 URL이 미확정인 경우
- 개인정보 처리방침 문의처가 미확정인 경우
- `public/privacy/index.html`과 데이터 보안 양식 초안이 충돌하는 경우
- PrivacyInfoPage와 데이터 보안 양식 초안이 충돌하는 경우
- 실제 광고 SDK가 추가되었지만 문서가 갱신되지 않은 경우
- 실제 결제 SDK가 추가되었지만 문서가 갱신되지 않은 경우
- 로그인 기능이 추가되었지만 문서가 갱신되지 않은 경우
- 서버 DB 또는 외부 API 저장이 추가되었지만 문서가 갱신되지 않은 경우
- 외부 분석 SDK가 추가되었지만 문서가 갱신되지 않은 경우
- 데이터 삭제 방법이 명확하지 않은 경우

## 6. 입력 후 확인 항목

- Google Play Console에 저장된 데이터 보안 응답이 문서 초안과 일치하는지 확인
- 개인정보 처리방침 URL과 데이터 보안 양식 내용이 충돌하지 않는지 확인
- 앱 내부 PrivacyInfoPage와 데이터 보안 양식 내용이 충돌하지 않는지 확인
- 스토어 등록 정보의 앱 설명과 데이터 보안 응답이 충돌하지 않는지 확인
- 실제 광고 SDK, 결제 SDK, 로그인, 서버 DB, 분석 SDK가 추가되면 데이터 보안 양식 재검토

## 7. 현재 보류 항목

- 실제 Google Play Console 데이터 보안 양식 입력 미진행
- 실제 개인정보 처리방침 URL 미확정
- 실제 문의처 미확정
- Google Play Console 개인정보 처리방침 URL 입력 미진행
- Android 실제 기기 QA Blocked
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 미연동
- 실제 결제 SDK 미연동

## 8. 다음 단계

- 실제 개인정보 처리방침 문의처 확정
- Vercel `/privacy/` 실제 URL 확인
- Google Play Console 개인정보 처리방침 URL 입력
- Google Play 데이터 보안 양식 최종 입력
- Android 실제 기기 QA
- release build, signing, AAB 생성 준비
