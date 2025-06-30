import { Inventory } from '../../../../shared/types/inventory';
import { BranchInventory } from '../../../../shared/types/branch-inventory';
import { apiService } from './apiService';

export interface InventoryFilters {
  search?: string;
  productId?: string;
  branchId?: string;
  categoryId?: string;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'overstock';
  minQuantity?: number;
  maxQuantity?: number;
  lastUpdatedFrom?: Date;
  lastUpdatedTo?: Date;
  sortBy?: 'productName' | 'quantity' | 'lastUpdated' | 'value';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface InventoryResponse {
  inventory: (Inventory | BranchInventory)[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StockAdjustment {
  productId: string;
  variantSku?: string;
  branchId?: string;
  quantityChange: number;
  type: 'increase' | 'decrease' | 'set';
  reason: string;
  notes?: string;
  cost?: number;
}

export interface StockTransfer {
  productId: string;
  variantSku?: string;
  fromBranchId: string;
  toBranchId: string;
  quantity: number;
  reason: string;
  notes?: string;
}

export interface InventoryStats {
  totalProducts: number;
  totalValue: number;
  inStockProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  overstockProducts: number;
  averageStockLevel: number;
  inventoryTurnover: number;
  stockAccuracy: number;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  variantSku?: string;
  branchId?: string;
  branchName?: string;
  currentStock: number;
  threshold: number;
  alertType: 'low_stock' | 'out_of_stock' | 'overstock';
  createdAt: Date;
  acknowledged: boolean;
}

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  variantSku?: string;
  branchId?: string;
  branchName?: string;
  type: 'sale' | 'purchase' | 'adjustment' | 'transfer' | 'return' | 'damage';
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  notes?: string;
  referenceId?: string; // Order ID, Transfer ID, etc.
  createdAt: Date;
  createdBy: string;
}

export interface StockCount {
  id: string;
  branchId?: string;
  branchName?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: Date;
  startedAt?: Date;
  completedAt?: Date;
  items: Array<{
    productId: string;
    productName: string;
    variantSku?: string;
    systemQuantity: number;
    countedQuantity?: number;
    variance?: number;
    notes?: string;
  }>;
  totalItems: number;
  countedItems: number;
  totalVariance: number;
  createdBy: string;
  createdAt: Date;
}

class InventoryService {
  private readonly baseUrl = '/admin/inventory';

  // Get inventory with filters
  async getInventory(filters: InventoryFilters = {}): Promise<InventoryResponse> {
    return apiService.getWithParams<InventoryResponse>(this.baseUrl, filters);
  }

  // Get inventory for specific product
  async getProductInventory(productId: string, branchId?: string): Promise<Inventory | BranchInventory> {
    const url = branchId 
      ? `${this.baseUrl}/product/${productId}/branch/${branchId}`
      : `${this.baseUrl}/product/${productId}`;
    return apiService.get(url);
  }

  // Get inventory for specific branch
  async getBranchInventory(branchId: string, filters: Omit<InventoryFilters, 'branchId'> = {}): Promise<InventoryResponse> {
    return apiService.getWithParams<InventoryResponse>(`${this.baseUrl}/branch/${branchId}`, filters);
  }

  // Adjust stock
  async adjustStock(adjustment: StockAdjustment): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/adjust`, adjustment);
  }

  // Bulk adjust stock
  async bulkAdjustStock(adjustments: StockAdjustment[]): Promise<{
    successful: number;
    failed: number;
    errors: Array<{ index: number; error: string }>;
  }> {
    return apiService.post(`${this.baseUrl}/bulk-adjust`, { adjustments });
  }

  // Transfer stock between branches
  async transferStock(transfer: StockTransfer): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/transfer`, transfer);
  }

  // Get stock transfers
  async getStockTransfers(page: number = 1, limit: number = 20, status?: 'pending' | 'completed' | 'cancelled'): Promise<{
    transfers: Array<StockTransfer & {
      id: string;
      status: 'pending' | 'completed' | 'cancelled';
      createdAt: Date;
      completedAt?: Date;
    }>;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params: any = { page, limit };
    if (status) params.status = status;
    
    return apiService.getWithParams(`${this.baseUrl}/transfers`, params);
  }

