# AGENTS.md

이 파일은 하루풀이 저장소의 AI 작업 규칙에 대한 canonical source입니다. 현재 task prompt가 더 구체적인 범위를 정하면 두 지침을 함께 따릅니다.

## 프로젝트 기본 정보

- 하루풀이는 React + Vite + Capacitor Android 기반의 운세·라이프스타일 앱입니다.
- 사용자 데이터는 현재 주로 `localStorage`에 저장합니다. 기존 key와 schema의 호환성을 임의로 깨지 않습니다.
- AdMob, UMP, Android release 관련 작업은 HIGH-risk 작업입니다.
- 실제 secret, production identifier, signing material은 Git에 커밋하지 않습니다.
- 기존 React 컴포넌트·유틸·데이터 파일 분리, 함수명, props, class를 가능한 한 유지하고 요청 범위만 최소 수정합니다.
- 운세 문구, AI 상담 문구, 광고 해금 문구는 `docs/BRAND_GUIDE.md`와 `docs/CONTENT_STYLE_GUIDE.md`를 먼저 확인합니다.
- 운세는 참고용·엔터테인먼트 콘텐츠로 표현하며 건강, 사고, 사망, 투자 손실, 이별, 해고 등 중대한 사건을 단정하지 않습니다.
- 사용자의 불안을 과도하게 자극하거나 공포심으로 결제를 유도하지 않습니다.
- 건강·법률·투자·심리 위기 등 전문 판단이 필요한 영역에서는 전문가 상담을 대체하지 않음을 밝힙니다.
- 부정적인 흐름도 예방, 점검, 휴식, 대화처럼 사용자가 선택할 수 있는 행동 중심으로 안내합니다.

## 역할

### Owner

- 제품과 운영의 최종 승인자입니다.
- 실제 Console 작업, 실기기 QA, production serving, Play 배포를 승인합니다.
- production 값과 signing material을 저장소 밖에서 관리합니다.

### ChatGPT

- 제품 우선순위와 PR 순서를 결정합니다.
- 위험도, 금지사항, acceptance criteria를 정의합니다.
- 정책·스토어·개인정보·배포 관련 판단을 담당합니다.
- 가능한 경우 GitHub PR과 diff를 직접 읽고 최종 검토합니다.
- 구현 브랜치를 직접 수정하는 기본 구현자 역할은 맡지 않습니다.

### Primary implementer

- 한 PR에는 Codex 또는 Claude Code 중 한 명만 primary implementer로 지정합니다.
- 같은 브랜치를 두 구현자가 동시에 수정하지 않습니다.
- 지정된 범위 안에서 구현, 테스트, commit, push, Draft PR 생성을 담당합니다.
- merge와 production 배포는 수행하지 않습니다.

### Independent reviewer

- primary implementer와 다른 모델을 지정합니다.
- 기본적으로 read-only를 유지하고 직접 수정하지 않습니다.
- P0/P1/P2/P3 finding과 `APPROVE` 또는 `CHANGES REQUIRED` 판정을 제공합니다.
- 사용자가 수정 작업을 별도로 승인한 경우에만 구현자로 전환합니다.

### Claude

- 운세 문구, UX copy, 설명문 같은 콘텐츠 작업에 활용합니다.
- 일반 코드 구현 루프에는 기본적으로 포함하지 않습니다.

## 위험도 분류

### LOW

예: 오탈자, 문서, 주석, 비동작 문구, 테스트 이름, 단순 스타일.

절차: 구현자 1명, 관련 검사, diff 검토. 별도 독립 AI 리뷰는 기본적으로 생략합니다.

### MEDIUM

예: 일반 UI, 국소적 상태 관리, 순수 계산 로직, API adapter, 제한된 리팩터링.

절차: 구현자 1명, 관련 테스트, 변경 범위에 따른 독립 diff review 1회, 필요한 수정 1회.

### HIGH

예:

- AdMob request/load/show
- UMP 및 개인정보 동의
- 개인정보처리방침과 Data Safety
- `localStorage` schema/key 변경
- Android native 설정
- signing/AAB
- GitHub Actions release workflow
- production identifier
- 배포·rollout·rollback
- 외부 API·DB·인증·결제

절차:

