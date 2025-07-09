import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import ModalBase from "../Common/ModalBase";
import InputText from "../Common/InputText";
import Button from "../Common/Button";
import ErrorText from "./ErrorText";
import useAuthStore from "../../stores/authStore";

const PasswordResetRequestModal = () => {
  const { userPasswordResetRequest } = useAuth();
  const { isPasswordResetModalOpen, setIsPasswordResetModalOpen } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    await userPasswordResetRequest(data);
    setIsPasswordResetModalOpen(false);
  };

  if (!isPasswordResetModalOpen) return null;

  return (
    <ModalBase
      onClose={() => setIsPasswordResetModalOpen(false)}
      title="비밀번호 초기화"
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
          <Button type="submit" className="mt-5" scheme="primary">
            비밀번호 초기화 메일 발송
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};

export default PasswordResetRequestModal;
