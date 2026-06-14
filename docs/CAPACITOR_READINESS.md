# CAPACITOR_READINESS

## Google Play 등록 정보 연결

- Google Play Store 등록 정보 초안 문서: `docs/GOOGLE_PLAY_STORE_LISTING_DRAFT.md`
- Capacitor Android 앱 제출 전 앱 소개 문구, 참고용 고지, 개인정보/localStorage 고지, 광고 포함 여부 초안을 확인합니다.
- 실제 Google Play 제출에는 Android QA 완료, release build/signing, AAB 생성, 개인정보 처리방침 URL, Data safety 작성이 필요합니다.
- 이번 단계에서는 iOS 프로젝트 생성, release/signing, 실제 광고 SDK 연동을 진행하지 않았습니다.

## Android QA 상태 요약

- Capacitor Android 실제 QA 상태를 `docs/ANDROID_QA_STATUS_SUMMARY.md`에서 관리합니다.
- 실제 기기 또는 에뮬레이터 준비 후 icon/splash, localStorage, back button QA를 재시도합니다.
- production 코드 변경은 없습니다.

## 2026-06-15 Android back button QA 결과 연결

- Android back button 실제 QA 결과 문서는 `docs/ANDROID_BACK_BUTTON_QA_RESULT.md`입니다.
- 현재 결과는 adb/device 미준비로 Blocked입니다.
- 이번 단계에서는 `@capacitor/app`을 추가하지 않고 backButton listener도 구현하지 않습니다.
- 실제 QA 결과에서 필요성이 확인되면 별도 PR에서 Capacitor back button handling을 검토합니다.

## Android QA 환경 준비

- Capacitor Android 앱을 실제 기기 또는 에뮬레이터에서 확인하기 위한 QA 환경 준비 문서를 추가했습니다.
- adb, emulator, APK 설치, logcat 확인 절차를 문서화했습니다.
- production 코드 변경은 없습니다.

## Android icon/splash QA 결과 연결

- Capacitor Android 앱의 icon/splash 표시 QA 결과를 별도 문서로 기록합니다.
- 결과 문서는 `docs/ANDROID_ICON_SPLASH_QA_RESULT.md`입니다.
- production 코드 변경은 없습니다.

## 2026-06-14 Android icon/splash 표시 QA 준비

- Capacitor Android 앱의 icon/splash 표시 QA 기준을 추가했습니다.
- 실제 기기 또는 에뮬레이터에서 표시 상태를 확인해야 합니다.
- production 코드 변경은 없습니다.

## 2026-06-14 Android resource build verification

- Capacitor Android 프로젝트에서 icon/splash/adaptive icon 적용 후 debug build가 성공했습니다.
- 실제 표시 확인은 Android device/emulator QA에서 진행합니다.
- iOS는 아직 보류 상태입니다.

## 2026-06-14 Android 리소스 적용 상태

- Capacitor Android 프로젝트에 하루풀이 앱 아이콘, 라운드 아이콘, adaptive icon, splash 후보 PNG를 적용했습니다.
- `public/generated-*` 원본 PNG는 유지하고, Android `res` 경로에 복사본을 배치했습니다.
- Android 아이콘 참조는 기존 `@mipmap/ic_launcher`, `@mipmap/ic_launcher_round` 구조를 유지합니다.
- Android splash 후보 리소스는 추가했지만, Android 12 이상 splash 실제 표시 여부는 후속 device QA가 필요합니다.
- iOS 프로젝트와 iOS 리소스는 이번 작업 범위에 포함하지 않았습니다.
- production React/Vite 코드, localStorage key, schemaVersion, rewarded ad 구조는 변경하지 않았습니다.

## Android back button QA 준비

- Capacitor Android WebView에서 시스템 뒤로가기 버튼 동작을 확인하기 위한 QA 기준을 추가했습니다.
- 실제 QA 결과에 따라 `@capacitor/app` 기반 backButton listener 도입 여부를 검토합니다.
- 이번 PR에서는 production 코드와 Capacitor plugin 추가는 하지 않습니다.

