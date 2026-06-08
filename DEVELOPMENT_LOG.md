# DEVELOPMENT_LOG

## 현재 상태

- 배포 방식: GitHub 저장소와 Vercel 연동 구조 사용
- 주요 기능: 프로필 입력, 오늘운세, 띠별 운세, 2026운세, 광고 보상 시뮬레이션, AI 상담 화면, 궁합 입력, 더 깊은 풀이 기능 준비 중 화면, 마이 화면
- 현재 브랜치: `feature/manseryeok-core-engine`
- 최근 수정 내용: 만세력 기반 사주팔자 계산 엔진 v0 추가, 오행 분포 분석 연결, fortune schemaVersion 도입

## 현재 이슈

- [ ] 확인 필요: Vercel Production URL
- [ ] 확인 필요: Vercel Preview 배포 설정
- [ ] 확인 필요: 모바일 실기기 화면 테스트 결과
- [ ] 확인 필요: 2026운세 광고 해금 개수가 과하게 느껴지지 않는지
- [ ] 확인 필요: 홈 도넛 그래프와 2026 월별 물결 그래프의 모바일 가독성
- [ ] 확인 필요: 학업운 문구가 학생/성인 학습 모두에 자연스럽게 적용되는지
- [ ] 확인 필요: 기존 사용자의 당일 캐시에서 학업운 누락 시 새 운세가 정상 생성되는지
- [ ] 확인 필요: 외부 만세력 기준 샘플과 `lunar-javascript` 계산 결과 비교
- [ ] 확인 필요: 음력/윤달 입력 샘플 검증

## 다음 작업

- [ ] 우선순위 1: Vercel Preview에서 띠별 아코디언과 2026 광고 해금 흐름 확인
- [ ] 우선순위 2: 월별 상세 흐름 모바일 스크롤감 확인
- [ ] 우선순위 3: 띠별운세 연도별 문구 반복감 점검
- [ ] 우선순위 4: 광고 해금 포인트가 과하지 않은지 실사용 흐름 점검
- [ ] 우선순위 5: 월별 곡선 그래프 가로 스크롤 UX 확인
- [ ] 우선순위 6: 오늘운세 카테고리 추가 시 캐시 버전 관리 방식 검토
- [ ] 우선순위 7: 만세력 기준 샘플 검증표 작성

## ChatGPT 검토 요청 포인트

- 기존 기능 삭제 여부
- JS 오류 가능성
- 모바일 반응형 문제
- Vercel 배포 위험
- API / DB / 환경변수 문제
- 띠별 연도 아코디언 UX가 사용하기 쉬운지
- 2026운세 카테고리별/월별 광고 해금이 과하지 않은지
- 홈 도넛 그래프와 2026 월별 물결 그래프가 모바일에서 자연스럽게 읽히는지
- 학업운 카테고리 추가로 오늘운세 탭/홈 요약/광고 해금 흐름이 깨지지 않았는지
- study 없는 기존 오늘운세 캐시가 삭제 없이 재생성되는지
- 만세력 엔진 실패 시 mock fallback으로 앱이 깨지지 않는지
- schemaVersion 도입으로 기존 mock 캐시가 새 fortune으로 갱신되는지

## 작업 로그

### 2026-06-08

#### 작업 내용

- `lunar-javascript` 패키지 설치 및 실제 `Solar`, `Lunar`, `EightChar` API 확인
- 만세력 기반 년주, 월주, 일주, 시주 계산 adapter 추가
- 한자 천간/지지를 한글 천간/지지로 변환하는 사주 상수 추가
- 천간/지지 겉오행 기준 오행 분포 분석기 추가
- `createSajuAnalysis`가 만세력 계산 성공 시 실제 사주팔자/오행 분석 기반 결과를 반환하도록 연결
- 시간 미상 사용자는 내부 계산에 12:00을 사용하되 결과의 시주는 `시주 미상`으로 처리
- 음력/윤달 입력은 `lunar-javascript` 지원 범위에서 처리하고 실패 시 mock fallback 유지
- fortune `schemaVersion` 도입 및 App 캐시 유효성 검사에 schemaVersion 확인 추가
- localStorage key 구조 변경 없음
- 기존 캐시 데이터 일괄 삭제 없음
- 대운, 신강신약, 용신, 세운, 월운 고도화 구현 없음

