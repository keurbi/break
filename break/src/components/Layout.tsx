import React from 'react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';
import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
  const auth = getAuth();
  auth.onAuthStateChanged(async (user) => {
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
}, []);
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-28 bg-tertiary min-h-screen flex flex-col">
        <SearchBar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
