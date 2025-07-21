const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

export default getDaysInMonth;
