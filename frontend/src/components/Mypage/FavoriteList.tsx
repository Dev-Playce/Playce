import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import useFavoriteStore from "../../stores/favoriteStore";
import RestaurantCardList from "../RestaurantCardList/RestaurantCardList";
import RestaurantDetailComponent from "../RestaurantDetail/RestaurantDetail";

interface FavoriteListProps {
  onClose: () => void;
}

const FavoriteList = ({ onClose }: FavoriteListProps) => {
  const { favorites, fetchFavorites, removeFavorite } = useFavoriteStore();
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // 상세보기 버튼 클릭 시 storeId만 저장
  const handleDetail = (store_id: number) => {
    setSelectedStoreId(store_id);
  };

  return (
    <section className="px-2">
      <div className="flex items-center justify-between text-lg font-semibold my-5">
        <div className="flex items-center gap-3">즐겨찾기</div>
        <button
          onClick={onClose}
          className="hover:text-primary5"
          aria-label="마이페이지 닫기"
        >
          <FaTimes />
        </button>
      </div>
      <RestaurantCardList
        stores={favorites}
        onRemove={removeFavorite}
        showDelete
        showDetail
        compact={false}
        onDetail={handleDetail}
      />
      {/* 상세보기 모달/사이드바 */}
      {selectedStoreId !== null && (
        <RestaurantDetailComponent
          storeId={selectedStoreId}
          onClose={() => setSelectedStoreId(null)}
        />
      )}
    </section>
  );
};

export default FavoriteList;
