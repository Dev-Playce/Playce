interface SportSelectProps {
  value: number | "";
  options: { id: number; name: string }[];
  onChange: (id: number, name: string) => void;
}

const SportSelect = ({ value, options, onChange }: SportSelectProps) => {
  return (
    <div>
      <label className="mb-2 block font-semibold text-mainText">
        종목 <span className="text-red-500">*</span>
      </label>
      <select
        value={value}
        onChange={(e) => {
          const selectedId = Number(e.target.value);
          const selectedName =
            options.find((s) => s.id === selectedId)?.name || "";
          onChange(selectedId, selectedName);
        }}
        className="w-full p-2 border rounded-md hover:border-primary5 focus:border-primary5 focus:ring-1 focus:ring-primary1 focus:outline-none"
      >
        <option value="" className="text-mainText">
          종목 선택
        </option>
        {options.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SportSelect;
