// EmojiPickerComponent.tsx
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";
import { BsEmojiSmile } from "react-icons/bs";

type Props = {
    onEmojiClick: (e: any) => void;
};

const EmojiPickerComponent = ({ onEmojiClick } : Props ) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <BsEmojiSmile size={20} className="cursor-pointer" onClick={() => setOpen((prev) => !prev)} />
      {open && (
        <div className="absolute bottom-12 left-0">
          <EmojiPicker  onEmojiClick={(e) => {
            onEmojiClick(e);
            setOpen(false);
          }} />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerComponent;
