import useBroadcastStore from "../../../../stores/broadcastStore";
import { getDayIdx } from "../../../../utils/getDay";
import getDaysInMonth from "../../../../utils/getDaysInMonth";

const Calendar = () => {
  const {
    year,
    month,
    setDate,
    setViewOption,
    scrollDateCenter,
    broadcastLists,
  } = useBroadcastStore();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getDayIdx(year, month, 1); // 시작 요일
  const weeks: (number | null)[][] = [];

  let currentDay = 1;
  while (currentDay <= daysInMonth) {
    const week: (number | null)[] = [];

    for (let i = 0; i < 7; i++) {
      if (weeks.length === 0 && i < firstDayOfWeek) {
        week.push(null); // 첫 주 빈칸 채우기
      } else if (currentDay > daysInMonth) {
        week.push(null); // 마지막 주 빈칸
      } else {
        week.push(currentDay++);
      }
    }

    weeks.push(week);
  }

  const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDate = today.getDate();

  const broadcastCountMap = broadcastLists.reduce((acc, item) => {
    const date = new Date(item.match_date);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const key = `${y}-${m}-${d}`;

    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-[415px]">
      <div className="border-[2px]">
        <div className="grid grid-cols-7 font-semibold">
          {weekdayLabels.map((day) => (
            <div
              className="flex justify-center items-center py-2 px-4 border-[1px] border-b-[2px]"
              key={day}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {weeks.flat().map((day, idx) => {
            const key = day ? `${year}-${month}-${day}` : null;
            const isToday =
              year === todayYear && month === todayMonth && day === todayDate;

            return (
              <div
                className={`flex justify-center items-center border-[1px] ${
                  day ? "hover:bg-lightgray hover:cursor-pointer" : ""
                }`}
                key={idx}
              >
                {day ? (
                  <div
                    className="flex flex-col w-full px-3 py-2 gap-1"
                    onClick={() => {
                      setDate(day);
                      setViewOption("tab");
                      scrollDateCenter();
                    }}
                  >
                    <div className="flex justify-center font-semibold">
                      {isToday ? (
                        <div className="w-6 h-6 flex items-center justify-center rounded-full bg-primary5 text-white">
                          <span>{day}</span>
                        </div>
                      ) : (
                        <span>{day}</span>
                      )}
                    </div>
                    <div>
                      {key && broadcastCountMap[key] ? (
                        <span className="border-l-[3px] border-primary5 pl-1">
                          {broadcastCountMap[key]}개
                        </span>
                      ) : (
                        <span>&nbsp;</span>
                      )}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
