import { useEffect, useState } from "react";
import { FiChevronLeft, FiEdit2, FiTrash2 } from "react-icons/fi";
import type { MyStore } from "../../../types/restaurant.types.ts";
import useMypageStore from "../../../stores/mypageStore.ts";
import { deleteStore, myStores } from "../../../api/restaurant.api.ts";
import RestaurantDetailComponent from "../../RestaurantDetail/RestaurantDetail.tsx";
import { apiErrorStatusMessage } from "../../../utils/apiErrorStatusMessage.ts";
import type { AxiosError } from "axios";
import useAuthStore from "../../../stores/authStore.ts";

const StoreList = () => {
  const [stores, setStores] = useState<MyStore[]>([]);
  const [selectedDetailStoreId, setSelectedDetailStoreId] = useState<
    number | null
  >(null);
  const { setRestaurantSubpage, setRestaurantEdit } = useMypageStore();
  const { storeLogout } = useAuthStore();

  useEffect(() => {
    const fetchMyStores = async () => {
      try {
        const res = await myStores();
        setStores(res.data);
        return res;
      } catch (error) {
        const errorList = [
          { code: 401, message: "로그인이 만료되었습니다" },
          { code: 404, message: "사용자를 찾을 수 없습니다" },
        ];
        const message = apiErrorStatusMessage(error, errorList);
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        if (status === 401) {
          storeLogout();
        }
        alert(message);
      }
    };

    fetchMyStores();
  }, []);

  // 삭제
  const handleRemove = (id: number) => {
    if (window.confirm("정말 이 식당을 삭제하시겠습니까?")) {
      try {
        deleteStore(id);
        setStores((stores) => stores!.filter((store) => store.store_id !== id));
      } catch (error) {
        const errorList = [
          {
            code: 400,
            message: "사업자등록번호 또는 지역이 유효하지 않습니다",
          },
          { code: 401, message: "로그인이 만료되었습니다" },
          { code: 403, message: "식당 삭제 권한이 없습니다" },
          { code: 404, message: "식당 또는 사용자를 찾을 수 없습니다" },
        ];
        const message = apiErrorStatusMessage(error, errorList);
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        if (status === 401) {
          storeLogout();
        }
        alert(message);
      }
    }
  };

  return (
    <section>
      {stores.length === 0 ? (
        <div className="text-gray-400 text-center py-20 text-lg tracking-wide">
          등록된 식당이 없습니다.
        </div>
      ) : (
        <ul>
          {stores.map((store) => (
            <div
              key={store.store_id}
              className="flex items-center gap-4 p-3 border-b border-gray-100 last:border-b-0 hover:bg-primary4 hover:cursor-pointer"
              onClick={() => {
                setSelectedDetailStoreId(store.store_id);
                // setRestaurantEdit(store.store_id);
                // setRestaurantSubpage("schedule-view-broadcasts");
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
                  setRestaurantEdit(store.store_id);
                  setRestaurantSubpage("restaurant-edit");
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
            </div>
          ))}
        </ul>
      )}
      {/* 상세보기 */}
      {selectedDetailStoreId && (
        <RestaurantDetailComponent
          storeId={selectedDetailStoreId}
          onClose={() => setSelectedDetailStoreId(null)}
        />
      )}
    </section>
  );
};

export default StoreList;
