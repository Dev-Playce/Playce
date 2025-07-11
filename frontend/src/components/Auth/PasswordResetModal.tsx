import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import ModalBase from "../Common/ModalBase";
import InputText from "../Common/InputText";
import Button from "../Common/Button";
import ErrorText from "./ErrorText";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

const PasswordResetModal = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { userPasswordReset } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<{ newPassword: string; confirmPassword: string }>();

  const onSubmit = async (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    if (data.newPassword !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "비밀번호가 일치하지 않습니다.",
      });
      return;
    }
    if (!token) return;
    setLoading(true);
    await userPasswordReset({ token, newPassword: data.newPassword });
    setLoading(false);
    alert("비밀번호가 변경되었습니다!");
    navigate("/");
  };

  return (
    <ModalBase
      onClose={() => navigate("/")}
      title="비밀번호 재설정"
      className="p-5"
      type="auth"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3 mt-5">
          <fieldset>
            <InputText
              placeholder="새 비밀번호"
              type="password"
              {...register("newPassword", { required: true })}
            />
            {errors.newPassword && (
              <ErrorText message="새 비밀번호를 입력해주세요" />
            )}
          </fieldset>
          <fieldset>
            <InputText
              placeholder="비밀번호 확인"
              type="password"
              {...register("confirmPassword", { required: true })}
            />
            {errors.confirmPassword && (
              <ErrorText
                message={
                  errors.confirmPassword.message ||
                  "비밀번호 확인을 입력해주세요"
                }
              />
            )}
          </fieldset>
          <Button
            type="submit"
            className="mt-5"
            scheme="primary"
            disabled={loading}
          >
            {loading ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};

export default PasswordResetModal;
