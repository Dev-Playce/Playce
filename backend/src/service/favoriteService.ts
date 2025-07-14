import { AppDataSource } from "../data-source";
import { Favorite } from "../entities/Favorite";
import { Store } from "../entities/Store";
import { createError } from "../utils/errorUtils";
import { formatDateToKST } from "../utils/dateFormatter";
import { log } from "../utils/logUtils";
import { getCache, setCache, deleteCache } from "../utils/redis";

const favoriteRepository = AppDataSource.getRepository(Favorite);
const storeRepository = AppDataSource.getRepository(Store);

const favoriteService = {
  // 1. 즐겨찾기 추가
  addFavorite: async (userId: number, storeId: number) => {
    log("[Service]즐겨찾기 추가 - userId:", userId, "storeId:", storeId);

    const store = await storeRepository.findOneBy({ id: storeId });
    if (!store) throw createError("해당 식당을 찾을 수 없습니다.", 404);
    log("식당 확인 완료:", store.storeName);

    const existing = await favoriteRepository.findOne({
      where: {
        user: { id: userId },
        store: { id: storeId },
      },
      relations: ["user", "store"],
    });

    if (existing) throw createError("이미 즐겨찾기에 추가된 식당입니다.", 409);

    const newFavorite = favoriteRepository.create({
      user: { id: userId },
      store,
    });
    const saved = await favoriteRepository.save(newFavorite);

    // Redis 캐시 무효화
    const cacheKey = `favorites:user:${userId}`;
    await deleteCache(cacheKey);
    log("Redis 캐시 무효화 완료:", cacheKey);

    log("즐겨찾기 저장 완료 - ID:", saved.id);
    return {
      favorite_id: saved.id,
      store_id: store.id,
      created_at: formatDateToKST(new Date(saved.createdAt)),
    };
  },

  // 2. 즐겨찾기 삭제
  removeFavorite: async (userId: number, storeId: number) => {
    log("[Service]즐겨찾기 삭제 - userId:", userId, "storeId:", storeId);

    const favorite = await favoriteRepository.findOne({
      where: {
        user: { id: userId },
        store: { id: storeId },
      },
      relations: ["user", "store"],
    });

    if (!favorite) {
      throw createError("해당 즐겨찾기 항목이 존재하지 않습니다.", 404);
    }

    await favoriteRepository.remove(favorite);

    // Redis 캐시 무효화
    const cacheKey = `favorites:user:${userId}`;
    await deleteCache(cacheKey);
    log("Redis 캐시 무효화 완료:", cacheKey);

    log("즐겨찾기 삭제 완료");
  },

  // 3. 즐겨찾기 목록 조회
  getFavorites: async (userId: number) => {
    log("[Service]즐겨찾기 목록 조회 - userId:", userId);

    // Redis 캐시 조회
    const cacheKey = `favorites:user:${userId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      log("✅ Redis 캐시 사용:", cacheKey);
      return cached;
    }

    const favorites = await favoriteRepository.find({
      where: { user: { id: userId } },
      relations: ["store", "store.images"],
      order: { createdAt: "ASC" },
    });

    log("즐겨찾기 개수:", favorites.length);

    const result = favorites.map((fav) => {
      const images = fav.store.images || [];
      const mainImage = images.find((img) => img.isMain);

      return {
        store_id: fav.store.id,
        store_name: fav.store.storeName,
        main_img: mainImage?.imgUrl || null,
        address: fav.store.address,
        type: fav.store.type,
        created_at: formatDateToKST(fav.createdAt),
      };
    });

    // Redis 저장 - TTL 300초 (5분)
    await setCache(cacheKey, result);
    // await redisClient.set(cacheKey, JSON.stringify(result), {
    //   EX: 300,
    // });
    log("📝 Redis 캐시 저장 완료:", cacheKey);

    return result;
  },
};

export default favoriteService;