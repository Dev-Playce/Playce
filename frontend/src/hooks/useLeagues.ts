import { useQuery } from "@tanstack/react-query";
import { fetchLeagues } from "../api/staticdata.api";
import type { League } from "../types/staticdata";

export const useLeagues = (sportId?: number) => {
  return useQuery<League[]>({
    queryKey: ["leagues", sportId],
    queryFn: () => fetchLeagues(sportId!),
    enabled: typeof sportId === "number",
  });
};
