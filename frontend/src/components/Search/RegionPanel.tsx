import { useRegions } from "../../hooks/useRegions";
import { useRegionStore } from "../../stores/regionStore";
import Tag from "../Common/Tag";
import { useState } from "react";
import { getUpdatedRegionSelection } from "../../utils/regionUtils";

const RegionPanel = () => {
  const [selectedBigRegionName, setSelectedBigRegionName] =
    useState<string>("");
  const { selectedRegions, toggleRegion, setSelectedRegions } =
    useRegionStore();

  const { bigRegions = [] } = useRegions();
  const selectedBigRegionId = bigRegions.find(
    (r) => r.name === selectedBigRegionName
  )?.id;
  const { smallRegions = [] } = useRegions(selectedBigRegionId);

  const handleSmallRegionClick = (smallName: string) => {
    if (!selectedBigRegionName) return;

    const updated = getUpdatedRegionSelection(
      selectedRegions,
      selectedBigRegionName,
      smallName
    );

    setSelectedRegions(updated);
  };

  return (
    <div className="flex flex-col max-h-[500px]">
      <div className="flex divide-x overflow-hidden border-b h-[300px]">
        <div className="w-1/2 overflow-y-auto scrollbar-hide">
          {bigRegions.map((region) => (
            <div
              key={region.id}
              onClick={() => setSelectedBigRegionName(region.name)}
              className={`p-3 cursor-pointer hover:bg-gray-100
                ${
                  region.name === selectedBigRegionName
                    ? "font-bold text-primary5"
                    : ""
                }`}
            >
              {region.name}
            </div>
          ))}
        </div>

        <div className="w-1/2 overflow-y-auto max-h-full">
          {selectedBigRegionName === "" ? (
            <div className="flex flex-col justify-center items-center h-full text-gray-400 text-center">
              <p>지역을 선택하면</p>
              <p>상세 지역을 확인할 수 있습니다</p>
            </div>
          ) : smallRegions.length === 0 ? (
            <p className="text-center text-gray-400 py-4">로딩 중...</p>
          ) : (
            smallRegions.map((sub) => {
              const isChecked = selectedRegions.some(
                (r) =>
                  r.bigRegion === selectedBigRegionName &&
                  r.smallRegion === sub.name
              );

              return (
                <label
                  key={sub.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                >
                  <span>{sub.name}</span>
                  <input
                    type="checkbox"
                    className="accent-primary1"
                    checked={isChecked}
                    onChange={() => handleSmallRegionClick(sub.name)}
                  />
                </label>
              );
            })
          )}
        </div>
      </div>

      {selectedRegions.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 border-gray-200">
          {selectedRegions.map((r) => {
            const label =
              r.smallRegion === "전체"
                ? `${r.bigRegion} 전체`
                : `${r.bigRegion} ${r.smallRegion}`;

            return (
              <Tag
                key={`${r.bigRegion}-${r.smallRegion}`}
                label={label}
                onRemove={() => toggleRegion(r.bigRegion, r.smallRegion)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RegionPanel;
