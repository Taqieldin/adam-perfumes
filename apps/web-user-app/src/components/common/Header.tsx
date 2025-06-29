import React, { FC } from 'react';
import Link from 'next/link';

const Header: FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" passHref>
          <div className="text-2xl font-bold cursor-pointer text-black">Adam Perfumes</div>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/products"><div className="text-black hover:underline cursor-pointer">Products</div></Link></li>
            <li><Link href="/cart"><div className="text-black hover:underline cursor-pointer">Cart</div></Link></li>
            <li><Link href="/orders"><div className="text-black hover:underline cursor-pointer">Orders</div></Link></li>
            <li><Link href="/profile"><div className="text-black hover:underline cursor-pointer">Profile</div></Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
