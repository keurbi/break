import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDXIRaCGiACJ1xvN2IRDIH4s04rHa4aPzw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "break-36229.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "break-36229",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "break-36229.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "240067127939",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:240067127939:web:dacfb5fedbf6eb2f13c9b6",
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];