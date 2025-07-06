import { useEffect, useState } from "react";
import { dummyRestaurantDetails } from "../../../data/dummyRestaurantDetail";
import { FiChevronLeft, FiEdit2, FiTrash2 } from "react-icons/fi";
import DetailStores from "../../RestaurantDetail/RestaurantDetail.tsx";
import type { MyStore } from "../../../types/restaurant.types";
import useMypageStore from "../../../stores/mypageStore.ts";
import { dummyMyStores } from "../../../data/dummy-my-stores.ts";
import { deleteStore } from "../../../api/restaurant.api.ts";

const RestaurantList = () => {
  const [stores, setStores] = useState<MyStore[]>([]);
  const [selectedDetailStoreId, setSelectedDetailStoreId] = useState<
    number | null
  >(null);
  const { setRestaurantSubpage, setRestaurantEdit } = useMypageStore();

  // Todo: 내 식당 목록 불러오기
  useEffect(() => {
    const myStores = dummyMyStores.stores;
    setStores(myStores);
  }, []);

  // 삭제
  const handleRemove = (id: number) => {
    if (window.confirm("정말 이 식당을 삭제하시겠습니까?")) {
      deleteStore(id);
      setStores((stores) => stores!.filter((store) => store.store_id !== id));
    }
  };

  return (
    <section>
      {stores.length === 0 ? (
        <div className="text-gray-400 text-center text-lg tracking-wide">
          등록된 식당이 없습니다.
        </div>
      ) : (
        <>
          <ul>
            {stores.map((store) => (
              <li
                key={store.store_name}
                className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-b-0"
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
                    {/* <span className="text-xs bg-primary3 text-primary5 px-2 py-0.5 rounded-full font-medium">
                      {store.type}
                    </span> */}
                  </div>
                  <div className="text-gray-500 text-sm truncate mt-1">
                    {store.address}
                  </div>
                </div>
                {/* 상세보기 < 버튼 */}
                <button
                  onClick={() => setSelectedDetailStoreId(store.store_id)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:bg-primary4 transition ml-1"
                  aria-label="상세보기"
                >
                  <FiChevronLeft className="text-primary5 text-xl" />
                </button>
                {/* 수정 버튼 */}
                <button
                  onClick={() => {
                    // setFormOpen(true);
                    // setEditTarget(store);
                    setRestaurantEdit(store.store_id);
                    setRestaurantSubpage("restaurant-list-edit");
                  }}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:bg-blue-50 transition ml-1"
                  aria-label="수정"
                >
                  <FiEdit2 className="text-blue-500 text-xl" />
                </button>
                {/* 삭제 버튼 */}
                <button
                  onClick={() => handleRemove(store.store_id)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:bg-red-50 transition ml-1"
                  aria-label="삭제"
                >
                  <FiTrash2 className="text-red-500 text-xl" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
      {/* 상세보기 */}
      {selectedDetailStoreId && (
        <DetailStores
          // Todo: 수정해야 함
          detail={dummyRestaurantDetails[0]}
          storeId={selectedDetailStoreId}
          onClose={() => setSelectedDetailStoreId(null)}
        />
      )}
    </section>
  );
};

export default RestaurantList;
