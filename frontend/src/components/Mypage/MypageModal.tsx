import { useState } from "react";
import ModalBase from "../Common/ModalBase";
import Sidebar from "../Mypage/Sidebar";
import FavoriteList from "./FavoriteList";
import UserInfo from "./UserInfo";
import RestaurantManager from "./RestaurantManage/RestaurantManager";
import useMypageStore from "../../stores/mypageStore";

type TabType = "favorite" | "profile" | "restaurant";

export interface MypageProps {
  onClose: () => void;
}

const MypageModal = ({ onClose }: MypageProps) => {
  const [selectedTab, setSelectedTab] = useState<TabType>("favorite");
  const { setRestaurantSubpage } = useMypageStore();

  const handleClose = () => {
    setRestaurantSubpage("restaurant-home");
    onClose();
  };

  return (
    <ModalBase
      onClose={handleClose}
      type="mypage"
      hideHeader
      className="min-h-[700px] max-h-[700px] min-w-[900px] p-0"
    >
      <div className="flex h-[700px] bg-white rounded-xl overflow-hidden">
        {/* 왼쪽 사이드바 (고정) */}
        <Sidebar selected={selectedTab} onSelect={setSelectedTab} />

        {/* 오른쪽 콘텐츠 영역 (스크롤 가능) */}
        <div className="flex-1 p-6 overflow-y-auto scrollbar-hide">
          {selectedTab === "favorite" && <FavoriteList onClose={onClose} />}
          {selectedTab === "profile" && <UserInfo onClose={onClose} />}
          {selectedTab === "restaurant" && (
            <RestaurantManager onClose={onClose} />
          )}
        </div>
      </div>
    </ModalBase>
  );
};

export default MypageModal;
