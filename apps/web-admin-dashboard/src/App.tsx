import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';

import { RootState, AppDispatch } from './store';
import { initializeAuth } from './store/slices/authSlice';
import { setTheme } from './store/slices/uiSlice';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/products/ProductsPage';
import ProductDetailsPage from './pages/products/ProductDetailsPage';
import CreateProductPage from './pages/products/CreateProductPage';
import EditProductPage from './pages/products/EditProductPage';
import CategoriesPage from './pages/categories/CategoriesPage';
import OrdersPage from './pages/orders/OrdersPage';
import OrderDetailsPage from './pages/orders/OrderDetailsPage';
import CustomersPage from './pages/customers/CustomersPage';
import CustomerDetailsPage from './pages/customers/CustomerDetailsPage';
import InventoryPage from './pages/inventory/InventoryPage';
import BranchesPage from './pages/branches/BranchesPage';
import BranchDetailsPage from './pages/branches/BranchDetailsPage';
import StaffPage from './pages/staff/StaffPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
import ProfilePage from './pages/profile/ProfilePage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import CouponsPage from './pages/coupons/CouponsPage';
import ReviewsPage from './pages/reviews/ReviewsPage';
import SupportPage from './pages/support/SupportPage';
import FirebaseTestPage from './pages/test/FirebaseTestPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, isLoading, isInitialized } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    // Initialize authentication state
    dispatch(initializeAuth());

    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [dispatch, theme]);

  useEffect(() => {
    // Set theme based on system preference if not set
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      dispatch(setTheme(systemTheme));
    }
  }, [dispatch]);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Adam Perfumes Admin Dashboard</title>
        <meta name="description" content="Admin dashboard for Adam Perfumes e-commerce management" />
      </Helmet>

      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route index element={<Navigate to="login" replace />} />
        </Route>

        {/* Test Routes (for debugging) */}
        <Route path="/test/firebase" element={<FirebaseTestPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard */}
          <Route index element={<DashboardPage />} />
          
          {/* Products */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/create" element={<CreateProductPage />} />
          <Route path="products/:id" element={<ProductDetailsPage />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          
          {/* Categories */}
          <Route path="categories" element={<CategoriesPage />} />
          
          {/* Orders */}
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          
          {/* Customers */}
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailsPage />} />
          
          {/* Inventory */}
          <Route path="inventory" element={<InventoryPage />} />
          
          {/* Branches */}
          <Route path="branches" element={<BranchesPage />} />
          <Route path="branches/:id" element={<BranchDetailsPage />} />
          
          {/* Staff */}
          <Route path="staff" element={<StaffPage />} />
          
          {/* Analytics */}
          <Route path="analytics" element={<AnalyticsPage />} />
          
          {/* Reports */}
          <Route path="reports" element={<ReportsPage />} />
          
          {/* Coupons */}
          <Route path="coupons" element={<CouponsPage />} />
          
          {/* Reviews */}
          <Route path="reviews" element={<ReviewsPage />} />
          
          {/* Support */}
          <Route path="support" element={<SupportPage />} />
          
          {/* Notifications */}
          <Route path="notifications" element={<NotificationsPage />} />
          
          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
          
          {/* Profile */}
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Redirect to dashboard if authenticated, otherwise to login */}
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

export default App;