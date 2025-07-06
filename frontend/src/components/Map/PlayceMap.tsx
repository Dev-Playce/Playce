import { useRef, useState } from "react";
import { Map } from "react-kakao-maps-sdk";
import useMapStore from "../../stores/mapStore";
import PlayceMapMarker from "./PlayceMapMarker";
import PlayceModal from "./PlayceModal";
import RestaurantDetailComponent from "../RestaurantDetail/RestaurantDetail";
import { getStoreDetail } from "../../api/restaurant.api"; // 상세조회 API 함수
import type {
  RestaurantBasic,
  RestaurantDetail,
} from "../../types/restaurant.types";

const PlayceMap: React.FC = () => {
  const {
    position,
    restaurants,
    openedModal,
    setPosition,
    closeModal,
    setRefreshBtn,
  } = useMapStore();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<{
    storeId: number;
    detail: RestaurantDetail;
  } | null>(null);

  const mapRef = useRef<kakao.maps.Map>(null);

  const getCurPosition = () => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    return { lat: center.getLat(), lng: center.getLng() };
  };

  // 상세조회 API 연동 (storeId와 detail을 함께 저장)
  const handleDetailClick = async (restaurant: RestaurantBasic) => {
    try {
      const res = await getStoreDetail(restaurant.store_id);
      if (res.success && res.data) {
        setSelectedDetail({ storeId: restaurant.store_id, detail: res.data });
        setIsDetailOpen(true);
      } else {
        alert("상세 정보를 찾을 수 없습니다.");
      }
    } catch {
      alert("상세 정보를 불러오지 못했습니다.");
    }
  };

  return (
    <>
      <Map
        className="w-full h-full"
        ref={mapRef}
        center={position}
        onClick={closeModal}
        onDragEnd={() => {
          setRefreshBtn(true);
          const pos = getCurPosition();
          if (!pos) {
            alert("위치 정보를 불러올 수 없습니다");
            return;
          }
          setPosition(pos);
        }}
      >
        {restaurants.map((restaurant) => (
          <PlayceMapMarker key={restaurant.store_id} restaurant={restaurant} />
        ))}
        {openedModal !== -1 && (
          <PlayceModal
            restaurant={restaurants.find((r) => r.store_id === openedModal)!}
            onDetailClick={handleDetailClick}
            onClose={closeModal}
          />
        )}
      </Map>
      {isDetailOpen && selectedDetail && (
        <div className="fixed left-0 top-0 h-full w-[370px] z-[9999] shadow-2xl bg-white">
          <RestaurantDetailComponent
            detail={selectedDetail.detail}
            storeId={selectedDetail.storeId}
            onClose={() => {
              setIsDetailOpen(false);
              setSelectedDetail(null);
            }}
          />
        </div>
      )}
    </>
  );
};

export default PlayceMap;
