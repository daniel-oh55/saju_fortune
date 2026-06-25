# Solar Time Correction Policy

## Purpose

이 문서는 하루풀이 만세력 엔진에서 태양시 보정 적용 여부를 어떻게 다룰지 정의하기 위한 정책 문서이다.

이번 문서는 정책 결정 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

현재 release scope에서는 태양시 보정을 적용하지 않는다.

## Current Policy

현재 하루풀이의 만세력 계산은 입력된 생년월일과 출생시간을 표준시 기준으로 사용한다.

- 태양시 보정 적용 여부: 현재 release scope에서는 미적용
- 현재 앱 산출값: 표준시 입력 기준
- 태양시 보정 기능 구현: Pending
- 태양시 보정 적용 여부 재검토: 향후 정밀 사주 엔진 고도화 단계에서 검토
- 외부 만세력 기준 샘플 검증: Pending

## Reasoning

현재 release scope에서 태양시 보정을 적용하지 않는 이유:

- 사용자의 출생지 정보 입력 구조가 아직 없다.
- 출생지별 경도/표준시 차이를 계산하는 로직이 아직 없다.
- 외부 만세력 기준 샘플 검증이 아직 Pending이다.
- 태양시 보정 적용 여부를 먼저 문서화한 뒤, 별도 설계/데이터/QA PR로 분리하는 것이 안전하다.
- 기존 production 계산 로직, schemaVersion, 기존 localStorage key를 변경하지 않는 것이 현재 단계의 우선순위다.

## Product Copy Guidance

현재 사용할 수 있는 표현:

- 현재 결과는 입력된 생년월일과 출생시간을 기준으로 참고용 운세를 제공합니다.
- 태양시 보정은 현재 적용하지 않으며, 향후 정밀 분석 기능에서 검토할 수 있습니다.
- 운세 결과는 참고용 콘텐츠이며, 중요한 결정은 다양한 정보를 함께 확인해 주세요.

현재 피해야 할 표현:

- 태양시까지 정밀 보정한 사주풀이
- 출생지 경도까지 반영한 전문 분석
- 전문 사주가 수준의 태양시 보정
- 정확한 미래 예측
- 반드시 맞는 사주풀이

## Future Implementation Requirements

태양시 보정을 향후 적용하려면 아래 항목을 별도 PR로 검토한다.

- 출생지 입력 UX 설계
- 출생지 저장 방식 검토
- 기존 localStorage key와 충돌하지 않는 별도 저장 정책 검토
- 경도 기반 시간 보정 계산 정책 검토
- 한국 내 출생 기준과 해외 출생 기준 처리 방식 검토
- 태양시 보정 적용 여부를 사용자가 이해할 수 있는 안내 문구 설계
- 외부 만세력 기준 샘플 검증
- 태양시 보정 적용 전후 결과 비교 QA

## Related Verification Docs

- External sample verification plan: docs/MANSERYEOK_EXTERNAL_SAMPLE_VERIFICATION.md
- Current app sample snapshot: docs/MANSERYEOK_CURRENT_SAMPLE_SNAPSHOT.md
- Solar sample results: docs/MANSERYEOK_SOLAR_SAMPLE_RESULTS.md
- Lunar/leap month sample results: docs/MANSERYEOK_LUNAR_LEAP_SAMPLE_RESULTS.md
- Late-night jasi sample results: docs/MANSERYEOK_LATE_NIGHT_JASI_SAMPLE_RESULTS.md

Current status:

- 태양시 보정 적용 여부: 현재 release scope에서는 미적용
- 외부 만세력 기준값 대조 결과: Pending
- 실제 기기 QA: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 태양시 보정 계산 로직 추가 없음
- 출생지 입력 UI 추가 없음
- 출생지 저장 구조 추가 없음
- localStorage key 추가 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- 오늘운세 계산 로직 변경 없음
- 2026운세 로직 변경 없음
- 띠별운세 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
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

1. `test: record solar term boundary sample results`
   - SOLAR-TERM-001 외부 기준값 확인 후 절기 경계 차이 분석

2. `test: record manseryeok external comparison summary`
   - 양력/음력/윤달/자시 샘플 외부 비교 결과 종합

3. `data: add hidden stems dataset`
   - 지지별 지장간 데이터 추가
   - production 연결 전 데이터 검증만 수행

4. `docs: design birth location input for solar time correction`
   - 태양시 보정용 출생지 입력 UX/저장 정책 설계
   - 실제 구현은 후속 PR로 분리
