# GOOGLE_PLAY_DATA_SAFETY_DRAFT

## 공개 개인정보 처리방침 페이지 연결

- 공개 개인정보 처리방침 후보 페이지는 `public/privacy/index.html`입니다.
- 데이터 보안 양식 초안과 공개 개인정보 처리방침 페이지의 데이터 저장, 공유, 삭제 설명은 일치해야 합니다.
- 실제 Google Play 제출 전 최종 URL을 확인해야 합니다.

## 스크린샷 샘플 데이터 주의사항

- 스토어 스크린샷에는 실제 사용자 데이터가 노출되지 않아야 합니다.
- 테스트용 샘플 프로필 기준은 `docs/STORE_SCREENSHOT_SAMPLE_PROFILE.md`를 참고합니다.
- 스크린샷 문구는 데이터 보안 양식 초안과 충돌하지 않아야 합니다.

이 문서는 하루풀이 Android 앱을 Google Play에 제출하기 전 데이터 보안 양식 입력을 준비하기 위한 초안 문서입니다.
이번 PR은 데이터 보안 양식 초안 문서화가 목적이며, 실제 Google Play Console 입력, 실제 SDK 연동, production 앱 로직 변경은 진행하지 않습니다.

## 스크린샷 준비 시 개인정보 주의사항

- 스토어 스크린샷에는 실제 사용자의 생년월일, 출생시간, 성별 등 민감 정보가 노출되지 않아야 합니다.
- 테스트용 샘플 프로필을 사용해야 합니다.
- 개인정보 처리방침, 데이터 보안 양식, 앱 내부 PrivacyInfoPage의 안내와 충돌하는 문구를 사용하지 않습니다.

## 1. 목적

- 현재 MVP 기준의 데이터 저장, 수집, 공유, 외부 전송 여부를 정리합니다.
- Google Play 데이터 보안 양식 작성 전 사전 검토 자료로 사용합니다.
- 실제 광고 SDK, 결제 SDK, 로그인, 서버 DB, 외부 분석 SDK가 추가되기 전후의 차이를 분리합니다.
- 최종 Google Play 제출 전에는 실제 구현 상태와 개인정보 처리방침 URL을 다시 대조해야 합니다.

## 2. 현재 MVP 구현 상태

현재 사용하지 않는 기능:

- 로그인 없음
- 서버 DB 없음
- 실제 광고 SDK 없음
- 실제 결제 SDK 없음
- 외부 분석 SDK 없음
- push notification 없음
- 위치 정보 수집 없음
- 연락처 접근 없음
- 사진/파일 접근 없음
- 마이크/카메라 접근 없음

현재 저장 방식:

- 브라우저 또는 Android WebView localStorage 중심 저장
- 서버 전송 없음
- 외부 SDK 전송 없음

현재 앱 내부 관련 문서:

- `docs/PRIVACY_POLICY_URL_READINESS.md`
- `docs/PRIVACY_POLICY_DRAFT.md`
- `docs/PRIVACY_DATA_MAP.md`
- `docs/COOKIE_AD_CONSENT_UX.md`
- `docs/GOOGLE_PLAY_STORE_LISTING_DRAFT.md`

## 3. 현재 localStorage 저장 항목

| 항목 | 저장 위치 | 목적 | 외부 전송 | 비고 |
| --- | --- | --- | --- | --- |
| 프로필 정보 | localStorage | 운세/사주 계산 및 재방문 편의 | 없음 | 생년월일, 시간, 성별 등 사용자가 입력한 정보 |
| 오늘의 운세 cache | localStorage | 같은 날짜 동일 결과 유지 | 없음 | 매일 운세 재생성 방지 |
| 사주 분석 cache | localStorage | 사주 요약/인사이트 표시 | 없음 | 앱 내부 계산 결과 |
| 보상 unlock 상태 | localStorage | 광고 시청형 상세 콘텐츠 unlock 상태 관리 | 없음 | 실제 광고 SDK 미연동 |
| 동의 설정 | localStorage | 광고/분석/개인화 동의 UI 상태 관리 | 없음 | 실제 SDK 호출 없음 |
| 저장한 풀이 | localStorage | 사용자가 저장한 운세/사주 결과 보관 | 없음 | 민감 입력값 제외 원칙 유지 |
| 방문 streak | localStorage | 재방문 루틴 표시 | 없음 | 날짜/횟수 중심 |

## 4. Google Play 데이터 보안 양식 초안 판단

현재 MVP 기준 판단 초안:

