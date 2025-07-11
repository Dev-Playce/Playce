interface TagProps {
  label: string;
  onRemove: () => void;
}

const Tag = ({ label, onRemove }: TagProps) => {
  return (
    <span className="px-3 py-1 text-sm bg-primary3 text-primary5 rounded-full flex items-center gap-1">
      {label}
      <button onClick={onRemove} className="hover:text-primary5">
        ×
      </button>
    </span>
  );
};

export default Tag;
