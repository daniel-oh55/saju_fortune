# GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS

## 실제 URL 확인 결과 연계

- 개인정보 처리방침 실제 live URL 확인 결과는 `docs/PRIVACY_POLICY_LIVE_URL_RESULT.md`에서 관리합니다.
- 실제 URL 확인이 Completed로 바뀌기 전에는 Google Play Console 입력을 진행하지 않습니다.
- 실제 URL이 확인되어도 Console 입력은 별도 후속 단계에서 기록합니다.

## CI 복구 결과

- PR #101 이후 Android Debug Build run #29가 success로 확인되었습니다.
- harupuli-debug-apk artifact가 다시 생성되었습니다.
- Google Play Console 입력 전 CI debug build 상태가 정상화되었습니다.
- 실제 Console 입력은 아직 진행하지 않습니다.
- 복구 결과 문서는 `docs/ANDROID_DEBUG_BUILD_RECOVERY_RESULT.md`입니다.

## CI 상태 메모

- PR #100에서 개인정보 처리방침 URL 입력 준비 문서는 추가되었지만 Android Debug Build run #28은 Install dependencies 단계에서 실패했습니다.
- Google Play Console 입력 전 CI debug build 상태가 정상화되어야 합니다.
- 실제 Console 입력은 아직 진행하지 않습니다.

이 문서는 하루풀이 Android 앱을 Google Play Console에 제출하기 전 개인정보 처리방침 URL 입력 준비 상태를 정리한 문서입니다.
이번 PR은 입력 준비 문서화가 목적이며, 실제 Google Play Console 입력, 실제 Vercel URL 확정, release build, signing, AAB 생성, production 앱 로직 변경은 진행하지 않습니다.

## 1. 목적

- Google Play Console 개인정보 처리방침 URL 입력 전 필요한 조건을 정리합니다.
- 실제 URL이 확인되기 전까지 입력 상태를 Pending으로 유지합니다.
- 공개 개인정보 처리방침 페이지, 데이터 보안 양식 초안, 스토어 등록 정보 초안의 내용이 충돌하지 않는지 확인합니다.
- 실제 입력은 후속 단계에서 수동으로 진행합니다.

## 2. 현재 상태

- 공개 개인정보 처리방침 원본 파일: `public/privacy/index.html`
- build output 확인 문서: `docs/PRIVACY_POLICY_BUILD_OUTPUT_VERIFICATION.md`
- live URL 결과 문서: `docs/PRIVACY_POLICY_LIVE_URL_RESULT.md`
- 예상 공개 경로: `/privacy/`
- 예상 URL 형식: `https://<vercel-domain>/privacy/`
- 실제 Vercel URL: 미확정
- 실제 URL 확인 상태: Pending
- Google Play Console 입력 상태: Not started
- Google Play 데이터 보안 양식 최종 입력 상태: Not started

## 3. 입력 전 필수 조건

- 실제 HTTPS URL 확정
- `/privacy/` 경로가 404 없이 접근 가능
- 로그인 없이 접근 가능
- 모바일 브라우저에서 정상 표시
- 하루풀이 브랜드명 표시
- 개인정보 처리방침 제목 표시
- localStorage 안내 표시
- 서버 DB 없음 안내 표시
- 로그인 없음 안내 표시
- 실제 광고 SDK 없음 안내 표시
- 실제 결제 SDK 없음 안내 표시
- 외부 분석 SDK 없음 안내 표시
- 데이터 삭제 방법 표시
- 참고용 콘텐츠 고지 표시
- 외부 script 없음
- form 없음
- 문의처 확정 또는 제출 전 보완
- 데이터 보안 양식 초안과 충돌 없음
- 앱 내부 PrivacyInfoPage 안내와 충돌 없음

## 4. 입력 차단 조건

아래 항목 중 하나라도 해당하면 Google Play Console에 입력하지 않습니다.

- 실제 URL이 미확정인 경우
- `/privacy/` 경로가 404인 경우
- HTTP만 가능하고 HTTPS가 아닌 경우
- 로그인해야 접근 가능한 경우
- 개인정보 처리방침 페이지에 하루풀이가 아닌 다른 서비스명이 표시되는 경우
- 실제 광고 SDK, 결제 SDK, 분석 SDK 상태와 문서 내용이 다른 경우
- 데이터 보안 양식 초안과 공개 페이지 내용이 충돌하는 경우
- 문의처가 필요하지만 미확정인 경우
- 공개 페이지에 외부 script 또는 form이 포함된 경우

## 5. Google Play Console 입력값 후보

| 항목 | 값 | 상태 |
| --- | --- | --- |
| 개인정보 처리방침 URL | `https://<vercel-domain>/privacy/` | Pending |
| 입력 위치 | Google Play Console 앱 콘텐츠 또는 정책 관련 섹션 | 확인 필요 |
| 입력 주체 | 계정 관리자 또는 배포 담당자 | 확인 필요 |
| 입력 상태 | Not started | 실제 입력 금지 |
| 최종 검토 필요 여부 | 필요 | 실제 URL 확정 후 진행 |

주의:

- 위 URL은 후보 형식이며 실제 URL이 아닙니다.
- 실제 Vercel 배포 URL 확인 전에는 Google Play Console에 입력하지 않습니다.

## 6. 입력 후 확인 항목

- 입력한 URL이 외부 브라우저에서 열리는지 확인
- Google Play Console에 저장된 URL이 실제 `/privacy/` URL과 일치하는지 확인
- 개인정보 처리방침 페이지가 업데이트되면 Console 입력 URL이 계속 유효한지 확인
- 데이터 보안 양식과 개인정보 처리방침 내용이 충돌하지 않는지 확인
- 실제 광고 SDK, 결제 SDK, 로그인, 서버 DB가 추가되면 URL 문서와 Console 입력 내용을 재검토

## 7. 현재 보류 항목

- 실제 Vercel URL 확인 미진행
- Google Play Console 개인정보 처리방침 URL 입력 미진행
- Google Play 데이터 보안 양식 최종 입력 미진행
- 개인정보 처리방침 문의처 미확정
- Android 실제 기기 QA Blocked
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 미연동
- 실제 결제 SDK 미연동

## 8. 다음 단계

- Vercel 최신 배포 URL 확인
- `/privacy/` 실제 접근 결과 기록
- 문의처 확정
- Google Play Console 개인정보 처리방침 URL 입력
- Google Play 데이터 보안 양식 최종 입력 준비
