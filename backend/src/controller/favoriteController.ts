import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import favoriteService from "../service/favoriteService";
import { success } from "../utils/response";
import { logApiError } from "../utils/errorHandler";

const favoriteController = {
  // 1. 즐겨찾기 추가
  addFavorite: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log("\n⭐ [즐겨찾기 추가] 요청");
      const userId = req.user!.userId;
      const storeId = parseInt(req.params.store_id);

      const result = await favoriteService.addFavorite(userId, storeId);

      console.log("✅ [즐겨찾기 추가] 성공");
      return success(res, "즐겨찾기가 추가되었습니다.", result, 201);
    } catch (error: any) {
      logApiError("즐겨찾기 추가", error);
      next(error);
    }
  },

  // 2. 즐겨찾기 삭제
  removeFavorite: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      console.log("\n⭐ [즐겨찾기 삭제] 요청");
      const userId = req.user!.userId;
      const storeId = parseInt(req.params.store_id);

      const result = await favoriteService.removeFavorite(userId, storeId);

      console.log("✅ [즐겨찾기 삭제] 성공");
      return success(res, "즐겨찾기가 삭제되었습니다.");
    } catch (error: any) {
      logApiError("즐겨찾기 삭제", error);
      next(error);
    }
  },

  // 3. 즐겨찾기 목록 조회
  getFavorites: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log("\n⭐ [즐겨찾기 목록 조회] 요청");
      const userId = req.user!.userId;

      const favorites = await favoriteService.getFavorites(userId);

      console.log("✅ [즐겨찾기 목록 조회] 성공");
      return success(res, "즐겨찾기 목록 조회 성공", { stores: favorites });
    } catch (error: any) {
      logApiError("즐겨찾기 목록 조회", error);
      next(error);
    }
  },
};

export default favoriteController;
