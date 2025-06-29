import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  Moon, 
  Sun,
  Globe,
  ChevronDown
} from 'lucide-react';

import { RootState, AppDispatch } from '../../store';
import { toggleSidebar, toggleTheme, setLanguage } from '../../store/slices/uiSlice';
import { logoutAsync } from '../../store/slices/authSlice';
import { cn } from '../../utils/cn';

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { theme, language } = useSelector((state: RootState) => state.ui);
  const { userData } = useSelector((state: RootState) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutAsync());
    navigate('/auth/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const notifications = [
    {
      id: '1',
      title: 'New Order',
      message: 'Order #12345 has been placed',
      time: '2 minutes ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Low Stock Alert',
      message: 'Product "Luxury Perfume" is running low',
      time: '1 hour ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Customer Review',
      message: 'New 5-star review received',
      time: '3 hours ago',
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        {/* Mobile menu button */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </form>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Theme toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </button>

        {/* Language toggle */}
        <button
          onClick={() => dispatch(setLanguage(language === 'en' ? 'ar' : 'en'))}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={`Switch to ${language === 'en' ? 'Arabic' : 'English'}`}
        >
          <Globe className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer',
                      notification.unread && 'bg-blue-50 dark:bg-blue-900/20'
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => navigate('/notifications')}
                  className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <img
              className="h-8 w-8 rounded-full"
              src={userData?.profilePicture || '/default-avatar.png'}
              alt={userData ? `${userData.firstName} ${userData.lastName}` : 'User'}
            />
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* User dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {userData?.firstName} {userData?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userData?.email}
                </p>
              </div>
              
              <div className="py-2">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile
                </button>
                
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </button>
                
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                
                <button
                  onClick={() => {
                    handleLogout();
                    setShowUserMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;