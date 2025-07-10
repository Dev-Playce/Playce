import { create } from "zustand";
import type { latlng } from "../types/map";
import type { RestaurantBasic } from "../types/restaurant.types";

interface MapState {
  position: latlng | null;
  openedModal: number;
  restaurants: RestaurantBasic[];
  isRefreshBtnOn: boolean;
  setPosition: (pos: latlng) => void;
  setRestaurants: (restaurantsList: RestaurantBasic[]) => void;
  resetSpots: () => void;
  refreshSpots: (newSpots: RestaurantBasic[]) => void;
  setOpenedModal: (modal: number) => void;
  closeModal: () => void;
  setRefreshBtn: (button: boolean) => void;
}

const useMapStore = create<MapState>((set) => ({
  position: null,
  openedModal: -1,
  restaurants: [],
  isRefreshBtnOn: false,
  setPosition: (pos) => {
    set({ position: pos });
  },
  setRestaurants: (restaurantsList) => {
    set({ restaurants: restaurantsList });
  },
  resetSpots: () => {
    set({ restaurants: [] });
  },
  refreshSpots: (newSpots) => {
    set({ restaurants: newSpots });
  },
  setOpenedModal: (modal) => {
    set({ openedModal: modal });
  },
  closeModal: () => {
    set({ openedModal: -1 });
  },
  setRefreshBtn: (button) => {
    set({ isRefreshBtnOn: button });
  },
}));

export default useMapStore;
