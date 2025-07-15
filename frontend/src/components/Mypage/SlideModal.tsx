import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import ModalBase from "../Common/ModalBase";

interface SlideModalProps {
  title: string;
  onClose: () => void;
  onBack?: () => void; // optional 뒤로가기
  children: ReactNode;
}

const SlideModal = ({ title, onClose, onBack, children }: SlideModalProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 슬라이드 애니메이션 트리거
    setTimeout(() => setVisible(true), 10);
  }, []);

  return (
    <ModalBase onClose={onClose} hideHeader>
      <div
        className={`w-full h-full bg-white flex flex-col transform transition-transform duration-300
          ${visible ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* 헤더 */}
        <div className="flex justify-between items-center p-4 border-b">
          {onBack ? (
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-primary5"
            >
              <FaArrowLeft />
            </button>
          ) : (
            <div className="w-[24px]" />
          )}
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary5 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </ModalBase>
  );
};

export default SlideModal;
