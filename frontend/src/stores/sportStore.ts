import { create } from "zustand";
import type { SelectedSports } from "../types/staticdata";

interface SportState {
  sport: string;
  selectedLeagues: SelectedSports[];
  setSport: (sport: string) => void;
  setSelectedLeagues: (leagues: SelectedSports[]) => void;
  toggleLeague: (league: string) => void;
  resetSport: () => void;
}

export const useSportStore = create<SportState>((set, get) => ({
  sport: "",
  selectedLeagues: [],

  setSport: (sport) =>
    set((prev) => ({ sport, selectedLeagues: prev.selectedLeagues })),

  setSelectedLeagues: (leagues) => set({ selectedLeagues: leagues }),

  toggleLeague: (league) => {
    const sport = get().sport;
    const current = get().selectedLeagues;

    const exists = current.some(
      (item) => item.sport === sport && item.league === league
    );

    if (exists) {
      set({
        selectedLeagues: current.filter(
          (item) => !(item.sport === sport && item.league === league)
        ),
      });
    } else {
      set({
        selectedLeagues: [...current, { sport, league }],
      });
    }
  },

  resetSport: () => set({ sport: "", selectedLeagues: [] }),
}));
