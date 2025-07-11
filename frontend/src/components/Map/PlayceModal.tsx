import type { RestaurantBasic } from "../../types/restaurant.types";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { FiStar, FiMapPin, FiX } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Button from "../Common/Button";
import useFavoriteStore from "../../stores/favoriteStore";
import useAuthStore from "../../stores/authStore";

const defaultImage = "https://placehold.co/300x200?text=No+Image";

interface PlayceModalProps {
  restaurant: RestaurantBasic;
  onDetailClick: (restaurant: RestaurantBasic) => void;
  onClose: () => void;
}

const PlayceModal = ({
  restaurant,
  onDetailClick,
  onClose,
}: PlayceModalProps) => {
  const { favorites, addFavorite, removeFavorite } = useFavoriteStore();
  const isFavorite = favorites.some(
    (fav) => fav.store_id === restaurant.store_id
  );
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      alert("로그인 후 이용할 수 있는 기능입니다.");
      return;
    }
    if (isFavorite) {
      await removeFavorite(restaurant.store_id);
    } else {
      await addFavorite(restaurant.store_id);
    }
  };

  return (
    <CustomOverlayMap
      position={{ lat: restaurant.lat, lng: restaurant.lng }}
      yAnchor={1.2}
    >
      <div className="relative w-72 bg-white rounded-2xl shadow-xl p-4 font-pretendard">
        {/* 대표 이미지 + 닫기/저장 버튼 */}
        <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">
          <img
            src={restaurant.main_img || defaultImage}
            alt={restaurant.store_name || "가게 이미지"}
            className="w-full h-full object-cover"
          />
          {/* 좌상단: 저장(즐겨찾기) 버튼 */}
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleToggleFavorite}
            className="absolute left-2 top-2 bg-white/80 rounded-full p-2 shadow flex items-center justify-center transition"
            aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            style={{ border: "none" }}
          >
            {isFavorite ? (
              <FaStar className="text-yellow-400 text-lg" />
            ) : (
              <FiStar className="text-primary5 text-lg" />
            )}
          </button>
          {/* 우상단: 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute right-2 top-2 bg-white/80 rounded-full p-2 shadow flex items-center justify-center transition"
            aria-label="닫기"
            style={{ border: "none" }}
          >
            <FiX className="text-primary5 text-lg" />
          </button>
        </div>

        {/* 가게 이름 + 업종 뱃지 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-bold text-gray-900 truncate">
            {restaurant.store_name || "가게명 없음"}
          </span>
          <span className="ml-2 text-xs bg-primary3 text-primary5 px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
            {restaurant.type}
          </span>
        </div>

        {/* 주소 */}
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <FiMapPin className="text-base text-primary5" />
          <span className="truncate">
            {restaurant.address || "주소 정보 없음"}
          </span>
        </div>

        {/* 상세보기 버튼 */}
        <Button
          size="medium"
          scheme="primary"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onDetailClick(restaurant)}
          className="w-full"
        >
          상세보기
        </Button>
      </div>
    </CustomOverlayMap>
  );
};

export default PlayceModal;
