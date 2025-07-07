import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userService from "../service/userService";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { createError } from "../utils/createError";
import { fail } from "../utils/response";

const userRepository = AppDataSource.getRepository(User);

export interface AuthRequest extends Request {
  user?: { userId: number };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("❌ 인증 실패: 토큰 없음");
    return fail(res, "잘못된 인증 형식입니다.", 401);
  }
  const token = authHeader.split(" ")[1];

  try {
    // 토큰 유효성 검사
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY as string) as {
      userId: number;
    };

    // DB의 users.id 확인
    const user = await userRepository.findOneBy({ id: decoded.userId });
    if (!user) {
      return fail(res, "사용자를 찾을 수 없습니다.", 404);
    }

    // 유효성 검사 통과 -> req 객체에 유저 추가
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    return fail(res, "유효하지 않은 토큰입니다.", 401);
  }
};

export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return next(); // 토큰이 없으면 그냥 통과

  const token = authHeader.split(" ")[1];

  try {
    // 토큰 유효성 검사
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY as string) as {
      userId: number;
    };

    // DB의 users.id 확인
    const user = await userService.getMyInfo(decoded.userId);

    if (user) {
      req.user = { userId: decoded.userId };
    }

    next(); // 토큰 검증 실패, users.id 없어도 -> 통과
  } catch (err) {
    next();
  }
};
