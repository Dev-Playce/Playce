import { create } from "zustand";
import { getFavorites, addFavorite, removeFavorite } from "../api/favorite.api";
import type { RestaurantBasic } from "../types/restaurant.types";

interface FavoriteStoreState {
  favorites: RestaurantBasic[];
  fetchFavorites: () => Promise<void>;
  addFavorite: (store_id: number) => Promise<void>;
  removeFavorite: (store_id: number) => Promise<void>;
}

const useFavoriteStore = create<FavoriteStoreState>((set, get) => ({
  favorites: [],
  fetchFavorites: async () => {
    try {
      const res = await getFavorites();
      set({ favorites: res.data.stores || [] });
    } catch {
      set({ favorites: [] }); // 에러 시 빈 배열로
    }
  },
  addFavorite: async (store_id) => {
    await addFavorite(store_id);
    await get().fetchFavorites();
  },
  removeFavorite: async (store_id) => {
    await removeFavorite(store_id);
    await get().fetchFavorites();
  },
}));

export default useFavoriteStore;
