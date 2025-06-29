export interface Inventory {
  id: string; // UUID
  productId: string; // Product ID (UUID)
  branchId: string; // Branch ID (UUID)
  quantity: number;
  reservedQuantity: number;
  readonly availableQuantity: number; // VIRTUAL field
  minStockLevel: number;
  maxStockLevel?: number | null;
  reorderPoint: number;
  costPrice?: number | null; // Decimal (10, 3)
  lastRestockedAt?: Date | null;
  lastSoldAt?: Date | null;
  isActive: boolean;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
