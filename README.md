<details>
  <summary><strong>목차</strong></summary>
  
1. <a href="#-1-프로젝트-개요">프로젝트 개요</a><br>
&nbsp;&nbsp;1.1 <a href="#11-기획-의도">기획 의도</a><br>
&nbsp;&nbsp;1.2 <a href="#12-프로젝트-소개">프로젝트 소개</a><br>

2. <a href="#-2-주요-기능">주요 기능</a><br>

3. <a href="#️-3-기술-스택-및-아키텍처">기술 스택 및 아키텍처</a><br>
&nbsp;&nbsp;3.1 <a href="#31-기술-스택">기술 스택</a><br>
&nbsp;&nbsp;3.2 <a href="#32-아키텍처">아키텍처</a><br>

1. <a href="#️-4-erd--api-명세">ERD & API 명세</a><br>
&nbsp;&nbsp;4.1 <a href="#41-erd">ERD</a><br>
&nbsp;&nbsp;4.2 <a href="#42-api-명세">API 명세</a><br>

5. <a href="#-5-서버-실행">서버 실행</a><br>
&nbsp;&nbsp;5.1 <a href="#51-공통-사전-준비">공통 사전 준비</a><br>
&nbsp;&nbsp;5.2 <a href="#52-프론트엔드-실행-요약">프론트엔드 실행 요약</a><br>
&nbsp;&nbsp;5.3 <a href="#53-백엔드-실행-요약">백엔드 실행 요약</a><br>

6. <a href="#-6-팀-구성-및-역할분담">팀 구성 및 역할분담</a><br>
&nbsp;&nbsp;6.1 <a href="#61-프론트엔드">프론트엔드</a><br>
&nbsp;&nbsp;6.2 <a href="#62-백엔드">백엔드</a><br>

7. <a href="#-7-프론트엔드백엔드-상세">프론트엔드/백엔드 상세</a><br>

</details>

<br>

# 📌 1. 프로젝트 개요
## 1.1 기획 의도
스포츠 경기를 중계해주는 식당, 펍을 찾아본 경험이 있으신가요?<br>
원하는 경기를 중계하는지 물어본 경험이 있으신가요?<br><br>
대중적인 지도 서비스에는 스포츠 중계 필터가 존재하지 않습니다.<br>
스포츠 팬들은 경기를 함께 즐길 수 있는 장소를 원하지만, 정보를 얻기 어렵습니다.<br>
식당 또한 대형 스크린을 구비하고 경기를 중계해도 이를 알릴 방법이 없습니다.

## 1.2 프로젝트 소개
> <br>PLAYS + PLACE = PLAYCE<br><br>

PLAYCE는 PLAY(스포츠 경기)와 PLACE(장소)의 합성어로<br>
사용자 주변의 스포츠 중계 식당을 쉽게 탐색할 수 있도록 돕는 지도 서비스입니다.<br><br>
식당 위치, 경기 종목, 팀 등을 바탕으로 최적의 장소를 검색할 수 있도록 지원하며<br>
기존의 지도, 맛집 서비스에는 없던 스포츠 경기 중계 일정을 확인할 수 있습니다.

## 1.3 활용 방안 및 기대 효과
- 스포츠 팬의 장소 검색 도구로 활용<br>
  - 스포츠를 시청할 수 있는 장소를 찾는 개인 또는 소모임이 경기 일정과 위치를 기반으로 편리하게 장소 탐색 가능
  - 스포츠 팬들은 원하는 팀의 경기를 원하는 분위기에서 관람 가능

- 식당의 마케팅으로 활용
  - 스포츠 중계를 제공하는 식당은 중계 일정을 등록하여 새로운 고객 유입 가능
  - 평일 저녁 또는 경기 시간에 맞춘 운영을 통해 고객의 방문율을 향상시킬 수 있으며 스포츠 관련 메뉴, 서비스 등을 통하여 매출 극대화 가능

- 스포츠 문화 활성화 및 스포츠 커뮤니티 플랫폼으로 확장
  - 집에서 혼자 보는 경기에서 벗어나, 식당에서 함께 응원하며 경기를 시청하는 문화를 활성화할 수 있음
  - 특정 구단 팬을 위한 정기 응원 모임, 단체 관람 등의 다양한 스포츠 문화를 창출할 수 있으며, 지역 기반 스포츠 커뮤니티 플랫폼으로 확장 가능

