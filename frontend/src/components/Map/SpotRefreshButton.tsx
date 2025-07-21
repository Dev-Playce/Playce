import Button from "../Common/Button";
import useMapStore from "../../stores/mapStore";
import { IoReloadOutline } from "react-icons/io5";
import { searchNearby } from "../../api/map.api";

const SpotRefreshButton = () => {
  const { position, zoomLevel, setRefreshBtn, setRestaurants } = useMapStore();

  function getScaledValue(level: number): number {
    if (level >= 8) {
      return 20;
    } else if (level === 7) {
      return 10;
    } else {
      return 5;
    }
  }

  return (
    <Button
      icon={<IoReloadOutline />}
      size="medium"
      className={`
    absolute top-[80px] left-1/2 -translate-x-1/2 z-10 rounded-lg
    bg-primary5 border border-primary5 text-white
    hover:bg-white hover:text-primary5 hover:border-primary5
    transition-colors
  `}
      onClick={async () => {
        const rad = getScaledValue(zoomLevel);
        const res = await searchNearby({
          lat: position.lat,
          lng: position.lng,
          radius: rad,
        });
        setRestaurants(res.data);
        setRefreshBtn(false);
      }}
    >
      이 위치에서 재탐색
    </Button>
  );
};

export default SpotRefreshButton;
