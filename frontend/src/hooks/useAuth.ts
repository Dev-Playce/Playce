import {
  login,
  signup,
  type LoginProps,
  type SignupProps,
  passwordResetRequest,
  passwordReset,
  type PasswordResetRequestProps,
  type PasswordResetProps,
} from "../api/auth.api";
import useAuthStore from "../stores/authStore";
import { apiErrorStatusMessage } from "../utils/apiErrorStatusMessage";

export const useAuth = () => {
  const { storeLogin, storeLogout, setIsLoginModalOpen, setIsSignupModalOpen } =
    useAuthStore();

  const userLogin = async (data: LoginProps) => {
    try {
      const res = await login(data);
      storeLogin(res.data.token);
      alert("로그인이 완료되었습니다.");
      setIsLoginModalOpen(false);
    } catch (error) {
      const errorList = [
        { code: 400, message: "아이디 또는 비밀번호가 유효하지 않습니다" },
        { code: 401, message: "아이디 또는 비밀번호가 일치하지 않습니다" },
      ];
      const message = apiErrorStatusMessage(error, errorList);
      alert(message);
    }
  };

  const userLogout = async () => {
    try {
      storeLogout();
      alert("로그아웃이 완료되었습니다.");
    } catch (error) {
      alert(`${error}\n로그아웃에 실패하였습니다`);
    }
  };

  const userSignup = async (data: SignupProps) => {
    try {
      await signup(data);
      alert("회원가입이 완료되었습니다.");
      setIsSignupModalOpen(false);
    } catch (error) {
      const errorList = [
        { code: 400, message: "입력값이 유효하지 않습니다" },
        { code: 409, message: "중복된 이메일 또는 전화번호입니다" },
      ];
      const message = apiErrorStatusMessage(error, errorList);
      alert(message);
    }
  };

  // 비밀번호 초기화 요청
  const userPasswordResetRequest = async (data: PasswordResetRequestProps) => {
    try {
      await passwordResetRequest(data);
      alert("비밀번호 재설정 메일이 전송되었습니다.");
    } catch (error) {
      const errorList = [
        { code: 400, message: "입력값이 유효하지 않습니다" },
        { code: 404, message: "이메일이 존재하지 않습니다" },
      ];
      const message = apiErrorStatusMessage(error, errorList);
      alert(message);
    }
  };

  // 비밀번호 재설정
  const userPasswordReset = async (data: PasswordResetProps) => {
    try {
      await passwordReset(data);
    } catch (error) {
      const errorList = [
        { code: 400, message: "입력값이 유효하지 않습니다" },
        {
          code: 401,
          message: "유효하지 않거나 만료되었습니다. 다시 시도해 주세요",
        },
      ];
      const message = apiErrorStatusMessage(error, errorList);
      alert(message);
    }
  };

  return {
    userLogin,
    userLogout,
    userSignup,
    userPasswordResetRequest,
    userPasswordReset,
  };
};
