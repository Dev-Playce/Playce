import { useSearchStore } from "../../stores/searchStore";
import { useRegionStore } from "../../stores/regionStore";
import { useSportStore } from "../../stores/sportStore";
import Button from "../Common/Button";

const ResetSearchButton = () => {
  const resetSearch = useSearchStore((state) => state.reset);
  const resetRegion = useRegionStore((state) => state.resetRegions);
  const resetSport = useSportStore((state) => state.resetSport);

  const handleReset = () => {
    resetSearch();
    resetRegion();
    resetSport();
  };

  return (
    <Button onClick={handleReset} scheme="secondary" fullWidth size="semi">
      초기화
    </Button>
  );
};

export default ResetSearchButton;
