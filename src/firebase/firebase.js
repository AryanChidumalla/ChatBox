import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBND5o26o3iiBrFLJDjEKsxcmb7ZJ51WOY",
  authDomain: "chatbox-f1892.firebaseapp.com",
  projectId: "chatbox-f1892",
  storageBucket: "chatbox-f1892.appspot.com",
  messagingSenderId: "1069090928759",
  appId: "1:1069090928759:web:38aa34f2b866a1072f2e72"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()