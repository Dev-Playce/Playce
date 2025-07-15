import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { getDay } from "../../../../utils/getDay";
import getDaysInMonth from "../../../../utils/getDaysInMonth";
import { useRef, useEffect, useState } from "react";
import useBroadcastStore from "../../../../stores/broadcastStore";
import useBroadcastFormStore from "../../../../stores/broadcastFormStore";
import BroadcastActionButtons from "./BroadcastActionButtons";
import { deleteBroadcast, getBroadcast } from "../../../../api/broadcast.api";
import { formatTime } from "../../../../utils/formatTime";
import { fetchSports } from "../../../../api/staticdata.api";
import useMypageStore from "../../../../stores/mypageStore";

const TabList = () => {
  const { year, month, date, setDate } = useBroadcastStore();
  const tabRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const scrollAmount = 150;
  const {
    broadcastLists = [],
    storeId,
    setBroadcastLists,
  } = useBroadcastStore();
  const { setEditingId } = useBroadcastFormStore();
  const { setRestaurantSubpage } = useMypageStore();

  const [, setSports] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetchSports().then(setSports);
  }, []);

  useEffect(() => {
    setTabRef(tabRef);
    setItemRefs(itemRefs);
  }, []);

  const { setTabRef, setItemRefs, scrollDateCenter } = useBroadcastStore();

  useEffect(() => {
    setTimeout(() => {
      scrollDateCenter();
    }, 0);
  }, []);

  const handleScrollLeft = () => {
    tabRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  };

  const handleScrollRight = () => {
    tabRef.current?.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  const dateArray = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, i) => i + 1
  );

  const currentDate = `${year}-${String(month).padStart(2, "0")}-${String(
    date
  ).padStart(2, "0")}`;

  const broadcastsForSelectedDate = broadcastLists
    .filter((b) => b.match_date === currentDate)
    .sort((a, b) => a.match_time.localeCompare(b.match_time));

  const handleDelete = async (id: number) => {
    if (!confirm("중계 일정을 삭제하시겠습니까?")) return;
    try {
      await deleteBroadcast(id);
      alert("삭제되었습니다.");
      const broadcasts = await getBroadcast(storeId);
      setBroadcastLists(broadcasts);
    } catch (error) {
      console.error("삭제 실패", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();

  return (
    <div>
      <div className="flex items-center justify-center mt-2">
        <button
          className="hover:cursor-pointer text-[25px] disabled:text-lightgray mr-5 outline-none"
          onClick={handleScrollLeft}
        >
          <MdKeyboardArrowLeft />
        </button>
        <div
          className="flex gap-3 overflow-x-auto scrollbar-hide pt-2"
          style={{ maxWidth: "calc(100% - 60px)" }}
          ref={tabRef}
        >
          {dateArray.map((d) => {
            const isToday =
              d === todayDate && month === todayMonth && year === todayYear;

            return (
              <div
                key={d}
                ref={(el) => {
                  if (el) itemRefs.current.set(d, el);
                  else itemRefs.current.delete(d);
                }}
                className={`flex flex-col justify-center items-center w-8 text-center flex-shrink-0 hover:cursor-pointer
                            ${
                              d === date
                                ? "text-primary5 font-semibold"
                                : "text-black"
                            }`}
                onClick={() => setDate(d)}
              >
                <div
                  className={`flex flex-col px-1 rounded h-[45px] ${
                    isToday ? "border border-primary5" : ""
                  }`}
                >
                  <p className="text-[14px] leading-tight mb-[1px]">
                    {getDay(year, month, d)}
                  </p>
                  <p className="text-[19px] leading-tight">{d}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button
          className="hover:cursor-pointer text-[25px] disabled:text-lightgray ml-5 outline-none"
          onClick={handleScrollRight}
        >
          <MdKeyboardArrowRight />
        </button>
      </div>

      <div className="mt-3 space-y-1 border-t">
        {broadcastsForSelectedDate.length > 0 ? (
          broadcastsForSelectedDate.map((b, index) => {
            return (
              <div
                key={`${b.broadcast_id}-${index}`}
                className="flex justify-between border-b"
              >
                <div className="p-3 flex flex-col text-[15px] w-0 flex-1">
                  <span className="font-semibold truncate">
                    [{b.league}] {formatTime(b.match_time)}
                  </span>
                  <span className="text-[16px] min-h-[18px] leading-[22px] block">
                    {b.team_one && b.team_two
                      ? `${b.team_one} vs ${b.team_two}`
                      : ""}
                  </span>
                  {b.etc && (
                    <span className="text-darkgray truncate">{b.etc}</span>
                  )}
                </div>
                <div className="p-3 flex text-[25px] gap-6 items-center shrink-0">
                  <BroadcastActionButtons
                    onEdit={() => {
                      setEditingId(b.broadcast_id);
                      setRestaurantSubpage("broadcast-edit");
                    }}
                    onDelete={() => handleDelete(b.broadcast_id)}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-3">중계 정보가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default TabList;
