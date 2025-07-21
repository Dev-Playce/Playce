import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import favoriteService from "../service/favoriteService";
import { success } from "../utils/response";
import { logApiError } from "../utils/errorUtils";
import { log } from "../utils/logUtils";

const favoriteController = {
  addFavorite: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      log("\n⭐ [즐겨찾기 추가] 요청");
      const userId = req.user!.userId;
      const storeId = parseInt(req.params.store_id);

      const result = await favoriteService.addFavorite(userId, storeId);

      log("✅ [즐겨찾기 추가] 성공");
      return success(res, "즐겨찾기가 추가되었습니다.", result, 201);
    } catch (error: any) {
      logApiError("즐겨찾기 추가", error);
      next(error);
    }
  },

  removeFavorite: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      log("\n⭐ [즐겨찾기 삭제] 요청");
      const userId = req.user!.userId;
      const storeId = parseInt(req.params.store_id);

      const result = await favoriteService.removeFavorite(userId, storeId);

      log("✅ [즐겨찾기 삭제] 성공");
      return success(res, "즐겨찾기가 삭제되었습니다.");
    } catch (error: any) {
      logApiError("즐겨찾기 삭제", error);
      next(error);
    }
  },

  getFavorites: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      log("\n⭐ [즐겨찾기 목록 조회] 요청");
      const userId = req.user!.userId;

      const favorites = await favoriteService.getFavorites(userId);

      log("✅ [즐겨찾기 목록 조회] 성공");
      return success(res, "즐겨찾기 목록 조회 성공", { stores: favorites });
    } catch (error: any) {
      logApiError("즐겨찾기 목록 조회", error);
      next(error);
    }
  },
};

export default favoriteController;
