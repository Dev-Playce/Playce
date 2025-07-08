import ImageUpload from "../../../Common/ImageUpload";

interface ImageUrlInputListProps {
  imgUrls: string[];
  setImgUrls: (urls: string[]) => void;
}

const ImageUrlInputList = ({ imgUrls, setImgUrls }: ImageUrlInputListProps) => {
  return <ImageUpload imageUrls={imgUrls} setImageUrls={setImgUrls} />;
};

export default ImageUrlInputList;
