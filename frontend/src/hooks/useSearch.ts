import { fetchSearchResults } from "../api/search.api";
import { useSearchStore } from "../stores/searchStore";
import { getDistanceFromLatLon } from "../utils/distanceUtils";
import useMapStore from "../stores/mapStore";
import type { SearchResultItem } from "../types/search";

export const useSearch = () => {
  const {
    searchText,
    sports,
    leagues,
    bigRegions,
    smallRegions,
    sort,
    setResults,
    setIsSearching,
    setHasSearched,
  } = useSearchStore();

  const { position } = useMapStore();

  const doSearch = async () => {
    setIsSearching(true);
    setHasSearched(true);
    try {
      console.log("검색 조건:", {
        searchText,
        sports,
        leagues,
        big_region: bigRegions,
        small_region: smallRegions,
        sort,
      });

      const res = await fetchSearchResults({
        search: searchText,
        sports,
        leagues,
        big_regions: bigRegions,
        small_regions: smallRegions,
        sort,
      });

      if (res.success) {
        const items: SearchResultItem[] = res.data;
        const enriched = items.map((item) => {
          if (
            position &&
            typeof position.lat === "number" &&
            typeof position.lng === "number"
          ) {
            const distance = getDistanceFromLatLon(
              position.lat,
              position.lng,
              item.lat,
              item.lng
            );
            return { ...item, distance };
          }

          return { ...item, distance: undefined };
        });

        setResults(enriched);
      } else {
        setResults([])
      }
    } catch (err) {
      console.error("검색 실패", err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return { doSearch };
};
