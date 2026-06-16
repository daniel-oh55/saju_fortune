# PRIVACY_POLICY_BUILD_OUTPUT_VERIFICATION

## build output 이후 live URL 확인

- `dist/privacy/index.html` 확인 이후 Vercel `/privacy/` 실제 접근 확인을 진행합니다.
- 결과는 `docs/PRIVACY_POLICY_LIVE_URL_RESULT.md`에 기록합니다.
- 실제 URL 확인 후에도 Google Play Console 입력은 별도 단계입니다.

## Google Play Console 입력 준비 연계

- build output 확인 후 실제 URL 확인과 Google Play Console 입력 준비를 진행합니다.
- 입력 준비 문서는 `docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md`입니다.
- 실제 Console 입력은 후속 단계입니다.

## live URL 결과 문서 연계

- build output 확인 이후 실제 Vercel 배포 URL 확인 결과를 별도 문서에 기록합니다.
- 문서 경로는 `docs/PRIVACY_POLICY_LIVE_URL_RESULT.md`입니다.
- 실제 URL 확인은 후속 수동 확인 단계입니다.

이 문서는 하루풀이 공개 개인정보 처리방침 페이지가 Vite build 산출물에 포함되는지 확인하기 위한 문서입니다.
이번 PR은 build output 검증 문서화가 목적이며, 실제 Vercel URL 접속 확인, Google Play Console 입력, release build, signing, AAB 생성, production 앱 로직 변경은 진행하지 않습니다.

## 1. 목적

- `public/privacy/index.html`이 Vite build 후 `dist/privacy/index.html`로 복사되는지 확인합니다.
- Vercel 배포 전 build output 기준으로 `/privacy/` 정적 페이지 준비 상태를 검증합니다.
- Google Play 개인정보 처리방침 URL 입력 전 사전 확인 자료로 사용합니다.
- 실제 외부 URL 확인은 Vercel 배포 후 별도 단계에서 진행합니다.

## 2. 확인 대상

- 원본 정적 파일: `public/privacy/index.html`
- build 산출물 예상 파일: `dist/privacy/index.html`
- 예상 공개 경로: `/privacy/`
- 실제 Vercel URL: 미확정
- Google Play Console 입력 상태: 미진행
- build output 확인 상태: Pending

## 3. 사전 조건

- `npm run build`가 성공해야 합니다.
- `dist/` 폴더가 생성되어야 합니다.
- `dist/privacy/index.html`이 존재해야 합니다.
- build output 안의 privacy page에 `하루풀이 개인정보 처리방침` 문구가 있어야 합니다.
- build output 안의 privacy page에 localStorage 안내가 있어야 합니다.
- build output 안의 privacy page에 외부 script와 form이 없어야 합니다.

## 4. 확인 절차

1. `npm install`을 실행합니다.
2. `npm run build`를 실행합니다.
3. `dist/privacy/index.html`이 생성되었는지 확인합니다.
4. `dist/privacy/index.html`에 `하루풀이 개인정보 처리방침` 문구가 있는지 확인합니다.
5. `dist/privacy/index.html`에 localStorage 안내가 있는지 확인합니다.
6. `dist/privacy/index.html`에 실제 광고 SDK 없음, 실제 결제 SDK 없음, 외부 분석 SDK 없음 문구가 있는지 확인합니다.
7. 외부 script 또는 form이 없는지 확인합니다.
8. `npm run check:privacy-policy-build-output`을 실행합니다.

## 5. 확인 결과 기록 양식

| 항목 | 결과 | 비고 |
| --- | --- | --- |
| npm run build | Pending | CI 또는 로컬 실행 필요 |
| dist 폴더 생성 | Pending | build 후 확인 |
| dist/privacy/index.html 생성 | Pending | build 후 확인 |
| 하루풀이 브랜드명 표시 | Pending | build 후 확인 |
| localStorage 안내 표시 | Pending | build 후 확인 |
| 실제 광고 SDK 없음 안내 표시 | Pending | build 후 확인 |
| 실제 결제 SDK 없음 안내 표시 | Pending | build 후 확인 |
| 외부 분석 SDK 없음 안내 표시 | Pending | build 후 확인 |
| 외부 script 없음 | Pending | build 후 확인 |
| form 없음 | Pending | build 후 확인 |
| 실제 Vercel URL 확인 | Pending | 후속 단계 |

## 6. Google Play Console 입력 전 기준

- build output에 privacy page가 포함되어 있어야 합니다.
- Vercel 배포 후 `/privacy/` 실제 접근이 확인되어야 합니다.
- Google Play Console 입력 전 실제 HTTPS URL이 확정되어야 합니다.
- 공개 페이지의 서비스명은 `하루풀이`여야 합니다.
- 공개 페이지와 PrivacyInfoPage, 데이터 보안 양식 초안이 충돌하지 않아야 합니다.
- 문의처는 제출 전 확정해야 합니다.

## 7. 현재 보류 항목

- 실제 Vercel URL 확인 미진행
- Google Play Console 입력 미진행
- 개인정보 처리방침 문의처 미확정
- Android 실제 기기 QA Blocked
- release build 미진행
- signing 미진행
- AAB 생성 미진행
- 실제 광고 SDK 미연동
- 실제 결제 SDK 미연동

## 8. 다음 단계

- `npm run build` 후 build output 확인
- Vercel 최신 배포 URL 확인
- `/privacy/` 실제 접근 확인
- 모바일 브라우저 표시 확인
- Google Play Console 개인정보 처리방침 URL 입력 준비
