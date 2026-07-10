# Store Screenshot Capture Basis Readiness

- Status: Readiness only
- Capture device selection: Candidate
- Android Debug APK basis: Candidate
- 실제 스토어 스크린샷 이미지 제작: Pending
- Store screenshot upload: Pending
- Google Play Console input: Pending
- This document does not include actual screenshot image files.

## 1. Scope

- Purpose: Document capture device and APK basis readiness before actual Google Play store screenshot image production
- PR type: docs/check-only
- App name: 하루풀이
- Related Store screenshot production plan PR: #333
- Related Store screenshot sample profile PR: #334
- Related Store screenshot capture/copy readiness PR: #335
- Current screenshot image production status: Pending
- Current Google Play Console input status: Pending
- Current release build status: Not started
- No production code changes
- No Android native/resource changes
- No screenshot image files added

## 2. Capture device candidate

| Item | Status | Note |
| --- | --- | --- |
| Capture device candidate | Candidate | Galaxy S23 Ultra 또는 실제 캡처 기기 후보 |
| Device OS/version check | Pending | 실제 캡처 전 확인 필요 |
| Screen size/safe-area check | Pending | 실제 캡처 전 확인 필요 |
| Screenshot orientation | Candidate | Portrait |
| Actual capture device finalization | Pending | 실제 제작 전 최종 확인 필요 |

주의:

- 실제 캡처 기기가 아직 최종 확정되지 않았다면 Completed로 쓰지 마세요.
- Galaxy S23 Ultra를 후보로 적되, 실제 최종 캡처 기기 확정은 Pending으로 유지하세요.

## 3. APK basis candidate

| Item | Status | Note |
| --- | --- | --- |
| Android Debug Build run | Candidate | PR #335 기준 run #264 후보, 최종 success 확인 필요 |
| Debug APK install for screenshot capture | Pending | 실제 캡처용 설치 확인 전 |
| App launch for screenshot capture | Pending | 실제 캡처용 실행 확인 전 |
| Release build screenshot basis | Not started | release build 미생성 |
| Signing setup | Not started | signing 미진행 |
| AAB generation | Not started | AAB 미생성 |

주의:

- PR #335의 Android Debug Build run #264가 최종 success인지 확인하지 않았다면 success라고 단정하지 마세요.
- 실제 APK 설치와 앱 실행을 확인하지 않았다면 Completed로 쓰지 마세요.
- release build 기준 스크린샷은 아직 Not started로 유지하세요.

## 4. Capture readiness checklist

| Item | Status | Note |
| --- | --- | --- |
| Screenshot target screens finalization | Ready | PR #335 기준 |
| Screenshot copy candidates | Ready | PR #335 기준 |
| Sample profile criteria | Ready | PR #334 기준 |
| Actual user data exclusion | Ready | 실제 사용자 데이터 금지 |
| Capture device finalization | Pending | 실제 제작 전 확인 |
| Android Debug APK basis finalization | Pending | run #264 success 및 설치 확인 필요 |
| Screenshot resolution validation | Pending | 실제 제작 시 확인 |
| Screenshot crop/safe-area check | Pending | 실제 제작 시 확인 |
| Final image export | Pending | 실제 이미지 제작 전 |
| Google Play upload | Pending | Console 입력 없음 |

## 5. Not included in this PR

- No src changes
- No CSS changes
- No production UI changes
- No AndroidManifest.xml changes
- No Android native code changes
- No Android resource changes
- No Gradle changes
- No Capacitor config changes
- No screenshot image files added
- No actual screenshot production
- No 실제 스토어 스크린샷 이미지 제작 completion
- No Google Play Console input
- No Store listing finalization
- No 개인정보 처리방침 URL finalization
- No 문의처 이메일/지원 연락처 finalization
- No Google Play 데이터 보안 양식 completion
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
- No routing changes
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes

## 6. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| Capture device finalization | Pending |
| Android Debug APK basis finalization | Pending |
| Debug APK install for screenshot capture | Pending |
| App launch for screenshot capture | Pending |
| 실제 스토어 스크린샷 이미지 제작 | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Store listing final text | Pending |
| 개인정보 처리방침 URL 확정 | Pending |
| 문의처 이메일/지원 연락처 확정 | Pending |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Screenshot resolution validation | Pending |
| Screenshot crop/safe-area check | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 7. Recommended next sequence

1. PR #335 Android Debug Build run #264 최종 success 확인
2. 캡처 기준 APK 다운로드 여부 확인
3. 캡처 기기에 APK 설치
4. 캡처 기기에서 앱 실행 확인
5. 실제 스토어 스크린샷 이미지 제작
6. 제작된 이미지 QA
7. Store listing 최종 문구 확정
8. Google Play Console 입력은 최종값 확정 후 진행

## 8. Conclusion

- This PR documents capture device and APK basis readiness only.
- Capture device finalization and Android Debug APK basis finalization remain Pending.
- 실제 스토어 스크린샷 이미지 제작 remains Pending.
- Google Play Console input, Store listing final text, 개인정보 처리방침 URL, 문의처 이메일/지원 연락처, and Google Play 데이터 보안 양식 remain Pending.
- No production code, Android packaging, release build, signing, AAB, or Console input changes are included.
