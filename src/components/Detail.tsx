import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "@/lib/chatStore";
import { auth, db } from "@/lib/firebase-config";
import { useUserStore } from "@/lib/userStore";
import Image from "next/image";
import { User } from "./ChatHeader";


const UserAvatar = ({ user } : User ) => (
  <div className="user">
    <Image width={400} height={400} src={user?.avatar || "/avatar.png"} alt="" />
    <h2>{user?.username}</h2>
    <p>Lorem ipsum dolor sit amet.</p>
  </div>
);

const ChatSettings = () => (
  <div className="option">
    <div className="title">
      <span>Chat Settings</span>
      <Image width={20} height={20} src="/arrowDown.png" alt="" />
    </div>
  </div>
);

const MediaGallery = () => (
  <div className="option">
    <div className="title">
      <span>Media</span>
      <Image width={30} height={30} src="/arrowUp.png" alt="" />
    </div>
    <div className="photos">
      <MediaItem src="/alo.jpg" filename="photo_2024_2.png" />
    </div>
  </div>
);

interface MediaItemProps {
  src: string;
  filename: string;
}

const MediaItem = ({ src, filename } : MediaItemProps) => (
  <div className="photoItem">
    <div className="photoDetail">
      <Image width={100} height={100} src={src} alt={filename} />
      <span>{filename}</span>
    </div>
    <Image width={30} height={30} src="/download.png" alt="Download" className="icon" />
  </div>
);

interface BlockButtonProps {
  isReceiverBlocked: boolean;
  isCurrentUserBlocked: boolean;
  userId: string;
  changeBlock: () => void;
}

const BlockButton = ({ isReceiverBlocked, isCurrentUserBlocked, userId, changeBlock } : BlockButtonProps) => {
  const { currentUser } = useUserStore();

  const handleBlock = async () => {
    if (!userId) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(userId) : arrayUnion(userId),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <button onClick={handleBlock}>
      {isCurrentUserBlocked
        ? "You are Blocked!"
        : isReceiverBlocked
        ? "User blocked"
        : "Block User" }


    </button>
  );
};



const LogoutButton = ({ resetChat } : any) => {
  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  return (
    <button className="logout" onClick={handleLogout}>
      Logout
    </button>
  );
};

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } =
    useChatStore();

  return (
    <div className="detail">
      <UserAvatar user={user} />
      <div className="info">
        <ChatSettings />
        <MediaGallery />
        <BlockButton
          isReceiverBlocked={isReceiverBlocked}
          isCurrentUserBlocked={isCurrentUserBlocked}
          userId={user?.id}
          changeBlock={changeBlock}
        />
        <LogoutButton resetChat={resetChat} />
      </div>
    </div>
  );
};

export default Detail;
