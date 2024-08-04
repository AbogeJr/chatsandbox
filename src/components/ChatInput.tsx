// ChatInput.tsx
import Image from "next/image";
import EmojiPickerComponent from "./EmojiPicker";
import { IoIosAttach, IoIosSend } from "react-icons/io";
import { FaCameraRetro,FaMicrophoneAlt } from "react-icons/fa";


interface Props  {
    text: string;
    setText: (text: string) => void;
    handleSend: () => void;
    handleImg: (e: any) => void;
    isDisabled: boolean;
    onEmojiClick: (e: any) => void;
};


const ChatInput = ({ text, setText, handleSend, handleImg, isDisabled, onEmojiClick } : Props) => (
  <div className="p-5 flex items-center justify-between border-t border-[#dddddd35] gap-5 mt-auto">
    <div className="flex gap-5">
      <label htmlFor="file">
      <IoIosAttach className="w-5 h-5 cursor-pointer" size={20}/>
      </label>
      <input
        type="file"
        id="file"
        className="hidden"
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
      className="flex-1 w-2/5 bg-gray-800 border-none outline-none text-white p-5 rounded-lg text-base disabled:cursor-not-allowed"
    />
    <EmojiPickerComponent onEmojiClick={onEmojiClick} />
    <button
      className="bg-blue-500 text-white py-2 px-5 border-none rounded cursor-pointer disabled:bg-blue-400 disabled:cursor-not-allowed"
      onClick={handleSend}
      disabled={isDisabled}
    >
      <IoIosSend size={20}/>
    </button>
  </div>
);

export default ChatInput;
