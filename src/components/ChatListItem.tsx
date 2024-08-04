import Image from "next/image";
import { DocumentData } from "firebase/firestore";

interface ChatItemProps {
  chat: DocumentData;
  currentUser: DocumentData;
  handleSelect: (chat: DocumentData) => void;
}

const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  currentUser,
  handleSelect,
}) => {
  return (
    <div
      className="flex items-center gap-[20px] p-[20px] cursor-pointer border-b-[1px] border-b-[#dddddd35]"
      onClick={() => handleSelect(chat)}
      style={{
        backgroundColor: chat.isSeen ? "transparent" : "#5183fe",
      }}
    >
      <Image
        width={50}
        height={50}
        className="w-[50px] h-[50px] rounded-full object-cover"
        src={
          chat.user.blocked.includes(currentUser.id)
            ? "/ava.jpg"
            : chat.user.avatar || "ava.jpg"
        }
        alt=""
      />
      <div className="flex flex-col gap-[10px]">
        <span className="font-[500]">
          {chat.user.blocked.includes(currentUser.id)
            ? "User"
            : chat.user.username}
        </span>
        <p className="text-[14px] font-[300]">
          {chat.lastMessage.slice(0, 25)}...
        </p>
      </div>
    </div>
  );
};

export default ChatItem;
