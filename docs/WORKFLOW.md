# WORKFLOW

AI 작업 규칙의 canonical source는 [AGENTS.md](../AGENTS.md)입니다. 역할과 handoff의 사람용 상세 설명은 [AI_WORKFLOW.md](AI_WORKFLOW.md)를 참고합니다.

## 역할과 공통 원칙

- **Owner**: 요구사항과 최종 승인, 실기기·Console 상태 확인, merge·deploy 승인
- **ChatGPT**: 제품 우선순위, 위험도, 정책, acceptance criteria, PR 최종 검토
- **Codex 또는 Claude Code**: 한 명만 primary implementer로 지정하여 구현·검증·Draft PR 작성
- **Independent reviewer**: 위험도에 따라 구현자와 다른 모델이 read-only 검토
- **GitHub/CI**: 변경 이력과 자동 검증

ChatGPT가 프롬프트를 작성해 사용자가 전달하는 방식은 사용할 수 있지만 유일한 시작 방식은 아닙니다. 명확한 task와 범위가 있으면 지정된 구현자가 바로 진행할 수 있습니다. 같은 브랜치를 Codex와 Claude Code가 동시에 수정하지 않습니다.

## 위험도별 개발 흐름

### LOW

문서, 오탈자, 비동작 문구, 단순 스타일 등입니다.

1. 구현자 1명이 범위를 확인하고 작업합니다.
2. 관련 검사와 diff를 검토합니다.
3. 별도 독립 리뷰는 기본적으로 생략합니다.

### MEDIUM

일반 UI, 국소 상태 관리, 순수 계산, API adapter, 제한된 리팩터링 등입니다.

1. 구현자 1명이 관련 테스트와 함께 작업합니다.
2. 변경 범위에 따라 독립 diff review를 1회 진행합니다.
3. 필요한 수정 후 CI 결과를 확인합니다.

### HIGH

AdMob·UMP·개인정보·Android native·release·production identifier·외부 서비스·배포 관련 작업입니다.

1. ChatGPT가 목표, 금지사항, acceptance criteria를 정합니다.
2. primary implementer 한 명이 별도 브랜치에서 작업합니다.
3. 다른 모델이 독립 검토하고 P0/P1을 수정합니다.
4. 관련 CI와 필요한 실기기·환경 smoke test를 수행합니다.
5. Owner 승인 후에만 merge 또는 deploy합니다.

## handoff와 PR 검토

ChatGPT가 접근 가능한 경우 PR, diff, comments, checks를 GitHub에서 직접 읽습니다. 기본 handoff는 저장소, PR 번호, 검토 요청 종류로 제한합니다. 로컬 오류, 실기기 동작, ADB logcat, 비공개 Console 상태는 Owner가 제공합니다.

PR 작성 방법은 [PR_TEMPLATE.md](PR_TEMPLATE.md)를 참고하고 실제 자동 template은 [`.github/pull_request_template.md`](../.github/pull_request_template.md)를 사용합니다.

## 버그 수정

1. 재현 방법, 기대 동작, 실제 오류를 기록합니다.
2. 위험도를 분류하고 별도 `fix/*` 브랜치와 primary implementer를 지정합니다.
3. 원인 파일만 최소 범위로 수정하고 재발 방지 검사를 실행합니다.
4. 위험도에 맞는 독립 검토와 CI를 거칩니다.
5. PR에 검증 결과와 remaining risk를 기록합니다.

## 배포 전

1. `git status`와 diff로 범위 밖 파일, secret, 환경변수 포함 여부를 확인합니다.
2. 위험도에 맞는 targeted test, build, CI를 확인합니다.
3. HIGH-risk 변경은 필요한 실기기 QA와 Console 상태를 Owner가 확인합니다.
4. PR의 acceptance criteria와 rollback 기준을 확인합니다.
5. Owner 승인 후 merge·deploy를 진행합니다.

## 배포 후

1. 배포·runtime 로그와 주요 사용자 흐름을 확인합니다.
2. 환경변수, API, 정적 파일 경로, 최근 merge를 점검합니다.
3. 문제는 새 `fix/*` 브랜치에서 처리합니다.
4. 긴급 rollback은 사전 기준과 Owner 승인에 따라 수행합니다.
5. 원인과 조치는 `DEVELOPMENT_LOG.md` 또는 해당 PR에 기록합니다.
