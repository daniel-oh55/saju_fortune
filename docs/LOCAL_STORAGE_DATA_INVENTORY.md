# Local Storage Data Inventory

## Purpose

이 문서는 하루풀이 앱에서 현재 사용하는 localStorage key와 저장 항목을 Google Play 데이터 보안 양식 검토 전에 정리하기 위한 문서이다.

이번 문서는 데이터 인벤토리 문서이며, 실제 localStorage key 변경은 포함하지 않는다.

이번 PR에서는 schemaVersion을 변경하지 않는다.

## Current Storage Scope

현재 저장 구조:

- 서버 DB 없음
- 로그인 없음
- 회원가입 없음
- 실제 광고 SDK 없음
- 실제 결제 SDK 없음
- 외부 분석 SDK 없음
- localStorage 중심 사용자 입력 저장 구조
- 외부 서버로 사용자 입력값 전송 없음

## localStorage Usage Inventory

실제 코드 검색 결과를 기준으로 작성한 localStorage 사용 목록:

| Key or pattern | Source file | Operation | Stored data summary | Status |
|---|---|---|---|---|
| `aiTodayFortune.profile` | `src/utils/storage.js` | `getItem`, `setItem`, `removeItem` | 온보딩/설정에서 저장한 사용자 프로필 객체 | Draft |
| `aiTodayFortune.todayFortune` | `src/utils/storage.js` | `getItem`, `setItem`, `removeItem` | 오늘운세 결과 캐시, `schemaVersion`, `profileId`, `dateKey`, 카테고리 운세, 사주 분석 결과 | Draft |
| `aiTodayFortune.rewardUnlocks` | `src/utils/storage.js` | `getItem`, `setItem`, `removeItem` | fortune id별 보상형 상세 해금 상태, 해금 시각, mock reward type | Draft |
| `harupuli_consent_preferences_v1` | `src/utils/consentPreferencesStorage.js` | `getItem`, `setItem`, `removeItem` | 분석/광고/개인화 광고 동의값, 정책 버전, 갱신 시각 | Draft |
| `harupuli_saved_readings_v1` | `src/utils/savedReadingsStorage.js` | `getItem`, `setItem` | 저장한 풀이 목록의 id, type, title, summary, body, tags, dateKey, savedAt | Draft |
| `harupuli_visit_streak_v1` | `src/utils/visitStreakStorage.js` | `getItem`, `setItem` | 마지막 방문일, 현재 연속 방문 수, 최고 연속 방문 수, 방문 날짜 목록 | Draft |
| `harupuli_daily_reminder_settings_v1` | `src/utils/dailyReminderSettings.js` | `getItem`, `setItem` | 매일 알림 사용 여부와 알림 시간 | Draft |
| `harupuli_profile_region_meta_v1` | `src/utils/profileRegionMetaStorage.js` | `getItem`, `setItem` | 프로필 지역 선택 보조 정보인 province, district | Draft |
| `harupuli_home_quick_menu_prefs` | `src/pages/HomePage.jsx` | `getItem`, `setItem` | 홈 빠른 메뉴에 표시할 메뉴 id 배열 | Draft |

주의:

- 실제 코드에서 확인한 key만 작성했다.
- key 이름을 추측해서 만들지 않았다.
- 동적으로 생성되는 별도 localStorage key는 현재 검색 범위에서 확인되지 않았다.
- 저장값 내부에서 fortune id 또는 reading id처럼 동적으로 생성되는 식별자가 사용된다.
- 확인이 필요한 항목은 Google Play 데이터 보안 양식 입력 전 Pending review로 다시 검토한다.
- 기존 key 이름을 변경하지 않는다.

## User Input Data Notes

사용자 입력 데이터 관련 확인 내용:

- 생년월일 저장 여부: `aiTodayFortune.profile` 프로필 객체에 저장될 수 있으며, 실제 입력 필드 기준 최종 검토가 필요하다.
- 출생시간 저장 여부: `aiTodayFortune.profile` 프로필 객체에 저장될 수 있으며, 실제 입력 필드 기준 최종 검토가 필요하다.
- 성별 저장 여부: `aiTodayFortune.profile` 프로필 객체에 저장될 수 있으며, 실제 입력 필드 기준 최종 검토가 필요하다.
- 이름 또는 별칭 저장 여부: `aiTodayFortune.profile` 프로필 객체에 nickname 계열 값이 저장될 수 있으며, 실제 입력 필드 기준 최종 검토가 필요하다.
- 사주 결과 캐시 저장 여부: `aiTodayFortune.todayFortune`에 오늘운세와 사주 분석 결과 캐시가 저장된다.
- 최근 입력값 저장 여부: 별도 최근 입력 key는 현재 검색 범위에서 확인되지 않았고, 프로필 key가 현재 입력 상태 저장 역할을 한다.
- 저장한 풀이에는 `src/utils/savedReadingsStorage.js` 기준으로 birthDate, birthTime, birthTimeUnknown, calendarType, gender, isLeapMonth, lateNightJasiPolicy, profile 필드를 저장하지 않도록 sanitize한다.
- 지역 선택 보조 정보는 `harupuli_profile_region_meta_v1`에 province, district 형태로 저장된다.
- 확인이 필요한 항목: 실제 Google Play 데이터 보안 양식 입력 전 localStorage key 최종 점검은 Pending review로 유지한다.

## Google Play Data Safety Impact

현재 구조 기준 메모:

- 서버 DB 없음
- 로그인 없음
- 외부 서버 전송 없음
- localStorage는 사용자 기기 내부 저장소 기준
- 실제 Google Play 데이터 보안 양식 입력 전 최종 검토 필요
- 개인정보 처리방침 URL 확정 전까지 Pending 유지
- 문의처 확정 전까지 Pending 유지

## Compatibility Policy

- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- schemaVersion 변경 없음
- production result shape 변경 없음
- 사주/운세 결과 생성 로직 변경 없음

## Pending Items

- localStorage key 최종 점검: Draft
- 실제 Google Play 데이터 보안 양식 입력: Pending
- 개인정보 처리방침 URL 확정: Pending
- 문의처 확정: Pending
- 실제 Google Play Console 입력: Pending
- 실제 기기 QA: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- localStorage key 변경 없음
- localStorage key 추가 없음
- schemaVersion 변경 없음
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- Android native code 변경 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- 실제 Google Play 데이터 보안 양식 입력 없음
- 실제 Google Play Console 입력 없음
- 개인정보 처리방침 URL 확정 없음
- 문의처 확정 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 로그인 추가 없음
- 서버 DB 추가 없음
- 외부 분석 SDK 추가 없음
- iOS 프로젝트 추가 없음

## Related Docs

- Privacy policy content draft: docs/PRIVACY_POLICY_CONTENT_DRAFT.md
- Google Play data safety draft checklist: docs/GOOGLE_PLAY_DATA_SAFETY_DRAFT_CHECKLIST.md
- Google Play app metadata checklist: docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md
- Google Play data safety input readiness: docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md
- Google Play privacy URL input readiness: docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: google play screenshot production checklist`
   - 실제 스토어 스크린샷 이미지 제작 전 준비 항목 정리

2. `docs: release build signing checklist`
   - release build, signing 설정, AAB 생성 전 준비 항목 정리
