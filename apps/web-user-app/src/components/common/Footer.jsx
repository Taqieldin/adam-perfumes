import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Adam Perfumes. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