# 🚀 2. 주요 기능
<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <td style="width:33%; text-align:center; vertical-align:middle;">
      <img src="readme-assets/2-1-1_map.png" alt="지도 이미지" style="max-width:100%; max-height:100%; display:block;">
    </td>
    <td style="width:33%; text-align:center; vertical-align:middle;">
      <img src="readme-assets/2-1-2_sidebar.png" alt="사이드바 이미지" style="max-width:100%; max-height:100%; display:block;">
    </td>
    <td style="width:33%; text-align:center; vertical-align:middle;">
      <img src="readme-assets/2-1-3_search.png" alt="사이드바 검색 이미지" style="max-width:100%; max-height:100%; display:block;">
    </td>
  </tr>
  <tr>
    <th>지도</th>
    <th>사이드바</th>
    <th>사이드바 - 검색</th>
  </tr>
  <tr>
    <td>
      - 카카오맵 API로 지도 서비스 제공<br>
      - 마커를 클릭 시 식당 기본 정보 확인 가능
    </td>
    <td>
      - 검색<br>
      - 즐겨찾기 목록<br>
      - 오늘의 중계 일정 목록<br>
      - 식당 상세정보 확인
    </td>
    <td>
      - 필터링 : 식당 이름, 지역, 경기(종목, 리그)<br>
      - 정렬 : 거리순, 날짜순<br>
      - 클릭 시 상세 정보 확인 및 지도 중심 이동
    </td>
  </tr>

  <tr>
    <td align="center" valign="middle">
      <img src="readme-assets/2-1-4_storeDetail.png" alt="사이드바 상세보기 이미지" style="max-width:100%; max-height:100%; display:block;">
    </td>
    <td width="400" align="center" valign="middle">
      <img src="readme-assets/2-1-5_mypage.png" alt="마이페이지 이미지" style="max-width:100%; max-height:100%; display:block;">
    </td>
    <td width="400" align="center" valign="middle">
      <img src="readme-assets/2-1-6_stores.png" alt="식당 관리 이미지" style="max-width:100%; max-height:100%; display:block;">
    </td>
  </tr>
  <tr>
    <th>사이드바 - 식당 상세 정보</th>
    <th>마이페이지</th>
    <th>마이페이지 - 식당 관리</th>
  </tr>
  <tr>
    <td>
      - 지도 마커 또는 검색 결과 클릭 시 진입<br>
      - 기본 정보 : 업종, 위치, 영업 시간 등<br>
      - 상세 정보 : 메뉴, 사진, 중계 일정 등
    </td>
    <td>
      - 로그인 시 접근 가능<br>
      - 즐겨찾기 : 목록 조회, 삭제<br>
      - 내 정보 : 이메일, 이름 등 개인 정보 조회<br>
      - 식당 관리 : 식당/중계 일정의 목록 조회, 등록, 수정, 삭제
    </td>
    <td>
      - 우측 하단의 (+) 버튼으로 새로운 식당 등록<br>
      - 기존에 등록한 식당 관리 가능 : 중계 일정 관리, 식당 수정/삭제
    </td>
  </tr>

  <tr>
    <td width="400" align="center" valign="middle">
      <img src="readme-assets/2-1-7_createStore.png" alt="식당 등록 이미지" style="max-width:100%; max-height:100%; display:block;">
    </td>
    <td align="center" valign="middle">
      <img src="readme-assets/2-1-8_broadcasts.png" alt="중계 일정 관리 이미지" style="max-width:100%; max-height:100%; display:block;">
    </td>
    <td align="center" valign="middle">
      <img src="readme-assets/2-1-9_createUpdateBroadcast.png" alt="중계 일정  등록, 수정 이미지" style="max-width:100%; max-height:100%; display:block;">
    </td>
  </tr>
  <tr>
    <th>마이페이지 - 식당 등록/수정</th>
    <th>마이페이지 - 중계 일정 관리</th>
    <th>마이페이지 - 중계 일정 등록/수정</th>
  </tr>
  <tr>
    <td>
      - 등록 시 입력 정보 : 가게명, 사업자등록번호, 주소, 전화번호, 영업시간, 업종, 메뉴, (소개), 사진<br>
      - 사업자등록번호, 주소 : 유효성 검사 진행, 존재하지 않는 정보를 입력할 수 없음<br>
      - 수정 시 기존 입력값 자동 불러오기
    </td>
    <td>
      - 탭리스트 : 날짜별 중계 정보 확인 가능<br>
      - 캘린더 : 한눈에 중계 일정 확인 가능
    </td>
    <td>
      - 등록 시 입력 정보 : 날짜, 시간, 종목, 리그, (팀, 기타)<br>
      - 수정 시 기존 입력값 자동 불러오기
    </td>
  </tr>
</table>

