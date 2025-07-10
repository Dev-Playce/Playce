import { FaEdit, FaRegTrashAlt } from "react-icons/fa";

interface BroadcastActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const BroadcastActionButtons = ({
  onEdit,
  onDelete,
}: BroadcastActionButtonsProps) => {
  return (
    <>
      <FaEdit className="cursor-pointer" onClick={onEdit} />
      <FaRegTrashAlt
        className="cursor-pointer text-red-500"
        onClick={onDelete}
      />
    </>
  );
};

export default BroadcastActionButtons;
