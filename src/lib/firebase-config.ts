import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAiuwHoRZAcC5O2iuHOX1A_5tZCNTphslY",
  authDomain: "chateasy-5655d.firebaseapp.com",
  projectId: "chateasy-5655d",
  storageBucket: "chateasy-5655d.appspot.com",
  messagingSenderId: "273622710982",
  appId: "1:273622710982:web:c3b83e77931572f11db5c7",
  measurementId: "G-HEVQZGXP5R",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
