import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
