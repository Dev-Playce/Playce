import { create } from "zustand";
import type { SearchResultItem } from "../types/search";

interface SearchState {
  //텍스트 검색
  searchText: string;
  setSearchText: (value: string) => void;

  // 지역
  bigRegions: string[];
  smallRegions: string[];
  setBigRegions: (value: string[]) => void;
  setSmallRegions: (value: string[]) => void;

  // 종목/리그
  sports: string[];
  leagues: string[];
  setSports: (value: string[]) => void;
  setLeagues: (value: string[]) => void;

  // 정렬 기준
  sort: "distance" | "datetime";
  setSort: (value: "distance" | "datetime") => void;

  // 검색 트리거
  triggerSearch: boolean;
  setTriggerSearch: (value: boolean) => void;

  // 검색 리스트 유무
  isSearching: boolean;
  setIsSearching: (v: boolean) => void;

  // 검색 결과
  results: SearchResultItem[];
  setResults: (results: SearchResultItem[]) => void;

  //검색 했는지 안했는지
  hasSearched: boolean;
  setHasSearched: (v: boolean) => void;

  // 전체 초기화
  reset: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchText: "",
  bigRegions: [],
  smallRegions: [],
  sports: [],
  leagues: [],
  sort: "distance",
  triggerSearch: false,
  isSearching: false,
  hasSearched: false,
  results: [],

  setSearchText: (value) => set({ searchText: value }),
  setBigRegions: (value) => set({ bigRegions: value }),
  setSmallRegions: (value) => set({ smallRegions: value }),
  setSports: (value) => set({ sports: value }),
  setLeagues: (value) => set({ leagues: value }),
  setSort: (value) => set({ sort: value }),
  setTriggerSearch: (value) => set({ triggerSearch: value }),
  setIsSearching: (value) => set({ isSearching: value }),
  setResults: (results) => set({ results }),
  setHasSearched: (v) => set({ hasSearched: v }),

  reset: () =>
    set({
      searchText: "",
      bigRegions: [],
      smallRegions: [],
      sports: [],
      leagues: [],
      sort: "distance",
      triggerSearch: false,
      isSearching: false,
      hasSearched: false,
    }),
}));
