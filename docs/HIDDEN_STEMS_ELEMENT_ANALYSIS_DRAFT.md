# Hidden Stems Element Analysis Draft

## Purpose

이 문서는 하루풀이 지장간 데이터셋을 기반으로 지장간 오행 count를 산출하는 draft 함수를 설명한다.

이번 PR에서는 production 계산 로직을 변경하지 않는다.

이번 PR에서는 기존 element analysis 또는 사주/운세 결과 생성 로직에 연결하지 않는다.

## Current Scope

- 지장간 데이터셋 기반 simple count draft 함수 추가
- 지지 배열 입력 기준 지장간 오행 count 산출
- branchBreakdown 초안 구조 추가
- verificationStatus: Pending external verification
- connectionStatus: Not connected to production analysis
- weightingPolicy: simple-count-draft
- production 오행 분석 연결: Pending
- 지장간 가중치 정책: Pending

## Draft Function

`analyzeHiddenStemElementsFromBranches(branches)`는 `EarthlyBranchHanja[]`를 입력으로 받아 `HiddenStemElementAnalysisDraft`를 반환한다.

현재 draft는 simple count only 기준이다.

main/middle/residual 지장간 role별 가중치는 적용하지 않는다.

## Sample Draft Cases

| Case ID | Branches | Expected draft behavior | Verification status |
|---|---|---|---|
| HIDDEN-STEMS-DRAFT-001 | 子, 丑, 寅, 卯 | 지장간 오행 count 산출 | Pending script verification |
| HIDDEN-STEMS-DRAFT-002 | 辰, 巳, 午, 未 | 지장간 오행 count 산출 | Pending script verification |
| HIDDEN-STEMS-DRAFT-003 | 申, 酉, 戌, 亥 | 지장간 오행 count 산출 | Pending script verification |

## Compatibility Policy

- 기존 surface analysis는 유지한다.
- 지장간 반영 분석 draft는 별도 함수로 분리한다.
- production `elementAnalyzer`에 연결하지 않는다.
- `createSajuAnalysis` 반환 구조를 변경하지 않는다.
- today/2026/zodiac seed 또는 result를 변경하지 않는다.
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음

## Non-Goals

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
- Hidden stems element analysis QA: docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_QA.md
- Hidden stems source data: src/data/hiddenStems.ts
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `test: add hidden stems element analysis QA`
2. `docs: record hidden stems external verification`
3. `feat: add hidden stems element analysis integration plan`
4. `data: add ten gods mapping`
