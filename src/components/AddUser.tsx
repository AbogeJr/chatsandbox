"use client"
import { db } from "@/lib/firebase-config";
import {
  arrayUnion,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useUserStore } from "@/lib/userStore";
import Image from "next/image";

const AddUser = () => {
  const [user, setUser] = useState<DocumentData>();

  const { currentUser } = useUserStore();

  const handleSearch = async (e:any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user?.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user?.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-max h-max p-[30px] bg-[rgba(17,25,40,0.781)] rounded-[10px] absolute top-0 bottom-0 left-0 right-0 m-auto">
      <form className="flex gap-[20px]" onSubmit={handleSearch}>
        <input className="p-[20px] rounded-[10px] border-none outline-none" type="text" placeholder="Username" name="username" />
        <button className="p-[20px] rounded-[10px] bg-[#1a73e8] text-white border-none cursor-pointer">Search</button>
      </form>
      {user && (
        <div className="mt-[50px] flex items-center justify-between">
          <div className="flex items-center gap-[20px]">
            <Image className="w-[50px] h-[50px] rounded-full object-cover"  width={100} height={100} src={user.avatar || "/avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button className="p-[10px] rounded-[10px] bg-[#1a73e8] text-white border-none cursor-pointer" onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
