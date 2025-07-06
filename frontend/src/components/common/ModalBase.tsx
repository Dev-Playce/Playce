import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import classNames from "classnames";
import Button from "./Button";

interface ModalBaseProps {
  children: ReactNode;
  onClose: () => void;
  title?: string;
  hideHeader?: boolean;
  className?: string;
  type?: "auth" | "mypage";
}

const ModalBase = ({
  children,
  onClose,
  title,
  hideHeader = false,
  className,
  type,
}: ModalBaseProps) => {
  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh] sm:pt-[12vh] bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className={classNames(
          "bg-white rounded-xl shadow-lg max-h-[90vh] overflow-hidden flex flex-col",
          type === "auth"
            ? "w-[400px]"
            : type === "mypage"
            ? "w-[750px]"
            : "w-[600px]",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideHeader && (
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-mainText items-center m-0">
              {title}
            </h2>
            <Button
              onClick={onClose}
              scheme="close"
              size="icon"
              className="text-mainText"
            >
              <FaTimes />
            </Button>
          </div>
        )}

        <div className="flex-grow">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default ModalBase;
