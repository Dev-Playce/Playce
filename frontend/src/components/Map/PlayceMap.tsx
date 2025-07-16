import { useEffect, useRef, useState } from "react";
import { Map } from "react-kakao-maps-sdk";
import useMapStore from "../../stores/mapStore";
import PlayceMapMarker from "./PlayceMapMarker";
import PlayceModal from "./PlayceModal";
import RestaurantDetailComponent from "../RestaurantDetail/RestaurantDetail";
import GoToCurrentLocationButton from "./CurrentMap";
import type { RestaurantBasic } from "../../types/restaurant.types";
import { CITY_STATION } from "../../constant/map-constant";
import { getToken } from "../../stores/authStore";

const PlayceMap: React.FC = () => {
  const {
    position,
    restaurants,
    openedModal,
    zoomLevel,
    setPosition,
    closeModal,
    setRefreshBtn,
    setZoomLevel,
  } = useMapStore();

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);

  // 반드시 null 포함!
  const mapRef = useRef<kakao.maps.Map | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      if (typeof map.getLevel === "function") {
        map.setLevel(zoomLevel);
      }
    }
  }, [zoomLevel]);

  const getCurPosition = () => {
    const map = mapRef.current;
    if (!map) return;
    const center = map.getCenter();
    return { lat: center.getLat(), lng: center.getLng() };
  };

  // 상세보기 오픈 시 storeId만 저장
  const handleDetailClick = (restaurant: RestaurantBasic) => {
    console.log(getToken());
    setSelectedStoreId(restaurant.store_id);
    setIsDetailOpen(true);
  };

  return (
    <>
      <div className="relative w-full h-full">
        <Map
          className="w-full h-full"
          ref={mapRef}
          center={position ? position : CITY_STATION}
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
          onZoomChanged={(map) => {
            const newZoomLevel = map.getLevel();
            setZoomLevel(newZoomLevel);
          }}
        >
          {restaurants.map((restaurant) => (
            <PlayceMapMarker
              key={restaurant.store_id}
              restaurant={restaurant}
            />
          ))}
          {openedModal !== -1 && (
            <PlayceModal
              restaurant={restaurants.find((r) => r.store_id === openedModal)!}
              onDetailClick={handleDetailClick}
              onClose={closeModal}
            />
          )}
        </Map>
        {/* 현위치로 이동 버튼 - 반드시 Map과 같은 div 내에서 absolute로! */}
        <GoToCurrentLocationButton mapRef={mapRef} />
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
      </div>
    </>
  );
};

export default PlayceMap;
