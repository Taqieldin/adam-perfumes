import React from 'react';
import { Helmet } from 'react-helmet-async';

const CategoriesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Categories - Adam Perfumes Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-400">Categories management coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;