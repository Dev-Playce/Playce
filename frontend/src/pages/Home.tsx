import { useEffect } from "react";
import AuthHeader from "../components/Auth/AuthHeader";
import LoginModal from "../components/Auth/Login";
import SignupModal from "../components/Auth/Signup";
import Map from "../components/Map/PlayceMap";
import SpotRefreshButton from "../components/Map/SpotRefreshButton";
import MypageModal from "../components/Mypage/MypageModal";
import { useGeoLocation } from "../hooks/useGeoLocation";
import useMapStore from "../stores/mapStore";
import useMypageStore from "../stores/mypageStore";
import SearchPage from "./SearchPage";
import { useMap } from "../hooks/useMap";
import { SEARCHNEARBY_RADIUS } from "../constant/map-constant";
import PasswordResetRequestModal from "../components/Auth/PasswordResetRequestModal";

const Home: React.FC = () => {
  const { position, isRefreshBtnOn, setRestaurants } = useMapStore();
  const { isMypageOpen, setIsMypageOpen } = useMypageStore();
  const { fetchRestaurants } = useMap();
  const { setRestaurantSubpage } = useMypageStore();
  const { setSelectedTab } = useMypageStore();

  const geolocationOptions = {
    enableHighAccuracy: true,
    timeout: 1000 * 10,
    maximumAge: 1000 * 3600 * 24,
  };

  const handleClose = () => {
    setIsMypageOpen(false);
    setRestaurantSubpage("restaurant-home");
    setSelectedTab("favorite");
  };

  useGeoLocation(geolocationOptions);

  useEffect(() => {
    if (position) {
      fetchRestaurants({
        lat: position.lat,
        lng: position.lng,
        radius: SEARCHNEARBY_RADIUS,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setRestaurants]);

  return (
    <div className="flex">
      <SearchPage />
      <div className="relative w-full h-screen">
        {position && <Map />}
        {/* 이 위치에서 재탐색 버튼 */}
        {isRefreshBtnOn && <SpotRefreshButton />}
        <AuthHeader />
        <LoginModal />
        <SignupModal />
        <PasswordResetRequestModal />
      </div>
      {isMypageOpen && <MypageModal onClose={() => handleClose()} />}
    </div>
  );
};

export default Home;
