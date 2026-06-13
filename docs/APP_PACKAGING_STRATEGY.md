# APP_PACKAGING_STRATEGY

## Android debug build CI 전략

- Android 앱 패키징 검증은 우선 debug APK를 GitHub Actions artifact로 생성하는 흐름으로 진행합니다.
- 로컬 JDK/JAVA_HOME이 없어도 PR에서 CI 결과를 확인할 수 있도록 `.github/workflows/android-debug-build.yml`을 사용합니다.
- 현재 CI 범위는 `npm run build`, `npx cap sync android`, `./gradlew assembleDebug`, debug APK artifact 업로드입니다.
- release build, signing, keystore 관리, 스토어 제출용 bundle 생성은 아직 범위에 포함하지 않습니다.
- iOS 패키징은 Android debug build와 WebView QA 이후 별도 단계로 검토합니다.

## Android build 확인 진행 상태

- Capacitor Android scaffold 이후 debug build 확인을 진행했습니다.
- 다음 단계는 Android WebView localStorage QA와 back button QA입니다.
- iOS는 아직 보류 상태입니다.

## Android 플랫폼 scaffold 진행 상태

- Capacitor 기반 Android 우선 패키지 흐름으로 Android 플랫폼 scaffold가 추가되었습니다.
- iOS는 아직 보류 상태입니다.
- 다음 단계는 Android build 확인과 WebView QA입니다.

## Capacitor base config 적용

- 현재 앱 패키징 방식은 Capacitor 기반 Android 우선 패키지 준비로 진행합니다.
- Capacitor core/cli와 기본 config가 추가되었습니다.
- Android/iOS 플랫폼 추가는 별도 PR에서 진행합니다.

## Android 우선 패키징 준비 연계

- 현재 추천 흐름은 Android 우선 패키징 준비 후 Capacitor 설치 검토입니다.
- Android 패키징 준비 기준은 `docs/ANDROID_PACKAGING_READINESS.md`를 참고합니다.
- iOS는 Android 빌드와 QA 후 검토합니다.

## Capacitor readiness 문서 연계

- Capacitor 도입 전 준비 기준은 `docs/CAPACITOR_READINESS.md`를 참고합니다.
- 현재 단계에서는 Capacitor를 설치하지 않습니다.
- Android/iOS 프로젝트 생성은 별도 PR에서 진행합니다.
- 앱 패키징 전 localStorage, consent, 광고 SDK, 앱 리소스 QA가 필요합니다.

이 문서는 하루풀이 앱을 모바일 앱으로 전환하기 위한 앱 패키징 방식 선택 기준을 정리한 문서입니다.
이번 PR은 의사결정 문서 작성이 목적이며, Capacitor 설치, Android/iOS 프로젝트 생성, 네이티브 앱 패키징은 아직 진행하지 않습니다.

## 1. 목적

- 현재 React/Vite 웹앱을 모바일 앱으로 전환할 수 있는 방식을 비교합니다.
- 현재 코드와 기능을 최대한 유지하면서 앱스토어/플레이스토어 배포 가능성을 검토합니다.
- 광고 SDK, 개인정보 동의, localStorage, PWA, 앱 아이콘/스플래시 준비 상태를 함께 고려합니다.

## 2. 현재 프로젝트 상태

- React/Vite 기반 웹앱입니다.
- Vercel 배포를 사용합니다.
- PWA manifest 준비가 완료되었습니다.
- SVG 앱 아이콘과 스플래시 master 리소스가 준비되어 있습니다.
- 모바일 UX QA 1차 보정이 완료되었습니다.
- localStorage 기반으로 프로필, 운세 캐시, 저장한 풀이, 방문 streak, consent 상태를 사용합니다.
- rewarded ad는 mock provider와 SDK adapter scaffold 단계입니다.
- 실제 광고 SDK는 아직 연결하지 않았습니다.
- 로그인과 서버 DB는 아직 없습니다.
- service worker는 아직 없습니다.
- Capacitor는 아직 설치하지 않았습니다.

## 3. 앱화 후보 방식

### 3.1 PWA 유지

장점:

- 현재 구조와 가장 잘 맞습니다.
- 홈 화면 추가 같은 설치 경험을 일부 제공할 수 있습니다.
- 네이티브 빌드가 필요 없습니다.
- Vercel 배포 흐름을 그대로 유지할 수 있습니다.

단점:

- 앱스토어/플레이스토어 배포와는 별개입니다.
- 네이티브 광고 SDK 연동에 제약이 있을 수 있습니다.
- 푸시, 스토어 노출, 네이티브 권한 기능에 제약이 있을 수 있습니다.

### 3.2 Capacitor 기반 앱 래핑

장점:

