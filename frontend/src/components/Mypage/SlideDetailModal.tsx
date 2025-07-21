import type { ReactNode } from "react";

interface SlideDetailModalProps {
  children: ReactNode;
}

const SlideDetailModal = ({ children }: SlideDetailModalProps) => {
  return <div className="p-4">{children}</div>;
};

export default SlideDetailModal;
