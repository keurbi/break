import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDXIRaCGiACJ1xvN2IRDIH4s04rHa4aPzw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "break-36229.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "break-36229",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "break-36229.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "240067127939",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:240067127939:web:dacfb5fedbf6eb2f13c9b6",
};

let _app: FirebaseApp | null = null;

// Lazily initialize Firebase app only in the browser
export const getClientApp = (): FirebaseApp | null => {
  if (typeof window === "undefined") return null;
  if (_app) return _app;
  const apps = getApps();
  _app = apps.length === 0 ? initializeApp(firebaseConfig) : apps[0];
  return _app;
};

// Convenience helper to get Firestore safely on the client
export const getDb = (): Firestore | null => {
  const app = getClientApp();
  if (!app) return null;
  return getFirestore(app);
};

// Back-compat: export a no-SSR app reference; may be null on server
export const app = getClientApp() as unknown as FirebaseApp;