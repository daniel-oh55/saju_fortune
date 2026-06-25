# Ten Gods Analysis Draft

## Purpose

이 문서는 하루풀이의 십성 분석 draft 함수를 설명한다.

이번 문서는 draft 함수 설명 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 십성 분석 결과를 기존 오행 분석 또는 운세 결과 생성 로직에 연결하지 않는다.

## Current Scope

- 일간 기준 천간 십성 분석 draft 함수 추가
- 년간/월간/일간/시간 target 입력 기준 십성 산출
- summaryByTenGod 초안 구조 추가
- verificationStatus: Pending external verification
- connectionStatus: Not connected to production analysis
- production 십성 분석 연결: Pending
- 지장간 십성 산출: Pending
- 십성 데이터 외부 기준 검증: Pending

## Draft Function

신규 함수:

- `analyzeTenGodsFromStems(dayStem, targets)`

입력:

- `dayStem: HeavenlyStemHanja`
- `targets: TenGodTargetInput[]`

출력:

- `TenGodAnalysisDraft`

이번 draft 함수는 천간 기준 십성만 산출한다.
지장간 십성 산출은 이번 PR에서 적용하지 않는다.

## Sample Draft Cases

| Case ID | Day stem | Target stems | Expected behavior | Status |
|---|---|---|---|---|
| TEN-GODS-DRAFT-001 | 甲 | yearStem 甲, monthStem 丙, dayStem 甲, hourStem 癸 | 천간 십성 draft 산출 | Pending script verification |
| TEN-GODS-DRAFT-002 | 丁 | yearStem 甲, monthStem 戊, dayStem 丁, hourStem 癸 | 천간 십성 draft 산출 | Pending script verification |
| TEN-GODS-DRAFT-003 | 庚 | yearStem 戊, monthStem 庚, dayStem 庚, hourStem 壬 | 천간 십성 draft 산출 | Pending script verification |

## Compatibility Policy

- 기존 surface 오행 분석 결과는 유지한다.
- 지장간 반영 draft 분석은 production에 연결하지 않는다.
- 십성 분석 draft는 별도 함수로 분리한다.
- production `elementAnalyzer`에 연결하지 않는다.
- `createSajuAnalysis` 반환 구조를 변경하지 않는다.
- 오늘운세 seed, 2026운세 seed, 띠별운세 결과 생성 로직을 변경하지 않는다.
- schemaVersion을 변경하지 않는다.
- 기존 localStorage key를 변경하지 않는다.
- localStorage key를 추가하지 않는다.

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
- Ten gods analysis QA: docs/TEN_GODS_ANALYSIS_QA.md
- Ten gods copy guidelines: docs/TEN_GODS_COPY_GUIDELINES.md
- Ten gods source data: src/data/tenGods.ts
- Hidden stems element analysis draft: docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_DRAFT.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `test: add ten gods analysis QA`
   - 십성 분석 draft 함수 샘플 QA 추가

2. `docs: record ten gods external verification`
   - 십성 데이터 외부 기준 대조 결과 기록

3. `docs: design ten gods copy guidelines`
   - 일반 사용자가 이해할 수 있는 십성 설명 문구 가이드

4. `feat: add ten gods integration plan`
   - production 연결 전 결과 구조와 UI/문구 영향 검토
