import { requestHandler } from "./http";

export interface LoginProps {
  email: string;
  password: string;
}

export interface SignupProps {
  email: string;
  password: string;
  name: string;
  nickname: string;
  phone: string;
}

export const login = (data: LoginProps) => {
  return requestHandler("post", "/users/login", data);
};

export const signup = (data: SignupProps) => {
  return requestHandler("post", "/users/join", data);
};

// 비밀번호 초기화 요청 (이메일 → 메일 발송)
export interface PasswordResetRequestProps {
  email: string;
}
export const passwordResetRequest = (data: PasswordResetRequestProps) => {
  return requestHandler("post", "/users/reset", data);
};

// 비밀번호 재설정 (토큰+새 비밀번호)
export interface PasswordResetProps {
  token: string;
  newPassword: string;
}
export const passwordReset = (data: PasswordResetProps) => {
  return requestHandler("patch", `/users/reset/${data.token}`, {
    newPassword: data.newPassword,
  });
};
