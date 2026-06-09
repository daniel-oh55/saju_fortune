# MANSERYEOK_ENGINE

## 2026-06-09 lateNightJasiPolicy 회귀 검증 스크립트

- `lateNightJasiPolicy` 선택값은 `npm run check:late-night-jasi-policy`로 회귀 검증한다.
- 검증 스크립트는 production `calculateManseryeok`와 `buildProfileId`를 직접 호출한다.
- 확인 대상은 `convertedSolar`, notes, profileId 차이, 23시 이후 조건 적용 여부다.
- 이번 PR에서는 production 엔진 정책 자체를 변경하지 않는다.

## 2026-06-09 23시 이후 자시 기준 선택 반영

- production 엔진은 23:00~23:59 출생자에게 `lateNightJasiPolicy` 값을 반영한다.
- 기본값 `same_day`는 입력한 생년월일과 시간을 그대로 계산 기준으로 사용한다.
- `next_day`는 사용자가 명시적으로 선택한 경우에만 계산 기준을 다음 날 00:분으로 보정한다.
- 보정 범위는 23:00~23:59 입력에 한정하며, 22시대 이하와 시간 미상 입력에는 적용하지 않는다.
- 태양시 보정은 여전히 적용하지 않는다.
- `next_day` 선택 시 `convertedSolar`는 보정된 계산 기준을 표시할 수 있으며, notes에 선택 기준을 기록한다.
- fortune schemaVersion은 4에서 5로 올려 기존 캐시가 새 계산 기준을 반영하도록 한다.

## 2026-06-09 KST/CST 절기 보정 production 반영

- production 엔진의 년주/월주 exact 계산에 KST→CST 1시간 보정을 적용했다.
- 이 보정은 절기 기준 년주/월주 계산에만 적용한다.
- 일주/시주 계산에는 적용하지 않는다.
- `convertedSolar`과 `convertedLunar`는 원본 입력 기준을 유지한다.
- 태양시 보정은 여전히 미적용이다.
- 23시 이후 자시/야자시/조자시 정책은 여전히 미정이다.
- fortune `schemaVersion`을 3에서 4로 증가시켜 기존 캐시가 새 계산 결과로 갱신되도록 했다.

## 2026-06-09 KST/CST 절기 경계 검증

- 현재 production 엔진은 아직 KST→CST 절기 보정을 적용하지 않는다.
- 검증 스크립트에서만 KST 입력을 1시간 보정해 `lunar-javascript` exact API 결과를 비교한다.
- 검증 대상은 `solar_ipchun_boundary`, `solar_after_ipchun`, `solar_regular_known_time`이다.
- 실행 명령은 `npm run check:manseryeok-term-timezone`이다.

## 2026-06-09 입춘 경계 보정 검토

- v0 엔진의 년주/월주 계산은 `lunar-javascript`의 `getYearInGanZhiExact()`와 `getMonthInGanZhiExact()` 계열 API를 우선 사용한다.
- exact API 호출이 실패하면 기존 `EightChar` 계산값으로 fallback한다.
- 조사 결과 `solar_ipchun_boundary`(1990-02-04 10:30 Seoul)는 `lunar-javascript` exact API에서도 `경오년 무인월`로 계산되어 외부 기준값 `기사년 정축월`과 불일치한다.
- 샘플별 하드코딩, 수동 절기 테이블, 태양시 보정은 이번 단계에서 적용하지 않았다.
- 태양시 보정은 여전히 미적용 상태다.
- 23시 이후 자시/야자시/조자시 기준은 여전히 미정 상태다.
- 이 엔진 변경은 계산 경로를 명시적으로 정리한 것이며, 외부 기준 충돌은 추가 정책 결정이 필요하다.

## 현재 엔진 버전

- `manseryeok_core_v0`
- 계산 adapter: `src/domain/saju/manseryeokEngine.js`
- 사용 라이브러리: `lunar-javascript`
- 시간 기준 정책은 `docs/MANSERYEOK_TIME_POLICY.md`를 따른다.

## 지원 범위

- 양력 입력을 기반으로 년주, 월주, 일주, 시주 계산
- 음력 입력을 기반으로 양력 변환 후 년주, 월주, 일주, 시주 계산
- 윤달 입력은 `lunar-javascript`가 지원하는 음력 윤달 범위에서만 처리
- 시간 미상은 내부 변환에 12:00을 사용하되, 결과에서는 시주를 `시주 미상`으로 처리
- 앱 내부 표기는 한글 천간/지지 중심으로 변환
- 시간대 metadata는 `Asia/Seoul` 기준으로 기록
- 현재 v0 엔진은 태양시 보정을 적용하지 않는다.

## 계산 항목

- 년주
- 월주
- 일주
- 시주
- 일간
- 천간/지지 겉오행 기준 오행 분포

## 아직 미지원

- 지장간
- 십성
- 신강신약
- 용신
- 대운
- 세운
- 월운 고도화
- 절기 경계 출생자에 대한 기준 검증 자동화
- 23시 이후 자시 기준 정책 확정
- 입춘/절기 경계 보정
- 태양시 보정

## 정확도 검증 필요 사항

- 절기 경계 출생자의 년주/월주 샘플 비교
- 23시 이후 자시 기준 적용 방식 검토
- 음력/윤달 변환 결과 외부 만세력 샘플 비교
- 여러 기준 만세력과 `lunar-javascript` 결과 차이 확인
- 한국 사용자 기준 시간대와 날짜 경계 정책 검토
- 입춘/절기 경계는 외부 기준값 검증 후 보정 예정
- 23시 이후 자시 기준은 아직 미정
- `solar_ipchun_boundary`는 엔진 보정 우선 검토 샘플

## fallback 정책

- 날짜, 시간, 음력/윤달 입력이 라이브러리에서 처리되지 않으면 앱이 깨지지 않도록 기존 mock 분석으로 fallback한다.
- fallback 시 `engineStatus`는 `mock_fallback_manseryeok_failed`로 기록한다.
- fallback 사유는 `fallbackReason`에 남긴다.
- 기존 localStorage key는 변경하지 않는다.
- fortune `schemaVersion`이 다르면 기존 key에 새 fortune을 덮어쓴다.

## 주의

- 이 엔진은 1단계 코어이며, 결과는 외부 만세력 기준 샘플 검증 전까지 `library_based_needs_reference_verification` 상태로 취급한다.
- 운세 문구는 참고용/엔터테인먼트 콘텐츠로 유지하고, 계산 결과를 단정적 예언처럼 표현하지 않는다.
