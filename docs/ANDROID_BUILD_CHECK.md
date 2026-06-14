# ANDROID_BUILD_CHECK

## Android debug build CI 성공 확인

- GitHub Actions Android Debug Build workflow가 성공했습니다.
- debug APK artifact가 생성되었습니다.
- artifact 이름: `harupuli-debug-apk`
- artifact 경로: `android/app/build/outputs/apk/debug/app-debug.apk`
- 이 결과를 바탕으로 Android WebView localStorage QA 단계로 넘어갑니다.
- release build와 signing은 아직 진행하지 않습니다.
- 실제 기기 QA는 별도 PR에서 진행합니다.

## 2026-06-14 GitHub Actions Android debug build workflow 수정

- PR #73에서 Android Debug Build workflow를 추가했지만, CI의 `Build Android debug APK` 단계에서 실패했습니다.
- Set up JDK, npm build, `npx cap sync android` 단계는 성공했습니다.
- 이번 단계에서는 Linux runner에서 Gradle wrapper 실행 권한 문제를 방지하기 위해 `chmod +x android/gradlew` 단계를 추가했습니다.
- Java 환경 확인을 위해 `java -version`, `javac -version`, `JAVA_HOME` 출력 단계를 추가했습니다.
- Gradle wrapper 확인을 위해 `./gradlew --version` 단계를 추가했습니다.
- Android build 명령은 `./gradlew assembleDebug --stacktrace`로 보강했습니다.
- debug APK artifact 경로는 기존과 동일하게 유지합니다.
  - `android/app/build/outputs/apk/debug/app-debug.apk`
- release build와 signing은 아직 진행하지 않습니다.
- 실제 기기 QA와 Android 리소스 적용은 아직 진행하지 않습니다.

## 2026-06-13 GitHub Actions Android debug build

- 로컬 Windows 환경에서는 JDK/JAVA_HOME 미설정으로 Android debug APK를 생성하지 못했습니다.
- GitHub Actions에서 JDK 21을 설정한 뒤 Android debug build를 실행하는 workflow를 추가했습니다.
- workflow 파일: `.github/workflows/android-debug-build.yml`
- 실행 흐름: `npm ci` → `npm run build` → `npx cap sync android` → `cd android && ./gradlew assembleDebug`
- debug APK artifact 이름: `harupuli-debug-apk`
- debug APK artifact 경로: `android/app/build/outputs/apk/debug/app-debug.apk`
- release build는 진행하지 않습니다.
- signing, keystore, store password 설정은 추가하지 않습니다.
- iOS 프로젝트 생성, Android 리소스 수동 교체, 실제 광고 SDK 연동은 진행하지 않습니다.
- GitHub Actions 실행 결과는 PR 생성 후 Actions 또는 PR checks에서 확인합니다.

## 2026-06-13 Android debug build 재시도 결과

- JDK 설치 여부: 미확인, 현재 `java` 명령 사용 불가
- `JAVA_HOME` 설정 여부: 미설정
- `java -version`: 실패, `spawnSync java ENOENT`
- `javac -version`: 실패, `spawnSync javac ENOENT`
- `npm install`: 성공
- `npm run build`: 성공
- `npx cap sync android`: 성공
- `./gradlew assembleDebug`: 실패
- APK 생성 경로: `android/app/build/outputs/apk/debug/app-debug.apk`
- APK 생성 여부: 미생성
- release build: 미진행
- signing: 미진행
- 실제 기기 QA: 미진행
- Android 리소스 교체: 미진행
- iOS 프로젝트: 미생성

### 재시도 실패 원인

현재 로컬 환경에서 `JAVA_HOME`이 설정되어 있지 않고 `java` 및 `javac` 명령을 PATH에서 찾을 수 없습니다.
따라서 Gradle wrapper가 Android debug build를 시작하지 못했습니다.

```text
ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
Please set the JAVA_HOME variable in your environment to match the location of your Java installation.
```

### 다음 재시도 조건

