import { requestHandler } from "./http";

export interface SearchNearbyProps {
  lat: number;
  lng: number;
  radius: number;
}

export const searchNearby = (data: SearchNearbyProps) => {
  return requestHandler("get", "/search/nearby", data);
};
