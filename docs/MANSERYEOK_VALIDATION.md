# MANSERYEOK_VALIDATION

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

## expected 작성 규칙

- `expected`는 외부 만세력 기준값으로 검증한 경우에만 입력한다.
- `lunar-javascript`의 현재 계산 결과를 그대로 복사해 정답처럼 넣지 않는다.
- 기준값 출처는 `referenceSource`에 남긴다.
- 검증되지 않은 샘플은 반드시 `reference_pending` 상태로 둔다.

## comparisonStatus 의미

- `pass`: 외부 기준값과 현재 계산 결과가 비교 항목에서 일치
- `fail`: 외부 기준값과 현재 계산 결과가 일부 불일치
- `reference_pending`: 외부 기준값 입력 전이라 비교 대기
- `calculation_failed`: 계산 실패 또는 입력값 오류

## 우선 검증해야 할 케이스

- 양력 일반
- 시간 미상
- 23시 이후 출생
- 입춘 전후 절기 경계
- 음력 일반
- 윤달
- 잘못된 날짜/시간 입력의 실패 처리

## 표현 원칙

- 검증 전에는 앱에서 “정확한 만세력”이라고 표현하지 않는다.
- “검증 필요”, “기준값 대기”, “외부 만세력 샘플 비교 필요”처럼 보수적으로 표현한다.
- 절기 경계, 23시 이후 자시 기준, 음력/윤달 변환은 별도 기준 검증 전까지 확정 표현을 피한다.
