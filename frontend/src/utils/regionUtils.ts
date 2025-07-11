import type { SelectedRegion } from "../types/staticdata";

export const getUpdatedRegionSelection = (
  current: SelectedRegion[],
  bigRegion: string,
  smallRegion: string,
): SelectedRegion[] => {
  const isFullSelected = current.some(
    (r) => r.bigRegion === bigRegion && r.smallRegion === "전체"
  );

  if (smallRegion === "전체") {
    const filtered = current.filter((r) => r.bigRegion !== bigRegion);
    return [...filtered, { bigRegion, smallRegion: "전체" }];
  }

  const updated = isFullSelected
    ? current.filter(
        (r) => !(r.bigRegion === bigRegion && r.smallRegion === "전체")
      )
    : [...current];

  const exists = updated.some(
    (r) => r.bigRegion === bigRegion && r.smallRegion === smallRegion
  );

  if (exists) {
    return updated.filter(
      (r) => !(r.bigRegion === bigRegion && r.smallRegion === smallRegion)
    );
  } else {
    return [...updated, { bigRegion, smallRegion }];
  }
};
