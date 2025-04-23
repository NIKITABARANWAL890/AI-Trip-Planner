// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // <-- Correct import

const firebaseConfig = {
  apiKey: "AIzaSyAkamKhsXBCaJd3PEx31Dg-YLeFw4FTgrQ",
  authDomain: "ai-travel-planner-a998f.firebaseapp.com",
  projectId: "ai-travel-planner-a998f",
  storageBucket: "ai-travel-planner-a998f.appspot.com", // <-- also fix the storage bucket typo
  messagingSenderId: "849494437368",
  appId: "1:849494437368:web:7e44a9471fc0ac41fbba0d",
  measurementId: "G-5HFYFNPGR3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // <-- Correct function name
