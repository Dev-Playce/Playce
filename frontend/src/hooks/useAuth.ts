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
      alert(`Error: ${error} 로그인에 실패했습니다.`);
    }
  };

  const userLogout = async () => {
    try {
      storeLogout();
      alert("로그아웃이 완료되었습니다.");
    } catch (error) {
      alert(`Error: ${error}로그아웃에 실패하였습니다.`);
    }
  };

  const userSignup = async (data: SignupProps) => {
    try {
      await signup(data);
      alert("회원가입이 완료되었습니다.");
      setIsSignupModalOpen(false);
    } catch (error) {
      alert(`Error: ${error}\n회원가입에 실패했습니다.`);
    }
  };

  // 비밀번호 초기화 요청
  const userPasswordResetRequest = async (data: PasswordResetRequestProps) => {
    try {
      await passwordResetRequest(data);
      alert("비밀번호 재설정 메일이 전송되었습니다.");
    } catch (error) {
      alert(`Error : ${error} \n 비밀번호 초기화 요청에 실패했습니다.`);
    }
  };

  // 비밀번호 재설정
  const userPasswordReset = async (data: PasswordResetProps) => {
    try {
      await passwordReset(data);
    } catch (error) {
      alert(`Error : ${error}\n 비밀번호 변경에 실패했습니다.`);
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
