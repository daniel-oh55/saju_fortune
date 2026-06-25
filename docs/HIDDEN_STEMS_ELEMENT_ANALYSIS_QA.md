# Hidden Stems Element Analysis QA

## Purpose

이 문서는 하루풀이의 지장간 반영 오행 분석 draft 함수 결과를 QA하기 위한 문서이다.

이번 문서는 QA 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 지장간 분석 결과를 기존 오행 분석 또는 운세 결과 생성 로직에 연결하지 않는다.

## QA Scope

이번 QA 범위:

- `analyzeHiddenStemElementsFromBranches()` draft 함수 결과 확인
- simple count 방식의 오행 count 확인
- dominant/weak 산출 기준 확인
- branchBreakdown 구조 확인
- verificationStatus 유지 확인
- connectionStatus 유지 확인
- weightingPolicy 유지 확인
- production 오행 분석 연결 여부가 Pending인지 확인

## Sample QA Cases

| Case ID | Input branches | Expected count summary | Expected dominant | Expected weak | Status |
|---|---|---|---|---|---|
| HIDDEN-STEMS-QA-001 | 子, 丑, 寅, 卯 | wood 2 / fire 1 / earth 2 / metal 1 / water 2 | wood, earth, water | fire, metal | Pending script verification |
| HIDDEN-STEMS-QA-002 | 辰, 巳, 午, 未 | wood 2 / fire 3 / earth 4 / metal 1 / water 1 | earth | metal, water | Pending script verification |
| HIDDEN-STEMS-QA-003 | 申, 酉, 戌, 亥 | wood 1 / fire 1 / earth 2 / metal 3 / water 2 | metal | wood, fire | Pending script verification |

계산 기준:

- 子: 癸 -> water 1
- 丑: 己, 癸, 辛 -> earth 1, water 1, metal 1
- 寅: 甲, 丙, 戊 -> wood 1, fire 1, earth 1
- 卯: 乙 -> wood 1
- 辰: 戊, 乙, 癸 -> earth 1, wood 1, water 1
- 巳: 丙, 庚, 戊 -> fire 1, metal 1, earth 1
- 午: 丁, 己 -> fire 1, earth 1
- 未: 己, 丁, 乙 -> earth 1, fire 1, wood 1
- 申: 庚, 壬, 戊 -> metal 1, water 1, earth 1
- 酉: 辛 -> metal 1
- 戌: 戊, 辛, 丁 -> earth 1, metal 1, fire 1
- 亥: 壬, 甲 -> water 1, wood 1

## Expected Result Shape

각 QA 케이스는 아래 구조를 기대한다.

- source: hidden-stems
- counts
- dominant
- weak
- branchBreakdown
- verificationStatus: Pending external verification
- connectionStatus: Not connected to production analysis
- weightingPolicy: simple-count-draft
- notes

## QA Rules

- draft 함수는 입력된 지지 배열만 기준으로 계산한다.
- 이번 PR에서는 simple count 방식만 검증한다.
- main/middle/residual 차등 가중치는 적용하지 않는다.
- dominant는 가장 높은 count를 가진 오행 배열이다.
- weak는 가장 낮은 count를 가진 오행 배열이다.
- branchBreakdown은 입력 지지별 지장간 stem/element/role을 포함해야 한다.
- verificationStatus는 Pending external verification으로 유지한다.
- connectionStatus는 Not connected to production analysis로 유지한다.
- weightingPolicy는 simple-count-draft로 유지한다.
- 이번 PR에서는 production 오행 분석에 연결하지 않는다.
- 이번 PR에서는 완료 또는 통과로 단정하는 영문 상태 표현을 사용하지 않는다.

## QA Result Summary

- HIDDEN-STEMS-QA-001: Pending script verification
- HIDDEN-STEMS-QA-002: Pending script verification
- HIDDEN-STEMS-QA-003: Pending script verification
- production 오행 분석 연결: Pending
- 지장간 데이터 외부 기준 검증: Pending
- 지장간 가중치 정책: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- production elementAnalyzer 연결 없음
- createSajuAnalysis 반환 구조 변경 없음
- 지장간 가중치 정책 확정 없음
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

- Hidden stems dataset: docs/HIDDEN_STEMS_DATASET.md
- Hidden stems dataset QA: docs/HIDDEN_STEMS_DATASET_QA.md
- Hidden stems element analysis design: docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_DESIGN.md
- Hidden stems element analysis draft: docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_DRAFT.md
- Hidden stems draft source: src/domain/saju/hiddenStemElementAnalysisDraft.ts
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: record hidden stems external verification`
   - 지장간 데이터 외부 기준 대조 결과 기록

2. `feat: add hidden stems element analysis integration plan`
   - production 연결 전 결과 구조와 UI/문구 영향 검토

3. `data: add ten gods mapping`
   - 일간 기준 십성 매핑 데이터 추가

4. `test: add ten gods mapping QA`
   - 십성 매핑 데이터 검증
