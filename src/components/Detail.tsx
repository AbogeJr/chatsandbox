import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { useChatStore } from "@/lib/chatStore";
import { auth, db } from "@/lib/firebase-config";
import { useUserStore } from "@/lib/userStore";
import Image from "next/image";
// import { User } from "./ChatHeader";
import { useState } from "react";
import { IoMdExit } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import { BsTrash } from "react-icons/bs";

interface AvatarProps {
  user: {
    username: string;
    avatar: string;
  };
}

const UserAvatar = ({ user }: AvatarProps) => (
  <div className="p-8 py-5 flex flex-col items-center gap-2 border-b border-[#dddddd35]">
    <Image
      className="w-16 h-16 rounded-full object-cover"
      width={300}
      height={300}
      src={user?.avatar || "/ava.jpg"}
      alt=""
    />
    <h2 className="text-xl">{user?.username}</h2>
    <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet.</p>
  </div>
);

const ChatSettings = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="flex flex-col ">
      <div className="w-full flex  items-center justify-between">
        <span>Chat Settings</span>
        <Image
          className="bg-gray-800 p-2.5 rounded-full cursor-pointer"
          width={30}
          height={30}
          src={isOpen ? "/arrowUp.png" : "/arrowDown.png"}
          alt=""
          onClick={toggleAccordion}
        />
      </div>
      {isOpen && (
        <div className="overflow-auto max-h-[180px]">
          <div className="flex flex-col gap-5 mt-5">
            <div className="flex flex-col items-center justify-between">
              <button className="w-full text-sm rounded-full p-2 bg-red-500 space-x-2 items-center justify-center flex">
                <BsTrash size={20} />
                <span>Delete Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MediaGallery = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col ">
      <div className="w-full flex  items-center justify-between">
        <span>Media</span>
        <Image
          className="bg-gray-800 p-2.5 rounded-full cursor-pointer"
          width={30}
          height={30}
          src={isOpen ? "/arrowUp.png" : "/arrowDown.png"}
          alt=""
          onClick={toggleAccordion}
        />
      </div>
      {isOpen && (
        <div className="overflow-auto max-h-[180px]">
          <div className="flex flex-col gap-5 mt-5">
            <MediaItem src="/ava.jpg" filename="image.jpg" />
          </div>
        </div>
      )}
    </div>
  );
};

interface MediaItemProps {
  src: string;
  filename: string;
}

const MediaItem = ({ src, filename }: MediaItemProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-5">
      <Image
        className="w-10 h-10 rounded object-cover"
        width={100}
        height={100}
        src={src}
        alt={filename}
      />
      <span className="text-sm text-gray-400 font-light">{filename}</span>
    </div>
    <Image
      width={30}
      height={30}
      src="/download.png"
      alt="Download"
      className="w-7 h-7 bg-gray-800 p-2.5 rounded-full cursor-pointer"
    />
  </div>
);

interface BlockButtonProps {
  isReceiverBlocked: boolean;
  isCurrentUserBlocked: boolean;
  userId: string;
  changeBlock: () => void;
}

const BlockButton = ({
  isReceiverBlocked,
  isCurrentUserBlocked,
  userId,
  changeBlock,
}: BlockButtonProps) => {
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
    <button
      onClick={handleBlock}
      className="p-2.5 bg-gray-800 text-sm text-white border-none  cursor-pointer hover:bg-red-500 rounded-full flex items-center justify-center space-x-2"
    >
      <MdBlock size={20} />
      <span>
        {isCurrentUserBlocked
          ? "You are Blocked!"
          : isReceiverBlocked
          ? "User blocked"
          : "Block User"}
      </span>
    </button>
  );
};

const LogoutButton = ({ resetChat }: any) => {
  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  return (
    <button
      className="p-2.5 text-sm bg-blue-600 flex items-center justify-center space-x-2 rounded-full"
      onClick={handleLogout}
    >
      <IoMdExit size={20} />
      <span>Log Out</span>
    </button>
  );
};

const Detail = () => {
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    resetChat,
  } = useChatStore();

  return (
    <div className="flex-1">
      <UserAvatar user={user} />
      <div className="p-4 py-0 pt-2 flex flex-col gap-5 overflow-auto border-red-500 h-full max-h-[400px]">
        <ChatSettings />
        <MediaGallery />
        <div className="w-full mt-auto flex flex-col gap-2">
          <BlockButton
            isReceiverBlocked={isReceiverBlocked}
            isCurrentUserBlocked={isCurrentUserBlocked}
            userId={user?.id}
            changeBlock={changeBlock}
          />
          <LogoutButton resetChat={resetChat} />
        </div>
      </div>
    </div>
  );
};

export default Detail;
