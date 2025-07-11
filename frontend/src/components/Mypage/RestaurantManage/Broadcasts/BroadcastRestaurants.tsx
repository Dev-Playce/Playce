import { useEffect, useState } from "react";
import { myStores } from "../../../../api/restaurant.api";
import useBroadcastStore from "../../../../stores/broadcastStore";
import useMypageStore from "../../../../stores/mypageStore";
import type { MyStore } from "../../../../types/restaurant.types";

const BroadcastRestaurants = () => {
  const [myStoresList, setMyStoresList] = useState<MyStore[]>([]);
  const { setStore } = useBroadcastStore();
  const { setRestaurantSubpage } = useMypageStore();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await myStores();
        setMyStoresList(res.data);
      } catch (err) {
        console.error("식당 목록 불러오기 실패", err);
      }
    };

    fetchStores();
  }, []);

  return (
    <section>
      {myStoresList.length === 0 ? (
        <div className="text-gray-400 text-center py-20 text-lg tracking-wide">
          등록된 식당이 없습니다.
        </div>
      ) : (
        <ul>
          {myStoresList.map((store) => (
            <div
              key={store.store_id} 
              className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-b-0 hover:bg-primary4 hover:cursor-pointer"
              onClick={() => {
                setStore(store.store_name, store.store_id);
                setRestaurantSubpage("schedule-view-broadcasts");
              }}
            >
              <img
                src={store.main_img || "/noimg.png"}
                alt={store.store_name}
                className="w-16 h-16 rounded-lg object-cover border border-gray-200 bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="block text-lg font-semibold text-gray-900 truncate">
                    {store.store_name}
                  </span>
                </div>
                <div className="text-gray-500 text-sm truncate mt-1">
                  {store.address}
                </div>
              </div>
            </div>
          ))}
        </ul>
      )}
    </section>
  );
};

export default BroadcastRestaurants;
