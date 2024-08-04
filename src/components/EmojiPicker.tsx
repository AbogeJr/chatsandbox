// EmojiPickerComponent.tsx
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";

type Props = {
    onEmojiClick: (e: any) => void;
};

const EmojiPickerComponent = ({ onEmojiClick } : Props ) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="emoji">
      <Image
        width={50} height={50}
        src="/emoji.png"
        alt=""
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="picker">
          <EmojiPicker onEmojiClick={(e) => {
            onEmojiClick(e);
            setOpen(false);
          }} />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerComponent;
