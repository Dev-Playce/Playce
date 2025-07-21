export interface UserInfoResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
    name: string;
    nickname: string;
    phone: string;
  };
}
