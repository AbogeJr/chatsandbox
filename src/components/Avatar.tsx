// UserAvatar.tsx
import Image from "next/image";

type Props = {
    user: {
        username: string;
        avatar: string;
    };
};

const UserAvatar = ({ user }: Props) => (
  <div className="user">
    <Image width={100} height={100} src={user?.avatar || "/avatar.png"} alt="" />
    <div className="texts">
      <span>{user?.username}</span>
      <p>Lorem ipsum dolor, sit amet.</p>
    </div>
  </div>
);

export default UserAvatar;
