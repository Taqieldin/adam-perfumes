import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const OrderDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Helmet>
        <title>Order Details - Adam Perfumes Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Order Details: {id}
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-400">Order details coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default OrderDetailsPage;