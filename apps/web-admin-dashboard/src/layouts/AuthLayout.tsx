import React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AuthLayout: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Admin Login - Adam Perfumes</title>
        <meta name="description" content="Admin login for Adam Perfumes dashboard" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo */}
          <div className="text-center">
            <img
              className="mx-auto h-12 w-auto"
              src="/logo.svg"
              alt="Adam Perfumes"
            />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Admin Dashboard
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Sign in to manage your store
            </p>
          </div>
          
          {/* Auth Form */}
          <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-lg">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;