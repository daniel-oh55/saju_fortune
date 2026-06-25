# Ten Gods Copy Guidelines

## Purpose

이 문서는 하루풀이에서 향후 십성 분석을 사용자에게 설명할 때 사용할 수 있는 문구 기준을 정리한다.

이번 문서는 문구 가이드 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 십성 설명 문구를 실제 UI에 적용하지 않는다.

## Current Scope

이번 PR의 범위:

- 10개 십성의 일반 사용자용 설명 기준 정리
- 사용할 수 있는 표현과 피해야 하는 표현 구분
- 십성 분석의 현재 상태를 Pending으로 유지
- production 십성 분석 연결: Pending
- 십성 데이터 외부 기준 검증: Pending
- 지장간 십성 산출: Pending
- 십성 설명 문구 실제 UI 적용: Pending

## User-Friendly Ten Gods Labels

| Key | Label Ko | Hanja | User-friendly description |
|---|---|---|---|
| bijian | 비견 | 比肩 | 나와 비슷한 기운으로, 자립감과 자기표현, 주변 사람과의 동료성을 살펴보는 기준입니다. |
| jiecai | 겁재 | 劫財 | 나와 비슷하지만 방향이 다른 기운으로, 경쟁감과 협업 중 긴장, 에너지 분산을 살펴보는 기준입니다. |
| shishen | 식신 | 食神 | 내가 자연스럽게 만들어내는 기운으로, 표현력과 꾸준한 산출, 일상의 생산성을 살펴보는 기준입니다. |
| shangguan | 상관 | 傷官 | 내가 밖으로 드러내는 변화의 기운으로, 창의적 표현과 기존 틀을 바꾸려는 흐름을 살펴보는 기준입니다. |
| piancai | 편재 | 偏財 | 유동적인 자원과 기회의 기운으로, 활동성, 유연한 판단, 기회 포착을 살펴보는 기준입니다. |
| zhengcai | 정재 | 正財 | 안정적인 자원과 현실 감각의 기운으로, 책임감, 계획성, 생활의 균형을 살펴보는 기준입니다. |
| qisha | 편관 | 偏官 | 외부 압박과 도전의 기운으로, 긴장 관리, 추진력, 변화에 대응하는 힘을 살펴보는 기준입니다. |
| zhengguan | 정관 | 正官 | 질서와 책임의 기운으로, 규칙, 신뢰, 사회적 역할을 살펴보는 기준입니다. |
| pianyin | 편인 | 偏印 | 비정형적인 관점과 직감의 기운으로, 새로운 관찰, 학습, 감각적인 이해를 살펴보는 기준입니다. |
| zhengyin | 정인 | 正印 | 안정적인 보호와 학습의 기운으로, 지원, 회복, 지식의 기반을 살펴보는 기준입니다. |

## Allowed Copy Examples

현재 사용할 수 있는 표현:

- 십성 분석은 나와 주변 기운의 관계를 참고용으로 살펴보는 기준입니다.
- 비견은 자립감과 자기표현의 흐름을 살펴보는 기준입니다.
- 정관은 책임감과 질서 감각을 살펴보는 기준입니다.
- 편재는 유동적인 자원과 기회 포착의 흐름을 살펴보는 기준입니다.
- 십성 분석은 향후 정교한 분석 단계에서 검토 중입니다.
- 운세 결과는 참고용 콘텐츠이며 중요한 결정은 여러 정보를 함께 확인해 주세요.

## Avoided Copy Examples

현재 피해야 하는 표현:

- 십성까지 완벽히 반영한 정밀 사주 분석
- 전문 사주가 수준의 십성 분석
- 대운, 세운, 십신까지 모두 반영
- 정확한 미래 예측
- 반드시 맞는 사주 풀이
- 연애운이 반드시 오른다
- 직장운이 무조건 좋아진다
- 인간관계를 정확히 예언한다

## Tone Guidelines

십성 설명 문구 작성 기준:

- 확정적 예언보다 참고용 표현을 사용한다.
- 반드시, 무조건, 정확한 예측 같은 표현을 피한다.
- 어려운 명리학 용어를 그대로 노출하기보다 쉬운 설명을 함께 제공한다.
- 사용자의 불안감을 자극하지 않는다.
- 금전, 직업, 관계, 건강과 관련된 문구는 단정하지 않는다.
- 현재 release scope에서는 십성 분석이 production 결과에 연결되지 않았음을 유지한다.

## Current Status

- 십성 매핑 데이터셋: Added
- 십성 매핑 QA: Added
- 십성 분석 설계: Added
- 십성 분석 draft 함수: Added
- 십성 분석 QA: Added
- 십성 설명 문구 실제 UI 적용: Pending
- production 십성 분석 연결: Pending
- 십성 데이터 외부 기준 검증: Pending
- 지장간 십성 산출: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 변경 없음
- 십성 분석 production 연결 없음
- 지장간 십성 산출 없음
- 십성 설명 문구 UI 적용 없음
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
- Ten gods analysis QA: docs/TEN_GODS_ANALYSIS_QA.md
- Ten gods source data: src/data/tenGods.ts
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: record ten gods external verification`
   - 십성 데이터 외부 기준 대조 결과 기록

2. `feat: add ten gods integration plan`
   - production 연결 전 결과 구조와 UI/문구 영향 검토

3. `docs: design advanced saju result structure`
   - 겉오행, 지장간, 십성 결과를 장기적으로 함께 관리하는 구조 검토

4. `docs: advanced saju engine release scope`
   - 현재 release scope와 향후 정교한 분석 범위 구분
