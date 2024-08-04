"use client"
import { useEffect } from "react";
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
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <div className="w-[1200px] h-[90vh] mt-[30px] bg-[rgba(0,0,0,0.9)] backdrop-blur-[19px] backdrop-saturate-[180%] rounded-[12px] border border-[rgba(255,255,255,0.125)] flex">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (
        <Login />
      )}
      <Notification />
    </div>
  );
};

export default App;