# 🛠️ 3. 기술 스택 및 아키텍처
## 3.1 기술 스택
<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th>프론트엔드</th>
    <th>백엔드</th>
    <th>주요 컴포넌트 및 서비스</th>
  </tr>
  <tr>
    <td>
      - 언어 : TypeScript<br>
      - 프레임워크 : React<br>
      - 상태 관리 : Zustand<br>
      - 스타일링 : Tailwind CSS
    </td>
    <td>
      - 언어 : TypeScript<br>
      - 서버 : Node.js + Express<br>
      - DB : MySQL<br>
      - ORM : TypeORM
    </td>
    <td>
      - 지도 API : 카카오맵 API<br>
      - 이미지 서버 : AWS S3<br>
      - 성능 테스트 : k6<br>
      - 모니터링 : AWS CloudWatch<br>
      - 캐싱/세션 관리 : Redis<br>
      - 배포 : AWS EC2 Instance
    </td>
  </tr>
</table>

## 3.2 아키텍처
![architecture](readme-assets/3-2_architecture.png)

# 🗂️ 4. ERD & API 명세
## 4.1 ERD
![ERD](readme-assets/4-1_ERD.png)

## 4.2 API 명세
프로젝트의 모든 API 목록은 'backend' 폴더 내 [README 파일](backend/README.md#52-api-명세)에서 상세히 확인할 수 있습니다.<br>
Swagger UI도 지원하며, 백엔드 서버 실행 후 http://localhost:3000/api-docs 에서 전체 명세를 확인할 수 있습니다.

# 💻 5. 서버 실행
프로젝트를 로컬에서 실행하려면 프론트엔드와 백엔드 서버를 각각 실행해야 합니다.<br>
아래는 전체적인 실행 흐름이며, **세부 설정은 각 리드미에서 확인해주세요.**
클론, 설치 등

## 5.1 공통 사전 준비
```bash
git clone https://github.com/Dev-Playce/Playce.git
cd Playce
```

## 5.2 프론트엔드 실행 요약
1. .env 파일 설정
2. 의존성 설치 및 실행
```bash
cd frontend
npm install
npm run dev
```
-> 상세 가이드는 'frontend' 폴더 내 [README 파일](frontend/README.md#️-로컬-개발-환경-세팅)에서 확인

## 5.3 백엔드 실행 요약
1. .env 파일 설정
2. 의존성 설치
3. Redis 서버 연결 확인
4. DB 연결 확인
5. 서버 실행
```bash
cd backend # 새 터미널에서
npm install
npm run dev
```
-> 상세 가이드는 'backend' 폴더 내 [README 파일](backend/README.md#-3-서버-실행)에서 확인

# 🧑‍🤝‍🧑 6. 팀 구성 및 역할분담
* 공동 작업 : 기능 구체화, 피그마 UI 설계, API 명세서 작성
## 6.1 프론트엔드
<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th><a href="https://github.com/sieuns" target="_blank">양시은</th>
    <th><a href="https://github.com/kevinmj12" target="_blank">김민제</th>
    <th><a href="https://github.com/neverleaveualong" target="_blank">심우현</th>
  </tr>
  <tr>
    <td>팀장</td>
    <td>부팀장</td>
    <td>팀원</td>
  </tr>
  <tr>
    <td>
      - 중계 일정 관리<br>
      - 통합 검색 기능<br>
      - 마이페이지
    </td>
    <td>
      - 회원가입/로그인<br>
      - 식당 관련 기능<br>
      - 지도 관련 기능
    </td>
    <td>
      - 즐겨찾기 관련 기능<br>
      - 비밀번호 초기화 관련 기능<br>
      - 중계 일정 관련 부가 기능
    </td>
  </tr>
</table>

## 6.2 백엔드
<table border="1" cellpadding="5" cellspacing="0">
  <tr>
    <th><a href="https://github.com/jo-eunchae" target="_blank">조은채</th>
    <th><a href="https://github.com/hwanga12" target="_blank">황가연</th>
    <th><a href="https://github.com/HwangJieun03" target="_blank">황지은</th>
  </tr>
  <tr>
    <td>팀원</td>
    <td>팀원</td>
    <td>팀원</td>
  </tr>
  <tr>
    <td>
      - 더미데이터 생성<br>
      - 식당 관련 API<br>
      - K6 부하테스트 코드 작성<br>
      - Redis 캐싱
    </td>
    <td>
      - 더미데이터 생성<br>
      - 중계 일정 / 검색 관련 API<br>
      - K6 부하테스트 / Redis 캐싱<br>
      - AWS EC2 배포
    </td>
    <td>
      - DB 셋팅 / S3 이미지 서버<br>
      - 유저 / 즐겨찾기 관련 API<br>
      - K6 부하테스트 / Redis 캐싱
    </td>
  </tr>
</table>

# 📎 7. 프론트엔드/백엔드 상세
기타 상세는 [프론트엔드 README 파일](frontend/README.md), [백엔드 README 파일](backend/README.md)을 참고하세요