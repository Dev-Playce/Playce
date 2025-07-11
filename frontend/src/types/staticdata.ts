export interface BigRegion {
  id: number;
  name: string;
}

export interface SmallRegion {
  id: number;
  name: string;
  big_region_id: number;
}

export interface SelectedRegion {
  bigRegion: string;
  smallRegion: string;
}

export interface Sport {
  id: number;
  name: string;
  is_team_competition: boolean;
}

export interface League {
  id: number;
  name: string;
  sport_id: number;
}

export interface SelectedSports {
  sport: string;
  league: string;
}