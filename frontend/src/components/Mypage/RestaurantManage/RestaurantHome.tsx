import useMypageStore from "../../../stores/mypageStore";
import useAuthStore from "../../../stores/authStore";
import { useEffect, useState } from "react";
import { deleteStore, myStores } from "../../../api/restaurant.api";
import { apiErrorStatusMessage } from "../../../utils/apiErrorStatusMessage";
import type { AxiosError } from "axios";
import { FiEdit2, FiTrash2, FiTv } from "react-icons/fi";
import RestaurantDetailComponent from "../../RestaurantDetail/RestaurantDetail";
import type { MyStore } from "../../../types/restaurant.types";
import Button from "../../Common/Button";
import useBroadcastStore from "../../../stores/broadcastStore";

const RestaurantHome = () => {
  const [stores, setStores] = useState<MyStore[]>([]);
  const [selectedDetailStoreId, setSelectedDetailStoreId] = useState<
    number | null
  >(null);
  const { setRestaurantSubpage, setRestaurantEditId, setRestaurantEditName } =
    useMypageStore();
  const { setStore } = useBroadcastStore();
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
              {/* 중계 */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setStore(store.store_name, store.store_id);
                  setRestaurantSubpage("schedule-view-broadcasts");
                }}
                scheme="storeCircle"
                icon={<FiTv className="text-primary5 text-xl" />}
                hoverColor="lightgray"
              ></Button>
              {/* 수정 버튼 */}

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setRestaurantEditId(store.store_id);
                  setRestaurantEditName(store.store_name);
                  setRestaurantSubpage("restaurant-edit");
                }}
                scheme="storeCircle"
                icon={<FiEdit2 className="text-blue-500 text-xl" />}
                hoverColor="blue-50"
              ></Button>
              {/* 삭제 버튼 */}
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(store.store_id);
                }}
                scheme="storeCircle"
                icon={<FiTrash2 className="text-red-500 text-xl" />}
                hoverColor="red-50"
              ></Button>
              {/* 플로팅 버튼 */}
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

export default RestaurantHome;
