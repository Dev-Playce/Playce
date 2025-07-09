import { useRef, useState } from "react";
import { Map } from "react-kakao-maps-sdk";
import useMapStore from "../../stores/mapStore";
import PlayceMapMarker from "./PlayceMapMarker";
import PlayceModal from "./PlayceModal";
import RestaurantDetailComponent from "../RestaurantDetail/RestaurantDetail";
import type { RestaurantBasic } from "../../types/restaurant.types";

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
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  const mapRef = useRef<kakao.maps.Map>(null);

  const getCurPosition = () => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    return { lat: center.getLat(), lng: center.getLng() };
  };

  // 상세보기 오픈 시 storeId만 저장
  const handleDetailClick = (restaurant: RestaurantBasic) => {
    setSelectedStoreId(restaurant.store_id);
    setIsDetailOpen(true);
  };

  return (
    <>
      <Map
        className="w-full h-full"
        ref={mapRef}
        center={position}
        isPanto={true}
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
        {/* <MapController position={position} /> */}
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
      {isDetailOpen && selectedStoreId && (
        <div className="fixed left-0 top-0 h-full w-[370px] z-[9999] shadow-2xl bg-white">
          <RestaurantDetailComponent
            storeId={selectedStoreId}
            onClose={() => {
              setIsDetailOpen(false);
              setSelectedStoreId(null);
            }}
          />
        </div>
      )}
    </>
  );
};

export default PlayceMap;
