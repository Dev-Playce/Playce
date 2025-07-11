import type { SelectedSports } from "../types/staticdata";

export const getUpdatedLeagueSelection = (
  current: SelectedSports[],
  sport: string,
  league: string
): SelectedSports[] => {
  const isFullSelected = current.some(
    (r) => r.sport === sport && r.league === "전체"
  );

  if (league === "전체") {
    const filtered = current.filter((r) => r.sport !== sport);
    return [...filtered, { sport, league: "전체" }];
  }

  const updated = isFullSelected
    ? current.filter(
        (r) => !(r.sport === sport && r.league === "전체")
      )
    : [...current];

  const exists = updated.some(
    (r) => r.sport === sport && r.league === league
  );

  if (exists) {
    return updated.filter(
      (r) => !(r.sport === sport && r.league === league)
    );
  } else {
    return [...updated, { sport, league }];
  }
};