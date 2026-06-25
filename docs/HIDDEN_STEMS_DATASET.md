# Hidden Stems Dataset

## Purpose

이 문서는 하루풀이 정밀 사주 엔진 고도화를 위해 추가한 12지지별 지장간 데이터셋을 설명한다.

이번 문서는 데이터셋 설명 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 지장간 데이터를 기존 오행 분석 로직에 연결하지 않는다.

## Current Scope

- 12지지별 지장간 데이터셋 추가
- 천간별 오행/음양 메타데이터 포함
- 지지별 한글명/동물명 포함
- 외부 검증 상태: Pending external verification
- production 오행 분석 연결: Pending
- 지장간 반영 오행 분석: Pending

## Dataset Table

| Branch | Branch Ko | Animal | Hidden stems | Verification status |
|---|---|---|---|---|
| 子 | 자 | 쥐 | 癸 | Pending external verification |
| 丑 | 축 | 소 | 己, 癸, 辛 | Pending external verification |
| 寅 | 인 | 호랑이 | 甲, 丙, 戊 | Pending external verification |
| 卯 | 묘 | 토끼 | 乙 | Pending external verification |
| 辰 | 진 | 용 | 戊, 乙, 癸 | Pending external verification |
| 巳 | 사 | 뱀 | 丙, 庚, 戊 | Pending external verification |
| 午 | 오 | 말 | 丁, 己 | Pending external verification |
| 未 | 미 | 양 | 己, 丁, 乙 | Pending external verification |
| 申 | 신 | 원숭이 | 庚, 壬, 戊 | Pending external verification |
| 酉 | 유 | 닭 | 辛 | Pending external verification |
| 戌 | 술 | 개 | 戊, 辛, 丁 | Pending external verification |
| 亥 | 해 | 돼지 | 壬, 甲 | Pending external verification |

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 추가 없음
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

## Suggested Follow-up PRs

1. `test: add hidden stems dataset QA`
   - 12지지별 지장간 데이터셋 검증 강화
   - 외부 기준 자료 대조 준비

2. `feat: add hidden stems element analysis`
   - 기존 겉오행 분석과 지장간 반영 분석을 분리
   - production 연결 전 별도 결과 구조 검토

3. `docs: record hidden stems external verification`
   - 지장간 데이터 외부 기준 대조 결과 기록

## Related Docs

- Hidden stems dataset QA: docs/HIDDEN_STEMS_DATASET_QA.md
- Hidden stems element analysis design: docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_DESIGN.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md
