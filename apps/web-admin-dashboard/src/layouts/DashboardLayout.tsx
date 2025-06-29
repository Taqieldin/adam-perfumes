import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setSidebarOpen } from '../store/slices/uiSlice';

import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import NotificationCenter from '../components/layout/NotificationCenter';

const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { sidebarOpen, sidebarCollapsed } = useSelector((state: RootState) => state.ui);

  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        dispatch(setSidebarOpen(false));
      } else {
        dispatch(setSidebarOpen(true));
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Notification Center */}
      <NotificationCenter />
    </div>
  );
};

export default DashboardLayout;