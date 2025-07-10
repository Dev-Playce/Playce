import { useState, useEffect } from "react";
import useMapStore from "../stores/mapStore";
import { useMap } from "./useMap";
import { CITY_STATION, SEARCHNEARBY_RADIUS } from "../constant/map-constant";

export const useGeoLocation = (options = {}) => {
  const { setPosition } = useMapStore();
  const { fetchRestaurants } = useMap();

  const [error, setError] = useState("");

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;

    setPosition({
      lat: latitude,
      lng: longitude,
    });

    fetchRestaurants({
      lat: latitude,
      lng: longitude,
      radius: SEARCHNEARBY_RADIUS,
    });
  };

  const handleError = (err: GeolocationPositionError) => {
    setError(err.message);

    setPosition(CITY_STATION);

    fetchRestaurants({
      lat: CITY_STATION.lat,
      lng: CITY_STATION.lng,
      radius: SEARCHNEARBY_RADIUS,
    });
  };

  useEffect(() => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError("위치 기능을 지원하지 않습니다");

      return;
    }

    geolocation.getCurrentPosition(handleSuccess, handleError, options);
  }, []);

  return { location, error };
};
