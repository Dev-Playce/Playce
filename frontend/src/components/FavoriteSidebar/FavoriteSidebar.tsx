import { useState } from "react";
import { FiStar } from "react-icons/fi";
import { dummyRestaurantDetails } from "../../data/dummyRestaurantDetail";
import useFavoriteStore from "../../stores/favoriteStore";
import FavoriteCardList from "../Favorite/FavoriteCardList";

export default function FavoriteSidebar() {
  const { favoriteIds, removeFavorite } = useFavoriteStore();
  const [expanded, setExpanded] = useState(false);

  const favorites = dummyRestaurantDetails
    .filter((store) => favoriteIds.includes(store.id))
    .map((store) => ({
      store_id: store.id,
      store_name: store.store_name,
      main_img: store.img_list?.[0] || "",
      address: store.address,
      type: store.type,
    }));

  const visibleFavorites = expanded ? favorites : favorites.slice(0, 3);

  return (
    <section className="w-full bg-white px-4 pt-4 pb-3 rounded-xl shadow">
      <button
        className="flex items-center w-full h-8 border-b border-gray-100 bg-white group mb-3"
        onClick={() => setExpanded((prev) => !prev)}
        aria-label="즐겨찾기 펼치기"
      >
        <FiStar className="text-primary1 text-xl mr-2" />
        <span className="text-lg font-bold flex-1 text-left">즐겨찾기</span>
        <span className="text-xs text-gray-400 mr-2">
          {expanded ? "접기" : "더보기"}
        </span>
      </button>
      <FavoriteCardList
        stores={visibleFavorites}
        onRemove={removeFavorite}
        compact={true}
      />
    </section>
  );
}
