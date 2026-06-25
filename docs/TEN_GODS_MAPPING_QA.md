# Ten Gods Mapping QA

## Purpose

이 문서는 하루풀이 십성 매핑 데이터셋의 10천간 메타데이터, 10개 십성 프로필, 100개 일간 기준 매핑 구성을 QA하기 위한 문서이다.

이번 문서는 QA 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 십성 데이터를 기존 오행 분석 또는 운세 결과 생성 로직에 연결하지 않는다.

## QA Scope

이번 QA 범위:

- 10천간 전체 존재 여부
- 10천간 오행/음양 메타데이터 존재 여부
- 10개 십성 key 존재 여부
- 10개 십성 한글 라벨 존재 여부
- 10개 십성 한자 존재 여부
- 10개 일간 x 10개 target 천간 = 100개 mapping entry 존재 여부
- 각 일간별 target 천간 10개 존재 여부
- 대표 샘플 매핑 기대값 확인
- 외부 검증 상태가 Pending external verification으로 유지되는지 확인
- production 십성 분석 연결 여부가 Pending인지 확인

## Expected Heavenly Stem Metadata

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

## Expected Ten Gods Profiles

| Key | Label Ko | Hanja | Expected status |
|---|---|---|---|
| bijian | 비견 | 比肩 | Pending external verification |
| jiecai | 겁재 | 劫財 | Pending external verification |
| shishen | 식신 | 食神 | Pending external verification |
| shangguan | 상관 | 傷官 | Pending external verification |
| piancai | 편재 | 偏財 | Pending external verification |
| zhengcai | 정재 | 正財 | Pending external verification |
| qisha | 편관 | 偏官 | Pending external verification |
| zhengguan | 정관 | 正官 | Pending external verification |
| pianyin | 편인 | 偏印 | Pending external verification |
| zhengyin | 정인 | 正印 | Pending external verification |

## Mapping Coverage Rules

- 10개 일간이 모두 존재해야 한다.
- 각 일간은 10개 target 천간을 모두 가져야 한다.
- 전체 mapping entry는 100개여야 한다.
- 모든 mapping entry는 dayStem, targetStem, tenGod, verificationStatus, notes를 가져야 한다.
- 모든 verificationStatus는 Pending external verification으로 유지한다.
- 모든 notes는 production 분석에 연결되지 않았음을 명시해야 한다.

## Representative Mapping QA Cases

| Case ID | Day stem | Target stem | Expected ten god | Reason | Status |
|---|---|---|---|---|---|
| TEN-GODS-QA-001 | 甲 | 甲 | bijian | 같은 오행 + 같은 음양 | Pending script verification |
| TEN-GODS-QA-002 | 甲 | 乙 | jiecai | 같은 오행 + 다른 음양 | Pending script verification |
| TEN-GODS-QA-003 | 甲 | 丙 | shishen | 내가 생하는 오행 + 같은 음양 | Pending script verification |
| TEN-GODS-QA-004 | 甲 | 丁 | shangguan | 내가 생하는 오행 + 다른 음양 | Pending script verification |
| TEN-GODS-QA-005 | 甲 | 戊 | piancai | 내가 극하는 오행 + 같은 음양 | Pending script verification |
| TEN-GODS-QA-006 | 甲 | 己 | zhengcai | 내가 극하는 오행 + 다른 음양 | Pending script verification |
| TEN-GODS-QA-007 | 甲 | 庚 | qisha | 나를 극하는 오행 + 같은 음양 | Pending script verification |
| TEN-GODS-QA-008 | 甲 | 辛 | zhengguan | 나를 극하는 오행 + 다른 음양 | Pending script verification |
| TEN-GODS-QA-009 | 甲 | 壬 | pianyin | 나를 생하는 오행 + 같은 음양 | Pending script verification |
| TEN-GODS-QA-010 | 甲 | 癸 | zhengyin | 나를 생하는 오행 + 다른 음양 | Pending script verification |
| TEN-GODS-QA-011 | 乙 | 甲 | jiecai | 같은 오행 + 다른 음양 | Pending script verification |
| TEN-GODS-QA-012 | 丙 | 壬 | qisha | 나를 극하는 오행 + 같은 음양 | Pending script verification |
| TEN-GODS-QA-013 | 丁 | 癸 | qisha | 나를 극하는 오행 + 같은 음양 | Pending script verification |
| TEN-GODS-QA-014 | 戊 | 癸 | zhengcai | 내가 극하는 오행 + 다른 음양 | Pending script verification |
| TEN-GODS-QA-015 | 庚 | 壬 | shishen | 내가 생하는 오행 + 같은 음양 | Pending script verification |
| TEN-GODS-QA-016 | 辛 | 癸 | shishen | 내가 생하는 오행 + 같은 음양 | Pending script verification |
| TEN-GODS-QA-017 | 壬 | 戊 | qisha | 나를 극하는 오행 + 같은 음양 | Pending script verification |
| TEN-GODS-QA-018 | 癸 | 己 | qisha | 나를 극하는 오행 + 같은 음양 | Pending script verification |

## QA Rules

- 십성 매핑은 일간과 target 천간의 오행 생극 관계 및 음양 관계를 기준으로 검증한다.
- 전체 mapping entry는 100개여야 한다.
- 각 일간별 target 천간은 10개여야 한다.
- 모든 십성 key는 적어도 한 번 이상 등장해야 한다.
- verificationStatus는 Pending external verification으로 유지한다.
- 이번 PR에서는 production 십성 분석에 연결하지 않는다.
- 이번 PR에서는 사주/운세 결과 생성 로직에 연결하지 않는다.
- 이번 PR에서는 완료 또는 통과로 단정하는 영문 상태 표현을 사용하지 않는다.

## QA Result Summary

- 10천간 metadata check: Pending script verification
- 10개 십성 profile check: Pending script verification
- 100개 mapping entry coverage check: Pending script verification
- representative mapping check: Pending script verification
- production 십성 분석 연결: Pending
- 십성 데이터 외부 기준 검증: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 변경 없음
- 십성 분석 production 연결 없음
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
- Ten gods source data: src/data/tenGods.ts
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md
- Hidden stems dataset: docs/HIDDEN_STEMS_DATASET.md
- Hidden stems element analysis QA: docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_QA.md

## Suggested Follow-up PRs

1. `docs: design ten gods analysis`
   - 십성 분석 결과 구조 및 production 연결 정책 설계

2. `feat: add ten gods analysis draft`
   - production 연결 전 별도 draft 분석 함수 추가

3. `docs: record ten gods external verification`
   - 십성 데이터 외부 기준 대조 결과 기록

4. `test: add ten gods analysis QA`
   - draft 분석 함수 추가 후 샘플 QA
