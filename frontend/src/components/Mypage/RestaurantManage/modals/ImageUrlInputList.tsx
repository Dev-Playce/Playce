import ImageUpload from "../../../Common/ImageUpload";
import ErrorMessage from "./ErrorMessage";

interface ImageUrlInputListProps {
  imgUrls: string[];
  setImgUrls: (urls: string[]) => void;
  error?: string;
}

const ImageUrlInputList = ({
  imgUrls,
  setImgUrls,
  error,
}: ImageUrlInputListProps) => {
  return (
    <div>
      <ImageUpload imageUrls={imgUrls} setImageUrls={setImgUrls} />
      <ErrorMessage message={error} />
    </div>
  );
};

export default ImageUrlInputList;
