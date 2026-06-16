# PRIVACY_POLICY_URL_VERIFICATION

## Google Play Console 입력 준비 연계

- Google Play Console 개인정보 처리방침 URL 입력 준비 문서를 추가했습니다.
- 문서 경로는 `docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md`입니다.
- 실제 URL 확인 전에는 Console 입력을 진행하지 않습니다.

## 실제 URL 확인 결과 문서

- 실제 Vercel 배포 URL 확인 결과를 기록하기 위한 문서를 추가했습니다.
- 문서 경로는 `docs/PRIVACY_POLICY_LIVE_URL_RESULT.md`입니다.
- 현재 실제 URL 확인 상태는 Pending입니다.
- Google Play Console 입력은 아직 진행하지 않습니다.

## build output 확인

- 개인정보 처리방침 페이지의 build output 확인 문서를 추가했습니다.
- 문서 경로는 `docs/PRIVACY_POLICY_BUILD_OUTPUT_VERIFICATION.md`입니다.
- `npm run build` 후 `dist/privacy/index.html` 생성 여부를 확인해야 합니다.
- 실제 Vercel URL 접근 확인은 후속 단계입니다.

이 문서는 하루풀이 공개 개인정보 처리방침 페이지가 Vercel 배포 후 `/privacy/` 경로에서 접근 가능한지 확인하기 위한 절차와 결과 기록 문서입니다.
이번 PR은 URL 확인 준비 문서화가 목적이며, 실제 Google Play Console 입력, release build, signing, AAB 생성, production 앱 로직 변경은 진행하지 않습니다.

## 1. 목적

- Google Play 제출 전 개인정보 처리방침 URL 접근 가능 여부를 확인합니다.
- `public/privacy/index.html` 정적 페이지가 배포 환경에서 `/privacy/` 경로로 노출되는지 확인합니다.
- 앱 이름, 개인정보 처리방침 문구, localStorage 저장 안내, 실제 SDK 미연동 상태가 공개 페이지에 정상 표시되는지 확인합니다.
- Google Play Console 입력 전 검토 기준으로 사용합니다.

## 2. 확인 대상

- 정적 파일 경로: `public/privacy/index.html`
- 예상 배포 경로: `/privacy/`
- 예상 URL 형식: `https://<vercel-domain>/privacy/`
- 실제 최종 URL: 미확정
- Google Play Console 입력 상태: 미진행
- 개인정보 처리방침 외부 공개 URL 배포 확인 상태: Pending

## 3. 사전 조건

- main 브랜치에 PR #92 이후 변경 사항이 병합되어 있어야 합니다.
- Vercel 배포가 성공해야 합니다.
- `public/privacy/index.html`이 빌드 산출물에 포함되어야 합니다.
- 외부 브라우저에서 로그인 없이 접근 가능해야 합니다.
- HTTPS URL이어야 합니다.
- 모바일 브라우저에서 읽을 수 있어야 합니다.

## 4. 수동 확인 절차

1. Vercel 프로젝트 배포 상태를 확인합니다.
2. 최신 main 배포 URL을 확인합니다.
3. 브라우저에서 `https://<vercel-domain>/privacy/`에 접속합니다.
4. 페이지 제목이 `하루풀이 개인정보 처리방침`인지 확인합니다.
5. 서비스명이 `하루풀이`인지 확인합니다.
6. localStorage 중심 저장 안내가 있는지 확인합니다.
7. 서버 DB 없음, 로그인 없음, 실제 광고 SDK 없음, 실제 결제 SDK 없음, 외부 분석 SDK 없음 안내가 있는지 확인합니다.
8. 데이터 삭제 방법이 있는지 확인합니다.
9. 참고용 콘텐츠 고지가 있는지 확인합니다.
10. 외부 script 또는 form이 없는지 확인합니다.
11. 모바일 브라우저에서도 정상 표시되는지 확인합니다.

## 5. 확인 결과 기록 양식

| 항목 | 결과 | 비고 |
| --- | --- | --- |
| Vercel 최신 배포 확인 | Pending | 실제 배포 URL 확인 필요 |
| `/privacy/` 접근 | Pending | 실제 URL 미확정 |
| HTTPS 접근 | Pending | 실제 URL 미확정 |
| 로그인 없이 접근 | Pending | 실제 URL 미확정 |
| 모바일 표시 | Pending | 실제 기기 또는 브라우저 확인 필요 |
| 서비스명 하루풀이 표시 | Pending | 실제 URL 확인 필요 |
| localStorage 안내 표시 | Pending | 실제 URL 확인 필요 |
| 서버 DB 없음 안내 표시 | Pending | 실제 URL 확인 필요 |
| 실제 광고 SDK 없음 안내 표시 | Pending | 실제 URL 확인 필요 |
| 실제 결제 SDK 없음 안내 표시 | Pending | 실제 URL 확인 필요 |
| 외부 분석 SDK 없음 안내 표시 | Pending | 실제 URL 확인 필요 |
| 데이터 삭제 방법 표시 | Pending | 실제 URL 확인 필요 |
| 참고용 콘텐츠 고지 표시 | Pending | 실제 URL 확인 필요 |

## 6. Google Play Console 입력 전 기준

Google Play Console에 개인정보 처리방침 URL을 입력하기 전 다음 조건을 충족해야 합니다.

- 실제 HTTPS URL 확정
- 로그인 없이 접근 가능
- 모바일 브라우저 정상 표시
- 앱 이름 `하루풀이`와 일치
- 스토어 등록 정보의 앱 이름과 일치
- 데이터 보안 양식 초안과 내용 충돌 없음
- PrivacyInfoPage의 앱 내부 안내와 내용 충돌 없음
- 실제 광고 SDK, 결제 SDK, 로그인, 서버 DB 상태 반영
- 문의처 확정 또는 제출 전 별도 보완

## 7. 현재 보류 항목

- 실제 URL 확인 미진행
- Vercel 배포 URL 최종 확인 미진행
- Google Play Console 입력 미진행
- 개인정보 처리방침 문의처 미확정
- Android 실제 기기 QA Blocked
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 미연동
- 실제 결제 SDK 미연동

## 8. 다음 단계

- Vercel 최신 배포 URL 확인
- `/privacy/` 실제 접근 확인
- 모바일 브라우저 표시 확인
- 문의처 확정
- Google Play Console 개인정보 처리방침 URL 입력 준비
