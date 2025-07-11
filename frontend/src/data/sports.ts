export const sportsMap: Record<string, string[]> = {
  야구: ["전체", "KBO", "MLB", "NPB"],
  축구: ["전체", "K리그", "EPL", "라리가"],
};

export const getSportByLeague = (league: string): string => {
  return (
    Object.entries(sportsMap).find(([, leagues]) =>
      leagues.includes(league)
    )?.[0] || ""
  );
};
