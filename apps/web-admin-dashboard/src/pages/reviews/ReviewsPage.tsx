import React from 'react';
import { Helmet } from 'react-helmet-async';

const ReviewsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Reviews - Adam Perfumes Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-400">Reviews management coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default ReviewsPage;