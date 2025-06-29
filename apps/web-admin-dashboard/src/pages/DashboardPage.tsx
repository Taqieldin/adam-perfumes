import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  Package,
  DollarSign,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

import { RootState, AppDispatch } from '../store';
import { fetchDashboardStats } from '../store/slices/analyticsSlice';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import StatsCard from '../components/dashboard/StatsCard';
import RecentOrders from '../components/dashboard/RecentOrders';
import SalesChart from '../components/dashboard/SalesChart';
import TopProducts from '../components/dashboard/TopProducts';
import QuickActions from '../components/dashboard/QuickActions';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { stats, loading } = useSelector((state: RootState) => state.analytics);
  const { userData } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading.stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `${stats?.totalRevenue?.toLocaleString() || '0'} OMR`,
      change: stats?.revenueChange || 0,
      icon: DollarSign,
      color: 'green' as const,
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders?.toLocaleString() || '0',
      change: stats?.ordersChange || 0,
      icon: ShoppingCart,
      color: 'blue' as const,
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers?.toLocaleString() || '0',
      change: stats?.customersChange || 0,
      icon: Users,
      color: 'purple' as const,
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts?.toLocaleString() || '0',
      change: stats?.productsChange || 0,
      icon: Package,
      color: 'orange' as const,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Adam Perfumes Admin</title>
      </Helmet>

      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {userData?.firstName}! 👋
          </h1>
          <p className="text-primary-100">
            Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <StatsCard
              key={index}
              title={card.title}
              value={card.value}
              change={card.change}
              icon={card.icon}
              color={card.color}
            />
          ))}
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sales Overview
              </h2>
              <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </div>
            <SalesChart />
          </div>

          {/* Top Products */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Products
              </h2>
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                View all
              </button>
            </div>
            <TopProducts />
          </div>
        </div>

        {/* Recent Orders and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Orders
              </h2>
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                View all orders
              </button>
            </div>
            <RecentOrders />
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <QuickActions />
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {[
              {
                action: 'New order placed',
                details: 'Order #12345 by John Doe',
                time: '2 minutes ago',
                type: 'order',
              },
              {
                action: 'Product updated',
                details: 'Luxury Perfume - Stock updated',
                time: '15 minutes ago',
                type: 'product',
              },
              {
                action: 'Customer registered',
                details: 'Jane Smith joined',
                time: '1 hour ago',
                type: 'customer',
              },
              {
                action: 'Review received',
                details: '5-star review for Premium Fragrance',
                time: '2 hours ago',
                type: 'review',
              },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.details}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;