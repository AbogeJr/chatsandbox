// ChatHeader.tsx
import Image from "next/image";
import UserAvatar from "./Avatar";

export type User = {
    user: {
        username: string;
        avatar: string;
    };
};

const ChatHeader = ({ user }: User) => (
  <div className="top">
    <UserAvatar user={user} />
    <div className="icons">
      <Image width={20} height={20} src="/phone.png" alt="" />
      <Image width={20} height={20} src="/video.png" alt="" />
      <Image width={20} height={20} src="/info.png" alt="" />
    </div>
  </div>
);

export default ChatHeader;