#### 외부 라이브러리

- `lunar-javascript@1.7.7`
- 사용 이유: 양력/음력 변환과 EightChar 기반 사주팔자 계산을 직접 임의 구현하지 않기 위함
- 정확도 상태: 외부 만세력 기준 샘플 검증 필요

#### 수정 파일

- `src/domain/saju/sajuConstants.js`
- `src/domain/saju/manseryeokEngine.js`
- `src/domain/saju/elementAnalyzer.js`
- `src/domain/saju/createSajuAnalysis.js`
- `src/utils/fortuneEngine.js`
- `src/App.jsx`
- `docs/MANSERYEOK_ENGINE.md`
- `package.json`
- `package-lock.json`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- Vite chunk size 경고 발생: `lunar-javascript` 포함 후 JS chunk가 500kB를 초과함
- 양력 샘플에서 `engineStatus: manseryeok_core_v0` 확인
- `birthTimeUnknown=true` 샘플에서 시주가 `시주 미상`으로 처리되는지 확인
- 지원되지 않는 음력 윤달 샘플에서 mock fallback 확인
- 새 fortune에 `schemaVersion: 3` 포함 확인

#### 남은 이슈

- 외부 만세력 기준 샘플 비교 필요
- 절기 경계 출생자 검증 필요
- 23시 이후 자시 기준 정책 검토 필요
- 음력/윤달 입력 샘플 추가 검증 필요

### 2026-06-08

#### 작업 내용

- 오늘운세 캐시 유효성 검사에 필수 카테고리 목록 확인 추가
- `study` 카테고리가 없는 기존 당일 캐시는 유효하지 않은 것으로 판단해 `createTodayFortune`으로 새 운세 생성
- 새로 생성된 운세는 기존 `saveFortune` 흐름으로 덮어쓰기
- localStorage key 구조 변경 없음
- 기존 캐시 데이터 일괄 삭제 없음
- 광고 해금 저장 구조 변경 없음

#### 수정 파일

- `src/App.jsx`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 브라우저에서 study 없는 기존 캐시를 넣은 뒤 새 운세가 생성되는지 확인 필요
- 브라우저에서 study 포함 캐시가 같은 날짜/같은 프로필에서 재사용되는지 확인 필요

### 2026-06-08

#### 작업 내용

- 2026 월별운세흐름 그래프를 넓은 SVG와 cubic bezier 곡선형 path로 개선
- 모바일에서 월별 점수와 라벨이 겹치지 않도록 가로 스크롤 구조 적용
- 광고 mock 해금 시간을 개발/테스트용으로 2초로 단축
- 오늘운세 카테고리에 학업운 추가
- 학업운 상세풀이 템플릿에 공부, 시험 준비, 자격증, 업무 학습, 자료 이해, 메모/복습 조언 반영
- 학업운 문구 기준을 콘텐츠 스타일 가이드에 추가
- localStorage key 구조 변경 없음
- 실제 광고 SDK, AI API, DB, 결제 연동 없음

#### 수정 파일

- `src/components/MonthlyWaveChart.jsx`
- `src/components/RewardAdModal.jsx`
- `src/data/fortuneTemplates.js`
- `src/pages/HomePage.jsx`
- `src/styles.css`
- `docs/CONTENT_STYLE_GUIDE.md`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 브라우저에서 월별 곡선 그래프의 가로 스크롤 UX 확인 필요
- 브라우저에서 광고 mock 모달이 약 2초 후 완료되는지 확인 필요
- 브라우저에서 학업운 탭/요약/상세 광고 해금 흐름 확인 필요

### 2026-06-08

#### 작업 내용

