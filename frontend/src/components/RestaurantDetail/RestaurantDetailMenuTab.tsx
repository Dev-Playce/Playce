import { FaUtensils } from "react-icons/fa";
import type { RestaurantDetail } from "../../types/restaurant.types";

export default function RestaurantDetailMenuTab({
  detail,
}: {
  detail: RestaurantDetail;
}) {
  let menus: string[] = [];
  if (typeof detail.menus === "string") {
    menus = detail.menus
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
  } else if (Array.isArray(detail.menus)) {
    menus = detail.menus;
  }

  return (
    <ul className="grid grid-cols-1 gap-3">
      {menus.length > 0 ? (
        menus.map((menu, idx) => (
          <li
            key={idx}
            className={`flex items-center gap-3 px-5 py-3 ${
              idx !== menus.length - 1 ? "border-b border-gray-200" : ""
            }`}
          >
            <FaUtensils className="text-primary1 text-lg" />
            <span className="font-medium text-gray-700">{menu}</span>
          </li>
        ))
      ) : (
        <li className="py-3 text-gray-400 text-center">메뉴 정보 없음</li>
      )}
    </ul>
  );
}
