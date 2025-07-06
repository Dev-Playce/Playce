import { useState } from "react";
import validateStoreForm from "./modals/validateStoreForm";
import ErrorMessage from "./modals/ErrorMessage";
import MenuInputList from "./modals/MenuInputList";
import ImageUrlInputList from "./modals/ImageUrlInputList";
import {
  editStore,
  registerStore,
  type EditStoreProps,
  type RegisterStoreProps,
} from "../../../api/restaurant.api";
import useMypageStore from "../../../stores/mypageStore";
import FindAddressButton from "../../Common/FindAddressButton";
import { dummyRestaurantDetails } from "../../../data/dummyRestaurantDetail";

interface StoreFormModalProps {
  mode: "create" | "edit";
}

const RestaurantRegisterEdit = ({ mode }: StoreFormModalProps) => {
  const { restaurantEditId, setRestaurantSubpage } = useMypageStore();

  // Todo: edit인 경우 받아온 number로 식당 상세 조회
  const storeDetail =
    mode === "create" ? null : dummyRestaurantDetails[restaurantEditId! - 1];

  const [storeName, setStoreName] = useState(storeDetail?.store_name || "");
  const [businessNumber, setBusinessNumber] = useState("");
  const [address, setAddress] = useState(storeDetail?.address || "");
  const [phone, setPhone] = useState(storeDetail?.phone || "");
  const [openingHours, setOpeningHours] = useState(
    storeDetail?.opening_hours || ""
  );
  const [type, setType] = useState(storeDetail?.type || "");
  const [description, setDescription] = useState(
    storeDetail?.description || ""
  );
  const [menus, setMenus] = useState<string[]>([""]); // Todo
  const [imgUrls, setImgUrls] = useState<string[]>(
    storeDetail?.img_list || [""]
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [agree, setAgree] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateStoreForm({
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
    if (!agree)
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
      } catch (e) {
        console.log(data);
        alert(`${e}\n식당을 등록할 수 없습니다.`);
      }
    } else if (mode === "edit") {
      try {
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
        // await registerStore(data);
        await editStore(data, 1);
        alert(`식당 등록이 완료되었습니다.`);
        setRestaurantSubpage("restaurant-home");
      } catch (e) {
        alert(`${e}\n식당을 등록할 수 없습니다.`);
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
        {/* 이미지 URL(동적 필드 컴포넌트) */}
        <ImageUrlInputList imgUrls={imgUrls} setImgUrls={setImgUrls} />

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
