import { Request, Response, NextFunction } from "express";
import searchService from "../service/searchService";
import { success } from "../utils/response";
import { logApiError } from "../utils/errorUtils";
import { log } from "../utils/logUtils";

const searchController = {
  // 현재 위치 기반 검색
  getNearbyStores: async (req: Request, res: Response, next: NextFunction) => {
    try {
      log("\n📍 [현재 위치 기반 검색] 요청");

      const { lat, lng, radius } = req.query;

      const result = await searchService.getNearbyStores(
        Number(lat),
        Number(lng),
        Number(radius)
      );

      log("✅ [현재 위치 기반 검색] 성공");

      return success(res, "현재 위치 기반 검색 성공", result);
    } catch (error) {
      logApiError("현재 위치 기반 검색", error);
      next(error);
    }
  },

  // 통합 검색
  searchStores: async (req: Request, res: Response, next: NextFunction) => {
    try {
      log("\n🔍 [통합 검색] 요청");

      // 쿼리 파싱 + 배열 처리
      const parseToArray = (param: any) => {
        if (Array.isArray(param)) return param;
        if (typeof param === "string" && param.length > 0) return [param];
        return [];
      };

      const result = await searchService.searchStores({
        search: String(req.query.search || ''),
        sports: parseToArray(req.query.sports),
        leagues: parseToArray(req.query.leagues),
        team: String(req.query.team || ''),
        big_regions: parseToArray(req.query.big_regions),
        small_regions: parseToArray(req.query.small_regions),
        sort: String(req.query.sort || 'distance') as 'date' | 'name' | 'distance',
      });

      log("✅ [통합 검색] 성공");

      return success(res, "통합 검색 성공", result);
    } catch (error) {
      logApiError("통합 검색", error);
      next(error);
    }
  },
};

export default searchController;