- JDK 21 설치
- `JAVA_HOME`을 JDK 설치 경로로 설정
- `java`와 `javac`를 PATH에서 실행 가능하게 설정
- 이후 `npm run check:android-java-env` 통과 확인
- 이후 `cd android && gradlew.bat assembleDebug` 재실행

### 이번 PR에서 수정하지 않은 범위

- Android 리소스 교체 없음
- release build 없음
- signing 설정 없음
- 실제 기기 QA 없음
- iOS 프로젝트 생성 없음
- 실제 광고 SDK 추가 없음
- production `src` 코드 변경 없음

이 문서는 하루풀이 Capacitor Android 프로젝트의 debug build 확인 결과와 후속 확인 항목을 정리한 문서입니다.
이번 PR은 Android debug build 가능 여부 확인이 목적이며, Android 리소스 교체, 실제 기기 QA, 광고 SDK 연동은 아직 진행하지 않았습니다.

## 1. 목적

- Capacitor Android scaffold가 실제로 build 가능한지 확인한다.
- Android debug build 결과를 기록한다.
- 이후 Android WebView QA와 리소스 적용 단계로 넘어가기 전 문제를 줄인다.

## 2. 현재 Android 상태

- `@capacitor/core` 설치 완료
- `@capacitor/cli` 설치 완료
- `@capacitor/android` 설치 완료
- `capacitor.config.json` 존재
- Android 프로젝트 생성 완료
- `npx cap sync android` 가능
- iOS 프로젝트 미생성
- 실제 광고 SDK 미연동
- Android 리소스 교체 미진행

## 3. 빌드 명령

```bash
npm install
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

Windows 대체 명령:

```bash
cd android
gradlew.bat assembleDebug
```

## 4. 빌드 결과 기록

- `npm install`: 성공
- `npm run build`: 성공
- `npx cap sync android`: 성공
- `./gradlew assembleDebug`: 실패
- 생성 APK 후보 경로: `android/app/build/outputs/apk/debug/app-debug.apk`
- 실제 APK 생성 여부: 미생성

### 실패 원인

현재 로컬 환경에서 `JAVA_HOME`이 설정되어 있지 않고 `java` 명령을 PATH에서 찾을 수 없어 Gradle wrapper가 실행되지 못했습니다.

Gradle 출력 요약:

```text
ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
Please set the JAVA_HOME variable in your environment to match the location of your Java installation.
```

### 수정 파일

- 빌드 실패를 해결하기 위한 Android 코드 수정은 진행하지 않았습니다.
- 실패 원인은 프로젝트 코드가 아니라 로컬 JDK 환경 미설정입니다.

### 재시도 조건

- JDK 설치
- `JAVA_HOME` 설정
- `java` 명령 PATH 등록
- 이후 `cd android && gradlew.bat assembleDebug` 재실행

## 5. 기본 scaffold 확인 항목

- `android/app/src/main/AndroidManifest.xml` 존재
- `android/app/src/main/java/com/harupuli/app/MainActivity.java` 존재
- `android/app/build.gradle` 존재
- `android/settings.gradle` 존재
- `android/gradle/wrapper` 존재
- `android/app/src/main/assets/public` 리소스 sync 확인
- package name 후보 `com.harupuli.app` 확인
- app label `하루풀이` 확인

## 6. 주의사항

- Capacitor scaffold가 기본 launcher icon/splash 리소스를 생성했습니다.
- 현재 단계에서는 `public/generated-icons` 리소스를 Android `res`에 수동 적용하지 않습니다.
- Android 리소스 적용은 별도 PR에서 진행합니다.
- Android connected test는 아직 범위에 포함하지 않습니다.
- 기본 템플릿 테스트 파일과 package name은 추후 정리 후보로 둡니다.
- 실제 기기 WebView localStorage QA는 별도 PR에서 진행합니다.
- Android back button QA는 별도 PR에서 진행합니다.
- release build와 signing은 아직 진행하지 않았습니다.

## 7. 다음 단계

- Android JDK 환경 설정 후 debug build 재시도
- Android WebView localStorage QA
- Android back button QA
- Android 리소스 적용
- 앱스토어 등록 정보 초안
- 개인정보 처리방침 URL 준비
