import ModalBase from "../Common/ModalBase";
import Sidebar from "../Mypage/Sidebar";
import FavoriteList from "./FavoriteList";
import UserInfo from "./UserInfo";
import RestaurantManager from "./RestaurantManage/RestaurantManager";
import useMypageStore from "../../stores/mypageStore";
import { useUserInfo } from "../../hooks/useUser";
import { FiPlus } from "react-icons/fi";

export interface MypageProps {
  onClose: () => void;
}

const MypageModal = ({ onClose }: MypageProps) => {
  const { selectedTab, setSelectedTab } = useMypageStore();
  const { restaurantSubpage, setRestaurantSubpage } = useMypageStore();

  const handleClose = () => {
    setRestaurantSubpage("restaurant-home");
    onClose();
  };
  const { data, isLoading, isError } = useUserInfo();
  const user = data?.data;

  return (
    <ModalBase
      onClose={handleClose}
      type="mypage"
      hideHeader
      className="bg-gray-400"
    >
      <div className="flex h-[600px] w-full bg-white rounded-xl overflow-hidden ">
        {/* 왼쪽 사이드바 */}
        <div className="w-[30%] h-full bg-primary4 flex-shrink-0">
          <Sidebar selected={selectedTab} onSelect={setSelectedTab} />
        </div>
        {/* 오른쪽 콘텐츠 영역 */}
        <div className="relative w-[70%] h-full p-6 overflow-y-auto">
          {/* 콘텐츠 */}
          {selectedTab === "favorite" && <FavoriteList onClose={onClose} />}
          {selectedTab === "profile" && (
            <>
              {isLoading && <p>로딩 중...</p>}
              {isError && <p>유저 정보를 불러오지 못했습니다.</p>}
              {user && (
                <UserInfo
                  email={user.email}
                  name={user.name}
                  nickname={user.nickname}
                  phone={user.phone}
                  onClose={onClose}
                />
              )}
            </>
          )}
          {selectedTab === "restaurant" && (
            <div>
              <RestaurantManager onClose={onClose} />
              {/* 식당 등록 */}
              {restaurantSubpage === "restaurant-home" && (
                <button
                  onClick={() => {
                    setRestaurantSubpage("restaurant-register");
                  }}
                  className="absolute bottom-10 right-10 w-12 h-12 rounded-full bg-primary5 text-mainText hover:bg-primary1 text-white shadow-lg flex items-center justify-center"
                >
                  <FiPlus />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </ModalBase>
  );
};

export default MypageModal;
