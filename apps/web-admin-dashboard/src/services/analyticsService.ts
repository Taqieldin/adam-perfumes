import { apiService } from './apiService';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  productsGrowth: number;
  averageOrderValue: number;
  conversionRate: number;
  customerRetentionRate: number;
  inventoryValue: number;
}

export interface SalesAnalytics {
  dailySales: Array<{
    date: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
  monthlySales: Array<{
    month: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
  salesByCategory: Array<{
    categoryId: string;
    categoryName: string;
    revenue: number;
    orders: number;
    percentage: number;
  }>;
  salesByProduct: Array<{
    productId: string;
    productName: string;
    revenue: number;
    quantity: number;
    orders: number;
  }>;
  salesByBranch: Array<{
    branchId: string;
    branchName: string;
    revenue: number;
    orders: number;
    percentage: number;
  }>;
}

export interface CustomerAnalytics {
  newCustomers: Array<{
    date: string;
    count: number;
  }>;
  customerRetention: Array<{
    cohort: string;
    month1: number;
    month3: number;
    month6: number;
    month12: number;
  }>;
  customerLifetimeValue: {
    average: number;
    median: number;
    distribution: Array<{
      range: string;
      count: number;
      percentage: number;
    }>;
  };
  customerSegments: Array<{
    segment: string;
    count: number;
    revenue: number;
    averageOrderValue: number;
  }>;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    totalSpent: number;
    orderCount: number;
    lastOrderDate: Date;
  }>;
}

export interface ProductAnalytics {
  topSellingProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
    orders: number;
  }>;
  lowPerformingProducts: Array<{
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
    daysInStock: number;
  }>;
  productTrends: Array<{
    productId: string;
    productName: string;
    trend: 'up' | 'down' | 'stable';
    changePercentage: number;
  }>;
  categoryPerformance: Array<{
    categoryId: string;
    categoryName: string;
    revenue: number;
    orders: number;
    averageRating: number;
    conversionRate: number;
  }>;
  inventoryTurnover: Array<{
    productId: string;
    productName: string;
    turnoverRate: number;
    daysToSell: number;
    stockLevel: number;
  }>;
}

export interface InventoryAnalytics {
  stockLevels: {
    inStock: number;
    lowStock: number;
    outOfStock: number;
    overstock: number;
  };
  inventoryValue: {
    total: number;
    byCategory: Array<{
      categoryId: string;
      categoryName: string;
      value: number;
      percentage: number;
    }>;
  };
  stockMovement: Array<{
    date: string;
    stockIn: number;
    stockOut: number;
    adjustments: number;
  }>;
  slowMovingItems: Array<{
    productId: string;
    productName: string;
    daysInStock: number;
    currentStock: number;
    value: number;
  }>;
  fastMovingItems: Array<{
    productId: string;
    productName: string;
    turnoverRate: number;
    averageDailySales: number;
    stockLevel: number;
  }>;
}

export interface MarketingAnalytics {
  campaignPerformance: Array<{
    campaignId: string;
    campaignName: string;
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
    roi: number;
  }>;
  couponUsage: Array<{
    couponId: string;
    couponCode: string;
    usageCount: number;
    discountAmount: number;
    revenue: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    conversions: number;
    conversionRate: number;
    revenue: number;
  }>;
  customerAcquisitionCost: {
    overall: number;
    byChannel: Array<{
      channel: string;
      cost: number;
      customers: number;
      cac: number;
    }>;
  };
}

export interface FinancialAnalytics {
  revenueBreakdown: {
    productSales: number;
    shipping: number;
    taxes: number;
    discounts: number;
    refunds: number;
  };
  profitMargins: {
    grossProfit: number;
    grossMargin: number;
    netProfit: number;
    netMargin: number;
  };
  paymentMethods: Array<{
    method: string;
    count: number;
    amount: number;
    percentage: number;
  }>;
  refundsAndReturns: {
    totalRefunds: number;
    totalReturns: number;
    refundRate: number;
    returnRate: number;
    topReasons: Array<{
      reason: string;
      count: number;
    }>;
  };
}

export interface ReportFilters {
  dateFrom?: Date;
  dateTo?: Date;
  branchId?: string;
  categoryId?: string;
  productId?: string;
  customerId?: string;
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

class AnalyticsService {
  private readonly baseUrl = '/admin/analytics';

  // Get dashboard statistics
  async getDashboardStats(filters: ReportFilters = {}): Promise<DashboardStats> {
    return apiService.getWithParams<DashboardStats>(`${this.baseUrl}/dashboard`, filters);
  }

  // Get sales analytics
  async getSalesAnalytics(filters: ReportFilters = {}): Promise<SalesAnalytics> {
    return apiService.getWithParams<SalesAnalytics>(`${this.baseUrl}/sales`, filters);
  }

  // Get customer analytics
  async getCustomerAnalytics(filters: ReportFilters = {}): Promise<CustomerAnalytics> {
    return apiService.getWithParams<CustomerAnalytics>(`${this.baseUrl}/customers`, filters);
  }

  // Get product analytics
  async getProductAnalytics(filters: ReportFilters = {}): Promise<ProductAnalytics> {
    return apiService.getWithParams<ProductAnalytics>(`${this.baseUrl}/products`, filters);
  }

