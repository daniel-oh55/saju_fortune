# Zodiac Fortune Engine Improvement Plan

## Purpose

이 문서는 하루풀이의 띠별운세 기능을 실제 출시 전 보완하기 위한 분석 엔진 개선 계획을 정리한다.

이번 문서는 설계/검토 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

## Current Status

- 띠별운세 기능은 앱에 존재함
- 현재 결과 품질, 표현 깊이, 사용자 이해도 개선이 필요함
- 12지 기본 성향 데이터 확장: 완료
- 결과 조합 로직 개선: 이번 PR에서 추가
- 샘플 QA 체크 추가: Pending
- 실제 화면 QA 결과 기록: Pending
- 서버 DB 없음
- 로그인 없음
- localStorage 중심 구조 유지
- 실제 광고 SDK 없음
- 실제 결제 SDK 없음
- 외부 분석 SDK 없음
- Google Play 내부 테스트 업로드 전 보완 대상

## Improvement Goals

- 띠별운세 결과가 단순 문구 반복처럼 느껴지지 않도록 개선
- 띠별 특성과 오늘/연간 흐름을 더 자연스럽게 연결
- 일반 사용자가 이해하기 쉬운 표현 사용
- 결과를 너무 단정적으로 표현하지 않기
- 재물운/투자운/건강운은 과장 또는 보장 표현 금지
- 사주/운세 결과는 참고용 콘텐츠라는 톤 유지
- 기존 routing, schemaVersion, localStorage key는 변경하지 않음

## Proposed Engine Scope

### Zodiac Base Profile

- 12지 동물별 기본 성향
- 장점/주의점
- 관계 성향
- 하루 루틴 추천 방향

### Daily Flow

- 오늘의 전반 흐름
- 일/대인관계/재물/건강/마음관리 흐름
- 좋은 행동
- 피하면 좋은 행동

### Yearly Flow

- 2026년 기준 연간 흐름
- 상반기/하반기 흐름
- 성장 포인트
- 조심할 포인트

### Compatibility Hint

- 잘 맞는 띠
- 조심하면 좋은 띠
- 단정적 궁합 표현은 피하고 참고용 톤 유지

### Tone Safety

- 예언/보장/확정 표현 금지
- 사용자의 선택과 상황에 따라 달라질 수 있음을 전제
- 투자/질병/법률/진로 결정에 대한 단정 금지

## Data Structure Proposal

이 구조는 제안이며, 이번 PR에서 production 코드에 적용하지 않는다.

```ts
type ZodiacAnimal =
  | 'rat'
  | 'ox'
  | 'tiger'
  | 'rabbit'
  | 'dragon'
  | 'snake'
  | 'horse'
  | 'goat'
  | 'monkey'
  | 'rooster'
  | 'dog'
  | 'pig';

type ZodiacFortuneProfile = {
  animal: ZodiacAnimal;
  labelKo: string;
  hanja?: string;
  baseTraits: string[];
  strengths: string[];
  cautions: string[];
  dailyThemes: string[];
  relationshipHints: string[];
  moneyTone: string[];
  healthTone: string[];
  routineHints: string[];
};
```

## Result Composition Proposal

띠별운세 결과는 아래 요소를 조합해 생성하는 방향을 검토한다.

1. 띠 기본 성향
2. 오늘의 흐름 키워드
3. 조심할 포인트
4. 추천 행동
5. 대인관계 힌트
6. 재물/소비 관련 조심스러운 조언
7. 마음관리 또는 루틴 조언

예시:

오늘은 용띠에게 방향을 넓게 보는 힘이 필요한 날입니다.
새로운 일을 무리하게 시작하기보다는, 이미 진행 중인 일을 정리하고 우선순위를 다시 세우는 흐름이 좋습니다.
대인관계에서는 말의 속도보다 상대의 반응을 살피는 태도가 도움이 됩니다.
재물운은 큰 결정보다는 지출 흐름을 점검하는 정도가 적당합니다.
오늘의 작은 루틴은 책상이나 휴대폰 메모를 정리하며 생각을 가볍게 만드는 것입니다.

## QA Criteria

- [ ] 12지 전체에 결과가 존재하는지
- [ ] 특정 띠만 과도하게 긍정/부정적이지 않은지
- [ ] 같은 문장이 반복적으로 노출되지 않는지
- [ ] 재물운이 투자 조언처럼 보이지 않는지
- [ ] 건강운이 의학적 판단처럼 보이지 않는지
- [ ] 결과가 참고용 톤을 유지하는지
- [ ] 일반 사용자가 이해하기 쉬운 표현인지
- [ ] 모바일 화면에서 문장이 너무 길게 보이지 않는지
- [ ] 기존 localStorage key를 변경하지 않았는지
- [ ] schemaVersion을 변경하지 않았는지

## Non-Goals

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- UI 변경 없음
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

1. `data: expand zodiac fortune profile dataset`
   - 12지 기본 성향/주의점/루틴 데이터 확장
   - 완료

2. `feat: improve zodiac fortune composition logic`
   - 기존 routing/localStorage/schemaVersion 유지
   - 결과 문장 조합 방식 개선
   - 이번 PR에서 추가
   - 띠별운세 화면 텍스트 소스 연결

3. `test: add zodiac fortune sample QA checks`
   - 12지 샘플 결과 검증
   - 금지 표현/반복 표현 점검
   - Pending

4. `docs: record zodiac fortune QA result`
   - 실제 화면 기준 QA 결과 기록
   - Pending
