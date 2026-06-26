# Google Play Screenshot Production Checklist

## Purpose

이 문서는 하루풀이의 실제 스토어 스크린샷 이미지 제작 전에 확인할 준비 항목을 정리한다.

이번 문서는 스크린샷 제작 체크리스트 문서이며, 실제 스토어 스크린샷 이미지 제작은 포함하지 않는다.

이번 PR에서는 실제 Google Play Console 입력을 수행하지 않는다.

## Production Status

- Google Play 스크린샷 제작 체크리스트: Draft
- 실제 스토어 스크린샷 이미지 제작: Pending
- 실제 Google Play Console 입력: Pending
- 실제 기기 QA: Pending
- Play Console 내부 테스트 업로드: Pending
- release build: Pending
- signing 설정: Pending
- AAB 생성: Pending

## Required Screenshot Candidates

실제 제작 전 후보 화면:

| Order | Screen | Purpose | Production status |
|---|---|---|---|
| 1 | 홈 | 앱의 첫인상과 오늘운세 진입 흐름 소개 | Pending |
| 2 | 오늘운세 | 하루의 흐름을 참고용으로 확인하는 기능 소개 | Pending |
| 3 | 2026운세 | 연간 흐름을 가볍게 살펴보는 기능 소개 | Pending |
| 4 | 띠별운세 | 띠별운세를 참고용으로 확인하는 기능 소개 | Pending |
| 5 | 내정보 | 생년월일/출생시간 입력 및 관리 흐름 소개 | Pending |

주의:

- 실제 스토어 스크린샷 이미지 제작 전까지 모든 화면은 Pending으로 유지한다.
- 실제 기기 또는 최종 빌드 기준 화면 캡처 전에는 완료로 표시하지 않는다.

## Caption Source

캡션 기준 문서는 아래를 따른다.

- Google Play screenshot caption plan: docs/GOOGLE_PLAY_SCREENSHOT_CAPTION_PLAN.md
- Google Play listing claim safety: docs/GOOGLE_PLAY_LISTING_CLAIM_SAFETY.md
- Google Play description draft: docs/GOOGLE_PLAY_DESCRIPTION_DRAFT.md

사용 가능한 캡션 방향:

- 오늘의 운세를 차분히 살펴보세요
- 하루의 흐름을 가볍게 확인해보세요
- 2026년의 큰 흐름을 미리 참고해보세요
- 띠별운세를 간단하게 확인해보세요
- 내 정보를 기준으로 운세 흐름을 준비해보세요

피해야 할 캡션 방향:

- 정확히 맞는 오늘운세
- 미래를 예측하는 사주 앱
- 전문 사주가 수준의 정밀 분석
- 지장간과 십성까지 완벽히 반영한 사주풀이
- 태양시까지 정확히 보정한 결과
- 재물운이 반드시 오르는 운세
- 연애운이 무조건 좋아지는 운세

## Visual Production Notes

실제 제작 시 참고할 시각 방향:

- 콘셉트: 고요한 밤의 운세 다이어리
- 따뜻한 아이보리 배경
- 밝은 베이지 카드
- 딥 네이비 포인트
- 은은한 금색 포인트
- 달, 별, 산수 실루엣 같은 절제된 상징
- 점집 느낌보다 개인 맞춤 인사이트 앱 느낌
- 광고 영역이 핵심 화면 이해를 방해하지 않도록 구성

## Device and Capture Notes

실제 제작 전 확인할 항목:

- Android 실제 기기 또는 신뢰 가능한 에뮬레이터 기준으로 캡처
- 최종 디자인 상태 확인 전까지 Pending
- release build 또는 내부 테스트 빌드 기준 캡처 여부는 후속 검토
- 개인정보처럼 보일 수 있는 실제 개인 정보는 사용하지 않기
- 샘플 프로필은 테스트용 데이터만 사용하기
- 상태바, 내비게이션바, 화면 잘림 여부 확인
- 글자 크기와 버튼이 캡처 이미지에서 읽히는지 확인

## Pending Items Before Actual Screenshot Production

아래 항목은 실제 확인 전까지 Pending으로 유지한다.

- 실제 스토어 스크린샷 이미지 제작: Pending
- 실제 기기 QA: Pending
- release build: Pending
- signing 설정: Pending
- AAB 생성: Pending
- Play Console 내부 테스트 업로드: Pending
- 실제 Google Play Console 입력: Pending
- 개인정보처리방침 URL 확정: Pending
- 문의처 확정: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- 실제 스토어 스크린샷 이미지 제작 없음
- 실제 Google Play Console 입력 없음
- 실제 기기 QA 없음
- release build 없음
- signing 설정 없음
- AAB 생성 없음
- Play Console 내부 테스트 업로드 없음
- production 계산 로직 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- localStorage key 변경 없음
- schemaVersion 변경 없음
- Android native code 변경 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- Gradle 설정 변경 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 로그인 추가 없음
- 서버 DB 추가 없음
- 외부 분석 SDK 추가 없음
- iOS 프로젝트 추가 없음

## Related Docs

- Google Play screenshot caption plan: docs/GOOGLE_PLAY_SCREENSHOT_CAPTION_PLAN.md
- Google Play screenshot readiness: docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md
- Google Play listing claim safety: docs/GOOGLE_PLAY_LISTING_CLAIM_SAFETY.md
- Google Play description draft: docs/GOOGLE_PLAY_DESCRIPTION_DRAFT.md
- Google Play app metadata checklist: docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md
- Release build signing checklist: docs/RELEASE_BUILD_SIGNING_CHECKLIST.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: release build signing checklist`
   - release build, signing 설정, AAB 생성 전 준비 항목 정리

2. `docs: privacy policy url publishing checklist`
   - 개인정보처리방침 초안을 실제 URL로 공개하기 전 준비 항목 정리

3. `docs: google play internal test checklist`
   - Play Console 내부 테스트 업로드 전 확인 항목 정리
