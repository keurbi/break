import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex bg-tertiary h-screen">
      <Sidebar />
      <main className="ml-64 p-4 w-full">{children}</main>
    </div>
  );
};

export default Layout;
