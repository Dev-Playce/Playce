export interface Broadcast {
  id: number;
  match_date: string;
  match_time: string;
  sport: string;
  league: string;
  team_one: string;
  team_two: string;
  etc: string;
}

export interface SearchResultItem {
  id: number;
  store_name: string;
  img_url: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
  broadcast: Broadcast;
}
