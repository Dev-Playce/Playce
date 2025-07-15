import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import userService from "../service/userService";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { fail } from "../utils/response";
import { getCache } from "../utils/redis";

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
  console.log("[Auth] Authorization header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("❌ 인증 실패: 토큰 없음 또는 형식 불일치");
    return fail(res, "잘못된 인증 형식입니다.", 401);
  }

  const token = authHeader.split(" ")[1];
  console.log("[Auth] Extracted token:", token);

  try {
    // 토큰 유효성 검사
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY as string) as {
      userId: number;
    };
    console.log("[Auth] JWT 디코딩 결과:", decoded);

    // Redis에 토큰 존재 여부 확인 (유효한 세션인지)
    const redisKey = `login:token:${token}`;
    const storedUserId = await getCache(redisKey);
    console.log(`[Auth] Redis에서 토큰 조회된 userId:`, storedUserId);

    if (!storedUserId) {
      console.error("❌ Redis에 토큰 저장값이 없음");
      return fail(res, "유효하지 않은 토큰입니다.", 401);
    }
    // 수정: storedUserId를 문자열로 변환 후 비교
    if (storedUserId.toString() !== decoded.userId.toString()) {
      console.error(`❌ Redis 저장 userId(${storedUserId})와 토큰 userId(${decoded.userId}) 불일치`);
      return fail(res, "유효하지 않은 토큰입니다.", 401);
    }

    // DB의 users.id 확인
    const user = await userRepository.findOneBy({ id: decoded.userId });
    if (!user) {
      console.error("❌ 해당 userId로 사용자를 찾을 수 없음");
      return fail(res, "사용자를 찾을 수 없습니다.", 404);
    }

    // 유효성 검사 통과 -> req 객체에 유저 추가
    req.user = { userId: decoded.userId };
    console.log("[Auth] 인증 성공, userId:", decoded.userId);
    next();
  } catch (err) {
    console.error("❌ 인증 중 예외 발생:", err);
    return fail(res, "유효하지 않은 토큰입니다.", 401);
  }
};

export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  console.log("[OptionalAuth] Authorization header:", authHeader);

  if (!authHeader) {
    console.log("[OptionalAuth] 토큰 없음, 다음 미들웨어로 넘어감");
    return next(); // 토큰이 없으면 그냥 통과
  }

  const token = authHeader.split(" ")[1];
  console.log("[OptionalAuth] Extracted token:", token);

  try {
    // 토큰 유효성 검사
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY as string) as {
      userId: number;
    };
    console.log("[OptionalAuth] JWT 디코딩 결과:", decoded);

    // Redis에 토큰 존재 여부 확인
    const redisKey = `login:token:${token}`;
    const storedUserId = await getCache(redisKey);
    console.log(`[OptionalAuth] Redis에서 토큰 조회: ${storedUserId}`);

    // 수정: storedUserId 문자열 변환 비교
    if (!storedUserId || storedUserId.toString() !== decoded.userId.toString()) {
      console.log("[OptionalAuth] Redis 토큰 유효하지 않음, 인증정보 없이 통과");
      return next();
    }

    // DB의 users.id 확인
    const user = await userService.getMyInfo(decoded.userId);
    if (user) {
      req.user = { userId: decoded.userId };
      console.log("[OptionalAuth] 사용자 정보 조회 성공, req.user 설정");
    }

    next();
  } catch (err) {
    console.error("[OptionalAuth] 인증 중 예외 발생:", err);
    next();
  }
};
