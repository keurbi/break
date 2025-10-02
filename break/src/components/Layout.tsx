import React, { useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import SearchBar from './SearchBar';
import { useEffect } from 'react';
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
  const [deferUI, setDeferUI] = useState(false);
  useEffect(() => {
    // Defer heavy UI bits by one tick to reduce TTI
    const id = requestIdleCallback ? requestIdleCallback(() => setDeferUI(true)) : setTimeout(() => setDeferUI(true), 0);
    return () => {
      if (typeof id === 'number') clearTimeout(id as number);
      else if (typeof cancelIdleCallback !== 'undefined') try { cancelIdleCallback(id as any); } catch {}
    };
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
        {deferUI && <MobileNav />}
        {deferUI && <SearchBar />}
        {content}
      </div>
    </div>
  );
};

export default Layout;
