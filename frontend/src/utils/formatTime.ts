export const formatTime = (time: string) => {
  const [hour, minute] = time.split(":");
  const h = parseInt(hour, 10);
  const m = parseInt(minute, 10);

  if (m === 0) {
    return `${h}시`;
  }
  return `${h}시 ${m}분`;
};
