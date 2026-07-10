# Privacy URL and Support Contact Candidate Plan

- Status: Candidate plan only
- 개인정보 처리방침 URL 후보 선정: Pending
- 문의처 이메일/지원 연락처 후보 선정: Pending
- 개인정보 처리방침 URL 확정: Pending
- 문의처 이메일/지원 연락처 확정: Pending
- Google Play Console input: Pending
- Store screenshot upload: Pending
- Google Play 데이터 보안 양식 최종 입력: Pending

## 1. Scope

- Purpose: Document candidate selection and verification plan for privacy policy URL and support contact before Google Play Console input
- PR type: docs/check-only
- App name: 하루풀이
- Related privacy URL/support contact finalization checklist PR: #345
- Related privacy policy draft PR: #329
- Related support contact readiness PR: #330
- Related Store listing final text PR: #342
- Current Google Play Console input status: Pending
- Current Store screenshot upload status: Pending
- Current release build status: Not started
- No production code changes
- No Android native/resource changes
- No image file changes

## 2. Privacy policy URL candidate plan

| Candidate item | Status | Note |
| --- | --- | --- |
| Public privacy policy URL candidate | Pending | 실제 URL 후보 필요 |
| Hosting method candidate | Pending | 예: 별도 웹페이지, 정적 호스팅, 기존 웹 도메인 등 |
| URL accessibility check | Pending | 브라우저 접속 확인 필요 |
| Mobile display check | Pending | 모바일 브라우저 표시 확인 필요 |
| Privacy policy content sync | Pending | docs/PRIVACY_POLICY_DRAFT.md와 실제 공개 페이지 내용 일치 확인 필요 |
| Placeholder removal check | Pending | 문의처/시행일/제공자 정보 placeholder 제거 필요 |
| Final URL decision | Pending | 실제 URL 확정 전 |

주의:
- 이번 PR에서는 실제 URL을 넣지 않습니다.
- 임의 URL을 생성하지 않습니다.
- 실제 공개 URL이 확인되기 전까지 Completed로 쓰지 않습니다.

## 3. Support contact candidate plan

| Candidate item | Status | Note |
| --- | --- | --- |
| Support email/contact candidate | Pending | 실제 문의처 후보 필요 |
| Email receiving test | Pending | 테스트 메일 수신 확인 필요 |
| Sender/reply test | Pending | 답변 가능 여부 확인 필요 |
| Store listing contact consistency | Pending | Google Play Console 입력값과 문서값 일치 필요 |
| Privacy policy contact sync | Pending | 개인정보 처리방침 내 문의처와 일치 필요 |
| Final support contact decision | Pending | 실제 문의처 확정 전 |

주의:
- 이번 PR에서는 실제 문의처 이메일을 넣지 않습니다.
- 임의 이메일을 생성하지 않습니다.
- 실제 수신 확인 전까지 Completed로 쓰지 않습니다.

## 4. Candidate decision criteria

| Decision item | Required condition | Status |
| --- | --- | --- |
| Privacy URL is public | 누구나 로그인 없이 접근 가능해야 함 | Pending |
| Privacy URL is stable | Google Play 등록 후 유지 가능한 URL이어야 함 | Pending |
| Privacy URL content matches app state | 서버 DB 없음, 로그인 없음, 실제 광고/결제/분석 SDK 없음 상태와 일치해야 함 | Pending |
| Support contact receives email | 실제 수신 가능해야 함 | Pending |
| Support contact can be monitored | 출시 후 문의 확인 가능해야 함 | Pending |
| Policy placeholders removed | 문의처, 시행일, 제공자 정보 placeholder가 제거되어야 함 | Pending |

## 5. Required final values before next completion PR

| Required value | Status | Note |
| --- | --- | --- |
| 개인정보 처리방침 URL | Pending | 실제 공개 URL 필요 |
| 문의처 이메일/지원 연락처 | Pending | 실제 수신 가능한 연락처 필요 |
| 시행일 | Pending | 실제 배포 또는 정책 적용 기준일 필요 |
| 제공자 정보 | Pending | 실제 개발자/사업자 정보 기준 필요 |
| Google Play 데이터 보안 양식 최종 답변 | Pending | Console 입력 전 최종 검토 필요 |

## 6. Not included in this PR

- No 개인정보 처리방침 URL finalization
- No 문의처 이메일/지원 연락처 finalization
- No 시행일 finalization
- No 제공자 정보 finalization
- No Google Play Console input
- No Store screenshot upload
- No Google Play 데이터 보안 양식 completion
- No release build
- No signing setup
- No keystore file added
- No AAB generation
- No image file changes
- No new screenshot image files
- No src changes
- No CSS changes
- No production UI changes
- No AndroidManifest.xml changes
- No Android native code changes
- No Android resource changes
- No Gradle changes
- No Capacitor config changes
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
| 개인정보 처리방침 URL 후보 선정 | Pending |
| 문의처 이메일/지원 연락처 후보 선정 | Pending |
| 개인정보 처리방침 URL 확정 | Pending |
| 문의처 이메일/지원 연락처 확정 | Pending |
| 시행일 확정 | Pending |
| 제공자 정보 확정 | Pending |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 8. Recommended next sequence

1. 사용자가 실제 개인정보 처리방침 URL 후보를 결정
2. 사용자가 실제 문의처 이메일/지원 연락처 후보를 결정
3. URL 접속 가능 여부 확인
4. 이메일 수신/답변 가능 여부 확인
5. 개인정보 처리방침 초안에 실제 문의처/시행일/제공자 정보 반영
6. Google Play 데이터 보안 양식 최종 답변 검토
7. Google Play Console 입력은 최종값 확정 후 진행

## 9. Conclusion

- This PR documents candidate selection and verification planning only.
- 개인정보 처리방침 URL and 문의처 이메일/지원 연락처 remain Pending.
- Google Play Console input, Store screenshot upload, and Google Play 데이터 보안 양식 최종 입력 remain Pending.
- No production code, Android packaging, release build, signing, AAB, image file, or Console input changes are included.
