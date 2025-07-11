import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import useFavoriteStore from "../../stores/favoriteStore";
import useAuthStore from "../../stores/authStore";
import RestaurantCardList from "../RestaurantCardList/RestaurantCardList";
import RestaurantDetailComponent from "../RestaurantDetail/RestaurantDetail.tsx";

export default function FavoriteSidebar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { favorites, fetchFavorites, removeFavorite } = useFavoriteStore();
  const [expanded, setExpanded] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn, fetchFavorites]);

  const visibleFavorites = expanded ? favorites : favorites.slice(0, 3);

  // 상세보기 버튼 클릭 시 storeId만 저장
  const handleDetail = (store_id: number) => {
    setSelectedStoreId(store_id);
  };

  return (
    <section className="w-full bg-white px-1.5 pt-6 pb-2 rounded-2xl border border-gray-100">
      <button
        className="flex items-center w-full h-8 border-b border-gray-100 bg-white group px-3 pb-3"
        onClick={() => setExpanded((prev) => !prev)}
        aria-label="즐겨찾기 펼치기"
      >
        <FaStar className="text-yellow-400 text-xl mr-2" />
        <span className="text-lg font-bold flex-1 text-left">즐겨찾기</span>
        <span className="text-xs text-gray-400 mr-2">
          {expanded ? "접기" : "더보기"}
        </span>
      </button>

      {!isLoggedIn ? (
        <div className="py-8 text-center text-gray-400 text-base">
          즐겨찾기 기능은 로그인이 필요합니다.
        </div>
      ) : (
        <>
          <RestaurantCardList
            stores={visibleFavorites}
            onRemove={removeFavorite}
            showDelete
            showDetail
            compact
            onDetail={handleDetail}
          />
          {selectedStoreId !== null && (
            <RestaurantDetailComponent
              storeId={selectedStoreId}
              onClose={() => setSelectedStoreId(null)}
            />
          )}
        </>
      )}
    </section>
  );
}
