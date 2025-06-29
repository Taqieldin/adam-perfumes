import React, { FC, ReactNode } from 'react';
import { CollapsibleSidebar } from '../components/layout/CollapsibleSidebar';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <CollapsibleSidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header />
        <main className="flex-grow p-6 md:p-8">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};
