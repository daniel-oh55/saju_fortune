# Advanced Saju Engine Release Scope

## Purpose

이 문서는 하루풀이의 현재 release scope와 향후 고급 사주 엔진 확장 범위를 구분하기 위한 문서이다.

이번 문서는 release scope 정의 문서이며, 실제 production 계산 로직 변경은 포함하지 않는다.

이번 PR에서는 고급 사주 엔진 기능을 production 결과에 연결하지 않는다.

## Current Release Scope

현재 release scope에 포함되는 것:

- 입력한 생년월일과 출생시간 기준 만세력 산출
- 현재 앱 기준 연주, 월주, 일주, 시주 산출
- 기존 겉오행 중심 오행 분석
- 오늘운세 기존 결과 생성 로직
- 2026운세 기존 결과 생성 로직
- 띠별운세 기존 결과 조합 로직
- 참고용 운세 콘텐츠
- localStorage 중심 사용자 입력 저장 구조
- 서버 DB 없음
- 로그인 없음
- 실제 광고 SDK 없음
- 실제 결제 SDK 없음
- 외부 분석 SDK 없음

## Not Included in Current Release Scope

현재 release scope에 포함하지 않는 것:

- 지장간 반영 production 오행 분석
- 십성 분석 production 연결
- 지장간 십성 산출
- 태양시 보정 적용
- 출생지 기반 경도 보정
- 대운 분석
- 세운 고도 분석
- 합신 분석
- 전문 사주가 수준의 정밀 분석 주장
- 외부 기준 검증을 끝낸 것처럼 보이는 주장
- 미래를 단정하는 예측
- 결과가 항상 맞는 것처럼 보이는 주장

## Advanced Engine Preparation Status

현재 준비된 항목:

- 지장간 데이터셋: Added
- 지장간 데이터셋 QA: Added
- 지장간 반영 오행 분석 설계: Added
- 지장간 반영 오행 분석 draft 함수: Added
- 지장간 반영 오행 분석 QA: Added
- 십성 매핑 데이터셋: Added
- 십성 매핑 QA: Added
- 십성 분석 설계: Added
- 십성 분석 draft 함수: Added
- 십성 분석 QA: Added
- 십성 설명 문구 가이드: Added
- 고급 사주 결과 구조 설계: Added

아직 Pending인 항목:

- 지장간 데이터 외부 기준 검증: Pending
- 십성 데이터 외부 기준 검증: Pending
- 지장간 반영 오행 분석 production 연결: Pending
- 십성 분석 production 연결: Pending
- 지장간 십성 산출: Pending
- 태양시 보정 적용 여부: 현재 release scope에서는 미적용
- 외부 만세력 기준 샘플 검증: Pending
- 실제 기기 QA: Pending
- Play Console 내부 테스트 업로드: Pending

## Product Claim Policy

현재 사용할 수 있는 표현:

- 현재 결과는 입력한 생년월일과 출생시간을 기준으로 참고용 운세를 제공합니다.
- 현재 사주 분석은 기본 오행 흐름을 중심으로 참고용 결과를 제공합니다.
- 지장간과 십성 분석은 향후 고급 분석 단계에서 검토 중입니다.
- 태양시 보정은 현재 release scope에서 적용하지 않습니다.
- 운세 결과는 참고용 콘텐츠이며 중요한 결정은 다양한 정보를 함께 확인해 주세요.

현재 피해야 하는 표현:

- 지장간과 십성까지 완벽히 반영한 정밀 사주 분석
- 태양시까지 정확히 보정한 사주풀이
- 출생지 경도까지 반영한 전문 분석
- 전문 사주가 수준의 사주풀이
- 대운, 세운, 합신까지 모두 반영
- 외부 만세력 기준 검증 완료
- 정확한 미래 예측
- 반드시 맞는 사주풀이

## Release Readiness Impact

현재 release scope 기준으로 출시 준비 시 확인할 항목:

- Google Play 앱 설명에서 고급 사주 분석 완료로 표현하지 않기
- 태양시 보정, 출생지 경도 보정, 대운, 세운, 합신 분석을 현재 제공 기능처럼 표현하지 않기
- 개인정보 처리방침 URL 확정 전까지 Pending 유지
- 문의처 확정 전까지 Pending 유지
- Google Play 데이터 보안 양식 입력 전까지 Pending 유지
- 실제 스토어 스크린샷 이미지 제작 전까지 Pending 유지
- 실제 기기 QA 완료 전까지 Pending 유지
- Play Console 내부 테스트 업로드 전까지 Pending 유지

## Future Expansion Candidates

향후 확장 후보:

- 지장간 데이터 외부 기준 검증 기록
- 십성 데이터 외부 기준 검증 기록
- 지장간/십성 production 연결 계획
- 지장간 십성 산출 설계
- 출생지 입력 UX 설계
- 태양시 보정 계산 정책 설계
- 대운, 세운 분석 범위 설계
- 고급 사주 결과 구조 production 연결 계획

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

- Advanced saju result structure: docs/ADVANCED_SAJU_RESULT_STRUCTURE.md
- Solar time correction policy: docs/SOLAR_TIME_CORRECTION_POLICY.md
- Hidden stems dataset: docs/HIDDEN_STEMS_DATASET.md
- Hidden stems element analysis QA: docs/HIDDEN_STEMS_ELEMENT_ANALYSIS_QA.md
- Ten gods mapping: docs/TEN_GODS_MAPPING.md
- Ten gods analysis QA: docs/TEN_GODS_ANALYSIS_QA.md
- Ten gods copy guidelines: docs/TEN_GODS_COPY_GUIDELINES.md
- Saju engine accuracy roadmap: docs/SAJU_ENGINE_ACCURACY_ROADMAP.md

## Suggested Follow-up PRs

1. `docs: record hidden stems external verification`
   - 지장간 데이터 외부 기준 대조 결과 기록

2. `docs: record ten gods external verification`
   - 십성 데이터 외부 기준 대조 결과 기록

3. `docs: advanced saju integration plan`
   - production 연결 전 결과 구조와 UI/문구 영향을 검토

4. `docs: google play listing claim safety`
   - Google Play 등록 문구에서 과장 표현을 피하기 위한 기준 정리
