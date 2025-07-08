import { useState } from "react";
import { MdUploadFile } from "react-icons/md";
import { IoClose } from "react-icons/io5";

export default function ImageUpload({
  imageUrls,
  setImageUrls,
}: {
  imageUrls: string[];
  setImageUrls: (imageUrls: string[]) => void;
}) {
  const [isActive, setActive] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleDragEnter = () => setActive(true);
  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setActive(false);
    }
  };
  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const setFileInfo = (file: File) => {
    if (imageUrls.length >= 3) {
      alert("이미지는 최대 3개까지 등록 가능합니다");
      return;
    }
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      if (typeof e.target?.result === "string") {
        setImageUrls([...imageUrls, e.target.result]);
      }
    };
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setActive(false);
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFileInfo(file);
    } else {
      alert("이미지 파일만 업로드할 수 있습니다.");
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFileInfo(file);
    } else {
      alert("이미지 파일만 업로드할 수 있습니다.");
    }
  };

  const closeImage = (idx: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== idx));
  };

  const openImagePreview = (src: string) => {
    setSelectedImage(src);
    setShowModal(true);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
    setShowModal(false);
  };

  return (
    <div className="flex gap-5 overflow-x-auto items-center whitespace-nowrap">
      {imageUrls.map((img, index) => (
        <div
          key={index}
          className="w-[100px] h-[100px] relative group cursor-pointer"
        >
          <img
            src={img}
            alt={`uploaded-${index}`}
            className="w-full h-full object-cover rounded"
            onClick={() => openImagePreview(img)}
          />
          <button
            className="absolute top-1 right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-black hover:bg-gray-100 hidden group-hover:flex"
            onClick={() => closeImage(index)}
          >
            <IoClose className="text-xl" />
          </button>
        </div>
      ))}

      <label
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col gap-2 justify-center items-center min-w-[100px] min-h-[100px] border-2 rounded border-dashed cursor-pointer transition
          ${
            isActive ? "border-black bg-gray-200" : "border-gray-400 bg-white"
          } hover:border-black`}
      >
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleUpload}
        />
        <MdUploadFile className="text-[40px] text-gray-500" />
        <span className="text-[14px] text-gray-600">클릭 또는 드롭</span>
      </label>

      {showModal && selectedImage && (
        <div
          onClick={closeImagePreview}
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
        >
          <img
            src={selectedImage}
            alt="preview"
            className="max-w-[90%] max-h-[90%] rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
