import { AppDataSource } from "../src/data-source";

const stores = [
  {
    userId: 1,
    storeName: "교촌치킨 서울시청점",
    businessNumberId: 1,
    address: "서울 중구 세종대로18길 6 1-2층",
    bigRegionId: 1,
    smallRegionId: 24,
    lng: 126.977440016914,   // 경도
    lat: 37.5637251812787,    // 위도
    phone: "000-111-1234",
    openingHours: "매일 12:00 ~ 24:00",
    menus: [
      { name: "교촌 오리지날", price: "16000"},
      { name: "교촌 허니", price: "17000"},
      { name: "교촌 레드윙", price: "18000"},
    ],
    type: "치킨",
    description: null,
  },
  {
    userId: 2,
    storeName: "무교동 북어국집",
    businessNumberId: 2,
    address: "서울특별시 중구 무교로 19",
    bigRegionId: 1,
    smallRegionId: 24,
    lng: 126.977945,
    lat: 37.566295,
    phone: "02-777-1234",
    openingHours: "매일 08:00 ~ 21:00",
    menus: [
      { name: "북어국", price: "9000"},
      { name: "공기밥", price: "1000"},
    ],
    type: "한식",
    description: "서울 시청 근처에서 유명한 해장국 맛집. 진하고 깔끔한 국물이 특징",
  },
  {
    userId: 4,
    storeName: "서울시청점 김밥천국",
    businessNumberId: 3,
    address: "서울특별시 중구 세종대로 18길 6",
    bigRegionId: 1,
    smallRegionId: 24,
    lng: 126.977945,
    lat: 37.566295,
    phone: "02-123-4567",
    openingHours: "매일 08:00 ~ 21:00",
    menus: [
      { name: "김밥", price: "3000"},
      { name: "라면", price: "4500"},
      { name: "돈까스", price: "8000"},
      { name: "쫄면", price: "6500"},
    ],
    type: "한식",
    description: "간단하고 저렴하게 식사하기 좋은 김밥천국",
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
          s.menus,
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
