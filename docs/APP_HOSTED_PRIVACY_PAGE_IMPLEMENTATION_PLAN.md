# App-hosted Privacy Page Implementation Plan

- Status: Implementation plan only
- App-hosted privacy page implementation plan: Completed
- Privacy policy public page implementation: Not started
- 개인정보 처리방침 URL 후보 선정: Pending
- 개인정보 처리방침 URL 확정: Pending
- 문의처 이메일/지원 연락처 후보 선정: Pending
- 문의처 이메일/지원 연락처 확정: Pending
- Google Play Console input: Pending
- Store screenshot upload: Pending
- Google Play 데이터 보안 양식 최종 입력: Pending

## 1. Scope

- Purpose: Document implementation plan for an app-hosted static privacy policy page before actual route/page work
- PR type: docs/check-only
- App name: 하루풀이
- Related privacy policy public page options PR: #351
- Related privacy URL/support contact candidate plan PR: #346
- Related Google Play data safety final review PR: #347
- Current Google Play Console input status: Pending
- Current Store screenshot upload status: Pending
- Current release build status: Not started
- No production code changes
- No routing changes
- No Android native/resource changes
- No Gradle changes
- No Capacitor config changes

## 2. Planned app-hosted page approach

| Item | Planned approach | Status |
| --- | --- | --- |
| Public page type | App-hosted static privacy policy page | Plan only |
| Candidate path | /privacy-policy | Candidate |
| Candidate URL source | Vercel production deployment domain 기준 후보 | Pending |
| Page content source | docs/PRIVACY_POLICY_DRAFT.md 기준 | Pending |
| Public access | 로그인 없이 접근 가능해야 함 | Pending |
| Mobile readability | 모바일 브라우저에서 읽기 가능해야 함 | Pending |
| Final URL decision | 실제 배포 URL 확인 후 결정 | Pending |

주의:
- 이번 PR에서는 `/privacy-policy` route를 실제로 만들지 않습니다.
- 이번 PR에서는 Vercel 실제 URL을 확정하지 않습니다.
- 이번 PR에서는 개인정보 처리방침 URL을 Completed 처리하지 않습니다.

## 3. Implementation candidate checklist

| Item | Status | Note |
| --- | --- | --- |
| Privacy page route/page implementation | Not started | 별도 PR에서 진행 |
| Privacy policy final content sync | Pending | 실제 문의처/시행일/제공자 정보 확정 후 |
| Support contact reflection | Pending | 실제 문의처 확정 필요 |
| Effective date reflection | Pending | 실제 시행일 확정 필요 |
| Provider/developer information reflection | Pending | 실제 제공자 정보 확정 필요 |
| Vercel production URL check | Pending | 실제 배포 후 확인 |
| Google Play URL readiness check | Pending | Console 입력 전 확인 |

## 4. Content requirements for actual page PR

- 앱 이름: 하루풀이
- 개인정보 처리방침 목적
- 수집하는 개인정보 항목
- localStorage 중심 저장 구조 설명
- 서버 DB 없음
- 로그인 없음
- 실제 광고 SDK 없음
- 실제 결제 SDK 없음
- 외부 분석 SDK 없음
- 저장한 풀이/프로필 정보가 기기 내 저장 중심이라는 설명
- 사용자가 앱 데이터 삭제 또는 브라우저/앱 저장 데이터 삭제로 기기 내 데이터를 삭제할 수 있다는 안내
- 문의처 이메일/지원 연락처
- 시행일
- 제공자 정보

주의:
- 문의처 이메일/지원 연락처, 시행일, 제공자 정보는 실제값 확정 전까지 Pending입니다.
- 실제 페이지 구현 PR에서 placeholder가 남지 않도록 별도 검증이 필요합니다.

## 5. Verification plan after actual page implementation

| Verification item | Status | Note |
| --- | --- | --- |
| Route/page opens in browser | Pending | 실제 구현 후 확인 |
| Vercel deployed URL opens publicly | Pending | 실제 배포 후 확인 |
| No login required | Pending | 공개 접근 확인 |
| Mobile browser readability | Pending | 모바일 확인 필요 |
| Content matches Data safety final review | Pending | PR #347 검토본과 충돌 없어야 함 |
| Support contact is present | Pending | 실제 문의처 확정 후 |
| Effective date is present | Pending | 실제 시행일 확정 후 |
| Provider/developer information is present | Pending | 실제 제공자 정보 확정 후 |

## 6. Blockers before implementation

| Blocker | Status | Note |
| --- | --- | --- |
| 문의처 이메일/지원 연락처 후보 선정 | Pending | 실제 수신 가능한 연락처 필요 |
| 문의처 이메일/지원 연락처 확정 | Pending | 이메일 수신 확인 필요 |
| 시행일 확정 | Pending | 실제 정책 적용일 필요 |
| 제공자 정보 확정 | Pending | 실제 개발자/사업자 정보 필요 |
| Privacy page route implementation | Not started | 별도 PR |
| 개인정보 처리방침 URL 후보 선정 | Pending | 실제 공개 URL 필요 |
| 개인정보 처리방침 URL 확정 | Pending | 실제 URL 접속 확인 필요 |
| Google Play Console actual input | Pending | Console 입력 없음 |

## 7. Not included in this PR

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

## 8. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| Privacy policy public page implementation | Not started |
| Privacy page route implementation | Not started |
| 개인정보 처리방침 URL 후보 선정 | Pending |
| 개인정보 처리방침 URL 확정 | Pending |
| 문의처 이메일/지원 연락처 후보 선정 | Pending |
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

## 9. Recommended next sequence

1. 문의처 이메일/지원 연락처 후보 결정
2. 시행일/제공자 정보 후보 결정
3. 개인정보 처리방침 페이지 구현 PR 진행
4. Vercel 배포 URL 확인
5. 모바일 브라우저 표시 확인
6. 개인정보 처리방침 URL 후보 선정
7. 개인정보 처리방침 URL/문의처 최종 확정
8. Google Play Console 입력은 최종값 확정 후 진행

## 10. Conclusion

- This PR documents the app-hosted privacy page implementation plan only.
- 개인정보 처리방침 public page implementation and route implementation remain Not started.
- 개인정보 처리방침 URL, 문의처 이메일/지원 연락처, Google Play Console input, Store screenshot upload, and Google Play 데이터 보안 양식 최종 입력 remain Pending.
- No production code, routing, Android packaging, signing, AAB, image file, or Console input changes are included.
