# Google Play Screenshot Caption Plan

## Purpose

이 문서는 하루풀이의 Google Play 등록용 스크린샷을 실제 제작하기 전에, 사용할 화면 후보와 캡션 문구 기준을 정리한다.

이번 문서는 스크린샷 캡션 계획 문서이며, 실제 스토어 스크린샷 이미지 제작은 포함하지 않는다.

이번 PR에서는 실제 Google Play Console 입력을 수행하지 않는다.

## Screenshot Production Status

- Google Play 스크린샷 캡션 계획: Draft
- 실제 스토어 스크린샷 이미지 제작: Pending
- 실제 Google Play Console 입력: Pending
- 실제 기기 QA: Pending
- Play Console 내부 테스트 업로드: Pending
- release build: Pending
- signing 설정: Pending
- AAB 생성: Pending

## Candidate Screens

Google Play 스크린샷 후보 화면:

| Order | Screen | Purpose | Status |
|---|---|---|---|
| 1 | 홈 | 앱의 첫인상과 오늘운세 진입 흐름 소개 | Pending screenshot production |
| 2 | 오늘운세 | 오늘의 흐름을 참고용으로 확인하는 기능 소개 | Pending screenshot production |
| 3 | 2026운세 | 연간 흐름을 가볍게 살펴보는 기능 소개 | Pending screenshot production |
| 4 | 띠별운세 | 띠별운세를 참고용으로 확인하는 기능 소개 | Pending screenshot production |
| 5 | 내정보 | 생년월일/출생시간 입력 및 관리 흐름 소개 | Pending screenshot production |

## Caption Drafts

검토용 캡션 후보:

| Screen | Caption draft | Claim safety note |
|---|---|---|
| 홈 | 오늘의 운세를 차분히 살펴보세요 | 참고용 운세 표현 유지 |
| 오늘운세 | 하루의 흐름을 가볍게 확인해보세요 | 정확한 예측 표현 없음 |
| 2026운세 | 2026년의 큰 흐름을 미리 참고해보세요 | 단정적 예언 표현 없음 |
| 띠별운세 | 띠별운세를 간단하게 확인해보세요 | 참고용 콘텐츠 표현 유지 |
| 내정보 | 내 정보를 기준으로 운세 흐름을 준비해보세요 | 개인정보/저장 범위 과장 없음 |

## Allowed Caption Style

현재 사용할 수 있는 캡션 방향:

- 오늘의 운세를 차분히 살펴보세요
- 하루의 흐름을 가볍게 확인해보세요
- 2026년의 큰 흐름을 미리 참고해보세요
- 띠별운세를 간단하게 확인해보세요
- 내 정보를 기준으로 운세 흐름을 준비해보세요
- 참고용 운세 콘텐츠를 차분하게 확인해보세요

## Avoided Caption Style

현재 피해야 하는 캡션 방향:

- 정확히 맞는 오늘운세
- 미래를 예측하는 사주 앱
- 전문 사주가 수준의 정밀 분석
- 지장간과 십성까지 완벽히 반영한 사주풀이
- 태양시까지 정확히 보정한 결과
- 대운, 세운, 합신까지 모두 반영
- 연애운이 반드시 오르는 운세
- 직장운이 무조건 좋아지는 운세

## Visual Direction Notes

스크린샷 제작 전 참고할 시각 방향:

- 콘셉트: 고요한 밤의 운세 다이어리
- 따뜻한 아이보리 배경
- 밝은 베이지 카드
- 딥 네이비 포인트
- 은은한 금색 강조 포인트
- 달, 별, 점수 흐름 같은 절제된 상징
- 점집 광고보다 개인 맞춤 인사이트 앱에 가까운 인상
- 광고 영역은 주요 화면 이해를 방해하지 않도록 구성

## Pending Items for Store Readiness

아래 항목은 실제 값이나 작업이 확정되기 전까지 Pending으로 유지한다.

- 실제 스토어 스크린샷 이미지 제작: Pending
- 실제 Google Play Console 입력: Pending
- 개인정보 처리방침 URL: Pending
- 문의처: Pending
- Google Play 데이터 보안 양식: Pending
- 실제 기기 QA: Pending
- Play Console 내부 테스트 업로드: Pending
- release build: Pending
- signing 설정: Pending
- AAB 생성: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- 실제 스토어 스크린샷 이미지 제작 없음
- 실제 Google Play Console 입력 없음
- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 production 연결 없음
- 십성 분석 production 연결 없음
- 태양시 보정 적용 없음
- createSajuAnalysis 반환 구조 변경 없음
- production result shape 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- 오늘운세 계산 로직 변경 없음
- 2026운세 계산 로직 변경 없음
- 띠별운세 결과 조합 로직 변경 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
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

- Google Play app metadata checklist: docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md
- Google Play description draft: docs/GOOGLE_PLAY_DESCRIPTION_DRAFT.md
- Google Play listing claim safety: docs/GOOGLE_PLAY_LISTING_CLAIM_SAFETY.md
- Google Play screenshot readiness: docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md
- Advanced saju engine release scope: docs/ADVANCED_SAJU_ENGINE_RELEASE_SCOPE.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

Addressed planning PR:

- `docs: google play app metadata checklist`

1. `docs: google play screenshot production checklist`
   - 실제 스토어 스크린샷 이미지 제작 전 준비 항목 정리

2. `docs: google play data safety draft checklist`
   - localStorage 중심 저장 구조 기준 데이터 보안 양식 검토 항목 정리

3. `docs: privacy policy content draft`
   - 개인정보 처리방침 URL 확정 전 문서 초안 작성

4. `docs: record hidden stems external verification`
   - 지장간 데이터 외부 기준 대조 결과 기록

5. `docs: record ten gods external verification`
   - 십성 데이터 외부 기준 대조 결과 기록
