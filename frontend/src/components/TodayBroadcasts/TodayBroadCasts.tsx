import { useState, useMemo } from "react";
import { FiTv, FiImage } from "react-icons/fi";
import useMapStore from "../../stores/mapStore";
import RestaurantDetailComponent from "../RestaurantDetail/RestaurantDetail";
import type { Broadcast } from "../../types/restaurant.types";

export default function TodayBroadcastSidebar() {
  const restaurants = useMapStore((state) => state.restaurants);
  const [selectedSport, setSelectedSport] = useState<string>("축구");
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(null);
  const today = new Date().toISOString().slice(0, 10);

  type TodayBroadcast = Broadcast & {
    store_name: string;
    store_id: number;
    main_img: string | null;
    address: string;
    type: string;
  };

  const todayBroadcasts = useMemo(() => {
    const result: TodayBroadcast[] = [];
    restaurants.forEach((store) => {
      (store.broadcasts || []).forEach((b) => {
        if (b.match_date === today) {
          result.push({
            ...b,
            store_name: store.store_name,
            store_id: store.store_id,
            main_img: store.main_img,
            address: store.address,
            type: store.type,
          });
        }
      });
    });
    return result;
  }, [restaurants, today]);

  const SPORTS = Array.from(new Set(todayBroadcasts.map((b) => b.sport)));
  const filtered = todayBroadcasts.filter((b) => b.sport === selectedSport);

  return (
    <section className="w-full bg-white px-5 pt-6 pb-4 rounded-2xl border border-gray-100">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-1">
        <FiTv className="text-primary1 text-xl" />
        <h3 className="text-lg font-bold">오늘의 중계일정</h3>
      </div>
      <div className="text-sm text-gray-500 mb-4 font-medium tracking-tight">
        지도에서 탐색한 가게의 중계일정만 보여드려요.
      </div>
      {/* 종목 탭 */}
      <nav className="flex gap-2 mb-4 border-b border-gray-100 pb-1">
        {SPORTS.length === 0 ? (
          <span className="text-gray-400 text-sm">중계 종목 없음</span>
        ) : (
          SPORTS.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-3 pb-1 text-sm font-semibold rounded-t-lg border-b-2 ${
                selectedSport === sport
                  ? "border-primary5 text-primary5 bg-primary4"
                  : "border-transparent text-gray-400 hover:text-primary5 hover:bg-primary4/50"
              } transition-colors`}
              style={{ background: "none" }}
            >
              {sport}
            </button>
          ))
        )}
      </nav>
      {/* 카드형 경기 리스트 */}
      <ul>
        {filtered.length === 0 ? (
          <li className="text-gray-400 py-8 text-center text-base">
            오늘 중계되는 경기가 없습니다.
          </li>
        ) : (
          filtered.map((game, idx) => (
            <li
              key={idx}
              className="bg-white rounded-xl border border-gray-200 px-4 py-3 mb-3 flex items-center gap-4 cursor-pointer hover:bg-primary4 transition-colors"
              onClick={() => setSelectedStoreId(game.store_id)}
            >
              {/* 대표 이미지(없으면 아이콘) */}
              {game.main_img ? (
                <img
                  src={game.main_img}
                  alt={game.store_name}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-2xl">
                  <FiImage />
                </div>
              )}
              {/* 경기 정보 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-primary5 truncate">
                    {game.store_name}
                  </span>
                  <span className="text-xs bg-primary4 text-primary5 rounded px-2 py-0.5 ml-2">
                    {game.league}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800">
                    {game.team_one}
                  </span>
                  <span className="mx-1 text-xs text-gray-400">vs</span>
                  <span className="font-semibold text-gray-800">
                    {game.team_two}
                  </span>
                  <span className="ml-auto text-xs text-gray-500">
                    {game.match_time}
                  </span>
                </div>
                {game.etc && (
                  <div className="mt-1 text-xs text-primary5">{game.etc}</div>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
      {/* 상세보기 모달/사이드바 */}
      {selectedStoreId && (
        <RestaurantDetailComponent
          storeId={selectedStoreId}
          onClose={() => setSelectedStoreId(null)}
        />
      )}
    </section>
  );
}
