![header](https://capsule-render.vercel.app/api?type=waving&color=auto&section=header&text=🏆%202024년%20여름%20ICPC,%20캡스톤디자인%20원장상(우수상)&fontSize=30&customColorList=2&height=170)

# 📑 Project

- 프로젝트명 : 가상화폐 가격 예측 AI 기술을 접목한 백테스팅 & 자동매매 서비스 - "BAMOWL"

## 1. 개발 동기 및 목표
<img width="1540" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/8602d445-7b93-4595-b1f1-6e34a027864f">

### 가. 개발 동기
- 가상화폐 시장은 전통적인 주식 시장과는 다르게 매우 높은 변동성과 24시간 운영이라는 특성을 가지고 있어, 개인 투자자들이 효과적인 투자 전략을 세우고 이를 실시간으로 검증하며 조정할 수 있는 능력이 필수적임.
- 따라서, 개인이 자신의 투자 전략을 체계적으로 검증하고 테스트할 수 있는 환경이 매우 중요함.
- 최근 딥러닝 기술의 발전은 가상화폐 시장 데이터를 보다 정확하게 예측하는 데 활용되고 있으며, 이를 통해 보다 효율적인 거래가 가능해짐.
- 그러나 가상화폐 시장의 높은 변동성과 예측 불가능성으로 인해 기존 예측 모델의 적용이 어렵고, 딥러닝을 활용한 코인 가격 예측과 백테스팅의 결합을 통한 전략 검증 사례는 드문 상황임.
- 많은 투자자들이 가상화폐 시장의 복잡한 기술적 요소들을 이해하기 어려워하며, 이로 인해 효과적인 투자를 위한 직관적이고 사용하기 쉬운 UI와 도구가 필요함.

### 나. 개발 목표
- 자동화된 거래 시스템과 백테스팅을 결합한 플랫폼의 개발.
- 투자자들은 과거의 데이터를 통해 전략을 검증하고, 딥러닝 예측 모델을 통해 미래의 시장 변동을 파악할 수 있음.
- 이러한 기술력을 바탕으로, 투자 전략을 자동 조정하는 기능을 제공함으로써 성공적인 투자를 이끌어 냄.

## 2. 필요성

<img width="1526" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/a2dc9bda-b951-47f7-9c57-fcb3cb38d5f6">

## 3. 기존 서비스와의 차별점

<img width="1535" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/84e8a104-cda5-499f-9108-b5be19605c04">


## 4. 서비스 메인 프로세스

<img width="1239" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/3604000e-15ca-4bdb-8ff7-46a99155698b">

## 5. 세부 기획

<img width="1644" alt="스크린샷 2024-06-24 오후 4 41 00" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/c7f0d3a0-558b-4f54-895a-e94c1e7684f9">

<br>
<br>

# 🎨 프로젝트 설계

## 1. 플로우차트

<img width="1260" alt="BAMOWL_플로우차트" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/affe947c-6ee2-45b4-8d25-aa3f950a3190">

- 로그인 및 방문 여부에 따라 사용자를 구분하여 이에 따른 서비스를 제공함
- 주요 기능은 주황색으로 표현하여 본 서비스에서 제공하고자 하는 핵심 기능들을 한 눈에 볼 수 있도록 고안함

## 2. ERD

<img width="1382" alt="스크린샷 2024-06-24 오후 4 16 56" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/ea955bd5-5c9a-466d-93a4-d8c328383d7b">

- 캔들 데이터는 차트 및 백테스팅 기능에 필수적인 요소임. 때문에 업비트 API를 활용하여 DB를 구축하였고, 가상화폐의 종류 & 캔들 종류와 매핑함으로써 모든 가상화폐와 캔들 종류에 따라 필터링을 통해 원하는 데이터를 가져올 수 있도록 설계함
- 유저와 관련된 중요 정보로는 서비스 약관 동의여부 & 업비트 키 등이 있으며 이는 서비스 진행에 필수적인 요소임
- 유저와 포트폴리오를 1:N 매핑함으로써, 소유한 포트폴리오 지표 및 결과 등을 다시 확인할 수 있으며 언제든지 원하는 지표로 자동매매를 진행할 수 있도록 함

## 3. 개발 환경

<img width="1595" alt="개발환경 최종" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/6a71b502-e513-48d8-a6ab-17e3dbd52bc0">

## 4. 프로젝트 아키텍처

<img width="1305" alt="BAMOWL_아키텍처" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/2a300ad6-ce83-4db7-b42b-06fa84cde033">

<br><br>

# ⚙️ 파트별 핵심 기술

## 1. 백엔드

<img width="1639" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/c838aea3-e0b5-4481-ad86-6b4e9446450c">

<img width="1662" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/0e44e5e9-ea22-454c-ab3c-fa17c39fa240">

## 2. 프론트엔드

<img width="1678" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/8f1d65c3-3ee4-467f-b0f0-9d15a2fe3232">

<img width="1688" alt="image" src="https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/4f9f9967-8c6e-45c5-aef5-01db2e4fb6ae">

<br><br>

# 🎬 시연 영상

https://github.com/CSID-DGU/2024-1-SCS4031-01-owl-4/assets/113084292/f9e58f76-f224-4e09-8832-699d73e15137

<br>

# 🦉 Team
|<img src="https://github.com/bbbang105.png" width="200" height="200" />|<img src="https://github.com/UniverseDolphin.png" width="200" height="200" />|<img src="https://github.com/nanaono.png" width="200" height="200" />|
|:---:|:---:|:---:|
|[한상호 (팀장)](https://github.com/bbbang105)|[고영웅](https://github.com/UniverseDolphin)|[양나은](https://github.com/nanaono)|
|경영정보학과|수학교육학과|화공생물공학과|
|2018111366|2017112801|2018112284|
|Backend|Frontend|Deep Learning|
|DB & 서버 구축, 소셜 로그인 구현, API & 자동매매 구현|기획/기능 & UI/UX 설계, 차트 & 검색 기능 구현|딥러닝 실험 설계, 모델 베이스 실험 진행, 전략 설정 세부 기획|

## 🧑🏻‍🏫 Mentor

- [김도현 멘토님 (카카오뱅크)](https://kdohyeon.github.io/)
- Software Engineer (Backend)

### 역할
- 물타기 매매법, 골든 크로스 등 프로젝트에 필요한 지식들 공유
- 백테스팅 전략 설정 및 구현 조언
- 상시 피드백 및 코드 리뷰를 통한 성능 개선 및 코드 퀄리티 향상
- 전반적인 개발 일정 및 발표에 대한 조언, 시간 내 개발 완수에 도움
  
<br>

# 🔒 Rule 
다음과 같은 룰을 따릅니다.

## 🔀 Git-Flow 
- Github Projects를 이용하여 Issue를 관리합니다.
- 각자의 feature branch에서 작업한 후, develop branch로 merge합니다.
- {브랜치 종류}/{이슈 번호}/{내용} 순으로 작명합니다.
- `ex) feature/#3/login`

## 💬 Commit Convention
|작업 태그|설명|
|------|---|
|`feat`|새로운 기능 추가 / 일부 코드 추가 / 일부 코드 수정 (리팩토링과 구분) / 디자인 요소 수정|
|`fix`|버그 수정|
|`refactor`|코드 리팩토링|
|`style`|코드 의미에 영향을 주지 않는 변경사항 (코드 포맷팅, 오타 수정, 변수명 변경, 에셋 추가)|
|`chore`|빌드 부분 혹은 패키지 매니저 수정 사항 / 파일 이름 변경 및 위치 변경 / 파일 삭제|
|`docs`|문서 추가 및 수정|
|`rename`|패키지 혹은 폴더명, 클래스명 수정 (단독으로 시행하였을 시)|
|`remove`|패키지 혹은 폴더, 클래스를 삭제하였을 때 (단독으로 시행하였을 시)|

- 이슈 번호를 붙여서 commit
- `ex) #4 [feat] : 로그인 기능 구현`
