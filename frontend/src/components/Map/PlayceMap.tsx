import { useRef, useState } from "react";
import { Map } from "react-kakao-maps-sdk";
import useMapStore from "../../stores/mapStore";
import PlayceMapMarker from "./PlayceMapMarker";
import PlayceModal from "./PlayceModal";
import RestaurantDetailComponent from "../RestaurantDetail/RestaurantDetail";
import type { RestaurantBasic } from "../../types/restaurant.types";
import { IoLocateOutline } from "react-icons/io5";

// 현위치로 이동 버튼 컴포넌트
interface GoToCurrentLocationButtonProps {
  mapRef: React.RefObject<kakao.maps.Map | null>;
}
function GoToCurrentLocationButton({ mapRef }: GoToCurrentLocationButtonProps) {
  const handleClick = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const map = mapRef.current;
        if (map && window.kakao && window.kakao.maps) {
          map.setCenter(new window.kakao.maps.LatLng(lat, lng));
        }
      },
      () => {
        alert("현재 위치를 가져올 수 없습니다.");
      }
    );
  };

  return (
    <button
      type="button"
      className="fixed bottom-24 right-6 z-20 p-3 rounded-full bg-white shadow-md border border-gray-200 hover:bg-primary4 transition-colors"
      onClick={handleClick}
      aria-label="현위치로 이동"
    >
      <IoLocateOutline className="text-primary5 text-2xl" />
    </button>
  );
}

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
      {/* 현위치로 이동 버튼 */}
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
    </>
  );
};

export default PlayceMap;
