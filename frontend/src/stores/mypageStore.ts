import { create } from "zustand";
import type { MenuKey } from "../types/restaurant-manage.types";
import type { StoreFormRequest } from "../types/restaurantFormRequest";

interface MypageState {
  isMypageOpen: boolean;
  restaurantSubpage: MenuKey;
  restaurantEdit: StoreFormRequest | null;
  setIsMypageOpen: (mypage: boolean) => void;
  setRestaurantSubpage: (subpage: MenuKey) => void;
  setRestaurantEdit: (restaurant: StoreFormRequest) => void;
}

const useMypageStore = create<MypageState>((set) => ({
  isMypageOpen: false,
  restaurantSubpage: "restaurant-home",
  restaurantEdit: null,
  setIsMypageOpen: (mypage) => {
    set({ isMypageOpen: mypage });
  },
  setRestaurantSubpage: (subpage) => {
    set({ restaurantSubpage: subpage });
  },
  setRestaurantEdit: (restaurant) => {
    set({ restaurantEdit: restaurant });
  },
}));

export default useMypageStore;
