import UserAvatar from "./Avatar";
import { FaPhone, FaVideo } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";


export type User = {
    user: {
        username: string;
        avatar: string;
    };
};

const ChatHeader = ({ user }: User) => (
  <div className="p-[20px] flex items-center border-b  justify-between">
    <UserAvatar user={user} />
    <div className="flex gap-[20px]">
      <FaPhone size={20}/>
      <FaVideo size={20}/>
      <SlOptionsVertical size={20}/>
    </div>
  </div>
);

export default ChatHeader;
