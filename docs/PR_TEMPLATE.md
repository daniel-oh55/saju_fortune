# PR 작성 가이드

GitHub에서 자동 표시되는 실제 template은 [`.github/pull_request_template.md`](../.github/pull_request_template.md)입니다. 이 문서는 각 항목을 일관되게 작성하기 위한 가이드입니다.

## Goal

이 PR이 해결하는 문제와 완료 후 기대 상태를 짧게 씁니다.

## Risk level

`LOW`, `MEDIUM`, `HIGH` 중 하나를 선택하고 이유를 적습니다. 분류 기준은 [AGENTS.md](../AGENTS.md)를 따릅니다.

## Scope

변경한 내용과 명시적으로 제외한 내용을 함께 적습니다. 관련 있어 보이더라도 이번 PR에서 다루지 않은 항목은 `Out of scope`에 남깁니다.

## Acceptance criteria

구현 방법이 아니라 결과로 확인할 수 있는 완료 조건을 체크리스트로 작성합니다.

## Validation

실행한 명령과 결과를 표에 기록합니다. 테스트 개수 자체보다 어떤 위험과 회귀를 검증했는지를 설명합니다. 실패·미실행 항목은 이유와 영향을 남깁니다.

docs-only PR은 변경 범위, 문서 링크, `git diff --check`, 관련 checker를 우선 확인합니다. source나 Android를 바꾸지 않았다면 Android build, Vercel Preview, 실기기 QA를 무조건 요구하지 않습니다.

## Operator actions

Console 입력, 실기기 확인, 환경변수 설정처럼 자동화할 수 없는 작업이 있는지 표시합니다. 없다면 `None`을 선택합니다.

## Remaining risks

이번 범위에서 검증하지 못한 사항, 후속 PR, Owner 확인이 필요한 항목을 적습니다. 범위 밖 문제를 함께 수정하지 않습니다.

## Review request

검토가 필요한 영역만 선택합니다. LOW-risk 변경에 모든 review 종류를 요구하지 않고, HIGH-risk 변경은 구현자와 다른 independent reviewer를 지정합니다.

## ChatGPT handoff

ChatGPT가 GitHub PR을 직접 읽을 수 있는 경우 다음 정보만 전달합니다.

```text
저장소: daniel-oh55/saju_fortune
PR: #번호
요청: 병합 전 검토
```
