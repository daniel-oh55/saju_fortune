# PRIVACY_POLICY_URL_READINESS

## 공개 개인정보 처리방침 페이지 브랜드명 정합성

- `public/privacy/index.html`의 서비스명 표기를 `하루풀리` 기준으로 확인했습니다.
- 공개 개인정보 처리방침 URL 후보 페이지에는 `하루풀이` 오타가 남아 있지 않아야 합니다.
- Google Play 제출 전 앱 이름, 스토어 등록 정보, 개인정보 처리방침 페이지의 서비스명이 모두 일치해야 합니다.

## 공개 개인정보 처리방침 페이지 scaffold

- 공개 개인정보 처리방침 후보 페이지를 추가했습니다.
- 정적 페이지 경로는 `public/privacy/index.html`입니다.
- Vercel 배포 후 예상 접근 경로는 `/privacy/`입니다.
- 실제 최종 URL은 배포 후 확인해야 합니다.
- Google Play Console 입력은 아직 진행하지 않았습니다.

## 스크린샷 샘플 프로필 주의사항

- 스토어 스크린샷에는 실제 사용자 개인정보가 노출되지 않아야 합니다.
- 테스트용 샘플 프로필 기준은 `docs/STORE_SCREENSHOT_SAMPLE_PROFILE.md`입니다.
- 개인정보 처리방침 URL의 데이터 저장 설명과 스크린샷에 표시되는 문구가 충돌하지 않아야 합니다.

이 문서는 하루풀이 앱을 Google Play에 제출하기 전 개인정보 처리방침 URL을 준비하기 위한 체크리스트입니다.
이번 PR은 개인정보 처리방침 URL 준비 문서화가 목적이며, 실제 URL 배포, Google Play Console 입력, production 앱 로직 변경은 진행하지 않습니다.

## Google Play 데이터 보안 양식 초안

- Google Play 데이터 보안 양식 초안 문서를 추가합니다.
- 문서 경로는 `docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT.md`입니다.
- 현재 MVP는 localStorage 중심이며 서버 DB, 로그인, 실제 광고 SDK, 실제 결제 SDK, 외부 분석 SDK는 아직 사용하지 않습니다.
- 실제 SDK 연동 전후로 개인정보 처리방침 URL과 데이터 보안 양식을 함께 갱신해야 합니다.

## 1. 목적

- Google Play 제출 전 개인정보 처리방침 URL 준비 항목을 정리합니다.
- 현재 MVP의 데이터 저장 구조와 실제 SDK 미연동 상태를 기준으로 개인정보 처리방침 문서 준비 범위를 정의합니다.
- 실제 광고 SDK, 분석 SDK, 결제 SDK, 로그인, 서버 DB를 연결하기 전후에 갱신해야 할 항목을 분리합니다.

## 2. 현재 앱 데이터 처리 상태

현재 MVP 저장 방식:

- 서버 DB 없음
- 로그인 없음
- 실제 광고 SDK 없음
- 실제 결제 SDK 없음
- 외부 분석 SDK 없음
- 브라우저 또는 Android WebView localStorage 중심 저장

현재 저장될 수 있는 항목:

- 사용자가 입력한 프로필 정보
- 오늘의 운세 cache
- 사주 분석 cache
- 보상 unlock 상태
- 동의 설정
- 저장한 풀이
- 방문 streak

현재 외부 전송:

- 실제 서버 전송 없음
- 실제 광고 SDK 전송 없음
- 실제 결제 SDK 전송 없음
- 실제 분석 SDK 전송 없음

## 3. 개인정보 처리방침 URL 후보

### 후보 1. Vercel 정적 페이지

- `/privacy`
- `/privacy-policy`
- 앱과 같은 도메인에서 제공 가능
- 추후 routing 또는 정적 HTML 검토 필요

### 후보 2. GitHub Pages