- 홈 화면 오늘의 점수를 SVG 도넛 그래프로 시각화
- 띠별운세 연도별 아코디언에서 오늘의 조언을 광고 mock 모달 해금 후 표시하도록 변경
- 띠별운세의 키워드/색상/아이템 표시 제거
- 2026운세 재물운, 연애운, 직장운, 건강운 카테고리의 광고 박스 상시 노출을 제거하고 상세보기 클릭형 광고 UX로 변경
- 2026 월별 상세 흐름 해금 후 1월~12월 점수 물결 그래프 표시
- localStorage key 구조 변경 없음
- 실제 광고 SDK, AI API, DB, 결제 연동 없음

#### 수정 파일

- `src/components/ScoreDonut.jsx`
- `src/components/MonthlyWaveChart.jsx`
- `src/pages/HomePage.jsx`
- `src/pages/ZodiacFortunePage.jsx`
- `src/pages/YearFortunePage.jsx`
- `src/domain/fortune/zodiacFortuneEngine.js`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 브라우저에서 홈 도넛 그래프 중앙 점수와 `fortune.averageScore` 일치 여부 확인 필요
- 브라우저에서 띠별운세 오늘의 조언 광고 해금 흐름 확인 필요
- 브라우저에서 2026 상세보기 클릭형 광고 UX와 월별 물결 그래프 확인 필요

### 2026-06-08

#### 작업 내용

- 띠별 운세 화면을 연도 select 중심에서 12지 선택/연도별 아코디언 구조로 개선
- 선택한 띠에 해당하는 1948~2019년 사이 연도만 표시
- 여러 연도 아코디언을 동시에 열 수 있도록 구성
- 2026운세 재물운, 연애운, 직장운, 건강운에 광고 해금 상세 풀이 추가
- 2026 월별 상세 흐름을 광고 1회로 전체 해금하는 구조 추가
- localStorage key 구조 변경 없음
- 실제 광고 SDK, AI API, DB, 결제 연동 없음

#### 수정 파일

- `src/domain/fortune/zodiacFortuneEngine.js`
- `src/pages/ZodiacFortunePage.jsx`
- `src/data/yearFortuneTemplates.js`
- `src/domain/fortune/yearFortuneEngine.js`
- `src/pages/YearFortunePage.jsx`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공
- 1948년 쥐띠, 2019년 돼지띠 기준 확인
- 토끼띠 연도 목록이 1951, 1963, 1975, 1987, 1999, 2011년으로 표시되는지 데이터 확인
- 2026 카테고리별 detail과 월별 detail 생성 확인

#### 남은 이슈

- 브라우저에서 토끼띠 연도 목록과 여러 아코디언 동시 열림 확인 필요
- 2026 카테고리별/월별 광고 해금 UX 확인 필요

### 2026-06-08

#### 작업 내용

- 하단 네비게이션에 띠별 운세 탭 추가
- 띠별 운세 페이지 추가
- 1948~2019년생 띠별 운세 선택 기능 추가
- 홈 화면을 오늘운세 요약 중심으로 재구성
- 홈 화면에서 2026 추천 영역 제거
- 2026운세는 하단 탭에서 접근하도록 정리
- 기능 저장 구조/localStorage key 변경 없음

#### 수정 파일

- `src/App.jsx`
- `src/components/BottomNav.jsx`
- `src/domain/fortune/zodiacFortuneEngine.js`
- `src/pages/ZodiacFortunePage.jsx`
- `src/pages/HomePage.jsx`
- `src/styles.css`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 모바일에서 6개 하단 탭 간격 확인 필요

### 2026-06-01

#### 작업 내용

- 광고 해금 상세풀이 길이와 구조 개선
- 카테고리별 상세풀이 템플릿 확장
- `category.detail` 표시 방식을 문단 단위로 개선
- 기능 로직/저장 구조 변경 없음
- localStorage key 구조 변경 없음
- 광고 해금 흐름 변경 없음

#### 수정 파일

- `src/data/fortuneTemplates.js`
- `src/utils/fortuneEngine.js`
- `src/pages/FortuneDetailPage.jsx`
- `docs/CONTENT_STYLE_GUIDE.md`
- `DEVELOPMENT_LOG.md`
- `CHANGELOG.md`
- `TODO.md`

#### 테스트 결과

- `npm run build` 성공

#### 남은 이슈

- 브라우저에서 광고 해금 후 상세풀이 문단 표시 확인 필요
