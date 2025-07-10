import { useEffect, useState } from "react";
import validateStoreForm from "./modals/validateStoreForm";
import ErrorMessage from "./modals/ErrorMessage";
import MenuInputList from "./modals/MenuInputList";
import {
  editStore,
  getStoreDetail,
  registerStore,
  type EditStoreProps,
  type RegisterStoreProps,
} from "../../../api/restaurant.api";
import useMypageStore from "../../../stores/mypageStore";
import FindAddressButton from "../../Common/FindAddressButton";
import type { RestaurantDetail } from "../../../types/restaurant.types";
import ImageUrlInputList from "./modals/ImageUrlInputList";
import type { menu } from "../../../types/menu";
import { apiErrorStatusMessage } from "../../../utils/apiErrorStatusMessage";
import type { AxiosError } from "axios";
import { useAuth } from "../../../hooks/useAuth";

interface StoreFormModalProps {
  mode: "create" | "edit";
}

const RestaurantRegisterEdit = ({ mode }: StoreFormModalProps) => {
  const { restaurantEditId, setRestaurantSubpage } = useMypageStore();
  const { userLogout } = useAuth();

  const [storeDetail, setStoreDetail] = useState<RestaurantDetail | null>(null);
  const [storeName, setStoreName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [openingHours, setOpeningHours] = useState("");
  const [type, setType] = useState(storeDetail?.type || "");
  const [description, setDescription] = useState("");
  const [menus, setMenus] = useState<menu[]>([{ name: "", price: "" }]); // Todo
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    const fetchStoreDetail = async () => {
      const res = await getStoreDetail(restaurantEditId!);
      const data = res.data;
      setStoreDetail(data);
      setStoreName(data.store_name);
      setAddress(data.address);
      setPhone(data.phone);
      setOpeningHours(data.opening_hours);
      setType(data.type);
      setDescription(data.description);
      setMenus(data.menus);
      setImgUrls(data.img_urls);
    };

    if (mode === "edit" && restaurantEditId) {
      fetchStoreDetail();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateStoreForm(mode, {
      store_name: storeName,
      business_number: businessNumber,
      address,
      phone,
      opening_hours: openingHours,
      menus,
      type,
      description,
      images: imgUrls,
    });
    if (mode === "create" && !agree)
      newErrors.agree = "중계권 관련 약관에 동의해야 등록이 가능합니다.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (mode === "create") {
      const data: RegisterStoreProps = {
        store_name: storeName,
        address,
        phone,
        business_number: businessNumber,
        opening_hours: openingHours,
        menus: menus.filter(Boolean),
        type,
        description,
        images: imgUrls.filter(Boolean),
      };
      try {
        await registerStore(data);
        alert(`식당 등록이 완료되었습니다.`);
        setRestaurantSubpage("restaurant-home");
      } catch (error) {
        const errorList = [
          {
            code: 400,
            message: "사업자등록번호 또는 지역이 유효하지 않습니다",
          },
          { code: 401, message: "로그인이 만료되었습니다" },
          { code: 404, message: "사용자를 찾을 수 없습니다" },
          { code: 409, message: "이미 등록된 사업자등록번호입니다" },
        ];
        const message = apiErrorStatusMessage(error, errorList);
        const axiosError = error as AxiosError;
        if (axiosError.status === 401) {
          userLogout();
        }
        alert(message);
      }
    } else if (mode === "edit") {
      const data: EditStoreProps = {
        store_name: storeName,
        address,
        phone,
        opening_hours: openingHours,
        menus: menus.filter(Boolean),
        type,
        description,
        images: imgUrls.filter(Boolean),
      };
      try {
        await editStore(data, restaurantEditId!);
        alert(`식당 수정이 완료되었습니다.`);
        setRestaurantSubpage("restaurant-home");
      } catch (error) {
        const errorList = [
          {
            code: 400,
            message: "잘못된 정보가 입력되었습니다",
          },
          { code: 401, message: "로그인이 만료되었습니다" },
          { code: 403, message: "식당에 대한 수정 권한이 없습니다" },
          { code: 404, message: "식당 또는 사용자가 존재하지 않습니다" },
        ];
        const message = apiErrorStatusMessage(error, errorList);
        const axiosError = error as AxiosError;
        if (axiosError.status === 401) {
          userLogout();
        }
        alert(message);
      }
    }

    // onSubmit({
    //   store_name: storeName,
    //   business_number: businessNumber,
    //   address,
    //   phone,
    //   opening_hours: openingHours,
    //   menus: menus.filter(Boolean),
    //   type,
    //   description,
    //   img_urls: imgUrls.filter(Boolean),
    // });
  };
  return (
    <div className="p-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 각 입력 필드 */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            가게명 <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
          <ErrorMessage message={errors.store_name} />
        </div>
        {mode === "create" && (
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              사업자등록번호 <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={businessNumber}
              onChange={(e) => setBusinessNumber(e.target.value)}
            />
            <ErrorMessage message={errors.business_number} />
          </div>
        )}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            주소 <span className="text-red-500">*</span>
          </label>

          <div className="flex gap-3">
            <input
              className="w-full border rounded px-3 py-2"
              value={address}
              readOnly={true}
            />
            <FindAddressButton
              onCompleted={(address) => {
                setAddress(address);
              }}
            />
          </div>
          <ErrorMessage message={errors.address} />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            전화번호 <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <ErrorMessage message={errors.phone} />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            영업시간 <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={openingHours}
            onChange={(e) => setOpeningHours(e.target.value)}
          />
          <ErrorMessage message={errors.opening_hours} />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            업종 <span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
          <ErrorMessage message={errors.type} />
        </div>
        {/* 메뉴 입력 (동적 필드 컴포넌트) */}
        <MenuInputList menus={menus} setMenus={setMenus} error={errors.menus} />
        {/* 소개(선택) */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">소개</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="식당을 소개해 주세요 (선택)"
          />
        </div>
        {/* 사진 */}
        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            사진 <span className="text-red-500">*</span>
          </label>

          <ImageUrlInputList
            imgUrls={imgUrls}
            setImgUrls={setImgUrls}
            error={errors.images}
          />
        </div>

        {/* 약관동의 체크박스: 등록(create) 모드에서만 노출 */}
        {mode === "create" && (
          <>
            <div className="flex items-start gap-2 mt-2">
              <input
                type="checkbox"
                id="agreement"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-1"
                required
              />
              <label
                htmlFor="agreement"
                className="text-sm text-gray-700 select-none"
              >
                <span className="font-semibold text-red-500">[필수]</span>{" "}
                본인은{" "}
                <b>
                  스포츠 중계권 및 저작권 관련 법적 책임이 본 플랫폼에 없음을
                  확인하고 동의합니다.
                </b>
                <br />
                (중계 영상 송출, 저작권 침해 등은 등록자 본인의 책임입니다)
              </label>
            </div>
            {errors.agree && (
              <div className="text-xs text-red-500 mt-1">{errors.agree}</div>
            )}
          </>
        )}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-emerald-500 text-white font-bold"
          >
            {mode === "edit" ? "수정" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantRegisterEdit;
