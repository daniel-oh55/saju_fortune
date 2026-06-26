# Google Play Listing Claim Safety

## Purpose

이 문서는 하루풀이의 Google Play 등록 문구에서 현재 release scope를 벗어나는 과장 표현을 피하기 위한 내부 기준을 정리한다.

이번 문서는 등록 문구 안전성 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 실제 Google Play Console 입력을 수행하지 않는다.

## Current App Capability

현재 앱에서 제공하는 범위:

- 입력한 생년월일과 출생시간 기준 만세력 산출
- 현재 앱 기준 연주, 월주, 일주, 시주 산출
- 기존 겉오행 중심 오행 분석
- 오늘운세 기존 결과 생성
- 2026운세 기존 결과 생성
- 띠별운세 기존 결과 조합
- 참고용 운세 콘텐츠
- localStorage 중심 사용자 입력 저장 구조

현재 앱에 없는 것:

- 서버 DB 없음
- 로그인 없음
- 실제 광고 SDK 없음
- 실제 결제 SDK 없음
- 외부 분석 SDK 없음
- 지장간/십성 production 분석 연결 없음
- 태양시 보정 적용 없음
- 출생지 기반 경도 보정 없음
- 대운, 세운, 합신 분석 없음

## Allowed Listing Claims

현재 사용할 수 있는 Google Play 등록 문구 예시:

- 하루풀이는 생년월일과 출생시간을 바탕으로 오늘의 운세와 기본 사주 흐름을 참고용으로 살펴볼 수 있는 운세 앱입니다.
- 오늘의 흐름, 2026년 운세, 띠별운세를 가볍게 확인할 수 있습니다.
- 현재 결과는 입력한 정보와 앱 내부 기준에 따라 제공하는 참고용 콘텐츠입니다.
- 운세 결과는 중요한 결정을 대체하지 않으며, 다양한 정보를 함께 참고해 주세요.
- 지장간과 십성 분석은 향후 고급 분석 단계에서 검토 중입니다.
- 태양시 보정은 현재 release scope에서 적용하지 않습니다.

## Avoided Listing Claims

현재 피해야 하는 Google Play 등록 문구:

- 정확한 미래를 예측하는 사주 앱
- 반드시 맞는 오늘운세
- 전문 사주가 수준의 정밀 사주풀이
- 지장간과 십성까지 완벽히 반영한 정밀 사주 분석
- 태양시까지 정확히 보정한 사주풀이
- 출생지 경도까지 반영한 전문 분석
- 대운, 세운, 합신까지 모두 반영
- 외부 만세력 기준 검증 완료
- 연애운이 반드시 오른다
- 직장운이 무조건 좋아진다
- 직장운을 정확히 예언한다

## Store Listing Field Guidance

Google Play 등록 필드별 내부 기준:

### App name

현재 기준:

- 앱 이름: 하루풀이
- 앱 이름에는 정확한 예측, 전문 사주, 완벽 분석처럼 현재 release scope를 넘는 표현을 붙이지 않는다.

### Short description

현재 사용할 수 있는 방향:

- 오늘의 운세와 기본 사주 흐름을 참고용으로 확인하는 앱
- 하루의 흐름을 가볍게 살펴보는 운세 다이어리

현재 피해야 하는 방향:

- 정확한 미래 예측
- 전문 사주가 수준의 정밀 분석
- 반드시 맞는 운세

### Full description

현재 사용할 수 있는 방향:

- 오늘운세, 2026년 운세, 띠별운세, 기본 사주 흐름을 참고용으로 제공한다고 설명한다.
- 태양시 보정, 지장간/십성 production 연결, 대운, 세운, 합신 분석은 현재 제공 기능처럼 적지 않는다.
- 운세 결과는 참고용 콘텐츠라고 명시한다.

### Screenshot captions

현재 사용할 수 있는 방향:

- 오늘의 흐름을 차분히 살펴보세요.
- 내 사주 흐름을 참고용으로 확인해보세요.
- 2026년의 큰 흐름을 가볍게 준비해보세요.

