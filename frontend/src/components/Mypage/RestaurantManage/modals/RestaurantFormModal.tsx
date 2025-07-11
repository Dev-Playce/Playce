import { useState } from "react";
import type { StoreFormRequest } from "../../../../types/restaurantFormRequest";
import MenuInputList from "./MenuInputList";
import ImageUrlInputList from "./ImageUrlInputList";
import ErrorMessage from "./ErrorMessage";
import validateStoreForm from "./validateStoreForm";

interface StoreFormModalProps {
  mode: "create" | "edit";
  initial?: StoreFormRequest;
  onSubmit: (data: StoreFormRequest) => void;
  onClose: () => void;
}

const StoreFormModal = ({
  mode,
  initial,
  onSubmit,
  onClose,
}: StoreFormModalProps) => {
  const [storeName, setStoreName] = useState(initial?.store_name || "");
  const [businessNumber, setBusinessNumber] = useState(
    initial?.business_number || ""
  );
  const [address, setAddress] = useState(initial?.address || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [openingHours, setOpeningHours] = useState(
    initial?.opening_hours || ""
  );
  const [type, setType] = useState(initial?.type || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [menus, setMenus] = useState<string[]>(initial?.menus || [""]);
  const [imgUrls, setImgUrls] = useState<string[]>(initial?.img_urls || [""]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
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
      img_urls: imgUrls,
    });
    if (!agree)
      newErrors.agree = "중계권 관련 약관에 동의해야 등록이 가능합니다.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      store_name: storeName,
      business_number: businessNumber,
      address,
      phone,
      opening_hours: openingHours,
      menus: menus.filter(Boolean),
      type,
      description,
      img_urls: imgUrls.filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto p-8">
        <h3 className="text-xl font-bold mb-6">
          {mode === "edit" ? "식당 수정" : "식당 등록"}
        </h3>
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
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              주소 <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
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
          <MenuInputList
            menus={menus}
            setMenus={setMenus}
            error={errors.menus}
          />
          {/* 소개(선택) */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              소개
            </label>
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
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-100"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald-500 text-white font-bold"
              disabled={!agree}
            >
              {mode === "edit" ? "수정" : "등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoreFormModal;
