# VISIT_STREAK

## 목적

홈 화면에서 사용자가 오늘 운세를 확인한 흐름을 가볍게 돌아볼 수 있도록 연속 방문 기록을 제공한다.
서버 없이 localStorage 기반으로 시작하며, 기존 운세 계산 로직이나 fortune schemaVersion에는 영향을 주지 않는다.

## localStorage key

- `harupuli_visit_streak_v1`

## 개인정보 관련 원칙

- visit streak는 방문 날짜와 연속 방문 숫자만 저장합니다.
- 운세 내용, 생년월일, 출생시간, 성별, 사주 정보는 저장하지 않습니다.
- 개인정보 처리방침 초안은 `docs/PRIVACY_POLICY_DRAFT.md`를 참고합니다.

## 저장 구조

```json
{
  "lastVisitedDateKey": "2026-06-10",
  "currentStreak": 3,
  "bestStreak": 5,
  "visitedDates": ["2026-06-08", "2026-06-09", "2026-06-10"]
}
```

## 기록 규칙

- 날짜 키는 `YYYY-MM-DD` 형식을 사용한다.
- 저장 데이터가 없으면 `currentStreak` 0, `bestStreak` 0으로 시작한다.
- 오늘 처음 방문하면 `currentStreak`는 1이 된다.
- 같은 날 다시 방문해도 `currentStreak`는 증가하지 않는다.
- 어제 방문 후 오늘 방문하면 `currentStreak`가 1 증가한다.
- 하루 이상 건너뛰면 `currentStreak`는 1로 리셋된다.
- `bestStreak`는 현재 연속 방문 기록이 최고 기록을 넘을 때만 갱신된다.
- `visitedDates`는 최근 30일 정도만 유지한다.
- localStorage 파싱에 실패하면 안전하게 빈 streak로 복구한다.

## localStorage 기반으로 시작하는 이유

- 로그인 없이도 MVP에서 바로 사용할 수 있다.
- 서버나 DB 없이 홈 화면의 가벼운 재방문 동기를 검증할 수 있다.
- 운세 계산, 광고 해금, 프로필 저장 구조와 분리해 작은 범위로 운영할 수 있다.

## 향후 확장

- 로그인 기능이 생기면 사용자 계정 기준으로 DB에 동기화할 수 있다.
- 여러 기기 간 streak 동기화는 Firebase/Supabase/Neon 같은 저장소 도입 후 검토한다.
- 서버 저장을 도입해도 기존 localStorage key는 마이그레이션 대상으로만 다루고 임의로 변경하지 않는다.

## 개인정보 주의사항

- streak는 운세 내용이나 생년월일을 저장하지 않는다.
- 성별, 출생시간, 사주 정보도 저장하지 않는다.
- 저장되는 값은 방문 날짜 키와 연속 방문 숫자뿐이다.
