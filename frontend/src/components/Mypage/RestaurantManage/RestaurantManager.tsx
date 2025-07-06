import { FaArrowLeft, FaTimes } from "react-icons/fa";
import useMypageStore from "../../../stores/mypageStore";
import {
  menuItems,
  type MenuKey,
} from "../../../types/restaurant-manage.types";
import type { MypageProps } from "../MypageModal";
import useBroadcastStore from "../../../stores/broadcastStore";
import Button from "../../Common/Button";

const RestaurantManager = ({ onClose }: MypageProps) => {
  const { restaurantSubpage, setRestaurantSubpage } = useMypageStore();
  const { resetYMD } = useBroadcastStore();

  return (
    <div className="px-2">
      <div className="flex items-center justify-between text-lg font-semibold my-5">
        <div className="flex items-center gap-3">
          {restaurantSubpage !== "restaurant-home" && (
            <FaArrowLeft
              className="hover:cursor-pointer hover:text-primary5"
              onClick={() => {
                if (restaurantSubpage === "schedule-view-broadcasts") {
                  setRestaurantSubpage("schedule-view-restaurants");
                  resetYMD();
                } else if (restaurantSubpage === "restaurant-list-edit") {
                  if (window.confirm("식당 수정을 취소하시겠습니까?")) {
                    setRestaurantSubpage("restaurant-list");
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

const getModalTitle = (key: MenuKey) => {
  const item = menuItems.find((i) => i.key === key);
  return item?.label ?? "";
};

const getComponents = (key: MenuKey) => {
  const item = menuItems.find((i) => i.key === key);
  return item?.component();
};

export default RestaurantManager;
