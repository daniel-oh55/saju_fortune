# Hidden Stems Element Analysis Design

## Purpose

이 문서는 하루풀이의 기존 겉오행 분석과 향후 지장간 반영 오행 분석을 분리하기 위한 설계 문서이다.

이번 문서는 설계 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 지장간 반영 오행 분석을 구현하지 않는다.

## Current Element Analysis

현재 하루풀이의 오행 분석은 천간/지지의 겉오행 중심으로 동작한다.

현재 상태:

- 만세력 엔진에서 년주/월주/일주/시주를 산출한다.
- elementAnalyzer는 천간/지지의 겉오행을 기준으로 오행 분포를 계산한다.
- 지장간 데이터셋은 추가되어 있지만 production 오행 분석에는 아직 연결하지 않는다.
- 오늘운세/2026운세/띠별운세 결과 생성 로직은 기존 오행 분석 결과를 기준으로 유지한다.

## Design Goals

지장간 반영 오행 분석의 설계 목표:

- 기존 겉오행 분석 결과와 지장간 반영 분석 결과를 분리한다.
- 기존 오행 분석 결과를 갑자기 바꾸지 않는다.
- 지장간 반영 결과는 별도 필드로 추가하는 방향을 우선 검토한다.
- 오늘운세/2026운세/띠별운세 결과 생성 로직 연결은 후속 PR에서 별도 검토한다.
- 사용자에게 과도하게 복잡한 명리학 용어를 노출하지 않는다.
- QA 완료 전에는 출시 문구에 정밀 지장간 분석 완료라고 쓰지 않는다.

## Proposed Result Structure

아래 구조는 후속 PR 검토를 위한 초안이며, 이번 PR에서는 실제 코드 타입으로 추가하지 않는다.

```ts
type ElementKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

type SurfaceElementAnalysis = {
  source: 'surface-stems-branches';
  counts: Record<ElementKey, number>;
  dominant: ElementKey[];
  weak: ElementKey[];
  notes: string[];
};

type HiddenStemElementAnalysis = {
  source: 'hidden-stems';
  counts: Record<ElementKey, number>;
  weightedCounts?: Record<ElementKey, number>;
  dominant: ElementKey[];
  weak: ElementKey[];
  branchBreakdown: Array<{
    branch: string;
    hiddenStems: Array<{
      stem: string;
      element: ElementKey;
      role: 'main' | 'middle' | 'residual';
    }>;
  }>;
  verificationStatus: 'Pending external verification';
  notes: string[];
};

type CombinedElementAnalysisDraft = {
  surface: SurfaceElementAnalysis;
  hiddenStems?: HiddenStemElementAnalysis;
  summaryMode: 'surface-only' | 'surface-plus-hidden-stems';
};
```

실제 production 반환 구조는 후속 PR에서 검토한다.

## Weighting Policy

지장간 가중치는 이번 PR에서 확정하지 않는다.

후속 검토 후보:

- 단순 count 방식
- main/middle/residual 동일 가중치 방식
- main/middle/residual 차등 가중치 방식
- 월지 지장간 가중치 강화 방식

현재 상태:

- 지장간 가중치 정책: Pending
- 지장간 외부 기준 검증: Pending
- production 오행 분석 연결: Pending

## Compatibility Policy

기존 앱 결과와의 호환성 정책:

- 기존 surface 오행 분석 결과는 유지한다.
- 지장간 반영 분석은 별도 결과 구조로 분리한다.
- 오늘운세 seed, 2026운세 seed, 띠별운세 결과 생성 로직은 이번 PR에서 변경하지 않는다.
- schemaVersion은 이번 PR에서 변경하지 않는다.
- 기존 localStorage key는 이번 PR에서 변경하지 않는다.
- localStorage key를 추가하지 않는다.

## Product Copy Guidance

현재 사용할 수 있는 표현:

- 현재 오행 분석은 천간과 지지의 기본 흐름을 바탕으로 참고용 결과를 제공합니다.
- 지장간 반영 분석은 향후 정밀 분석 단계에서 검토 중입니다.
- 운세 결과는 참고용 콘텐츠이며, 중요한 결정은 다양한 정보를 함께 확인해 주세요.

현재 피해야 할 표현:

- 지장간까지 완벽히 반영한 정밀 사주 분석
- 전문 사주가 수준의 지장간 분석
- 대운/세운/십성/용신까지 모두 반영
- 정확한 미래 예측
- 반드시 맞는 사주풀이

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 구현 없음
- 지장간 반영 결과를 오늘운세/2026운세/띠별운세에 연결하지 않음
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
- Hidden stems element analysis draft: docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_DRAFT.md
- Hidden stems source data: src/data/hiddenStems.ts
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `feat: add hidden stems element analysis draft`
   - production 연결 전 별도 분석 함수/테스트 구조 추가
   - 기존 elementAnalyzer 결과 변경 금지

2. `test: add hidden stems element analysis QA`
   - 지장간 반영 결과 샘플 QA 추가

3. `docs: record hidden stems external verification`
   - 지장간 데이터 외부 기준 대조 결과 기록

4. `data: add ten gods mapping`
   - 일간 기준 십성 매핑 데이터 추가
