# Google Play Description Draft

## Purpose

이 문서는 하루풀이의 Google Play 등록 전 검토용 앱 설명 초안을 정리한다.

이번 문서는 설명 초안 문서이며, 실제 Google Play Console 입력은 포함하지 않는다.

이번 PR에서는 이 설명 초안을 실제 UI나 Google Play Console에 적용하지 않는다.

## Draft Status

- Google Play 설명 초안: Draft
- 실제 Google Play Console 입력: Pending
- 개인정보 처리방침 URL: Pending
- 문의처: Pending
- Google Play 데이터 보안 양식: Pending
- 실제 스토어 스크린샷 이미지 제작: Pending
- 실제 기기 QA: Pending
- Play Console 내부 테스트 업로드: Pending
- release build: Pending
- signing 설정: Pending
- AAB 생성: Pending

## App Name Draft

현재 앱 이름:

- 하루풀이

앱 이름 기준:

- 앱 이름에는 정확한 예측, 전문 사주, 완벽 분석처럼 현재 release scope를 넘는 표현을 붙이지 않는다.
- 현재 release scope를 넘는 기능을 제공하는 것처럼 보이는 표현을 붙이지 않는다.

## Short Description Drafts

검토용 짧은 설명 후보:

1. 오늘의 운세와 기본 사주 흐름을 참고용으로 살펴보는 운세 다이어리
2. 생년월일과 출생시간으로 하루의 흐름을 가볍게 확인하는 운세 앱
3. 오늘운세, 2026운세, 띠별운세를 참고용으로 확인해보세요

주의:

- 실제 Google Play Console 입력 전 글자 수와 정책 문구를 최종 화면에서 다시 확인한다.
- 이번 문서는 초안이며 실제 Console 입력이 아니다.

## Full Description Draft

하루풀이는 생년월일과 출생시간을 바탕으로 오늘의 운세와 기본 사주 흐름을 참고용으로 살펴볼 수 있는 운세 앱입니다.

차분한 운세 다이어리처럼 오늘의 흐름을 확인하고, 2026년의 큰 흐름과 띠별운세를 가볍게 살펴볼 수 있습니다.

주요 기능:

- 오늘운세 확인
- 기본 사주 흐름 확인
- 2026년 운세 확인
- 띠별운세 확인
- 입력한 정보의 localStorage 기반 저장

하루풀이는 현재 입력한 생년월일과 출생시간을 기준으로 참고용 운세 콘텐츠를 제공합니다.

현재 release scope:

- 현재 앱 기준 연주, 월주, 일주, 시주 산출
- 기존 겉오행 중심 오행 분석
- 오늘운세 기존 결과 생성
- 2026운세 기존 결과 생성
- 띠별운세 기존 결과 조합

현재 제공 기능으로 표현하지 않는 것:

- 태양시 보정
- 출생지 기반 경도 보정
- 지장간/십성 production 분석
- 대운, 세운, 합신 분석
- 외부 기준 검증을 끝낸 것처럼 보이는 주장
- 미래를 단정하는 예측

운세 결과는 참고용 콘텐츠이며 중요한 결정은 다양한 정보를 함께 확인해 주세요.

## Claim Safety Notes

현재 사용할 수 있는 표현:

- 참고용 운세 콘텐츠
- 오늘의 흐름을 가볍게 확인
- 기본 사주 흐름 살펴보기
- 입력한 생년월일과 출생시간 기준
- 앱 내부 기준에 따른 결과

현재 피해야 하는 표현:

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
- Google Play listing claim safety: docs/GOOGLE_PLAY_LISTING_CLAIM_SAFETY.md
- Advanced saju engine release scope: docs/ADVANCED_SAJU_ENGINE_RELEASE_SCOPE.md
- Advanced saju result structure: docs/ADVANCED_SAJU_RESULT_STRUCTURE.md
- Solar time correction policy: docs/SOLAR_TIME_CORRECTION_POLICY.md
- Google Play data safety input readiness: docs/GOOGLE_PLAY_DATA_SAFETY_INPUT_READINESS.md
- Google Play privacy URL input readiness: docs/GOOGLE_PLAY_PRIVACY_URL_INPUT_READINESS.md
- Google Play screenshot readiness: docs/GOOGLE_PLAY_SCREENSHOT_READINESS.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: google play app metadata checklist`
   - 앱 이름, 카테고리, 문의처, 개인정보 처리방침 URL, 데이터 보안 양식 입력값 체크리스트 정리

2. `docs: google play screenshot production checklist`
   - 실제 스토어 스크린샷 이미지 제작 전 준비 항목 정리

3. `docs: record hidden stems external verification`
   - 지장간 데이터 외부 기준 대조 결과 기록

4. `docs: record ten gods external verification`
   - 십성 데이터 외부 기준 대조 결과 기록
