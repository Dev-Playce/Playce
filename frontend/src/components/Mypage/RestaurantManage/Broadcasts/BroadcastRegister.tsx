import BroadcastRegisterEdit from "./BroadcastRegisterEdit";
import useBroadcastStore from "../../../../stores/broadcastStore";

const BroadcastRegister = ({ onClose }: { onClose: () => void }) => {
  const { storeId, setBroadcastLists } = useBroadcastStore();

  return (
    <div className="p-4">
      <BroadcastRegisterEdit
        mode="create"
        storeId={storeId}
        setBroadcastLists={setBroadcastLists}
        onClose={onClose}
      />
    </div>
  );
};

export default BroadcastRegister;
