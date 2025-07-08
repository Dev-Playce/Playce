import { useState } from "react";
import SearchResultItem from "./SearchResultItem";
import { useSearchStore } from "../../stores/searchStore";
import { sortSearchResults } from "../../utils/sortUtils";
import RestaurantDetailComponent from "../RestaurantDetail/RestaurantDetail";

const SearchResultList = () => {
  const isSearching = useSearchStore((state) => state.isSearching);
  const hasSearched = useSearchStore((state) => state.hasSearched);
  const results = useSearchStore((state) => state.results);
  const sort = useSearchStore((state) => state.sort);
  const setSort = useSearchStore((state) => state.setSort);

  // 상세보기용 state 추가
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  const sortedResults = sortSearchResults(results, sort);

  if (!hasSearched && !isSearching) return null;

  return (
    <div>
      <div className="flex justify-between border-b px-3 py-2 h-10">
        <p className="text-gray-600 leading-[1] flex items-center h-full">
          검색 결과
        </p>
        <div className="flex items-center gap-2 h-full">
          <button
            className={`text-sm px-2 leading-[1] h-full flex items-center ${
              sort === "distance" ? "text-primary5 font-bold" : "text-gray-400"
            }`}
            onClick={() => setSort("distance")}
          >
            거리순
          </button>
          <div className="w-px h-4 bg-gray-300" />
          <button
            className={`text-sm px-2 leading-[1] h-full flex items-center ${
              sort === "datetime" ? "text-primary5 font-bold" : "text-gray-400"
            }`}
            onClick={() => setSort("datetime")}
          >
            날짜순
          </button>
        </div>
      </div>

      <div className="px-3">
        {isSearching ? (
          <p className="text-center text-gray-400 py-20">검색 중입니다.</p>
        ) : sortedResults.length === 0 ? (
          <p className="text-center text-gray-400 py-20 text-xl">
            검색 결과가 없습니다.
          </p>
        ) : (
          sortedResults.map((item) => {
            const date = item.broadcast
              ? new Date(item.broadcast.match_date)
              : null;

            const matchInfo =
              date && item.broadcast
                ? `${date.getMonth() + 1}/${date.getDate()} · ${
                    item.broadcast.team_one
                  } vs ${item.broadcast.team_two}`
                : "";

            const displayItem = {
              storeName: item.store_name,
              address: item.address,
              distance: item.distance,
              matchInfo,
              imgUrl: item.img_url || "/noimg.png",
            };

            return (
              <SearchResultItem
                key={item.id}
                data={displayItem}
                onClick={() => setSelectedStoreId(item.id)}
              />
            );
          })
        )}
      </div>

      {/* 상세보기 모달/사이드바 */}
      {selectedStoreId !== null && (
        <RestaurantDetailComponent
          storeId={selectedStoreId}
          onClose={() => setSelectedStoreId(null)}
        />
      )}
    </div>
  );
};

export default SearchResultList;
