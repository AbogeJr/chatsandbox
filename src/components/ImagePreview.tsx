// ImagePreview.tsx
import Image from "next/image";
import { ImageState } from "./Chat";

interface Props {
    img: ImageState
};

const ImagePreview = ({ img } : Props) => (
  img.url && (
    <div className="message own">
      <div className="texts">
        <Image width={20} height={20} src={img.url} alt="" />
      </div>
    </div>
  )
);

export default ImagePreview;
