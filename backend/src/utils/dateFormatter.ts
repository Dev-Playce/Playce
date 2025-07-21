export const formatDateToKST = (date: Date): string => {
  const utc = date.getTime(); // UTC 기준 밀리초
  const kstOffset = 9 * 60 * 60 * 1000; // +9시간
  const kstDate = new Date(utc + kstOffset);

  const yyyy = kstDate.getFullYear();
  const MM = String(kstDate.getMonth() + 1).padStart(2, '0');
  const dd = String(kstDate.getDate()).padStart(2, '0');
  const hh = String(kstDate.getHours()).padStart(2, '0');
  const mm = String(kstDate.getMinutes()).padStart(2, '0');
  const ss = String(kstDate.getSeconds()).padStart(2, '0');

  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
};
