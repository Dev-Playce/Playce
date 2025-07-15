export type Broadcast = {
  broadcast_id: number;
  match_date: string;
  match_time: string;
  sport: string;
  league: string;
  team_one: string;
  team_two: string;
  etc: string;
};

export type StoreWithBroadcasts = {
  store_id: number;
  store_name: string;
  type: string;
  main_img: string | null;
  address: string;
  lat: number;
  lng: number;
  broadcasts: Broadcast[];
};
