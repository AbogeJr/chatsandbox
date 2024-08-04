// ChatMessages.tsx
import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import { format } from "timeago.js";

type Message = {
    senderId: string;
    img: string;
    content: string;
    createdAt: {
        toDate: () => any;
    };
};

type Props = {
    chat:DocumentData | undefined
    currentUser: any;
    endRef: any;
};

const ChatMessages = ({ chat, currentUser, endRef } : Props) => (
  <div className="p-[20px] flex-[1] overflow-scroll flex flex-col gap-[20px]">
    {chat ? chat?.messages?.map((message: Message, index: number) => (
      <div
        className={`max-w-[60%] flex gap-[20px] self-start
 ${message.senderId === currentUser?.id ? "self-end " : ""}`}
        key={index}
      >
        <div className=" flex flex-col gap-[5px]">
          {message.img && <Image width={500} height={500} src={message.img} className="w-[30px] h-[30px] rounded-full object-cover" alt="" />}
          <p className={`${message.senderId === currentUser.id ? "bg-[#5183fe] rounded-[20px] rounded-tr-none p-[12px_20px]" : "p-[12px_20px] bg-[rgba(17,25,40,0.3)] rounded-[20px] rounded-tl-none"}`}>{message.content[0][currentUser.preferredLanguage]} </p>
          <span className={message.senderId === currentUser?.id ? "text-end font-thin text-xs" : "font-thin text-xs"}
          >{format(message.createdAt.toDate())}</span>
        </div>
      </div>
    )) : <h2>No chats yet</h2>}
    <div ref={endRef}></div>
  </div>
);

export default ChatMessages;
