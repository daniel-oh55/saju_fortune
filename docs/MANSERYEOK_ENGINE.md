# MANSERYEOK_ENGINE

## 현재 엔진 버전

- `manseryeok_core_v0`
- 계산 adapter: `src/domain/saju/manseryeokEngine.js`
- 사용 라이브러리: `lunar-javascript`
- 시간 기준 정책은 `docs/MANSERYEOK_TIME_POLICY.md`를 따른다.

## 지원 범위

- 양력 입력을 기반으로 년주, 월주, 일주, 시주 계산
- 음력 입력을 기반으로 양력 변환 후 년주, 월주, 일주, 시주 계산
- 윤달 입력은 `lunar-javascript`가 지원하는 음력 윤달 범위에서만 처리
- 시간 미상은 내부 변환에 12:00을 사용하되, 결과에서는 시주를 `시주 미상`으로 처리
- 앱 내부 표기는 한글 천간/지지 중심으로 변환
- 시간대 metadata는 `Asia/Seoul` 기준으로 기록
- 현재 v0 엔진은 태양시 보정을 적용하지 않는다.

## 계산 항목

- 년주
- 월주
- 일주
- 시주
- 일간
- 천간/지지 겉오행 기준 오행 분포

## 아직 미지원

- 지장간
- 십성
- 신강신약
- 용신
- 대운
- 세운
- 월운 고도화
- 절기 경계 출생자에 대한 기준 검증 자동화
- 23시 이후 자시 기준 정책 확정
- 입춘/절기 경계 보정
- 태양시 보정

## 정확도 검증 필요 사항

- 절기 경계 출생자의 년주/월주 샘플 비교
- 23시 이후 자시 기준 적용 방식 검토
- 음력/윤달 변환 결과 외부 만세력 샘플 비교
- 여러 기준 만세력과 `lunar-javascript` 결과 차이 확인
- 한국 사용자 기준 시간대와 날짜 경계 정책 검토
- 입춘/절기 경계는 외부 기준값 검증 후 보정 예정
- 23시 이후 자시 기준은 아직 미정
- `solar_ipchun_boundary`는 엔진 보정 우선 검토 샘플

## fallback 정책

- 날짜, 시간, 음력/윤달 입력이 라이브러리에서 처리되지 않으면 앱이 깨지지 않도록 기존 mock 분석으로 fallback한다.
- fallback 시 `engineStatus`는 `mock_fallback_manseryeok_failed`로 기록한다.
- fallback 사유는 `fallbackReason`에 남긴다.
- 기존 localStorage key는 변경하지 않는다.
- fortune `schemaVersion`이 다르면 기존 key에 새 fortune을 덮어쓴다.

## 주의

- 이 엔진은 1단계 코어이며, 결과는 외부 만세력 기준 샘플 검증 전까지 `library_based_needs_reference_verification` 상태로 취급한다.
- 운세 문구는 참고용/엔터테인먼트 콘텐츠로 유지하고, 계산 결과를 단정적 예언처럼 표현하지 않는다.
