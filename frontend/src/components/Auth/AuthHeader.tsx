import Button from "../Common/Button";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUserAlt,
  FaUserPlus,
} from "react-icons/fa";
import useAuthStore from "../../stores/authStore";
import useMypageStore from "../../stores/mypageStore";
// import { useAuth } from "../../hooks/useAuth";

const AuthHeader: React.FC = () => {
  const { isLoggedIn, storeLogout, setIsLoginModalOpen, setIsSignupModalOpen } =
    useAuthStore();

  // const { userLogout } = useAuth();
  const { setIsMypageOpen } = useMypageStore();
  return (
    <div className="absolute top-5 right-5 z-10 text-lg">
      <div className="flex gap-3">
        {isLoggedIn ? (
          <>
            <Button
              icon={<FaSignOutAlt />}
              size="medium"
              scheme="custom"
              className="bg-white text-primary5 hover:shadow-lg rounded-lg"
              onClick={() => {
                // userLogout();
                // 임시로 로그아웃되도록 설정
                alert("로그아웃이 완료되었습니다");
                storeLogout();
              }}
            >
              로그아웃
            </Button>
            <Button
              icon={<FaUserAlt />}
              size="medium"
              scheme="custom"
              className="bg-white text-primary5 hover:shadow-lg rounded-lg"
              onClick={() => setIsMypageOpen(true)}
            >
              마이페이지
            </Button>
            {/* 마이페이지 버튼 */}
          </>
        ) : (
          <>
            <Button
              icon={<FaSignInAlt />}
              size="medium"
              scheme="custom"
              className="bg-white text-primary5 hover:shadow-lg rounded-lg"
              onClick={() => {
                setIsLoginModalOpen(true);
              }}
            >
              로그인
            </Button>
            <Button
              icon={<FaUserPlus />}
              size="medium"
              scheme="custom"
              className="bg-white text-primary5 hover:shadow-lg rounded-lg"
              onClick={() => {
                setIsSignupModalOpen(true);
              }}
            >
              회원가입
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthHeader;
