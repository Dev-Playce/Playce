import { httpClient } from "./http";

export const fetchBigRegions = async () => {
  const res = await httpClient.get("/staticdata/bigRegions");
  return res.data.data;
};

export const fetchSmallRegions = async (bigRegionId: number) => {
  const res = await httpClient.get(`/staticdata/smallRegions/${bigRegionId}`);
  return res.data.data;
};

export const fetchSports = async () => {
  const res = await httpClient.get("/staticdata/sports");
  return res.data.data;
};

export const fetchLeagues = async (sportId: number) => {
  const res = await httpClient.get(`/staticdata/leagues/${sportId}`);
  return res.data.data;
};
