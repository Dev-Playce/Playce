import type { FC } from "react";

interface SearchResultItemProps {
  data: {
    storeName: string;
    address: string;
    distance?: number | undefined;
    matchInfo: string;
    imgUrl: string;
  };
  onClick?: () => void;
}

const SearchResultItem: FC<SearchResultItemProps> = ({ data, onClick }) => {
  const { storeName, address, distance, matchInfo, imgUrl } = data;

  return (
    <div
      className="w-full hover:bg-primary4 transition-colors cursor-pointer border-b border-gray-200"
      onClick={onClick}
    >
      <div className="flex justify-between items-center px-4 py-3">
        <div className="flex flex-col leading-tight">
          <h3 className="text-base font-semibold text-gray-800 mb-[2px]">
            {storeName}
          </h3>
          {distance != null && (
            <p className="text-sm text-gray-500 mb-[1px]">
              {distance.toFixed(1)}km
            </p>
          )}

          <p className="text-sm text-gray-600 mb-[1px]">{address}</p>
          <p className="text-sm text-primary5 mt-1.5 min-h-[20px]">
            {matchInfo || ""}
          </p>
        </div>

        <img
          src={imgUrl}
          alt={`${storeName} 썸네일`}
          className="w-[100px] h-[90px] object-cover rounded-md ml-4 flex-shrink-0"
        />
      </div>
    </div>
  );
};

export default SearchResultItem;
