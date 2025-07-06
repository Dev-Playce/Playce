import { useEffect, useState } from "react";
import { FiStar } from "react-icons/fi";
import useFavoriteStore from "../../stores/favoriteStore";
import useAuthStore from "../../stores/authStore";
import RestaurantCardList from "../RestaurantCardList/RestaurantCardList";
import RestaurantDetailComponent from "../RestaurantDetail/RestaurantDetail.tsx";
import type { RestaurantDetail } from "../../types/restaurant.types";
import { getStoreDetail } from "../../api/restaurant.api";

export default function FavoriteSidebar() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { favorites, fetchFavorites, removeFavorite } = useFavoriteStore();
  const [expanded, setExpanded] = useState(false);

  // storeId와 detail을 함께 관리
  const [selectedDetail, setSelectedDetail] = useState<{
    storeId: number;
    detail: RestaurantDetail;
  } | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      fetchFavorites();
    }
  }, [isLoggedIn, fetchFavorites]);

  const visibleFavorites = expanded ? favorites : favorites.slice(0, 3);

  // 상세보기 버튼 클릭 시 storeId와 detail을 함께 저장
  const handleDetail = async (store_id: number) => {
    try {
      const res = await getStoreDetail(store_id);
      if (res.success && res.data) {
        setSelectedDetail({ storeId: store_id, detail: res.data });
      } else {
        alert("상세 정보를 찾을 수 없습니다.");
      }
    } catch {
      alert("상세 정보를 불러오지 못했습니다.");
    }
  };

  return (
    <section className="w-full bg-white px-4 pt-4 pb-3 rounded-xl shadow">
      <button
        className="flex items-center w-full h-8 border-b border-gray-100 bg-white group mb-3"
        onClick={() => setExpanded((prev) => !prev)}
        aria-label="즐겨찾기 펼치기"
      >
        <FiStar className="text-primary1 text-xl mr-2" />
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
          {selectedDetail && (
            <RestaurantDetailComponent
              detail={selectedDetail.detail}
              storeId={selectedDetail.storeId}
              onClose={() => setSelectedDetail(null)}
            />
          )}
        </>
      )}
    </section>
  );
}
