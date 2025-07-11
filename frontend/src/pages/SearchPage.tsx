import { useState, useEffect } from "react";
import RegionModal from "../components/Search/RegionModal";
import { useRegionStore } from "../stores/regionStore";
import SportModal from "../components/Search/SportModal";
import { useSportStore } from "../stores/sportStore";
import SearchInput from "../components/Search/SearchInput";
import SearchButton from "../components/Search/SearchButton";
import SearchResultList from "../components/Search/SearchResultList";
import AppHeader from "../components/AppHeader/AppHeader";
import FavoriteSidebar from "../components/FavoriteSidebar/FavoriteSidebar";
import TodayBroadcastSidebar from "../components/TodayBroadcasts/TodayBroadCasts";
import { useSearchStore } from "../stores/searchStore";
import { useSearch } from "../hooks/useSearch";
import ResetButton from "../components/Search/ResetButton";

const SearchPage = () => {
  const [showRegionModal, setShowRegionModal] = useState(false);
  const { selectedRegions } = useRegionStore();
  const { isSearching, triggerSearch, setTriggerSearch } = useSearchStore();
  const { doSearch } = useSearch();
  const hasSearched = useSearchStore((state) => state.hasSearched);

  const selectedRegionLabel =
    selectedRegions.length === 0
      ? "지역"
      : selectedRegions.length === 1
      ? `${selectedRegions[0].bigRegion} ${selectedRegions[0].smallRegion}`
      : `${selectedRegions[0].bigRegion} ${selectedRegions[0].smallRegion} 외 ${
          selectedRegions.length - 1
        }곳`;

  const [showSportModal, setShowSportModal] = useState(false);
  const { sport, selectedLeagues } = useSportStore();

  const selectedSportLabel = !sport
    ? "경기"
    : selectedLeagues.length === 0
    ? `${sport}`
    : selectedLeagues.length === 1
    ? `${sport} ${selectedLeagues[0].league}`
    : `${sport} ${selectedLeagues[0].league} 외 ${
        selectedLeagues.length - 1
      }개`;

  useEffect(() => {
    if (triggerSearch) {
      doSearch();
      setTriggerSearch(false);
    }
  }, [triggerSearch]);

  return (
    <div className="h-screen bg-white">
      {/* 사이드바 */}
      <aside
        className="w-[430px] h-screen overflow-y-auto border-r bg-white"
        style={{
          scrollbarWidth: "none", // Firefox
          msOverflowStyle: "none", // IE, Edge
        }}
      >
        {/* 앱 이름/로고 */}
        <AppHeader />

        {/* 검색 영역 */}
        <div className="bg-primary4 px-3 py-3 space-y-2">
          {/* 입력창 */}
          <div>
            <SearchInput className="w-full" />
          </div>

          {/* 지역 검색 버튼 */}
          <div>
            <button
              onClick={() => setShowRegionModal(true)}
              className="flex items-center justify-between w-full px-4 py-2 border rounded bg-white text-gray-700 text-sm shadow-sm hover:border-primary1 min-w-0"
            >
              <span
                className="truncate block text-left min-w-0"
                title={selectedRegionLabel}
              >
                {selectedRegionLabel}
              </span>
              <svg
                className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showRegionModal && (
              <RegionModal
                onClose={() => setShowRegionModal(false)}
                onApply={() => {
                  setShowRegionModal(false);
                }}
              />
            )}
          </div>

          {/* 경기 검색 버튼 */}
          <div>
            <button
              onClick={() => setShowSportModal(true)}
              className="flex items-center justify-between w-full px-4 py-2 border rounded bg-white text-gray-700 text-sm shadow-sm hover:border-primary1 min-w-0"
            >
              <span
                className="truncate block text-left min-w-0"
                title={selectedSportLabel}
              >
                {selectedSportLabel}
              </span>
              <svg
                className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showSportModal && (
              <SportModal
                onClose={() => setShowSportModal(false)}
                onApply={() => {
                  setShowRegionModal(false);
                }}
              />
            )}
          </div>

          {/* 검색 버튼 */}
          <div className="flex gap-2">
            <div className="flex-[7]">
              <SearchButton />
            </div>
            <div className="flex-[3]">
              <ResetButton />
            </div>
          </div>
        </div>
        {hasSearched || isSearching ? (
          <div className="mt-4 px-3">
            <SearchResultList />
          </div>
        ) : (
          <>
            <FavoriteSidebar />
            <TodayBroadcastSidebar />
          </>
        )}
      </aside>
    </div>
  );
};

export default SearchPage;
