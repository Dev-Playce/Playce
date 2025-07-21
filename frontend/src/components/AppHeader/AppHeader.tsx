import { useSearchStore } from "../../stores/searchStore";
import { useRegionStore } from "../../stores/regionStore";
import { useSportStore } from "../../stores/sportStore";

export default function AppLogoHeader() {
  const resetSearch = useSearchStore((state) => state.reset);
  const resetRegions = useRegionStore((state) => state.resetRegions);
  const resetSport = useSportStore((state) => state.resetSport);

  return (
    <div className="h-12 flex items-center pl-6 border-b border-gray-100">
      <button
        className="text-2xl font-bold tracking-tight text-primary5 font-pretendard focus:outline-none"
        onClick={() => {
          resetSearch();
          resetRegions();
          resetSport();
          window.scrollTo(0, 0);
        }}
        aria-label="홈으로 이동"
      >
        Playce
      </button>
    </div>
  );
}
