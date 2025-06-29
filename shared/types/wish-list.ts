export interface WishList {
  id: string; // UUID
  userId: string; // User ID (UUID)
  productId: string; // Product ID (UUID)
  addedAt: Date;
  priority: number; // 1-5
  notes?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
