# Privacy Policy URL Candidate Record

- Status: URL candidate recorded only
- 개인정보 처리방침 URL 후보 선정: Completed
- 개인정보 처리방침 URL 확정: Pending
- Privacy policy public page implementation: Completed
- Privacy page route implementation: Not changed
- 문의처 이메일/지원 연락처 후보 선정: Completed
- 문의처 이메일/지원 연락처 확정: Pending
- 시행일 후보 선정: Completed
- 시행일 확정: Pending
- 제공자 정보 후보 선정: Completed
- 제공자 정보 확정: Pending
- Google Play Console input: Pending
- Store screenshot upload: Pending
- Google Play 데이터 보안 양식 최종 입력: Pending
- Release build: Not started
- Signing setup: Not started
- AAB generation: Not started

## 1. Scope

- Purpose: Record the user-provided privacy policy URL candidate after static page deployment
- PR type: docs/check-only
- App name: 하루풀이
- Related static privacy policy page PR: #356
- Related static privacy policy page check PR: #357
- Related legacy public privacy policy page check alignment PR: #358
- Current Google Play Console input status: Pending
- Current Store screenshot upload status: Pending
- Current release build status: Not started
- No production code changes
- No routing changes
- No Android native/resource changes
- No Gradle changes
- No Capacitor config changes

## 2. Recorded URL candidate

| Item | Value | Status |
| --- | --- | --- |
| 개인정보 처리방침 URL 후보 | https://saju-fortune-nu.vercel.app/privacy-policy/ | Candidate recorded |
| 개인정보 처리방침 URL 확정 | Pending | Final verification required |
| Google Play Console 입력 | Pending | Console input not started |

주의:
- 이번 PR에서는 URL 후보만 기록합니다.
- 이번 PR에서 개인정보 처리방침 URL을 최종 확정하지 않습니다.
- Google Play Console에는 아직 입력하지 않습니다.
- 최종 확정은 실제 접속 확인, 모바일 표시 확인, Google Play 입력 전 최종 검토 후 별도 PR에서 진행합니다.

## 3. Verification required before finalization

| Verification item | Status | Note |
| --- | --- | --- |
| Public URL opens without login | Pending | 브라우저에서 직접 확인 필요 |
| Mobile browser readability | Pending | 모바일에서 표시 확인 필요 |
| Correct path check | Pending | /privacy-policy/ 경로 확인 필요 |
| Content matches current app state | Pending | 서버 DB 없음, 로그인 없음, 실제 광고/결제/분석 SDK 없음 상태와 일치 필요 |
| Support contact visible | Pending | support.hym@gmail.com 표시 확인 필요 |
| Effective date visible | Pending | 2026년 7월 12일 표시 확인 필요 |
| Provider info visible | Pending | 하루풀이 운영자 표시 확인 필요 |
| Google Play Console URL field input | Pending | Console 입력은 최종 확정 후 |

## 4. Not included in this PR

- No 개인정보 처리방침 URL finalization
- No Google Play Console input
- No Store screenshot upload
- No Google Play 데이터 보안 양식 최종 입력
- No 문의처 이메일/지원 연락처 finalization
- No 시행일 finalization
- No 제공자 정보 finalization
- No privacy page route implementation
- No routing changes
- No public/privacy-policy/index.html changes
- No src changes
- No CSS changes
- No production UI changes
- No AndroidManifest.xml changes
- No Android native code changes
- No Android resource changes
- No Gradle changes
- No Capacitor config changes
- No package dependency changes
- No actual versionName change
- No actual versionCode change
- No release build
- No signing setup
- No keystore file added
- No AAB generation
- No actual ad SDK
- No actual payment SDK
- No login
- No server DB
- No external analytics SDK
- No production fortune logic changes
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes

## 5. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| 개인정보 처리방침 URL 확정 | Pending |
| 문의처 이메일/지원 연락처 확정 | Pending |
| 시행일 확정 | Pending |
| 제공자 정보 확정 | Pending |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Actual versionName change | Not started |
| Actual versionCode change | Not started |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 6. Recommended next sequence

1. 개인정보 처리방침 URL 후보 접속 확인
2. 모바일 브라우저 표시 확인
3. support.hym@gmail.com 이메일 수신 테스트 확인
4. URL/문의처/시행일/제공자 정보 최종 확정 PR 진행
5. Google Play Console 입력은 최종 확정 후 진행
6. Store screenshot upload는 Console 입력 단계에서 진행
7. release build/signing/AAB는 Console 준비 항목 정리 후 진행

## 7. Conclusion

- This PR records the privacy policy URL candidate only.
- 개인정보 처리방침 URL 후보 선정 is Completed, but 개인정보 처리방침 URL 확정 remains Pending.
- 문의처 이메일/지원 연락처, 시행일, and 제공자 정보 remain Pending final verification.
- Google Play Console input, Store screenshot upload, and Google Play 데이터 보안 양식 최종 입력 remain Pending.
- No production code, routing, Android packaging, signing, AAB, image file, or Console input changes are included.
