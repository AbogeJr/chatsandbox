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
  <div className="center">
    {chat ? chat?.messages?.map((message: Message, index: number) => (
      <div
        className={message.senderId === currentUser?.id ? "message own" : "message"}
        key={index}
      >
        <div className="texts">
          {message.img && <Image width={500} height={500} src={message.img} alt="" />}
          <p>{message.content[0][currentUser.preferredLanguage]} </p>
          <span className={message.senderId === currentUser?.id ? "text-end " : ""}
          >{format(message.createdAt.toDate())}</span>
        </div>
      </div>
    )) : <h2>No chats yet</h2>}
    <div ref={endRef}></div>
  </div>
);

export default ChatMessages;
