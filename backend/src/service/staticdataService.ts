import { AppDataSource } from "../data-source";
import { BigRegion } from "../entities/BigRegion";
import { SmallRegion } from "../entities/SmallRegion";
import { Sport } from "../entities/Sport";
import { League } from "../entities/League";
import { BusinessNumber } from "../entities/BusinessNumber"
import { createError } from "../utils/errorUtils";
import { log } from "../utils/logUtils";

const staticdataService = {
  // 1. 지역 대분류 조회
  getBigRegions: async () => {
    log("지역 대분류 조회 시작");

    const repo = AppDataSource.getRepository(BigRegion);
    const bigRegions = await repo.find();

    if (!bigRegions.length) {
      throw createError("해당 지역 대분류를 찾을 수 없습니다.", 404);
    }

    log(`지역 대분류 조회 완료 - ${bigRegions.length}건`);
    return bigRegions;
  },

  // 2. 지역 소분류 조회
  getSmallRegions: async (bigRegionId: number) => {
    log(`지역 소분류 조회 시작 - 대분류 ID: ${bigRegionId}`);

    if (isNaN(bigRegionId)) {
      throw createError("유효하지 않은 대분류 ID입니다.", 400);
    }

    const repo = AppDataSource.getRepository(SmallRegion);
    const smallRegions = await repo.find({
      where: { bigRegion: { id: bigRegionId } },
    });

    if (!smallRegions.length) {
      throw createError("해당 대분류의 소분류 지역을 찾을 수 없습니다.", 404);
    }

    log(`지역 소분류 조회 완료 - ${smallRegions.length}건`);
    return [
      { id: 0, name: "전체", big_region_id: bigRegionId },
      ...smallRegions.map((region) => ({
        id: region.id,
        name: region.name,
        big_region_id: bigRegionId,
      })),
    ];
  },

  // 3. 종목 전체 조회
  getSports: async () => {
    log("종목 목록 조회 시작");

    const repo = AppDataSource.getRepository(Sport);
    const sports = await repo.find();

    if (!sports.length) {
      throw createError("해당 종목을 찾을 수 없습니다.", 404);
    }

    log(`종목 목록 조회 완료 - ${sports.length}건`);
    return sports;
  },

  // 4. 종목 ID 기준 리그 목록 조회
  getLeaguesBySport: async (sportId: number) => {
    log(`리그 목록 조회 시작 - 종목 ID: ${sportId}`);

    if (isNaN(sportId)) {
      throw createError("유효하지 않은 종목 ID입니다.", 400);
    }

    const repo = AppDataSource.getRepository(League);
    const leagues = await repo.find({
      where: { sport: { id: sportId } },
    });

    if (!leagues.length) {
      throw createError("해당 종목의 리그를 찾을 수 없습니다.", 404);
    }

    log(`리그 목록 조회 완료 - ${leagues.length}건`);
    return [
      { id: 0, name: "전체", sport_id: sportId },
      ...leagues.map((league) => ({
        id: league.id,
        name: league.name,
        sport_id: sportId,
      })),
    ];
  },

  // 5. 사업자등록번호 조회
  getBusinessNumbers: async () => {
    log("사업자등록번호 조회 시작");

    const repo = AppDataSource.getRepository(BusinessNumber);
    const BusinessNumbers = await repo.find();

    if (!BusinessNumbers.length) {
      throw createError("사업자등록번호를 찾을 수 없습니다.", 404);
    }

    log(`사업자등록번호 조회 완료 - ${BusinessNumbers.length}건`);
    return BusinessNumbers;
  },
};

export default staticdataService;
