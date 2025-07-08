import { useState } from "react";
import type { RestaurantDetail } from "../../types/restaurant.types";
import { FiX } from "react-icons/fi";

export default function RestaurantDetailPhotoTab({
  detail,
}: {
  detail: RestaurantDetail;
}) {
  const images = detail.img_urls || [];
  const [modalImg, setModalImg] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="text-gray-400 text-center py-12">
        등록된 사진이 없습니다.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`${detail.store_name} 사진 ${idx + 1}`}
            className="w-full h-40 object-cover rounded-lg shadow cursor-pointer transition-transform hover:scale-105"
            loading="lazy"
            onClick={() => setModalImg(url)}
          />
        ))}
      </div>
      {modalImg && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center"
          onClick={() => setModalImg(null)}
        >
          <div className="relative">
            <img
              src={modalImg}
              alt="전체보기"
              className="max-w-[90vw] max-h-[90vh] object-contain select-none"
              style={{ boxShadow: "none", border: "none", background: "none" }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setModalImg(null)}
              className="absolute top-6 right-6 bg-white/90 rounded-full p-2 shadow hover:bg-orange-50 transition z-20"
              aria-label="닫기"
            >
              <FiX className="text-primary5 text-lg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