- 앱이 서버로 사용자 데이터를 전송하지 않습니다.
- 실제 광고 SDK가 없습니다.
- 실제 결제 SDK가 없습니다.
- 실제 분석 SDK가 없습니다.
- 로그인 기능이 없습니다.
- 저장 데이터는 localStorage에 머뭅니다.
- 따라서 현재 구현 기준으로는 외부 수집/공유 항목이 없다고 판단할 수 있습니다.
- 단, Google Play 최종 제출 전에는 실제 빌드와 개인정보 처리방침 URL을 기준으로 다시 검토해야 합니다.

주의:

- localStorage에 사용자가 입력한 생년월일, 시간, 성별 등이 저장될 수 있으므로 개인정보 처리방침에는 명확히 고지해야 합니다.
- 향후 실제 광고 SDK, 결제 SDK, 분석 SDK, 로그인, 서버 DB가 추가되면 데이터 보안 양식은 반드시 갱신해야 합니다.

## 5. 데이터 유형 후보 매핑

| 데이터 유형 후보 | 현재 MVP 상태 | 비고 |
| --- | --- | --- |
| Personal info | 기기 내 저장 가능 | 생년월일, 성별 등 프로필 입력값이 localStorage에 저장될 수 있음 |
| Financial info | 수집 없음 | 실제 결제 SDK 없음 |
| Location | 수집 없음 | 위치 권한 없음 |
| Contacts | 수집 없음 | 연락처 권한 없음 |
| Photos and videos | 수집 없음 | 파일/사진 접근 없음 |
| Audio | 수집 없음 | 마이크 접근 없음 |
| Files and docs | 수집 없음 | 파일 접근 없음 |
| App activity | 외부 수집 없음 | 방문 streak는 localStorage 내부 저장 |
| Web browsing | 수집 없음 | 외부 브라우징 기록 수집 없음 |
| App info and performance | 외부 수집 없음 | 외부 분석 SDK 없음 |
| Device or other IDs | 외부 수집 없음 | 실제 광고/분석 SDK 없음 |

## 6. 데이터 공유 여부 초안

현재 MVP:

- 제3자와 데이터 공유 없음
- 광고 네트워크 전송 없음
- 분석 서비스 전송 없음
- 결제 서비스 전송 없음
- 서버 DB 전송 없음

향후 변경 시:

- AdMob 또는 기타 광고 SDK 연결 시 광고 SDK 데이터 항목 확인 필요
- 결제 SDK 연결 시 결제 관련 데이터 항목 확인 필요
- 분석 SDK 연결 시 앱 사용 데이터 항목 확인 필요
- 로그인/서버 DB 연결 시 계정 및 서버 저장 데이터 항목 확인 필요

## 7. 보안 및 삭제 방식 초안

현재 MVP:

- 데이터는 사용자의 기기 localStorage에 저장됩니다.
- 앱 내부 설정 또는 브라우저/앱 데이터 삭제를 통해 초기화할 수 있습니다.
- Android 앱에서는 앱 정보 > 저장공간 > 데이터 삭제 또는 `adb shell pm clear com.harupuli.app`로 초기화할 수 있습니다.
- 서버 DB가 없으므로 서버 삭제 요청 대상은 현재 없습니다.

추후 서버 DB 또는 계정 기능 추가 시:

- 사용자 데이터 삭제 요청 절차 필요
- 계정 삭제 절차 필요
- 서버 저장 데이터 삭제 정책 필요

## 8. 개인정보 처리방침과의 일치 확인

- 데이터 보안 양식 초안은 `docs/PRIVACY_POLICY_URL_READINESS.md`와 일치해야 합니다.
- 외부 공개 개인정보 처리방침 URL이 준비되면 본 문서와 다시 대조해야 합니다.
- 앱 내부 PrivacyInfoPage의 안내 내용과도 일치해야 합니다.
- 실제 SDK 연동 전후로 문서를 모두 갱신해야 합니다.

## 9. 현재 보류 항목

- 실제 Google Play Console 데이터 보안 양식 입력 미진행
- 개인정보 처리방침 외부 공개 URL 미배포
- 실제 광고 SDK 미연동
- 실제 결제 SDK 미연동
- 로그인 미구현
- 서버 DB 미연동
- 외부 분석 SDK 미연동
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- Android 실제 QA Blocked

## 10. 다음 단계

- 개인정보 처리방침 외부 공개 URL 배포
- Google Play 데이터 보안 양식 최종 입력 전 재검토
- 실제 광고 SDK 연결 시 데이터 보안 양식 갱신
- 실제 결제 SDK 연결 시 데이터 보안 양식 갱신
- Android 실제 QA 재시도
- release build/signing 준비
