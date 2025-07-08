import { FiTv } from "react-icons/fi";
import Button from "../Common/Button";
import type { RestaurantDetail } from "../../types/restaurant.types";

export default function RestaurantDetailBroadcastTab({
  detail,
  onManage,
}: {
  detail: RestaurantDetail;
  onManage?: () => void;
}) {
  return (
    <div>
      <ul className="flex flex-col gap-4">
        {detail.broadcasts.length > 0 ? (
          detail.broadcasts.map((b, idx) => (
            <li
              key={idx}
              className="rounded-xl p-4 flex flex-col gap-1 border border-primary2"
            >
              <div className="flex items-center gap-2 mb-1">
                <FiTv className="text-primary5" />
                <span className="font-semibold">
                  {b.league} {b.sport}
                </span>
                <span className="ml-auto text-xs text-gray-400">
                  {b.match_date} {b.match_time}
                </span>
              </div>
              <div className="flex items-center gap-2 text-base font-bold text-gray-800">
                {b.team_one}
                <span className="mx-1 text-primary5">vs</span>
                {b.team_two}
                {b.etc && (
                  <span className="ml-2 text-xs bg-primary3 text-primary5 rounded px-2 py-0.5">
                    {b.etc}
                  </span>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="py-6 text-gray-400 text-center">
            예정된 중계가 없습니다.
          </li>
        )}
      </ul>
      {detail.is_owner && (
        <div className="mt-6 flex justify-end">
          <Button scheme="primary" onClick={onManage}>
            중계 관리
          </Button>
        </div>
      )}
    </div>
  );
}
