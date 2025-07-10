import BroadcastRegisterEdit from "./BroadcastRegisterEdit";
import useBroadcastStore from "../../../../stores/broadcastStore";
import useBroadcastFormStore from "../../../../stores/broadcastFormStore";

const BroadcastEdit = ({ onClose }: { onClose: () => void }) => {
  const { storeId, setBroadcastLists } = useBroadcastStore();
  const { editingId } = useBroadcastFormStore();

  if (!editingId) return <div className="p-4">잘못된 접근입니다.</div>;

  return (
    <div className="p-4">
      <BroadcastRegisterEdit
        mode="edit"
        broadcastId={editingId}
        storeId={storeId}
        setBroadcastLists={setBroadcastLists}
        onClose={onClose}
      />
    </div>
  );
};

export default BroadcastEdit;
