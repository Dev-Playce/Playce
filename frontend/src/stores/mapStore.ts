import { create } from "zustand";
import type { latlng } from "../types/map";
import type { RestaurantBasic } from "../types/restaurant.types";
import { CITY_STATION } from "../constant/map-constant";

interface MapState {
  position: latlng;
  openedModal: number;
  restaurants: RestaurantBasic[];
  isRefreshBtnOn: boolean;
  zoomLevel: number;
  setPosition: (pos: latlng) => void;
  setRestaurants: (restaurantsList: RestaurantBasic[]) => void;
  resetSpots: () => void;
  refreshSpots: (newSpots: RestaurantBasic[]) => void;
  setOpenedModal: (modal: number) => void;
  closeModal: () => void;
  setRefreshBtn: (button: boolean) => void;
  setZoomLevel: (zoom: number) => void;
}

const useMapStore = create<MapState>((set) => ({
  position: CITY_STATION,
  openedModal: -1,
  restaurants: [],
  isRefreshBtnOn: false,
  zoomLevel: 3,
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
  setZoomLevel: (zoom) => {
    set({ zoomLevel: zoom });
  },
}));

export default useMapStore;