- 현재 React/Vite 웹앱을 최대한 유지할 수 있습니다.
- Android/iOS 앱 패키징이 가능합니다.
- 추후 네이티브 광고 SDK, 푸시, 스토어 배포 검토가 가능합니다.
- 재개발 부담이 비교적 낮습니다.

단점:

- Android/iOS 빌드 환경이 필요합니다.
- 네이티브 권한과 스토어 심사 대응이 필요합니다.
- WebView 환경에서 localStorage 동작 QA가 필요합니다.
- 실제 광고 SDK 연동 시 별도 adapter 작업이 필요합니다.

### 3.3 일반 WebView 앱

장점:

- 구조가 단순합니다.
- 현재 웹앱을 빠르게 감싸는 방식으로 시작할 수 있습니다.

단점:

- 스토어 심사에서 단순 웹뷰 앱으로 보일 위험이 있습니다.
- 네이티브 기능 확장성이 낮을 수 있습니다.
- 광고 SDK, 푸시, 권한 처리 구조가 제한될 수 있습니다.

### 3.4 React Native 재개발

장점:

- 네이티브 UX에 가장 가까운 경험을 만들 수 있습니다.
- 장기적으로 앱 전용 기능 확장에 유리합니다.

단점:

- 현재 웹앱 재사용성이 낮습니다.
- 개발 비용과 시간이 큽니다.
- 이미 검증한 UI와 로직을 다시 이식해야 합니다.
- 현재 MVP 단계에서는 과한 선택일 수 있습니다.

## 4. 추천 방향

현재 단계의 1순위 추천은 아래와 같습니다.

1. PWA 기본 상태를 유지하면서 Capacitor 도입 준비로 넘어갑니다.
2. Android 우선 패키징 가능성을 검토합니다.
3. Android 빌드와 QA 후 iOS 빌드를 검토합니다.

보류:

- React Native 재개발은 초기 앱 검증 이후 검토합니다.
- 단순 WebView 앱은 스토어 정책과 심사 리스크를 확인한 뒤 판단합니다.

## 5. localStorage와 앱화 고려사항

현재 앱은 아래 localStorage 계열 데이터를 사용합니다.

- 프로필 저장 key
- 오늘운세 캐시 key
- reward unlock key
- saved readings key
- visit streak key
- consent preferences key

앱화 전 확인할 사항:

- WebView/Capacitor 환경에서 localStorage 유지 여부를 확인합니다.
- 앱 삭제/재설치 시 데이터가 삭제될 수 있음을 안내해야 합니다.
- 로그인/서버 DB 도입 전까지는 기기 단위 저장임을 명확히 안내합니다.
- 개인정보 안내 페이지 문구와 연결해야 합니다.

## 6. 광고 SDK와 앱화 고려사항

- 현재는 mock provider와 SDK adapter scaffold 단계입니다.
- 실제 광고 SDK는 아직 없습니다.
- 실제 SDK 도입 전 provider 선택이 필요합니다.
- ads consent gate는 유지해야 합니다.
- Android/iOS별 광고 SDK 지원 여부를 확인해야 합니다.
- provider placement ID는 환경변수 또는 네이티브 설정으로 관리해야 합니다.
- 생년월일, 출생시간, 성별, 사주 원본 정보를 광고 provider에 직접 전달하지 않는 원칙을 유지합니다.

## 7. 개인정보/동의 고려사항

- ConsentBanner와 ConsentSettingsPanel이 이미 있습니다.
- consent preferences는 localStorage에 저장됩니다.
- 실제 광고/분석 SDK 도입 전 동의 문구 재검토가 필요합니다.
- 앱스토어/플레이스토어 제출 전 개인정보 처리방침 URL이 필요합니다.
- PrivacyInfoPage와 `docs/PRIVACY_POLICY_DRAFT.md` 업데이트가 필요합니다.

## 8. 앱 패키징 전 체크리스트

- [ ] PWA manifest 확인
- [ ] 앱 아이콘 master SVG 확인
- [ ] splash master SVG 확인
- [ ] 모바일 UX 주요 화면 QA
- [ ] localStorage 동작 QA
- [ ] consent banner 동작 QA
- [ ] rewarded ad mock 동작 QA
- [ ] 만세력 debug page 확인
- [ ] 개인정보 안내 페이지 확인
- [ ] 스토어 등록 정보 초안 준비
- [ ] 개인정보 처리방침 URL 준비
- [ ] Android 빌드 방식 결정
- [ ] iOS 빌드 방식 결정
- [ ] 실제 기기 테스트 계획 수립

## 9. 향후 PR 후보

- Capacitor 도입 준비 문서
- Android 우선 패키징 준비
- 앱스토어 등록 정보 초안
- 개인정보 처리방침 URL 준비
- 실제 기기 QA 체크리스트
- 앱 아이콘 PNG 세트 생성
- splash PNG 세트 생성
- 실제 광고 SDK provider 선택 문서
- 실제 광고 SDK adapter 구현
