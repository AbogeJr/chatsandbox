// UserAvatar.tsx
import Image from "next/image";

type Props = {
    user: {
        username: string;
        avatar: string;
    };
};

const UserAvatar = ({ user }: Props) => (
  <div className="flex items-center gap-[20px]">
    <Image className="w-[60px] h-[60px] rounded-full object-cover" width={100} height={100} src={user?.avatar || "/avatar.png"} alt="" />
    <div className="flex flex-col gap-[5px]">
      <span>{user?.username}</span>
      <p className="text-xs text-gray-500">Private Converation.</p>
    </div>
  </div>
);

export default UserAvatar;
