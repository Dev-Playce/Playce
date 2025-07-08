import { FiTrash2 } from "react-icons/fi";

interface RestaurantCardListProps {
  stores: {
    store_id: number;
    store_name: string;
    main_img: string;
    address: string;
    type: string;
  }[];
  onRemove?: (store_id: number) => void;
  onDetail?: (store_id: number) => void;
  showDelete?: boolean;
  showDetail?: boolean;
  compact?: boolean;
}

export default function RestaurantCardList({
  stores,
  onRemove,
  onDetail,
  showDelete = false,
  showDetail = true,
  compact = false,
}: RestaurantCardListProps) {
  return (
    <ul className={compact ? "" : "flex flex-col divide-y divide-gray-100"}>
      {stores.length === 0 ? (
        <li className="text-gray-400 text-center py-8">식당이 없습니다.</li>
      ) : (
        stores.map((store) => (
          <li
            key={store.store_id}
            className={
              (compact
                ? "flex items-center gap-3 py-3 px-3 border-b border-gray-100 last:border-0"
                : "flex items-center gap-4 px-6 py-3") +
              " cursor-pointer hover:bg-primary4 transition-colors"
            }
            onClick={
              showDetail && onDetail
                ? () => onDetail(store.store_id)
                : undefined
            }
          >
            <img
              src={store.main_img || "/noimg.png"}
              alt={store.store_name}
              className={
                compact
                  ? "w-11 h-11 rounded object-cover bg-gray-200 border border-gray-100"
                  : "w-16 h-16 rounded-lg object-cover border border-gray-100 shadow-sm"
              }
            />
            <div className="flex-1 min-w-0">
              <div
                className={
                  compact
                    ? "flex items-center gap-1"
                    : "flex items-center gap-2"
                }
              >
                <span
                  className={
                    compact
                      ? "font-semibold truncate"
                      : "block text-lg font-semibold text-gray-900 truncate"
                  }
                >
                  {store.store_name}
                </span>
                <span
                  className={
                    compact
                      ? "ml-1 text-xs px-2 py-0.5 rounded bg-primary3 text-primary5"
                      : "text-xs bg-primary4 text-emerald-600 px-2 py-0.5 rounded-full font-medium"
                  }
                >
                  {store.type}
                </span>
              </div>
              <div
                className={
                  compact
                    ? "text-xs text-gray-500 truncate"
                    : "text-gray-500 text-sm truncate mt-1"
                }
              >
                {store.address}
              </div>
            </div>
            {/* 삭제 버튼만 별도 노출 */}
            {showDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRemove) {
                    onRemove(store.store_id);
                  }
                }}
                className={
                  compact
                    ? "w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-100 transition ml-1"
                    : "ml-2 p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors shadow"
                }
                aria-label="삭제"
              >
                <FiTrash2
                  className={
                    compact
                      ? "text-gray-400 hover:text-red-500 text-base transition-colors"
                      : "text-gray-400 hover:text-red-500 text-xl transition-colors"
                  }
                />
              </button>
            )}
          </li>
        ))
      )}
    </ul>
  );
}
