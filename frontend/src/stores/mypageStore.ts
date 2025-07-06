import { create } from "zustand";
import type { MenuKey } from "../types/restaurant-manage.types";

interface MypageState {
  isMypageOpen: boolean;
  restaurantSubpage: MenuKey;
  restaurantEditId: number | null;
  setIsMypageOpen: (mypage: boolean) => void;
  setRestaurantSubpage: (subpage: MenuKey) => void;
  setRestaurantEdit: (restaurant: number) => void;
}

const useMypageStore = create<MypageState>((set) => ({
  isMypageOpen: false,
  restaurantSubpage: "restaurant-home",
  restaurantEditId: null,
  setIsMypageOpen: (mypage) => {
    set({ isMypageOpen: mypage });
  },
  setRestaurantSubpage: (subpage) => {
    set({ restaurantSubpage: subpage });
  },
  setRestaurantEdit: (restaurant) => {
    set({ restaurantEditId: restaurant });
  },
}));

export default useMypageStore;
