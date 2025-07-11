import { create } from "zustand";
import type { SelectedRegion } from "../types/staticdata";

interface RegionState {
  selectedRegions: SelectedRegion[];
  toggleRegion: (big: string, small: string) => void;
  resetRegions: () => void;
  setSelectedRegions: (next: SelectedRegion[]) => void;
}

export const useRegionStore = create<RegionState>((set, get) => ({
  selectedRegions: [],
  toggleRegion: (big, small) => {
    const current = get().selectedRegions;
    const exists = current.some(
      (r) => r.bigRegion === big && r.smallRegion === small
    );

    if (exists) {
      set({
        selectedRegions: current.filter(
          (r) => !(r.bigRegion === big && r.smallRegion === small)
        ),
      });
    } else {
      set({
        selectedRegions: [...current, { bigRegion: big, smallRegion: small }],
      });
    }
  },
  resetRegions: () => set({ selectedRegions: [] }),
  setSelectedRegions: (next) => set({ selectedRegions: next }),
}));
