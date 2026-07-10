# Store Screenshot Sample Profile

- Status: Sample profile plan
- 실제 사용자 데이터 사용: 금지
- 실제 스토어 스크린샷 이미지 제작: Pending
- Store screenshot upload: Pending
- Google Play Console input: Pending
- This document does not include actual screenshot image files.

## 1. Scope

- Purpose: Define synthetic sample profile criteria for Google Play store screenshot production
- PR type: docs/check-only
- App name: 하루풀이
- Related Store screenshot production plan PR: #333
- Related Store listing draft PR: #332
- Current screenshot image production status: Pending
- Current Google Play Console input status: Pending
- Current release build status: Not started
- No production code changes
- No Android native/resource changes
- No screenshot image files added

## 2. Synthetic sample profile

| Field | Sample value | Status | Note |
| --- | --- | --- | --- |
| Profile label | 샘플 사용자 A | Planned | 실제 사용자 이름 아님 |
| Birth date | 1990-05-15 | Planned | 실제 사용자 생년월일 아님 |
| Birth time | 07:30 | Planned | 실제 사용자 출생시간 아님 |
| Birth place | 서울특별시 종로구 | Planned | 테스트용 지역값 |
| Gender | 여성 | Planned | 테스트용 선택값 |
| Calendar type | 양력 | Planned | 테스트용 선택값 |
| Leap month | 해당 없음 | Planned | 테스트용 선택값 |

주의:

- 위 값은 실제 사용자 데이터가 아닙니다.
- 실제 사용자 이름, 실제 생년월일, 실제 출생시간, 실제 출생지, 실제 연락처를 스크린샷에 사용하지 않습니다.
- 앱에서 이름 입력이 필요하지 않은 경우 Profile label은 문서상 구분용으로만 사용합니다.

## 3. Screenshot privacy rules

- 실제 사용자 데이터 사용 금지
- 실제 사용자 이름 노출 금지
- 실제 생년월일 노출 금지
- 실제 출생시간 노출 금지
- 실제 출생지 노출 금지
- 실제 연락처 노출 금지
- 실제 이메일 주소 노출 금지
- 실제 결제/광고/계정 정보처럼 보이는 정보 노출 금지
- 저장한 풀이 화면에는 민감한 원본 프로필 정보가 과도하게 노출되지 않도록 확인
- 공유 문구는 개인정보 제외 QA 결과와 충돌하지 않아야 함

## 4. Planned screenshot usage

| Screenshot | Planned screen | Sample profile use | Status |
| --- | --- | --- | --- |
| 1 | 홈 화면 | 샘플 사용자 A 기준 홈 상태 | Planned |
| 2 | 오늘운세 결과 | 샘플 사용자 A 기준 오늘운세 결과 | Planned |
| 3 | 나의 사주 흐름 | 샘플 사용자 A 기준 사주 흐름 | Planned |
| 4 | 2026 운세 | 샘플 사용자 A 기준 2026 운세 | Planned |
| 5 | 띠별운세 | 샘플 연도/띠 기준 화면 | Planned |
| 6 | 저장한 풀이 | 샘플 저장 풀이 화면 | Planned |

주의:

- 실제 스토어 스크린샷 이미지 제작은 Pending으로 유지하세요.
- 실제 이미지 파일은 이번 PR에 추가하지 마세요.

## 5. Copy safety rules

- 참고용 콘텐츠임을 유지
- "반드시", "무조건", "100%", "성공 보장", "불행 확정" 같은 단정 표현 사용 금지
- 의료, 법률, 투자, 안전 관련 판단 유도 금지
- 결제 압박 문구 사용 금지
- 과도한 불안감을 유발하는 문구 사용 금지
- Store listing draft의 차분한 톤과 일치해야 함
- 운세 결과를 절대적 예언으로 표현하지 않음

## 6. Validation checklist before actual screenshot production

| Item | Status | Note |
| --- | --- | --- |
| Sample profile values selected | Completed | Synthetic values documented |
| Actual user data excluded | Planned | 실제 제작 전 재확인 필요 |
| Screenshot target screens confirmed | Pending | 실제 제작 전 최종 확인 |
| Screenshot copy reviewed | Pending | 실제 제작 전 최종 확인 |
| Screenshot resolution validation | Pending | Google Play 요구사항 확인 필요 |
| Screenshot crop/safe-area check | Pending | 실제 제작 시 확인 |
| Final image export | Pending | 실제 이미지 제작 전 |
| Google Play upload | Pending | Console 입력 없음 |

## 7. Not included in this PR

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

## 8. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| 실제 스토어 스크린샷 이미지 제작 | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Store listing final text | Pending |
| 개인정보 처리방침 URL 확정 | Pending |
| 문의처 이메일/지원 연락처 확정 | Pending |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Screenshot target screens finalization | Pending |
| Screenshot copy finalization | Pending |
| Screenshot resolution validation | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 9. Recommended next sequence

1. 캡처할 화면 목록 최종 확인
2. 스크린샷 문구 후보 최종 검토
3. Android debug APK 또는 캡처 기준 빌드 확인
4. 실제 스토어 스크린샷 이미지 제작
5. 제작된 이미지 QA
6. Store listing 최종 문구 확정
7. Google Play Console 입력은 최종값 확정 후 진행

## 10. Conclusion

- This PR documents the synthetic sample profile for store screenshot production only.
- 실제 스토어 스크린샷 이미지 제작 remains Pending.
- Google Play Console input, Store listing final text, 개인정보 처리방침 URL, 문의처 이메일/지원 연락처, and Google Play 데이터 보안 양식 remain Pending.
- No production code, Android packaging, release build, signing, AAB, or Console input changes are included.
