# Deploy Checklist

## 1. Git 상태

- [ ] 현재 브랜치가 `main`이 아닌지 확인
- [ ] 변경 파일 확인
- [ ] 불필요한 파일이 포함되지 않았는지 확인
- [ ] `.env`가 커밋되지 않았는지 확인
- [ ] 기능 파일 수정 범위가 요청과 일치하는지 확인

## 2. 로컬 테스트

- [ ] `npm install` 성공
- [ ] `npm run dev` 성공
- [ ] `npm run build` 성공
- [ ] 주요 화면 정상 표시
- [ ] 콘솔 에러 없음

## 3. 기능 테스트

- [ ] 신규 사용자 프로필 입력
- [ ] 시간 모름 체크 후 저장
- [ ] 음력 선택 후 윤달 선택
- [ ] 홈 화면 메뉴 클릭
- [ ] 오늘운세 상세 광고 unlock
- [ ] 2026운세 페이지 이동
- [ ] 마이 화면 프로필 정보 표시
- [ ] AI상담 화면 이동
- [ ] 궁합 입력 화면 이동

## 4. 화면 테스트

- [ ] PC 화면
- [ ] 모바일 화면
- [ ] 하단 네비게이션 깨짐 여부
- [ ] 카드/버튼 클릭 가능 여부
- [ ] 광고 모달 표시와 닫기
- [ ] 긴 텍스트가 카드 밖으로 넘치지 않는지 확인

## 5. Vercel 확인

- [ ] Environment Variables 설정
- [ ] Build command 확인: `npm run build`
- [ ] Output directory 확인: `dist`
- [ ] Framework Preset 확인: Vite
- [ ] Preview deployment 확인
- [ ] Production deployment 확인

## 6. API / DB 연동 테스트

- [ ] 현재 실제 API 연동 없음
- [ ] 현재 실제 DB 연동 없음
- [ ] 향후 연동 시 Vercel Environment Variables 누락 여부 확인
- [ ] 향후 연동 시 API route 또는 외부 API CORS 문제 확인

## 7. 배포 후 확인

- [ ] 운영 URL 접속
- [ ] 콘솔 에러 확인
- [ ] 주요 기능 재테스트
- [ ] 모바일 실기기 확인
- [ ] 문제 발생 시 이전 commit으로 롤백

## 롤백 방법

1. GitHub에서 최근 정상 commit을 확인합니다.
2. Vercel Dashboard에서 이전 정상 배포로 Promote/Rollback 가능한지 확인합니다.
3. 코드 롤백이 필요하면 별도 `fix/*` 브랜치에서 revert PR을 생성합니다.
4. 원인과 조치 내용을 `DEVELOPMENT_LOG.md`에 기록합니다.
