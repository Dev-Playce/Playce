import { FaChevronRight } from "react-icons/fa";
import useMypageStore from "../../../stores/mypageStore";
import { menuItems } from "../../../types/restaurant-manage.types";

const RestaurantHome = () => {
  const { setRestaurantSubpage } = useMypageStore();
  return (
    <div className="flex flex-col divide-y divide-gray-300 ">
      {menuItems
        .filter(
          (item) =>
            item.key !== "restaurant-home" &&
            item.key !== "schedule-view-broadcasts" &&
            item.key !== "restaurant-list-edit"
        )
        .map((item) => (
          <button
            key={item.key}
            onClick={() => setRestaurantSubpage(item.key)}
            className="flex items-center justify-between px-2 py-3 text-left w-full hover:bg-primary4 transition-colors"
          >
            <span>{item.label}</span>
            <FaChevronRight className="text-gray-400 text-sm" />
          </button>
        ))}
    </div>
  );
};

export default RestaurantHome;