1. ChatGPT가 목표·위험·금지사항·acceptance criteria를 정의합니다.
2. primary implementer 1명이 작업합니다.
3. 다른 모델이 독립 검토합니다.
4. P0/P1 finding을 수정합니다.
5. 관련 CI를 통과시킵니다.
6. 필요한 실제 기기 또는 환경 smoke test를 수행합니다.
7. Owner가 최종 승인합니다.

## 작업 원칙

- `main`에 직접 push하지 않고 기능별 브랜치와 Draft PR을 사용합니다.
- 한 브랜치에는 한 명의 primary implementer만 둡니다.
- 범위 밖 문제를 발견해도 임의 수정하지 않고 remaining risk로 보고합니다.
- 기존 미추적 파일이나 사용자 파일을 삭제·이동·정리하지 않습니다.
- 실제 secret과 production identifier를 출력·문서화·커밋하지 않습니다.
- API Key, DB URL, Secret Key를 코드에 직접 쓰지 않습니다.
- 환경변수는 `.env` 또는 배포 환경에서 관리하고 `.env`를 커밋하지 않으며, `.env.example`에는 실제 값을 쓰지 않습니다.
- 명시적으로 요청받지 않은 Console·Vercel·AdMob·Play Console 작업을 하지 않습니다.
- deploy, rollout, merge, release를 자동 수행하지 않습니다.
- force-push, history rewrite, destructive reset을 하지 않습니다.
- 기존 테스트를 삭제·skip·약화하지 않고, 테스트 통과를 위해 production contract를 완화하지 않습니다.
- 문서가 실제 코드보다 강한 보장을 주장하지 않도록 관련 파일과 현재 상태를 확인합니다.
- 모바일 카드·버튼·하단 내비게이션은 가독성과 터치 편의성을 우선하며, 불필요한 라이브러리를 추가하지 않습니다.

## checker 생성 기준

새 checker는 다음 조건을 모두 충족할 때만 허용합니다.

1. 사람이 diff만 읽어서는 안정적으로 검증하기 어렵습니다.
2. 여러 후속 PR에서도 유지될 durable invariant입니다.
3. 실제 production 회귀나 보안·데이터 결함을 차단합니다.
4. 기존 테스트나 checker에 자연스럽게 추가할 수 없습니다.

다음 용도의 새 checker는 만들지 않습니다.

- 특정 PR의 완료 사실 또는 일회성 Console 작업 기록
- 특정 브랜치 이름 또는 정확한 변경 파일 개수
- 병합 후 의미가 사라지는 transition-only 상태
- ChatGPT 인수인계 문구 형식
- 문서의 사소한 표현을 영구 고정하기 위한 검사

## 검토 종료 조건

- 기본 독립 검토는 1회입니다.
- `CHANGES REQUIRED`이면 primary implementer가 수정합니다.
- P0/P1 또는 명확한 기능·보안 회귀가 남은 경우에만 재검토합니다.
- P2/P3가 문체·선호도·비동작 표현에 한정되면 별도 수정 PR을 만들지 않을 수 있습니다.
- 두 AI가 서로 무기한 수정·재검토하는 루프를 만들지 않습니다.

## 검증 강도

### docs-only

- 변경 파일 범위 확인
- `git diff --check`
- 문서 링크와 사실관계 확인
- 관련 canonical checker
- 필요한 경우 build

### 일반 source 변경

- 변경 영역의 targeted test
- build
- 관련 회귀 검사
- CI

### AdMob·Android·release 변경

- 관련 targeted checker와 테스트
- Android build 또는 전용 CI
- 필요한 실기기 QA
- production serving 전 Owner 승인

## 완료 보고 형식

일반 작업 보고서는 다음 항목으로 제한합니다.

- 판정
- Base / branch / HEAD
- 변경 파일과 목적
- 실행한 검사와 결과
- 기존 기능 파일 수정 여부와 범위 이탈 여부
- 남은 위험
- PR URL
- ChatGPT 검토 요청 요약문

다음 상황에서만 상세 보고서를 작성합니다.

- 테스트 실패 또는 환경 차이
- 범위 변경
- 보안·개인정보·데이터·배포 작업
- P0/P1 finding
- 실제 기기 또는 production 환경 검증
- 예상하지 못한 저장소 상태
