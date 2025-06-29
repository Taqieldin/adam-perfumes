import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <>
      <Helmet>
        <title>Edit Product - Adam Perfumes Admin</title>
      </Helmet>
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Edit Product: {id}
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-gray-600 dark:text-gray-400">Edit product form coming soon...</p>
        </div>
      </div>
    </>
  );
};

export default EditProductPage;