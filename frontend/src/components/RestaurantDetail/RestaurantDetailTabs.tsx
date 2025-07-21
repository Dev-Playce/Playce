// RestaurantDetailTabs.tsx
import { FiTv, FiImage } from "react-icons/fi";
import { FaUtensils } from "react-icons/fa";
import Button from "../Common/Button";
import classNames from "classnames";

const TABS = ["홈", "메뉴", "사진", "중계"] as const;
type Tab = (typeof TABS)[number];

interface RestaurantDetailTabsProps {
  currentTab: Tab;
  setCurrentTab: (tab: Tab) => void;
}

const RestaurantDetailTabs = ({
  currentTab,
  setCurrentTab,
}: RestaurantDetailTabsProps) => (
  <div className="flex border-b border-gray-200 bg-white sticky top-0 z-10">
    {TABS.map((tab) => (
      <Button
        key={tab}
        scheme="tab"
        className={classNames(
          "flex-1 py-3 flex items-center justify-center gap-1 transition-all",
          currentTab === tab && "text-primary5 border-primary5 bg-white"
        )}
        onClick={() => setCurrentTab(tab)}
      >
        {tab === "메뉴" && <FaUtensils className="text-base" />}
        {tab === "사진" && <FiImage className="text-base" />}
        {tab === "중계" && <FiTv className="text-base" />}
        {tab}
      </Button>
    ))}
  </div>
);

export default RestaurantDetailTabs;
