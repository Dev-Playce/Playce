import { create } from "zustand";
import { Dayjs } from "dayjs";

interface BroadcastFormState {
  date: Dayjs | null;
  time: Dayjs | null;
  sport: string;
  sportId: number | null;
  league: string;
  leagueId: number | null;
  team1: string | null;
  team2: string | null;
  note: string;
  editingId: number | null;

  setDate: (date: Dayjs | null) => void;
  setTime: (time: Dayjs | null) => void;
  setSport: (sport: string, sportId: number) => void;
  setLeague: (league: string, leagueId: number | null) => void;
  setteam1: (team: string) => void;
  setteam2: (team: string) => void;
  setNote: (note: string) => void;
  setEditingId: (id: number | null) => void;
  resetForm: () => void;
  setInitialForm: (data: Partial<BroadcastFormState>) => void;
}

const useBroadcastFormStore = create<BroadcastFormState>((set) => ({
  date: null,
  time: null,
  sport: "",
  sportId: null,
  league: "",
  leagueId: null,
  team1: null,
  team2: null,
  note: "",
  editingId: null,

  setDate: (date) => set({ date }),
  setTime: (time) => set({ time }),
  setSport: (sport, sportId) => set({ sport, sportId }),
  setLeague: (league, leagueId) => set({ league, leagueId }),
  setteam1: (team) => set({ team1: team }),
  setteam2: (team) => set({ team2: team }),
  setNote: (note) => set({ note }),
  setEditingId: (id) => set({ editingId: id }),
  resetForm: () =>
    set({
      date: null,
      time: null,
      sport: "",
      sportId: null,
      league: "",
      leagueId: null,
      team1: "",
      team2: "",
      note: "",
    }),
  setInitialForm: (data) => set({ ...data }),
}));

export const handleSportChange = (sport: string, sportId: number) => {
  useBroadcastFormStore.setState({
    sport,
    sportId,
    league: "",
    leagueId: null,
    team1: "",
    team2: "",
  });
};

export const handleLeagueChange = (league: string, leagueId: number | null) => {
  useBroadcastFormStore.setState({
    league,
    leagueId,
    team1: "",
    team2: "",
  });
};

export default useBroadcastFormStore;
