import { Order, OrderStatus, PaymentStatus, PaymentMethod } from '../../../../shared/types/order';
import { OrderItem } from '../../../../shared/types/order-item';
import { apiService } from './apiService';

export interface OrderFilters {
  search?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: PaymentMethod;
  userId?: string;
  branchId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  isPickup?: boolean;
  sortBy?: 'orderNumber' | 'createdAt' | 'totalAmount' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateOrderData {
  userId?: string;
  guestEmail?: string;
  guestPhone?: string;
  items: Array<{
    productId: string;
    variantSku?: string;
    quantity: number;
    price: number;
  }>;
  shippingAddressId?: string;
  billingAddressId?: string;
  shippingMethod?: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  pointsToUse?: number;
  walletAmountToUse?: number;
  branchId?: string;
  isPickup: boolean;
  notes?: string;
}

export interface UpdateOrderData {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  shippingCarrier?: string;
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  notes?: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  todayOrders: number;
  todayRevenue: number;
}

export interface OrderAnalytics {
  dailySales: Array<{
    date: string;
    orders: number;
    revenue: number;
  }>;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
  ordersByStatus: Record<OrderStatus, number>;
  paymentMethodDistribution: Record<PaymentMethod, number>;
  averageOrderValueTrend: Array<{
    date: string;
    value: number;
  }>;
}

export interface RefundData {
  orderId: string;
  amount: number;
  reason: string;
  refundItems?: Array<{
    orderItemId: string;
    quantity: number;
  }>;
}

class OrderService {
  private readonly baseUrl = '/admin/orders';

  // Get all orders with filters
  async getOrders(filters: OrderFilters = {}): Promise<OrdersResponse> {
    return apiService.getWithParams<OrdersResponse>(this.baseUrl, filters);
  }

  // Get single order by ID
  async getOrder(id: string): Promise<Order> {
    return apiService.get<Order>(`${this.baseUrl}/${id}`);
  }

  // Create new order (admin created)
  async createOrder(data: CreateOrderData): Promise<Order> {
    return apiService.post<Order>(this.baseUrl, data);
  }

  // Update order
  async updateOrder(id: string, data: UpdateOrderData): Promise<Order> {
    return apiService.patch<Order>(`${this.baseUrl}/${id}`, data);
  }

  // Update order status
  async updateOrderStatus(id: string, status: OrderStatus, notes?: string): Promise<Order> {
    return apiService.patch<Order>(`${this.baseUrl}/${id}/status`, { status, notes });
  }

  // Update payment status
  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<Order> {
    return apiService.patch<Order>(`${this.baseUrl}/${id}/payment-status`, { paymentStatus });
  }

  // Cancel order
  async cancelOrder(id: string, reason: string): Promise<Order> {
    return apiService.post<Order>(`${this.baseUrl}/${id}/cancel`, { reason });
  }

  // Process refund
  async processRefund(data: RefundData): Promise<{ success: boolean; refundId: string }> {
    return apiService.post(`${this.baseUrl}/${data.orderId}/refund`, data);
  }

  // Add tracking information
  async addTracking(id: string, trackingNumber: string, carrier: string): Promise<Order> {
    return apiService.patch<Order>(`${this.baseUrl}/${id}/tracking`, {
      trackingNumber,
      shippingCarrier: carrier
    });
  }

  // Get order items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return apiService.get<OrderItem[]>(`${this.baseUrl}/${orderId}/items`);
  }

  // Update order item
  async updateOrderItem(orderId: string, itemId: string, updates: Partial<OrderItem>): Promise<OrderItem> {
    return apiService.patch<OrderItem>(`${this.baseUrl}/${orderId}/items/${itemId}`, updates);
  }

  // Add order item
  async addOrderItem(orderId: string, item: Omit<OrderItem, 'id' | 'orderId'>): Promise<OrderItem> {
    return apiService.post<OrderItem>(`${this.baseUrl}/${orderId}/items`, item);
  }

