import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const TopProducts: React.FC = () => {
  const { stats } = useSelector((state: RootState) => state.analytics);

  // Mock data if no real data available
  const products = stats?.topProducts || [
    {
      id: '1',
      name: 'Luxury Perfume Collection',
      sales: 156,
      revenue: 15600,
      image: '/images/products/product-1.jpg',
    },
    {
      id: '2',
      name: 'Premium Fragrance Set',
      sales: 142,
      revenue: 14200,
      image: '/images/products/product-2.jpg',
    },
    {
      id: '3',
      name: 'Exclusive Scent Bundle',
      sales: 128,
      revenue: 12800,
      image: '/images/products/product-3.jpg',
    },
    {
      id: '4',
      name: 'Designer Perfume',
      sales: 98,
      revenue: 9800,
      image: '/images/products/product-4.jpg',
    },
    {
      id: '5',
      name: 'Signature Fragrance',
      sales: 87,
      revenue: 8700,
      image: '/images/products/product-5.jpg',
    },
  ];

  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <div className="flex-shrink-0">
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-600 dark:text-gray-400">
              {index + 1}
            </span>
          </div>
          
          <div className="flex-shrink-0">
            <img
              className="w-10 h-10 rounded-lg object-cover bg-gray-200 dark:bg-gray-700"
              src={product.image}
              alt={product.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/placeholder-product.jpg';
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {product.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {product.sales} sales
            </p>
          </div>
          
          <div className="flex-shrink-0 text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {product.revenue.toLocaleString()} OMR
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TopProducts;