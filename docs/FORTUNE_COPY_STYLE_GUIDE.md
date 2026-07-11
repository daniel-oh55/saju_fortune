# Fortune Copy Style Guide

- Status: Fortune copy style guide recorded
- PR type: docs/check-only
- 운세 문구 스타일 가이드 정리: Completed
- 오늘운세 문구 실생활형 개선: Not included
- 스토어 스크린샷 문구 개선: Not included
- production UI 변경: Not included
- 운세 계산 로직 변경: Not included
- 운세 결과 생성 로직 변경: Not included
- Android 실제 기기 또는 에뮬레이터 화면 QA: Pending
- 디자인 변경 후 실제 스토어 스크린샷 이미지 제작: Pending
- Store screenshot upload: Pending
- Google Play Console input: Pending
- Google Play 데이터 보안 양식 최종 입력: Pending
- Release build: Not started
- Signing setup: Not started
- AAB generation: Not started

## 1. Purpose

- Purpose: Define copy standards before improving today fortune copy
- This document guides future fortune copy improvements
- This PR does not change production fortune copy
- This PR does not change store screenshot copy
- This PR does not change fortune logic or result generation logic

## 2. Core direction

- 감성은 유지하되, 사용자가 오늘 실제로 무엇을 하면 좋은지 알 수 있게 쓴다.
- 추상적인 운세 문구를 생활 행동으로 연결한다.
- 단정적 예언보다 부드러운 제안형 문장으로 쓴다.
- 불안감을 자극하지 않는다.
- 금전, 건강, 법률, 투자, 의료 판단처럼 고위험 결정은 강하게 지시하지 않는다.
- 사용자의 하루, 관계, 일, 돈 관리, 휴식, 루틴에 적용 가능한 표현을 우선한다.
- 지나치게 점집 같은 표현보다 개인 맞춤 인사이트 앱처럼 쓴다.

## 3. Recommended copy structure

### Today fortune sentence structure

권장 구조:

1. 오늘의 흐름 한 줄
2. 실생활 행동 조언
3. 조심할 점 또는 균형 포인트

예시 형식:

- 오늘은 새 일을 크게 벌이기보다 이미 잡힌 일정을 정리하기 좋은 흐름입니다.
- 오전에는 미뤄둔 연락이나 일정 확인부터 끝내보세요.
- 급하게 답을 내리기보다 한 번 더 확인하는 태도가 실수를 줄여줍니다.

### Time-slot fortune sentence structure

권장 구조:

1. 시간대 흐름
2. 그 시간에 하면 좋은 작은 행동
3. 피하면 좋은 행동

예시 형식:

- 아침에는 하루의 속도를 천천히 올리는 편이 좋습니다.
- 먼저 해야 할 일 2~3개만 적어두면 오후의 부담이 줄어듭니다.
- 시작부터 모든 일을 해결하려고 무리하지 마세요.

### Monthly fortune sentence structure

권장 구조:

1. 해당 월의 흐름
2. 일/관계/돈/건강 중 하나의 생활 적용 포인트
3. 무리하지 않을 기준

예시 형식:

- 이번 달은 새로운 선택보다 기존 일을 정리하는 데 힘이 실리는 시기입니다.
- 돈을 쓰기 전에는 필요한 지출과 미뤄도 되는 지출을 나누어보세요.
- 약속을 많이 늘리기보다 이미 잡힌 관계를 챙기는 쪽이 안정적입니다.

## 4. Good copy examples

### Before

- 오늘은 정리와 확인에 어울리는 하루입니다.

### After

- 오늘은 새 일을 늘리기보다 이미 잡힌 일정과 연락을 정리하기 좋은 하루입니다. 오전에 미뤄둔 확인을 끝내두면 오후의 실수가 줄어듭니다.

### Before

- 관계에서 부드러운 태도가 도움이 됩니다.

### After

- 오늘은 바로 반박하기보다 상대의 말을 한 번 더 듣는 태도가 좋습니다. 가족이나 동료와의 대화에서는 짧은 질문을 덧붙이면 분위기가 부드러워집니다.

### Before

- 재물운은 안정적인 흐름입니다.

### After

- 오늘은 큰 소비보다 작은 지출을 정리하기 좋은 날입니다. 구독료, 장보기, 교통비처럼 반복되는 지출을 한 번 확인하면 돈의 흐름이 더 안정됩니다.

## 5. Avoid

- 너무 추상적인 표현만 반복하지 않는다.
- "좋은 기운", "흐름", "균형"만 쓰고 실제 행동을 제시하지 않는 문장을 피한다.
- 무조건 성공, 반드시 이익, 큰돈, 질병, 사고처럼 과도하게 단정하거나 불안을 주는 표현을 피한다.
- 의료, 법률, 투자, 시험, 취업 결과를 확정적으로 말하지 않는다.
- 사용자의 실제 상황을 알 수 없는 상태에서 과도하게 개인 사정을 단정하지 않는다.
- 스토어 스크린샷 문구 개선은 이 가이드의 이번 PR 범위에 포함하지 않는다.

## 6. Tone

- 차분한 말투
- 다정하지만 과장하지 않는 말투
- 사용자의 행동을 부드럽게 도와주는 말투
- 명령형보다 제안형
- 불안을 키우지 않는 표현
- "오늘은 ~해보세요", "~을 먼저 정리해보세요", "~을 줄이면 좋습니다" 같은 자연스러운 제안형

## 7. Scope for next PR

- Next PR target: 오늘운세 문구 실생활형 개선
- Store screenshot copy improvements: Not included
- 2026 monthly fortune copy improvement: Later
- Zodiac fortune copy improvement: Later
- AI 상담형 문체 적용: Later
- Fortune calculation logic changes: Not included
- Result generation logic changes: Not included

## 8. Not included in this PR

- No src changes
- No CSS changes
- No image file changes
- No new image files
- No AndroidManifest.xml changes
- No Android native code changes
- No Android resource changes
- No Gradle changes
- No Capacitor config changes
- No routing changes
- No fortune copy/content changes
- No store screenshot copy improvements
- No fortune calculation logic changes
- No fortune result generation logic changes
- No five element calculation logic changes
- No schemaVersion changes
- No CURRENT_FORTUNE_SCHEMA_VERSION changes
- No existing localStorage key changes
- No Google Play Console input
- No Store screenshot upload
- No Google Play 데이터 보안 양식 최종 입력
- No release build
- No signing setup
- No keystore file added
- No AAB generation

## 9. Remaining Pending / Not started items

| Item | Status |
| --- | --- |
| 오늘운세 문구 실생활형 개선 | Not started |
| Android 실제 기기 또는 에뮬레이터 화면 QA | Pending |
| 디자인 변경 후 실제 스토어 스크린샷 이미지 제작 | Pending |
| Store screenshot upload | Pending |
| Google Play Console actual input | Pending |
| Google Play 데이터 보안 양식 최종 입력 | Pending |
| Release build | Not started |
| Signing setup | Not started |
| AAB generation | Not started |

## 10. Conclusion

- This PR records the fortune copy style guide only.
- Today fortune copy improvement will be handled in a separate PR.
- Store screenshot copy improvements are explicitly out of scope.
- No production code, UI, image file, Android packaging, signing, AAB, or Console input changes are included.
