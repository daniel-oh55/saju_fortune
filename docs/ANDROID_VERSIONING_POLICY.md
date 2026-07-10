# Android Versioning Policy

- Status: Policy only
- Android versioning policy: Completed
- Actual versionName change: Not started
- Actual versionCode change: Not started
- Release build: Not started
- Signing setup: Not started
- AAB generation: Not started
- Google Play Console input: Pending
- Store screenshot upload: Pending
- 개인정보 처리방침 URL 확정: Pending
- 문의처 이메일/지원 연락처 확정: Pending
- Google Play 데이터 보안 양식 최종 입력: Pending

## 1. Scope

- Purpose: Define Android versionName/versionCode policy before release build and Google Play upload
- PR type: docs/check-only
- App name: 하루풀이
- Related release signing AAB execution plan PR: #349
- Current release build status: Not started
- Current signing setup status: Not started
- Current AAB generation status: Not started
- Current Google Play Console input status: Pending
- No production code changes
- No Android native/resource changes
- No Gradle changes
- No Capacitor config changes

## 2. Versioning policy baseline

| Item | Policy | Status |
| --- | --- | --- |
| Initial versionName policy | 1.0.0 기준으로 검토 | Policy only |
| Initial versionCode policy | 첫 Google Play 업로드는 1부터 시작하는 방향으로 검토 | Policy only |
| versionName increase rule | 사용자에게 보이는 기능/출시 단위 기준으로 증가 | Policy only |
| versionCode increase rule | Google Play 업로드마다 반드시 증가 | Policy only |
| Hotfix versionName rule | 필요 시 1.0.1, 1.0.2 등 patch 증가 | Policy only |
| Internal test upload versionCode rule | 내부 테스트 업로드도 versionCode 증가 필요 | Policy only |

주의:
- 이번 PR에서는 실제 versionName/versionCode를 변경하지 않습니다.
- 실제 값은 Android release 설정 PR에서 별도로 반영합니다.
- Google Play는 동일하거나 낮은 versionCode의 새 AAB 업로드를 허용하지 않는 전제로 관리합니다.

## 3. Candidate first release version

| Field | Candidate value | Status | Note |
| --- | --- | --- | --- |
| versionName | 1.0.0 | Candidate | 첫 출시 후보값 |
| versionCode | 1 | Candidate | 첫 Google Play 업로드 후보값 |
| release notes | 첫 출시 준비 | Pending | 내부 테스트 또는 프로덕션 제출 전 문구 확정 필요 |

주의:
- Candidate value는 정책 후보입니다.
- 이번 PR에서 Android Gradle 값으로 반영하지 않습니다.
- 실제 Google Play 업로드 전 최종 확인이 필요합니다.

## 4. Versioning checklist before actual release PR

| Item | Status | Note |
| --- | --- | --- |
| versionName 최종 결정 | Pending | 실제 release PR 전 확정 필요 |
| versionCode 최종 결정 | Pending | 실제 release PR 전 확정 필요 |
| Android Gradle version value check | Pending | 실제 Android 설정 확인 필요 |
| Google Play previous upload check | Pending | 첫 업로드 전에는 기존 업로드 없음 확인 필요 |
| release notes draft | Pending | 내부 테스트 업로드 전 작성 필요 |
| release build execution | Not started | 이번 PR에서 실행하지 않음 |
| AAB generation | Not started | 이번 PR에서 생성하지 않음 |

## 5. Blockers before actual version update

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

## 6. Not included in this PR

- No actual versionName change
- No actual versionCode change
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
| Final signing approach decision | Pending |
| Actual versionName change | Not started |
| Actual versionCode change | Not started |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 8. Recommended next sequence

1. 개인정보 처리방침 URL 후보 결정
2. 문의처 이메일/지원 연락처 후보 결정
3. URL 접속 가능 여부와 이메일 수신 가능 여부 확인
4. signing 방식 최종 결정
5. versionName/versionCode 최종 결정
6. 실제 Android version 값 변경은 별도 PR에서 진행
7. release build/AAB 생성은 별도 요청 후 진행
8. Google Play Console 입력은 최종값 확정 후 진행

## 9. Conclusion

- This PR documents Android versioning policy only.
- Actual versionName and versionCode changes remain Not started.
- Release build, signing setup, keystore file addition, and AAB generation remain Not started.
- Google Play Console input, Store screenshot upload, 개인정보 처리방침 URL, 문의처 이메일/지원 연락처, and Google Play 데이터 보안 양식 최종 입력 remain Pending.
- No production code, Android packaging, signing, AAB, image file, or Console input changes are included.