## Android device QA runbook 연계

- Capacitor Android 앱을 실제 기기 또는 에뮬레이터에서 확인하기 위한 runbook을 추가했습니다.
- adb 연결, APK 설치, 앱 실행, logcat 확인 절차를 문서화했습니다.
- production localStorage key는 변경하지 않습니다.

## Android WebView localStorage QA 결과 연계

- Capacitor Android WebView에서 localStorage 유지 여부를 확인하는 결과 문서를 추가했습니다.
- 결과 문서는 `docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA_RESULT.md`입니다.
- 문제가 확인되면 별도 수정 PR에서 다룹니다.

## Android WebView localStorage QA 연계

- Capacitor Android WebView에서 localStorage 데이터가 유지되는지 확인할 QA 기준을 추가했습니다.
- QA 기준은 `docs/ANDROID_WEBVIEW_LOCALSTORAGE_QA.md`를 참고합니다.
- production localStorage key는 변경하지 않습니다.

## Android debug build workflow 보완

- Capacitor Android debug build CI에서 Gradle wrapper 실행 권한과 Java 환경을 확인하도록 workflow를 보완했습니다.
- CI build 결과는 GitHub Actions에서 확인합니다.
- release build, signing, 실제 기기 QA는 아직 진행하지 않았습니다.

## Android debug build CI 연결

- Capacitor Android scaffold 이후 GitHub Actions에서 Android debug APK를 빌드하는 workflow를 추가했습니다.
- CI는 Node 빌드 후 `npx cap sync android`를 실행하고, JDK 21 환경에서 `./gradlew assembleDebug`를 수행합니다.
- upload artifact 경로는 `android/app/build/outputs/apk/debug/app-debug.apk`입니다.
- production 앱 코드, localStorage key, schemaVersion, rewarded ad 구조는 변경하지 않습니다.
- release build, signing, iOS 프로젝트 생성은 아직 진행하지 않습니다.

## Android debug build 재시도 결과

- Java/JDK 환경 확인 후 Android debug build를 재시도했습니다.
- 결과는 `docs/ANDROID_BUILD_CHECK.md`에 기록합니다.
- 현재 환경에서는 JDK/JAVA_HOME 미설정으로 debug build가 완료되지 않았습니다.
- release build, signing, 실제 기기 QA는 아직 진행하지 않았습니다.

## Android debug build 확인 단계

- Android 프로젝트 scaffold 이후 debug build 확인 단계가 진행되었습니다.
- 자세한 결과는 `docs/ANDROID_BUILD_CHECK.md`를 참고합니다.
- release build, signing, 실제 기기 QA는 아직 진행하지 않았습니다.

## Android 플랫폼 추가 상태

- `@capacitor/android`가 추가되었습니다.
- Android 프로젝트가 생성되었습니다.
- 아직 `@capacitor/ios`는 설치하지 않았습니다.
- 아직 iOS 프로젝트는 생성하지 않았습니다.
- Android native build는 아직 실행하지 않았습니다.
- Android 리소스 적용과 빌드 확인은 별도 PR에서 진행합니다.

## Capacitor base config 추가 상태

- `@capacitor/core`와 `@capacitor/cli`가 추가되었습니다.
- 기본 `capacitor.config.json`이 추가되었습니다.
- appId 후보는 `com.harupuli.app`입니다.
- appName은 `하루풀이`입니다.
- webDir은 `dist`입니다.
- 아직 `@capacitor/android`와 `@capacitor/ios`는 설치하지 않았습니다.
- 아직 Android/iOS 프로젝트는 생성하지 않았습니다.
- 실제 Android 프로젝트 생성은 별도 PR에서 진행합니다.

## Capacitor Android adaptive icon PNG 생성 상태

