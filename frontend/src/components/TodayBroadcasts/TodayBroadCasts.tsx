import { useState } from "react";
import { FiTv } from "react-icons/fi";

// 더미 데이터
const broadcasts = [
  {
    match_date: "2025-06-26",
    match_time: "18:30",
    sport: "야구",
    league: "KBO",
    team_one: {
      name: "삼성",
      logo: "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/8/8d/Samsung_Lions_Emblem.svg",
    },
    team_two: {
      name: "롯데",
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Lotte_Giants_Emblem.svg",
      home: true,
    },
    etc: "",
  },
  {
    match_date: "2025-06-26",
    match_time: "18:30",
    sport: "야구",
    league: "KBO",
    team_one: {
      name: "NC",
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/NC_Dinos_Emblem.svg",
    },
    team_two: {
      name: "KT",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/KT_Wiz_Emblem.svg",
      home: true,
    },
    etc: "",
  },
  {
    match_date: "2025-06-26",
    match_time: "21:00",
    sport: "축구",
    league: "EPL",
    team_one: {
      name: "리버풀",
      logo: "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",
    },
    team_two: {
      name: "맨유",
      logo: "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg",
    },
    etc: "빅매치",
  },
];

const SPORTS = ["야구", "해외야구", "축구", "해외축구", "농구", "배구"];

export default function TodayBroadcastSidebar() {
  const [selectedSport, setSelectedSport] = useState("야구");
  const today = "2025-06-26";
  const filtered = broadcasts.filter(
    (b) => b.match_date === today && b.sport === selectedSport
  );

  return (
    <section className="w-full bg-white px-4 pb-3">
      <h3 className="text-lg font-bold mb-3 flex items-center">
        <FiTv className="text-primary1 text-xl mr-2" />
        오늘의 중계일정
      </h3>
      {/* 종목 탭 */}
      <nav className="flex gap-2 mb-3 border-b border-gray-100 pb-1">
        {SPORTS.map((sport) => (
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
        ))}
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
              {/* 팀1 */}
              <img
                src={game.team_one.logo}
                alt={game.team_one.name}
                className="w-7 h-7 rounded-full bg-gray-100 object-cover"
              />
              <span className="font-semibold text-gray-800">
                {game.team_one.name}
              </span>
              {/* VS */}
              <span className="mx-1 text-xs text-gray-400">vs</span>
              {/* 팀2 */}
              <img
                src={game.team_two.logo}
                alt={game.team_two.name}
                className="w-7 h-7 rounded-full bg-gray-100 object-cover"
              />
              <span className="font-semibold text-gray-800">
                {game.team_two.name}
              </span>
              {/* 홈 표시 */}
              {game.team_two.home && (
                <span className="ml-1 text-xs bg-gray-200 text-gray-700 rounded px-1.5 py-0.5">
                  홈
                </span>
              )}
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
