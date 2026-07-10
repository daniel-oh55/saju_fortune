# Release Signing AAB Execution Plan

- Status: Execution plan only
- Release build execution: Not started
- Signing setup: Not started
- Keystore file addition: Not started
- AAB generation: Not started
- Google Play Console input: Pending
- Store screenshot upload: Pending
- 개인정보 처리방침 URL 확정: Pending
- 문의처 이메일/지원 연락처 확정: Pending
- Google Play 데이터 보안 양식 최종 입력: Pending

## 1. Scope

- Purpose: Document release build, signing setup, and AAB generation execution plan before actual release work
- PR type: docs/check-only
- App name: 하루풀이
- Related release signing AAB readiness checklist PR: #348
- Current release build status: Not started
- Current signing setup status: Not started
- Current AAB generation status: Not started
- Current Google Play Console input status: Pending
- No production code changes
- No Android native/resource changes
- No Gradle changes
- No Capacitor config changes

## 2. Execution approach candidates

| Approach | Status | Note |
| --- | --- | --- |
| Local release build and local signing | Candidate | 로컬 PC에서 keystore를 보관하고 release/AAB 생성 |
| GitHub Actions release build with GitHub Secrets signing | Candidate | keystore/비밀번호를 GitHub Secrets로 관리하는 방식 |
| Hybrid approach | Candidate | 로컬에서 signing 후 artifact만 보관하거나, CI는 검증만 수행 |
| Final approach decision | Pending | 실제 방식 확정 전 |

주의:
- 이번 PR에서는 최종 방식을 확정하지 않습니다.
- 실제 signing 설정을 추가하지 않습니다.
- keystore 파일을 repo에 추가하지 않습니다.

## 3. Candidate command flow

| Step | Candidate command or action | Status | Note |
| --- | --- | --- | --- |
| Web build | npm run build | Candidate | 현재 build 검증 기준 |
| Capacitor sync | npx cap sync android | Candidate | 실제 release 전 Android project 동기화 후보 |
| Android release bundle | ./gradlew bundleRelease | Candidate | android 디렉터리 기준 후보 명령 |
| Signed AAB verification | 확인 필요 | Pending | 실제 signing 설정 후 확인 |
| AAB artifact path check | 확인 필요 | Pending | 실제 생성 후 경로 확인 |
| Device/install QA | 확인 필요 | Pending | release artifact 기준 별도 QA 필요 |

주의:
- 위 명령은 실행 계획 후보입니다.
- 이번 PR에서 실제 명령을 실행해 release artifact를 만들지 않습니다.
- 실제 명령은 현재 repo의 Android/Gradle 구조를 확인한 뒤 별도 PR에서 확정합니다.

## 4. Signing credential handling plan

| Item | Status | Note |
| --- | --- | --- |
| Keystore file location | Pending | repo에 keystore 파일 추가 금지 |
| Keystore backup policy | Pending | 로컬/보안 저장소 백업 필요 |
| Keystore password handling | Pending | GitHub Secrets 또는 로컬 보관 검토 |
| Key alias handling | Pending | 노출 금지 |
| Signing config change | Not started | 이번 PR에서 변경하지 않음 |
| CI signing setup | Not started | 이번 PR에서 설정하지 않음 |

## 5. Versioning plan before release

| Item | Status | Note |
| --- | --- | --- |
| versionName policy | Pending | Google Play 첫 업로드 전 결정 필요 |
| versionCode policy | Pending | 업로드마다 증가 필요 |
| package name check | Pending | Google Play 등록 전 최종 확인 필요 |
| release notes draft | Pending | 내부 테스트 업로드 전 작성 필요 |

## 6. Blockers before actual execution

| Blocker | Status | Note |
| --- | --- | --- |
| 개인정보 처리방침 URL 확정 | Pending | 실제 공개 URL 필요 |
| 문의처 이메일/지원 연락처 확정 | Pending | 실제 수신 가능한 연락처 필요 |
| Google Play 데이터 보안 양식 최종 입력 | Pending | Console 입력 없음 |
| Store screenshot upload | Pending | Console 업로드 전 |
| Google Play Console actual input | Pending | Console 입력 없음 |
| Final signing approach decision | Pending | 실제 signing 방식 확정 전 |
| Release build | Not started | release build 미생성 |
| Signing setup | Not started | signing 미진행 |
| AAB generation | Not started | AAB 미생성 |

## 7. Not included in this PR

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

## 8. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| 개인정보 처리방침 URL 후보 선정 | Pending |
| 문의처 이메일/지원 연락처 후보 선정 | Pending |
| 개인정보 처리방침 URL 확정 | Pending |
| 문의처 이메일/지원 연락처 확정 | Pending |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Final signing approach decision | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 9. Recommended next sequence

1. 개인정보 처리방침 URL 후보 결정
2. 문의처 이메일/지원 연락처 후보 결정
3. URL 접속 가능 여부와 이메일 수신 가능 여부 확인
4. signing 방식 최종 결정
5. versionName/versionCode 정책 결정
6. release build/AAB 생성은 별도 요청 후 진행
7. Google Play Console 입력은 최종값 확정 후 진행

## 10. Conclusion

- This PR documents the release/signing/AAB execution plan only.
- Release build, signing setup, keystore file addition, and AAB generation remain Not started.
- Google Play Console input, Store screenshot upload, 개인정보 처리방침 URL, 문의처 이메일/지원 연락처, and Google Play 데이터 보안 양식 최종 입력 remain Pending.
- No production code, Android packaging, signing, AAB, image file, or Console input changes are included.
