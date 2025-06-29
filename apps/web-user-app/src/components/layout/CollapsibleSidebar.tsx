import React, { FC, useState } from 'react';
import Link from 'next/link';
import { LucideIcon, Home, ShoppingCart, Package, User, Menu, X, Wallet } from 'lucide-react';

interface NavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

const navItems: NavItem[] = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/products', icon: Package, label: 'Products' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart' },
  { href: '/orders', icon: Package, label: 'Orders' },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/wallet', icon: Wallet, label: 'Wallet' },
];

export const CollapsibleSidebar: FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={`flex flex-col h-screen bg-black text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && <h1 className="text-xl font-bold">Adam Perfumes</h1>}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-gray-700">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <div className="flex items-center p-2 space-x-4 rounded-lg hover:bg-gray-700 cursor-pointer">
              <item.icon />
              {isOpen && <span>{item.label}</span>}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};