  // Complete stock transfer
  async completeStockTransfer(transferId: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/transfers/${transferId}/complete`);
  }

  // Cancel stock transfer
  async cancelStockTransfer(transferId: string, reason: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/transfers/${transferId}/cancel`, { reason });
  }

  // Get inventory statistics
  async getInventoryStats(branchId?: string): Promise<InventoryStats> {
    const params = branchId ? { branchId } : {};
    return apiService.getWithParams<InventoryStats>(`${this.baseUrl}/stats`, params);
  }

  // Get stock alerts
  async getStockAlerts(acknowledged?: boolean): Promise<StockAlert[]> {
    const params = acknowledged !== undefined ? { acknowledged } : {};
    return apiService.getWithParams<StockAlert[]>(`${this.baseUrl}/alerts`, params);
  }

  // Acknowledge stock alert
  async acknowledgeStockAlert(alertId: string): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/alerts/${alertId}/acknowledge`);
  }

  // Get inventory movements
  async getInventoryMovements(filters: {
    productId?: string;
    branchId?: string;
    type?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    movements: InventoryMovement[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return apiService.getWithParams(`${this.baseUrl}/movements`, filters);
  }

  // Get low stock products
  async getLowStockProducts(branchId?: string): Promise<Array<{
    productId: string;
    productName: string;
    variantSku?: string;
    currentStock: number;
    threshold: number;
    branchId?: string;
    branchName?: string;
  }>> {
    const params = branchId ? { branchId } : {};
    return apiService.getWithParams(`${this.baseUrl}/low-stock`, params);
  }

  // Get out of stock products
  async getOutOfStockProducts(branchId?: string): Promise<Array<{
    productId: string;
    productName: string;
    variantSku?: string;
    branchId?: string;
    branchName?: string;
    lastSaleDate?: Date;
  }>> {
    const params = branchId ? { branchId } : {};
    return apiService.getWithParams(`${this.baseUrl}/out-of-stock`, params);
  }

  // Get overstock products
  async getOverstockProducts(branchId?: string): Promise<Array<{
    productId: string;
    productName: string;
    variantSku?: string;
    currentStock: number;
    averageMonthlySales: number;
    monthsOfStock: number;
    branchId?: string;
    branchName?: string;
  }>> {
    const params = branchId ? { branchId } : {};
    return apiService.getWithParams(`${this.baseUrl}/overstock`, params);
  }

  // Create stock count
  async createStockCount(data: {
    branchId?: string;
    scheduledDate: Date;
    productIds?: string[];
    categoryIds?: string[];
    includeAllProducts?: boolean;
  }): Promise<StockCount> {
    return apiService.post<StockCount>(`${this.baseUrl}/stock-counts`, data);
  }

  // Get stock counts
  async getStockCounts(branchId?: string, status?: string): Promise<StockCount[]> {
    const params: any = {};
    if (branchId) params.branchId = branchId;
    if (status) params.status = status;
    
    return apiService.getWithParams<StockCount[]>(`${this.baseUrl}/stock-counts`, params);
  }

  // Get stock count details
  async getStockCount(countId: string): Promise<StockCount> {
    return apiService.get<StockCount>(`${this.baseUrl}/stock-counts/${countId}`);
  }

  // Start stock count
  async startStockCount(countId: string): Promise<StockCount> {
    return apiService.post<StockCount>(`${this.baseUrl}/stock-counts/${countId}/start`);
  }

  // Update stock count item
  async updateStockCountItem(countId: string, productId: string, data: {
    variantSku?: string;
    countedQuantity: number;
    notes?: string;
  }): Promise<void> {
    return apiService.patch<void>(`${this.baseUrl}/stock-counts/${countId}/items/${productId}`, data);
  }

  // Complete stock count
  async completeStockCount(countId: string, applyAdjustments: boolean = true): Promise<StockCount> {
    return apiService.post<StockCount>(`${this.baseUrl}/stock-counts/${countId}/complete`, {
      applyAdjustments
    });
  }

  // Cancel stock count
  async cancelStockCount(countId: string, reason: string): Promise<StockCount> {
    return apiService.post<StockCount>(`${this.baseUrl}/stock-counts/${countId}/cancel`, { reason });
  }

  // Export inventory report
  async exportInventory(filters: InventoryFilters = {}, format: 'xlsx' | 'csv' = 'xlsx'): Promise<void> {
    const params = new URLSearchParams({ ...filters as any, format }).toString();
    return apiService.download(`${this.baseUrl}/export?${params}`, `inventory.${format}`);
  }

  // Import inventory updates
  async importInventoryUpdates(file: File): Promise<{
    successful: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
  }> {
    return apiService.upload(`${this.baseUrl}/import`, file);
  }

  // Get inventory valuation
  async getInventoryValuation(branchId?: string, method: 'fifo' | 'lifo' | 'average' = 'average'): Promise<{
    totalValue: number;
    totalQuantity: number;
    averageCost: number;
    byCategory: Array<{
      categoryId: string;
      categoryName: string;
      value: number;
      quantity: number;
      percentage: number;
    }>;
    byProduct: Array<{
      productId: string;
      productName: string;
      quantity: number;
      unitCost: number;
      totalValue: number;
    }>;
  }> {
    const params: any = { method };
    if (branchId) params.branchId = branchId;
    
    return apiService.getWithParams(`${this.baseUrl}/valuation`, params);
  }

  // Get inventory turnover report
  async getInventoryTurnover(branchId?: string, period: 'monthly' | 'quarterly' | 'yearly' = 'monthly'): Promise<Array<{
    productId: string;
    productName: string;
    averageInventory: number;
    costOfGoodsSold: number;
    turnoverRatio: number;
    daysInInventory: number;
    category: string;
  }>> {
    const params: any = { period };
    if (branchId) params.branchId = branchId;
    
    return apiService.getWithParams(`${this.baseUrl}/turnover`, params);
  }

  // Set reorder points
  async setReorderPoints(updates: Array<{
    productId: string;
    variantSku?: string;
    branchId?: string;
    reorderPoint: number;
    reorderQuantity: number;
  }>): Promise<void> {
    return apiService.post<void>(`${this.baseUrl}/reorder-points`, { updates });
  }

  // Get reorder suggestions
  async getReorderSuggestions(branchId?: string): Promise<Array<{
    productId: string;
    productName: string;
    variantSku?: string;
    currentStock: number;
    reorderPoint: number;
    suggestedQuantity: number;
    averageMonthlySales: number;
    leadTime: number;
    supplier?: string;
  }>> {
    const params = branchId ? { branchId } : {};
    return apiService.getWithParams(`${this.baseUrl}/reorder-suggestions`, params);
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;