# Privacy Page Final Value Candidates

- Status: Candidates only
- Privacy page final value candidates: Completed
- 문의처 이메일/지원 연락처 후보 선정: Pending
- 문의처 이메일/지원 연락처 확정: Pending
- 시행일 후보 선정: Pending
- 시행일 확정: Pending
- 제공자 정보 후보 선정: Pending
- 제공자 정보 확정: Pending
- 개인정보 처리방침 URL 후보 선정: Pending
- 개인정보 처리방침 URL 확정: Pending
- Privacy policy public page implementation: Not started
- Privacy page route implementation: Not started
- Google Play Console input: Pending
- Store screenshot upload: Pending
- Google Play 데이터 보안 양식 최종 입력: Pending

## 1. Scope

- Purpose: Document candidate value recording criteria before final privacy page implementation
- PR type: docs/check-only
- App name: 하루풀이
- Related privacy page final values readiness PR: #353
- Related app-hosted privacy page implementation plan PR: #352
- Current Google Play Console input status: Pending
- Current Store screenshot upload status: Pending
- Current release build status: Not started
- No production code changes
- No routing changes
- No Android native/resource changes
- No Gradle changes
- No Capacitor config changes

## 2. Candidate values to be provided by user

| Candidate value | Status | Required before |
| --- | --- | --- |
| 문의처 이메일/지원 연락처 후보 | Pending | 개인정보 처리방침 페이지 구현 |
| 시행일 후보 | Pending | 개인정보 처리방침 페이지 구현 |
| 제공자 정보 후보 | Pending | 개인정보 처리방침 페이지 구현 |
| 개인정보 처리방침 URL 후보 | Pending | 페이지 구현 및 배포 후 |
| 개인정보 처리방침 URL 확정 | Pending | 실제 공개 URL 접속 확인 후 |

주의:
- 이번 PR에서는 실제 이메일 후보를 넣지 않습니다.
- 이번 PR에서는 실제 시행일 후보를 넣지 않습니다.
- 이번 PR에서는 실제 제공자 정보 후보를 넣지 않습니다.
- 이번 PR에서는 실제 개인정보 처리방침 URL 후보를 넣지 않습니다.
- 사용자가 실제값을 제공한 뒤 별도 PR에서 후보 기록을 진행합니다.

## 3. Candidate recording rules

| Rule | Status | Note |
| --- | --- | --- |
| 이메일 후보는 실제 수신 가능한 주소여야 함 | Pending | 테스트 수신 필요 |
| 시행일 후보는 실제 정책 적용 가능일이어야 함 | Pending | 출시 일정과 충돌 없는지 확인 |
| 제공자 정보 후보는 Google Play 개발자 계정 정보와 충돌 없어야 함 | Pending | 개인/사업자 표시 기준 확인 |
| 개인정보 처리방침 URL 후보는 공개 접근 가능해야 함 | Pending | 로그인 없이 접속 가능해야 함 |
| 최종 확정 전 후보와 확정 상태를 구분해야 함 | Pending | Candidate와 Completed 구분 |

## 4. Verification required after candidates are provided

| Verification item | Status | Note |
| --- | --- | --- |
| 이메일 수신 테스트 | Pending | 실제 후보 제공 후 |
| 이메일 답변/모니터링 가능 여부 | Pending | 운영 가능성 확인 |
| 시행일 형식 확인 | Pending | 공개 페이지 문구와 일치 |
| 제공자 정보 표시 확인 | Pending | Console/정책 페이지와 일치 |
| 개인정보 처리방침 페이지 내용 반영 | Pending | 페이지 구현 PR에서 확인 |
| Vercel 공개 URL 접속 확인 | Pending | 배포 후 확인 |
| 모바일 브라우저 표시 확인 | Pending | 배포 후 확인 |

## 5. Blockers before actual page implementation

| Blocker | Status | Note |
| --- | --- | --- |
| 문의처 이메일/지원 연락처 후보 선정 | Pending | 사용자 실제값 필요 |
| 시행일 후보 선정 | Pending | 사용자 실제값 필요 |
| 제공자 정보 후보 선정 | Pending | 사용자 실제값 필요 |
| Privacy page route implementation | Not started | 별도 PR |
| 개인정보 처리방침 URL 후보 선정 | Pending | 페이지 구현/배포 후 |
| Google Play Console actual input | Pending | Console 입력 없음 |

## 6. Not included in this PR

- No actual 문의처 이메일/지원 연락처 candidate value
- No actual 시행일 candidate value
- No actual 제공자 정보 candidate value
- No 개인정보 처리방침 URL finalization
- No 개인정보 처리방침 public page implementation
- No privacy policy route implementation
- No routing changes
- No 문의처 이메일/지원 연락처 finalization
- No 시행일 finalization
- No 제공자 정보 finalization
- No Google Play Console input
- No Store screenshot upload
- No Google Play 데이터 보안 양식 최종 입력
- No actual versionName change
- No actual versionCode change
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
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes

## 7. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| 문의처 이메일/지원 연락처 후보 선정 | Pending |
| 문의처 이메일/지원 연락처 확정 | Pending |
| 시행일 후보 선정 | Pending |
| 시행일 확정 | Pending |
| 제공자 정보 후보 선정 | Pending |
| 제공자 정보 확정 | Pending |
| Privacy policy public page implementation | Not started |
| Privacy page route implementation | Not started |
| 개인정보 처리방침 URL 후보 선정 | Pending |
| 개인정보 처리방침 URL 확정 | Pending |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Actual versionName change | Not started |
| Actual versionCode change | Not started |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 8. Recommended next sequence

1. 사용자가 문의처 이메일/지원 연락처 후보를 제공
2. 사용자가 시행일 후보를 제공
3. 사용자가 제공자 정보 후보를 제공
4. 후보값 기록 PR 진행
5. 이메일 수신 테스트 결과 문서화
6. 개인정보 처리방침 페이지 구현 PR 진행
7. Vercel 배포 URL 확인
8. 개인정보 처리방침 URL/문의처 최종 확정
9. Google Play Console 입력은 최종값 확정 후 진행

## 9. Conclusion

- This PR documents candidate value recording criteria only.
- 실제 문의처 이메일/지원 연락처, 시행일, 제공자 정보, and 개인정보 처리방침 URL candidates remain Pending.
- 개인정보 처리방침 public page implementation and route implementation remain Not started.
- Google Play Console input, Store screenshot upload, and Google Play 데이터 보안 양식 최종 입력 remain Pending.
- No production code, routing, Android packaging, signing, AAB, image file, or Console input changes are included.
