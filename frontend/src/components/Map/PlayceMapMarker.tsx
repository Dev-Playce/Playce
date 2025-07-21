import { useMap, MapMarker } from "react-kakao-maps-sdk";
import useMapStore from "../../stores/mapStore";
import type { RestaurantBasic } from "../../types/restaurant.types";

interface PlayceMapMarkerProps {
  restaurant: RestaurantBasic;
}

const PlayceMapMarker = ({ restaurant }: PlayceMapMarkerProps) => {
  const map = useMap();
  const { setOpenedModal } = useMapStore();

  return (
    <MapMarker
      position={{ lat: restaurant.lat, lng: restaurant.lng }}
      onClick={() => {
        map.panTo(new window.kakao.maps.LatLng(restaurant.lat, restaurant.lng));
        setOpenedModal(restaurant.store_id);
      }}
    />
  );
};

export default PlayceMapMarker;
