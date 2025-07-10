import type { AxiosError } from "axios";

export type errorCodeMessage = {
  code: number;
  message: string;
};

export const apiErrorStatusMessage = (
  error: unknown,
  errorList: errorCodeMessage[]
) => {
  const axiosError = error as AxiosError;
  if (axiosError.response) {
    const status = axiosError.response.status;
    const message = errorList.find((item) => item.code === status)?.message;

    console.log(status, message);

    if (message) {
      return message;
    } else {
      return `오류가 발생하였습니다\n${error}`;
    }
  }
};
