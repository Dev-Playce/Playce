import React from "react";
import { FaCompass } from "react-icons/fa";

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
      className="
        absolute bottom-24 right-24 z-20
        w-14 h-14 flex items-center justify-center
        rounded-full bg-white border-2 border-primary5 shadow-lg
        hover:rotate-45 hover:bg-primary4/30 transition-all
        group
      "
      onClick={handleClick}
      aria-label="현위치로 이동"
      style={{
        boxShadow: "0 4px 16px 0 rgba(0,0,0,0.08)",
      }}
    >
      <span
        className="absolute w-10 h-10 rounded-full border-2 border-primary4 opacity-60"
        style={{ pointerEvents: "none" }}
      />
      <FaCompass className="text-primary5 text-3xl relative z-10 group-hover:text-primary6 transition-colors" />
    </button>
  );
}

export default GoToCurrentLocationButton;
