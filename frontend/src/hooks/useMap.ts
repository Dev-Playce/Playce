import { searchNearby, type SearchNearbyProps } from "../api/map.api";
import useMapStore from "../stores/mapStore";

export const useMap = () => {
  const { setRestaurants } = useMapStore();

  const fetchRestaurants = async (data: SearchNearbyProps) => {
    try {
      const res = await searchNearby(data);
      setRestaurants(res.data);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return {
    fetchRestaurants,
  };
};
