# Ten Gods Analysis QA

## Purpose

이 문서는 하루풀이의 십성 분석 draft 함수 결과를 QA하기 위한 문서이다.

이번 문서는 QA 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 십성 분석 결과를 기존 오행 분석 또는 운세 결과 생성 로직에 연결하지 않는다.

## QA Scope

이번 QA 범위:

- `analyzeTenGodsFromStems()` draft 함수 결과 확인
- 일간 기준 target 천간별 십성 산출 결과 확인
- `summaryByTenGod` count 확인
- `targets` 결과 구조 확인
- `verificationStatus` 유지 확인
- `connectionStatus` 유지 확인
- 지장간 십성 산출이 포함되지 않았는지 확인
- production 십성 분석 연결 여부가 Pending인지 확인

## Sample QA Cases

| Case ID | Day stem | Target stems | Expected target ten gods | Expected summary | Status |
|---|---|---|---|---|---|
| TEN-GODS-ANALYSIS-QA-001 | 甲 | yearStem 甲 / monthStem 丙 / dayStem 甲 / hourStem 癸 | yearStem bijian / monthStem shishen / dayStem bijian / hourStem zhengyin | bijian 2 / shishen 1 / zhengyin 1 | Pending script verification |
| TEN-GODS-ANALYSIS-QA-002 | 丙 | yearStem 乙 / monthStem 己 / dayStem 丙 / hourStem 壬 | yearStem zhengyin / monthStem shangguan / dayStem bijian / hourStem qisha | bijian 1 / shangguan 1 / qisha 1 / zhengyin 1 | Pending script verification |
| TEN-GODS-ANALYSIS-QA-003 | 庚 | yearStem 戊 / monthStem 庚 / dayStem 庚 / hourStem 壬 | yearStem pianyin / monthStem bijian / dayStem bijian / hourStem shishen | bijian 2 / shishen 1 / pianyin 1 | Pending script verification |

### Expected Calculation Notes

- TEN-GODS-ANALYSIS-QA-001
  - 甲 기준 甲: 같은 오행 + 같은 음양 -> bijian
  - 甲 기준 丙: 내가 생하는 오행 + 같은 음양 -> shishen
  - 甲 기준 癸: 나를 생하는 오행 + 다른 음양 -> zhengyin

- TEN-GODS-ANALYSIS-QA-002
  - 丙 기준 乙: 나를 생하는 오행 + 다른 음양 -> zhengyin
  - 丙 기준 己: 내가 생하는 오행 + 다른 음양 -> shangguan
  - 丙 기준 丙: 같은 오행 + 같은 음양 -> bijian
  - 丙 기준 壬: 나를 극하는 오행 + 같은 음양 -> qisha

- TEN-GODS-ANALYSIS-QA-003
  - 庚 기준 戊: 나를 생하는 오행 + 같은 음양 -> pianyin
  - 庚 기준 庚: 같은 오행 + 같은 음양 -> bijian
  - 庚 기준 壬: 내가 생하는 오행 + 같은 음양 -> shishen

## Expected Result Shape

각 QA 케이스는 아래 구조를 기대한다.

- source: ten-gods
- dayStem
- targets
- summaryByTenGod
- verificationStatus: Pending external verification
- connectionStatus: Not connected to production analysis
- notes

각 target result는 아래 구조를 기대한다.

- target
- stem
- tenGod
- labelKo
- hanja
- source: heavenly-stem

## QA Rules

- draft 함수는 입력된 dayStem과 target 천간 배열만 기준으로 계산한다.
- 이번 PR에서는 천간 기준 십성만 검증한다.
- 지장간 십성 산출은 적용하지 않는다.
- summaryByTenGod는 10개 TenGodKey 전체를 포함해야 한다.
- 입력 target별 결과는 target, stem, tenGod, labelKo, hanja, source를 포함해야 한다.
- verificationStatus는 Pending external verification으로 유지한다.
- connectionStatus는 Not connected to production analysis로 유지한다.
- 이번 PR에서는 production 십성 분석에 연결하지 않는다.
- 이번 PR에서는 사주/운세 결과 생성 로직에 연결하지 않는다.
- 이번 PR에서는 완료 확정처럼 보이는 판정 표현을 사용하지 않는다.

## QA Result Summary

- TEN-GODS-ANALYSIS-QA-001: Pending script verification
- TEN-GODS-ANALYSIS-QA-002: Pending script verification
- TEN-GODS-ANALYSIS-QA-003: Pending script verification
- production 십성 분석 연결: Pending
- 지장간 십성 산출: Pending
- 십성 데이터 외부 기준 검증: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 변경 없음
- 십성 분석 production 연결 없음
- 지장간 십성 산출 없음
- createSajuAnalysis 반환 구조 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- 오늘운세 계산 로직 변경 없음
- 2026운세 계산 로직 변경 없음
- 띠별운세 결과 조합 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native code 변경 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- iOS 프로젝트 추가 없음

## Related Docs

- Ten gods mapping: docs/TEN_GODS_MAPPING.md
- Ten gods mapping QA: docs/TEN_GODS_MAPPING_QA.md
- Ten gods analysis design: docs/TEN_GODS_ANALYSIS_DESIGN.md
- Ten gods analysis draft: docs/TEN_GODS_ANALYSIS_DRAFT.md
- Ten gods copy guidelines: docs/TEN_GODS_COPY_GUIDELINES.md
- Ten gods draft source: src/domain/saju/tenGodAnalysisDraft.ts
- Ten gods source data: src/data/tenGods.ts
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: record ten gods external verification`
   - 십성 데이터 외부 기준 대조 결과 기록

2. `docs: design ten gods copy guidelines`
   - 일반 사용자가 이해할 수 있는 십성 설명 문구 가이드

3. `feat: add ten gods integration plan`
   - production 연결 전 결과 구조와 UI/문구 영향 검토

4. `docs: design advanced saju result structure`
   - 겉오행, 지장간, 십성 결과를 장기적으로 함께 관리하는 구조 검토
