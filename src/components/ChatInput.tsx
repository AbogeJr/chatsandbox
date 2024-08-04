// ChatInput.tsx
import Image from "next/image";
import EmojiPickerComponent from "./EmojiPicker";

type Props = {
    text: string;
    setText: (text: string) => void;
    handleSend: () => void;
    handleImg: (e: any) => void;
    isDisabled: boolean;
    onEmojiClick: (e: any) => void;
};


const ChatInput = ({ text, setText, handleSend, handleImg, isDisabled, onEmojiClick } : Props) => (
  <div className="bottom">
    <div className="icons">
      <label htmlFor="file">
        <Image width={50} height={50} src="/img.png" alt="" />
      </label>
      <input
        type="file"
        id="file"
        style={{ display: "none" }}
        onChange={handleImg}
      />
      <Image width={20} height={20} src="/camera.png" alt="" />
      <Image width={20} height={20} src="/mic.png" alt="" />
    </div>
    <input
      type="text"
      placeholder={isDisabled ? "You cannot send a message" : "Type a message..."}
      value={text}
      onChange={(e) => setText(e.target.value)}
      disabled={isDisabled}
    />
    <EmojiPickerComponent onEmojiClick={onEmojiClick} />
    <button
      className="sendButton"
      onClick={handleSend}
      disabled={isDisabled}
    >
      Send
    </button>
  </div>
);

export default ChatInput;
