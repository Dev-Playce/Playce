import { requestHandler } from "./http";

export const getStoreDetail = (storeId: number) =>
  requestHandler("get", `/stores/${storeId}`);

export interface RegisterEditStoreProps {
  store_name: string;
  address: string;
  phone: string;
  opening_hours: string;
  menus: string;
  type: string;
  images: string[];
  description: string;
}

export const registerStore = (data: RegisterEditStoreProps) => {
  return requestHandler("post", "/stores", data);
};

export const editStore = (data: RegisterEditStoreProps, storeId: number) => {
  return requestHandler("patch", `/stores/${storeId}`, data);
};
