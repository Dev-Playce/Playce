import { SearchOutlined } from "@ant-design/icons";
import { useSearchStore } from "../../stores/searchStore";
import { useRegionStore } from "../../stores/regionStore";
import { useSportStore } from "../../stores/sportStore";
import Button from "../Common/Button";

const SearchButton = () => {
  const {
    searchText,
    setTriggerSearch,
    setBigRegions,
    setSmallRegions,
    setSports,
    setLeagues,
    setIsSearching,
  } = useSearchStore();
  const { selectedRegions } = useRegionStore();
  const { sport, selectedLeagues } = useSportStore();

  const handleSearch = () => {
    const hasKeyword =
      searchText.trim() !== "" ||
      selectedRegions.length > 0 ||
      sport !== "" ||
      selectedLeagues.length > 0;

    if (!hasKeyword) {
      alert("검색 조건을 하나 이상 입력해주세요.");
      return;
    }

    if (selectedRegions.length > 0) {
      const bigs = [...new Set(selectedRegions.map((r) => r.bigRegion))];
      const smalls = selectedRegions.map((r) => r.smallRegion);
      setBigRegions(bigs);
      setSmallRegions(smalls);
    } else {
      setBigRegions([]);
      setSmallRegions([]);
    }

    const uniqueSports = [...new Set(selectedLeagues.map((l) => l.sport))];
    setSports(uniqueSports);

    const leagues = selectedLeagues.map((l) => l.league);
    setLeagues(leagues);

    setIsSearching(true);
    setTriggerSearch(true);
  };

  return (
    <Button onClick={handleSearch} scheme="apply" fullWidth size="semi">
      <SearchOutlined className="text-sm mr-2" />
      검색
    </Button>
  );
};

export default SearchButton;
