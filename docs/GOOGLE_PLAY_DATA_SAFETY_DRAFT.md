# Google Play Data Safety Draft

- Status: Draft
- Google Play 데이터 보안 양식: Pending
- Google Play Console input: Pending
- 개인정보 처리방침 URL: Pending
- 문의처 이메일/지원 연락처: Pending
- This document is not the finalized Google Play Console Data safety form.

## 1. Scope

- Purpose: Draft Google Play Data safety form baseline for launch preparation
- PR type: docs/check-only
- App name: 하루풀이
- Related launch readiness PR: #327
- Related privacy readiness PR: #328
- Related privacy policy draft PR: #329
- Related support contact readiness PR: #330
- Current app storage: localStorage
- Current server DB status: Not used
- Current login status: Not used
- Current actual ad SDK status: Not used
- Current actual payment SDK status: Not used
- Current external analytics SDK status: Not used
- Current Google Play Console input status: Pending
- No production code changes
- No Android native/resource changes

## 2. Current technical baseline

| Item | Status | Note |
| --- | --- | --- |
| Server DB | Not used | No backend DB |
| Login | Not used | No account system |
| Actual ad SDK | Not used | No real ad SDK |
| Actual payment SDK | Not used | No real payment SDK |
| External analytics SDK | Not used | No external analytics SDK |
| Saved data storage | localStorage | User-entered/saved reading data remains on device |
| User profile input | In app | Used for fortune reading generation |
| Saved readings | In app | Stored locally |
| Clipboard fallback share | Completed | Share text copy path confirmed |
| Actual external share send | Not performed | No external send QA performed |

## 3. Draft data handling assessment

| Data area | Draft status | Note |
| --- | --- | --- |
| Name | Not collected by server | No server DB/login; share text excludes name |
| Birth date | Processed locally | Used for fortune reading; no current server transmission structure |
| Birth time | Processed locally | Used for fortune reading; no current server transmission structure |
| Birth place | Processed locally | Used for fortune reading; no current server transmission structure |
| Gender | Processed locally | Used for fortune reading; no current server transmission structure |
| Saved readings | Stored locally | localStorage 중심 저장 |
| Device identifiers | Not intentionally collected | No analytics/ad SDK currently used |
| Payment info | Not collected | No payment SDK |
| Advertising data | Not collected | No actual ad SDK |
| Analytics data | Not collected | No external analytics SDK |
| External sharing data | User-directed only | Actual external share send Not performed in QA |

주의:

- 위 표는 현재 코드/문서 기준의 초안 판단입니다.
- 실제 Google Play Console Data safety form 최종 입력은 별도 검토 후 진행해야 합니다.
- Google Play 데이터 보안 양식을 Completed로 표시하지 마세요.

## 4. Draft Play Console answer baseline

| Question area | Draft answer | Status | Note |
| --- | --- | --- | --- |
| Does the app collect or share user data? | Draft review needed | Pending | 현재 서버 전송 구조 없음, 최종 Console 기준 검토 필요 |
| Is all user data encrypted in transit? | Not applicable draft | Pending | 서버 전송 구조 없음, 최종 검토 필요 |
| Can users request data deletion? | Draft review needed | Pending | localStorage 삭제 방식과 문의처 확정 필요 |
| Is data shared with third parties? | Draft review needed | Pending | 현재 SDK/서버 공유 없음, 사용자 직접 공유는 별도 검토 필요 |
| Is data required or optional? | Draft review needed | Pending | 앱 입력 흐름 기준 최종 검토 필요 |
| Privacy policy URL | Pending | Pending | 실제 URL 미확정 |
| Support contact | Pending | Pending | 실제 문의처 미확정 |

## 5. Data deletion and retention draft

- 현재 앱은 서버 DB를 사용하지 않습니다.
- 저장한 풀이 등 앱 내 저장 정보는 localStorage 중심으로 저장됩니다.
- 사용자는 앱 내 삭제 기능, 앱 삭제, 또는 브라우저/WebView 데이터 삭제를 통해 저장 정보를 삭제할 수 있습니다.
- 서버 저장 데이터 삭제 요청 절차는 현재 서버 DB 미사용 상태를 기준으로 별도 보관 데이터가 없는 것으로 초안 정리합니다.
- 다만 실제 개인정보 처리방침과 Google Play Console 입력 전 문의처/삭제 요청 응대 방식은 확정해야 합니다.
- 문의처 이메일/지원 연락처는 Pending입니다.

## 6. Sharing feature draft assessment

- 저장한 풀이 공유 기능은 사용자가 직접 공유 또는 복사 버튼을 누를 때만 실행됩니다.
- Android WebView에서는 share sheet가 열리지 않고 clipboard fallback으로 동작하는 것이 확인되었습니다.
- 공유 문구 개인정보 제외 실제 붙여넣기 확인은 Completed입니다.
- 실제 외부 공유 발송은 Not performed입니다.
- 외부 앱으로 사용자가 직접 공유하는 경우 해당 외부 앱의 정책이 적용될 수 있습니다.
- Native Android share sheet actual verification은 Pending입니다.
- @capacitor/share implementation은 Pending입니다.

## 7. Not included in this PR

- No src changes
- No CSS changes
- No production UI changes
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
- No Google Play 데이터 보안 양식 completion
- No 개인정보 처리방침 URL finalization
- No 문의처 이메일/지원 연락처 finalization
- No 시행일 finalization
- No 제공자 정보 finalization
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

## 8. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Google Play Console actual input | Pending |
| 개인정보 처리방침 URL 확정 | Pending |
| 문의처 이메일/지원 연락처 확정 | Pending |
| 시행일 확정 | Pending |
| 제공자 정보 확정 | Pending |
| App internal privacy policy link/text | Pending |
| Store listing 문구 초안 정리 | Pending |
| 실제 스토어 스크린샷 이미지 제작 계획 수립 | Pending |
| Native Android share sheet actual verification | Pending |
| @capacitor/share implementation | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 9. Recommended next sequence

1. 문의처 이메일/지원 연락처 후보 선정
2. 문의처 수신 가능 여부 확인
3. 개인정보 처리방침 URL 확정
4. 앱 내부 개인정보 처리방침 링크 또는 안내 위치 검토
5. Google Play 데이터 보안 양식 최종 답변 검토
6. Store listing 문구 초안 정리
7. release build/signing/AAB 준비 문서화

## 10. Conclusion

- This PR adds a draft Google Play Data safety baseline only.
- Google Play 데이터 보안 양식 and Google Play Console input remain Pending.
- 개인정보 처리방침 URL, 문의처 이메일/지원 연락처, 시행일, and 제공자 정보 remain Pending.
- No production code, Android packaging, release build, signing, AAB, or Console input changes are included.