현재 피해야 하는 방향:

- 정확히 맞는 사주풀이
- 전문 사주가 수준의 정밀 분석
- 태양시까지 보정한 결과

## Pending Items for Store Readiness

아래 항목은 실제 값이나 작업이 확정되기 전까지 Pending으로 유지한다.

- 개인정보 처리방침 URL: Pending
- 문의처: Pending
- Google Play 데이터 보안 양식: Pending
- 실제 스토어 스크린샷 이미지 제작: Pending
- 실제 기기 QA: Pending
- Play Console 내부 테스트 업로드: Pending
- release build: Pending
- signing 설정: Pending
- AAB 생성: Pending
- 실제 Google Play Console 입력: Pending

## Non-Goals for This PR

이번 PR에서 하지 않는 것:

- production 계산 로직 변경 없음
- 만세력 계산 로직 변경 없음
- 기존 겉오행 분석 로직 변경 없음
- 지장간 반영 오행 분석 production 연결 없음
- 십성 분석 production 연결 없음
- 지장간 십성 산출 없음
- 태양시 보정 적용 없음
- 출생지 기반 경도 보정 없음
- 대운 분석 추가 없음
- 세운 고도 분석 추가 없음
- 합신 분석 추가 없음
- createSajuAnalysis 반환 구조 변경 없음
- production result shape 변경 없음
- 사주/운세 결과 생성 로직 변경 없음
- 오늘운세 계산 로직 변경 없음
- 2026운세 계산 로직 변경 없음
- 띠별운세 결과 조합 로직 변경 없음
- 십성 설명 문구 UI 적용 없음
- 실제 Google Play Console 입력 없음
- 실제 스토어 스크린샷 이미지 제작 없음
- UI/디자인 변경 없음
- routing 변경 없음
- schemaVersion 변경 없음
- 기존 localStorage key 변경 없음
- localStorage key 추가 없음
- 서버 DB 추가 없음
- 로그인 추가 없음
- 실제 광고 SDK 추가 없음
- 실제 결제 SDK 추가 없음
- 외부 분석 SDK 추가 없음
- Android native code 변경 없음
- AndroidManifest.xml 변경 없음
- Android resource 파일 변경 없음
- Gradle 설정 변경 없음
- keystore 파일 추가 없음
- signing password 기록 없음
- iOS 프로젝트 추가 없음

## Related Docs

- Google Play app metadata checklist: docs/GOOGLE_PLAY_APP_METADATA_CHECKLIST.md
- Google Play screenshot caption plan: docs/GOOGLE_PLAY_SCREENSHOT_CAPTION_PLAN.md
- Google Play description draft: docs/GOOGLE_PLAY_DESCRIPTION_DRAFT.md
- Advanced saju engine release scope: docs/ADVANCED_SAJU_ENGINE_RELEASE_SCOPE.md
- Advanced saju result structure: docs/ADVANCED_SAJU_RESULT_STRUCTURE.md
- Ten gods copy guidelines: docs/TEN_GODS_COPY_GUIDELINES.md
- Solar time correction policy: docs/SOLAR_TIME_CORRECTION_POLICY.md
- Google Play data safety input readiness: docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md
- Google Play privacy URL input readiness: docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md
- Google Play screenshot readiness: docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

Addressed planning PR:

- `docs: google play screenshot caption plan`

## Suggested Follow-up PRs

1. `docs: google play app metadata checklist`
   - 앱 이름, 카테고리, 문의처, 개인정보 처리방침 URL, 데이터 보안 양식 입력값 체크리스트 정리

2. `docs: google play screenshot production checklist`
   - 실제 스토어 스크린샷 이미지 제작 전 준비 항목 정리

3. `docs: record hidden stems external verification`
   - 지장간 데이터 외부 기준 대조 결과 기록

4. `docs: record ten gods external verification`
   - 십성 데이터 외부 기준 대조 결과 기록
