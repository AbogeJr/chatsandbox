// Chat.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { arrayUnion, doc, DocumentData, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { useChatStore } from "@/lib/chatStore";
import { useUserStore } from "@/lib/userStore";
import upload from "@/lib/upload";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ImagePreview from "./ImagePreview";
import ChatInput from "./ChatInput";


export interface ImageState {
    file: File | null;
    url: string | null;
  }

const Chat = () => {
  const [chat, setChat] = useState<DocumentData>();
  const [text, setText] = useState("");
  const [img, setImg] = useState<ImageState>({ file: null, url: "" });
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const endRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  if (endRef.current) {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [chat?.messages]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  interface EmojiEvent  {
    emoji: string;
  };
  
  const handleEmoji = (e: EmojiEvent) => setText((prev) => prev + e.emoji);

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleTranslate = async (text: string, targetLang: string) => {
    const response = await fetch('/api/route', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, target_lang: targetLang }),
    });
    const res = await response.json();
    return res.result.text;
  };

  const handleSend = async () => {
    if (text === "") return;
    let imgUrl = null;
    const translation = await handleTranslate(text, user.preferredLanguage);

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          currentLanguage: currentUser.preferredLanguage || "en-GB",
          content: [
            { [currentUser.preferredLanguage]: text, [user.preferredLanguage]: translation },
          ],
          createdAt: new Date(),
          ...(imgUrl ? { img: imgUrl } : {}),
        }),
      });

      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex((c : DocumentData) => c.chatId === chatId);
          userChatsData.chats[chatIndex].lastMessage = id == currentUser.id ? text : translation;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
          await updateDoc(userChatsRef, { chats: userChatsData.chats });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setImg({ file: null, url: "" });
      setText("");
    }
  };

  return (
    <div className="flex-[2] border-l-[1px] border-r-[1px]  border-[#dddddd35] h-full flex flex-col">
      <ChatHeader user={user} />
      <ChatMessages chat={chat} currentUser={currentUser} endRef={endRef} />
      <ImagePreview img={img} />
      <ChatInput
        text={text}
        setText={setText}
        handleSend={handleSend}
        handleImg={handleImg}
        isDisabled={isCurrentUserBlocked || isReceiverBlocked}
        onEmojiClick={handleEmoji}
      />
    </div>
  );
};

export default Chat;