- 별도 privacy policy 문서 공개 가능
- 앱 도메인과 분리 가능
- 관리가 단순함

### 후보 3. 회사 또는 개인 도메인

- 신뢰도가 높음
- 운영 주체/문의처 명확화 가능
- 도메인 관리 필요

권장 초안:

- MVP 단계에서는 Vercel 또는 GitHub Pages 중 하나로 시작
- Google Play 제출 전에는 외부에서 로그인 없이 접근 가능한 HTTPS URL이어야 함
- 앱 내부 PrivacyInfoPage와 외부 개인정보 처리방침 URL의 내용이 서로 충돌하지 않아야 함

## 4. URL에 포함되어야 할 기본 항목

- 서비스명
- 운영자 또는 문의처
- 수집 또는 저장하는 정보
- 저장 위치
- 이용 목적
- 외부 제공 여부
- 광고 SDK 사용 여부
- 분석 SDK 사용 여부
- 결제 SDK 사용 여부
- 사용자 데이터 삭제 방법
- 문의 방법
- 시행일 또는 최종 수정일

## 5. 현재 MVP 기준 개인정보 처리방침 핵심 문구 후보

하루풀이는 현재 서버 데이터베이스 없이 사용자의 기기 브라우저 또는 Android WebView의 localStorage를 중심으로 프로필, 운세 cache, 동의 설정, 저장한 풀이, 방문 streak 등의 정보를 저장합니다.

현재 버전에서는 로그인, 서버 DB 저장, 실제 광고 SDK, 실제 결제 SDK, 외부 분석 SDK를 사용하지 않습니다.

향후 광고 SDK, 분석 SDK, 결제 SDK, 로그인, 서버 DB 기능이 추가될 경우 개인정보 처리방침과 Google Play 데이터 보안 입력 항목을 갱신해야 합니다.

하루풀이의 운세와 사주 결과는 오락 및 참고용 콘텐츠이며, 의학, 법률, 투자, 진로, 심리 상담 등 전문적인 자문을 대체하지 않습니다.

## 6. 앱 내부 개인정보 안내와의 연결

- 앱 내부 PrivacyInfoPage는 MVP 데이터 저장 구조를 안내합니다.
- 외부 개인정보 처리방침 URL은 Google Play 제출용 공개 문서 역할을 합니다.
- 두 문서의 데이터 저장 항목, 광고 SDK 사용 여부, 외부 전송 여부가 서로 일치해야 합니다.
- 실제 광고 SDK 또는 결제 SDK를 연결하기 전에는 두 문서를 모두 갱신해야 합니다.

## 7. Google Play 제출 전 확인 항목

- 개인정보 처리방침 URL이 HTTPS로 접근 가능
- 로그인 없이 접근 가능
- 모바일 브라우저에서 정상 표시
- 앱 이름 하루풀이와 일치
- localStorage 저장 항목 설명 포함
- 실제 광고 SDK 사용 여부 반영
- 실제 결제 SDK 사용 여부 반영
- 데이터 삭제 방법 포함
- 문의처 포함
- 앱 내부 PrivacyInfoPage와 내용 일치
- Google Play Store listing 문구와 내용 충돌 없음
- Google Play 데이터 보안 양식과 Data Safety 입력 내용 일치

## 8. 현재 보류 항목

- 실제 개인정보 처리방침 URL 배포 미진행
- Google Play Console 입력 미진행
- 실제 광고 SDK 미연동
- 실제 결제 SDK 미연동
- 로그인 미구현
- 서버 DB 미연동
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- Android 실제 기기 QA Blocked

## 9. 다음 단계

- 개인정보 처리방침 외부 공개 문서 작성
- Vercel 또는 GitHub Pages 배포 방식 결정
- Google Play 데이터 보안 양식 초안 작성
- 실제 광고 SDK 연동 전 개인정보 처리방침 갱신
- Google Play 내부 테스트 전 URL 최종 확인
