import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Button from "../../../Common/Button";

interface BroadcastActionButtonsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const BroadcastActionButtons = ({
  onEdit,
  onDelete,
}: BroadcastActionButtonsProps) => {
  return (
    <div className="flex items-center gap-3 mr-3">
      <Button
        onClick={onEdit}
        scheme="storeCircle"
        icon={<FiEdit2 className="text-blue-500 text-xl" />}
        hoverColor="blue-50"
      />
      <Button
        onClick={onDelete}
        scheme="storeCircle"
        icon={<FiTrash2 className="text-red-500 text-xl" />}
        hoverColor="red-50"
      />
    </div>
  );
};

export default BroadcastActionButtons;
