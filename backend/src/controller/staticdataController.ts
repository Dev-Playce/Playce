import { Request, Response, NextFunction } from "express";
import staticdataService from "../service/staticdataService";
import { success } from "../utils/response";
import { logApiError } from "../utils/errorHandler"; 

const staticdataController = {
  getBigRegions: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("\n📍 [지역 대분류 조회] 요청");
      const data = await staticdataService.getBigRegions();
      console.log("✅ [지역 대분류 조회] 성공");
      return success(res, "지역 대분류 조회 성공", data);
    } catch (error) {
      logApiError("지역 대분류 조회", error);
      next(error);
    }
  },

  getSmallRegions: async (req: Request, res: Response, next: NextFunction) => {
    const bigRegionId = parseInt(req.params.big_region_id);
    try {
      console.log(`\n📍 [지역 소분류 조회] 요청 - 대분류 ID: ${bigRegionId}`);
      const data = await staticdataService.getSmallRegions(bigRegionId);
      console.log("✅ [지역 소분류 조회] 성공");
      return success(res, "지역 소분류 조회 성공", data);
    } catch (error) {
      logApiError("지역 소분류 조회", error);
      next(error);
    }
  },

  getSports: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("\n🏅 [종목 목록 조회] 요청");
      const data = await staticdataService.getSports();
      console.log("✅ [종목 목록 조회] 성공");
      return success(res, "종목 조회 성공", data);
    } catch (error) {
      logApiError("종목 목록 조회", error);
      next(error);
    }
  },

  getLeagues: async (req: Request, res: Response, next: NextFunction) => {
    const sportId = parseInt(req.params.sport_id);
    try {
      console.log(`\n🥇 [리그 목록 조회] 요청 - 종목 ID: ${sportId}`);
      const data = await staticdataService.getLeaguesBySport(sportId);
      console.log("✅ [리그 목록 조회] 성공");
      return success(res, "리그 조회 성공", data);
    } catch (error) {
      logApiError("리그 목록 조회", error);
      next(error);
    }
  },
};

export default staticdataController;
