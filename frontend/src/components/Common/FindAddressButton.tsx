import { FIND_ADDRESS_URL } from "../../constant/find-address";
import { useEffect } from "react";
import Button from "./Button";

interface FindAddressButtonProps {
  onCompleted: (address: string) => void;
}

const FindAddressButton: React.FC<FindAddressButtonProps> = ({
  onCompleted,
}) => {
  const handleOpen = () => {
    new window.daum.Postcode({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      oncomplete: (data: any) => {
        onCompleted(data.address as string);
      },
    }).open();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = FIND_ADDRESS_URL;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <Button
      type="button"
      size="small"
      onClick={handleOpen}
      className="w-[100px] bg-primary5 border-none"
    >
      주소 찾기
    </Button>
  );
};

export default FindAddressButton;
