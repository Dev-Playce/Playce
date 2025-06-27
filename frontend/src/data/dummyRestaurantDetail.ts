import type { RestaurantDetail } from "../types/restaurant.types";

export const dummyRestaurantDetails: RestaurantDetail[] = [
  {
    id: 1,
    store_name: "리버풀펍 바(BAR)",
    address: "서울 중구 북창동",
    phone: "0507-1332-4885",
    opening_hours: "매일 18:00 ~ 03:00",
    menus: ["피자", "치킨", "소시지 플래터", "생맥주 500ml"],
    type: "펍/호프",
    img_list: [
      "https://images.pexels.com/photos/262047/pexels-photo-262047.jpeg?auto=compress&w=400&q=80",
    ],
    description: "리버풀 팬들의 아지트! EPL 빅매치를 생중계합니다.",
    broadcasts: [
      {
        match_date: "2025-07-01",
        match_time: "21:00",
        sport: "축구",
        league: "EPL",
        team_one: "리버풀",
        team_two: "맨체스터 Utd",
        etc: "빅매치",
      },
    ],
  },
  {
    id: 2,
    store_name: "스포츠존 홍대",
    address: "서울 마포구 홍대입구역 근처",
    phone: "02-3456-7890",
    opening_hours: "매일 17:00 ~ 04:00",
    menus: ["버팔로윙", "감자튀김", "수제 맥주", "하이볼"],
    type: "스포츠 바",
    img_list: [
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&w=400&q=80",
    ],
    description: "모든 종목 중계 OK! 대형 스크린과 함께하는 뜨거운 응원",
    broadcasts: [
      {
        match_date: "2025-07-03",
        match_time: "08:00",
        sport: "야구",
        league: "MLB",
        team_one: "LA 다저스",
        team_two: "뉴욕 양키스",
        etc: "류현진 선발 예정",
      },
      {
        match_date: "2025-07-03",
        match_time: "23:00",
        sport: "테니스",
        league: "윔블던",
        team_one: "조코비치",
        team_two: "알카라스",
        etc: "남자 단식 준결승",
      },
    ],
  },
  {
    id: 3,
    store_name: "비어킹 건대점",
    address: "서울 광진구 건대입구역 인근",
    phone: "02-2222-3333",
    opening_hours: "평일 17:00 ~ 02:00 / 주말 17:00 ~ 03:00",
    menus: ["오징어튀김", "모둠안주", "생맥주", "칵테일"],
    type: "펍",
    img_list: [
      "https://images.pexels.com/photos/1267322/pexels-photo-1267322.jpeg?auto=compress&w=400&q=80",
    ],
    description: "축구, 농구, UFC까지! 다같이 보는 짜릿한 순간",
    broadcasts: [
      {
        match_date: "2025-07-05",
        match_time: "13:00",
        sport: "격투기",
        league: "UFC",
        team_one: "정찬성",
        team_two: "맥스 할로웨이",
        etc: "페더급 빅매치",
      },
    ],
  },
  {
    id: 4,
    store_name: "골든골 사커바",
    address: "부산 해운대구",
    phone: "051-555-7777",
    opening_hours: "매일 18:00 ~ 03:00",
    menus: ["나쵸", "핫도그", "버드와이저", "하이네켄"],
    type: "스포츠 바",
    img_list: [
      "https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&w=400&q=80",
    ],
    description: "바다 보며 보는 축구는 또 다른 재미! 외국인 손님도 많아요.",
    broadcasts: [
      {
        match_date: "2025-07-06",
        match_time: "22:00",
        sport: "축구",
        league: "유로 2024",
        team_one: "프랑스",
        team_two: "독일",
        etc: "4강전",
      },
    ],
  },
];
