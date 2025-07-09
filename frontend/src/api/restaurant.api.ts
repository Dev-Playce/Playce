import axios from "axios";
import { requestHandler } from "./http";
import { getToken } from "../stores/authStore";
import type { menu } from "../types/menu";

export const getStoreDetail = (storeId: number) =>
  requestHandler("get", `/stores/${storeId}`);

export interface RegisterStoreProps {
  store_name: string;
  business_number: string;
  address: string;
  phone: string;
  opening_hours: string;
  menus: menu[];
  type: string;
  images: string[];
  description: string;
}

export interface EditStoreProps {
  store_name: string;
  address: string;
  phone: string;
  opening_hours: string;
  menus: menu[];
  type: string;
  images: string[];
  description: string;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

export const myStores = () => {
  return requestHandler("get", "/stores/mypage");
};

export const registerStore = async (data: RegisterStoreProps) => {
  const formData = new FormData();

  formData.append("store_name", data.store_name);
  formData.append("business_number", data.business_number);
  formData.append("address", data.address);
  formData.append("phone", data.phone);
  formData.append("opening_hours", data.opening_hours);
  formData.append("type", data.type);
  formData.append("description", data.description);

  // 메뉴
  formData.append("menus", JSON.stringify(data.menus));

  // 사진
  const fileList = data.images.map((base64, idx) =>
    base64ToFile(base64, `image_${idx}.png`)
  );
  fileList.forEach((image) => {
    formData.append("images", image);
  });

  const res = await axios.post(`${BASE_URL}/stores`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res;
};

export const editStore = async (data: EditStoreProps, storeId: number) => {
  const formData = new FormData();

  formData.append("store_name", data.store_name);
  formData.append("address", data.address);
  formData.append("phone", data.phone);
  formData.append("opening_hours", data.opening_hours);
  formData.append("type", data.type);
  formData.append("description", data.description);

  // 메뉴
  formData.append("menus", JSON.stringify(data.menus));

  // 사진 - 기존 이미지(URL)은 변환 X, 새로 등록한 파일만 변환

  // 새로운 이미지 base64
  const base64Images = data.images.filter((img) =>
    img.startsWith("data:image/")
  );
  // 이미 업로드된 이미지
  const existingImageUrls = data.images.filter((img) =>
    img.startsWith("https://")
  );
  const newImageUrls = base64Images.map((base64, idx) =>
    base64ToFile(base64, `image_${idx}.png`)
  );

  console.log(newImageUrls);
  console.log(existingImageUrls);
  console.log(JSON.stringify(existingImageUrls));

  newImageUrls.forEach((image) => {
    formData.append("images", image);
  });
  // formData.append("img_urls", JSON.stringify(existingImageUrls)); // 서버에서 기존 이미지 유지 처리
  existingImageUrls.forEach((url) => {
    formData.append("img_urls", url); // 서버에서 기존 이미지 유지 처리
  });

  const res = await axios.patch(`${BASE_URL}/stores/${storeId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res;
};

export const deleteStore = (storeId: number) => {
  return requestHandler("delete", `/stores/${storeId}`);
};
