// ImagePreview.tsx
import Image from "next/image";
import { ImageState } from "./Chat";

interface Props {
  img: ImageState;
}

const ImagePreview = ({ img }: Props) =>
  img.url && (
    <div
      className={`border m-5 rounded-3xl border-gray-800 p-5 bg-black flex gap-[20px] self-center`}
    >
      <div className="flex flex-col gap-[5px]">
        <Image
          width={200}
          height={200}
          src={img.url}
          alt="image to be uploaded"
        />
        <span className="text-xs text-gray-500">Uploading File...</span>
      </div>
    </div>
  );

export default ImagePreview;
