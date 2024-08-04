"use client";
import { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import Detail from "@/components/Detail";
import List from "@/components/List";
import Login from "@/components/Auth";
import Notification from "@/components/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import { useUserStore } from "@/lib/userStore";
import { useChatStore } from "@/lib/chatStore";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId, showDetails } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <div
          className="inline-block  h-40 w-40 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] "
          role="status"
        ></div>
      </div>
    );

  return (
    <div className="md:min-w-[1200px] w-full h-[90vh] mt-[30px] bg-[rgba(0,0,0,0.9)] backdrop-blur-[19px] border-[#dddddd35] backdrop-saturate-[180%] rounded-3xl border  flex">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && showDetails && <Detail />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
