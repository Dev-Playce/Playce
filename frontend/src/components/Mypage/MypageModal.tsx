import { useState } from "react";
import ModalBase from "../Common/ModalBase";
import Sidebar from "../Mypage/Sidebar";
import FavoriteList from "./FavoriteList";
import UserInfo from "./UserInfo";
import RestaurantManager from "./RestaurantManage/RestaurantManager";
import { useUserInfo } from "../../hooks/useUser";

type TabType = "favorite" | "profile" | "restaurant";

export interface MypageProps {
  onClose: () => void;
}

const MypageModal = ({ onClose }: MypageProps) => {
  const [selectedTab, setSelectedTab] = useState<TabType>("favorite");
  const { data, isLoading, isError } = useUserInfo();
  const user = data?.data;

  return (
    <ModalBase
      onClose={onClose}
      hideHeader
      type="mypage"
      className="bg-gray-400"
    >
      <div className="flex h-[600px] w-full bg-white rounded-xl overflow-hidden ">
        {/* 왼쪽 사이드바 */}
          <div className="w-[30%] h-full bg-primary4 flex-shrink-0">
            <Sidebar selected={selectedTab} onSelect={setSelectedTab} />
          </div>
          {/* 오른쪽 콘텐츠 영역 */}
          <div className="w-[70%] h-full p-6 overflow-y-auto">
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
              <RestaurantManager onClose={onClose} />
            )}
          </div>
      </div>
    </ModalBase>
  );
};

export default MypageModal;
