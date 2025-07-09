import { Request } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../utils/errorUtils";
import { sendMail } from "../utils/email";
import { log } from "../utils/logUtils";
require("dotenv").config();

const userRepository = AppDataSource.getRepository(User);

const userService = {
  // 1. 회원가입
  join: async (req: Request) => {
    const { email, password, name, nickname, phone } = req.body;

    const existingEmail = await userRepository.findOneBy({ email });
    if (existingEmail) {
      throw createError("이미 존재하는 이메일입니다.", 409);
    }
    log("유효성 검사 완료 - 이메일 중복 없음");

    const formatPhone = (phone: string): string => {
      const onlyDigits = phone.replace(/\D/g, "");
      return onlyDigits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    };

    const formattedPhone = formatPhone(phone);

    const existingPhone = await userRepository.findOneBy({
      phone: formattedPhone,
    });
    if (existingPhone) {
      throw createError("이미 등록된 전화번호입니다.", 409);
    }
    log("유효성 검사 완료 - 전화번호 중복 없음");

    const hashPassword = await bcrypt.hash(password, 10);
    log("비밀번호 해싱 완료");

    const newUser = userRepository.create({
      email,
      password: hashPassword,
      name,
      nickname,
      phone: formattedPhone,
    });

    await userRepository.save(newUser);
    log("[UserService] 회원가입 완료 - email:", email);
  },
  // 2. 로그인
  login: async (req: Request) => {
    const { email, password } = req.body;

    const user = await userRepository.findOneBy({ email });
    if (!user) {
      console.warn("⚠️ 존재하지 않는 사용자");
      throw createError("이메일 또는 비밀번호가 일치하지 않습니다.", 401);
    }
    log("유효성 검사 완료 - 사용자 존재 확인");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.warn("⚠️ 비밀번호 불일치");
      throw createError("이메일 또는 비밀번호가 일치하지 않습니다.", 401);
    }
    log("유효성 검사 완료 - 비밀번호 일치");

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.PRIVATE_KEY as string,
      { expiresIn: "1h" }
    );

    log("[UserService] 로그인 성공 - userId:", user.id);
    return token;
  },
  // 3. 비밀번호 초기화 요청
  requestResetPassword: async (email: string) => {
    log("🔄 [UserService] 비밀번호 초기화 요청 시작");

    const user = await userRepository.findOneBy({ email });
    if (!user) {
      throw createError("해당 사용자를 찾을 수 없습니다.", 404);
    }
    log("✅ 사용자 확인 완료 - 이메일:", email);

    const jwtSecret = process.env.PRIVATE_KEY;
    if (!jwtSecret) {
      throw new Error("JWT 시크릿 키가 설정되지 않았습니다.");
    }

    const token = jwt.sign({ email: user.email }, jwtSecret, {
      expiresIn: "30m",
    });
    log("🔐 비밀번호 초기화 토큰 생성 완료");

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${token}`;
    const html = `
      <p>비밀번호를 재설정하려면 아래 링크를 클릭하세요:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>이 링크는 30분 후 만료됩니다.</p>
    `;

    await sendMail({
      to: email,
      subject: "비밀번호 재설정 요청",
      html,
    });

    log("📩 비밀번호 재설정 이메일 전송 완료 - 수신자:", email);
  },

  // 4. 비밀번호 초기화
  resetPassword: async (resetToken: string, newPassword: string) => {
    log("🔁 [UserService] 비밀번호 초기화 요청");

    const jwtSecret = process.env.PRIVATE_KEY;
    if (!jwtSecret) {
      throw new Error("JWT 시크릿 키가 설정되지 않았습니다.");
    }

    try {
      const decoded = jwt.verify(resetToken, jwtSecret) as { email: string };
      const email = decoded.email;
      log("✅ 토큰 검증 성공 - 이메일:", email);

      const user = await userRepository.findOneBy({ email });
      if (!user) {
        throw createError("해당 사용자를 찾을 수 없습니다.", 404);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userRepository.update({ email }, { password: hashedPassword });

      log("🔐 비밀번호 초기화 완료");
    } catch (err) {
      log("❌ 비밀번호 초기화 실패:", err);
      throw createError("유효하지 않거나 만료된 토큰입니다.", 400);
    }
  },
  // 5. 내 정보 조회
  getMyInfo: async (userId: number) => {
    const user = await userRepository.findOne({
      where: { id: userId },
      select: ["email", "name", "nickname", "phone"],
    });

    console.log("[UserService] 사용자 정보 조회 성공");
    console.log("응답 데이터:", user);
    return user;
  },

  // 6. 닉네임 변경
  updateNickname: async (userId: number, newNickname: string) => {
    await userRepository.update({ id: userId }, { nickname: newNickname });
    log("[UserService] 닉네임 변경 완료 - nickname:", newNickname);
  },
};

export default userService;
