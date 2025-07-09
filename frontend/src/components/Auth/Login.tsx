import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import type { LoginProps } from "../../api/auth.api";
import InputText from "../Common/InputText";
import useAuthStore from "../../stores/authStore";
import Button from "../Common/Button";
import ErrorText from "./ErrorText";
import ModalBase from "../Common/ModalBase";

const LoginModal = () => {
  const { userLogin } = useAuth();
  const { isLoginModalOpen, setIsLoginModalOpen, setIsPasswordResetModalOpen } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>();

  const onSubmit = (data: LoginProps) => {
    userLogin(data);
    setIsLoginModalOpen(false);
  };

  const handleCancel = () => {
    setIsLoginModalOpen(false);
  };

  if (!isLoginModalOpen) return null;

  return (
    <ModalBase
      onClose={handleCancel}
      title="로그인"
      className="p-5"
      type="auth"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 mt-5">
          <fieldset>
            <InputText
              placeholder="이메일"
              type="email"
              {...register("email", { required: true })}
            />
            {errors.email && <ErrorText message="이메일을 입력해주세요" />}
          </fieldset>
          <fieldset>
            <InputText
              placeholder="비밀번호"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && <ErrorText message="비밀번호를 입력해주세요" />}
          </fieldset>
          <Button type="submit" className="mt-5" scheme="primary">
            로그인
          </Button>
          {/* 중앙 정렬된 비밀번호 찾기 링크 */}
          <div className="flex justify-center mt-2">
            <button
              type="button"
              className="text-sm text-gray-400 hover:text-primary5 transition-colors underline underline-offset-2"
              onClick={() => {
                setIsLoginModalOpen(false);
                setIsPasswordResetModalOpen(true);
              }}
              tabIndex={0}
            >
              비밀번호를 잊으셨나요?
            </button>
          </div>
        </div>
      </form>
    </ModalBase>
  );
};

export default LoginModal;
