# Ten Gods Mapping

## Purpose

이 문서는 하루풀이 정밀 사주 엔진 고도화를 위해 추가한 일간 기준 십성 매핑 데이터셋을 설명한다.

이번 문서는 데이터셋 설명 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 십성 데이터를 기존 오행 분석 또는 운세 결과 생성 로직에 연결하지 않는다.

## Current Scope

- 10천간 메타데이터 추가
- 10개 십성 기본 프로필 추가
- 10개 일간 x 10개 target 천간 매핑 데이터 추가
- 외부 검증 상태: Pending external verification
- production 십성 분석 연결: Pending
- 십성 반영 운세 결과 생성: Pending

## Ten Gods Profile Table

## Heavenly Stem Meta Table

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

| Key | Label Ko | Hanja | Summary |
|---|---|---|---|
| bijian | 비견 | 比肩 | 나와 같은 기운으로 자립성, 자기표현, 동료성을 살피는 기준 |
| jiecai | 겁재 | 劫財 | 나와 같은 오행이지만 음양이 달라 경쟁, 분산, 협업의 긴장을 살피는 기준 |
| shishen | 식신 | 食神 | 내가 생하는 기운으로 표현, 생산성, 꾸준한 산출을 살피는 기준 |
| shangguan | 상관 | 傷官 | 내가 생하는 기운 중 음양이 다른 흐름으로 창의성, 변화, 표현의 날카로움을 살피는 기준 |
| piancai | 편재 | 偏財 | 내가 극하는 기운 중 음양이 같은 흐름으로 유동적 자원, 활동성, 기회 포착을 살피는 기준 |
| zhengcai | 정재 | 正財 | 내가 극하는 기운 중 음양이 다른 흐름으로 안정적 자원, 책임감, 현실 감각을 살피는 기준 |
| qisha | 편관 | 偏官 | 나를 극하는 기운 중 음양이 같은 흐름으로 압박, 도전, 긴장 관리를 살피는 기준 |
| zhengguan | 정관 | 正官 | 나를 극하는 기운 중 음양이 다른 흐름으로 규칙, 책임, 질서 감각을 살피는 기준 |
| pianyin | 편인 | 偏印 | 나를 생하는 기운 중 음양이 같은 흐름으로 직관, 학습, 비정형적 도움을 살피는 기준 |
| zhengyin | 정인 | 正印 | 나를 생하는 기운 중 음양이 다른 흐름으로 보호, 안정, 학습 기반을 살피는 기준 |

## Mapping Policy

십성 매핑은 일간과 대상 천간의 오행 생극 관계 및 음양 관계를 기준으로 기록한다.

- 같은 오행 + 같은 음양: 비견
- 같은 오행 + 다른 음양: 겁재
- 내가 생하는 오행 + 같은 음양: 식신
- 내가 생하는 오행 + 다른 음양: 상관
- 내가 극하는 오행 + 같은 음양: 편재
- 내가 극하는 오행 + 다른 음양: 정재
- 나를 극하는 오행 + 같은 음양: 편관
- 나를 극하는 오행 + 다른 음양: 정관
- 나를 생하는 오행 + 같은 음양: 편인
- 나를 생하는 오행 + 다른 음양: 정인

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

## Suggested Follow-up PRs

1. `test: add ten gods mapping QA`
   - 100개 십성 매핑 데이터 검증 강화

2. `docs: design ten gods analysis`
   - 십성 분석 결과 구조 및 production 연결 정책 설계

3. `feat: add ten gods analysis draft`
   - production 연결 전 별도 draft 분석 함수 추가

4. `docs: record ten gods external verification`
   - 십성 데이터 외부 기준 대조 결과 기록

## Related Docs

- Ten gods analysis design: docs/TEN_GODS_ANALYSIS_DESIGN.md
- Ten gods analysis draft: docs/TEN_GODS_ANALYSIS_DRAFT.md
- Ten gods mapping QA: docs/TEN_GODS_MAPPING_QA.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md
