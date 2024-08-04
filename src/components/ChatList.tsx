"use client";

import { useEffect, useState } from "react";
import AddUser from "./AddUser";
import { useUserStore } from "@/lib/userStore";
import {
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { useChatStore } from "@/lib/chatStore";
import SearchBar from "./SearchBar";
import ChatItem from "./ChatListItem";

const ChatList: React.FC = () => {
  const [chats, setChats] = useState<DocumentData[]>([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState("");

  const { currentUser } = useUserStore();
  const { changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res: DocumentData) => {
        const items = res.data().chats || [];

        const promises = items.map(async (item: any) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat: DocumentData) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, "userchats", currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const toggleAddMode = () => {
    setAddMode((prev) => !prev);
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="flex-[1]  ">
      <SearchBar
        input={input}
        setInput={setInput}
        addMode={addMode}
        toggleAddMode={toggleAddMode}
      />
      <div className="overflow-y-scroll max-h-[405px]">
        {filteredChats.map((chat) => (
          <ChatItem
            key={chat.chatId}
            chat={chat}
            currentUser={currentUser}
            handleSelect={handleSelect}
          />
        ))}
      </div>

      {addMode && <AddUser toggleAddMode={toggleAddMode} />}
    </div>
  );
};

export default ChatList;
