import useAuthStore from "../../stores/authStore";
import InputText from "../Common/InputText";
import { useForm } from "react-hook-form";
import type { SignupProps } from "../../api/auth.api";
import Button from "../Common/Button";
import ErrorText from "./ErrorText";
import { useAuth } from "../../hooks/useAuth";
import ModalBase from "../Common/ModalBase";

interface SignupFormProps {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  nickname: string;
  phone: string;
}

const SignupModal = () => {
  const { userSignup } = useAuth();
  const { isSignupModalOpen, setIsSignupModalOpen } = useAuthStore();

  const handleCancel = () => {
    setIsSignupModalOpen(false);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormProps>();

  const onSubmit = async (data: SignupFormProps) => {
    const signupProps: SignupProps = {
      name: data.name,
      email: data.email,
      password: data.password,
      phone: data.phone,
      nickname: data.nickname,
    };
    userSignup(signupProps);
  };

  if (!isSignupModalOpen) return null;

  return (
    <ModalBase
      onClose={handleCancel}
      title="회원가입"
      className="p-5"
      type="auth"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          <fieldset>
            <InputText
              placeholder="이름"
              type="text"
              {...register("name", { required: true })}
            />
            {errors.name && <ErrorText message="이름을 입력해주세요" />}
          </fieldset>
          <fieldset>
            <InputText
              placeholder="이메일 (아이디)"
              type="email"
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+\.\S+$/,
              })}
            />
            {errors.email && (
              <ErrorText message="유효한 이메일을 입력해주세요" />
            )}
          </fieldset>
          <fieldset>
            <InputText
              placeholder="비밀번호"
              type="password"
              {...register("password", { required: true, minLength: 6 })}
            />
            {errors.password && <ErrorText message="6자 이상 입력해주세요" />}
          </fieldset>
          <fieldset>
            <InputText
              placeholder="비밀번호 재입력"
              type="password"
              {...register("passwordConfirm", {
                required: "비밀번호를 재입력해주세요",
                minLength: {
                  value: 6,
                  message: "6자 이상 입력해주세요",
                },
                validate: (value) =>
                  value === watch("password") ||
                  "비밀번호가 일치하지 않습니다.",
              })}
            />
            {errors.passwordConfirm && (
              <ErrorText message={errors.passwordConfirm.message} />
            )}
          </fieldset>
          <fieldset>
            <InputText
              placeholder="휴대폰 번호 (010-1234-5678)"
              type="text"
              {...register("phone", {
                required: "휴대폰 번호를 입력해주세요",
                pattern: /^010-\d{4}-\d{4}$/,
                minLength: {
                  value: 13,
                  message: "형식에 맞춰 입력해주세요",
                },
                maxLength: {
                  value: 13,
                  message: "형식에 맞춰 입력해주세요",
                },
              })}
            />
            {errors.phone && <ErrorText message={errors.phone.message} />}
          </fieldset>
          <fieldset>
            <InputText
              placeholder="닉네임"
              type="text"
              {...register("nickname", {
                required: "닉네임을 입력해주세요",
                minLength: {
                  value: 2,
                  message: "2글자 이상의 닉네임만 가능합니다",
                },
                maxLength: {
                  value: 8,
                  message: "9글자 이하의 닉네임만 가능합니다",
                },
              })}
            />
            {errors.nickname && <ErrorText message={errors.nickname.message} />}
          </fieldset>
          <Button type="submit" className="mt-5" scheme="primary">
            회원가입
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};

export default SignupModal;