- Capacitor Android 프로젝트 적용 전 사용할 adaptive icon PNG 후보가 생성되었습니다.
- 실제 Android 프로젝트에 적용하는 작업은 Capacitor/Android 프로젝트 생성 이후 별도 PR에서 진행합니다.

## Capacitor Android adaptive icon 준비 연계

- Capacitor Android 프로젝트 생성 후 adaptive icon 리소스 적용이 필요합니다.
- 적용 전 기준은 `docs/ANDROID_ADAPTIVE_ICON_READINESS.md`를 참고합니다.
- 이번 단계에서는 Android 프로젝트를 생성하지 않습니다.

## Capacitor splash PNG 생성 상태

- Capacitor 적용 전 사용할 splash PNG 후보 리소스가 생성되었습니다.
- 실제 Android/iOS 프로젝트에 적용하는 작업은 Capacitor 프로젝트 생성 이후 별도 PR에서 진행합니다.

## Capacitor splash 리소스 준비 연계

- Capacitor Android/iOS 프로젝트 생성 전 splash PNG 리소스 기준을 확정합니다.
- splash PNG 출력 기준은 `docs/SPLASH_PNG_EXPORT_READINESS.md`를 참고합니다.
- 실제 적용은 Capacitor 프로젝트 생성 이후 별도 PR에서 진행합니다.

## Android 우선 패키징 준비 연계

- Android 우선 패키징 준비 기준은 `docs/ANDROID_PACKAGING_READINESS.md`를 참고합니다.
- 현재 단계에서는 Android 프로젝트를 생성하지 않습니다.
- Capacitor 설치와 Android 프로젝트 생성은 별도 PR에서 진행합니다.
- Android 패키징 전 앱 리소스, localStorage, back button, 개인정보 처리방침 URL을 확인해야 합니다.

이 문서는 하루풀이 웹앱을 Capacitor 기반 모바일 앱으로 패키징하기 전 준비 기준을 정리한 문서입니다.
이번 PR은 준비 문서와 검증 스크립트 추가가 목적이며, Capacitor 설치, Android/iOS 프로젝트 생성, 네이티브 앱 빌드는 아직 진행하지 않습니다.

## 1. 목적

- 현재 React/Vite 웹앱을 Capacitor로 감싸기 위한 준비 상태를 확인합니다.
- Android/iOS 패키징 전에 필요한 리소스, 설정, 저장소, 광고, 개인정보, QA 항목을 정리합니다.
- 기존 웹앱 기능을 최대한 유지하면서 앱 패키징 리스크를 줄입니다.

## 2. 현재 준비 완료 항목

- PWA manifest 준비 완료
- 앱 아이콘 SVG 준비 완료
- maskable icon 준비 완료
- app icon master SVG 준비 완료
- splash master SVG 준비 완료
- 모바일 UX 1차 보정 완료
- 개인정보 안내 페이지 준비
- ConsentBanner / ConsentSettingsPanel 준비
- rewarded ad mock provider 준비
- rewarded ad SDK adapter scaffold 준비
- ads consent gate 준비
- placement readiness 문서 준비

## 3. Capacitor 도입 전 확인 사항

- [ ] Node/Vite build가 안정적으로 성공하는지 확인
- [ ] `npm run build` 결과물이 `dist`에 생성되는지 확인
- [ ] manifest와 icons가 dist에 포함되는지 확인
- [ ] localStorage 기반 데이터가 WebView에서 유지되는지 실제 기기 확인
- [ ] Android back button 동작 검토
- [ ] iOS safe-area 확인
- [ ] 하단 네비게이션과 WebView safe-area 겹침 확인
- [ ] 앱 삭제/재설치 시 localStorage 데이터 삭제 가능성 안내
- [ ] 개인정보 처리방침 URL 준비
- [ ] 앱스토어/플레이스토어 등록 정보 준비

## 4. Capacitor 도입 전 예상 설정

- appId 후보:
  - `com.harupuli.app`
  - 실제 배포 전 최종 확정 필요
- appName:
  - `하루풀이`
