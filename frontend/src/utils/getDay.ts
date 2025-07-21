export function getDay(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return days[date.getDay()];
}

export function getDayIdx(year: number, month: number, day: number) {
  return new Date(year, month - 1, day).getDay();
}
