// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMExvg_ht4vBNl9WzOoBSwQOyk2dGIWww",
  authDomain: "codespace-159cb.firebaseapp.com",
  projectId: "codespace-159cb",
  storageBucket: "codespace-159cb.firebasestorage.app",
  messagingSenderId: "311054863249",
  appId: "1:311054863249:web:bd2ebb48b5aa594b49a830",
  measurementId: "G-0E7B7Z33ZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);