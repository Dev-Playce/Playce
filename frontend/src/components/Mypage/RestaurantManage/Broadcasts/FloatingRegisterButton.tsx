import { FiPlus } from "react-icons/fi";

interface FloatingRegisterButtonProps {
  onClick: () => void;
  className?: string;
}

const FloatingRegisterButton = ({
  onClick,
  className = "",
}: FloatingRegisterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-12 h-12 rounded-full bg-primary5 text-white shadow-lg flex items-center justify-center hover:bg-primary4 transition-all ${className}`}
    >
      <FiPlus />
    </button>
  );
};

export default FloatingRegisterButton;
