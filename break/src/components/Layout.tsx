import React, { useMemo } from 'react';
import Sidebar from './Sidebar';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
const MobileNav = dynamic(() => import('./MobileNav'), { ssr: false });
const SearchBar = dynamic(() => import('./SearchBar'), { ssr: false });
import { getAuth } from 'firebase/auth';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
  const auth = getAuth();
  const unsub = auth.onAuthStateChanged(async (user) => {
    if (user) {
      const tokenResult = await user.getIdTokenResult(true);
      const role = tokenResult.claims.role;
      if (role) {
        localStorage.setItem('role', String(role));
      } else {
        localStorage.removeItem('role');
      }
    } else {
      localStorage.removeItem('role');
    }
  });
  return () => unsub();
}, []);
  const content = useMemo(() => (
    <main className="flex-1 p-4">
      {children}
    </main>
  ), [children]);
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 md:ml-28 ml-0 bg-tertiary min-h-screen flex flex-col">
        <MobileNav />
        <SearchBar />
        {content}
      </div>
    </div>
  );
};

export default Layout;
