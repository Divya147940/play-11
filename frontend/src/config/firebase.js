import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace with your actual Firebase configuration from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyB0d97GZdny7FW_pnM-IAuE8XV3iySYeqI",
  authDomain: "play-11-developer-592a1.firebaseapp.com",
  projectId: "play-11-developer-592a1",
  storageBucket: "play-11-developer-592a1.firebasestorage.app",
  messagingSenderId: "281328158151",
  appId: "1:281328158151:web:c5ca5f40f1bbb50c79c5e2",
  measurementId: "G-WETZ7DJRTT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
