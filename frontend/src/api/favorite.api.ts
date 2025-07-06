import { requestHandler } from "./http";

// 즐겨찾기 목록 조회
export const getFavorites = () => requestHandler("get", "/favorites");

// 즐겨찾기 추가 (명세서에 따라 post 또는 get)
export const addFavorite = (store_id: number) =>
  requestHandler("post", `/favorites/${store_id}`);

// 즐겨찾기 삭제
export const removeFavorite = (store_id: number) =>
  requestHandler("delete", `/favorites/${store_id}`);
