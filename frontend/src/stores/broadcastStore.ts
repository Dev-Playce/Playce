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
  tabRef: React.RefObject<HTMLDivElement> | null;
  itemRefs: React.RefObject<Map<number, HTMLDivElement>> | null;
  setTabRef: (ref: React.RefObject<HTMLDivElement>) => void;
  setItemRefs: (ref: React.RefObject<Map<number, HTMLDivElement>>) => void;

  scrollDateCenter: () => void;
}

const useBroadcastStore = create<BoradcastState>((set, get) => ({
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
  tabRef: null,
  itemRefs: null,
  setTabRef: (ref) => set({ tabRef: ref }),
  setItemRefs: (ref) => set({ itemRefs: ref }),

  scrollDateCenter: () => {
    const tabRef = get().tabRef?.current;
    const itemRefs = get().itemRefs?.current;
    const todayDate = get().date;

    if (tabRef && itemRefs) {
      const todayEl = itemRefs.get(todayDate);
      if (todayEl) {
        const scrollPos =
          todayEl.offsetLeft + todayEl.offsetWidth / 2 - tabRef.clientWidth / 2;

        tabRef.scrollTo({ left: scrollPos, behavior: "smooth" });
        get().setDate(todayDate);
      }
    }
  },
}));

export default useBroadcastStore;
