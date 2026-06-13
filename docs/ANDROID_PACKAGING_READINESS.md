# ANDROID_PACKAGING_READINESS

## Android debug build 재시도 상태

- JDK/JAVA_HOME 환경 확인 후 Android debug build를 재시도했습니다.
- 자세한 결과는 `docs/ANDROID_BUILD_CHECK.md`를 참고합니다.
- 현재 환경에서는 `JAVA_HOME`, `java`, `javac`가 없어 debug APK가 생성되지 않았습니다.
- release build와 signing은 아직 진행하지 않았습니다.
- 실제 기기 QA와 Android 리소스 적용은 별도 PR에서 진행합니다.

## Android debug build 확인 상태

- Android debug build 확인 결과는 `docs/ANDROID_BUILD_CHECK.md`를 참고합니다.
- 이번 단계에서는 release build와 signing은 진행하지 않았습니다.
- Android 리소스 적용과 실제 기기 QA는 별도 PR에서 진행합니다.

## Android 플랫폼 scaffold 생성 상태

- `@capacitor/android`가 추가되었습니다.
- Android 프로젝트 폴더가 생성되었습니다.
- `npx cap sync android` 기준으로 웹 리소스가 Android 프로젝트에 반영되었습니다.
- 아직 Android native build는 실행하지 않았습니다.
- 아직 Android 리소스 수동 적용은 하지 않았습니다.
- 실제 Android 빌드 확인은 별도 PR에서 진행합니다.

## Capacitor base config 상태

- Capacitor core/cli와 기본 config가 추가되었습니다.
- Android 플랫폼 패키지와 Android 프로젝트는 아직 추가하지 않았습니다.
- Android 프로젝트 생성 전 `npm run build`와 `npm run check:capacitor-base-config`를 확인합니다.

## Android adaptive icon PNG 생성 상태

- Android adaptive icon foreground/background 후보 PNG가 생성되었습니다.
- 생성된 파일은 `public/generated-icons/android-adaptive` 아래에 있습니다.
- Android 프로젝트 생성 후 실제 `mipmap-anydpi-v26` XML과 리소스 적용 단계에서 사용할 수 있습니다.
- XML 적용은 별도 PR에서 진행합니다.

## Android adaptive icon 준비 연계

- Android adaptive icon foreground/background 준비 기준은 `docs/ANDROID_ADAPTIVE_ICON_READINESS.md`를 참고합니다.
- 이번 단계에서는 adaptive icon PNG를 생성하지 않습니다.
- Android 프로젝트 생성 후 실제 adaptive icon XML과 mipmap 리소스 적용은 별도 PR에서 진행합니다.

## Android splash PNG 생성 상태

- Android 후보 splash PNG가 `public/generated-splash/android` 아래에 생성되었습니다.
- Android 12 splash icon 후보도 함께 생성되었습니다.
- Android 프로젝트 생성 후 실제 splash 적용 단계에서 이 파일들을 기준으로 사용할 수 있습니다.

## Android 앱 아이콘 PNG 생성 상태

- Android 후보 앱 아이콘 PNG가 `public/generated-icons/android` 아래에 생성되었습니다.
- Android 프로젝트 생성 후 실제 mipmap/adaptive icon 적용 단계에서 이 파일들을 기준으로 사용할 수 있습니다.
- Android adaptive icon foreground/background는 별도 PR에서 검토합니다.

## Android splash PNG 준비 연계

- Android 패키징 전 splash PNG 세트와 Android 12 splash icon 후보가 필요합니다.
- splash PNG 출력 기준은 `docs/SPLASH_PNG_EXPORT_READINESS.md`를 참고합니다.
- 이번 단계에서는 PNG를 생성하지 않고 출력 규격만 확정합니다.

## Android 앱 아이콘 PNG 준비 연계

- Android 패키징 전 앱 아이콘 PNG 세트가 필요합니다.
- PNG 출력 기준은 `docs/APP_ICON_PNG_EXPORT_READINESS.md`를 참고합니다.
- 이번 단계에서는 PNG를 생성하지 않고 출력 규격만 확정합니다.

이 문서는 하루풀이 웹앱을 Android 앱으로 우선 패키징하기 전 준비 기준을 정리한 문서입니다.
이번 PR은 Android 패키징 준비 문서와 검증 스크립트 추가가 목적이며, Capacitor 설치, android 프로젝트 생성, 네이티브 앱 빌드는 아직 진행하지 않습니다.

## 1. 목적

- Android 우선 패키징을 시작하기 전 필요한 준비 사항을 정리합니다.
- Capacitor 도입 전 Android 빌드 환경, 앱 리소스, localStorage, 개인정보, 광고 SDK, 스토어 등록 기준을 확인합니다.
- 기존 React/Vite 웹앱 기능을 유지하면서 Android 앱 전환 리스크를 줄입니다.

## 2. 현재 준비 상태

