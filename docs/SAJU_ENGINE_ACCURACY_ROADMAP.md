# Saju Engine Accuracy Roadmap

## Purpose

이 문서는 하루풀이의 사주/운세 분석 엔진이 현재 어느 수준까지 구현되어 있는지 정리하고, 정식 출시 전후로 정밀도를 높이기 위한 개선 로드맵을 정의한다.

이번 문서는 설계/검토 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

## Current Engine Summary

현재 하루풀이 엔진은 “전통 사주 이론 일부를 기반으로 한 개인화 운세 콘텐츠 엔진 1단계”로 분류한다.

현재 구현된 요소:

- lunar-javascript 기반 양력/음력 변환
- 음력/윤달 입력 처리
- 년주/월주/일주/시주 산출
- 일간 확인
- 천간/지지 겉오행 기준 오행 분포 분석
- 강한 오행/약한 오행 추정
- 오행 dominant/weak 기반 오늘운세 seed 반영
- 오늘운세 템플릿 조합
- 2026운세 템플릿 조합
- 12지 띠별운세 데이터셋 및 조합 로직
- 띠별운세 사주 연주 지지 우선 표시 정책 반영

## Current Limitations

현재 엔진은 전문 명리학 전체 로직을 완성한 상태가 아니다.

아직 미구현 또는 Pending인 항목:

- 지장간 반영
- 십성 분석
- 용신/희신/기신 판단
- 대운 계산
- 세운 분석
- 월운 분석
- 대운 + 세운 + 원국 관계 해석
- 형충회합/합충파해 분석
- 공망/신살 등 보조 요소
- 태양시 보정 적용 여부
- 절기 경계 샘플 검증
- 음력/윤달 샘플 외부 검증
- 외부 만세력 기준 샘플 검증

## Product Copy Guidance

현재 사용 가능한 표현:

- 생년월일과 기본 사주 흐름을 바탕으로 오늘의 운세를 참고용으로 제공합니다.
- 사주 오행 흐름을 바탕으로 하루의 작은 방향을 살펴볼 수 있습니다.
- 만세력과 오행 분석을 활용해 개인화된 운세 콘텐츠를 제공합니다.
- 운세 결과는 참고용 콘텐츠이며, 중요한 결정은 다양한 정보를 함께 확인해 주세요.

현재 피해야 할 표현:

- 전문 사주가 수준의 정밀 분석
- 정통 명리학 완전 반영
- 대운/세운/십성/용신까지 모두 반영
- 정확한 미래 예측
- 투자/건강/진로 결과 보장
- 반드시 맞는 사주풀이

## Accuracy Roadmap

### Phase 1. Current Baseline Documentation
Status: In progress

- 현재 만세력/오행 기반 엔진 상태 문서화
- 현재 limitations 문서화
- 제품 문구 기준 정리
- 외부 검증 필요 항목 분리

### Phase 2. External Manseryeok Sample Verification
Status: Pending

- 양력 샘플 검증
- 음력/윤달 샘플 외부 검증
- 절기 경계일 샘플 검증
- 23시 이후 자시 기준 샘플 검증
- 태양시 보정 적용 여부 검토
- 외부 만세력 기준과 결과 비교 문서화
- 외부 만세력 기준 샘플 검증 준비 문서: docs/MANSERYEOK_EXTERNAL_SAMPLE_VERIFICATION.md 참고
- 실제 외부 기준값 대조 결과: Pending
- 현재 앱 만세력 샘플 산출값 스냅샷 문서: docs/MANSERYEOK_CURRENT_SAMPLE_SNAPSHOT.md 참고
- 외부 기준값 대조 결과: Pending
- 양력 샘플 결과 기록 문서: docs/MANSERYEOK_SOLAR_SAMPLE_RESULTS.md 참고
- 양력 샘플 외부 기준값 대조 결과: Pending
- 음력/윤달 샘플 결과 기록 문서: docs/MANSERYEOK_LUNAR_LEAP_SAMPLE_RESULTS.md 참고
- 음력/윤달 샘플 외부 기준값 대조 결과: Pending
- 23시 이후 자시 기준 샘플 결과 기록 문서: docs/MANSERYEOK_LATE_NIGHT_JASI_SAMPLE_RESULTS.md 참고
- 23시 이후 자시 기준 샘플 외부 기준값 대조 결과: Pending
- 태양시 보정 적용 여부 정책 문서: docs/SOLAR_TIME_CORRECTION_POLICY.md 참고
- 태양시 보정 적용 여부: 현재 release scope에서는 미적용

