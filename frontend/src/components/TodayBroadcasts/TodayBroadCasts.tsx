import { useState, useMemo } from "react";
import { FiTv } from "react-icons/fi";
import useMapStore from "../../stores/mapStore";
import type { broadcast } from "../../types/broadcast";

export default function TodayBroadcastSidebar() {
  const restaurants = useMapStore((state) => state.restaurants); // StoreWithBroadcasts[]
  const [selectedSport, setSelectedSport] = useState<string>("축구");
  const today = new Date().toISOString().slice(0, 10);

  // 오늘의 중계일정만 추출
  type TodayBroadcast = broadcast & {
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

  // 종목 목록 만들기 (오늘 경기 있는 종목만)
  const SPORTS = Array.from(new Set(todayBroadcasts.map((b) => b.sport)));
  const filtered = todayBroadcasts.filter((b) => b.sport === selectedSport);

  return (
    <section className="w-full bg-white px-4 pt-4 pb-3 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-3 flex items-center">
        <FiTv className="text-primary1 text-xl mr-2" />
        오늘의 중계일정
      </h3>
      {/* 종목 탭 */}
      <nav className="flex gap-2 mb-3 border-b border-gray-100 pb-1">
        {SPORTS.length === 0 ? (
          <span className="text-gray-400 text-sm">중계 종목 없음</span>
        ) : (
          SPORTS.map((sport) => (
            <button
              key={sport}
              onClick={() => setSelectedSport(sport)}
              className={`px-2 pb-1 text-sm font-semibold border-b-2 ${
                selectedSport === sport
                  ? "border-primary5 text-primary5"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              } transition`}
              style={{ background: "none" }}
            >
              {sport}
            </button>
          ))
        )}
      </nav>
      {/* 경기 리스트 */}
      <ul>
        {filtered.length === 0 ? (
          <li className="text-gray-400 py-6 text-center">
            오늘 중계되는 경기가 없습니다.
          </li>
        ) : (
          filtered.map((game, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0"
            >
              {/* 가게명(원하면 main_img 등도 활용 가능) */}
              <span className="font-bold text-primary5 mr-2">
                {game.store_name}
              </span>
              {/* 팀1 */}
              <span className="font-semibold text-gray-800">
                {game.team_one}
              </span>
              <span className="mx-1 text-xs text-gray-400">vs</span>
              {/* 팀2 */}
              <span className="font-semibold text-gray-800">
                {game.team_two}
              </span>
              {/* 경기 시간, 리그 */}
              <span className="ml-auto text-xs text-gray-500">
                {game.match_time}
              </span>
              {game.etc && (
                <span className="ml-2 text-xs bg-primary3 text-primary5 rounded px-2 py-0.5">
                  {game.etc}
                </span>
              )}
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
