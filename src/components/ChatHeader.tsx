import { useChatStore } from "@/lib/chatStore";
import UserAvatar from "./Avatar";
import { FaPhone, FaVideo } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import {
  BsArrowLeft,
  BsArrowRight,
  BsChevronBarLeft,
  BsChevronBarRight,
} from "react-icons/bs";

export interface ChatHeaderProps {
  user: {
    username: string;
    avatar: string;
  };
}

const ChatHeader = ({ user }: ChatHeaderProps) => {
  const { showDetails, toggleDetails } = useChatStore();

  return (
    <div className="p-[20px] flex items-center border-b border-[#dddddd35] justify-between">
      <UserAvatar user={user} />
      <div className="flex gap-[20px]">
        <FaPhone size={20} />
        <FaVideo size={20} />
        {!showDetails ? (
          <SlOptionsVertical
            onClick={toggleDetails}
            size={20}
            className="cursor-pointer"
          />
        ) : (
          <BsArrowLeft
            onClick={toggleDetails}
            size={20}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
