import type { SearchResultItem } from "../types/search";

export type SortType = "distance" | "datetime";

export const sortSearchResults = (
  items: SearchResultItem[],
  sortType: SortType
): SearchResultItem[] => {
  return [...items].sort((a, b) => {
    if (sortType === "distance") {
      return (a.distance ?? Infinity) - (b.distance ?? Infinity);
    }

    if (sortType === "datetime") {
      const aTime =
        a.broadcast?.match_date && a.broadcast?.match_time
          ? new Date(`${a.broadcast.match_date}T${a.broadcast.match_time}`)
          : new Date(8640000000000000);

      const bTime =
        b.broadcast?.match_date && b.broadcast?.match_time
          ? new Date(`${b.broadcast.match_date}T${b.broadcast.match_time}`)
          : new Date(8640000000000000);
      return aTime.getTime() - bTime.getTime();
    }

    return 0;
  });
};
