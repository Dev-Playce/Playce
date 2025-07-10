import { create } from "zustand";
import type { Broadcast } from "../types/broadcast";

const today = new Date();

export const dateInfo = {
  yearNum: today.getFullYear(),
  monthNum: today.getMonth(),
  dateNum: today.getDate(),
};

type TViewOption = "tab" | "calendar";

interface BoradcastState {
  year: number;
  month: number;
  date: number;
  store: string;
  storeId: number;
  broadcastLists: Broadcast[];
  viewOption: TViewOption;
  resetYMD: () => void;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
  setDate: (date: number) => void;
  setStore: (r: string, rId: number) => void;
  setViewOption: (view: TViewOption) => void;
  setBroadcastLists: (broadcasts: Broadcast[]) => void;
}

const useBroadcastStore = create<BoradcastState>((set) => ({
  year: dateInfo.yearNum,
  month: dateInfo.monthNum + 1,
  date: dateInfo.dateNum,
  store: "",
  storeId: 0,
  broadcastLists: [],
  viewOption: "tab",
  resetYMD: () => {
    set({
      year: dateInfo.yearNum,
      month: dateInfo.monthNum + 1,
      date: dateInfo.dateNum,
    });
  },
  setYear: (year) => {
    set({ year: year });
  },
  setMonth: (month) => {
    set({ month: month });
  },
  setDate: (date) => {
    set({ date: date });
  },
  setStore: (s: string, sId: number) => {
    set({ store: s, storeId: sId });
  },
  setViewOption: (view) => {
    set({ viewOption: view });
  },
  setBroadcastLists: (broadcasts) => set({ broadcastLists: broadcasts }),
}));

export default useBroadcastStore;
