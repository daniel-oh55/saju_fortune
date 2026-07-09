# Google Play Launch Readiness Status

## 1. Scope

- Purpose: Document current Google Play launch readiness status
- PR type: docs/check-only
- App name: 하루풀이
- Platform target: Android via Capacitor
- Current build type used for QA: Android debug APK
- Current production release status: Not started
- Current Google Play Console status: Pending
- No production code changes
- No Android native/resource changes
- No release build/signing/AAB changes

## 2. Current app implementation status

| Item | Status | Note |
| --- | --- | --- |
| React + Vite app | In progress | Existing web app |
| Capacitor Android packaging | In progress | Debug build flow exists |
| Android Debug Build GitHub Actions | In use | Debug APK workflow used |
| Android debug APK real-device QA | In progress | Multiple debug APK QA passes documented |
| Android launcher icon integration | Completed | Icon resource integration and real-device launcher QA completed |
| Saved reading text share | Completed | Web Share API attempt + clipboard fallback |
| Clipboard fallback share path | Completed | Android WebView fallback confirmed |
| Share text sensitive-field paste QA | Completed | Sensitive fields and real store URLs excluded |
| Server DB | Not used | No backend DB |
| Login | Not used | No account system |
| Actual ad SDK | Not used | No real ad SDK |
| Actual payment SDK | Not used | No real payment SDK |
| External analytics SDK | Not used | No external analytics SDK |

## 3. Google Play release readiness status

| Item | Status | Note |
| --- | --- | --- |
| Release build | Not started | No release build generated in this PR |
| Signing setup | Not started | No signing config change in this PR |
| Keystore file in repo | Not added | Do not commit keystore files |
| AAB generation | Not started | No AAB generated in this PR |
| Google Play Console actual input | Pending | No actual Console input in this PR |
| Google Play upload | Pending | No APK/AAB upload |
| Store listing title | Pending | Final Console input not done |
| Short description | Pending | Final Console input not done |
| Full description | Pending | Final Console input not done |
| 실제 스토어 스크린샷 이미지 제작 | Pending | Actual store screenshots not finalized |
| Feature graphic | Pending | Not finalized |
| App icon upload to Google Play | Pending | Play Console upload not done |
| 개인정보 처리방침 URL | Pending | Actual URL not finalized |
| 문의처 이메일/지원 연락처 확정 | Pending | Actual support contact not finalized |
| Google Play 데이터 보안 양식 | Pending | Not completed |
| Content rating questionnaire | Pending | Not completed |
| Target audience and ads declaration | Pending | Not completed |
| App access declaration | Pending | Not completed |
| Release notes | Pending | Not finalized |

## 4. Policy and data safety baseline

- 서버 DB 없음
- 로그인 없음
- 실제 광고 SDK 없음
- 실제 결제 SDK 없음
- 외부 분석 SDK 없음
- localStorage 중심 저장 구조
- 사용자가 입력/저장한 사주/운세 정보는 현재 서버 전송 구조 없음
- 공유 기능은 clipboard fallback 중심으로 확인됨
- 실제 외부 공유 발송은 Not performed
- 개인정보 처리방침 URL은 Pending
- Google Play 데이터 보안 양식은 Pending

주의:

- 이 섹션은 실제 Google Play 데이터 보안 양식을 완료했다는 뜻이 아닙니다.
- "Google Play 데이터 보안 양식: Completed"라고 쓰지 마세요.

## 5. Fortune calculation and validation readiness

| Item | Status | Note |
| --- | --- | --- |
| Production fortune logic | Existing | No logic change in this PR |
| schemaVersion | Unchanged | No schemaVersion change |
| CURRENT_FORTUNE_SCHEMA_VERSION | Unchanged | No version change |
| Existing localStorage keys | Unchanged | No storage key change |
| 태양시 보정 적용 여부 | Pending | Final verification remains pending unless separately documented |
| 음력/윤달 샘플 외부 검증 | Pending | External validation remains pending unless separately documented |

## 6. Not included in this PR

- No src changes
- No CSS changes
- No production UI changes
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
- No Google Play upload
- No 개인정보 처리방침 URL finalization
- No 문의처 이메일/지원 연락처 finalization
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

## 7. Recommended next launch-prep sequence

1. 개인정보 처리방침 URL/문의처/지원 연락처 확정
2. Google Play 데이터 보안 양식 초안 문서화
3. Store listing 문구 초안 정리
4. 실제 스토어 스크린샷 이미지 제작 계획 수립
5. release build/signing/AAB 준비 문서화
6. signing 설정은 별도 PR에서만 진행
7. AAB 생성은 signing 준비 이후 별도 PR에서 진행
8. Google Play Console 실제 입력은 최종값 확정 후 진행

## 8. Conclusion

- Current Android QA has been performed with debug APKs only.
- Google Play release build, signing setup, AAB generation, and Console input are not started.
- 개인정보 처리방침 URL, 문의처, Google Play 데이터 보안 양식, and 실제 스토어 스크린샷 이미지 제작 remain Pending.
- This PR only documents launch readiness status and does not change production code or Android packaging configuration.
