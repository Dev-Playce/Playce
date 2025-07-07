import { NextFunction, Request, Response } from "express";
import userService from "../service/userService";
import { AuthRequest } from "../middlewares/authMiddleware";
import { success } from "../utils/response";
import { logApiError } from "../utils/errorHandler";


const userController = {
  join: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("\n📝 [회원가입] 요청");
      await userService.join(req);
      console.log("✅ [회원가입] 성공");
      return success(res, "회원가입이 완료되었습니다.", undefined, 201);
    } catch (error) {
      logApiError("회원가입", error);
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("\n🔐 [로그인] 요청");
      const token = await userService.login(req);
      console.log("✅ [로그인] 성공");
      return success(res, "로그인이 완료되었습니다.", { token }, 201);
    } catch (error) {
      logApiError("로그인", error);
      next(error);
    }
  },

  requestResetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("\n🔄 [비밀번호 초기화 요청]");
      await userService.requestResetPassword();
      console.log("✅ [비밀번호 초기화 메일 전송] 성공");
      return success(res, "메일이 전송되었습니다.");
    } catch (error) {
      logApiError("비밀번호 초기화 요청", error);
      next(error);
    }
  },

  resetPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("\n🔁 [비밀번호 초기화]");
      await userService.resetPassword();
      console.log("✅ [비밀번호 변경] 성공");
      return success(res, "비밀번호가 변경되었습니다.");
    } catch (error) {
      logApiError("비밀번호 초기화", error);
      next(error);
    }
  },

  getMyInfo: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log("\n👤 [내 정보 조회] 요청");
      const userId = req.user!.userId;

      const userInfo = await userService.getMyInfo(userId);
      console.log("✅ [내 정보 조회] 성공");
      return success(res, "내 정보 조회 성공", userInfo);
    } catch (error) {
      logApiError("내 정보 조회", error);
      next(error);
    }
  },

  updateNickname: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log("\n✏️ [닉네임 변경] 요청");
      const userId = req.user!.userId;
      const { nickname } = req.body;

      await userService.updateNickname(userId, nickname);
      console.log("✅ [닉네임 변경] 성공");
      return success(res, "닉네임이 변경되었습니다.");
    } catch (error) {
      logApiError("닉네임 변경", error);
      next(error);
    }
  },
};

export default userController;
