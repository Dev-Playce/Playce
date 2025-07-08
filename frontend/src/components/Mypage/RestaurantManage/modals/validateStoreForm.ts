import type { RegisterStoreProps } from "../../../../api/restaurant.api";

const validateStoreForm = (mode: string, data: RegisterStoreProps) => {
  const newErrors: { [key: string]: string } = {};
  if (!data.store_name.trim())
    newErrors.store_name = "가게명은 필수 입력입니다.";
  if (mode === "create" && !data.business_number.trim())
    newErrors.business_number = "사업자등록번호는 필수 입력입니다.";
  if (!data.address.trim()) newErrors.address = "주소는 필수 입력입니다.";
  if (!data.phone.trim()) newErrors.phone = "전화번호는 필수 입력입니다.";
  if (!data.opening_hours.trim())
    newErrors.opening_hours = "영업시간은 필수 입력입니다.";
  if (!data.type.trim()) newErrors.type = "업종은 필수 입력입니다.";
  if (!data.menus.filter(Boolean).length)
    newErrors.menus = "메뉴를 1개 이상 입력하세요.";
  if (!data.images.filter(Boolean).length)
    newErrors.images = "사진을 1장 이상 등록하세요.";
  return newErrors;
};

export default validateStoreForm;
