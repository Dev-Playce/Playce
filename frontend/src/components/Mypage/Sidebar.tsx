import type { ReactNode } from "react";
import { FaStar, FaUserEdit, FaStore } from "react-icons/fa";
import useMypageStore from "../../stores/mypageStore";
import useBroadcastStore from "../../stores/broadcastStore";

interface SidebarProps {
  selected: "favorite" | "profile" | "restaurant";
  onSelect: (tab: "favorite" | "profile" | "restaurant") => void;
}

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full h-[40px] px-4 rounded-lg text-left
        transition-colors duration-150
        ${active ? "bg-primary2" : "bg-transparent"}
        hover:bg-primary2`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
};

const Sidebar = ({ selected, onSelect }: SidebarProps) => {
  const { setRestaurantSubpage } = useMypageStore();
  const { resetYMD } = useBroadcastStore();
  return (
    <div className="w-[220px] h-full bg-primary4 px-4 py-10 flex flex-col gap-2">
      <div className="flex flex-col gap-2 mt-1">
        <SidebarItem
          icon={<FaStar />}
          label="즐겨찾기"
          active={selected === "favorite"}
          onClick={() => {
            onSelect("favorite");
            setRestaurantSubpage("restaurant-home");
            resetYMD();
          }}
        />
        <SidebarItem
          icon={<FaUserEdit />}
          label="내 정보"
          active={selected === "profile"}
          onClick={() => {
            onSelect("profile");
            setRestaurantSubpage("restaurant-home");
            resetYMD();
          }}
        />
        <SidebarItem
          icon={<FaStore />}
          label="식당 관리"
          active={selected === "restaurant"}
          onClick={() => onSelect("restaurant")}
        />
      </div>
    </div>
  );
};

export default Sidebar;
