import { create } from "zustand";
import type { ExtendedSubpage } from "../types/restaurant-manage.types";

interface MypageState {
  isMypageOpen: boolean;
  restaurantSubpage: ExtendedSubpage;
  restaurantEditId: number | null;
  restaurantEditName: string | null;
  setIsMypageOpen: (mypage: boolean) => void;
  setRestaurantSubpage: (subpage: ExtendedSubpage) => void;
  setRestaurantEditId: (restaurant: number) => void;
  setRestaurantEditName: (restaurant: string) => void;
}

const useMypageStore = create<MypageState>((set) => ({
  isMypageOpen: false,
  restaurantSubpage: "restaurant-home",
  restaurantEditId: null,
  restaurantEditName: null,
  setIsMypageOpen: (mypage) => {
    set({ isMypageOpen: mypage });
  },
  setRestaurantSubpage: (subpage) => {
    set({ restaurantSubpage: subpage });
  },
  setRestaurantEditId: (restaurant) => {
    set({ restaurantEditId: restaurant });
  },
  setRestaurantEditName: (restaurant) => {
    set({ restaurantEditName: restaurant });
  },
}));

export default useMypageStore;
