import { useQuery } from "@tanstack/react-query";
import { fetchSports } from "../api/staticdata.api";
import type { Sport } from "../types/staticdata";

export const useSports = () => {
  return useQuery<Sport[]>({
    queryKey: ["sports"],
    queryFn: fetchSports,
  });
};
