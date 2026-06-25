# Manseryeok External Sample Verification

## Purpose

이 문서는 하루풀이의 만세력 계산 결과를 외부 만세력 기준 샘플과 비교 검증하기 위한 준비 문서이다.

이번 문서는 검증 케이스와 기록 양식을 정의하는 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

아직 외부 만세력 기준값과 대조한 결과가 없으므로 실제 검증 결과는 Pending으로 유지한다.

## Current Engine Status

- lunar-javascript 기반 양력/음력 변환 사용
- 음력/윤달 입력 처리
- 년주/월주/일주/시주 산출
- 일간 확인
- 천간/지지 겉오행 기준 오행 분포 분석
- 태양시 보정 적용 여부: Pending
- 절기 경계 샘플 검증: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 외부 만세력 기준 샘플 검증: Pending

## Verification Scope

이번 검증 준비 문서는 아래 항목을 대상으로 한다.

- 양력 생년월일 샘플
- 음력 생년월일 샘플
- 윤달 생년월일 샘플
- 절기 경계일 샘플
- 23시 이후 자시 기준 샘플
- 출생시간 모름 샘플
- 태양시 보정 적용 여부 검토 대상 샘플

## Verification Status Summary

- 양력 샘플 검증: Pending
- 음력 샘플 검증: Pending
- 음력/윤달 샘플 외부 검증: Pending
- 절기 경계 샘플 검증: Pending
- 23시 이후 자시 기준 샘플 검증: Pending
- 출생시간 모름 샘플 검증: Pending
- 태양시 보정 적용 여부: Pending
- 외부 만세력 기준 샘플 검증: Pending

## Sample Case Table

| Case ID | Type | Calendar | Date | Time | Option | Expected external result | Current app result | Status | Notes |
|---|---|---|---|---|---|---|---|---|---|
| SOLAR-001 | 양력 기본 샘플 | solar | 1990-01-15 | 09:30 | same_day | Pending | Pending | Pending | 일반 양력 입력 샘플 |
| SOLAR-TERM-001 | 절기 경계 샘플 | solar | 1990-02-04 | 00:30 | same_day | Pending | Pending | Pending | 입춘 전후 검증 필요 |
| LUNAR-001 | 음력 기본 샘플 | lunar | 1990-01-15 | 09:30 | same_day | Pending | Pending | Pending | 음력 변환 검증 필요 |
| LEAP-001 | 윤달 샘플 | lunar leap | 1995-08-15 | 09:30 | same_day | Pending | Pending | Pending | 윤달 처리 검증 필요 |
| JASI-001 | 23시 이후 자시 기준 샘플 | solar | 1990-06-15 | 23:30 | same_day | Pending | Pending | Pending | 입력일 기준 자시 |
| JASI-002 | 23시 이후 자시 기준 샘플 | solar | 1990-06-15 | 23:30 | next_day | Pending | Pending | Pending | 다음 날 자시 기준 |
| UNKNOWN-TIME-001 | 출생시간 모름 샘플 | solar | 1990-06-15 | unknown | fallback_noon | Pending | Pending | Pending | 시주 미상 처리 확인 |
| SOLAR-TIME-001 | 태양시 보정 적용 여부 검토 샘플 | solar | 1990-06-15 | 09:30 | no_solar_time_adjustment | Pending | Pending | Pending | 태양시 보정 적용 여부 검토 |

## Result Recording Format

각 샘플 검증 시 아래 항목을 기록한다.

- Case ID:
- External source:
- External result recorded date:
- Input calendar:
- Input date:
- Input time:
- Late-night jasi policy:
- Expected year pillar:
- Expected month pillar:
- Expected day pillar:
- Expected hour pillar:
- Current app year pillar:
- Current app month pillar:
- Current app day pillar:
- Current app hour pillar:
- Match status:
- Difference reason:
- Follow-up action:

## Verification Rules

- 외부 기준값이 확인되기 전까지 Status는 Pending으로 유지한다.
- 외부 기준값을 임의로 추정하지 않는다.
- 앱 결과를 실제로 실행하지 않은 경우 Current app result는 Pending으로 유지한다.
- 절기 경계일은 외부 기준값과 앱 결과를 별도 기록한다.
- 음력/윤달 샘플 외부 검증은 일반 음력 샘플과 구분한다.
- 태양시 보정 적용 여부는 정책 결정 전까지 Pending으로 유지한다.
- 검증 완료 전에는 Completed, Pass, Done 표현을 사용하지 않는다.

## Related Docs

- Solar sample result records: docs/MANSERYEOK_SOLAR_SAMPLE_RESULTS.md
- Current app sample snapshot: docs/MANSERYEOK_CURRENT_SAMPLE_SNAPSHOT.md
- Current app snapshot execution: `npm run snapshot:manseryeok-current-samples`
- Solar external comparison result: Pending
- External comparison result: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
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

1. `test: record manseryeok solar sample results`
   - 양력 샘플 외부 기준값과 앱 결과 기록

2. `test: record manseryeok lunar leap sample results`
   - 음력/윤달 샘플 외부 검증 결과 기록

3. `test: record solar term boundary sample results`
   - 절기 경계 샘플 검증 결과 기록

4. `test: record late-night jasi sample results`
   - 23시 이후 자시 기준 샘플 검증 결과 기록

5. `docs: decide solar time correction policy`
   - 태양시 보정 적용 여부 정책 결정 문서화
