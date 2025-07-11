import { AppDataSource } from "../src/data-source";

const stores = [
  {
    userId: 1,
    storeName: "교촌치킨 서울시청점",
    businessNumberId: 1,
    address: "서울 중구 세종대로18길 6 1-2층",
    bigRegionId: 1,
    smallRegionId: 24,
    lng: 126.977440016914,
    lat: 37.5637251812787,
    phone: "000-111-1234",
    openingHours: "매일 12:00 ~ 24:00",
    menus: [
      { name: "교촌 오리지날", price: "16000" },
      { name: "교촌 허니", price: "17000" },
      { name: "교촌 레드윙", price: "18000" },
    ],
    type: "치킨",
    description: null,
  },
  {
    userId: 2,
    storeName: "무교동 북어국집",
    businessNumberId: 2,
    address: "서울 중구 무교로 19",
    bigRegionId: 1,
    smallRegionId: 24,
    lat: 37.566295,
    lng: 126.977945,
    phone: "02-777-1234",
    openingHours: "매일 08:00 ~ 21:00",
    menus: [
      { name: "북어국", price: "9000" },
      { name: "공기밥", price: "1000" },
    ],
    type: "한식",
    description:
      "서울 시청 근처에서 유명한 해장국 맛집. 진하고 깔끔한 국물이 특징",
  },
  {
    userId: 4,
    storeName: "서울시청점 김밥천국",
    businessNumberId: 3,
    address: "서울 중구 세종대로 18길 6",
    bigRegionId: 1,
    smallRegionId: 24,
    lat: 37.566295,
    lng: 126.977945,
    phone: "02-123-4567",
    openingHours: "매일 08:00 ~ 21:00",
    menus: [
      { name: "김밥", price: "3000" },
      { name: "라면", price: "4500" },
      { name: "돈까스", price: "8000" },
      { name: "쫄면", price: "6500" },
    ],
    type: "한식",
    description: "간단하고 저렴하게 식사하기 좋은 김밥천국",
  },
  {
    userId: 3,
    storeName: "하늘포차",
    businessNumberId: 4,
    address: "광주 동구 중앙로160번길 23-4 9층",
    bigRegionId: 5,
    smallRegionId: 63,
    lat: 35.1470280581948,
    lng: 126.915713969115,
    phone: "02-123-4567",
    openingHours: "매일 18:00 ~ 02:00",
    menus: [
      { name: "매운탕", price: "27000" },
      { name: "수육보쌈", price: "2500" },
      { name: "뭉티기", price: "29000" },
      { name: "오겹두부김치", price: "18000" },
    ],
    type: "술집",
    description: "마늘 닭매운탕과 주먹밥의 찰떡궁합",
  },
  {
    userId: 5,
    storeName: "당감쪽갈비",
    businessNumberId: 5,
    address: "부산 부산진구 당감로16번길 40 1층",
    bigRegionId: 2,
    smallRegionId: 32,
    lat: 35.1636081906753,
    lng: 129.04180197768,
    phone: "010-1393-7921",
    openingHours: "매일 16:00 ~ 22:00",
    menus: [
      { name: "쪽갈비", price: "10000" },
      { name: "데리야끼 쪽갈비", price: "11000" },
      { name: "매콤 쪽갈비", price: "11000" },
    ],
    type: "한식",
    description: "매콤쪽갈비와 치즈퐁듀의 환상 궁합",
  },
  {
    userId: 3,
    storeName: "배럴하우스",
    businessNumberId: 6,
    address: "강원 춘천시 우묵길70번길 7 1층",
    bigRegionId: 10,
    smallRegionId: 152,
    lat: 37.866935362425,
    lng: 127.723552867696,
    phone: "010-1391-8243",
    openingHours: "매일 17:00 ~ 00:00",
    menus: [
      { name: "플래터", price: "46000" },
      { name: "크리스피 치킨", price: "24000" },
      { name: "치즈감자튀김", price: "17000" },
    ],
    type: "펍",
    description: "넓은 공간에서 즐기는 다양한 안주와 맛",
  },
  {
    userId: 6,
    storeName: "효자수산",
    businessNumberId: 7,
    address: "전북 전주시 완산구 전주객사2길 10",
    bigRegionId: 13,
    smallRegionId: 195,
    lat: 35.8173730606522,
    lng: 127.141438512667,
    phone: "010-1391-8243",
    openingHours: "매일 16:30 ~ 03:00",
    menus: [
      { name: "모듬회", price: "53000" },
      { name: "통오징어보쌈", price: "38000" },
      { name: "활고등어회", price: "53000" },
    ],
    type: "생선회",
    description: "맛있는 모듬회로 입맛 돋우기",
  },
  {
    userId: 7,
    storeName: "동백",
    businessNumberId: 8,
    address: "경남 김해시 가야로 514 1층",
    bigRegionId: 16,
    smallRegionId: 245,
    lat: 35.2363487416578,
    lng: 128.888978986413,
    phone: "010-1467-0368",
    openingHours: "매일 11:00 ~ 21:00",
    menus: [
      { name: "볶음밥", price: "8000" },
      { name: "해물짬뽕", price: "10000" },
      { name: "짜장면", price: "7000" },
    ],
    type: "중식",
    description: "간짜장이 맛있는집",
  },
  {
    userId: 2,
    storeName: "강릉조개마을",
    businessNumberId: 10,
    address: "강원 강릉시 하슬라로192번길 1 조개마을",
    bigRegionId: 10,
    smallRegionId: 140,
    lat: 37.7670425472483,
    lng: 128.875781878031,
    phone: "010-1338-4700",
    openingHours: "매일 16:00 ~ 03:00",
    menus: [
      { name: "4단조개찜", price: "65000" },
      { name: "무한리필", price: "38000" },
    ],
    type: "조개요리",
    description: "신선한 조개구이와 품질 좋은 무한리필",
  },
  {
    userId: 7,
    storeName: "운정소곱창",
    businessNumberId: 11,
    address: "경기 파주시 산내로104번길 5-23 1층",
    bigRegionId: 9,
    smallRegionId: 135,
    lat: 37.7271291011688,
    lng: 126.736663650376,
    phone: "010-1317-9272",
    openingHours: "매일 16:00 ~ 02:00",
    menus: [
      { name: "한우생소곱창", price: "22000" },
      { name: "냉장생갈비살", price: "19000" },
      { name: "한우대창", price: "22000" },
    ],
    type: "곱창",
    description: "맛있는 곱창과 푸짐한 가격의 조화",
  },
  {
    userId: 9,
    storeName: "호랑이주택",
    businessNumberId: 12,
    address: "인천 남동구 인하로521번길 12 1층",
    bigRegionId: 4,
    smallRegionId: 53,
    lat: 37.4437007329489,
    lng: 126.704868221819,
    phone: "031-710-2821",
    openingHours: "매일 17:00 ~ 04:00",
    menus: [
      { name: "직화뼈구이", price: "24900" },
      { name: "꽃게버터구이", price: "27900" },
      { name: "수육튀김", price: "19900" },
    ],
    type: "한식",
    description: "친절한 직원과 함께하는 즐거움",
  },
  {
    userId: 1,
    storeName: "레코드피자 상암점",
    businessNumberId: 13,
    address: "서울 마포구 월드컵북로44길 76-3 1, 2층",
    bigRegionId: 1,
    smallRegionId: 13,
    lat: 37.5778254765589,
    lng: 126.893715304022,
    phone: "031-1393-6544",
    openingHours: "매일 16:00 ~ 03:00",
    menus: [
      { name: "시그니처피자", price: "24900" },
      { name: "케이준포테이토", price: "7000" },
      { name: "윙세트", price: "19900" },
    ],
    type: "피자",
    description: "피자 맛집",
  },
  {
    userId: 4,
    storeName: "낭만참치 논산 본점",
    businessNumberId: 14,
    address: "충남 논산시 시민로132번길 52-22",
    bigRegionId: 12,
    smallRegionId: 172,
    lat: 36.1796686419472,
    lng: 127.107107211365,
    phone: "031-1382-0375",
    openingHours: "매일 15:00 ~ 23:00",
    menus: [
      { name: "랍스타셋트", price: "98000" },
      { name: "방어회", price: "50000" },
      { name: "연어스테이크", price: "14000" },
    ],
    type: "생선회",
    description: "쾌적한 식사를 위해 별관 확장 오픈",
  },
  {
    userId: 10,
    storeName: "미깡밭한우집",
    businessNumberId: 15,
    address: "제주 서귀포시 호근동 630-2",
    bigRegionId: 17,
    smallRegionId: 260,
    lat: 33.256856299391,
    lng: 126.533900911598,
    phone: "031-1497-0285",
    openingHours: "매일 11:30 ~ 22:00",
    menus: [
      { name: "갈비살모듬", price: "23000" },
      { name: "채끝등심", price: "25000" },
      { name: "살치살", price: "30000" },
    ],
    type: "육류",
    description: "제주FC 단골 한우 맛집!",
  },
  {
    userId: 5,
    storeName: "만계화 범어점",
    businessNumberId: 16,
    address: "대구 수성구 범어천로 81 1층",
    bigRegionId: 3,
    smallRegionId: 49,
    lat: 35.854215110097,
    lng: 128.623027206195,
    phone: "031-1497-0285",
    openingHours: "매일 17:00 ~ 24:00",
    menus: [
      { name: "만계화장작구이", price: "20000" },
      { name: "순살치킨", price: "19000" },
      { name: "부추닭전골", price: "000" },
    ],
    type: "육류",
    description: "맛있는 메뉴와 부드러운 닭의 조화",
  },
];

