import { User } from '../../../../shared/types/user';
import { Order } from '../../../../shared/types/order';
import { apiService } from './apiService';

export interface CustomerFilters {
  search?: string;
  isActive?: boolean;
  isVerified?: boolean;
  hasOrders?: boolean;
  registrationDateFrom?: Date;
  registrationDateTo?: Date;
  lastOrderDateFrom?: Date;
  lastOrderDateTo?: Date;
  minTotalSpent?: number;
  maxTotalSpent?: number;
  loyaltyTier?: string;
  sortBy?: 'name' | 'email' | 'createdAt' | 'lastOrderDate' | 'totalSpent' | 'loyaltyPoints';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CustomersResponse {
  customers: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  verifiedCustomers: number;
  customersWithOrders: number;
  averageOrderValue: number;
  totalCustomerValue: number;
  topSpenders: User[];
}

export interface CustomerAnalytics {
  registrationTrend: Array<{
    date: string;
    count: number;
  }>;
  customersByTier: Record<string, number>;
  customerRetention: {
    oneMonth: number;
    threeMonths: number;
    sixMonths: number;
    oneYear: number;
  };
  averageLifetimeValue: number;
  churnRate: number;
}

export interface CustomerActivity {
  orders: Order[];
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: Date;
  favoriteProducts: Array<{
    productId: string;
    productName: string;
    orderCount: number;
  }>;
  loyaltyPoints: number;
  walletBalance: number;
}

export interface UpdateCustomerData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  isActive?: boolean;
  isVerified?: boolean;
  loyaltyTier?: string;
  notes?: string;
}

export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  criteria: Record<string, any>;
  customerCount: number;
  createdAt: Date;
}

class CustomerService {
  private readonly baseUrl = '/admin/customers';

  // Get all customers with filters
  async getCustomers(filters: CustomerFilters = {}): Promise<CustomersResponse> {
    return apiService.getWithParams<CustomersResponse>(this.baseUrl, filters);
  }

  // Get single customer by ID
  async getCustomer(id: string): Promise<User> {
    return apiService.get<User>(`${this.baseUrl}/${id}`);
  }

  // Update customer
  async updateCustomer(id: string, data: UpdateCustomerData): Promise<User> {
    return apiService.patch<User>(`${this.baseUrl}/${id}`, data);
  }

  // Delete customer (soft delete)
  async deleteCustomer(id: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Activate/Deactivate customer
  async toggleCustomerStatus(id: string): Promise<User> {
    return apiService.patch<User>(`${this.baseUrl}/${id}/toggle-status`);
  }

  // Verify customer email
  async verifyCustomerEmail(id: string): Promise<User> {
    return apiService.post<User>(`${this.baseUrl}/${id}/verify-email`);
  }

  // Get customer activity
  async getCustomerActivity(id: string): Promise<CustomerActivity> {
    return apiService.get<CustomerActivity>(`${this.baseUrl}/${id}/activity`);
  }

  // Get customer orders
  async getCustomerOrders(id: string, page: number = 1, limit: number = 10): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return apiService.getWithParams(`${this.baseUrl}/${id}/orders`, { page, limit });
  }

  // Get customer statistics
  async getCustomerStats(): Promise<CustomerStats> {
    return apiService.get<CustomerStats>(`${this.baseUrl}/stats`);
  }

  // Get customer analytics
  async getCustomerAnalytics(dateFrom?: Date, dateTo?: Date): Promise<CustomerAnalytics> {
    const params: any = {};
    if (dateFrom) params.dateFrom = dateFrom.toISOString();
    if (dateTo) params.dateTo = dateTo.toISOString();
    
    return apiService.getWithParams<CustomerAnalytics>(`${this.baseUrl}/analytics`, params);
  }

  // Search customers
  async searchCustomers(query: string, limit: number = 10): Promise<User[]> {
    return apiService.getWithParams<User[]>(`${this.baseUrl}/search`, {
      q: query,
      limit
    });
  }

  // Get top customers
  async getTopCustomers(limit: number = 10, sortBy: 'totalSpent' | 'orderCount' | 'loyaltyPoints' = 'totalSpent'): Promise<User[]> {
    return apiService.getWithParams<User[]>(`${this.baseUrl}/top`, {
      limit,
      sortBy
    });
  }

