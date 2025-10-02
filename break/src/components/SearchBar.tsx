"use client";
import React from "react";
import { Bell, LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getClientApp } from "../firebase";

const SearchBar: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const app = getClientApp();
    const auth = app ? getAuth(app) : getAuth();
    await signOut(auth);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login");
  };
  return (
    <div className="w-full p-4 flex items-center">
      <input
        type="text"
        placeholder="Rechercher..."
        className="flex-grow p-4 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary h-12 text-[#7346FF] font-bold text-lg"
      />
      <button
        className="group ml-4 p-2 rounded-full bg-white shadow-md transition-all duration-200
                hover:bg-[#7346FF] hover:shadow-lg hover:-translate-y-0.5
                active:translate-y-0 active:shadow-md active:scale-95
                focus:outline-none focus-visible:ring-4 focus-visible:ring-[#7346FF]/40"
        aria-label="Notifications"
      >
        <Bell className="w-6 h-6 text-[#7346FF] transition-colors group-hover:text-white" />
      </button>
      <button
        className="group ml-4 p-2 rounded-full bg-white shadow-md transition-all duration-200
                hover:bg-red-500 hover:shadow-lg hover:-translate-y-0.5
                active:translate-y-0 active:shadow-md active:scale-95
                focus:outline-none focus-visible:ring-4 focus-visible:ring-red-400/50"
        onClick={handleLogout}
        title="Déconnexion"
        aria-label="Déconnexion"
      >
        <LogOut className="w-6 h-6 text-[#7346FF] transition-colors group-hover:text-white" />
      </button>
    </div>
  );
};

export default SearchBar;
