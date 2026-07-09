# Privacy Policy and Support Contact Readiness

## 1. Scope

- Purpose: Document privacy policy URL and support contact readiness for Google Play launch preparation
- PR type: docs/check-only
- App name: 하루풀이
- Related readiness PR: #327
- Current privacy policy URL status: Pending
- Current support contact status: Pending
- Current Google Play Console input status: Pending
- No production code changes
- No app UI link changes
- No Android native/resource changes

## 2. Current data handling baseline

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

## 3. Privacy policy readiness checklist

| Item | Status | Note |
| --- | --- | --- |
| 개인정보 처리방침 문서 초안 | Pending | Draft not finalized in this PR |
| 개인정보 처리방침 URL | Pending | Actual public URL not finalized |
| Publicly accessible URL check | Pending | No actual URL checked |
| Non-PDF URL check | Pending | No actual URL checked |
| App name included in policy | Pending | Draft/final document not finalized |
| Developer information included | Pending | Actual developer info not finalized |
| Privacy point of contact included | Pending | Actual contact not finalized |
| Data collection/use/share description | Pending | Draft not finalized |
| Data retention/deletion policy | Pending | Draft not finalized |
| App internal policy link/text | Pending | No app UI change in this PR |
| Play Console privacy policy field input | Pending | No Console input in this PR |

## 4. Support contact readiness checklist

| Item | Status | Note |
| --- | --- | --- |
| 문의처 이메일/지원 연락처 확정 | Pending | Actual contact not finalized |
| Support email inbox access check | Pending | Not checked in this PR |
| Support response owner | Pending | Not assigned/finalized |
| Google Play developer contact field input | Pending | No Console input in this PR |
| Store listing support contact consistency | Pending | Not finalized |

## 5. Recommended privacy policy draft sections

- 제목: 개인정보 처리방침
- 앱 이름 및 제공자 정보
- 수집 또는 처리하는 정보
- localStorage 저장 정보 설명
- 서버 DB/로그인/광고 SDK/결제 SDK/외부 분석 SDK 미사용 설명
- 사주/운세 정보 입력 및 저장 방식
- 공유 기능 사용 시 사용자가 직접 공유하는 문구 설명
- 개인정보의 이용 목적
- 개인정보의 제3자 제공 여부
- 개인정보의 보관 및 삭제
- 이용자 문의처
- 시행일
- 변경 고지 방식

## 6. Current draft-safe statements

- 하루풀이는 현재 서버 DB와 로그인 기능을 사용하지 않습니다.
- 사용자가 입력한 사주/운세 관련 정보와 저장한 풀이는 기기 내 localStorage를 중심으로 저장됩니다.
- 현재 실제 광고 SDK, 결제 SDK, 외부 분석 SDK는 사용하지 않습니다.
- 저장한 풀이 공유 기능은 사용자가 직접 공유 또는 복사 동작을 수행할 때만 실행됩니다.
- 실제 외부 공유 발송은 사용자의 선택과 외부 앱 동작에 따릅니다.
- 문의처와 개인정보 처리방침 URL은 출시 전 확정 예정입니다.

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

## 8. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| 개인정보 처리방침 문서 초안 | Pending |
| 개인정보 처리방침 URL 확정 | Pending |
| 문의처 이메일/지원 연락처 확정 | Pending |
| App internal privacy policy link/text | Pending |
| Google Play 데이터 보안 양식 초안 문서화 | Pending |
| Google Play Console actual input | Pending |
| Store listing 문구 초안 정리 | Pending |
| 실제 스토어 스크린샷 이미지 제작 계획 수립 | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 9. Recommended next sequence

1. 개인정보 처리방침 초안 작성
2. 문의처 이메일/지원 연락처 확정
3. 개인정보 처리방침 공개 URL 확정
4. 앱 내부 개인정보 처리방침 링크 또는 안내 위치 검토
5. Google Play 데이터 보안 양식 초안 문서화
6. Store listing 문구 초안 정리

## 10. Conclusion

- This PR documents readiness only.
- 개인정보 처리방침 URL and 문의처 이메일/지원 연락처 remain Pending.
- Google Play Console input remains Pending.
- No production code, Android packaging, release build, signing, AAB, or Console input changes are included.
