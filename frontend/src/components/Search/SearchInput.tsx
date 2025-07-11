import { useSearchStore } from "../../stores/searchStore";
import InputText from "../Common/InputText";

interface SearchInputProps {
  className?: string;
}

const SearchInput = ({ className }: SearchInputProps) => {
  const { searchText, setSearchText } = useSearchStore();

  return (
    <div className={`flex gap-2 ${className || ""}`}>
      <InputText
        placeholder="검색어를 입력해주세요."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
