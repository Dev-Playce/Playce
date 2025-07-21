import { Fragment, useState } from "react";
import { FiTv, FiChevronDown, FiChevronUp, FiVolume2 } from "react-icons/fi";
import Button from "../Common/Button";
import type { RestaurantDetail, Broadcast } from "../../types/restaurant.types";
import EmptyMessage from "./EmptyMessage";
import useBroadcastStore from "../../stores/broadcastStore";
import useMypageStore from "../../stores/mypageStore";

function getKoreanDateString(dateStr: string): string {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatTime(timeStr: string | undefined | null): string {
  if (!timeStr) return "";
  return timeStr.split(":").slice(0, 2).join(":");
}

function groupByDate(broadcasts: Broadcast[]): Record<string, Broadcast[]> {
  return broadcasts.reduce((acc, b) => {
    (acc[b.match_date] = acc[b.match_date] || []).push(b);
    return acc;
  }, {} as Record<string, Broadcast[]>);
}

function compareDate(a: string, b: string): number {
  return a.localeCompare(b);
}

function compareTime(a: string, b: string): number {
  return a.localeCompare(b);
}

interface RestaurantDetailBroadcastTabProps {
  detail: RestaurantDetail;
  storeId: number;
  onManage?: () => void;
}

export default function RestaurantDetailBroadcastTab({
  detail,
  storeId,
}: RestaurantDetailBroadcastTabProps) {
  const [showPast, setShowPast] = useState(false);
  const today: string = new Date().toISOString().slice(0, 10);

  const futureAndToday: Broadcast[] = [];
  const past: Broadcast[] = [];
  detail.broadcasts.forEach((b: Broadcast) => {
    if (compareDate(b.match_date, today) >= 0) {
      futureAndToday.push(b);
    } else {
      past.push(b);
    }
  });

  const groupedFuture: Record<string, Broadcast[]> =
    groupByDate(futureAndToday);
  const groupedPast: Record<string, Broadcast[]> = groupByDate(past);

  const sortedFutureDates: string[] = Object.keys(groupedFuture).sort((a, b) =>
    compareDate(a, b)
  );
  const sortedPastDates: string[] = Object.keys(groupedPast).sort((a, b) =>
    compareDate(b, a)
  );

  // ✅ 날짜 그룹마다 시간 정렬
  sortedFutureDates.forEach((date) => {
    groupedFuture[date].sort((a, b) => compareTime(a.match_time, b.match_time));
  });
  sortedPastDates.forEach((date) => {
    groupedPast[date].sort((a, b) => compareTime(a.match_time, b.match_time));
  });

  const { setStore } = useBroadcastStore();
  const { setRestaurantSubpage, setSelectedTab, setIsMypageOpen } =
    useMypageStore();

  const ETC_LABEL = (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary5 mr-1">
      <FiVolume2 className="text-primary5 text-base" />
    </span>
  );

  return (
    <div>
      <ul>
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
                      {formatTime(b.match_time)}
                    </span>
                  </div>
                  {b.team_one && b.team_two ? (
                    <>
                      <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                        <span>{b.team_one}</span>
                        <span className="mx-1 text-primary5">vs</span>
                        <span>{b.team_two}</span>
                      </div>
                      {b.etc && (
                        <div className="mt-1 flex items-start gap-2 text-xs text-gray-700">
                          {ETC_LABEL}
                          <span className="whitespace-pre-line break-words">
                            {b.etc}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    b.etc && (
                      <div className="mt-1 flex items-start gap-2 text-xs text-gray-700">
                        {ETC_LABEL}
                        <span className="whitespace-pre-line break-words">
                          {b.etc}
                        </span>
                      </div>
                    )
                  )}
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
                          {formatTime(b.match_time)}
                        </span>
                      </div>
                      {b.team_one && b.team_two ? (
                        <>
                          <div className="flex items-center gap-2 text-base font-bold text-gray-500">
                            <span>{b.team_one}</span>
                            <span className="mx-1 text-gray-400">vs</span>
                            <span>{b.team_two}</span>
                          </div>
                          {b.etc && (
                            <div className="mt-1 flex items-start gap-2 text-xs text-gray-700">
                              {ETC_LABEL}
                              <span className="whitespace-pre-line break-words">
                                {b.etc}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        b.etc && (
                          <div className="mt-1 flex items-start gap-2 text-xs text-gray-700">
                            {ETC_LABEL}
                            <span className="whitespace-pre-line break-words">
                              {b.etc}
                            </span>
                          </div>
                        )
                      )}
                    </li>
                  ))}
                </Fragment>
              ))
            )}
          </ul>
        )}
      </div>

      {detail.is_owner && (
        <div className="mt-10 flex justify-end">
          <Button
            scheme="primary"
            onClick={() => {
              setSelectedTab("restaurant");
              setStore(detail.store_name, storeId);
              setRestaurantSubpage("schedule-view-broadcasts");
              setIsMypageOpen(true);
            }}
          >
            중계 관리
          </Button>
        </div>
      )}
    </div>
  );
}
