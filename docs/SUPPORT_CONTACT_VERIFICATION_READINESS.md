# Support Contact Verification Readiness

- Status: Readiness only
- 문의처 이메일/지원 연락처 확정: Pending
- Support inbox access check: Pending
- Google Play Console input: Pending
- 개인정보 처리방침 URL: Pending

## 1. Scope

- Purpose: Document support contact candidate and verification readiness for Google Play launch preparation
- PR type: docs/check-only
- App name: 하루풀이
- Related privacy policy draft PR: #329
- Current support contact status: Pending
- Current privacy policy URL status: Pending
- Current Google Play Console input status: Pending
- No production code changes
- No app UI link changes
- No Android native/resource changes

## 2. Support contact candidate types

| Candidate type | Status | Note |
| --- | --- | --- |
| Google Play developer account email | Candidate | Must verify suitability and inbox access |
| Dedicated support email | Candidate | Preferred if available before launch |
| Privacy request email | Candidate | Useful for privacy/deletion requests |
| Personal Gmail address | Candidate with caution | Must verify 운영/개인정보 문의 대응 적합성 |
| Domain-based email | Candidate | Preferred if available |
| Temporary or unmonitored email | Not recommended | Do not use |

## 3. Verification checklist

| Item | Status | Note |
| --- | --- | --- |
| 문의처 이메일/지원 연락처 후보 선정 | Pending | Actual email not selected in this PR |
| Inbox access check | Pending | 수신 가능 여부 미확인 |
| Test email send/receive check | Pending | 테스트 메일 미발송 |
| Owner/responder assignment | Pending | 담당자 미확정 |
| Privacy/deletion request handling capability | Pending | 문의 대응 방식 미확정 |
| Consistency with privacy policy draft | Pending | 실제 이메일 미반영 |
| Consistency with Google Play developer contact | Pending | Console 입력 없음 |
| Public exposure suitability check | Pending | 공개 문의처 적합성 미확인 |
| Final support contact decision | Pending | Not finalized |

## 4. Blocking conditions

다음 중 하나라도 해당하면 문의처를 확정하지 않습니다.

- 실제 수신 가능 여부가 확인되지 않음
- 운영자가 확인하지 않는 이메일
- 임시 이메일 또는 폐쇄 예정 이메일
- 개인정보 삭제/문의 요청을 받을 수 없는 이메일
- Google Play 개발자 계정 정보와 충돌하는 이메일
- 개인정보 처리방침 초안과 Google Play Console에 동일하게 반영할 수 없는 이메일
- 사용자가 문의해도 응답할 수 없는 이메일

## 5. Recommended decision criteria

- 장기적으로 운영 가능한 이메일
- 수신 가능 여부 확인 완료
- 개인정보 문의 및 삭제 요청 수신 가능
- Google Play Console 개발자 연락처와 충돌 없음
- 개인정보 처리방침 초안, 공개 페이지, 앱 내부 안내에 동일하게 반영 가능
- 운영자가 정기적으로 확인 가능
- 개인 이메일 사용 시 개인정보 문의 대응과 공개 노출 리스크 검토 완료

## 6. Not included in this PR

- No src changes
- No CSS changes
- No production UI changes
- No privacy policy draft contact finalization
- No app privacy policy link UI
- No AndroidManifest.xml changes
- No Android native code changes
- No Android resource changes
- No Gradle changes
- No Capacitor config changes
- No release build
- No signing setup
- No keystore file added
- No AAB generation
- No Google Play Console input
- No 개인정보 처리방침 URL finalization
- No 문의처 이메일/지원 연락처 finalization
- No 시행일 finalization
- No 제공자 정보 finalization
- No Google Play 데이터 보안 양식 completion
- No 실제 스토어 스크린샷 이미지 제작 completion
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
| 문의처 이메일/지원 연락처 후보 선정 | Pending |
| 문의처 이메일/지원 연락처 확정 | Pending |
| Inbox access check | Pending |
| Test email send/receive check | Pending |
| Privacy policy draft contact update | Pending |
| 개인정보 처리방침 URL 확정 | Pending |
| 시행일 확정 | Pending |
| 제공자 정보 확정 | Pending |
| App internal privacy policy link/text | Pending |
| Google Play 데이터 보안 양식 초안 문서화 | Pending |
| Google Play Console actual input | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 8. Recommended next sequence

1. 문의처 후보 이메일 결정
2. 해당 메일함 로그인/수신 가능 여부 확인
3. 테스트 메일 송수신 확인
4. 개인정보 문의 및 삭제 요청 대응 가능 여부 확인
5. 문의처 최종 확정
6. 개인정보 처리방침 초안에 문의처 반영
7. 공개 개인정보 처리방침 URL 확정
8. 앱 내부 개인정보 처리방침 링크 또는 안내 위치 검토

## 9. Conclusion

- This PR documents support contact verification readiness only.
- 문의처 이메일/지원 연락처 remains Pending.
- 개인정보 처리방침 URL, 시행일, 제공자 정보, and Google Play Console input remain Pending.
- No production code, Android packaging, release build, signing, AAB, or Console input changes are included.