  // Remove order item
  async removeOrderItem(orderId: string, itemId: string): Promise<void> {
    return apiService.delete<void>(`${this.baseUrl}/${orderId}/items/${itemId}`);
  }

  // Get order statistics
  async getOrderStats(dateFrom?: Date, dateTo?: Date): Promise<OrderStats> {
    const params: any = {};
    if (dateFrom) params.dateFrom = dateFrom.toISOString();
    if (dateTo) params.dateTo = dateTo.toISOString();
    
    return apiService.getWithParams<OrderStats>(`${this.baseUrl}/stats`, params);
  }

  // Get order analytics
  async getOrderAnalytics(dateFrom?: Date, dateTo?: Date): Promise<OrderAnalytics> {
    const params: any = {};
    if (dateFrom) params.dateFrom = dateFrom.toISOString();
    if (dateTo) params.dateTo = dateTo.toISOString();
    
    return apiService.getWithParams<OrderAnalytics>(`${this.baseUrl}/analytics`, params);
  }

  // Search orders
  async searchOrders(query: string, limit: number = 10): Promise<Order[]> {
    return apiService.getWithParams<Order[]>(`${this.baseUrl}/search`, {
      q: query,
      limit
    });
  }

  // Get recent orders
  async getRecentOrders(limit: number = 10): Promise<Order[]> {
    return apiService.get<Order[]>(`${this.baseUrl}/recent?limit=${limit}`);
  }

  // Get orders by customer
  async getOrdersByCustomer(userId: string, page: number = 1, limit: number = 10): Promise<OrdersResponse> {
    return apiService.getWithParams<OrdersResponse>(`${this.baseUrl}/customer/${userId}`, {
      page,
      limit
    });
  }

  // Export orders
  async exportOrders(filters: OrderFilters = {}): Promise<void> {
    const params = new URLSearchParams(filters as any).toString();
    return apiService.download(`${this.baseUrl}/export?${params}`, 'orders.xlsx');
  }

  // Get order invoice
  async getOrderInvoice(id: string): Promise<void> {
    return apiService.download(`${this.baseUrl}/${id}/invoice`, `invoice-${id}.pdf`);
  }

  // Send order confirmation email
  async sendOrderConfirmation(id: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/${id}/send-confirmation`);
  }

  // Send shipping notification
  async sendShippingNotification(id: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/${id}/send-shipping-notification`);
  }

  // Get order timeline/history
  async getOrderTimeline(id: string): Promise<Array<{
    timestamp: Date;
    status: string;
    description: string;
    user?: string;
  }>> {
    return apiService.get(`${this.baseUrl}/${id}/timeline`);
  }

  // Bulk update order status
  async bulkUpdateStatus(orderIds: string[], status: OrderStatus, notes?: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/bulk-status-update`, {
      orderIds,
      status,
      notes
    });
  }

  // Get orders requiring attention
  async getOrdersRequiringAttention(): Promise<Order[]> {
    return apiService.get<Order[]>(`${this.baseUrl}/requiring-attention`);
  }

  // Calculate order totals
  async calculateOrderTotals(items: Array<{ productId: string; variantSku?: string; quantity: number }>, 
                           shippingAddressId?: string, 
                           couponCode?: string, 
                           pointsToUse?: number): Promise<{
    subtotal: number;
    taxAmount: number;
    shippingAmount: number;
    discountAmount: number;
    totalAmount: number;
    pointsDiscount: number;
  }> {
    return apiService.post(`${this.baseUrl}/calculate-totals`, {
      items,
      shippingAddressId,
      couponCode,
      pointsToUse
    });
  }

  // Verify order payment
  async verifyPayment(orderId: string, paymentTransactionId: string): Promise<{ verified: boolean; amount: number }> {
    return apiService.post(`${this.baseUrl}/${orderId}/verify-payment`, {
      paymentTransactionId
    });
  }
}

export const orderService = new OrderService();
export default orderService;