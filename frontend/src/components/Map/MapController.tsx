// MapController.tsx
import { useMap } from "react-kakao-maps-sdk";
import { useEffect } from "react";
import type { latlng } from "../../types/map";

interface Props {
  position: latlng;
}

const MapController = ({ position }: Props) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const moveLatLng = new kakao.maps.LatLng(position.lat, position.lng);
      map.setCenter(moveLatLng);
    }
  }, [position]);

  return null;
};

export default MapController;
