import { Order, OrderStatus } from '../../../shared/types/order';
import { Address } from '../../../shared/types/address';
import apiService from './api';

export interface CreateOrderData {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethodId: string;
  shippingMethodId: string;
  notes?: string;
  giftMessage?: string;
  isGift?: boolean;
  useLoyaltyPoints?: number;
  couponCode?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface OrderTracking {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  timeline: Array<{
    status: string;
    timestamp: Date;
    location?: string;
    description: string;
  }>;
}

class OrderService {
  // Create new order
  async createOrder(data: CreateOrderData): Promise<Order> {
    return apiService.post<Order>('/orders', data);
  }

  // Get user orders with pagination and filters
  async getOrders(
    filters: OrderFilters = {},
    page: number = 1,
    limit: number = 10
  ): Promise<OrdersResponse> {
    const params = new URLSearchParams();
    
    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });

    // Add pagination
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    return apiService.get<OrdersResponse>(`/orders?${params.toString()}`);
  }

  // Get single order by ID
  async getOrder(orderId: string): Promise<Order> {
    return apiService.get<Order>(`/orders/${orderId}`);
  }

  // Cancel order
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    return apiService.post<Order>(`/orders/${orderId}/cancel`, { reason });
  }

  // Request order return
  async requestReturn(orderId: string, data: {
    items: Array<{
      orderItemId: string;
      quantity: number;
      reason: string;
    }>;
    reason: string;
    description?: string;
  }): Promise<void> {
    return apiService.post(`/orders/${orderId}/return`, data);
  }

  // Get order tracking information
  async getOrderTracking(orderId: string): Promise<OrderTracking> {
    return apiService.get<OrderTracking>(`/orders/${orderId}/tracking`);
  }

  // Track order by tracking number
  async trackByNumber(trackingNumber: string): Promise<OrderTracking> {
    return apiService.get<OrderTracking>(`/orders/track/${trackingNumber}`);
  }

  // Create payment intent
  async createPaymentIntent(orderId: string): Promise<PaymentIntent> {
    return apiService.post<PaymentIntent>(`/orders/${orderId}/payment-intent`);
  }

  // Confirm payment
  async confirmPayment(orderId: string, paymentIntentId: string): Promise<Order> {
    return apiService.post<Order>(`/orders/${orderId}/confirm-payment`, {
      paymentIntentId
    });
  }

  // Retry payment for failed order
  async retryPayment(orderId: string): Promise<PaymentIntent> {
    return apiService.post<PaymentIntent>(`/orders/${orderId}/retry-payment`);
  }

  // Get order invoice
  async getInvoice(orderId: string): Promise<Blob> {
    const response = await apiService.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob'
    });
    return response as unknown as Blob;
  }

  // Download order invoice
  async downloadInvoice(orderId: string): Promise<void> {
    const blob = await this.getInvoice(orderId);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${orderId}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Reorder (create new order from existing order)
  async reorder(orderId: string): Promise<{ success: boolean; message: string }> {
    return apiService.post(`/orders/${orderId}/reorder`);
  }

  // Rate order
  async rateOrder(orderId: string, rating: number, comment?: string): Promise<void> {
    return apiService.post(`/orders/${orderId}/rating`, { rating, comment });
  }

  // Get order statistics
  async getOrderStats(): Promise<{
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    statusBreakdown: Record<OrderStatus, number>;
    monthlySpending: Array<{
      month: string;
      amount: number;
      orders: number;
    }>;
  }> {
    return apiService.get('/orders/stats');
  }

  // Get recent orders
  async getRecentOrders(limit: number = 5): Promise<Order[]> {
    const response = await this.getOrders({}, 1, limit);
    return response.orders;
  }

  // Check if order can be cancelled
  async canCancelOrder(orderId: string): Promise<boolean> {
    try {
      await apiService.get(`/orders/${orderId}/can-cancel`);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Check if order can be returned
  async canReturnOrder(orderId: string): Promise<{
    canReturn: boolean;
    returnWindow?: number; // days
    eligibleItems?: string[];
  }> {
    return apiService.get(`/orders/${orderId}/can-return`);
  }

  // Get order delivery options
  async getDeliveryOptions(orderId: string): Promise<Array<{
    id: string;
    name: string;
    description: string;
    cost: number;
    estimatedDelivery: string;
  }>> {
    return apiService.get(`/orders/${orderId}/delivery-options`);
  }

  // Update delivery option
  async updateDeliveryOption(orderId: string, optionId: string): Promise<Order> {
    return apiService.put<Order>(`/orders/${orderId}/delivery-option`, {
      optionId
    });
  }

  // Get order notifications
  async getOrderNotifications(orderId: string): Promise<Array<{
    type: string;
    message: string;
    timestamp: Date;
    read: boolean;
  }>> {
    return apiService.get(`/orders/${orderId}/notifications`);
  }

  // Mark order notification as read
  async markNotificationRead(orderId: string, notificationId: string): Promise<void> {
    return apiService.put(`/orders/${orderId}/notifications/${notificationId}/read`);
  }

  // Get estimated delivery time
  async getEstimatedDelivery(orderId: string): Promise<{
    estimatedDate: string;
    confidence: 'high' | 'medium' | 'low';
    factors: string[];
  }> {
    return apiService.get(`/orders/${orderId}/estimated-delivery`);
  }

  // Report order issue
  async reportIssue(orderId: string, issue: {
    type: 'damaged' | 'missing' | 'wrong_item' | 'late_delivery' | 'other';
    description: string;
    images?: string[];
  }): Promise<void> {
    return apiService.post(`/orders/${orderId}/report-issue`, issue);
  }

  // Get order issues
  async getOrderIssues(orderId: string): Promise<Array<{
    id: string;
    type: string;
    description: string;
    status: string;
    createdAt: Date;
    resolvedAt?: Date;
  }>> {
    return apiService.get(`/orders/${orderId}/issues`);
  }
}

export const orderService = new OrderService();
export default orderService;