# Manseryeok Late-Night Jasi Sample Results

## Purpose

이 문서는 하루풀이 만세력 엔진의 23시 이후 자시 기준 샘플 결과를 외부 만세력 기준값과 비교 기록하기 위한 문서이다.

이번 문서는 23시 이후 자시 기준 샘플 결과 기록 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

외부 만세력 기준값을 실제로 확인하지 않은 항목은 Pending으로 유지한다.

## Scope

이번 문서는 아래 23시 이후 자시 기준 샘플을 대상으로 한다.

- JASI-001: 23:30 입력, same_day 자시 기준 샘플
- JASI-002: 23:30 입력, next_day 자시 기준 샘플

아직 다루지 않는 항목:

- 양력 샘플 외부 기준값 대조 결과: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 절기 경계 샘플 검증: Pending
- 태양시 보정 적용 여부: Pending
- 전체 외부 만세력 기준 샘플 검증: Pending

## Source Policy

외부 기준값은 실제 외부 만세력 자료 또는 신뢰 가능한 기준 자료에서 확인한 값만 기록한다.

- 외부 기준값을 임의로 추정하지 않는다.
- 외부 기준값 확인 전에는 Expected external result를 Pending으로 유지한다.
- 현재 앱 산출값은 `docs/MANSERYEOK_CURRENT_SAMPLE_SNAPSHOT.md`에 기록된 값을 기준으로 참조한다.
- 외부 기준값과 현재 앱 산출값의 일치 여부를 확인하지 않은 경우 Match status는 Pending으로 유지한다.
- 23시 이후 자시 기준은 same_day와 next_day 정책을 구분해서 기록한다.
- 검증 완료 전에는 완료, 통과, 완료됨에 해당하는 표현을 사용하지 않는다.

## Late-Night Jasi Sample Result Table

| Case ID | Type | Calendar | Date | Time | Late-night jasi policy | Current app year pillar | Current app month pillar | Current app day pillar | Current app hour pillar | Expected external year pillar | Expected external month pillar | Expected external day pillar | Expected external hour pillar | Match status | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| JASI-001 | 23시 이후 자시 기준 샘플 | solar | 1990-06-15 | 23:30 | same_day | 경오 | 임오 | 신해 | 경자 | Pending | Pending | Pending | Pending | Pending | External source not recorded yet |
| JASI-002 | 23시 이후 자시 기준 샘플 | solar | 1990-06-15 | 23:30 | next_day | 경오 | 임오 | 임자 | 경자 | Pending | Pending | Pending | Pending | Pending | External source not recorded yet |

## Result Recording Template

외부 기준값을 실제로 확인한 뒤 아래 양식으로 기록한다.

- Case ID:
- External source name:
- External source URL or reference:
- External result recorded date:
- Input calendar:
- Input date:
- Input time:
- Late-night jasi policy:
- Current app year pillar:
- Current app month pillar:
- Current app day pillar:
- Current app hour pillar:
- Expected external year pillar:
- Expected external month pillar:
- Expected external day pillar:
- Expected external hour pillar:
- Match status:
- Difference reason:
- Follow-up action:

## Verification Rules

- 외부 기준값 확인 전까지 Expected external result는 Pending으로 유지한다.
- 외부 기준값 확인 전까지 Match status는 Pending으로 유지한다.
- 외부 기준값은 임의로 추정하지 않는다.
- 현재 앱 산출값은 PR #148의 현재 앱 스냅샷 문서 기준으로만 사용한다.
- JASI-001은 same_day 자시 기준 샘플로 기록한다.
- JASI-002는 next_day 자시 기준 샘플로 기록한다.
- 두 샘플의 일주 차이는 자시 정책 차이에 따른 현재 앱 산출값으로만 기록하며, 외부 기준값과의 일치 여부는 Pending으로 유지한다.
- 검증 완료 전에는 완료, 통과, 완료됨에 해당하는 표현을 사용하지 않는다.

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- 오늘운세 계산 로직 변경 없음
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

1. `docs: decide solar time correction policy`
   - 태양시 보정 적용 여부 정책 결정 문서화

2. `test: record solar term boundary sample results`
   - SOLAR-TERM-001 외부 기준값 확인 후 절기 경계 차이 분석

3. `test: record manseryeok external comparison summary`
   - 양력/음력/윤달/자시 샘플 외부 비교 결과 종합

4. `data: add hidden stems dataset`
   - 지지별 지장간 데이터 추가

## Related Docs

- Solar time correction policy: docs/SOLAR_TIME_CORRECTION_POLICY.md
- Solar time correction status: currently not applied in release scope
