import { FaTimes } from "react-icons/fa";
import Button from "../Common/Button";

export interface UserInfoProps {
  email: string;
  name: string;
  nickname: string;
  phone: string;
  onClose?: () => void; // 닫기 콜백
}

const UserInfo = ({ email, name, nickname, phone, onClose }: UserInfoProps) => {
  return (
    <div className="px-2">
      {/* 헤더: 닫기 버튼 포함 */}
      <div className="flex items-center justify-between text-lg font-semibold my-5">
        <div className="flex items-center gap-3 text-xl text-mainText">
          내 정보
        </div>
        <Button
          onClick={onClose}
          scheme="close"
          size="icon"
          className="text-mainText"
        >
          <FaTimes />
        </Button>
      </div>

      {/* 사용자 정보 표시 */}
      <div className="flex flex-col gap-2">
        <InfoRow label="이메일" value={email} />
        <InfoRow label="이름" value={name} />
        <InfoRow label="닉네임" value={nickname} />
        <InfoRow label="전화번호" value={phone} />
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center">
    <span className="px-4 w-[100px] text-gray-600 text-sm mb-1">{label}</span>
    <span>{value}</span>
  </div>
);

export default UserInfo;
