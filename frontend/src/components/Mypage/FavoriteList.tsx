import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import useFavoriteStore from "../../stores/favoriteStore";
import RestaurantCardList from "../RestaurantCardList/RestaurantCardList";
import RestaurantDetailComponent from "../RestaurantDetail/RestaurantDetail";
import type { RestaurantDetail } from "../../types/restaurant.types";
import { getStoreDetail } from "../../api/restaurant.api";

interface FavoriteListProps {
  onClose: () => void;
}

const FavoriteList = ({ onClose }: FavoriteListProps) => {
  const { favorites, fetchFavorites, removeFavorite } = useFavoriteStore();
  // storeId와 detail을 함께 관리
  const [selectedDetail, setSelectedDetail] = useState<{
    storeId: number;
    detail: RestaurantDetail;
  } | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

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
      {selectedDetail && (
        <RestaurantDetailComponent
          detail={selectedDetail.detail}
          storeId={selectedDetail.storeId}
          onClose={() => setSelectedDetail(null)}
        />
      )}
    </section>
  );
};

export default FavoriteList;
