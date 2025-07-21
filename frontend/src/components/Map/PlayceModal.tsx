import type { RestaurantBasic } from "../../types/restaurant.types";
import { CustomOverlayMap } from "react-kakao-maps-sdk";
import { FiStar, FiMapPin, FiX } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Button from "../Common/Button";
import useFavoriteStore from "../../stores/favoriteStore";
import useAuthStore from "../../stores/authStore";

const defaultImage = "https://placehold.co/130x130?text=No+Image";

interface PlayceModalProps {
  restaurant: RestaurantBasic | undefined;
  onDetailClick: (restaurant: RestaurantBasic) => void;
  onClose: () => void;
}

const PlayceModal = ({
  restaurant,
  onDetailClick,
  onClose,
}: PlayceModalProps) => {
  const { favorites, addFavorite, removeFavorite } = useFavoriteStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (
    !restaurant ||
    typeof restaurant.lat !== "number" ||
    typeof restaurant.lng !== "number"
  ) {
    onClose?.();
    return null;
  }

  const isFavorite = favorites.some(
    (fav) => fav.store_id === restaurant.store_id
  );

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

  const handleDetailClick = () => {
    onDetailClick(restaurant);
    onClose();
  };

  const upcomingBroadcast = restaurant.broadcasts?.length
    ? [...restaurant.broadcasts]
        .sort((a, b) => {
          const aDate = new Date(`${a.match_date}T${a.match_time}`);
          const bDate = new Date(`${b.match_date}T${b.match_time}`);
          return aDate.getTime() - bDate.getTime();
        })
        .find(
          (bc) => new Date(`${bc.match_date}T${bc.match_time}`) > new Date()
        )
    : null;

  const yAnchor = upcomingBroadcast ? 1.22 : 1.27;

  return (
    <CustomOverlayMap
      position={{ lat: restaurant.lat, lng: restaurant.lng }}
      yAnchor={yAnchor}
    >
      <div
        className="relative flex flex-row w-[440px] max-w-full min-h-[170px] bg-white border border-gray-200 shadow-lg px-4 py-5 font-pretendard text-[15px] items-end"
        style={{ boxSizing: "border-box" }}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-white rounded-full p-1.5 border border-gray-200 shadow-sm z-10"
          aria-label="닫기"
          style={{ border: "none" }}
        >
          <FiX className="text-gray-500 text-[21px]" />
        </button>
        {/* 꼬리 */}
        <div
          className="absolute left-1/2 -bottom-[15px] -translate-x-1/2 w-0 h-0 z-20 pointer-events-none"
          style={{
            borderLeft: "15px solid transparent",
            borderRight: "15px solid transparent",
            borderTop: "15px solid #fff",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.10))",
          }}
        />
        <div
          className="absolute left-1/2 -bottom-[17px] -translate-x-1/2 w-0 h-0 z-10 pointer-events-none"
          style={{
            borderLeft: "16px solid transparent",
            borderRight: "16px solid transparent",
            borderTop: "16px solid #e5e7eb",
          }}
        />

        {/* 좌측: 정보+버튼 */}
        <div className="flex flex-col flex-1 min-w-0 pr-5">
          {/* 정보 */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[17px] font-bold text-gray-900 break-all"
                style={{
                  maxWidth: "165px",
                  wordBreak: "keep-all",
                  lineHeight: 1.2,
                }}
              >
                {restaurant.store_name || "가게명 없음"}
              </span>
              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded font-medium">
                {restaurant.type}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <FiMapPin className="text-[15px] text-gray-400 mr-0.5" />
              <span className="truncate">
                {restaurant.address || "주소 정보 없음"}
              </span>
            </div>
            {/* 중계 정보 */}
            <div className="bg-gray-50 rounded p-2 mb-2 w-full text-xs">
              {upcomingBroadcast ? (
                <>
                  <div className="font-bold text-primary5 mb-1">중계 일정</div>
                  <div className="space-y-0.5">
                    <div className="flex">
                      <div className="w-[38px] text-gray-500 text-right shrink-0">
                        종목
                      </div>
                      <div className="flex-1 pl-2 font-semibold text-gray-800">
                        {upcomingBroadcast.sport}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-[38px] text-gray-500 text-right shrink-0">
                        경기
                      </div>
                      <div
                        className="flex-1 pl-2 font-semibold text-gray-800"
                        style={{ wordBreak: "keep-all", whiteSpace: "normal" }}
                      >
                        {upcomingBroadcast.team_one}
                        <span className="mx-1 text-gray-400">vs</span>
                        {upcomingBroadcast.team_two}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="w-[38px] text-gray-500 text-right shrink-0">
                        일시
                      </div>
                      <div className="flex-1 pl-2 font-semibold text-gray-800">
                        {upcomingBroadcast.match_date}{" "}
                        {upcomingBroadcast.match_time}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-gray-400 text-center py-2 text-sm">
                  예정된 중계 일정이 없습니다
                </div>
              )}
            </div>
          </div>
          {/* 버튼 & 즐겨찾기 */}
          <div className="flex flex-row gap-2 items-center mt-auto">
            <Button
              size="small"
              scheme="custom"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleToggleFavorite}
              className="flex items-center justify-center w-[40px] h-[40px] p-0 rounded-full border-none shadow-none focus:outline-none"
              style={{ flexShrink: 0 }}
              aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
            >
              {isFavorite ? (
                <FaStar className="text-yellow-400 text-[22px]" />
              ) : (
                <FiStar className="text-gray-400 text-[22px]" />
              )}
            </Button>
            <Button
              size="small"
              scheme="apply"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={handleDetailClick}
              className="flex-1 min-w-0 !h-[40px] text-[15px] px-0 rounded"
            >
              상세보기
            </Button>
          </div>
        </div>

        <div className="flex flex-col justify-end items-end h-full min-h-[120px] w-[136px] pl-0">
          <div className="w-[136px] h-[136px] rounded-lg overflow-hidden bg-gray-100 self-end shadow">
            <img
              src={restaurant.main_img || defaultImage}
              alt={restaurant.store_name || "가게 이미지"}
              className="w-full h-full object-cover"
              width={136}
              height={136}
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </CustomOverlayMap>
  );
};

export default PlayceModal;