- webDir:
  - `dist`
- bundledWebRuntime:
  - `false` 후보
- Android 우선 검토
- iOS는 Android 빌드와 QA 후 검토

이번 PR에서는 실제 `capacitor.config` 파일을 만들지 않습니다.
실제 appId는 최종 배포 전 확정해야 합니다.

## 5. localStorage 고려사항

현재 localStorage 기반 저장 항목:

- 프로필 저장 정보
- 오늘운세/사주 캐시
- 광고 해금 상태
- 저장한 풀이
- 방문 streak
- consent preferences

확인할 점:

- Capacitor WebView에서 localStorage가 유지되는지 실제 기기에서 확인해야 합니다.
- 앱 삭제/재설치 시 데이터가 삭제될 수 있습니다.
- 로그인/서버 DB 도입 전까지는 기기 단위 저장임을 개인정보 안내에 반영합니다.
- 민감 정보가 외부 SDK로 직접 전달되지 않도록 유지합니다.

## 6. 광고 SDK 고려사항

- 현재 실제 광고 SDK는 없습니다.
- mock provider가 기본값입니다.
- SDK adapter scaffold만 있습니다.
- 실제 SDK 도입 전 provider 선택이 필요합니다.
- ads consent gate를 유지해야 합니다.
- provider placement ID는 환경변수 또는 네이티브 설정으로 관리해야 합니다.
- 생년월일, 출생시간, 성별, 사주 원본 정보를 광고 provider에 직접 전달하지 않는 원칙을 유지합니다.
- Android/iOS별 SDK 지원 여부는 별도 검토가 필요합니다.

## 7. 개인정보/동의 고려사항

- ConsentBanner와 ConsentSettingsPanel이 이미 있습니다.
- consent preferences는 localStorage에 저장됩니다.
- 실제 광고/분석 SDK 도입 전 동의 문구 재검토가 필요합니다.
- 앱스토어/플레이스토어 제출 전 개인정보 처리방침 URL이 필요합니다.
- 개인정보 처리방침 초안과 PrivacyInfoPage 문구를 앱 배포 기준으로 업데이트해야 합니다.
- 앱 삭제 시 데이터 삭제 가능성 안내가 필요합니다.

## 8. 앱 리소스 고려사항

- 현재 SVG master 리소스만 있습니다.
- 실제 Android/iOS 빌드 전 PNG 아이콘 세트가 필요합니다.
- splash PNG 세트가 필요합니다.
- Android mipmap 리소스 생성이 필요합니다.
- iOS asset catalog 생성이 필요합니다.
- 이번 PR에서는 생성하지 않습니다.

## 9. Android 우선 패키징 준비 항목

- [ ] Android Studio 설치 여부
- [ ] JDK 환경 확인
- [ ] Gradle 빌드 가능 여부
- [ ] Android package name 확정
- [ ] 앱 아이콘 PNG 세트 준비
- [ ] splash PNG 세트 준비
- [ ] WebView localStorage QA
- [ ] Android back button QA
- [ ] 광고 SDK 도입 여부 결정
- [ ] 개인정보 처리방침 URL 준비

## 10. iOS 패키징 준비 항목

- [ ] macOS/Xcode 필요
- [ ] iOS bundle identifier 확정
- [ ] Apple Developer 계정 필요
- [ ] iOS safe-area QA
- [ ] iOS storage QA
- [ ] splash screen QA
- [ ] 앱 심사 문구 확인
- [ ] 개인정보 처리방침 URL 준비

## 11. 실제 도입 PR 후보

1. Capacitor 설치 및 config 추가
2. Android 프로젝트 생성
3. Android 빌드 확인
4. Android WebView localStorage QA
5. Android 아이콘/splash 적용
6. Android 스토어 등록 정보 초안
7. iOS 프로젝트 생성
8. iOS safe-area/storage QA
9. 실제 광고 SDK provider 선택
10. 실제 광고 SDK adapter 구현
