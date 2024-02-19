# ✈️Trip Pocket 

## ☁️프로젝트 소개 
여러 번의 여행도 따로, 또 한 번에. 여행의 모든 것을 기록하세요.     
여행 사진, 일기, TODO, 지출을 한 번에 기록할 수 있는 통합 플래너.  
   
<img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=React&logoColor=black"/> <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black"/>   

- 제작기간 : 2023.09.14 ~ 2023.12.02
- #### Team : 김소은, 황지연
- #### My Part : Project Design, Frontend, Backend, DB (/planner, /memo etc..)

## 🩷주요 기능 소개
1. [🧑‍💻로그인 및 회원가입](#로그인-및-회원가입)
2. [📚여행 별로, 상황 별로 나눠쓸 수 있는 Planner](#여행-별로,-상황-별로-나눠쓸-수-있는-Planner)
3. [💸ToDo 및 지출](#ToDo-및-지출)
4. [📷사진과 일기](#사진과-일기)


### 💌Main Page 

<img src = "https://github.com/ghkdwldus0807/TripPocket/blob/main/image/main_page.png?raw=true">

### 🧑‍💻로그인 및 회원가입

- 메인 페이지에서 '회원가입' 버튼을 누르시면 회원가입 페이지로 이동하게되고, 회원가입 페이지에서 회원가입이 가능합니다.  
- 아이디는 이메일 형식으로만 가입 가능합니다.   
- 아이디, 비밀번호, 이름은 필수 입력 항목이며, 프로필 사진은 선택 사항입니다.   
- 이름과 프로필 사진은 추후 변경하실 수 있습니다.   
- 필수 입력을 다 작성하신 후 다시 한 번 회원가입 버튼을 클릭하시면 회원가입이 성공적으로 마무리 됩니다.
- firebase의 Authentication 및 Realtime database를 이용하였습니다. 

<img src = "https://github.com/ghkdwldus0807/TripPocket/blob/main/image/login_page.png?raw=true">

### 📚여행 별로, 상황 별로 나눠쓸 수 있는 Planner

- 플래너를 원하는 목적에 맞게 분리해서 사용할 수 있습니다.
- '+' 버튼을 눌러 자유롭게 표지와 플래너 명을 설정해보세요.

<img src = "https://github.com/ghkdwldus0807/TripPocket/blob/main/image/list_page.png?raw=true">


### 💸ToDo 및 지출

- 플래너 안 캘린더의 날짜를 클릭해서 원하는 날짜로 자유롭게 이동하신 후, 기록하세요.
- 각 섹션에 있는 'ADD'버튼을 클릭하시면 TODO 및 지출을 추가하실 수 있습니다. 
- TODO를 추가하시면, 시간 순으로 자동 정렬됩니다.
- 여행 플래너의 특성을 살려, 지출 추가 시 원하는 화폐 단위를 설정할 수 있습니다.
- TODO 및 지출 모두 수정/삭제를 원하시는 기록을 클릭하시면 수정 및 삭제를 할 수 있는 MODAL 창이 뜹니다.

<img src = "https://github.com/ghkdwldus0807/TripPocket/blob/main/image/%EC%BA%98%EB%A6%B0%EB%8D%94.png?raw=true">
<img src = "https://github.com/ghkdwldus0807/TripPocket/blob/main/image/%EC%9D%BC%EC%A0%95%EC%B6%94%EA%B0%80.png?raw=true">
<img src = "https://github.com/ghkdwldus0807/TripPocket/blob/main/image/%EC%9D%BC%EC%A0%95%EC%88%98%EC%A0%95.png?raw=true">
<img src = "https://github.com/ghkdwldus0807/TripPocket/blob/main/image/%EC%A7%80%EC%B6%9C%EC%B6%94%EA%B0%80.png?raw=true">
<img src = "https://github.com/ghkdwldus0807/TripPocket/blob/main/image/%EC%A7%80%EC%B6%9C%EC%88%98%EC%A0%95.png?raw=true">


### 📷사진과 일기

- 토글을 눌러 MEMO 페이지로 이동하시면 해당 날짜에 원하는 사진을 첨부하고, 간단한 일기를 작성할 수 있습니다. 
- EDIT 버튼을 눌러 원하시는 사진 첨부 및 일기 작성을 하실 수 있습니다.
- Firebase storage를 이용하여 첨부 파일을 관리합니다.

  <img src = "https://github.com/ghkdwldus0807/TripPocket/blob/main/image/%EB%A9%94%EB%AA%A8.png?raw=true">
  <img src = "https://github.com/ghkdwldus0807/TripPocket/blob/main/image/%EB%A9%94%EB%AA%A8%20%EC%B6%94%EA%B0%80%20%EB%B0%8F%20%EC%88%98%EC%A0%95.png?raw=true">
  <img src = "https://github.com/ghkdwldus0807/TripPocket/blob/main/image/%EB%A9%94%EB%AA%A8%EC%88%98%EC%A0%95%ED%9B%84.png?raw=true">
  
