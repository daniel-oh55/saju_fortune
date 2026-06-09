# MANSERYEOK_VALIDATION

## 내부 debug 페이지 라벨 정책

- 내부 debug 페이지는 한국어 라벨을 기본으로 사용한다.
- `reference_conflict`는 "외부 기준 충돌"로 표시한다.
- expected가 비어 있는 `reference_conflict` 샘플은 "외부 기준값이 충돌하여 expected를 의도적으로 비워둔 샘플"로 안내한다.

## reference_conflict 표시 정책

- `reference_conflict` 샘플은 `expected`가 null이어도 `comparisonStatus`를 `reference_conflict`로 표시한다.
- `reference_conflict`는 계산 실패가 아니라 외부 기준값 충돌 상태다.
- `reference_conflict` 샘플은 pass/fail 판정 대상이 아니다.
- 세 번째 외부 기준 또는 정책 확정 전까지 expected를 입력하지 않는다.

## 절기 기준 충돌 조사 원칙

- 외부 만세력 2곳이 일치하더라도, 라이브러리 exact API와 충돌하는 경우에는 별도 investigation 문서를 둘 수 있다.
- 절기 기준 충돌 샘플은 즉시 엔진 오류로 단정하지 않는다.
- 입춘 절입 시각 확인 후 expected 유지/수정/reference_conflict 변경 여부를 판단한다.
- 현재 `solar_ipchun_boundary` 조사는 `docs/MANSERYEOK_IPCHUN_INVESTIGATION.md`에 기록한다.

## 접근 방법

- 로컬 또는 Vercel Preview에서 `/?debug=manseryeok`로 접속한다.
- 일반 하단 네비게이션에는 노출하지 않는다.
- 이 화면은 내부 검증용이며 사용자 프로필, 오늘운세 캐시, 광고 해금 상태를 저장하지 않는다.

## 검증 샘플 구조

샘플은 `src/domain/saju/manseryeokValidationSamples.js`에 배열로 관리한다.

```js
{
  id: 'solar_regular_known_time',
  title: '양력 일반 생시 있음',
  profile: {
    birthDate: '1990-05-15',
    birthTime: '09:30',
    birthTimeUnknown: false,
    calendarType: 'solar',
    isLeapMonth: false,
    gender: 'other'
  },
  expected: null,
  referenceStatus: 'reference_pending',
  referenceSource: null,
  notes: ['외부 만세력 기준값 입력 필요']
}
```

## expected 권장 구조

외부 만세력 기준값이 확인된 경우에만 아래 구조로 입력한다.

```js
expected: {
  pillars: {
    year: '경오',
    month: '무인',
    day: '갑자',
    hour: '기사'
  },
  dayMaster: {
    stem: '갑'
  },
  convertedSolar: '1990-05-15 09:30:00',
  convertedLunar: {
    year: 1990,
    month: 4,
    day: 21,
    isLeapMonth: false
  }
}
```

## referenceSource 권장 구조

```js
referenceSource: {
  name: '외부 만세력 서비스명 또는 앱 이름',
  url: null,
  checkedAt: '2026-06-08',
  checkedBy: 'manual',
  memo: '입춘 기준 또는 자시 기준 확인 필요'
}
```

## expected 작성 규칙

- `expected`는 외부 만세력 기준값으로 검증한 경우에만 입력한다.
- `lunar-javascript`의 현재 계산 결과를 그대로 복사해 정답처럼 넣지 않는다.
- 기준값 출처는 `referenceSource`에 남긴다.
- 검증되지 않은 샘플은 반드시 `reference_pending` 상태로 둔다.
- `reference_conflict` 샘플은 expected를 null로 유지한다.
- 충돌 기준값은 `referenceSource.memo`와 `notes`에 기록한다.

## referenceStatus 허용값

- `reference_pending`: 외부 기준값 미입력
- `reference_verified`: 외부 기준값 입력 완료
- `reference_conflict`: 외부 기준끼리 결과가 다르거나 기준 차이가 확인됨
- `not_applicable`: 잘못된 입력값처럼 기준값 비교 대상이 아닌 케이스

## comparisonStatus 의미

- `pass`: 외부 기준값과 현재 계산 결과가 비교 항목에서 일치
- `fail`: 외부 기준값과 현재 계산 결과가 일부 불일치
- `reference_pending`: 외부 기준값 입력 전이라 비교 대기
- `calculation_failed`: 계산 실패 또는 입력값 오류
- `not_applicable`: 입력 오류 검증용 등 외부 기준값 비교 대상이 아님

## 외부 기준값 입력 절차

1. 외부 만세력 서비스 또는 앱에서 동일한 생년월일시를 입력한다.
2. 양력/음력/윤달/시간 미상 여부가 샘플과 동일한지 확인한다.
3. 년주, 월주, 일주, 시주를 기록한다.
4. 23시 이후 기준과 입춘 기준을 별도 메모한다.
5. `referenceSource`에 출처, 확인일, 확인자, 기준 메모를 기록한다.
6. `expected`에 외부 기준값을 입력한다.
7. `/?debug=manseryeok`에서 `pass`/`fail` 결과를 확인한다.

## 우선 검증해야 할 케이스

- 양력 일반
- 시간 미상
- 23시 이후 출생
- 입춘 전후 절기 경계
- 음력 일반
- 윤달
- 잘못된 날짜/시간 입력의 실패 처리

## 입춘/자시/태양시 관련 샘플

- 입춘, 23시 이후 자시, 태양시 보정 관련 샘플은 `docs/MANSERYEOK_TIME_POLICY.md`를 함께 참고한다.
- 정책 확정 전에는 검증 실패를 단순 오류로 판단하지 않는다.
- 외부 기준값끼리 충돌한 경우 `reference_conflict`로 분류하고, 3번째 기준 또는 공신력 있는 기준으로 추가 확인한다.

## 표현 원칙

- 검증 전에는 앱에서 “정확한 만세력”이라고 표현하지 않는다.
- “검증 필요”, “기준값 대기”, “외부 만세력 샘플 비교 필요”처럼 보수적으로 표현한다.
- 절기 경계, 23시 이후 자시 기준, 음력/윤달 변환은 별도 기준 검증 전까지 확정 표현을 피한다.
