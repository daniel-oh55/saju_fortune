# Ten Gods Analysis Design

## Purpose

이 문서는 하루풀이의 향후 십성 분석 구조를 설계하기 위한 문서이다.

이번 문서는 설계 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 십성 분석을 구현하지 않는다.

## Current Status

현재 하루풀이의 사주 분석 구조:

- 만세력 엔진에서 년주/월주/일주/시주를 산출한다.
- 기존 오행 분석은 천간/지지의 겉오행 중심으로 동작한다.
- 지장간 데이터셋과 지장간 반영 오행 분석 draft 함수는 추가되어 있으나 production 오행 분석에는 연결하지 않는다.
- 십성 매핑 데이터셋은 추가되어 있으나 production 십성 분석에는 연결하지 않는다.
- 오늘운세/2026운세/띠별운세 결과 생성 로직은 기존 구조를 기준으로 유지한다.

## Design Goals

십성 분석의 설계 목표:

- 일간을 기준으로 년간/월간/일간/시간 및 필요 시 지장간의 십성을 산출할 수 있는 구조를 검토한다.
- 기존 겉오행 분석, 지장간 반영 분석, 십성 분석을 서로 분리한다.
- 기존 운세 결과를 갑자기 바꾸지 않는다.
- 십성 분석 결과는 별도 draft 필드로 추가하는 방향을 우선 검토한다.
- 오늘운세/2026운세/띠별운세 결과 생성 로직 연결은 후속 PR에서 별도 검토한다.
- 사용자에게 과도하게 복잡한 명리학 용어를 직접 노출하지 않는다.
- QA 완료 전에는 출시 문구에 정밀 십성 분석 완료라고 쓰지 않는다.

## Proposed Result Structure

아래 구조는 후속 PR 검토를 위한 문서상 제안이며, 이번 PR에서는 실제 코드 타입으로 추가하지 않는다.

```ts
type HeavenlyStemHanja =
  | '甲'
  | '乙'
  | '丙'
  | '丁'
  | '戊'
  | '己'
  | '庚'
  | '辛'
  | '壬'
  | '癸';

type TenGodKey =
  | 'bijian'
  | 'jiecai'
  | 'shishen'
  | 'shangguan'
  | 'piancai'
  | 'zhengcai'
  | 'qisha'
  | 'zhengguan'
  | 'pianyin'
  | 'zhengyin';

type TenGodPillarTarget = 'yearStem' | 'monthStem' | 'dayStem' | 'hourStem';

type TenGodTargetResult = {
  target: TenGodPillarTarget;
  stem: HeavenlyStemHanja;
  tenGod: TenGodKey;
  labelKo: string;
  hanja: string;
  source: 'heavenly-stem';
};

type TenGodAnalysisDraft = {
  source: 'ten-gods';
  dayStem: HeavenlyStemHanja;
  targets: TenGodTargetResult[];
  summaryByTenGod: Record<TenGodKey, number>;
  verificationStatus: 'Pending external verification';
  connectionStatus: 'Not connected to production analysis';
  notes: string[];
};

type CombinedSajuAnalysisDraft = {
  surfaceElements: unknown;
  hiddenStemElements?: unknown;
  tenGods?: TenGodAnalysisDraft;
  summaryMode: 'surface-only' | 'surface-plus-hidden-stems' | 'surface-hidden-stems-ten-gods';
};
```

실제 production 반환 구조는 후속 PR에서 검토한다.

## Analysis Scope Policy

십성 분석 범위는 단계적으로 확장한다.

1단계 후보:

- 일간 기준 년간 십성
- 일간 기준 월간 십성
- 일간 기준 시간 십성
- 일간 자체는 self 기준으로 기록하되 해석 연결은 후속 검토

후속 후보:

- 지장간 십성 산출
- 년지/월지/일지/시지의 지장간 십성 분석
- 십성 분포 요약
- 재성/관성/인성/식상/비겁 계열 그룹 요약
- 오늘운세/2026운세/띠별운세 문구 연결

## Compatibility Policy

기존 앱 결과와의 호환성 정책:

- 기존 surface 오행 분석 결과는 유지한다.
- 지장간 반영 draft 분석은 production에 연결하지 않는다.
- 십성 분석은 별도 결과 구조로 분리한다.
- 오늘운세 seed, 2026운세 seed, 띠별운세 결과 생성 로직은 이번 PR에서 변경하지 않는다.
- schemaVersion은 이번 PR에서 변경하지 않는다.
- 기존 localStorage key는 이번 PR에서 변경하지 않는다.
- localStorage key를 추가하지 않는다.

## Product Copy Guidance

현재 사용할 수 있는 표현:

- 현재 사주 분석은 기본 오행 흐름을 중심으로 참고용 결과를 제공합니다.
- 십성 분석은 향후 정밀 분석 단계에서 검토 중입니다.
- 운세 결과는 참고용 콘텐츠이며, 중요한 결정은 다양한 정보를 함께 확인해 주세요.

현재 피해야 할 표현:

- 십성까지 완벽히 반영한 정밀 사주 분석
- 전문 사주가 수준의 십성 분석
- 대운/세운/용신까지 모두 반영
- 정확한 미래 예측
- 반드시 맞는 사주풀이

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 변경 없음
- 십성 분석 구현 없음
- 십성 분석 production 연결 없음
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
- Ten gods analysis draft: docs/TEN_GODS_ANALYSIS_DRAFT.md
- Ten gods source data: src/data/tenGods.ts
- Hidden stems dataset: docs/HIDDEN_STEMS_DATASET.md
- Hidden stems element analysis design: docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_DESIGN.md
- Hidden stems element analysis draft: docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_DRAFT.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `feat: add ten gods analysis draft`
   - production 연결 전 별도 draft 분석 함수 추가
   - 기존 elementAnalyzer 결과 변경 금지

2. `test: add ten gods analysis QA`
   - 십성 분석 draft 함수 샘플 QA 추가

3. `docs: record ten gods external verification`
   - 십성 데이터 외부 기준 대조 결과 기록

4. `docs: design ten gods copy guidelines`
   - 일반 사용자가 이해할 수 있는 십성 설명 문구 가이드
