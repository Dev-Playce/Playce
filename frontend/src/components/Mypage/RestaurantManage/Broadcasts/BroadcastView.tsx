import { useEffect, useState } from "react";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { FaBars, FaPlus, FaRegCalendarAlt } from "react-icons/fa";

import TabList from "./TabLists";
import Calendar from "./Calendar";
import BroadcastRegister from "./BroadcastRegister";
import BroadcastEdit from "./BroadcastEdit";

import useBroadcastStore, { dateInfo } from "../../../../stores/broadcastStore";
import useBroadcastFormStore from "../../../../stores/broadcastFormStore";
import { getBroadcast } from "../../../../api/broadcast.api";
import getDaysInMonth from "../../../../utils/getDaysInMonth";
import useMypageStore from "../../../../stores/mypageStore";

const BroadcastView = () => {
  const { yearNum, monthNum } = dateInfo;
  const twoMonthsAgo = new Date(yearNum, monthNum - 2);
  const twoMonthsLater = new Date(yearNum, monthNum + 2);
  const { setRestaurantSubpage } = useMypageStore();

  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);

  const {
    year,
    month,
    viewOption,
    setYear,
    setMonth,
    setDate,
    setViewOption,
    storeId,
    setBroadcastLists,
  } = useBroadcastStore();

  const { setEditingId, resetForm } = useBroadcastFormStore();

  const isInTwoMonths = (year: number, month: number) => {
    const target = new Date(year, month - 1);
    return target >= twoMonthsAgo && target <= twoMonthsLater;
  };

  const handleLeft = () => {
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    setYear(newYear);
    setMonth(newMonth);
    setDate(getDaysInMonth(newYear, newMonth));
  };

  const handleRight = () => {
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    setYear(newYear);
    setMonth(newMonth);
    setDate(1);
  };

  const fetchBroadcasts = async () => {
    if (!storeId) return;
    try {
      const broadcasts = await getBroadcast(storeId);
      setBroadcastLists(broadcasts);
    } catch (error) {
      console.error("중계 일정 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchBroadcasts();
  }, [storeId]);

  if (formMode === "create") {
    return (
      <BroadcastRegister
        onClose={() => {
          setFormMode(null);
          fetchBroadcasts();
        }}
      />
    );
  }

  if (formMode === "edit") {
    return (
      <BroadcastEdit
        onClose={() => {
          setFormMode(null);
          fetchBroadcasts();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col pl-2">
      <div className="flex text-[28px] items-center justify-between mb-5 gap-3">
        <button
          className="text-[25px]"
          onClick={() => {
            resetForm();
            setEditingId(null);
            setRestaurantSubpage("broadcast-register");
          }}
        >
          <FaPlus />
        </button>

        <div className="flex items-center gap-3">
          <button
            className="hover:cursor-pointer text-[35px] disabled:text-lightgray"
            onClick={handleLeft}
            disabled={
              !isInTwoMonths(
                month > 1 ? year : year - 1,
                month > 1 ? month - 1 : 12
              )
            }
          >
            <MdKeyboardArrowLeft />
          </button>
          {year}.{month < 10 ? `0${month}` : month}
          <button
            className="hover:cursor-pointer text-[35px] disabled:text-lightgray"
            onClick={handleRight}
            disabled={
              !isInTwoMonths(
                month < 12 ? year : year + 1,
                month < 12 ? month + 1 : 1
              )
            }
          >
            <MdKeyboardArrowRight />
          </button>
        </div>

        <button
          className="text-[25px]"
          onClick={() => {
            setViewOption(viewOption === "tab" ? "calendar" : "tab");
          }}
        >
          {viewOption === "tab" ? <FaRegCalendarAlt /> : <FaBars />}
        </button>
      </div>

      {viewOption === "tab" ? (
        <TabList
          onEditClick={() => {
            setFormMode("edit");
          }}
        />
      ) : (
        <Calendar />
      )}
    </div>
  );
};

export default BroadcastView;
