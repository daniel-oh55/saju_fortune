# Android Device QA and Internal Test Checklist

## Purpose

이 문서는 하루풀이 Android release AAB 생성 이후, Google Play 내부 테스트 업로드 전에 확인해야 할 실제 기기 QA 항목과 Play Console 내부 테스트 준비 항목을 정리한다.

이번 문서는 실제 Google Play Console 업로드, 실제 스토어 등록, 실제 개인정보처리방침 URL 확정, 실제 스토어 스크린샷 제작을 완료 처리하지 않는다.

## Current Status

- Release AAB workflow: User-confirmed success
- Release AAB artifact: User-confirmed (`harupuli-release-aab`)
- AAB file extracted from artifact: User-confirmed
- Google Play internal test upload: Not started
- Real-device QA: Pending
- Play Console app creation: Not started
- Privacy policy URL: Pending
- Data safety form: Pending
- 실제 스토어 스크린샷 이미지 제작: Pending

## AAB File Handling Notes

- `.aab` 파일은 Google Play Console 업로드용 파일이다.
- `.aab` 파일은 일반적인 Android 기기에 직접 설치하는 APK 파일이 아니다.
- artifact zip은 안전하게 보관한다.
- keystore 파일과 비밀번호는 repository, PR, issue, 문서에 기록하지 않는다.
- upload keystore와 비밀번호는 별도 안전한 위치에 백업한다.

## Real Device QA Checklist

### Installation / Launch

- [ ] Google Play 내부 테스트 또는 테스트용 APK를 통해 앱 설치 가능 여부
- [ ] 앱 최초 실행 가능 여부
- [ ] 스플래시/첫 화면 표시 여부
- [ ] 홈 화면 정상 표시 여부
- [ ] 앱 아이콘/앱 이름 표시 확인

### Navigation

- [ ] 홈 메뉴 이동 확인
- [ ] 오늘흐름 메뉴 이동 확인
- [ ] 2026운세 메뉴 이동 확인
- [ ] 띠별운세 메뉴 이동 확인
- [ ] 내정보 메뉴 이동 확인
- [ ] 하단 탭 전환 시 화면 깨짐 여부 확인

### Profile / LocalStorage

- [ ] 내정보 입력 가능 여부
- [ ] 이름/성별/생년월일/출생시간/양력·음력 선택 가능 여부
- [ ] 저장 후 앱 재실행 시 프로필 유지 여부
- [ ] localStorage 기반 데이터가 정상 유지되는지 확인

### Fortune Features

- [ ] 홈 오늘운세 카드 표시 확인
- [ ] 오늘흐름 결과 표시 확인
- [ ] 2026운세 결과 표시 확인
- [ ] 띠별운세 결과 표시 확인
- [ ] 저장/공유 버튼이 있는 경우 오류 없이 동작하는지 확인

### UI / Responsive

- [ ] 360px~430px 폭에서 화면 깨짐 여부
- [ ] 긴 문구 줄바꿈 자연스러운지 확인
- [ ] 상단 대표 이미지 표시 확인
- [ ] 버튼 색상/카드 간격/하단 탭 가독성 확인
- [ ] 다크모드 강제 적용 시 이상 표시 여부가 있으면 기록

### Android Back / Lifecycle

- [ ] Android 뒤로가기 버튼 동작 확인
- [ ] 앱 백그라운드 전환 후 복귀 확인
- [ ] 앱 종료 후 재실행 확인

### Reminder / Notification UI

- [ ] 알림 설정 UI 열림 여부
- [ ] 알림 on/off 설정 저장 여부
- [ ] 알림 시간 설정 저장 여부
- [ ] 실제 native notification은 구현/권한 상태에 따라 Pending으로 유지

### Error / Empty State

- [ ] 프로필 미입력 상태에서 안내 문구 표시 확인
- [ ] 잘못된 입력값에 대한 안내 확인
- [ ] 네트워크 없이 앱 주요 화면 접근 가능 여부 확인

## Internal Test Upload Preparation

- Google Play Console 앱 생성: Pending
- 앱 이름: 하루풀이
- 기본 언어: Korean 또는 실제 선택값 Pending
- 앱/게임 여부: App
- 무료/유료 여부: Pending
- 앱 카테고리: Pending
- 문의 이메일: Pending
- 개인정보처리방침 URL: Pending
- 데이터 보안 양식: Pending
- 광고 포함 여부: 실제 광고 SDK 없음 / Play Console 응답은 별도 확인 필요
- 인앱 상품 여부: 실제 결제 SDK 없음 / Play Console 응답은 별도 확인 필요
- 내부 테스트 테스터 이메일 목록: Pending
- release AAB 업로드: Pending

## Store Listing Preparation

- 앱 짧은 설명: Pending
- 앱 전체 설명: Pending
- 앱 아이콘: Pending 또는 existing asset 확인 필요
- feature graphic: Pending
- 실제 스토어 스크린샷 이미지 제작: Pending
- 개인정보처리방침 URL: Pending

## Known Not Implemented

- 서버 DB 없음
- 로그인 없음
- 실제 광고 SDK 없음
- 실제 결제 SDK 없음
- 외부 분석 SDK 없음
- iOS 프로젝트 없음

## QA Result Template

# Android Device QA Result

## Test Build

- Build source:
- Workflow run:
- Artifact:
- AAB/APK:
- Test date:
- Tester:
- Device:
- Android version:

## Result Summary

- Installation:
- Launch:
- Navigation:
- Profile save/load:
- Fortune features:
- Share/save:
- Reminder settings:
- UI/responsive:
- Back button/lifecycle:
- Overall status:

## Issues Found

| ID | Area | Description | Severity | Next action |
|---|---|---|---|---|

## Decision

- Internal test upload readiness:
- Notes:

