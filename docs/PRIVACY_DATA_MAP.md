# PRIVACY_DATA_MAP

## 목적

앱에서 어떤 데이터가 어디에 저장되고 어떤 화면에서 사용되는지 개발자가 빠르게 확인할 수 있도록 정리합니다.

| 데이터 항목 | 예시 | 저장 위치 | localStorage key | 사용 화면 | 외부 전송 여부 | 비고 |
| --- | --- | --- | --- | --- | --- | --- |
| profile 입력 정보 | 닉네임, 생년월일, 출생시간, 성별, 양력/음력, 윤달, 23시 이후 기준 | 브라우저 localStorage | `aiTodayFortune.profile` | 온보딩, 홈, 설정, 오늘운세, 사주 흐름 | 현재 MVP 기준 없음 | 서버 저장 없음. 향후 계정 기능 도입 시 재검토 필요 |
| fortune 결과 | 오늘운세 점수, 카테고리별 운세, `sajuAnalysis` | 브라우저 localStorage | `aiTodayFortune.todayFortune` | 홈, 오늘운세 상세, 사주 흐름, 2026운세 | 현재 MVP 기준 없음 | `schemaVersion`으로 캐시 유효성 관리 |
| reward unlock 상태 | 카테고리별 해금 여부, 해금 시각, `mock_rewarded_ad` | 브라우저 localStorage | `aiTodayFortune.rewardUnlocks` | 오늘운세 상세, 사주 심화 해석 | 현재 MVP 기준 없음 | 실제 광고 SDK 도입 전 mock 상태 |
| visit streak | 마지막 방문일, 현재 streak, 최고 streak, 최근 방문일 목록 | 브라우저 localStorage | `harupuli_visit_streak_v1` | 홈 | 현재 MVP 기준 없음 | 운세 내용이나 출생 정보는 저장하지 않음 |
| saved readings | 저장한 풀이 제목, 요약, 본문, 태그, 날짜, 저장 시각 | 브라우저 localStorage | `harupuli_saved_readings_v1` | 저장한 풀이, 홈 요약 카드 | 현재 MVP 기준 없음 | 원본 profile 민감 필드는 저장하지 않도록 sanitize |
| share text | 공유 버튼 클릭 시 생성되는 텍스트 | 저장하지 않음 | 해당 없음 | 오늘운세 상세, 사주 흐름, 저장한 풀이 | 사용자가 직접 공유 앱에 붙여넣는 경우만 외부 전달 | 생년월일/출생시간/성별 등 원본 profile 필드는 포함하지 않음 |
| content safety copy | 참고용 해석 안내 문구 | 코드 파일 | 해당 없음 | 홈, 오늘운세 상세, 사주 흐름, 저장한 풀이 | 없음 | 개인정보가 아님 |
| mock rewarded ad outcome | 광고 완료/취소/실패 mock 결과 | 기본 저장하지 않음. 완료 시 unlock 상태만 저장 | `aiTodayFortune.rewardUnlocks` | 광고 해금 UI | 현재 MVP 기준 없음 | 실제 SDK 도입 시 provider 전송 범위 재검토 필요 |
| consent preferences | analytics, ads, personalizedAds | 향후 localStorage 후보 | `harupuli_consent_preferences_v1` 후보 | 향후 동의 배너, 설정 | 현재 MVP 기준 없음 | 아직 구현하지 않음. 실제 SDK 도입 시 검토 |

## 현재 MVP 원칙

- 서버 DB 저장은 사용하지 않습니다.
- 실제 광고 SDK 또는 분석 SDK가 아직 연결되어 있지 않습니다.
- 외부 전송 여부는 현재 MVP 기준으로 “없음”입니다.
- 실제 SDK, 로그인, DB, 결제 기능 도입 시 이 문서를 반드시 업데이트합니다.
