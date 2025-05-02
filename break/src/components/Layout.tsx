import React from 'react';
import Sidebar from './Sidebar';
import SearchBar from './SearchBar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
