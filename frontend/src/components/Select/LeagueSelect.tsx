interface LeagueSelectProps {
  value: number | "";
  options: { id: number; name: string }[];
  onChange: (id: number, name: string) => void;
  disabled?: boolean;
}

const LeagueSelect = ({
  value,
  options,
  onChange,
  disabled,
}: LeagueSelectProps) => {
  return (
    <div>
      <label className="mb-2 block text-mainText">리그</label>
      <select
        value={value}
        onChange={(e) => {
          const selectedId = Number(e.target.value);
          const selectedName =
            options.find((l) => l.id === selectedId)?.name || "";
          onChange(selectedId, selectedName);
        }}
        disabled={disabled}
        className="w-full p-2 border rounded-md hover:border-primary5 focus:border-primary5 focus:ring-1 focus:ring-primary1 focus:outline-none"
      >
        <option value="" className="text-mainText">
          리그 선택
        </option>
        {options.map((l) => (
          <option key={l.id} value={l.id}>
            {l.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LeagueSelect;
