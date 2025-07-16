import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import InputText from "../Common/InputText";
import Button from "../Common/Button";
import ErrorText from "./ErrorText";
import useAuthStore from "../../stores/authStore";
import ModalBase from "../Common/ModalBase";

const PasswordResetRequestModal = () => {
  const { userPasswordResetRequest } = useAuth();
  const { isPasswordResetModalOpen, setIsPasswordResetModalOpen } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; name: string }>();

  const onSubmit = async (data: { email: string; name: string }) => {
    await userPasswordResetRequest(data); // { email, name }
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
        <div className="flex flex-col gap-3">
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
              placeholder="이름"
              type="text"
              {...register("name", { required: true })}
            />
            {errors.name && <ErrorText message="이름을 입력해주세요" />}
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
