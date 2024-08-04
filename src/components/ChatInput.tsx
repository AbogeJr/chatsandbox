// ChatInput.tsx
import Image from "next/image";
import EmojiPickerComponent from "./EmojiPicker";
import { IoIosAttach, IoIosSend } from "react-icons/io";
import { FaCameraRetro,FaMicrophoneAlt } from "react-icons/fa";


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
      <IoIosAttach className="cursor-pointer" size={20}/>


      </label>
      <input
        type="file"
        id="file"
        style={{ display: "none" }}
        onChange={handleImg}
      />
      <FaCameraRetro className="cursor-pointer" size={20} />
      <FaMicrophoneAlt className="cursor-pointer" size={20} />
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
      <IoIosSend size={20}/>
    </button>
  </div>
);

export default ChatInput;
