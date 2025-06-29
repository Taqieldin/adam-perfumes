export enum CartStatus {
  ACTIVE = 'active',
  ABANDONED = 'abandoned',
  CONVERTED = 'converted',
  EXPIRED = 'expired',
}

export interface Cart {
  id: string; // UUID
  userId: string; // User ID (UUID)
  sessionId?: string | null; // Session ID for guest carts
  itemCount: number;
  totalQuantity: number;
  subtotal: number; // Decimal (10, 2)
  discountAmount: number; // Decimal (10, 2)
  taxAmount: number; // Decimal (10, 2)
  totalAmount: number; // Decimal (10, 2)
  currency: 'OMR';
  appliedCoupons: string[];
  pointsToUse: number;
  pointsValue: number; // Decimal (10, 2)
  walletAmountToUse: number; // Decimal (10, 2)
  shippingAddressId?: string | null; // Address ID (UUID)
  shippingMethod?: string | null;
  shippingCost: number; // Decimal (10, 2)
  isPickup: boolean;
  pickupBranchId?: string | null; // Branch ID (UUID)
  status: CartStatus;
  lastActivityAt: Date;
  abandonedAt?: Date | null;
  convertedAt?: Date | null;
  orderId?: string | null; // Order ID if converted
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}