- React/Vite 웹앱
- Vercel 배포
- PWA manifest 준비 완료
- 앱 아이콘 master SVG 준비 완료
- splash master SVG 준비 완료
- 모바일 UX 1차 보정 완료
- ConsentBanner / ConsentSettingsPanel 준비
- 개인정보 안내 페이지 준비
- rewarded ad mock provider 준비
- rewarded ad SDK adapter scaffold 준비
- ads consent gate 준비
- placement readiness 준비
- Capacitor readiness 문서 준비
- Capacitor 미설치
- android 프로젝트 미생성

## 3. Android 패키징 전 개발 환경 체크리스트

- [ ] Android Studio 설치
- [ ] JDK 설치 및 버전 확인
- [ ] Gradle 빌드 가능 여부 확인
- [ ] Android SDK 설치
- [ ] Android Emulator 또는 실제 Android 기기 준비
- [ ] USB debugging 설정
- [ ] Node/Vite build 성공 확인
- [ ] GitHub/Vercel 배포 상태 확인

## 4. Android 앱 식별 정보 후보

- package name 후보: `com.harupuli.app`
- app name 후보: `하루풀이`
- 실제 배포 전 최종 확정 필요

주의:

- 이번 PR에서는 package name을 코드에 적용하지 않습니다.
- package name은 첫 배포 이후 변경이 어렵기 때문에 Android 프로젝트 생성 전에 신중하게 결정합니다.

## 5. Android 리소스 준비 항목

필요 항목:

- 앱 아이콘 PNG 세트
- adaptive icon foreground/background 후보
- splash PNG 세트
- Android mipmap 리소스
- Android 12 splash screen 대응 리소스
- 앱 스크린샷

현재 상태:

- SVG master 리소스만 준비되어 있습니다.
- PNG 세트 생성은 별도 PR에서 진행합니다.

## 6. WebView/localStorage QA 항목

현재 localStorage 기반 저장 항목:

- 프로필
- 오늘운세/사주 캐시
- 광고 해금 상태
- 저장한 풀이
- 방문 streak
- consent preferences

Android WebView에서 확인할 항목:

- 앱 재시작 후 localStorage 유지 여부
- 앱 강제 종료 후 localStorage 유지 여부
- 앱 업데이트 후 localStorage 유지 여부
- 앱 삭제/재설치 시 데이터 삭제 여부
- 개인정보 안내 페이지에 기기 단위 저장 원칙 반영 여부

## 7. Android UX QA 항목

- [ ] 하단 네비게이션 safe-area 확인
- [ ] Android 뒤로가기 버튼 동작
- [ ] 온보딩 중 뒤로가기 동작
- [ ] 홈 화면 카드 스크롤
- [ ] 오늘운세 상세 화면 스크롤
- [ ] 사주 흐름 페이지 스크롤
- [ ] 동의 배너와 하단 네비게이션 겹침 여부
- [ ] 데이터 사용 설정 패널 스크롤
- [ ] 광고 보상 모달 스크롤
- [ ] 저장한 풀이 화면 버튼 터치 영역
- [ ] 개인정보 안내 페이지 긴 문구 줄바꿈
- [ ] 만세력 debug 페이지 접근 여부

## 8. 광고 SDK 관련 Android 준비

- 현재 실제 광고 SDK는 없습니다.
- mock provider 기본값은 유지합니다.
- SDK adapter scaffold만 존재합니다.
- ads consent gate를 유지합니다.
- provider placement ID는 환경변수 또는 네이티브 설정으로 관리해야 합니다.
- Android 광고 SDK 도입 전 provider 정책을 확인해야 합니다.
- 생년월일, 출생시간, 성별, 사주 원본 정보를 광고 provider에 직접 전달하지 않는 원칙을 유지합니다.

## 9. 개인정보/스토어 제출 준비

필요 항목:

- 개인정보 처리방침 URL
- 앱 내 개인정보 안내 페이지
- 광고 포함 여부 명시
- 데이터 수집/저장 항목 정리
- localStorage 기기 단위 저장 안내
- 앱 삭제 시 데이터 삭제 가능성 안내
- 문의 이메일 또는 지원 채널
- 콘텐츠 등급 검토
- 운세/사주 서비스의 참고용 안내 문구

## 10. Android 우선 패키징 예상 PR 순서

1. 앱 아이콘 PNG 세트 생성
2. splash PNG 세트 생성
3. Capacitor 설치 및 config 추가
4. Android 프로젝트 생성
5. Android build 실행
6. Android WebView localStorage QA
7. Android back button QA
8. Android 앱 리소스 적용
9. Android 스토어 등록 정보 초안
10. 실제 광고 SDK provider 선택 검토

## 11. 이번 PR 제외 범위

- Capacitor 설치
- android 프로젝트 생성
- iOS 프로젝트 생성
- 네이티브 빌드
- 스토어 등록
- 실제 광고 SDK 연동
- PNG 리소스 생성
- production 코드 변경