const storeImages = [
  {
    storeId: 1,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/%EA%B5%90%EC%B4%8C1.webp",
    isMain: true,
  },
  {
    storeId: 1,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/%EA%B5%90%EC%B4%8C2.webp",
    isMain: false,
  },
  {
    storeId: 2,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/%EB%B6%81%EC%96%B41.webp",
    isMain: true,
  },
  {
    storeId: 3,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/3.jpg",
    isMain: true,
  },
  {
    storeId: 4,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/4.jpg",
    isMain: true,
  },
  {
    storeId: 5,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/5.jpg",
    isMain: true,
  },
  {
    storeId: 6,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/6.jpg",
    isMain: true,
  },
  {
    storeId: 7,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/7.jpg",
    isMain: true,
  },
  {
    storeId: 8,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/8.jpg",
    isMain: true,
  },
  {
    storeId: 9,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/9.jpg",
    isMain: true,
  },
  {
    storeId: 10,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/10.jpg",
    isMain: true,
  },
  {
    storeId: 11,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/11.jpg",
    isMain: true,
  },
  {
    storeId: 12,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/12.jpg",
    isMain: true,
  },
  {
    storeId: 13,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/13.jpg",
    isMain: true,
  },
  {
    storeId: 14,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/14.jpg",
    isMain: true,
  },
  {
    storeId: 15,
    imgUrl:
      "https://playce-bucket.s3.ap-northeast-2.amazonaws.com/images/15.jpg",
    isMain: true,
  },
];

export const seedStores = async () => {
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    for (const s of stores) {
      await queryRunner.query(
        `
        INSERT INTO stores
          (store_name, address, lat, lng, phone, opening_hours, menus, type, description, user_id, business_number_id, big_region_id, small_region_id)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          s.storeName,
          s.address,
          s.lat,
          s.lng,
          s.phone,
          s.openingHours,
          JSON.stringify(s.menus),
          s.type,
          s.description,
          s.userId,
          s.businessNumberId,
          s.bigRegionId,
          s.smallRegionId,
        ]
      );
    }

    console.log("✅ 식당 시드 완료");

    for (const img of storeImages) {
      await queryRunner.query(
        `
        INSERT INTO stores_images
          (store_id, img_url, is_main)
        VALUES
          (?, ?, ?)
      `,
        [img.storeId, img.imgUrl, img.isMain ? 1 : 0]
      );
    }

    console.log("✅ 식당 이미지 시드 완료");

    await queryRunner.commitTransaction();
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error("❌ 시드 오류:", err);
  } finally {
    await queryRunner.release();
  }
};
