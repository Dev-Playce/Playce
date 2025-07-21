import { useQuery } from "@tanstack/react-query";
import { fetchBigRegions, fetchSmallRegions } from "../api/staticdata.api";
import type { BigRegion, SmallRegion } from "../types/staticdata";

export const useRegions = (selectedBigRegionId?: number) => {
  const {
    data: bigRegions = [],
    isLoading: bigRegionsLoading,
    error: bigRegionsError,
  } = useQuery<BigRegion[]>({
    queryKey: ["bigRegions"],
    queryFn: fetchBigRegions,
  });

  const {
    data: smallRegions = [],
    isLoading: smallRegionsLoading,
    error: smallRegionsError,
  } = useQuery<SmallRegion[]>({
    queryKey: ["smallRegions", selectedBigRegionId],
    queryFn: () => fetchSmallRegions(selectedBigRegionId!),
    enabled: typeof selectedBigRegionId === "number",
  });

  return {
    bigRegions,
    bigRegionsLoading,
    bigRegionsError,
    smallRegions,
    smallRegionsLoading,
    smallRegionsError,
  };
};
