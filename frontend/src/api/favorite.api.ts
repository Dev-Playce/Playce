import { requestHandler } from "./http";

export const getFavorites = () => requestHandler("get", "/favorites");

export const addFavorite = (store_id: number) =>
  requestHandler("post", `/favorites/${store_id}`);

export const removeFavorite = (store_id: number) =>
  requestHandler("delete", `/favorites/${store_id}`);
