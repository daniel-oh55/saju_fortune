# MANSERYEOK_TIME_POLICY

## 2026-06-09 KST/CST 절기 경계 가설

- PR #17 결과 `lunar-javascript` exact API만으로는 `solar_ipchun_boundary` mismatch가 해소되지 않았다.
- 다음 가설은 `lunar-javascript`의 절기 exact API가 UTC+8 기준으로 동작할 가능성이다.
- 한국 서비스 입력값은 KST, UTC+9 기준이므로 절기 경계 비교 시 1시간 차이가 발생할 수 있다.
- 이번 단계에서는 production 엔진을 수정하지 않고 검증 스크립트로만 확인한다.
- 검증 결과가 안정적이면 다음 PR에서 년주/월주 절기 계산에 KST→CST 보정 적용을 검토한다.

## 2026-06-09 입춘 절입 시각 조사 상태

- `solar_ipchun_boundary`는 아직 엔진 보정 확정 대상이 아니라, 입춘 절입 시각 추가 확인이 필요한 상태다.
- PR #17에서 `lunar-javascript` exact API를 적용했지만 외부 기준값과 mismatch가 유지되었다.
- 입춘 절입 시각 확인 전에는 수동 보정이나 하드코딩을 하지 않는다.
- 1990년 입춘 절입 시각 조사 결과는 `docs/MANSERYEOK_IPCHUN_INVESTIGATION.md`에 기록한다.

## 2026-06-09 입춘 경계 검증 결과

- 이번 보정 검토 대상은 `solar_ipchun_boundary`(1990-02-04 10:30 Seoul)였다.
- 보정 범위는 년주/월주에 한정했고, 일주/시주는 변경하지 않았다.
- `lunar-javascript`의 `getYearInGanZhiExact()`와 `getMonthInGanZhiExact()`는 해당 샘플을 `경오년 무인월`로 계산한다.
- 외부 기준값은 `기사년 정축월`이므로 exact API만으로는 mismatch를 해소하지 못했다.
- `solar_after_ipchun`은 회귀 검증 샘플로 유지한다.
- `solar_before_ipchun`은 `reference_conflict` 상태와 `expected: null`을 유지한다.
- 태양시 보정과 23시 이후 자시/야자시/조자시 정책은 이번 PR에서 변경하지 않는다.

## 목적

하루풀이 만세력 엔진의 시간 경계, 절기 경계, 출생지, 태양시 보정, 자시 처리 기준을 문서화한다.
현재 문서는 계산 엔진 구현을 확정하는 문서가 아니라, 검증 결과를 바탕으로 향후 엔진 보정 방향을 정리하는 기준 문서다.

## 현재 엔진 상태

- 현재 엔진 버전: `manseryeok_core_v0`
- 사용 라이브러리: `lunar-javascript`
- timezone metadata: `Asia/Seoul`
- 실제 계산 결과는 외부 기준값 검증이 필요한 상태
- 정확한 만세력이라고 사용자에게 확정 표현하지 않는다.

## 기본 시간대 정책

- 기본 시간대는 `Asia/Seoul`로 간주한다.
- 현재 v0 엔진은 출생도시별 태양시 보정을 적용하지 않는다.
- 외부 기준값 수집 시 출생도시는 `referenceSource.memo`에 기록한다.
- 출생도시가 Seoul인 샘플과 다른 도시 샘플은 분리해서 검증한다.

## 입춘/절기 기준 정책

- 사주 원국에서 년주와 월주는 절기, 특히 입춘 기준의 영향을 받는다.
- 외부 기준값 2곳 이상이 일치하는 경우 `reference_verified`로 입력한다.
- 외부 기준값이 일치하고 현재 엔진만 다르면 엔진 보정 후보로 분류한다.
- 현재 확인된 우선 보정 후보:
  - `solar_ipchun_boundary`
  - `1990-02-04 10:30 Seoul`
  - 외부 기준: 기사년 정축월 경자일 신사시
  - 현재 엔진 mismatchFields: `pillars.year`, `pillars.month`

## 23시 이후 자시 처리 정책

