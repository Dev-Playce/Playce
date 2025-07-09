import { FaUtensils } from "react-icons/fa";
import type { RestaurantDetail, MenuItem } from "../../types/restaurant.types";
import EmptyMessage from "./EmptyMessage";

export default function RestaurantDetailMenuTab({
  detail,
}: {
  detail: RestaurantDetail;
}) {
  const menus: MenuItem[] = Array.isArray(detail.menus) ? detail.menus : [];

  return (
    <ul className="grid grid-cols-1 gap-3">
      {menus.length > 0 ? (
        menus.map((menu, idx) => (
          <li
            key={idx}
            className={`flex items-center justify-between gap-3 px-5 py-3 ${
              idx !== menus.length - 1 ? "border-b border-gray-200" : ""
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <FaUtensils className="text-primary1 text-lg flex-shrink-0" />
              <span className="font-medium text-gray-700 truncate">
                {menu.name}
              </span>
            </div>
            <span className="text-gray-500 font-semibold text-base flex-shrink-0 ml-2">
              {Number(menu.price).toLocaleString()}원
            </span>
          </li>
        ))
      ) : (
        <li>
          <EmptyMessage message="메뉴정보가 없습니다." />
        </li>
      )}
    </ul>
  );
}
