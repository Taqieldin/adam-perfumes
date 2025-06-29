import React, { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-6 text-center">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} Adam Perfumes. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
