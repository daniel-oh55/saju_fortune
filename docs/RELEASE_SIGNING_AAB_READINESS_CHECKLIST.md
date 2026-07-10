# Release Signing AAB Readiness Checklist

- Status: Checklist only
- Release build: Not started
- Signing setup: Not started
- AAB generation: Not started
- Google Play Console input: Pending
- Store screenshot upload: Pending
- 개인정보 처리방침 URL 확정: Pending
- 문의처 이메일/지원 연락처 확정: Pending
- Google Play 데이터 보안 양식 최종 입력: Pending

## 1. Scope

- Purpose: Define readiness checklist before release build, signing setup, and AAB generation
- PR type: docs/check-only
- App name: 하루풀이
- Related Android packaging readiness docs: existing docs/check scripts
- Related Google Play data safety final review PR: #347
- Current Google Play Console input status: Pending
- Current release build status: Not started
- Current signing setup status: Not started
- Current AAB generation status: Not started
- No production code changes
- No Android native/resource changes
- No Gradle changes
- No Capacitor config changes

## 2. Release build readiness checklist

| Item | Status | Note |
| --- | --- | --- |
| Release build command decision | Pending | 실제 명령 확정 전 |
| Release build environment check | Pending | 로컬/CI 기준 결정 필요 |
| Production env variable check | Pending | 현재 별도 서버/SDK 없음 기준 |
| Version name/code policy check | Pending | Google Play 업로드 전 확인 필요 |
| Release build execution | Not started | 이번 PR에서 실행하지 않음 |
| Release APK/AAB install test | Not started | release artifact 생성 전 |

## 3. Signing readiness checklist

| Item | Status | Note |
| --- | --- | --- |
| Signing method decision | Pending | 로컬 signing 또는 CI signing 여부 결정 필요 |
| Keystore storage policy | Pending | repo에 keystore 파일 추가 금지 |
| Signing credential handling | Pending | 비밀값은 GitHub Secrets 또는 로컬 보관 검토 |
| signing setup | Not started | 이번 PR에서 설정하지 않음 |
| signed release build verification | Not started | signing 전 |

## 4. AAB generation readiness checklist

| Item | Status | Note |
| --- | --- | --- |
| AAB generation command decision | Pending | 실제 명령 확정 전 |
| AAB generation | Not started | 이번 PR에서 생성하지 않음 |
| AAB artifact storage policy | Pending | 업로드 전 보관 방식 결정 필요 |
| AAB upload to Google Play Console | Pending | Console 입력 없음 |
| Internal testing track upload | Pending | Console 입력 없음 |

## 5. Google Play blockers before release upload

| Blocker | Status | Note |
| --- | --- | --- |
| 개인정보 처리방침 URL 확정 | Pending | 실제 공개 URL 필요 |
| 문의처 이메일/지원 연락처 확정 | Pending | 실제 수신 가능한 연락처 필요 |
| Google Play 데이터 보안 양식 최종 입력 | Pending | Console 입력 없음 |
| Store screenshot upload | Pending | Console 업로드 전 |
| Google Play Console actual input | Pending | Console 입력 없음 |
| Release build | Not started | release build 미생성 |
| Signing setup | Not started | signing 미진행 |
| AAB generation | Not started | AAB 미생성 |

## 6. Not included in this PR

- No release build
- No signing setup
- No keystore file added
- No AAB generation
- No Google Play Console input
- No Store screenshot upload
- No 개인정보 처리방침 URL finalization
- No 문의처 이메일/지원 연락처 finalization
- No Google Play 데이터 보안 양식 최종 입력
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
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 8. Recommended next sequence

1. 개인정보 처리방침 URL 후보 결정
2. 문의처 이메일/지원 연락처 후보 결정
3. URL 접속 가능 여부와 이메일 수신 가능 여부 확인
4. signing 방식과 credential 보관 방식 결정
5. release build/AAB 생성 절차를 별도 PR에서 문서화
6. 실제 release build/signing/AAB는 별도 요청 후 진행
7. Google Play Console 입력은 최종값 확정 후 진행

## 9. Conclusion

- This PR adds release/signing/AAB readiness checklist only.
- Release build, signing setup, and AAB generation remain Not started.
- Google Play Console input, Store screenshot upload, 개인정보 처리방침 URL, 문의처 이메일/지원 연락처, and Google Play 데이터 보안 양식 최종 입력 remain Pending.
- No production code, Android packaging, signing, AAB, image file, or Console input changes are included.
