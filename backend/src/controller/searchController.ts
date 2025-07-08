import { Request, Response, NextFunction } from "express";
import searchService from "../service/searchService";
import { success } from "../utils/response";
import { logApiError } from "../utils/errorHandler";

const searchController = {
  // 1. 현재 위치 기반 검색
  getNearbyStores: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("\n📍 [현재 위치 기반 검색] 요청");

      const { lat, lng, radius } = req.query;

      const result = await searchService.getNearbyStores(
        Number(lat),
        Number(lng),
        Number(radius)
      );

      console.log("✅ [현재 위치 기반 검색] 성공");

      return success(res, "현재 위치 기반 검색 성공", result);
    } catch (error) {
      logApiError("현재 위치 기반 검색", error);
      next(error);
    }
  },

  // 2. 통합 검색
  searchStores: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("\n🔍 [통합 검색] 요청");

      const {
        search,
        sport,
        league,
        team,
        big_region,
        small_region,
        // sort,
      } = req.query;

      const result = await searchService.searchStores({
        search: String(search || ''),
        sport: String(sport || ''),
        league: String(league || ''),
        team: String(team || ''),
        big_region: String(big_region || ''),
        small_region: String(small_region || ''),
        // sort: String(sort || '') as 'date' | 'name',
      });

      console.log("✅ [통합 검색] 성공");

      return success(res, "통합 검색 성공", result);
    } catch (error) {
      logApiError("통합 검색", error);
      next(error);
    }
  },
};

export default searchController;