- 23시 이후 출생자는 일주와 시주가 달라질 수 있는 민감 구간이다.
- 야자시/조자시/자시 기준은 외부 만세력마다 다를 수 있다.
- 현재 v0에서는 자시 기준을 확정하지 않는다.
- 23시 이후 샘플은 `reference_conflict`가 발생할 수 있으므로, 정책 확정 전까지 expected를 억지로 입력하지 않는다.
- 현재 `reference_conflict` 샘플:
  - `solar_before_ipchun`
  - `1990-02-03 23:30 Seoul`
  - sky.told.me: 기사년 정축월 경자일 병자시
  - 포스텔러: 기사년 정축월 기해일 을해시

## 태양시 보정 정책

- 일부 만세력은 출생도시 기반 태양시 보정을 적용할 수 있다.
- 현재 v0 엔진은 태양시 보정을 적용하지 않는다.
- 태양시 보정 적용 여부는 향후 별도 정책으로 결정한다.
- 태양시 보정 여부가 결과에 영향을 줄 수 있는 샘플은 `referenceSource.memo`에 반드시 기록한다.

## 시간 미상 처리 정책

- `birthTimeUnknown=true`인 경우 시주는 확정값처럼 표시하지 않는다.
- 내부 계산 편의를 위해 12:00을 사용할 수 있지만, 결과 표시에서는 시주 미상으로 유지한다.
- 시간 미상 샘플은 시주 비교 대상에서 제외하거나 별도 검증 기준을 둔다.

## referenceStatus 처리 정책

- `reference_pending`: 외부 기준값 미입력 상태
- `reference_verified`: 외부 기준 1곳 이상에서 확인했고, 가능하면 2곳 이상에서 일치한 상태
- `reference_conflict`: 외부 기준값끼리 충돌한 상태
- `not_applicable`: 잘못된 입력값처럼 외부 기준값 비교 대상이 아닌 상태

## reference_conflict 처리 원칙

- expected는 null로 유지한다.
- 충돌한 외부 기준값은 `referenceSource.memo`와 `notes`에 기록한다.
- 3번째 외부 기준 또는 공신력 있는 기준으로 추가 확인한다.
- 충돌 원인이 자시 기준인지, 태양시 보정인지, 절기 기준인지 분류한다.
- 엔진 수정 전까지 사용자 화면에는 확정 표현을 하지 않는다.

## 엔진 보정 우선순위

1. 입춘/절기 기준 보정
2. 23시 이후 자시/야자시/조자시 정책 결정
3. 태양시 보정 적용 여부 결정
4. 음력/윤달 변환 검증
5. 시간 미상 처리 안정화

## 현재 우선 검토 대상

### solar_ipchun_boundary

- 입력: 1990-02-04 10:30 / 양력 / 남성 / Seoul
- 외부 기준: 기사년 정축월 경자일 신사시
- 현재 상태: `reference_verified`
- 현재 엔진 결과: `fail`
- mismatchFields: `pillars.year`, `pillars.month`
- 해석: 입춘/절기 기준 차이 가능성 높음
- 향후 작업: 엔진의 년주/월주 절기 기준 검토

### solar_before_ipchun

- 입력: 1990-02-03 23:30 / 양력 / 남성 / Seoul
- 현재 상태: `reference_conflict`
- sky.told.me: 기사년 정축월 경자일 병자시
- 포스텔러: 기사년 정축월 기해일 을해시
- 해석: 23시 이후 자시 기준 또는 태양시 보정 차이 가능성
- 향후 작업: 세 번째 기준 만세력으로 추가 확인

### solar_after_ipchun

- 입력: 1990-02-05 00:30 / 양력 / 남성 / Seoul
- 외부 기준: 경오년 무인월 신축일 무자시
- 현재 상태: `reference_verified`
- 현재 엔진 결과: `pass`
- 향후 작업: 엔진 보정 후에도 pass가 유지되는지 회귀 검증

## 사용자 표시 원칙

- 검증 전에는 “정확한 만세력”이라고 표현하지 않는다.
- “외부 기준값 검증 중”, “참고용 계산 결과”, “절기/자시 기준 검증 필요”처럼 표현한다.
- `reference_conflict` 샘플은 내부 검증용으로만 사용하고 일반 사용자에게 노출하지 않는다.
