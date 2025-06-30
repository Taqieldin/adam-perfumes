// Core services
export { default as apiService } from './apiService';
export { default as authService } from './authService';
export { auth } from './firebase';

// Domain services
export { default as productService } from './productService';
export { default as orderService } from './orderService';
export { default as customerService } from './customerService';
export { default as categoryService } from './categoryService';
export { default as inventoryService } from './inventoryService';
export { default as analyticsService } from './analyticsService';

// Re-export types for convenience
export type { ProductFilters, ProductsResponse, CreateProductData, UpdateProductData } from './productService';
export type { OrderFilters, OrdersResponse, CreateOrderData, UpdateOrderData } from './orderService';
export type { CustomerFilters, CustomersResponse, UpdateCustomerData } from './customerService';
export type { CategoryFilters, CreateCategoryData, UpdateCategoryData } from './categoryService';
export type { InventoryFilters, InventoryResponse, StockAdjustment } from './inventoryService';
export type { DashboardStats, SalesAnalytics, ReportFilters } from './analyticsService';