import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Users, ShoppingCart, BarChart3, Settings } from 'lucide-react';

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Add Product',
      description: 'Create a new product',
      icon: Plus,
      color: 'bg-green-500 hover:bg-green-600',
      onClick: () => navigate('/products/create'),
    },
    {
      title: 'View Orders',
      description: 'Manage customer orders',
      icon: ShoppingCart,
      color: 'bg-blue-500 hover:bg-blue-600',
      onClick: () => navigate('/orders'),
    },
    {
      title: 'Manage Inventory',
      description: 'Update stock levels',
      icon: Package,
      color: 'bg-purple-500 hover:bg-purple-600',
      onClick: () => navigate('/inventory'),
    },
    {
      title: 'View Customers',
      description: 'Customer management',
      icon: Users,
      color: 'bg-orange-500 hover:bg-orange-600',
      onClick: () => navigate('/customers'),
    },
    {
      title: 'Analytics',
      description: 'View detailed reports',
      icon: BarChart3,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      onClick: () => navigate('/analytics'),
    },
    {
      title: 'Settings',
      description: 'Configure your store',
      icon: Settings,
      color: 'bg-gray-500 hover:bg-gray-600',
      onClick: () => navigate('/settings'),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className="flex items-center p-4 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
        >
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg text-white ${action.color} transition-colors`}>
            <action.icon className="h-5 w-5" />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-gray-700 dark:group-hover:text-gray-200">
              {action.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {action.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;