"use client";
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

const AddUser = ({ toggleAddMode }: any) => {
  const [user, setUser] = useState<DocumentData>();

  const { currentUser } = useUserStore();

  const handleSearch = async (e: any) => {
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
    } finally {
      toggleAddMode();
    }
  };

  return (
    <div className="w-max h-max p-[30px] border border-[#dddddd35] bg-black/95 rounded-[10px] absolute top-0 bottom-0 left-0 right-0 m-auto">
      <h2 className="mb-5  text-center text-gray-500 text-xl">
        Search for a User by their Username
      </h2>
      <form className="flex gap-[20px]" onSubmit={handleSearch}>
        <input
          className="p-4 rounded-[10px] border-none outline-none"
          type="text"
          placeholder="Username"
          name="username"
        />
        <button className="p-4 px-9 rounded-full bg-[orangered] text-white border-none cursor-pointer">
          Search
        </button>
      </form>
      {user && (
        <div className="mt-[50px] flex items-center justify-between">
          <div className="flex items-center gap-[20px]">
            <Image
              className="w-[50px] h-[50px] rounded-full object-cover"
              width={100}
              height={100}
              src={user.avatar || "/ava.jpg"}
              alt=""
            />
            <span>{user.username}</span>
          </div>
          <button
            className="p-4 px-6 rounded-full bg-[orangered] text-white border-none cursor-pointer"
            onClick={handleAdd}
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
