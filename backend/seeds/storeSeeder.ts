import { AppDataSource } from "../src/data-source";
import { Store } from "../src/entities/Store";
import { StoreImage } from "../src/entities/StoreImage";

const stores = [
  {
    user: { id: 1 },
    storeName: "교촌치킨 서울시청점",
    businessNumber: { id: 1 },
    address: "서울 중구 세종대로18길 6 1-2층",
    bigRegion: { id: 1 },
    smallRegion: { id: 24 },
    lat: 37.5637251812787,
    lng: 126.977440016914,
    phone: "000-111-1234",
    openingHours: "매일 12:00 ~ 24:00",
    menus: "교촌 오리지날",
    type: "치킨",
    description: undefined,
  },
  {
    user: { id: 2 },
    storeName: "무교동 북어국집",
    businessNumber: { id: 2 },
    address: "서울특별시 중구 무교로 19",
    bigRegion: { id: 1 },
    smallRegion: { id: 24 },
    lat: 37.566295,
    lng: 126.977945,
    phone: "02-777-1234",
    openingHours: "매일 08:00 ~ 21:00",
    menus: "북어국, 공기밥",
    type: "한식",
    description: "서울 시청 근처에서 유명한 해장국 맛집. 진하고 깔끔한 국물이 특징",
  },
  {
    user: { id: 4 },
    storeName: "서울시청점 김밥천국",
    businessNumber: { id: 3 },
    address: "서울특별시 중구 세종대로 18길 6",
    bigRegion: { id: 1 },
    smallRegion: { id: 24 },
    lat: 37.566295,
    lng: 126.977945,
    phone: "02-123-4567",
    openingHours: "매일 08:00 ~ 21:00",
    menus: "북어국, 공기밥",
    type: "한식",
    description: "서울 시청 근처에서 유명한 해장국 맛집. 진하고 깔끔한 국물이 특징",
  },
];

const storeImages = [
  {
    store: { id: 1 },
    imgUrl: "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/a-plate-of-food-KOK0p9rBCmA",
    isMain: true,
  },
  {
    store: { id: 1 },
    imgUrl: "https://unsplash.com/ko/%EC%82%AC%EC%A7%84/%ED%9D%B0%EC%83%89-%EC%84%B8%EB%9D%BC%EB%AF%B9-%EC%A0%91%EC%8B%9C%EC%97%90-%EA%B5%AC%EC%9A%B4-%EB%8B%AD%EA%B3%A0%EA%B8%B0-4qJlXK4mYzU",
    isMain: false,
  },
  {
    store: { id: 2 },
    imgUrl: "https://unsplash.com/ko/%EC%9D%BC%EB%9F%AC%EC%8A%A4%ED%8A%B8/%ED%8C%8C%EB%9E%80-%EB%88%88%EC%9D%84-%EA%B0%80%EC%A7%84-%EB%85%B8%EB%9E%80-%EC%83%9D%EB%AC%BC%EC%9D%98-%EA%B7%B8%EB%A6%BC-z7wBtlhHfYs",
    isMain: true,
  },
];

export const seedStores = async () => {
  const storeRepo = AppDataSource.getRepository(Store);
  for (const item of stores) {
    const store = storeRepo.create(item);
    await storeRepo.save(store);
  }
  console.log("✅ 식당 시드 완료");

  const storeImageRepo = AppDataSource.getRepository(StoreImage);
  for (const item of storeImages) {
    const storeImage = storeImageRepo.create(item);
    await storeImageRepo.save(storeImage);
  }
  console.log("✅ 식당 이미지 시드 완료");
};
