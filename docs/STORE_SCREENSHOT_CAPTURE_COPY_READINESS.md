# Store Screenshot Capture and Copy Readiness

- Status: Readiness only
- 실제 스토어 스크린샷 이미지 제작: Pending
- Store screenshot upload: Pending
- Google Play Console input: Pending
- Store listing final text: Pending
- This document does not include actual screenshot image files.

## 1. Scope

- Purpose: Finalize planned capture screens and screenshot copy candidates before actual Google Play store screenshot image production
- PR type: docs/check-only
- App name: 하루풀이
- Related Store screenshot production plan PR: #333
- Related Store screenshot sample profile PR: #334
- Related Store listing draft PR: #332
- Current screenshot image production status: Pending
- Current Google Play Console input status: Pending
- Current release build status: Not started
- No production code changes
- No Android native/resource changes
- No screenshot image files added

## 2. Final planned screenshot capture set

| Screenshot | Capture screen | Screenshot copy candidate | Sample data | Status |
| --- | --- | --- | --- | --- |
| 1 | 홈 화면 | 오늘의 운세를 차분하게 살펴보세요 | 샘플 사용자 A | Ready for production |
| 2 | 오늘운세 결과 | 하루의 흐름을 한눈에 확인 | 샘플 사용자 A | Ready for production |
| 3 | 나의 사주 흐름 | 나의 성향과 흐름을 조용히 정리 | 샘플 사용자 A | Ready for production |
| 4 | 2026 운세 | 한 해의 흐름을 참고용으로 확인 | 샘플 사용자 A | Ready for production |
| 5 | 띠별운세 | 띠별 흐름을 가볍게 살펴보기 | 샘플 연도/띠 기준 | Ready for production |
| 6 | 저장한 풀이 | 다시 보고 싶은 풀이를 저장 | 샘플 저장 풀이 | Ready for production |

주의:

- Ready for production은 캡처 계획과 문구 후보가 준비되었다는 뜻입니다.
- 실제 스토어 스크린샷 이미지 제작 완료가 아닙니다.
- 실제 이미지 파일은 이번 PR에 추가하지 않습니다.

## 3. Copy safety review

| Check item | Status | Note |
| --- | --- | --- |
| 참고용 콘텐츠 톤 유지 | Ready | 운세 결과를 절대적 예언으로 표현하지 않음 |
| 단정 표현 회피 | Ready | 반드시/무조건/100%/성공 보장/불행 확정 사용 금지 |
| 의료 판단 유도 없음 | Ready | 전문가 조언 우선 원칙 유지 |
| 법률 판단 유도 없음 | Ready | 전문가 조언 우선 원칙 유지 |
| 투자 판단 유도 없음 | Ready | 전문가 조언 우선 원칙 유지 |
| 안전 판단 유도 없음 | Ready | 전문가 조언 우선 원칙 유지 |
| 결제 압박 문구 없음 | Ready | 실제 결제 SDK도 없음 |
| 개인정보 노출 없음 | Ready | 샘플 사용자 A 기준, 실제 사용자 데이터 금지 |

## 4. Sample profile reference

- Sample profile source: docs/STORE_SCREENSHOT_SAMPLE_PROFILE.md
- Sample profile label: 샘플 사용자 A
- Birth date: 1990-05-15
- Birth time: 07:30
- Birth place: 서울특별시 종로구
- Gender: 여성
- Calendar type: 양력
- Leap month: 해당 없음
- 실제 사용자 데이터가 아님
- 실제 사용자 이름/생년월일/출생시간/출생지/연락처/이메일 노출 금지

## 5. Capture readiness checklist

| Item | Status | Note |
| --- | --- | --- |
| Screenshot target screens finalization | Ready | 6개 화면 계획 확정 |
| Screenshot copy finalization | Ready | 문구 후보 확정 |
| Sample profile criteria | Ready | PR #334 기준 |
| Actual user data exclusion | Ready | 실제 사용자 데이터 금지 |
| Screenshot resolution validation | Pending | 실제 제작 시 확인 |
| Screenshot crop/safe-area check | Pending | 실제 제작 시 확인 |
| Capture device selection | Pending | 실제 캡처 기기 미확정 |
| Android Debug APK basis | Pending | 캡처 기준 APK 미확정 |
| Final image export | Pending | 실제 이미지 제작 전 |
| Google Play upload | Pending | Console 입력 없음 |

## 6. Not included in this PR

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

## 7. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| 실제 스토어 스크린샷 이미지 제작 | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Store listing final text | Pending |
| 개인정보 처리방침 URL 확정 | Pending |
| 문의처 이메일/지원 연락처 확정 | Pending |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Screenshot resolution validation | Pending |
| Screenshot crop/safe-area check | Pending |
| Capture device selection | Pending |
| Android Debug APK basis | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 8. Recommended next sequence

1. 캡처 기기와 캡처 기준 APK 확인
2. 실제 스토어 스크린샷 이미지 제작
3. 제작된 이미지 QA
4. Store listing 최종 문구 확정
5. 개인정보 처리방침 URL/문의처 확정
6. Google Play 데이터 보안 양식 최종 답변 검토
7. Google Play Console 입력은 최종값 확정 후 진행

## 9. Conclusion

- This PR finalizes planned capture screens and screenshot copy candidates only.
- 실제 스토어 스크린샷 이미지 제작 remains Pending.
- Google Play Console input, Store listing final text, 개인정보 처리방침 URL, 문의처 이메일/지원 연락처, and Google Play 데이터 보안 양식 remain Pending.
- No production code, Android packaging, release build, signing, AAB, or Console input changes are included.
