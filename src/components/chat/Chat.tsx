"use client"
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  DocumentData,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase-config";
import { useChatStore } from "@/lib/chatStore";
import { useUserStore } from "@/lib/userStore";
import upload from "@/lib/upload";
import { format } from "timeago.js";
import Image from "next/image";

const Chat = () => {
  const [chat, setChat] = useState<DocumentData | null>(null);

  // const [chat, setChat] = useState({messages: [{text: "Say hi to your friend!", createdAt: new Date().getDate()}], img: "", senderId: "", receiverId: ""});
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();

  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("CHAAAATS", chat?.messages);
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data() as DocumentData);
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e:any) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleImg = (e: any) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };


  const handleTranslate = async (text: string, targetLang:string) => {
    const response = await fetch('/api/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      },
        body: JSON.stringify({ text, target_lang: targetLang }),
    });

    const res = await response.json();
    console.log("RESPONSE", res);
    return res.result.text;
  }

  const handleSend = async () => {
    console.log("SENDING message");
    if (text === "") return;
    let imgUrl = null;
    const translation = await handleTranslate(text, user.preferredLanguage);

  
    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      // TODO: add origin && target language
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          currentLanguage: currentUser.preferredLanguage || "en-GB",
          content: [
            { [currentUser.preferredLanguage]: text , 
              [user.preferredLanguage]: translation } 
            // { [user.preferredLanguage]: translation } 
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

          const chatIndex = userChatsData.chats.findIndex(
            (c:any) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally{
    setImg({
      file: null,
      url: "",
    });

    setText("");
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <Image width={100} height={100} src={user?.avatar || "/avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem ipsum dolor, sit amet.</p>
          </div>
        </div>
        <div className="icons">
          <Image width={20} height={20} src="/phone.png" alt="" />
          <Image width={20} height={20} src="/video.png" alt="" />
          <Image width={20} height={20} src="/info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat ? chat?.messages?.map((message:any, index: number) => (
          <div
            className={
              message.senderId === currentUser?.id ? "message own" : "message"
            }
            key={index}
          >
            <div className="texts">
              {message.img && <Image width={500} height={500} src={message.img} alt="" />}
              <p>{message.content[0][currentUser.preferredLanguage]} </p>
              <span>{format(message.createdAt.toDate())}</span>
            </div>
          </div>
        )) : <h2>No chats yet</h2>}
        {img.url && (
          <div className="message own">
            <div className="texts">
              <Image width={20} height={20} src={img.url} alt="" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <Image width={50} height={50} src="/img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <Image width={20} height={20} src="/camera.png" alt="" />
          <Image width={20} height={20} src="/mic.png" alt="" />

        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <Image
            width={50}
            height={50}
            src="/emoji.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSend}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