### Phase 3. Hidden Stems / 지장간
Status: Pending

- 지지별 지장간 데이터 정의
- 천간/지지 겉오행 분석과 지장간 반영 분석 분리
- 지장간 반영 후 오행 분포 변화 확인
- 기존 오행 결과와 호환성 점검
- 지장간 데이터셋: src/data/hiddenStems.ts
- 지장간 데이터셋 설명 문서: docs/HIDDEN_STEMS_DATASET.md
- 지장간 반영 오행 분석 연결: Pending
- 지장간 데이터 외부 기준 검증: Pending
- 지장간 데이터셋 QA 문서: docs/HIDDEN_STEMS_DATASET_QA.md 참고
- 지장간 데이터셋 QA 상태: Pending script verification
- 지장간 반영 오행 분석 설계 문서: docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_DESIGN.md 참고
- 지장간 가중치 정책: Pending
- production 오행 분석 연결: Pending

### Phase 4. Ten Gods / 십성
Status: Pending

- 일간 기준 십성 매핑 정의
- 년주/월주/일주/시주 각 기둥의 십성 산출
- 재성/관성/인성/식상/비겁 계열 해석 기준 정리
- 재물/일/관계/학습 문구 연결 정책 검토

### Phase 5. Annual Flow / 세운
Status: Pending

- targetYear의 천간/지지 산출
- 원국과 세운의 오행 관계 분석
- 세운이 오늘운세/연도운세 문구에 미치는 범위 정의
- 2026운세 엔진과 연결 정책 검토

### Phase 6. Major Luck Cycle / 대운
Status: Pending

- 대운 시작 시점 계산 정책 검토
- 성별/음양/출생시점 기준 대운 방향 정의
- 대운 간지 산출
- 대운 + 세운 + 원국 관계 해석은 별도 후속 PR로 분리

### Phase 7. Combination and Conflict Rules
Status: Pending

- 합/충/형/파/해 기초 규칙 정의
- 원국 내부 관계와 세운/대운 관계 분리
- 사용자에게 과도하게 불안감을 주지 않는 표현 정책 수립

### Phase 8. QA and Product Safety
Status: Pending

- 샘플 프로필별 사주 결과 QA
- 금지 표현 검사
- 투자/건강/진로 단정 표현 검사
- 실제 화면 QA
- 실제 기기 QA

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- 오늘운세 로직 변경 없음
- 2026운세 로직 변경 없음
- 띠별운세 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
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

1. `test: add manseryeok external sample verification`
   - 외부 만세력 기준 샘플 검증 문서/check script 추가
   - 음력/윤달 샘플 외부 검증 포함
   - 절기 경계 샘플 포함

2. `data: add hidden stems dataset`
   - 지지별 지장간 데이터 추가
   - production 연결 전 데이터 검증만 수행

3. `feat: add hidden stems element analysis`
   - 기존 겉오행 분석과 지장간 반영 분석을 분리
   - 기존 schemaVersion/localStorage key 변경 금지

4. `data: add ten gods mapping`
   - 일간 기준 십성 매핑 데이터 추가
   - production 연결 전 검증만 수행

5. `feat: add annual flow relation analysis`
   - 세운 산출 및 원국과의 관계 분석
   - 2026운세 연결은 별도 검토
