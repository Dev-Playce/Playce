import { requestHandler } from "./http";

export const getStoreDetail = (storeId: number) =>
  requestHandler("get", `/stores/${storeId}`);

export interface RegisterStoreProps {
  store_name: string;
  business_number: string;
  address: string;
  phone: string;
  opening_hours: string;
  menus: string[];
  type: string;
  images: string[];
  description: string;
}

export interface EditStoreProps {
  store_name: string;
  address: string;
  phone: string;
  opening_hours: string;
  menus: string[];
  type: string;
  images: string[];
  description: string;
}

export const myStores = () => {
  return requestHandler("get", "/stores/mypage");
};

export const registerStore = (data: RegisterStoreProps) => {
  return requestHandler("post", "/stores", data);
};

export const editStore = (data: EditStoreProps, storeId: number) => {
  return requestHandler("patch", `/stores/${storeId}`, data);
};

export const deleteStore = (storeId: number) => {
  return requestHandler("delete", `/stores/${storeId}`);
};
