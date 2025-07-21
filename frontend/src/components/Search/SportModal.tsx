import Button from "../Common/Button";
import SportPanel from "./SportPanel";
import { useSportStore } from "../../stores/sportStore";
import ModalBase from "../Common/ModalBase";

interface SportModalProps {
  onClose: () => void;
  onApply: (selected: { sport: string; leagues: string[] }) => void;
}

const SportModal = ({ onClose, onApply }: SportModalProps) => {
  const { sport, selectedLeagues, resetSport } = useSportStore();

  return (
    <ModalBase onClose={onClose} title="경기" className="p-5">
      <SportPanel />
      <div className="border-t border-gray-200 pt-5 flex gap-3">
        <Button onClick={resetSport} scheme="reset">
          초기화
        </Button>
        <Button
          onClick={() => {
            onApply({
              sport,
              leagues: selectedLeagues
                .filter((r) => r.sport === sport)
                .map((r) => r.league),
            });
            onClose();
          }}
          scheme="apply"
          className="flex-1"
        >
          적용
        </Button>
      </div>
    </ModalBase>
  );
};

export default SportModal;
