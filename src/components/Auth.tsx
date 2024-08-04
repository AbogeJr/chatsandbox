"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase-config";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import upload from "@/lib/upload";
import Image from "next/image";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e: any) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { username, email, password, preferredLanguage } =
      Object.fromEntries(formData);

    // VALIDATE INPUTS
    if (!username || !email || !password)
      return toast.warn("Please enter inputs!");

    // VALIDATE UNIQUE USERNAME
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return toast.warn("Select another username");
    }

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        preferredLanguage,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created! You can login now!");
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(
        auth,
        email as string,
        password as string
      );
    } catch (err: any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center gap-24 relative">
      <div className="flex-1 flex flex-col items-center gap-5">
        <h2>Welcome back,</h2>
        <form
          className="flex flex-col items-center justify-center gap-5"
          onSubmit={handleLogin}
        >
          <input
            className="p-4 border-none outline-none bg-gray-800 text-white rounded-full"
            type="text"
            placeholder="Email"
            name="email"
          />
          <input
            className="p-4 border-none outline-none bg-gray-800 text-white rounded-full"
            type="password"
            placeholder="Password"
            name="password"
          />
          <button
            className="w-full rounded-full p-4 border-none bg-blue-500 text-white cursor-pointer font-medium disabled:cursor-not-allowed disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Loading" : "Sign In"}
          </button>
        </form>
      </div>
      <div className="h-4/5 w-[1px] bg-gray-800"></div>
      <div className="flex-1 flex flex-col items-center gap-5">
        <h2>Create an Account</h2>
        <form
          className="flex flex-col items-center justify-center gap-5"
          onSubmit={handleRegister}
        >
          <label
            className="w-full flex items-center justify-between cursor-pointer underline"
            htmlFor="file"
          >
            <Image
              className="w-12 h-12 rounded object-cover opacity-60"
              src={avatar.url || "/ava.jpg"}
              alt=""
              width={100}
              height={100}
            />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={handleAvatar}
          />
          <input
            className="p-4 px-6 border-none outline-none bg-gray-800 text-white rounded-full"
            type="text"
            placeholder="Username"
            name="username"
          />
          <input
            className="p-4 px-6 border-none outline-none bg-gray-800 text-white rounded-full"
            type="email"
            placeholder="Email"
            name="email"
          />
          <input
            className="p-4 px-6 border-none outline-none bg-gray-800 text-white rounded-full"
            type="password"
            placeholder="Password"
            name="password"
          />
          <select
            className="w-full p-4 text-black rounded-full px-6 sele"
            name="preferredLanguage"
          >
            <option value="en-GB">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
          <button
            className="w-full p-4 border-none bg-blue-500 text-white rounded-full cursor-pointer font-medium disabled:cursor-not-allowed disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Loading" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
