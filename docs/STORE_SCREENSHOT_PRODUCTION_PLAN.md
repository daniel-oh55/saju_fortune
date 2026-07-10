# Store Screenshot Production Plan

- Status: Plan only
- 실제 스토어 스크린샷 이미지 제작: Pending
- Google Play Console input: Pending
- Store screenshot upload: Pending
- This document does not include actual screenshot image files.

## 1. Scope

- Purpose: Plan actual Google Play store screenshot image production
- PR type: docs/check-only
- App name: 하루풀이
- Related Store listing draft PR: #332
- Related data safety draft PR: #331
- Current screenshot image production status: Pending
- Current Google Play Console input status: Pending
- Current release build status: Not started
- No production code changes
- No Android native/resource changes
- No screenshot image files added

## 2. Screenshot concept

- Concept: 고요한 밤의 운세 다이어리
- Tone: 차분한, 따뜻한, 개인 맞춤 인사이트, 참고용 운세 콘텐츠
- Visual direction: 따뜻한 아이보리 배경, 밝은 베이지 카드, 딥 네이비 포인트, 은은한 금색 포인트
- Avoid: 과도한 점집 느낌, 공포 유도, 절대적 예언, 결제 압박, 투자/건강/법률 판단 유도
- 스크린샷 문구는 Store listing 초안과 충돌하지 않아야 합니다.
- 운세 결과는 참고용 콘텐츠임을 유지합니다.

## 3. Planned screenshot set

| Screenshot | Planned screen | Draft message | Status |
| --- | --- | --- | --- |
| 1 | 홈 화면 | 오늘의 운세를 차분하게 살펴보세요 | Planned |
| 2 | 오늘운세 결과 | 하루의 흐름을 한눈에 확인 | Planned |
| 3 | 나의 사주 흐름 | 나의 성향과 흐름을 조용히 정리 | Planned |
| 4 | 2026 운세 | 한 해의 흐름을 참고용으로 확인 | Planned |
| 5 | 띠별운세 | 띠별 흐름을 가볍게 살펴보기 | Planned |
| 6 | 저장한 풀이 | 다시 보고 싶은 풀이를 저장 | Planned |

주의:

- 실제 스토어 스크린샷 이미지 제작은 Pending으로 유지하세요.
- 실제 이미지 파일은 이번 PR에 추가하지 마세요.

## 4. Sample data plan

- 실제 사용자 데이터 사용 금지
- 테스트용 샘플 프로필 사용
- 샘플 생년월일/출생시간/출생지/성별은 실제 사용자를 특정하지 않는 테스트 값 사용
- 스크린샷에 민감한 원본 프로필 정보가 과도하게 노출되지 않도록 확인
- 저장한 풀이 화면에는 실제 사용자 이름, 실제 생년월일, 실제 출생시간, 실제 출생지 노출 금지
- 공유 문구는 개인정보 제외 QA 결과와 충돌하지 않아야 함

## 5. Copy guidelines

- 참고용 콘텐츠임을 유지
- "반드시", "무조건", "100%", "성공 보장", "불행 확정" 같은 단정 표현 사용 금지
- 의료, 법률, 투자, 안전 관련 판단 유도 금지
- 결제 압박 문구 사용 금지
- 과도한 불안감을 유발하는 문구 사용 금지
- Store listing draft의 차분한 톤과 일치해야 함

## 6. Device and capture planning

| Item | Status | Note |
| --- | --- | --- |
| Capture device | Pending | 실제 캡처 기기 미확정 |
| Android Debug APK basis | Pending | 캡처용 APK 기준 미확정 |
| Release build screenshot basis | Not started | release build 미생성 |
| Screenshot resolution check | Pending | Google Play 요구사항 확인 필요 |
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
| Capture device selection | Pending |
| Screenshot sample data finalization | Pending |
| Screenshot resolution validation | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 9. Recommended next sequence

1. 스크린샷에 사용할 샘플 프로필 기준 확정
2. 캡처할 화면 목록 최종 확인
3. 스크린샷 문구 후보 검토
4. 실제 스토어 스크린샷 이미지 제작
5. 제작된 이미지 QA
6. Store listing 최종 문구 확정
7. Google Play Console 입력은 최종값 확정 후 진행

## 10. Conclusion

- This PR documents the store screenshot production plan only.
- 실제 스토어 스크린샷 이미지 제작 remains Pending.
- Google Play Console input, Store listing final text, 개인정보 처리방침 URL, 문의처 이메일/지원 연락처, and Google Play 데이터 보안 양식 remain Pending.
- No production code, Android packaging, release build, signing, AAB, or Console input changes are included.
