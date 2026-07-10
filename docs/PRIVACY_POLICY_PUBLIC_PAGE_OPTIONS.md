# Privacy Policy Public Page Options

- Status: Options only
- Privacy policy public page option review: Completed
- 개인정보 처리방침 URL 후보 선정: Pending
- 개인정보 처리방침 URL 확정: Pending
- 문의처 이메일/지원 연락처 후보 선정: Pending
- 문의처 이메일/지원 연락처 확정: Pending
- Google Play Console input: Pending
- Store screenshot upload: Pending
- Google Play 데이터 보안 양식 최종 입력: Pending

## 1. Scope

- Purpose: Document public page options for privacy policy URL before final URL selection
- PR type: docs/check-only
- App name: 하루풀이
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

## 2. Public page option candidates

| Option | Status | Note |
| --- | --- | --- |
| App-hosted static privacy page | Candidate | 앱/Vercel 배포 도메인 내 정적 페이지로 제공하는 방식 |
| Separate static hosting page | Candidate | GitHub Pages, Notion 공개 페이지, 별도 정적 호스팅 등 |
| Existing company/developer domain page | Candidate | 기존 도메인이 있는 경우 해당 도메인에 정책 페이지 제공 |
| Final public page option decision | Pending | 실제 방식 확정 전 |

주의:
- 이번 PR에서는 실제 URL을 넣지 않습니다.
- 이번 PR에서는 새 route 또는 page를 구현하지 않습니다.
- 실제 공개 페이지 방식은 사용자가 선택한 뒤 별도 PR에서 진행합니다.

## 3. Recommended option review

| Review item | App-hosted static privacy page | Separate static hosting page | Existing domain page |
| --- | --- | --- | --- |
| 관리 편의성 | 높음 | 중간 | 도메인 관리 상태에 따라 다름 |
| Google Play 제출 적합성 | 공개 URL이면 가능 | 공개 URL이면 가능 | 공개 URL이면 가능 |
| 앱 상태와 문서 동기화 | repo 안에서 관리 가능 | 별도 관리 필요 | 별도 관리 필요 |
| 구현 변경 필요성 | route/page 추가 필요 | 앱 코드 변경 없음 | 앱 코드 변경 없음 |
| 현재 추천 여부 | Candidate | Candidate | Candidate |

## 4. Public URL readiness criteria

| Criteria | Status | Note |
| --- | --- | --- |
| Public access without login | Pending | 누구나 접근 가능해야 함 |
| Stable URL | Pending | Google Play 등록 후 유지 가능한 URL 필요 |
| Mobile readable page | Pending | 모바일 브라우저에서 읽기 가능해야 함 |
| Privacy policy content matches app state | Pending | 서버 DB 없음, 로그인 없음, 실제 광고/결제/분석 SDK 없음 상태와 일치해야 함 |
| Support contact included | Pending | 실제 문의처 확정 후 반영 필요 |
| Effective date included | Pending | 실제 시행일 확정 필요 |
| Provider/developer information included | Pending | 실제 제공자 정보 확정 필요 |

## 5. Privacy policy content sync checklist

| Item | Status | Note |
| --- | --- | --- |
| docs/PRIVACY_POLICY_DRAFT.md latest review | Pending | 공개 전 최종 검토 필요 |
| 문의처 이메일/지원 연락처 반영 | Pending | 실제 문의처 확정 후 |
| 시행일 반영 | Pending | 실제 시행일 확정 후 |
| 제공자 정보 반영 | Pending | 실제 제공자 정보 확정 후 |
| Data safety answer alignment | Pending | PR #347 검토본과 충돌 없어야 함 |
| Public page content verification | Pending | 실제 공개 페이지 생성 후 확인 |

## 6. Blockers before URL finalization

| Blocker | Status | Note |
| --- | --- | --- |
| Public page option decision | Pending | 실제 방식 선택 필요 |
| 개인정보 처리방침 URL 후보 선정 | Pending | 실제 공개 URL 필요 |
| 문의처 이메일/지원 연락처 후보 선정 | Pending | 실제 수신 가능한 연락처 필요 |
| 개인정보 처리방침 URL 확정 | Pending | 실제 URL 접속 확인 필요 |
| 문의처 이메일/지원 연락처 확정 | Pending | 이메일 수신 확인 필요 |
| Google Play 데이터 보안 양식 최종 입력 | Pending | Console 입력 없음 |
| Google Play Console actual input | Pending | Console 입력 없음 |

## 7. Not included in this PR

- No 개인정보 처리방침 URL finalization
- No 개인정보 처리방침 public page implementation
- No 문의처 이메일/지원 연락처 finalization
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
- No routing changes
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
| Public page option decision | Pending |
| 개인정보 처리방침 URL 후보 선정 | Pending |
| 개인정보 처리방침 URL 확정 | Pending |
| 문의처 이메일/지원 연락처 후보 선정 | Pending |
| 문의처 이메일/지원 연락처 확정 | Pending |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Actual versionName change | Not started |
| Actual versionCode change | Not started |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 9. Recommended next sequence

1. 개인정보 처리방침 공개 페이지 방식 선택
2. 문의처 이메일/지원 연락처 후보 결정
3. 공개 페이지 구현 또는 외부 공개 URL 준비
4. URL 접속 가능 여부 확인
5. 이메일 수신 가능 여부 확인
6. 개인정보 처리방침 URL/문의처 최종 확정
7. Google Play Console 입력은 최종값 확정 후 진행

## 10. Conclusion

- This PR documents privacy policy public page options only.
- 개인정보 처리방침 URL and public page implementation remain Pending.
- 문의처 이메일/지원 연락처, Google Play Console input, Store screenshot upload, and Google Play 데이터 보안 양식 최종 입력 remain Pending.
- No production code, routing, Android packaging, signing, AAB, image file, or Console input changes are included.
