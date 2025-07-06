import axios, { type AxiosRequestConfig } from "axios";
import { getToken, removeToken } from "../stores/authStore";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const DEFAULT_TIMEOUT = 30000;

export const createClient = (config?: AxiosRequestConfig) => {
  const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: DEFAULT_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
      Authorization: getToken() ? `Bearer ${getToken()}` : "",
    },
    withCredentials: true,
    ...config,
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
     console.log("Axios 요청 토큰:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        removeToken();
        // window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export const httpClient = createClient();

export type RequestMethod = "get" | "post" | "put" | "delete";

export const requestHandler = async <T = unknown>(
  method: RequestMethod,
  url: string,
  payload?: T
) => {
  let response;

  switch (method) {
    case "get": {
      const query = payload
        ? `?${new URLSearchParams(payload).toString()}`
        : "";
      response = await httpClient.get(`${url}${query}`);
      // response = await httpClient.get(url);
      break;
    }
    case "post":
      response = await httpClient.post(url, payload);
      break;
    case "put":
      response = await httpClient.put(url, payload);
      break;
    case "delete":
      response = await httpClient.delete(url);
      break;
    default:
      throw new Error("지원하지 않는 메서드입니다.");
  }

  return response.data;
};

export default httpClient;
