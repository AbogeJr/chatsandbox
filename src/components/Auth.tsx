"use client"
import { useState } from "react";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, provider } from "@/lib/firebase-config";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import upload from "@/lib/upload";
import Image from "next/image";
import Cookies from 'universal-cookie'
const cookies = new Cookies()

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e:any) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e:any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { username, email, password, preferredLanguage } = Object.fromEntries(formData);

    // VALIDATE INPUTS
    if (!username || !email || !password)
      return toast.warn("Please enter inputs!");
    if (!avatar.file) {
        toast.warn("Please upload an avatar!")
        setLoading(false);
        return;
    };

    // VALIDATE UNIQUE USERNAME
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return toast.warn("Select another username");
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email as string, password as string);

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
    } catch (err:any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e:any) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email as string, password as string);
    } catch (err : any) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    try{
        await signInWithPopup(auth, provider)
    } catch (err:any) {
      console.log(err);
    }
}

  return (
    
    <div className="login relative">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
          {/* <button onClick={signInGoogle} >Sign In With Google</button> */}
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <Image src={avatar.url || "/avatar.png"} alt="" width={100} height={100} />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <select className="w-full p-6 text-black" name="preferredLanguage">
            <option value="en-GB">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
          <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
        </form>
      </div>
    </div>
    
  );
};

export default Login;