  // Get inventory analytics
  async getInventoryAnalytics(filters: ReportFilters = {}): Promise<InventoryAnalytics> {
    return apiService.getWithParams<InventoryAnalytics>(`${this.baseUrl}/inventory`, filters);
  }

  // Get marketing analytics
  async getMarketingAnalytics(filters: ReportFilters = {}): Promise<MarketingAnalytics> {
    return apiService.getWithParams<MarketingAnalytics>(`${this.baseUrl}/marketing`, filters);
  }

  // Get financial analytics
  async getFinancialAnalytics(filters: ReportFilters = {}): Promise<FinancialAnalytics> {
    return apiService.getWithParams<FinancialAnalytics>(`${this.baseUrl}/financial`, filters);
  }

  // Get real-time statistics
  async getRealTimeStats(): Promise<{
    activeUsers: number;
    onlineOrders: number;
    todayRevenue: number;
    pendingOrders: number;
    lowStockAlerts: number;
    recentActivity: Array<{
      type: string;
      description: string;
      timestamp: Date;
    }>;
  }> {
    return apiService.get(`${this.baseUrl}/realtime`);
  }

  // Get revenue forecast
  async getRevenueForecast(months: number = 6): Promise<Array<{
    month: string;
    predicted: number;
    confidence: number;
    factors: string[];
  }>> {
    return apiService.get(`${this.baseUrl}/forecast/revenue?months=${months}`);
  }

  // Get demand forecast
  async getDemandForecast(productId?: string, months: number = 3): Promise<Array<{
    productId: string;
    productName: string;
    predictions: Array<{
      month: string;
      predictedDemand: number;
      confidence: number;
    }>;
  }>> {
    const params: any = { months };
    if (productId) params.productId = productId;
    
    return apiService.getWithParams(`${this.baseUrl}/forecast/demand`, params);
  }

  // Get cohort analysis
  async getCohortAnalysis(type: 'revenue' | 'retention' = 'retention'): Promise<Array<{
    cohort: string;
    size: number;
    periods: Array<{
      period: number;
      customers: number;
      rate: number;
      revenue?: number;
    }>;
  }>> {
    return apiService.get(`${this.baseUrl}/cohort?type=${type}`);
  }

  // Get funnel analysis
  async getFunnelAnalysis(filters: ReportFilters = {}): Promise<{
    stages: Array<{
      stage: string;
      users: number;
      conversionRate: number;
      dropoffRate: number;
    }>;
    totalUsers: number;
    overallConversionRate: number;
  }> {
    return apiService.getWithParams(`${this.baseUrl}/funnel`, filters);
  }

  // Get A/B test results
  async getABTestResults(testId?: string): Promise<Array<{
    testId: string;
    testName: string;
    status: 'running' | 'completed' | 'paused';
    variants: Array<{
      name: string;
      traffic: number;
      conversions: number;
      conversionRate: number;
      revenue: number;
      significance: number;
    }>;
    winner?: string;
  }>> {
    const url = testId ? `${this.baseUrl}/ab-tests/${testId}` : `${this.baseUrl}/ab-tests`;
    return apiService.get(url);
  }

  // Export analytics report
  async exportReport(type: 'sales' | 'customers' | 'products' | 'inventory' | 'financial', 
                    filters: ReportFilters = {}, 
                    format: 'xlsx' | 'pdf' | 'csv' = 'xlsx'): Promise<void> {
    const params = new URLSearchParams({ ...filters as any, format }).toString();
    const filename = `${type}-report.${format}`;
    return apiService.download(`${this.baseUrl}/export/${type}?${params}`, filename);
  }

  // Get custom report
  async getCustomReport(reportConfig: {
    metrics: string[];
    dimensions: string[];
    filters: Record<string, any>;
    dateRange: { from: Date; to: Date };
  }): Promise<{
    data: Array<Record<string, any>>;
    summary: Record<string, number>;
    metadata: {
      totalRows: number;
      generatedAt: Date;
    };
  }> {
    return apiService.post(`${this.baseUrl}/custom-report`, reportConfig);
  }

  // Save custom report
  async saveCustomReport(name: string, description: string, config: any): Promise<{
    id: string;
    name: string;
    description: string;
    config: any;
    createdAt: Date;
  }> {
    return apiService.post(`${this.baseUrl}/custom-reports`, {
      name,
      description,
      config
    });
  }

  // Get saved custom reports
  async getSavedReports(): Promise<Array<{
    id: string;
    name: string;
    description: string;
    config: any;
    createdAt: Date;
    lastRun?: Date;
  }>> {
    return apiService.get(`${this.baseUrl}/custom-reports`);
  }

  // Run saved custom report
  async runSavedReport(reportId: string, filters?: Record<string, any>): Promise<{
    data: Array<Record<string, any>>;
    summary: Record<string, number>;
    metadata: {
      totalRows: number;
      generatedAt: Date;
    };
  }> {
    return apiService.post(`${this.baseUrl}/custom-reports/${reportId}/run`, { filters });
  }

  // Get performance benchmarks
  async getPerformanceBenchmarks(): Promise<{
    industry: {
      averageOrderValue: number;
      conversionRate: number;
      customerRetentionRate: number;
      cartAbandonmentRate: number;
    };
    yourPerformance: {
      averageOrderValue: number;
      conversionRate: number;
      customerRetentionRate: number;
      cartAbandonmentRate: number;
    };
    recommendations: string[];
  }> {
    return apiService.get(`${this.baseUrl}/benchmarks`);
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;