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

export interface PasswordResetRequestProps {
  email: string;
}
export const passwordResetRequest = (data: PasswordResetRequestProps) => {
  return requestHandler("post", "/users/reset", data);
};

export interface PasswordResetProps {
  token: string;
  newPassword: string;
}
export const passwordReset = (data: PasswordResetProps) => {
  return requestHandler("patch", `/users/reset/${data.token}`, {
    newPassword: data.newPassword,
  });
};
