# Manseryeok Current Sample Snapshot

## Purpose

이 문서는 외부 만세력 기준값과 비교하기 전에, 하루풀이 현재 만세력 엔진이 샘플 케이스별로 산출하는 결과를 기록하기 위한 문서이다.

이번 문서는 현재 앱 산출값 스냅샷 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

외부 만세력 기준값과의 대조 결과는 아직 Pending으로 유지한다.

## Snapshot Scope

- 대상 엔진: src/domain/saju/manseryeokEngine.js
- 대상 함수: calculateManseryeok(profile)
- 대상 샘플: docs/MANSERYEOK_EXTERNAL_SAMPLE_VERIFICATION.md의 Sample Case Table
- 외부 기준값 대조: Pending
- 태양시 보정 적용 여부: Pending
- 음력/윤달 샘플 외부 검증: Pending

## Current App Snapshot Status

- SOLAR-001 current app result: Recorded
- SOLAR-TERM-001 current app result: Recorded
- LUNAR-001 current app result: Recorded
- LEAP-001 current app result: Recorded
- JASI-001 current app result: Recorded
- JASI-002 current app result: Recorded
- UNKNOWN-TIME-001 current app result: Recorded
- SOLAR-TIME-001 current app result: Recorded
- External comparison result: Pending

## Sample Input Profiles

| Case ID | calendarType | birthDate | birthTime | birthTimeUnknown | isLeapMonth | lateNightJasiPolicy |
|---|---|---|---|---|---|---|
| SOLAR-001 | solar | 1990-01-15 | 09:30 | false | false | same_day |
| SOLAR-TERM-001 | solar | 1990-02-04 | 00:30 | false | false | same_day |
| LUNAR-001 | lunar | 1990-01-15 | 09:30 | false | false | same_day |
| LEAP-001 | lunar | 1995-08-15 | 09:30 | false | true | same_day |
| JASI-001 | solar | 1990-06-15 | 23:30 | false | false | same_day |
| JASI-002 | solar | 1990-06-15 | 23:30 | false | false | next_day |
| UNKNOWN-TIME-001 | solar | 1990-06-15 |  | true | false | same_day |
| SOLAR-TIME-001 | solar | 1990-06-15 | 09:30 | false | false | same_day |

## Snapshot Recording Format

각 샘플의 현재 앱 결과를 기록할 때 아래 항목을 사용한다.

- Case ID:
- Snapshot recorded date:
- Engine:
- Accuracy status:
- Input calendar:
- Input date:
- Input time:
- Birth time unknown:
- Is leap month:
- Late-night jasi policy:
- Converted solar:
- Converted lunar:
- App year pillar:
- App month pillar:
- App day pillar:
- App hour pillar:
- Day master:
- Notes:
- External comparison status:

## Current App Result Table

| Case ID | Current app result | Year pillar | Month pillar | Day pillar | Hour pillar | Day master | Status | Notes |
|---|---|---|---|---|---|---|---|---|
| SOLAR-001 | ok=true | 기사 | 정축 | 경진 | 신사 | 경 / 금 / 양 | Recorded | External comparison pending |
| SOLAR-TERM-001 | ok=true | 기사 | 정축 | 경자 | 병자 | 경 / 금 / 양 | Recorded | External comparison pending |
| LUNAR-001 | ok=true | 경오 | 무인 | 병오 | 계사 | 병 / 화 / 양 | Recorded | External comparison pending |
| LEAP-001 | ok=true | 을해 | 병술 | 계유 | 정사 | 계 / 수 / 음 | Recorded | External comparison pending |
| JASI-001 | ok=true | 경오 | 임오 | 신해 | 경자 | 신 / 금 / 음 | Recorded | External comparison pending |
| JASI-002 | ok=true | 경오 | 임오 | 임자 | 경자 | 임 / 수 / 양 | Recorded | External comparison pending |
| UNKNOWN-TIME-001 | ok=true | 경오 | 임오 | 신해 | 시주 미상 | 신 / 금 / 음 | Recorded | External comparison pending |
| SOLAR-TIME-001 | ok=true | 경오 | 임오 | 신해 | 계사 | 신 / 금 / 음 | Recorded | External comparison pending |

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
