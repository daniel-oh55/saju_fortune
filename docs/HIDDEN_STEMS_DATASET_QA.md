# Hidden Stems Dataset QA

## Purpose

이 문서는 하루풀이 지장간 데이터셋의 12지지 구성, 천간 메타데이터, 지장간 조합, 검증 상태를 QA하기 위한 문서이다.

이번 문서는 QA 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 지장간 데이터를 기존 오행 분석 로직에 연결하지 않는다.

## QA Scope

이번 QA 범위:

- 12지지 전체 존재 여부
- 10천간 전체 존재 여부
- 지지별 지장간 조합 존재 여부
- 천간별 오행/음양 메타데이터 존재 여부
- 지지별 한글명/동물명 존재 여부
- 지장간 role 값 존재 여부
- 외부 검증 상태가 Pending external verification으로 유지되는지 확인
- production 오행 분석 연결 여부가 Pending인지 확인

## Expected Branch Coverage

| Branch | Branch Ko | Animal | Expected hidden stems | Expected count | Verification status |
|---|---|---|---|---|---|
| 子 | 자 | 쥐 | 癸 | 1 | Pending external verification |
| 丑 | 축 | 소 | 己, 癸, 辛 | 3 | Pending external verification |
| 寅 | 인 | 호랑이 | 甲, 丙, 戊 | 3 | Pending external verification |
| 卯 | 묘 | 토끼 | 乙 | 1 | Pending external verification |
| 辰 | 진 | 용 | 戊, 乙, 癸 | 3 | Pending external verification |
| 巳 | 사 | 뱀 | 丙, 庚, 戊 | 3 | Pending external verification |
| 午 | 오 | 말 | 丁, 己 | 2 | Pending external verification |
| 未 | 미 | 양 | 己, 丁, 乙 | 3 | Pending external verification |
| 申 | 신 | 원숭이 | 庚, 壬, 戊 | 3 | Pending external verification |
| 酉 | 유 | 닭 | 辛 | 1 | Pending external verification |
| 戌 | 술 | 개 | 戊, 辛, 丁 | 3 | Pending external verification |
| 亥 | 해 | 돼지 | 壬, 甲 | 2 | Pending external verification |

## Expected Stem Metadata

| Stem | Label Ko | Element | Yin/Yang |
|---|---|---|---|
| 甲 | 갑 | wood | yang |
| 乙 | 을 | wood | yin |
| 丙 | 병 | fire | yang |
| 丁 | 정 | fire | yin |
| 戊 | 무 | earth | yang |
| 己 | 기 | earth | yin |
| 庚 | 경 | metal | yang |
| 辛 | 신 | metal | yin |
| 壬 | 임 | water | yang |
| 癸 | 계 | water | yin |

## QA Rules

- 12지지는 모두 한 번 이상 데이터셋에 존재해야 한다.
- 10천간은 모두 한 번 이상 데이터셋 또는 메타데이터에 존재해야 한다.
- 각 지지의 지장간 개수는 Expected count와 일치해야 한다.
- 모든 지장간 entry는 stem, labelKo, element, yinYang, role을 가져야 한다.
- role 값은 main, middle, residual 중 하나여야 한다.
- 외부 기준 검증 전까지 verificationStatus는 Pending external verification으로 유지한다.
- 이번 PR에서는 production 오행 분석에 연결하지 않는다.
- 이번 PR에서는 완료, 통과, 완료됨에 해당하는 표현을 사용하지 않는다.

## QA Result Summary

- 12지지 coverage check: Pending script verification
- 10천간 metadata check: Pending script verification
- 지지별 지장간 count check: Pending script verification
- role value check: Pending script verification
- production 오행 분석 연결 여부: Pending
- 지장간 데이터 외부 기준 검증: Pending

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

## Related Docs

- Hidden stems dataset: docs/HIDDEN_STEMS_DATASET.md
- Hidden stems source data: src/data/hiddenStems.ts
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: design hidden stems element analysis`
   - 기존 겉오행 분석과 지장간 반영 분석을 분리하는 설계 문서 추가

2. `feat: add hidden stems element analysis`
   - 설계 문서 완료 후 production 연결 전 별도 분석 결과 구조 추가

3. `docs: record hidden stems external verification`
   - 지장간 데이터 외부 기준 대조 결과 기록
