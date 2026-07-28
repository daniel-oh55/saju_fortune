# AI-assisted development workflow

이 문서는 하루풀이의 AI 개발 운영 방식을 사람 관점에서 설명합니다. 강제 규칙의 canonical source는 [AGENTS.md](../AGENTS.md)입니다.

## 기본 모델

```text
Owner
  ↓
ChatGPT: 제품 책임자·계획·최종 판단
  ↓
Codex 또는 Claude Code: primary implementer 한 명
  ↓
자동 테스트와 CI
  ↓
위험도에 따라 독립 검토
  ↓
Owner 승인 및 merge
```

## 권장 역할

- **ChatGPT**: 프로젝트 우선순위, 정책, acceptance criteria, PR 검토
- **Codex**: 명확한 일반 구현과 버그 수정의 기본 구현자
- **Claude Code**: 복잡한 다중 파일 작업, Android/AdMob 문제, 독립 리뷰
- **Claude**: 운세·UX 콘텐츠

이 배정은 절대적인 성능 서열이 아니라 현재 작업에 적용하는 기본 역할입니다. 한 PR에는 Codex 또는 Claude Code 중 한 명만 primary implementer로 지정합니다.

## handoff 간소화

완료 보고서 전체를 다른 채팅에 반복 복사하지 않습니다. ChatGPT 검토 요청에는 다음 정보면 충분합니다.

```text
저장소: daniel-oh55/saju_fortune
PR: #번호
요청: 구현 검토 / finding 재검토 / 병합 전 판정
```

ChatGPT는 가능한 경우 GitHub에서 PR, diff, comments, checks를 직접 읽습니다. 다음처럼 GitHub에 없는 정보는 사용자가 직접 제공할 수 있습니다.

- 로컬에서만 발생한 오류
- 실기기 화면과 동작
- ADB logcat
- AdMob/Play/Vercel Console의 비공개 상태
- GitHub에 올라가지 않은 파일과 환경정보

## 위험도별 흐름

- **LOW**: 구현자 1명, 관련 검사와 diff 검토. 독립 리뷰는 기본 생략.
- **MEDIUM**: 구현자 1명, 관련 테스트, 범위에 따라 독립 diff review 1회.
- **HIGH**: ChatGPT가 계획과 acceptance criteria를 정의하고, 구현자 1명과 다른 모델의 독립 검토를 거쳐 관련 CI·환경 검증 후 Owner가 승인.

세부 분류와 종료 조건은 [AGENTS.md](../AGENTS.md)를 따릅니다.

## 작업 선택 예시

- 문구 수정: Codex 또는 Claude Code 1명, 별도 리뷰 생략
- 일반 UI: Codex 구현, 필요한 경우 Claude Code diff review
- AdMob production 연결: ChatGPT 계획, Codex 구현, Claude Code 독립 검토
- 운세 문구 대량 작성: Claude 초안, ChatGPT 제품 검토, 구현자가 파일에 반영
- Android release: HIGH-risk 절차 적용

## 금지되는 운영 패턴

- 같은 브랜치에서 Codex와 Claude Code가 동시에 수정
- 구현자와 reviewer 역할을 같은 순간에 혼합
- 모든 작은 PR에 두 모델 검토 강제
- 일회성 상태마다 새 checker 생성
- P2/P3 문체 수정의 무한 반복
- 테스트 수 자체를 품질 목표로 삼기
- 전체 완료 보고서를 여러 채팅에 반복 복사

## reviewer 판정

reviewer는 다음 형식을 사용합니다.

- 판정: `APPROVE` 또는 `CHANGES REQUIRED`
- 심각도: P0/P1/P2/P3
- 각 finding: 파일, 근거, 영향, 최소 수정 방향