  // Export customers
  async exportCustomers(filters: CustomerFilters = {}): Promise<void> {
    const params = new URLSearchParams(filters as any).toString();
    return apiService.download(`${this.baseUrl}/export?${params}`, 'customers.xlsx');
  }

  // Send email to customer
  async sendEmailToCustomer(id: string, subject: string, message: string, template?: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/${id}/send-email`, {
      subject,
      message,
      template
    });
  }

  // Send SMS to customer
  async sendSMSToCustomer(id: string, message: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/${id}/send-sms`, {
      message
    });
  }

  // Add loyalty points
  async addLoyaltyPoints(id: string, points: number, reason: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/${id}/loyalty-points`, {
      points,
      reason
    });
  }

  // Deduct loyalty points
  async deductLoyaltyPoints(id: string, points: number, reason: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/${id}/loyalty-points/deduct`, {
      points,
      reason
    });
  }

  // Add wallet balance
  async addWalletBalance(id: string, amount: number, reason: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/${id}/wallet`, {
      amount,
      reason
    });
  }

  // Deduct wallet balance
  async deductWalletBalance(id: string, amount: number, reason: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/${id}/wallet/deduct`, {
      amount,
      reason
    });
  }

  // Get customer segments
  async getCustomerSegments(): Promise<CustomerSegment[]> {
    return apiService.get<CustomerSegment[]>(`${this.baseUrl}/segments`);
  }

  // Create customer segment
  async createCustomerSegment(segment: Omit<CustomerSegment, 'id' | 'customerCount' | 'createdAt'>): Promise<CustomerSegment> {
    return apiService.post<CustomerSegment>(`${this.baseUrl}/segments`, segment);
  }

  // Update customer segment
  async updateCustomerSegment(id: string, segment: Partial<CustomerSegment>): Promise<CustomerSegment> {
    return apiService.patch<CustomerSegment>(`${this.baseUrl}/segments/${id}`, segment);
  }

  // Delete customer segment
  async deleteCustomerSegment(id: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/segments/${id}`);
  }

  // Get customers in segment
  async getCustomersInSegment(segmentId: string, page: number = 1, limit: number = 10): Promise<CustomersResponse> {
    return apiService.getWithParams<CustomersResponse>(`${this.baseUrl}/segments/${segmentId}/customers`, {
      page,
      limit
    });
  }

  // Bulk email to segment
  async sendBulkEmailToSegment(segmentId: string, subject: string, message: string, template?: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/segments/${segmentId}/send-email`, {
      subject,
      message,
      template
    });
  }

  // Get customer lifetime value
  async getCustomerLifetimeValue(id: string): Promise<{
    totalSpent: number;
    totalOrders: number;
    averageOrderValue: number;
    firstOrderDate: Date;
    lastOrderDate: Date;
    predictedLifetimeValue: number;
  }> {
    return apiService.get(`${this.baseUrl}/${id}/lifetime-value`);
  }

  // Get customer churn risk
  async getCustomerChurnRisk(id: string): Promise<{
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    factors: string[];
    recommendations: string[];
  }> {
    return apiService.get(`${this.baseUrl}/${id}/churn-risk`);
  }

  // Get customers at risk of churning
  async getChurnRiskCustomers(limit: number = 50): Promise<Array<User & {
    churnRisk: {
      riskScore: number;
      riskLevel: 'low' | 'medium' | 'high';
    };
  }>> {
    return apiService.get(`${this.baseUrl}/churn-risk?limit=${limit}`);
  }

  // Merge customers (duplicate handling)
  async mergeCustomers(primaryCustomerId: string, secondaryCustomerId: string): Promise<User> {
    return apiService.post<User>(`${this.baseUrl}/${primaryCustomerId}/merge`, {
      secondaryCustomerId
    });
  }

  // Get duplicate customers
  async getDuplicateCustomers(): Promise<Array<{
    customers: User[];
    matchType: 'email' | 'phone' | 'name';
    confidence: number;
  }>> {
    return apiService.get(`${this.baseUrl}/duplicates`);
  }
}

export const customerService = new CustomerService();
export default customerService;