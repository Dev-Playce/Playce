import { FaArrowLeft, FaTimes } from "react-icons/fa";
import useMypageStore from "../../../stores/mypageStore";
import {
  menuItems,
  type ExtendedSubpage,
} from "../../../types/restaurant-manage.types";
import type { MypageProps } from "../MypageModal";
import useBroadcastStore from "../../../stores/broadcastStore";
import Button from "../../Common/Button";
import BroadcastRegister from "./Broadcasts/BroadcastRegister";
import BroadcastEdit from "./Broadcasts/BroadcastEdit";

const RestaurantManager = ({ onClose }: MypageProps) => {
  const { restaurantSubpage, restaurantEditName, setRestaurantSubpage } =
    useMypageStore();
  const { resetYMD } = useBroadcastStore();

  const getModalTitle = (key: ExtendedSubpage) => {
    if (key === "broadcast-register") return "중계 일정 등록";
    if (key === "broadcast-edit") return "중계 일정 수정";
    if (key === "restaurant-edit") return `식당 수정 - ${restaurantEditName}`;

    const item = menuItems.find((i) => i.key === key);
    return item?.label ?? "";
  };

  const getComponents = (key: ExtendedSubpage) => {
    if (key === "broadcast-register")
      return <BroadcastRegister onClose={onClose} />;
    if (key === "broadcast-edit") return <BroadcastEdit onClose={onClose} />;

    const item = menuItems.find((i) => i.key === key);
    return item?.component();
  };

  return (
    <div className="px-2">
      <div className="flex items-center justify-between text-lg font-semibold my-5">
        <div className="flex items-center gap-3">
          {restaurantSubpage !== "restaurant-home" && (
            <FaArrowLeft
              className="hover:cursor-pointer hover:text-primary5"
              onClick={() => {
                if (restaurantSubpage === "schedule-view-broadcasts") {
                  setRestaurantSubpage("restaurant-home");
                  resetYMD();
                } else if (restaurantSubpage === "restaurant-edit") {
                  if (window.confirm("식당 수정을 취소하시겠습니까?")) {
                    setRestaurantSubpage("restaurant-home");
                  }
                } else {
                  setRestaurantSubpage("restaurant-home");
                }
              }}
            />
          )}
          <div className="flex items-center gap-3 text-xl text-mainText">
            {getModalTitle(restaurantSubpage)}
          </div>
        </div>
        <Button
          onClick={onClose}
          scheme="close"
          size="icon"
          className="text-mainText"
        >
          <FaTimes />
        </Button>
      </div>

      <div>{getComponents(restaurantSubpage)}</div>
    </div>
  );
};

export default RestaurantManager;
