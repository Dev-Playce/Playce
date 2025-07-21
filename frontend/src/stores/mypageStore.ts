import { create } from "zustand";
import type { ExtendedSubpage } from "../types/restaurant-manage.types";

type TabType = "favorite" | "profile" | "restaurant";

interface MypageState {
  isMypageOpen: boolean;
  selectedTab: TabType;
  restaurantSubpage: ExtendedSubpage;
  restaurantEditId: number | null;
  restaurantEditName: string | null;
  setIsMypageOpen: (mypage: boolean) => void;
  setSelectedTab: (tab: TabType) => void;
  setRestaurantSubpage: (subpage: ExtendedSubpage) => void;
  setRestaurantEditId: (restaurant: number) => void;
  setRestaurantEditName: (restaurant: string) => void;
}

const useMypageStore = create<MypageState>((set) => ({
  isMypageOpen: false,
  selectedTab: "favorite",
  restaurantSubpage: "restaurant-home",
  restaurantEditId: null,
  restaurantEditName: null,
  setIsMypageOpen: (mypage) => {
    set({ isMypageOpen: mypage });
  },
  setSelectedTab: (tab) => {
    set({ selectedTab: tab });
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
