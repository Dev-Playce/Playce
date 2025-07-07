export interface Broadcast {
  match_date: string;
  match_time: string;
  sport: string;
  league: string;
  team_one: string;
  team_two: string;
  etc: string;
}

export type RestaurantBasic = {
  store_id: number;
  store_name: string;
  type: string;
  main_img: string;
  address: string;
  lat: number;
  lng: number;
  broadcasts: Broadcast[];
};

export interface RestaurantDetail {
  id: number;
  store_name: string;
  address: string;
  phone: string;
  opening_hours: string;
  menus: string | string[];
  type: string;
  img_urls: string[];
  description: string;
  broadcasts: Broadcast[];
  // is_owner?: boolean;   // 필요하면 추가
}

export interface MyStore {
  store_id: number;
  store_name: string;
  main_img: string;
  address: string;
}
