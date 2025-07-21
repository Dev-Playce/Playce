import { FiMapPin, FiClock, FiPhone, FiFileText } from "react-icons/fi";
import type { RestaurantDetail } from "../../types/restaurant.types";
import classNames from "classnames";

export default function RestaurantDetailHomeTab({
  detail,
}: {
  detail: RestaurantDetail;
}) {
  return (
    <div className="flex flex-col gap-4">
      {detail.is_owner && (
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-primary3 text-primary5 rounded text-xs font-bold">
            내 가게
          </span>
        </div>
      )}
      <h2
        className={classNames(
          "text-2xl font-bold",
          detail.description ? "mb-2" : "mb-1"
        )}
      >
        {detail.store_name}
      </h2>
      {detail.description && (
        <p className="mb-2 text-gray-700">{detail.description}</p>
      )}
      <div className="flex items-center gap-2">
        <FiMapPin className="text-xl" />
        <span>{detail.address}</span>
      </div>
      <div className="flex items-center gap-2">
        <FiClock className="text-xl" />
        <span>{detail.opening_hours}</span>
      </div>
      <div className="flex items-center gap-2">
        <FiPhone className="text-xl" />
        <span>{detail.phone}</span>
      </div>
      <div className="flex items-center gap-2">
        <FiFileText className="text-xl" />
        <span>{detail.type}</span>
      </div>
    </div>
  );
}
