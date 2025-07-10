import { Fragment, useState } from "react";
import { FiTv, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Button from "../Common/Button";
import type { RestaurantDetail, Broadcast } from "../../types/restaurant.types";
import EmptyMessage from "./EmptyMessage";

// 날짜를 "7월 9일" 형식으로 변환
function getKoreanDateString(dateStr: string) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 날짜별 그룹핑
function groupByDate(broadcasts: Broadcast[]) {
  return broadcasts.reduce((acc, b) => {
    (acc[b.match_date] = acc[b.match_date] || []).push(b);
    return acc;
  }, {} as Record<string, Broadcast[]>);
}

// 날짜 비교 함수 (YYYY-MM-DD 문자열 비교)
function compareDate(a: string, b: string) {
  return a.localeCompare(b);
}

export default function RestaurantDetailBroadcastTab({
  detail,
  onManage,
}: {
  detail: RestaurantDetail;
  onManage?: () => void;
}) {
  const [showPast, setShowPast] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  // 중계일정 분리
  const futureAndToday: Broadcast[] = [];
  const past: Broadcast[] = [];
  detail.broadcasts.forEach((b) => {
    if (compareDate(b.match_date, today) >= 0) {
      futureAndToday.push(b);
    } else {
      past.push(b);
    }
  });

  // 날짜별 그룹핑 및 정렬
  const groupedFuture = groupByDate(futureAndToday);
  const groupedPast = groupByDate(past);

  // 날짜 오름차순(오늘~미래), 내림차순(과거)
  const sortedFutureDates = Object.keys(groupedFuture).sort((a, b) =>
    compareDate(a, b)
  );
  const sortedPastDates = Object.keys(groupedPast).sort((a, b) =>
    compareDate(b, a)
  );

  return (
    <div>
      <ul>
        {/* 오늘+미래 일정 */}
        {futureAndToday.length === 0 ? (
          <li>
            <EmptyMessage message="예정된 중계정보가 없습니다." />
          </li>
        ) : (
          sortedFutureDates.map((date, groupIdx) => (
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
              {groupedFuture[date].map((b, idx) => (
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

      {/* 지난 중계일정 토글 */}
      <div className="mt-6">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-primary5 font-semibold py-2 transition-colors"
          onClick={() => setShowPast((v) => !v)}
        >
          {showPast ? (
            <>
              <FiChevronUp className="inline" />
              지난 중계일정 닫기
            </>
          ) : (
            <>
              <FiChevronDown className="inline" />
              지난 중계일정 보기
            </>
          )}
        </button>
        {showPast && (
          <ul className="mt-2">
            {past.length === 0 ? (
              <li className="text-gray-400 py-6 text-center text-base">
                지난 중계정보가 없습니다.
              </li>
            ) : (
              sortedPastDates.map((date, groupIdx) => (
                <Fragment key={date}>
                  <h4
                    className={`mb-2 ${
                      groupIdx === 0 ? "mt-0" : "mt-4"
                    } text-sm font-bold text-gray-400 flex items-center gap-2`}
                  >
                    <FiTv className="text-gray-400" />
                    {getKoreanDateString(date)}
                    <span className="text-xs text-gray-300 font-normal ml-2">
                      {date}
                    </span>
                  </h4>
                  {groupedPast[date].map((b, idx) => (
                    <li
                      key={idx}
                      className="rounded-xl p-4 mb-3 flex flex-col gap-2 border border-gray-200 bg-gray-50"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-gray-200 text-gray-500 rounded px-2 py-0.5">
                          {b.league}
                        </span>
                        <span className="font-semibold text-gray-500">
                          {b.sport}
                        </span>
                        <span className="ml-auto text-xs text-gray-400">
                          {b.match_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-base font-bold text-gray-500">
                        {b.team_one}
                        <span className="mx-1 text-gray-400">vs</span>
                        {b.team_two}
                        {b.etc && (
                          <span className="ml-2 text-xs bg-gray-100 text-gray-400 rounded px-2 py-0.5">
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
        )}
      </div>

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
