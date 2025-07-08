import type { RestaurantDetail } from "../../types/restaurant.types";

export default function RestaurantDetailPhotoTab({ detail }: { detail: RestaurantDetail }) {
  const images = detail.img_urls || [];
  if (images.length === 0) {
    return <div className="text-gray-400 text-center py-12">등록된 사진이 없습니다.</div>;
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      {images.map((url, idx) => (
        <img
          key={idx}
          src={url}
          alt={`${detail.store_name} 사진 ${idx + 1}`}
          className="w-full h-40 object-cover rounded-lg shadow cursor-pointer transition-transform hover:scale-105"
          loading="lazy"
          // 클릭 시 확대/모달 등 추가 가능
        />
      ))}
    </div>
  );
}
