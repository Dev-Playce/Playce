import { AppDataSource } from "../data-source";
import { BigRegion } from "../entities/BigRegion";
import { SmallRegion } from "../entities/SmallRegion";
import { Sport } from "../entities/Sport";
import { League } from "../entities/League";
import { BusinessNumber } from "../entities/BusinessNumber";
import { createError } from "../utils/errorUtils";
import { log } from "../utils/logUtils";
import { getCache, setCache } from "../utils/redis";

const DEFAULT_STATICDATA_TTL = 60 * 60; // 1시간 (60초 * 60)

const staticdataService = {
  // 1. 지역 대분류 조회
  getBigRegions: async () => {
    log("지역 대분류 조회 시작");

    // redis 캐시 확인 -> 있으면 리턴
    const cacheKey = "bigRegions:all";
    const cached = await getCache(cacheKey);
    if (cached) {
      log("✅ Redis 캐시 사용:", cacheKey);
      return cached;
    }
    log("❌ Redis 캐시 미발견:", cacheKey);

    // DB 조회
    const repo = AppDataSource.getRepository(BigRegion);
    const bigRegions = await repo.find();

    if (!bigRegions.length) {
      throw createError("해당 지역 대분류를 찾을 수 없습니다.", 404);
    }

    log(`지역 대분류 조회 완료 - ${bigRegions.length}건`);

    // redis 캐시에 저장
    await setCache(cacheKey, bigRegions, DEFAULT_STATICDATA_TTL); // 1시간 TTL 설정
    log("📝 Redis 캐시 저장 완료:", cacheKey);

    return bigRegions;
  },

  // 2. 지역 소분류 조회
  getSmallRegions: async (bigRegionId: number) => {
    log(`지역 소분류 조회 시작 - 대분류 ID: ${bigRegionId}`);

    if (isNaN(bigRegionId)) {
      throw createError("유효하지 않은 대분류 ID입니다.", 400);
    }

    // redis 캐시 확인 -> 있으면 리턴
    const cacheKey = `smallRegions:${bigRegionId}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      log("✅ Redis 캐시 사용:", cacheKey);
      return cached;
    }
    log("❌ Redis 캐시 미발견:", cacheKey);

    // DB 조회
    const repo = AppDataSource.getRepository(SmallRegion);
    const smallRegions = await repo.find({
      where: { bigRegion: { id: bigRegionId } },
    });

    if (!smallRegions.length) {
      throw createError("해당 대분류의 소분류 지역을 찾을 수 없습니다.", 404);
    }

    log(`지역 소분류 조회 완료 - ${smallRegions.length}건`);

    const result = [
      { id: 0, name: "전체", big_region_id: bigRegionId },
      ...smallRegions.map((region) => ({
        id: region.id,
        name: region.name,
        big_region_id: bigRegionId,
      })),
    ];

    // redis 캐시에 저장
    await setCache(cacheKey, result, DEFAULT_STATICDATA_TTL); // 1시간 TTL 설정
    log("📝 Redis 캐시 저장 완료:", cacheKey);

    return result;
  },

  // 3. 종목 전체 조회
  getSports: async () => {
    log("종목 목록 조회 시작");

    // redis 캐시 확인 -> 있으면 리턴
    const CACHE_KEY = 'sports:all';
    const cached = await getCache(CACHE_KEY);

    if (cached) {
      log('Redis 캐시에서 종목 목록 조회 완료');
      return cached;
    }

    // DB 조회
    const repo = AppDataSource.getRepository(Sport);
    const sports = await repo.find();

    if (!sports.length) {
      throw createError("해당 종목을 찾을 수 없습니다.", 404);
    }

    // redis 캐시에 저장
    await setCache(CACHE_KEY, sports, DEFAULT_STATICDATA_TTL); // 1시간 TTL 설정

    log(`DB에서 종목 목록 조회 완료 - ${sports.length}건`);
    return sports;
  },

  // 4. 종목 ID 기준 리그 목록 조회
  getLeaguesBySport: async (sportId: number) => {
    log(`리그 목록 조회 시작 - 종목 ID: ${sportId}`);

    if (isNaN(sportId)) {
      throw createError("유효하지 않은 종목 ID입니다.", 400);
    }

    // redis 캐시 확인 -> 있으면 리턴
    const CACHE_KEY = `leagues:${sportId}`;
    const cached = await getCache(CACHE_KEY);

    if (cached) {
      log('Redis 캐시에서 리그 목록 조회 완료');
      return cached;
    }

    // DB 조회
    const repo = AppDataSource.getRepository(League);
    const leagues = await repo.find({
      where: { sport: { id: sportId } },
    });

    if (!leagues.length) {
      throw createError("해당 종목의 리그를 찾을 수 없습니다.", 404);
    }

    const responseData = [
      { id: 0, name: "전체", sport_id: sportId },
      ...leagues.map((league) => ({
        id: league.id,
        name: league.name,
        sport_id: sportId,
      })),
    ];

    // redis 캐시에 저장
    await setCache(CACHE_KEY, responseData, DEFAULT_STATICDATA_TTL); // 1시간 TTL 설정

    log(`DB에서 리그 목록 조회 완료 - ${responseData.length}건`);
    return responseData;
  },

  // 5. 사업자등록번호 조회
  getBusinessNumbers: async () => {
    log("사업자등록번호 조회 시작");

    // redis 캐시 확인 -> 있으면 리턴
    const cacheKey = "businessNumbers:all";
    const cached = await getCache(cacheKey);
    if (cached) {
      log("✅ Redis 캐시 사용:", cacheKey);
      return cached;
    }
    log("❌ Redis 캐시 미발견:", cacheKey);

    // DB 조회
    const repo = AppDataSource.getRepository(BusinessNumber);
    const BusinessNumbers = await repo.find();

    if (!BusinessNumbers.length) {
      throw createError("사업자등록번호를 찾을 수 없습니다.", 404);
    }

    log(`사업자등록번호 조회 완료 - ${BusinessNumbers.length}건`);

    await setCache(cacheKey, BusinessNumbers, DEFAULT_STATICDATA_TTL); // 1시간 TTL 설정
    log("📝 Redis 캐시 저장 완료:", cacheKey);

    return BusinessNumbers;
  },
};

export default staticdataService;
