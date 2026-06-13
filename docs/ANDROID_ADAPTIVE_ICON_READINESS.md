# ANDROID_ADAPTIVE_ICON_READINESS

이 문서는 하루풀이 Android adaptive icon foreground/background 리소스를 준비하기 위한 기준을 정리한 문서입니다.
이번 PR은 adaptive icon 준비 기준과 target manifest, 검증 스크립트 추가가 목적이며, 실제 Android 프로젝트 생성과 PNG 바이너리 생성은 아직 진행하지 않습니다.

## 1. 목적

- Android 앱 패키징 전 adaptive icon 구조를 정리합니다.
- foreground와 background 리소스의 역할을 구분합니다.
- 기존 앱 아이콘 PNG 세트와 Android adaptive icon의 관계를 정리합니다.
- 실제 Android 프로젝트 생성 후 출력 경로와 검증 기준을 확정합니다.

## 2. 현재 준비 상태

- app icon master SVG 준비 완료
- 앱 아이콘 PNG 세트 생성 완료
- splash PNG 세트 생성 완료
- Android 패키징 준비 문서 완료
- Capacitor readiness 문서 완료
- Android 프로젝트 미생성
- Capacitor 미설치
- adaptive icon foreground/background 미생성

## 3. Android adaptive icon 개념

- Android adaptive icon은 foreground와 background 레이어로 구성됩니다.
- foreground는 중앙 문양 또는 로고 레이어입니다.
- background는 단색 또는 단순 배경 레이어입니다.
- 실제 Android 프로젝트에서는 `mipmap-anydpi-v26` 리소스와 XML 정의가 필요할 수 있습니다.
- 이번 PR에서는 Android 프로젝트가 없으므로 XML이나 mipmap 폴더를 만들지 않습니다.

## 4. foreground 리소스 기준

- 중앙 문양 중심
- 텍스트 사용 금지
- 투명 배경 가능
- safe zone 안에 주요 문양 배치
- 기존 하루풀이 앱 아이콘과 시각 일관성 유지
- 작은 크기에서도 식별 가능해야 함

## 5. background 리소스 기준

- 앱 theme와 어울리는 단색 또는 부드러운 그라데이션 후보
- 과도한 패턴 금지
- foreground 문양과 대비가 충분해야 함
- Android 런처에서 잘림이 발생해도 자연스러워야 함

## 6. 권장 출력 후보

- `public/generated-icons/android-adaptive/foreground-432.png`
- `public/generated-icons/android-adaptive/foreground-108.png`
- `public/generated-icons/android-adaptive/background-432.png`
- `public/generated-icons/android-adaptive/background-108.png`

이번 PR에서는 위 PNG 파일을 생성하지 않습니다.

## 7. 실제 Android 프로젝트 적용 시 참고

- Android 프로젝트 생성 후 `res/mipmap-anydpi-v26/ic_launcher.xml` 후보
- foreground/background drawable 또는 mipmap 리소스 후보
- Android 8.0 이상 adaptive icon 대응
- Android 12 splash icon과의 관계 검토
- Google Play listing icon과 launcher icon 차이 검토

## 8. 향후 PR 후보

- adaptive icon foreground/background PNG 실제 생성
- Android adaptive icon XML 적용 준비
- Android 프로젝트 생성 후 리소스 적용
- Android 런처 아이콘 QA
- Android 12 splash icon QA
