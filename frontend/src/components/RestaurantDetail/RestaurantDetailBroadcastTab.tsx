import { Fragment } from "react";
import { FiTv } from "react-icons/fi";
import Button from "../Common/Button";
import type { RestaurantDetail, Broadcast } from "../../types/restaurant.types";
import EmptyMessage from "./EmptyMessage";

// 날짜를 "7월 9일" 형식으로 변환하는 함수
function getKoreanDateString(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 날짜별 그룹핑 함수
function groupByDate(broadcasts: Broadcast[]) {
  return broadcasts.reduce((acc, b) => {
    (acc[b.match_date] = acc[b.match_date] || []).push(b);
    return acc;
  }, {} as Record<string, Broadcast[]>);
}

export default function RestaurantDetailBroadcastTab({
  detail,
  onManage,
}: {
  detail: RestaurantDetail;
  onManage?: () => void;
}) {
  const grouped = groupByDate(detail.broadcasts);

  return (
    <div>
      <ul>
        {detail.broadcasts.length === 0 ? (
          <li>
            <EmptyMessage message="중계정보가 없습니다." />
          </li>
        ) : (
          Object.entries(grouped).map(([date, games], groupIdx) => (
            <Fragment key={date}>
              <h4
                className={`mb-2 ${
                  groupIdx === 0 ? "mt-0" : "mt-4"
                } text-sm font-bold text-primary5 flex items-center gap-2`}
              >
                <FiTv className="text-primary5" />
                {getKoreanDateString(date)}
                <span className="text-xs text-gray-400 font-normal ml-2">
                  {date}
                </span>
              </h4>
              {games.map((b, idx) => (
                <li
                  key={idx}
                  className="rounded-xl p-4 mb-3 flex flex-col gap-2 border border-primary2 bg-white"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-primary4 text-primary5 rounded px-2 py-0.5">
                      {b.league}
                    </span>
                    <span className="font-semibold text-gray-700">
                      {b.sport}
                    </span>
                    <span className="ml-auto text-xs text-gray-400">
                      {b.match_time}
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
              ))}
            </Fragment>
          ))
        )}
      </ul>
      {detail.is_owner && (
        <div className="mt-6 flex justify-end">
          <Button scheme="primary" onClick={onManage}>
            중계 관리
          </Button>
        </div>
      )}
    </div>
  );
}
