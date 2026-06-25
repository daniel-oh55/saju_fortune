# Advanced Saju Result Structure

## Purpose

이 문서는 하루풀이의 향후 정교한 사주 엔진 확장을 위해 겉오행, 지장간, 십성 분석 결과를 어떻게 분리하고 조합할지 설계하기 위한 문서이다.

이번 문서는 설계 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 고급 사주 결과 구조를 실제 production 결과에 연결하지 않는다.

## Current Status

현재 하루풀이의 사주 분석 구조:

- 만세력 엔진에서 년주/월주/일주/시주를 산출한다.
- 기존 오행 분석은 천간/지지의 겉오행 중심으로 동작한다.
- 지장간 데이터셋과 지장간 반영 오행 분석 draft 함수가 추가되어 있으나 production 오행 분석에는 연결하지 않는다.
- 십성 매핑 데이터셋과 십성 분석 draft 함수가 추가되어 있으나 production 십성 분석에는 연결하지 않는다.
- 십성 설명 문구 가이드가 추가되어 있으나 실제 UI에는 적용하지 않는다.
- 오늘운세/2026운세/띠별운세 결과 생성 로직은 기존 구조를 기준으로 유지한다.

## Design Goals

고급 사주 결과 구조의 설계 목표:

- 기존 production 결과를 갑자기 바꾸지 않는다.
- 겉오행 분석 결과와 지장간 반영 분석 결과를 분리한다.
- 십성 분석 결과를 별도 구조로 분리한다.
- 향후 지장간 십성 산출이 가능하도록 확장 지점을 남긴다.
- 외부 검증이 끝나기 전까지 정교한 분석 완료로 표현하지 않는다.
- 오늘운세/2026운세/띠별운세 연결은 별도 후속 PR에서 검토한다.
- 사용자에게 보여줄 문구는 참고용 표현을 우선한다.

## Proposed Result Structure

아래 구조는 문서에서만 제안하며, 이번 PR에서 실제 코드 타입으로 추가하지 않는다.

```ts
type AdvancedSajuResultDraft = {
  source: 'advanced-saju-draft';
  releaseScope: 'not-connected-to-production';
  pillars: {
    year: unknown;
    month: unknown;
    day: unknown;
    hour?: unknown;
  };
  analyses: {
    surfaceElements: unknown;
    hiddenStemElements?: unknown;
    tenGods?: unknown;
    hiddenStemTenGods?: unknown;
  };
  status: {
    hiddenStemDataVerification: 'Pending';
    hiddenStemElementAnalysisConnection: 'Pending';
    tenGodsDataVerification: 'Pending';
    tenGodsAnalysisConnection: 'Pending';
    hiddenStemTenGodsCalculation: 'Pending';
    externalManseryeokVerification: 'Pending';
  };
  compatibility: {
    schemaVersionChanged: false;
    existingLocalStorageKeysChanged: false;
    productionResultShapeChanged: false;
  };
  notes: string[];
};
```

주의:

- 이번 PR에서는 위 타입을 실제 코드에 추가하지 않는다.
- 실제 production 반환 구조는 후속 PR에서 별도로 검토한다.
- 기존 `createSajuAnalysis` 반환 구조는 이번 PR에서 변경하지 않는다.

## Analysis Layer Policy

향후 분석 계층은 아래처럼 분리한다.

1. Surface element analysis
   - 현재 production 오행 분석의 기준
   - 천간/지지 겉오행 중심
   - 현재 결과 유지

2. Hidden stem element analysis
   - 지장간 데이터셋 기반
   - 현재 draft 함수와 QA 문서 존재
   - production 연결은 Pending

3. Ten gods analysis
   - 일간 기준 천간 십성 분석
   - 현재 매핑 데이터셋, draft 함수, QA 문서, 문구 가이드 존재
   - production 연결은 Pending

4. Hidden stem ten gods analysis
   - 지장간의 십성 산출
   - 아직 구현하지 않음
   - 향후 검토 후보

## Compatibility Policy

기존 결과와의 호환성 원칙:

- 기존 surface 오행 분석 결과를 유지한다.
- 기존 `createSajuAnalysis` 반환 구조는 이번 PR에서 변경하지 않는다.
- 오늘운세 seed, 2026운세 seed, 띠별운세 결과 생성 로직은 이번 PR에서 변경하지 않는다.
- schemaVersion은 이번 PR에서 변경하지 않는다.
- 기존 localStorage key는 이번 PR에서 변경하지 않는다.
- localStorage key를 추가하지 않는다.
- production result shape은 이번 PR에서 변경하지 않는다.

## Release Scope Policy

현재 release scope:

- 기본 만세력 산출
- 기존 겉오행 중심 오행 분석
- 오늘운세/2026운세/띠별운세의 기존 결과 생성 로직
- 참고용 운세 콘텐츠

현재 release scope에 포함하지 않는 것:

- 지장간 반영 production 오행 분석
- 십성 분석 production 연결
- 지장간 십성 산출
- 태양시 보정
- 외부 만세력 기준 검증 완료 주장
- 전문 사주가 수준의 정밀 분석 주장

## Product Copy Policy

현재 사용할 수 있는 표현:

- 현재 결과는 입력한 생년월일과 출생시간을 기준으로 참고용 운세를 제공합니다.
- 현재 사주 분석은 기본 오행 흐름을 중심으로 참고용 결과를 제공합니다.
- 지장간과 십성 분석은 향후 정교한 분석 단계에서 검토 중입니다.
- 운세 결과는 참고용 콘텐츠이며 중요한 결정은 여러 정보를 함께 확인해 주세요.

현재 피해야 하는 표현:

- 지장간과 십성까지 완벽히 반영한 정밀 사주 분석
- 전문 사주가 수준의 사주 풀이
- 대운, 세운, 십신까지 모두 반영
- 정확한 미래 예측
- 반드시 맞는 사주 풀이

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 production 연결 없음
- 십성 분석 production 연결 없음
- 지장간 십성 산출 없음
- 태양시 보정 적용 없음
- createSajuAnalysis 반환 구조 변경 없음
- production result shape 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- 오늘운세 계산 로직 변경 없음
- 2026운세 계산 로직 변경 없음
- 띠별운세 결과 조합 로직 변경 없음
- 십성 설명 문구 UI 적용 없음
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
- Hidden stems element analysis QA: docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_QA.md
- Ten gods mapping: docs/TEN_GODS_MAPPING.md
- Ten gods mapping QA: docs/TEN_GODS_MAPPING_QA.md
- Ten gods analysis design: docs/TEN_GODS_ANALYSIS_DESIGN.md
- Ten gods analysis draft: docs/TEN_GODS_ANALYSIS_DRAFT.md
- Ten gods analysis QA: docs/TEN_GODS_ANALYSIS_QA.md
- Ten gods copy guidelines: docs/TEN_GODS_COPY_GUIDELINES.md
- Solar time correction policy: docs/SOLAR_TIME_CORRECTION_POLICY.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: advanced saju engine release scope`
   - 현재 release scope와 향후 정교한 분석 범위 구분

2. `docs: record hidden stems external verification`
   - 지장간 데이터 외부 기준 대조 결과 기록

3. `docs: record ten gods external verification`
   - 십성 데이터 외부 기준 대조 결과 기록

4. `feat: add advanced saju integration plan`
   - production 연결 전 결과 구조와 UI/문구 영향 검토
