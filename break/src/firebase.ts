import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDXIRaCGiACJ1xvN2IRDIH4s04rHa4aPzw",
  authDomain: "break-36229.firebaseapp.com",
  projectId: "break-36229",
  storageBucket: "break-36229.firebasestorage.app",
  messagingSenderId: "240067127939",
  appId: "1:240067127939:web:dacfb5fedbf6eb2f13c9b6"
};

if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}

export const app = initializeApp(firebaseConfig);