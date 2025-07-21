export const regionMap: Record<string, string[]> = {
  서울: ["서울 전체", "강남구", "서초구", "마포구", "송파구"],
  경기: ["경기 전체", "수원시", "성남시", "용인시", "하남시"],
  대전: ["대전 전체", "중구", "유성구", "서구"],
};

export const getMainRegion = (sub: string): string => {
  return (
    Object.entries(regionMap).find(([, subs]) => subs.includes(sub))?.[0] || ""
  )
};