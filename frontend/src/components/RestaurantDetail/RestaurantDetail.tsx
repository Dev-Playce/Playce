import { useState } from "react";
import {
  FiStar,
  FiMapPin,
  FiClock,
  FiPhone,
  FiFileText,
  FiX,
  FiTv,
} from "react-icons/fi";
import { FaUtensils, FaStar } from "react-icons/fa";
import type { RestaurantDetail } from "../../types/restaurant.types";
import Button from "../Common/Button";
import classNames from "classnames";
import useFavoriteStore from "../../stores/favoriteStore";
import useAuthStore from "../../stores/authStore";

const TABS = ["홈", "메뉴", "중계"] as const;
type Tab = (typeof TABS)[number];

interface RestaurantDetailComponentProps {
  detail: RestaurantDetail;
  storeId: number;
  onClose?: () => void;
}

export default function RestaurantDetailComponent({
  detail,
  storeId,
  onClose,
}: RestaurantDetailComponentProps) {
  const [currentTab, setCurrentTab] = useState<Tab>("홈");

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { favorites, addFavorite, removeFavorite } = useFavoriteStore();
  const isFavorite = favorites.some((fav) => fav.store_id === storeId);

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      alert("로그인 후 이용할 수 있는 기능입니다.");
      return;
    }
    if (isFavorite) {
      await removeFavorite(storeId);
    } else {
      await addFavorite(storeId);
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[430px] z-[100] bg-white shadow-2xl border-r border-gray-100 flex flex-col font-pretendard">
      {/* 헤더 */}
      <div className="h-12 flex items-center pl-6 border-b border-gray-100">
        <button
          className="text-2xl font-bold tracking-tight text-primary5 font-pretendard focus:outline-none"
          onClick={onClose}
          aria-label="상세보기 닫기"
          type="button"
        >
          Playce
        </button>
      </div>

      {/* 이미지 */}
      <div className="w-full h-56 bg-gradient-to-tr via-white to-orange-50 flex items-center justify-center relative">
        {detail.img_list?.[0] ? (
          <img
            src={detail.img_list[0]}
            alt={detail.store_name}
            className="w-full h-full object-cover rounded-b-xl"
          />
        ) : (
          <span className="text-gray-400">이미지 없음</span>
        )}
        {/* 저장/공유 버튼 */}
        <div className="absolute left-6 top-6 flex gap-3 z-10">
          <button
            onClick={handleToggleFavorite}
            className="bg-white/90 rounded-full p-2 shadow hover:bg-orange-50 transition"
            aria-label={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
          >
            {isFavorite ? (
              <FaStar className="text-yellow-400 text-lg" />
            ) : (
              <FiStar className="text-primary5 text-lg" />
            )}
          </button>
        </div>
        {/* 닫기(X) 버튼 */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-white/90 rounded-full p-2 shadow hover:bg-orange-50 transition z-20"
            aria-label="상세보기 닫기"
          >
            <FiX className="text-primary5 text-lg" />
          </button>
        )}
      </div>

      {/* 탭 메뉴 */}
      <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
        {TABS.map((tab) => (
          <Button
            key={tab}
            scheme="tab"
            className={classNames(
              "flex-1 py-3 flex items-center justify-center gap-1 transition-all",
              currentTab === tab && "text-primary5 border-primary5 bg-white"
            )}
            onClick={() => setCurrentTab(tab)}
          >
            {tab === "메뉴" && <FaUtensils className="text-base" />}
            {tab === "중계" && <FiTv className="text-base" />}
            {tab}
          </Button>
        ))}
      </div>

      {/* 탭 내용 */}
      <div className="flex-1 p-6 text-base overflow-y-auto">
        {/* 홈 탭 */}
        {currentTab === "홈" && (
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold mb-2">{detail.store_name}</h2>
            <p className="mb-2 text-gray-700">{detail.description}</p>
            <div className="flex items-center gap-2">
              <FiMapPin className="text-xl" />
              <span>{detail.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiClock className="text-xl" />
              <span>{detail.opening_hours}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiPhone className="text-xl" />
              <span>{detail.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <FiFileText className="text-xl" />
              <span>{detail.type}</span>
            </div>
          </div>
        )}

        {/* 메뉴 탭 */}
        {currentTab === "메뉴" && (
          <ul className="grid grid-cols-1 gap-3">
            {(() => {
              let menus: string[] = [];
              if (typeof detail.menus === "string") {
                menus = detail.menus
                  .split(",")
                  .map((m) => m.trim())
                  .filter(Boolean);
              } else if (Array.isArray(detail.menus)) {
                menus = detail.menus;
              }

              return menus.length > 0 ? (
                menus.map((menu, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center gap-3 px-5 py-3 ${
                      idx !== menus.length - 1 ? "border-b border-gray-200" : ""
                    }`}
                  >
                    <FaUtensils className="text-primary1 text-lg" />
                    <span className="font-medium text-gray-700">{menu}</span>
                  </li>
                ))
              ) : (
                <li className="py-3 text-gray-400 text-center">
                  메뉴 정보 없음
                </li>
              );
            })()}
          </ul>
        )}

        {/* 중계 탭 */}
        {currentTab === "중계" && (
          <ul className="flex flex-col gap-4">
            {detail.broadcasts.length > 0 ? (
              detail.broadcasts.map((b, idx) => (
                <li
                  key={idx}
                  className="rounded-xl p-4 flex flex-col gap-1 border border-primary2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FiTv className="text-primary5" />
                    <span className="font-semibold">
                      {b.league} {b.sport}
                    </span>
                    <span className="ml-auto text-xs text-gray-400">
                      {b.match_date} {b.match_time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                    {b.team_one}
                    <span className="mx-1 text-primary5">vs</span>
                    {b.team_two}
                    {b.etc && (
                      <span className="ml-2 text-xs bg-primary3 text-primary5 rounded px-2 py-0.5">
                        {b.etc}
                      </span>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <li className="py-6 text-gray-400 text-center">
                예정된 중계가 없습니다.
              </li>
            )}
          </ul>
        )}
      </div>
    </aside>
  );
}
